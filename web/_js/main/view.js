/*!
 * The 2017 r/place Atlas
 * Copyright (c) 2017 Roland Rytz <roland@draemm.li>
 * Copyright (c) 2022 Place Atlas contributors
 * Licensed under AGPL-3.0 (https://2017.place-atlas.stefanocoding.me/license.txt)
 */

const linesCanvas = document.getElementById("linesCanvas")
const linesContext = linesCanvas.getContext("2d")
let hovered = []

let previousScaleZoomOrigin
let previousZoom

const backgroundCanvas = document.createElement("canvas")
backgroundCanvas.width = canvasSize.x
backgroundCanvas.height = canvasSize.y
const backgroundContext = backgroundCanvas.getContext("2d")

const wrapper = document.getElementById("wrapper")
const bottomBar = document.getElementById("bottomBar")

const showListButton = document.getElementById("showListButton")
const offcanvasList = document.getElementById("offcanvasList")
const bsOffcanvasList = new bootstrap.Offcanvas(offcanvasList)

const offcanvasDraw = document.getElementById("offcanvasDraw")
const bsOffcanvasDraw = new bootstrap.Offcanvas(offcanvasDraw)

const objectsContainer = document.getElementById("objectsList")
const closeObjectsListButton = document.getElementById("closeObjectsListButton")
const objectsListOverflowNotice = document.getElementById("objectsListOverflowNotice")

const searchInput = document.getElementById("searchList")
const sortInput = document.getElementById("sort")

const entriesList = document.getElementById("entriesList")
let entriesListShown = false

const drawButton = document.getElementById("drawLink")
const objectEditNav = document.createElement("a")
objectEditNav.className = "btn btn-outline-primary"
objectEditNav.id = "objectEditNav"
objectEditNav.textContent = "Edit"

let atlasDisplay

const entriesLimit = 50
let entriesOffset = 0

const moreEntriesButton = document.createElement("button")
moreEntriesButton.innerHTML = "Show " + entriesLimit + " more"
moreEntriesButton.type = "button"
moreEntriesButton.className = "btn btn-primary d-block mb-2 mx-auto"
moreEntriesButton.id = "moreEntriesButton"
let showMoreEntries = () => {}

const moreEntriesObserver = new IntersectionObserver(entries => {
	for (const entry of entries) {
		if (!entry.isIntersecting) continue
		showMoreEntries()
		break
	}
})

moreEntriesObserver.observe(moreEntriesButton)

let defaultSort = sortInput.value 

let lastPos = [0, 0]

let fixed = false; // Fix hovered items in place, so that clicking on links is possible

searchInput.addEventListener("input", function () {
	resetEntriesList()
})

sortInput.addEventListener("input", function () {
	resetEntriesList()
})

offcanvasDraw.addEventListener('show.bs.offcanvas', () => {
	wrapper.classList.remove('listHidden')
	wrapper.classList.add('listTransitioning')
	applyView()
})

offcanvasDraw.addEventListener('shown.bs.offcanvas', () => {
	wrapper.classList.remove('listTransitioning')
	applyView()
})

offcanvasDraw.addEventListener('hide.bs.offcanvas', () => {
	wrapper.classList.add('listHidden')
	wrapper.classList.add('listTransitioning')
	applyView()
})

offcanvasDraw.addEventListener('hidden.bs.offcanvas', () => {
	wrapper.classList.remove('listTransitioning')
	applyView()
})

offcanvasList.addEventListener('show.bs.offcanvas', () => {
	wrapper.classList.remove('listHidden')
	wrapper.classList.add('listTransitioning')
	applyView()
})

offcanvasList.addEventListener('shown.bs.offcanvas', e => {
	entriesListShown = true
	wrapper.classList.remove('listTransitioning')
	updateHovering(e)
	applyView()
	render()
	updateLines()
})

offcanvasList.addEventListener('hide.bs.offcanvas', () => {
	wrapper.classList.add('listHidden')
	wrapper.classList.add('listTransitioning')
	applyView()
})

offcanvasList.addEventListener('hidden.bs.offcanvas', e => {
	entriesListShown = false
	wrapper.classList.remove('listTransitioning')
	updateHovering(e)
	applyView()
	render()
	updateLines()
})

closeObjectsListButton.addEventListener("click", clearObjectsList)

bottomBar.addEventListener("mouseover", () => {
	if (!fixed) clearObjectsList()
})

