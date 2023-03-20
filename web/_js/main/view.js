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

const linesCanvas = document.getElementById("linesCanvas")
const linesContext = linesCanvas.getContext("2d")
let hovered = []

let previousZoomOrigin = [0, 0]
let previousScaleZoomOrigin = [0, 0]

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

const filterInput = document.getElementById("searchList")

const entriesList = document.getElementById("entriesList")

let entriesListShown = false

const drawButton = document.getElementById("drawLink")
const objectEditNav = document.createElement("a")
objectEditNav.className = "btn btn-outline-primary"
objectEditNav.id = "objectEditNav"
objectEditNav.textContent = "Edit"

let sortedAtlas

const entriesLimit = 50
let entriesOffset = 0
const moreEntriesButton = document.createElement("button")
moreEntriesButton.innerHTML = "Show " + entriesLimit + " more"
moreEntriesButton.type = "button"
moreEntriesButton.className = "btn btn-primary d-block mb-2 mx-auto"


moreEntriesButton.id = "moreEntriesButton"
moreEntriesButton.onclick = function () {
	buildObjectsList(null, null)
	renderBackground()
	render()
}

let defaultSort = "shuffle"
document.getElementById("sort").value = defaultSort

let lastPos = [0, 0]

let fixed = false; // Fix hovered items in place, so that clicking on links is possible

filterInput.addEventListener("input", function () {
	entriesOffset = 0
	entriesList.replaceChildren()
	entriesList.appendChild(moreEntriesButton)

	if (this.value === "") {
		document.getElementById("relevantOption").disabled = true
		sortedAtlas = atlas.concat()
		buildObjectsList(null, null)
	} else {
		document.getElementById("relevantOption").disabled = false
		buildObjectsList(this.value.toLowerCase(), "relevant")
	}

})

document.getElementById("sort").addEventListener("input", function () {
	if (this.value !== "relevant") {
		defaultSort = this.value
	}
	resetEntriesList(filterInput.value.toLowerCase(), this.value)
})

offcanvasDraw.addEventListener('show.bs.offcanvas', function () {
	wrapper.classList.remove('listHidden')
	wrapper.classList.add('listTransitioning')
	applyView()
})

offcanvasDraw.addEventListener('shown.bs.offcanvas', function () {
	wrapper.classList.remove('listTransitioning')
	applyView()
})

offcanvasDraw.addEventListener('hide.bs.offcanvas', function () {
	wrapper.classList.add('listHidden')
	wrapper.classList.add('listTransitioning')
	applyView()
})

offcanvasDraw.addEventListener('hidden.bs.offcanvas', function () {
	wrapper.classList.remove('listTransitioning')
	applyView()
})

offcanvasList.addEventListener('show.bs.offcanvas', function () {
	wrapper.classList.remove('listHidden')
	wrapper.classList.add('listTransitioning')
	applyView()
})

offcanvasList.addEventListener('shown.bs.offcanvas', function (e) {
	entriesListShown = true
	wrapper.classList.remove('listTransitioning')
	updateHovering(e)
	applyView()
	render()
	updateLines()
})

offcanvasList.addEventListener('hide.bs.offcanvas', function () {
	wrapper.classList.add('listHidden')
	wrapper.classList.add('listTransitioning')
	applyView()
})

offcanvasList.addEventListener('hidden.bs.offcanvas', function (e) {
	entriesListShown = false
	wrapper.classList.remove('listTransitioning')
	updateHovering(e)
	applyView()
	render()
	updateLines()
})

closeObjectsListButton.addEventListener("click", clearObjectsList)

bottomBar.addEventListener("mouseover", function () {
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

objectsContainer.addEventListener("scroll", function () {
	updateLines()
})

window.addEventListener("resize", function (e) {

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
				~~(hovered[i].center[0] * zoom) + innerContainer.offsetLeft,
				~~(hovered[i].center[1] * zoom) + innerContainer.offsetTop
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
				~~(hovered[i].center[0] * zoom) + innerContainer.offsetLeft,
				~~(hovered[i].center[1] * zoom) + innerContainer.offsetTop
			)
			linesContext.stroke()
		}
	}
}

