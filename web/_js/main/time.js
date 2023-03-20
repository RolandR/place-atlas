/*
	========================================================================
	The 2017 r/place Atlas

	An atlas of Reddit's 2017 r/place, with information to each
	artwork	of the canvas provided by the community.

	Copyright (c) 2017 Roland Rytz <roland@draemm.li>
	Copyright (c) 2022 Place Atlas contributors

	Licensed under the GNU Affero General Public License Version 3
	https://2017.place-atlas.stefanocoding.me/license.txt
	========================================================================
*/

const codeReference = {}
const imageCache = {}

const variantsEl = document.getElementById("variants")

for (const variation in variationsConfig) {
	codeReference[variationsConfig[variation].code] = variation
	const optionEl = document.createElement('option')
	optionEl.value = variation
	optionEl.textContent = variationsConfig[variation].name
	variantsEl.appendChild(optionEl)
}

const timelineSlider = document.getElementById("timeControlsSlider")
const timelineList = document.getElementById("timeControlsList")
const tooltip = document.getElementById("timeControlsTooltip")
const image = document.getElementById("image")
let abortController = new AbortController()
let currentUpdateIndex = 0
let updateTimeout = setTimeout(null, 0)
let tooltipDelayHide = setTimeout(null, 0)

let currentVariation = "default"
const defaultPeriod = variationsConfig[currentVariation].default
const defaultVariation = currentVariation
let currentPeriod = defaultPeriod
window.currentPeriod = currentPeriod
window.currentVariation = currentVariation

// SETUP
timelineSlider.max = variationsConfig[currentVariation].versions.length - 1
timelineSlider.value = currentPeriod
timelineList.children[0].value = defaultPeriod

timelineSlider.addEventListener("input", (e) => timelineParser(e.target.value))

timelineSlider.addEventListener("wheel", function (e) {
	if (e.deltaY < 0) {
		this.valueAsNumber += 1;
		timelineParser(this.value)
	} else {
		this.value -= 1;
		timelineParser(this.value)
	}
	e.stopPropagation();
}, { passive: true })

function timelineParser(value) {
	updateTooltip(parseInt(value), currentVariation)
	clearTimeout(updateTimeout)
	updateTimeout = setTimeout(() => {
		updateTime(parseInt(timelineSlider.value), currentVariation)
		setTimeout(() => {
			if (timelineSlider.value !== currentPeriod && abortController.signal.aborted) {
				updateTime(parseInt(timelineSlider.value), currentVariation)
			}
		}, 50)
	}, 25)
}

variantsEl.addEventListener("input", (event) => {
	updateTime(-1, event.target.value)
})

const dispatchTimeUpdateEvent = (period = currentPeriod, variation = currentVariation, atlas = atlas) => {
	const timeUpdateEvent = new CustomEvent('timeupdate', {
		detail: {
			period: period,
			variation: variation,
			periodString: formatPeriod(period, period, variation),
			atlas: atlas
		}
	})
	document.dispatchEvent(timeUpdateEvent)
}

async function updateBackground(newPeriod = currentPeriod, newVariation = currentVariation) {
	abortController.abort()
	abortController = new AbortController()
	currentUpdateIndex++
	const myUpdateIndex = currentUpdateIndex
	const variationConfig = variationsConfig[newVariation]

	variantsEl.value = currentVariation
	if (variationConfig.icon) {
		variantsEl.previousElementSibling.innerHTML = variationConfig.icon
		variantsEl.previousElementSibling.classList.remove('d-none')
		variantsEl.parentElement.classList.add('input-group')
	} else {
		variantsEl.previousElementSibling.innerHTML = ""
		variantsEl.previousElementSibling.classList.add('d-none')
		variantsEl.parentElement.classList.remove('input-group')
	}

	const configObject = variationConfig.versions[currentPeriod]
	if (typeof configObject.url === "string") {
		if (imageCache[configObject.url] === undefined) {
			const fetchResult = await fetch(configObject.url, {
				signal: abortController.signal
			})
			if (currentUpdateIndex !== myUpdateIndex) {
				return [configObject, newPeriod, newVariation]
			}
			const imageBlob = await fetchResult.blob()
			imageCache[configObject.url] = URL.createObjectURL(imageBlob)
		}
		image.src = imageCache[configObject.url]
	} else {
		const canvas = document.createElement('canvas')
		const context = canvas.getContext('2d')
		context.canvas.width = canvasSize.x
		context.canvas.height = canvasSize.y
		await Promise.all(configObject.url.map(async url => {
			if (imageCache[url] === undefined) {
				const fetchResult = await fetch(url, {
					signal: abortController.signal
				})
				if (currentUpdateIndex !== myUpdateIndex) {
					return
				}
				const imageBlob = await fetchResult.blob()
				imageCache[url] = URL.createObjectURL(imageBlob)
			}
		}))
		for await (const url of configObject.url) {
			const imageLayer = new Image()
			await new Promise(resolve => {
				imageLayer.onload = () => {
					context.drawImage(imageLayer, 0, 0)
					resolve()
				}
				imageLayer.src = imageCache[url]
			})
		}

		if (currentUpdateIndex !== myUpdateIndex) return [configObject, newPeriod, newVariation]
		const blob = await new Promise(resolve => canvas.toBlob(resolve))
		image.src = URL.createObjectURL(blob)
	}
}