function clearObjectsList() {
	closeObjectsListButton.classList.add("d-none")
	objectsListOverflowNotice.classList.add("d-none")
	entriesList.classList.remove("disableHover")
	hovered = []
	objectsContainer.replaceChildren()
	updateLines()
	fixed = false
	render()
	objectEditNav.remove()
	updateHash(false)
	document.title = pageTitle
}

function toggleFixed(e, tapped) {
	if (!fixed && hovered.length === 0) {
		entriesList.classList.remove("disableHover")
		return 0
	}
	fixed = !fixed
	if (!fixed) {
		updateHovering(e, tapped)
		render()
	}
	entriesList.classList.add("disableHover")
	objectsListOverflowNotice.classList.add("d-none")
}

window.addEventListener("resize", updateLines)
window.addEventListener("mousemove", updateLines)
window.addEventListener("dblClick", updateLines)
window.addEventListener("wheel", updateLines)

objectsContainer.addEventListener("scroll", () => {
	updateLines()
})

window.addEventListener("resize", () => {

	applyView()
	render()
	updateLines()

})

function updateLines() {

	// Line border
	linesCanvas.width = linesCanvas.clientWidth
	linesCanvas.height = linesCanvas.clientHeight
	linesContext.lineCap = "round"
	linesContext.lineWidth = Math.max(Math.min(zoom * 1.5, 16 * 1.5), 6)
	linesContext.strokeStyle = "#222"

	for (let i = 0; i < hovered.length; i++) {
		const element = hovered[i].element

		if (element.getBoundingClientRect().left !== 0) {

			linesContext.beginPath()
			// Align line based on which side the card is on
			if ((element.getBoundingClientRect().left + element.clientWidth / 2) < (document.documentElement.clientWidth / 2)) {
				linesContext.moveTo(
					element.getBoundingClientRect().left + document.documentElement.scrollLeft + element.clientWidth - 5,
					element.getBoundingClientRect().top + document.documentElement.scrollTop + 20
				)
			} else {
				linesContext.moveTo(
					element.getBoundingClientRect().left + document.documentElement.scrollLeft + 5,
					element.getBoundingClientRect().top + document.documentElement.scrollTop + 20
				)
			}
			linesContext.lineTo(
				~~((hovered[i].center[0] - canvasOffset.x) * zoom) + innerContainer.offsetLeft,
				~~((hovered[i].center[1] - canvasOffset.y) * zoom) + innerContainer.offsetTop
			)
			linesContext.stroke()
		}
	}

	// Line body
	linesContext.lineWidth = Math.max(Math.min(zoom, 16), 4)
	linesContext.strokeStyle = "#FFFFFF"

	for (let i = 0; i < hovered.length; i++) {
		const element = hovered[i].element

		if (element.getBoundingClientRect().left !== 0) {

			linesContext.beginPath()
			// Align line based on which side the card is on
			if ((element.getBoundingClientRect().left + element.clientWidth / 2) < (document.documentElement.clientWidth / 2)) {
				linesContext.moveTo(
					element.getBoundingClientRect().left + document.documentElement.scrollLeft + element.clientWidth - 5,
					element.getBoundingClientRect().top + document.documentElement.scrollTop + 20
				)
			} else {
				linesContext.moveTo(
					element.getBoundingClientRect().left + document.documentElement.scrollLeft + 5,
					element.getBoundingClientRect().top + document.documentElement.scrollTop + 20
				)
			}
			linesContext.lineTo(
				~~((hovered[i].center[0] - canvasOffset.x) * zoom) + innerContainer.offsetLeft,
				~~((hovered[i].center[1] - canvasOffset.y) * zoom) + innerContainer.offsetTop
			)
			linesContext.stroke()
		}
	}
}