function renderBackground(atlas) {

	backgroundContext.clearRect(0, 0, canvas.width, canvas.height)

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
			backgroundContext.moveTo(path[0][0], path[0][1])
		}

		for (let p = 1; p < path.length; p++) {
			//backgroundContext.lineTo(path[p][0]*zoom, path[p][1]*zoom)
			backgroundContext.lineTo(path[p][0], path[p][1])
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

function buildObjectsList(filter = null, sort = null) {

	if (entriesList.contains(moreEntriesButton)) {
		entriesList.removeChild(moreEntriesButton)
	}

	if (!sortedAtlas) {
		sortedAtlas = atlas.concat()
		document.getElementById("atlasSize").innerHTML = "The Atlas contains " + sortedAtlas.length + " entries."
	}

	if (filter) {
		sortedAtlas = atlas.filter(entry => {
			return (
				entry.name.toLowerCase().includes(filter.toLowerCase())
				|| entry.description.toLowerCase().includes(filter.toLowerCase())
				|| Object.values(entry.links).flat().some(str => str.toLowerCase().includes(filter))
				|| entry.id === filter
			)
		})
		document.getElementById("atlasSize").innerHTML = "Found " + sortedAtlas.length + " entries."
	} else {
		document.getElementById("atlasSize").innerHTML = "The Atlas contains " + sortedAtlas.length + " entries."
	}

	if (sort === null) {
		sort = defaultSort
	}

	renderBackground(sortedAtlas)
	render()

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
			sortFunction = (a, b) => b.id.length - a.id.length || b.id.localeCompare(a.id)
			break
		case "oldest":
			sortFunction = (a, b) => a.id.length - b.id.length || a.id.localeCompare(b.id)
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
		sortedAtlas.sort(sortFunction)
	}

	for (let i = entriesOffset; i < entriesOffset + entriesLimit; i++) {

		if (i >= sortedAtlas.length) {
			break
		}

		const element = createInfoBlock(sortedAtlas[i])

		element.entry = sortedAtlas[i]

		element.addEventListener("mouseenter", function () {
			if (!fixed && !dragging) {
				objectsContainer.replaceChildren()

				previousZoomOrigin = [zoomOrigin[0], zoomOrigin[1]]
				previousScaleZoomOrigin = [scaleZoomOrigin[0], scaleZoomOrigin[1]]

				applyView()

				zoomOrigin = [
					innerContainer.clientWidth / 2 - this.entry.center[0] * zoom, // + container.offsetLeft
					innerContainer.clientHeight / 2 - this.entry.center[1] * zoom // + container.offsetTop
				]

				scaleZoomOrigin = [
					canvasCenter.x - this.entry.center[0],
					canvasCenter.y - this.entry.center[1]
				]

				//console.log(zoomOrigin)


				applyView()
				hovered = [this.entry]
				render()
				hovered[0].element = this
				updateLines()
			}

		})

		element.addEventListener("click", function (e) {
			toggleFixed(e)
			if (fixed) {
				previousZoomOrigin = [zoomOrigin[0], zoomOrigin[1]]
				previousScaleZoomOrigin = [scaleZoomOrigin[0], scaleZoomOrigin[1]]
				applyView()
			}
		})

		element.addEventListener("mouseleave", function () {
			if (!fixed && !dragging) {
				zoomOrigin = [previousScaleZoomOrigin[0] * zoom, previousScaleZoomOrigin[1] * zoom]
				scaleZoomOrigin = [previousScaleZoomOrigin[0], previousScaleZoomOrigin[1]]
				applyView()
				hovered = []
				updateLines()
				render()
			}
		})

		entriesList.appendChild(element)

	}

	entriesOffset += entriesLimit

	if (sortedAtlas.length > entriesOffset) {
		moreEntriesButton.innerHTML = "Show " + Math.min(entriesLimit, sortedAtlas.length - entriesOffset) + " more"
		entriesList.appendChild(moreEntriesButton)
	}
}

function shuffle() {
	//console.log("shuffled atlas")
	for (let i = sortedAtlas.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1))
		const temp = sortedAtlas[i]
		sortedAtlas[i] = sortedAtlas[j]
		sortedAtlas[j] = temp
	}
}