async function updateTime(newPeriod = currentPeriod, newVariation = currentVariation, forcePeriod = false) {
	document.body.dataset.canvasLoading = ""

	if (!variationsConfig[newVariation]) newVariation = defaultVariation
	const variationConfig = variationsConfig[newVariation]

	if (newPeriod < 0) newPeriod = 0
	else if (newPeriod > variationConfig.versions.length - 1) newPeriod = variationConfig.versions.length - 1

	currentPeriod = newPeriod
	if (currentVariation !== newVariation) {
		currentVariation = newVariation
		timelineSlider.max = variationConfig.versions.length - 1
		if (!forcePeriod) {
			currentPeriod = variationConfig.default
			newPeriod = currentPeriod
		}
		if (variationConfig.versions.length === 1) bottomBar.classList.add('no-time-slider')
		else bottomBar.classList.remove('no-time-slider')
	}
	timelineSlider.value = currentPeriod
	updateTooltip(newPeriod, newVariation)

	await updateBackground(newPeriod, newVariation)

	atlas = []
	for (const atlasIndex in atlasAll) {
		let chosenIndex

		const validPeriods2 = Object.keys(atlasAll[atlasIndex].path)

		for (const i in validPeriods2) {
			const validPeriods = validPeriods2[i].split(', ')
			for (const j in validPeriods) {
				const [start, end, variation] = parsePeriod(validPeriods[j])
				if (isOnPeriod(start, end, variation, newPeriod, newVariation)) {
					chosenIndex = i
					break
				}
			}
			if (chosenIndex !== undefined) break
		}

		if (chosenIndex === undefined) continue
		const pathChosen = Object.values(atlasAll[atlasIndex].path)[chosenIndex]
		const centerChosen = Object.values(atlasAll[atlasIndex].center)[chosenIndex]

		if (pathChosen === undefined) continue

		atlas.push({
			...atlasAll[atlasIndex],
			path: pathChosen,
			center: centerChosen,
		})
	}

	dispatchTimeUpdateEvent(newPeriod, newVariation, atlas)
	delete document.body.dataset.canvasLoading
	tooltip.dataset.forceVisible = ""
	clearTimeout(tooltipDelayHide)
	tooltipDelayHide = setTimeout(() => {
		delete tooltip.dataset.forceVisible
	}, 1000)

}

function updateTooltip(newPeriod, newVariation) {
	const configObject = variationsConfig[newVariation].versions[newPeriod]

	// If timestap is a number return a UTC formatted date otherwise use exact timestap label
	if (typeof configObject.timestamp === "number") tooltip.querySelector('div').textContent = new Date(configObject.timestamp * 1000).toUTCString()
	else tooltip.querySelector('div').textContent = configObject.timestamp

	// Clamps position of tooltip to prevent from going off screen
	const timelineSliderRect = timelineSlider.getBoundingClientRect()
	let min = -timelineSliderRect.left + 12
	let max = (window.innerWidth - tooltip.offsetWidth) - timelineSliderRect.left + 4
	tooltip.style.left = Math.min(Math.max((timelineSlider.offsetWidth) * (timelineSlider.value) / (timelineSlider.max) - tooltip.offsetWidth / 2, min), max) + "px"
}

tooltip.parentElement.addEventListener('mouseenter', () => updateTooltip(parseInt(timelineSlider.value), currentVariation))

window.addEventListener('resize', () => updateTooltip(parseInt(timelineSlider.value), currentVariation))

function isOnPeriod(start, end, variation, currentPeriod, currentVariation) {
	if (start > end) [start, end] = [end, start]
	return currentPeriod >= start && currentPeriod <= end && variation === currentVariation
}

function parsePeriod(periodString) {
	let variation = defaultVariation
	periodString = periodString + ""
	if (periodString.split(':').length > 1) {
		const split = periodString.split(':')
		variation = codeReference[split[0]]
		periodString = split[1]
	}
	if (periodString.search('-') + 1) {
		let [start, end] = periodString.split('-').map(i => parseInt(i))
		if (start > end) [start, end] = [end, start]
		return [start, end, variation]
	} else if (codeReference[periodString]) {
		variation = codeReference[periodString]
		const defaultPeriod = variationsConfig[variation].default
		return [defaultPeriod, defaultPeriod, variation]
	} else {
		const periodNew = parseInt(periodString)
		return [periodNew, periodNew, variation]
	}
}

function formatPeriod(start, end, variation) {
	start ??= currentPeriod
	end ??= currentPeriod
	variation ??= currentVariation

	let periodString, variationString
	variationString = variationsConfig[variation].code
	if (start > end) [start, end] = [end, start]
	if (start === end) {
		if (start === variationsConfig[variation].default && variation !== defaultVariation) {
			periodString = ""
		}
		else periodString = start
	}
	else periodString = start + "-" + end
	if (periodString && variationString) return variationsConfig[variation].code + ":" + periodString
	if (variationString) return variationString
	return periodString
}

function formatHash(id, start, end, variation) {
	start ??= currentPeriod
	end ??= currentPeriod
	variation ??= currentVariation
	
	const result = [id]
	const targetPeriod = formatPeriod(start, end, variation)
	if (targetPeriod && targetPeriod !== defaultPeriod) result.push(targetPeriod)
	if (!result.some(el => el || el === 0)) return ''
	return '#' + result.join('/')
}