function renderBackground(atlas) {

	backgroundContext.clearRect(0, 0, highlightCanvas.width, highlightCanvas.height)

	//backgroundCanvas.width = 1000 * zoom
	//backgroundCanvas.height = 1000 * zoom

	//backgroundContext.lineWidth = zoom

	backgroundContext.fillStyle = "rgba(0, 0, 0, 0.6)"
	backgroundContext.fillRect(0, 0, backgroundCanvas.width, backgroundCanvas.height)

	for (let i = 0; i < atlas.length; i++) {

		const path = atlas[i].path

		backgroundContext.beginPath()

		if (path[0]) {
			//backgroundContext.moveTo(path[0][0]*zoom, path[0][1]*zoom)
			backgroundContext.moveTo(path[0][0] - canvasOffset.x, path[0][1] - canvasOffset.y)
		}

		for (let p = 1; p < path.length; p++) {
			//backgroundContext.lineTo(path[p][0]*zoom, path[p][1]*zoom)
			backgroundContext.lineTo(path[p][0] - canvasOffset.x, path[p][1] - canvasOffset.y)
		}

		backgroundContext.closePath()

		let bgStrokeStyle
		switch (atlas[i].diff) {
			case "add":
				bgStrokeStyle = "rgba(0, 255, 0, 1)"
				backgroundContext.lineWidth = 2
				break
			case "edit":
				bgStrokeStyle = "rgba(255, 255, 0, 1)"
				backgroundContext.lineWidth = 2
				break
			case "delete":
				bgStrokeStyle = "rgba(255, 0, 0, 1)"
				backgroundContext.lineWidth = 2
				break
			default:
				bgStrokeStyle = "rgba(255, 255, 255, 0.8)"
				break
		}
		backgroundContext.strokeStyle = bgStrokeStyle
		backgroundContext.stroke()
		backgroundContext.lineWidth = 1
	}
}

function buildObjectsList(filter, sort) {

	atlasDisplay = atlas.slice()

	if (filter) {
		atlasDisplay = atlas.filter(entry => {
			return (
				entry.name.toLowerCase().includes(filter.toLowerCase())
				|| entry.description?.toLowerCase().includes(filter.toLowerCase())
				|| Object.values(entry.links).flat().some(str => str.toLowerCase().includes(filter))
				|| entry.id.toString() === filter
			)
		})
		document.getElementById("atlasSize").innerHTML = "Found " + atlasDisplay.length + " entries."
	} else {
		document.getElementById("atlasSize").innerHTML = "The Atlas contains " + atlasDisplay.length + " entries."
	}

	renderBackground(atlasDisplay)
	render()

	sort ||= defaultSort
	document.getElementById("sort").value = sort

	//console.log(sort)

	let sortFunction

	//console.log(sort)

	switch (sort) {
		case "shuffle":
			sortFunction = null
			if (entriesOffset === 0) {
				shuffle()
			}
			break
		case "alphaAsc":
			sortFunction = (a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase())
			break
		case "alphaDesc":
			sortFunction = (a, b) => b.name.toLowerCase().localeCompare(a.name.toLowerCase())
			break
		case "newest":
			sortFunction = (a, b) => b._index - a._index
			break
		case "oldest":
			sortFunction = (a, b) => a._index - b._index
			break
		case "area":
			sortFunction = (a, b) => calcPolygonArea(b.path) - calcPolygonArea(a.path)
			break
		case "relevant":
			sortFunction = (a, b) => {
				if (a.name.toLowerCase().includes(filter) && b.name.toLowerCase().includes(filter)) {
					return a.name.toLowerCase().indexOf(filter) - b.name.toLowerCase().indexOf(filter) || a.name.toLowerCase().localeCompare(b.name.toLowerCase())
				} else if (a.name.toLowerCase().includes(filter)) {
					return -1
				} else if (b.name.toLowerCase().includes(filter)) {
					return 1
				} else {
					return a.description.toLowerCase().indexOf(filter) - b.description.toLowerCase().indexOf(filter) || a.name.toLowerCase().localeCompare(b.name.toLowerCase())
				}
			}
			break
	}

	if (sortFunction) {
		atlasDisplay.sort(sortFunction)
	}

	moreEntriesButton.removeEventListener('click', showMoreEntries)
	showMoreEntries = () => {

		if (entriesList.contains(moreEntriesButton)) {
			entriesList.removeChild(moreEntriesButton)
		}	

		for (let i = entriesOffset; i < entriesOffset + entriesLimit; i++) {

			if (i >= atlasDisplay.length) break
	
			const element = createInfoBlock(atlasDisplay[i])
			const entry = atlasDisplay[i]
	
			element.addEventListener("mouseenter", function () {
				if (fixed || dragging) return
				objectsContainer.replaceChildren()
	
				previousScaleZoomOrigin ??= [...scaleZoomOrigin]
				previousZoom ??= zoom
				setView(entry.center[0], entry.center[1], setZoomByPath(entry.path))
	
				hovered = [entry]
				render()
				hovered[0].element = this
				updateLines()
	
			})
	
			element.addEventListener("click", e => {
				toggleFixed(e)
				if (!fixed) return
				previousScaleZoomOrigin ??= [...scaleZoomOrigin]
				previousZoom ??= zoom
				applyView()
			})
	
			element.addEventListener("mouseleave", () => {
				if (fixed || dragging) return
	
				scaleZoomOrigin = [...previousScaleZoomOrigin]
				zoom = previousZoom
				previousScaleZoomOrigin = undefined
				previousZoom = undefined
				applyView()
	
				hovered = []
				updateLines()
				render()
			})
	
			entriesList.appendChild(element)
	
		}
	
		entriesOffset += entriesLimit
	
		if (atlasDisplay.length > entriesOffset) {
			moreEntriesButton.innerHTML = "Show " + Math.min(entriesLimit, atlasDisplay.length - entriesOffset) + " more"
			entriesList.appendChild(moreEntriesButton)
		}
	
	}
	moreEntriesButton.addEventListener('click', showMoreEntries)
	showMoreEntries()

}