function resetEntriesList() {
	entriesOffset = 0
	entriesList.replaceChildren()
	entriesList.appendChild(moreEntriesButton)

	buildObjectsList(filter = null, sort = null)

}

async function render() {

	context.clearRect(0, 0, canvas.width, canvas.height)

	//canvas.width = 1000*zoom
	//canvas.height = 1000*zoom

	context.globalCompositeOperation = "source-over"
	context.clearRect(0, 0, canvas.width, canvas.height)

	if (hovered.length > 0) {
		container.style.cursor = "pointer"
	} else {
		container.style.cursor = "default"
	}


	for (let i = 0; i < hovered.length; i++) {


		const path = hovered[i].path

		context.beginPath()

		if (path[0]) {
			//context.moveTo(path[0][0]*zoom, path[0][1]*zoom)
			context.moveTo(path[0][0], path[0][1])
		}

		for (let p = 1; p < path.length; p++) {
			//context.lineTo(path[p][0]*zoom, path[p][1]*zoom)
			context.lineTo(path[p][0], path[p][1])
		}

		context.closePath()

		context.globalCompositeOperation = "source-over"

		context.fillStyle = "rgba(0, 0, 0, 1)"
		context.fill()
	}

	context.globalCompositeOperation = "source-out"
	context.drawImage(backgroundCanvas, 0, 0)

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
				context.globalCompositeOperation = "source-over"
				context.drawImage(overrideImage, startX, startY)
			} catch (ex) {
				console.error("Cannot override image.", ex)
			}
		}
	}

	for (let i = 0; i < hovered.length; i++) {

		const path = hovered[i].path

		context.beginPath()

		if (path[0]) {
			//context.moveTo(path[0][0]*zoom, path[0][1]*zoom)
			context.moveTo(path[0][0], path[0][1])
		}

		for (let p = 1; p < path.length; p++) {
			//context.lineTo(path[p][0]*zoom, path[p][1]*zoom)
			context.lineTo(path[p][0], path[p][1])
		}

		context.closePath()

		context.globalCompositeOperation = "source-over"

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
		context.strokeStyle = hoverStrokeStyle
		//context.lineWidth = zoom
		context.stroke()
	}

}