function shuffle() {
	//console.log("shuffled atlas")
	for (let i = atlasDisplay.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1))
		const temp = atlasDisplay[i]
		atlasDisplay[i] = atlasDisplay[j]
		atlasDisplay[j] = temp
	}
}

function resetEntriesList() {
	entriesOffset = 0
	entriesList.replaceChildren()
	entriesList.appendChild(moreEntriesButton)

	const sort = sortInput.value || defaultSort
	const search = searchInput?.value.toLowerCase()

	buildObjectsList(search, sort)
}

async function render() {

	highlightContext.clearRect(0, 0, highlightCanvas.width, highlightCanvas.height)

	//canvas.width = 1000*zoom
	//canvas.height = 1000*zoom

	highlightContext.globalCompositeOperation = "source-over"
	highlightContext.clearRect(0, 0, highlightCanvas.width, highlightCanvas.height)

	if (hovered.length > 0) {
		container.style.cursor = "pointer"
	} else {
		container.style.cursor = "default"
	}


	for (let i = 0; i < hovered.length; i++) {


		const path = hovered[i].path

		highlightContext.beginPath()

		if (path[0]) {
			//context.moveTo(path[0][0]*zoom, path[0][1]*zoom)
			highlightContext.moveTo(path[0][0] - canvasOffset.x, path[0][1] - canvasOffset.y)
		}

		for (let p = 1; p < path.length; p++) {
			//context.lineTo(path[p][0]*zoom, path[p][1]*zoom)
			highlightContext.lineTo(path[p][0] - canvasOffset.x, path[p][1] - canvasOffset.y)
		}

		highlightContext.closePath()

		highlightContext.globalCompositeOperation = "source-over"

		highlightContext.fillStyle = "rgba(0, 0, 0, 1)"
		highlightContext.fill()
	}

	highlightContext.globalCompositeOperation = "source-out"
	highlightContext.drawImage(backgroundCanvas, 0, 0)

	if (hovered.length === 1 && hovered[0].path.length && hovered[0].overrideImage) {
		const undisputableHovered = hovered[0]
		// Find the left-topmost point of all the paths
		const entryPosition = getPositionOfEntry(undisputableHovered)
		if (entryPosition) {
			const [startX, startY] = entryPosition
			const overrideImage = new Image()
			const loadingPromise = new Promise((res, rej) => {
				overrideImage.onerror = rej
				overrideImage.onload = res
			})
			overrideImage.src = "imageOverrides/" + undisputableHovered.overrideImage
			try {
				await loadingPromise
				highlightContext.globalCompositeOperation = "source-over"
				highlightContext.drawImage(overrideImage, startX, startY)
			} catch (ex) {
				console.error("Cannot override image.", ex)
			}
		}
	}

	for (let i = 0; i < hovered.length; i++) {

		const path = hovered[i].path

		highlightContext.beginPath()

		if (path[0]) {
			//context.moveTo(path[0][0]*zoom, path[0][1]*zoom)
			highlightContext.moveTo(path[0][0] - canvasOffset.x, path[0][1] - canvasOffset.y)
		}

		for (let p = 1; p < path.length; p++) {
			//context.lineTo(path[p][0]*zoom, path[p][1]*zoom)
			highlightContext.lineTo(path[p][0] - canvasOffset.x, path[p][1] - canvasOffset.y)
		}

		highlightContext.closePath()

		highlightContext.globalCompositeOperation = "source-over"

		let hoverStrokeStyle
		switch (hovered[i].diff) {
			case "add":
				hoverStrokeStyle = "rgba(0, 155, 0, 1)"
				break
			case "edit":
				hoverStrokeStyle = "rgba(155, 155, 0, 1)"
				break
			default:
				hoverStrokeStyle = "rgba(0, 0, 0, 1)"
				break
		}
		highlightContext.strokeStyle = hoverStrokeStyle
		//context.lineWidth = zoom
		highlightContext.stroke()
	}

}

function updateCoordsDisplay(e) {
	const pos = [
		(e.clientX - (container.clientWidth / 2 - innerContainer.clientWidth / 2 + zoomOrigin[0] + container.offsetLeft)) / zoom + canvasOffset.x,
		(e.clientY - (container.clientHeight / 2 - innerContainer.clientHeight / 2 + zoomOrigin[1] + container.offsetTop)) / zoom + canvasOffset.y
	]
	const coordsEl = document.getElementById("coords_p")

	// Displays coordinates as zero instead of NaN
	if (isNaN(pos[0])) {
		coordsEl.textContent = "0, 0"
	} else {
		coordsEl.textContent = Math.floor(pos[0]) + ", " + Math.floor(pos[1])
	}

	return pos
}

function updateHovering(e, tapped) {

	if (dragging || (fixed && !tapped)) return
	const pos = updateCoordsDisplay(e)

	if (!(pos[0] <= canvasSize.x + canvasOffset.x + 200 && pos[0] >= canvasOffset.x - 200 && pos[1] <= canvasSize.y + canvasOffset.y + 200 && pos[1] >= canvasOffset.x - 200)) return
	
	const newHovered = []
	for (const entry of atlasDisplay) {
		if (pointIsInPolygon(pos, entry.path)) newHovered.push(entry)
	}

	let changed = false

	if (hovered.length === newHovered.length) {
		for (let i = 0; i < hovered.length; i++) {
			if (hovered[i].id !== newHovered[i].id) {
				changed = true
				break
			}
		}
	} else {
		changed = true
	}

	if (!changed) return

	hovered = newHovered.sort(function (a, b) {
		return calcPolygonArea(a.path) - calcPolygonArea(b.path)
	})

	objectsContainer.replaceChildren()

	for (const entry of hovered) {
		const element = createInfoBlock(entry)

		objectsContainer.appendChild(element)

		entry.element = element
	}

	if (hovered.length) {
		document.getElementById("timeControlsSlider").blur()
		closeObjectsListButton.classList.remove("d-none")
		if ((objectsContainer.scrollHeight > objectsContainer.clientHeight) && !tapped) {
			objectsListOverflowNotice.classList.remove("d-none")
		} else {
			objectsListOverflowNotice.classList.add("d-none")
		}
	} else {
		closeObjectsListButton.classList.add("d-none")
		objectsListOverflowNotice.classList.add("d-none")
		entriesList.classList.remove("disableHover")
	}
	render()
}

window.addEventListener("hashchange", updateViewFromHash)

function updateViewFromHash() {

	const hash = window.location.hash.substring(1); //Remove hash prefix
	let [hashEntryId, hashPeriod, hashX, hashY, hashZoom] = hash.split('/')

	// Handle zzz and 0.. prefix
	let newId = hashEntryId.replace(/^zzz([a-z0-9]{8,})$/g, "$1").replace(/^0+/, '')
	if (hashEntryId !== newId) {
		hashEntryId = newId
		const newLocation = new URL(window.location)
		newLocation.hash = '#' + [newId, hashPeriod, hashX, hashY, hashZoom].join('/')
		history.replaceState({}, "", newLocation)
	}

	let targetPeriod, targetVariation

	if (hashPeriod) {
		[targetPeriod, , targetVariation] = parsePeriod(hashPeriod)
	} else {
		targetPeriod = defaultPeriod
		targetVariation = defaultVariation
	}
	updateTime(targetPeriod, targetVariation, true)

	setView(
		isNaN(hashX) ? scaleZoomOrigin[0] : Number(hashX), 
		isNaN(hashY) ? scaleZoomOrigin[1] : Number(hashY), 
		isNaN(hashZoom) ? zoom : Number(hashZoom)
	)

	if (!hashEntryId) return

	// Highlight entry from hash

	const entries = atlas.filter(e => {
		return e.id.toString() === hashEntryId
	})

	if (entries.length !== 1) return 
		
	const entry = entries[0]

	document.title = entry.name + " on " + pageTitle

	if ((!entry.diff || entry.diff !== "delete")) {
		objectEditNav.href = "./?mode=draw&id=" + hashEntryId
		objectEditNav.title = "Edit " + entry.name
		if (!objectEditNav.isConnected) {
			showListButton.parentElement.appendChild(objectEditNav)
		}
	} else if (entry.diff === "delete" && document.getElementById("objectEditNav")) {
		objectEditNav.remove()
	}

	const infoElement = createInfoBlock(entry)
	objectsContainer.replaceChildren()
	objectsContainer.appendChild(infoElement)

	renderBackground(atlas)
	setView(
		isNaN(hashX) ? entry.center[0] : Number(hashX), 
		isNaN(hashY) ? entry.center[1] : Number(hashY), 
		isNaN(hashZoom) ? setZoomByPath(entry.path) : Number(hashZoom)
	)

	closeObjectsListButton.classList.remove("d-none")
	entriesList.classList.add("disableHover")

	hovered = [entry]
	render()
	hovered[0].element = infoElement
	updateLines()
}