function updateHovering(e, tapped) {

	if (dragging || (fixed && !tapped)) return

	const pos = [
		(e.clientX - (container.clientWidth / 2 - innerContainer.clientWidth / 2 + zoomOrigin[0] + container.offsetLeft)) / zoom,
		(e.clientY - (container.clientHeight / 2 - innerContainer.clientHeight / 2 + zoomOrigin[1] + container.offsetTop)) / zoom
	]
	const coords_p = document.getElementById("coords_p")

	// Displays coordinates as zero instead of NaN
	if (isNaN(pos[0]) === true) {
		coords_p.textContent = "0, 0"
	} else {
		coords_p.textContent = Math.ceil(pos[0]) + ", " + Math.ceil(pos[1])
	}

	if (!(pos[0] <= 2200 && pos[0] >= -100 && pos[0] <= 2200 && pos[0] >= -100)) return

	const newHovered = []
	for (let i = 0; i < atlas.length; i++) {
		if (pointIsInPolygon(pos, atlas[i].path)) {
			newHovered.push(atlas[i])
		}
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

	for (const i in hovered) {
		const element = createInfoBlock(hovered[i])

		objectsContainer.appendChild(element)

		hovered[i].element = element
	}

	if (hovered.length > 0) {
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

window.addEventListener("hashchange", highlightEntryFromUrl)

function highlightEntryFromUrl() {

	const hash = window.location.hash.substring(1); //Remove hash prefix
	const [id, period] = hash.split('/')
	let targetPeriod, targetVariation

	if (period) {
		[, targetPeriod, targetVariation] = parsePeriod(period)
	} else {
		targetPeriod = defaultPeriod
		targetVariation = defaultVariation
	}
	updateTime(targetPeriod, targetVariation, true)

	if (!id) return

	const entries = atlas.filter(function (e) {
		return e.id === id
	})

	if (entries.length !== 1) return 
		
	const entry = entries[0]

	let boundingBox = [canvasSize.x, 0, canvasSize.y, 0]
	entry.path?.forEach(([x, y]) => {
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

	document.title = entry.name + " on " + pageTitle

	if ((!entry.diff || entry.diff !== "delete")) {
		objectEditNav.href = "./?mode=draw&id=" + id
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
	applyView()

	zoomOrigin = [
		innerContainer.clientWidth / 2 - entry.center[0] * zoom, // + container.offsetLeft
		innerContainer.clientHeight / 2 - entry.center[1] * zoom // + container.offsetTop
	]

	scaleZoomOrigin = [
		canvasCenter.x - entry.center[0], // + container.offsetLeft
		canvasCenter.y - entry.center[1]  // + container.offsetTop
	]

	closeObjectsListButton.classList.remove("d-none")
	entriesList.classList.add("disableHover")

	applyView()
	hovered = [entry]
	render()
	hovered[0].element = infoElement
	updateLines()
	fixed = true

}

function initView() {

	buildObjectsList(null, null)
	renderBackground(atlas)
	render()

	document.addEventListener('timeupdate', () => {
		sortedAtlas = atlas.concat()
		resetEntriesList(null, null)
	})

	// parse linked atlas entry id from link hash
	/*if (window.location.hash.substring(3)){
		zoom = 4
		applyView()
		highlightEntryFromUrl()
	}*/

	applyView()
	render()
	updateLines()

}

function initExplore() {

	window.updateHovering = updateHovering
	window.render = function () { }

	function updateHovering(e, tapped) {
		if (!dragging && (!fixed || tapped)) {
			const pos = [
				(e.clientX - (container.clientWidth / 2 - innerContainer.clientWidth / 2 + zoomOrigin[0] + container.offsetLeft)) / zoom,
				(e.clientY - (container.clientHeight / 2 - innerContainer.clientHeight / 2 + zoomOrigin[1] + container.offsetTop)) / zoom
			]
			const coords_p = document.getElementById("coords_p")
			// Displays coordinates as zero instead of NaN
			if (isNaN(pos[0]) === true) {
				coords_p.textContent = "0, 0"
			} else {
				coords_p.textContent = Math.ceil(pos[0]) + ", " + Math.ceil(pos[1])
			}
		}
	}

	renderBackground(atlas)

	applyView()

}

function initGlobal() {
	container.addEventListener("mousemove", function (e) {
		if (e.sourceCapabilities) {
			if (!e.sourceCapabilities.firesTouchEvents) {
				updateHovering(e)
			}
		} else {
			updateHovering(e)
		}
	})

	document.addEventListener('timeupdate', (event) => {
		let hashData = window.location.hash.substring(1).split('/')
		const targetHash = formatHash(hashData[0], event.detail.period, event.detail.period, event.detail.variation)
		if (location.hash !== targetHash) history.replaceState({}, "", targetHash)
	})
}

function initViewGlobal() {
	container.addEventListener("mousedown", function (e) {
		lastPos = [
			e.clientX,
			e.clientY
		]
	})

	container.addEventListener("touchstart", function (e) {
		if (e.touches.length === 1) {
			lastPos = [
				e.touches[0].clientX,
				e.touches[0].clientY
			]
		}
	}, { passive: true })

	container.addEventListener("mouseup", function (e) {
		if (Math.abs(lastPos[0] - e.clientX) + Math.abs(lastPos[1] - e.clientY) <= 4) {
			toggleFixed(e)
		}
	})

	container.addEventListener("touchend", function (e) {
		e.preventDefault()

		//console.log(e)
		//console.log(e.changedTouches[0].clientX)
		if (e.changedTouches.length !== 1) return

		e = e.changedTouches[0]
		//console.log(lastPos[0] - e.clientX)

		if (Math.abs(lastPos[0] - e.clientX) + Math.abs(lastPos[1] - e.clientY) > 4)

		//console.log("Foo!!")
		dragging = false
		fixed = false
		setTimeout(function () {
			updateHovering(e, true)
		}, 10)
	})

	if (window.location.hash) { // both "/" and just "/#" will be an empty hash string
		highlightEntryFromUrl()
	}

	document.addEventListener('timeupdate', (event) => {
		drawButton.href = "./?mode=draw" + formatHash(undefined, event.detail.period, event.detail.period, event.detail.variation)
	})
}