function setZoomByPath(path) {

	let boundingBox = [canvasSize.x + canvasOffset.x, canvasOffset.x, canvasSize.y + canvasOffset.y, canvasOffset.y]
	path?.forEach(([x, y]) => {
		boundingBox[0] = Math.min(boundingBox[0], x)
		boundingBox[1] = Math.max(boundingBox[1], x)
		boundingBox[2] = Math.min(boundingBox[2], y)
		boundingBox[3] = Math.max(boundingBox[3], y)
	})
	const boundingBoxSize = [boundingBox[1] - boundingBox[0], boundingBox[3] - boundingBox[2]]
	const clientSize = [
		Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0),
		Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
	]
	zoom = Math.min(clientSize[0] / boundingBoxSize[0], clientSize[1] / boundingBoxSize[1])
	zoom = Math.min(4, zoom/2)

	return zoom

}

function initView() {

	buildObjectsList(null, null)
	renderBackground(atlas)
	render()
	
	document.addEventListener('timeupdate', () => {
		atlasDisplay = atlas.slice()
		resetEntriesList()
	})

	// parse linked atlas entry id from link hash
	/*if (window.location.hash.substring(3)){
		zoom = 4
		applyView()
		updateViewFromHash()
	}*/

	applyView()
	render()
	updateLines()

}

function initExplore() {

	window.updateHovering = updateHovering
	window.render = () => { }

	function updateHovering(e, tapped) {
		if (dragging || (fixed && !tapped)) return
		updateCoordsDisplay(e)
	}

	renderBackground(atlas)

	applyView()

}

function initGlobal() {
	container.addEventListener("mousemove", e => {
		if (e.sourceCapabilities) {
			if (!e.sourceCapabilities.firesTouchEvents) {
				updateHovering(e)
			}
		} else {
			updateHovering(e)
		}
	})

	document.addEventListener('timeupdate', event => {
		updateHash()
	})
}

function initViewGlobal() {
	container.addEventListener("mousedown", e => {
		lastPos = [
			e.clientX,
			e.clientY
		]
	})

	container.addEventListener("touchstart", e => {
		if (e.touches.length === 1) {
			lastPos = [
				e.touches[0].clientX,
				e.touches[0].clientY
			]
		}
	}, { passive: true })

	container.addEventListener("mouseup", e => {
		if (Math.abs(lastPos[0] - e.clientX) + Math.abs(lastPos[1] - e.clientY) <= 4) {
			toggleFixed(e)
		}
	})

	container.addEventListener("touchend", e => {
		e.preventDefault()

		if (e.changedTouches.length !== 1) return

		e = e.changedTouches[0]

		if (Math.sqrt(Math.pow(lastPos[0] - e.clientX, 2) + Math.pow(lastPos[1] - e.clientY, 2)) < 10)
			setTimeout(() => updateHovering(e, true), 0)

		dragging = false
		fixed = false
	})

	if (window.location.hash) { // both "/" and just "/#" will be an empty hash string
		updateViewFromHash()
	}

	document.addEventListener('timeupdate', event => {
		drawButton.href = "./?mode=draw" + formatHash(null, event.detail.period, event.detail.period, event.detail.variation)
	})
}
