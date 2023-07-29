/*!
 * The 2017 r/place Atlas
 * Copyright (c) 2017 Roland Rytz <roland@draemm.li>
 * Copyright (c) 2022 Place Atlas contributors
 * Licensed under AGPL-3.0 (https://2017.place-atlas.stefanocoding.me/license.txt)
 */

const finishButton = document.getElementById("finishButton")
const resetButton = document.getElementById("resetButton")
const undoButton = document.getElementById("undoButton")
const redoButton = document.getElementById("redoButton")
const highlightUnchartedEl = document.getElementById("highlightUncharted")
const highlightUnchartedLabel = document.getElementById("highlightUnchartedLabel")

const drawControlsBody = document.getElementById("offcanvasDraw-drawControls")
const objectInfoBody = document.getElementById("offcanvasDraw-objectInfo")
const objectInfoForm = document.getElementById("objectInfo")

const hintText = document.getElementById("hint")

const periodsStatus = document.getElementById('periodsStatus')
const periodGroups = document.getElementById('periodGroups')
const periodGroupTemplate = document.getElementById('period-group').content.firstElementChild.cloneNode(true)
const periodsAdd = document.getElementById('periodsAdd')

const exportButton = document.getElementById("exportButton")
const cancelButton = document.getElementById("cancelButton")
const redditPostButton = document.getElementById("exportRedditPost")
let redditPostTooltip = null
const githubPostButton = document.getElementById("exportGithubPost")
let githubPostTooltip = null

const exportModalElement = document.getElementById("exportModal")
const exportModal = new bootstrap.Modal(exportModalElement)

const nameField = document.getElementById("nameField")
const descriptionField = document.getElementById("descriptionField")
const websiteGroup = document.getElementById("websiteGroup")
const subredditGroup = document.getElementById("subredditGroup")
const discordGroup = document.getElementById("discordGroup")
const wikiGroup = document.getElementById("wikiGroup")
const exportArea = document.getElementById("exportString")

const subredditPattern = /^(?:(?:(?:(?:(?:https?:\/\/)?(?:(?:www|old|new|np)\.)?)?reddit\.com)?\/)?[rR]\/)?([A-Za-z0-9][A-Za-z0-9_]{1,20})(?:\/[^" ]*)*$/
const discordPattern = /^(?:(?:https?:\/\/)?(?:www\.)?(?:(?:discord)?\.?gg|discord(?:app)?\.com\/invite)\/)?([^\s/]+?)(?=\b)$/

let entry
let path = []
let center = [canvasCenter.x, canvasCenter.y]

let websiteGroupElements = []
let subredditGroupElements = []
let discordGroupElements = []
let wikiGroupElements = []

let pathWithPeriods = []
let periodGroupElements = []

let disableDrawingOverride = false
let drawing = false

let undoHistory = []

const periodClipboard = {
	"index": null,
	"path": null
}

const drawBackButton = document.createElement("a")
drawBackButton.className = "btn btn-outline-primary"
drawBackButton.id = "drawBackButton"
drawBackButton.textContent = "Exit Draw Mode"

const baseInputAddon = document.createElement("span")
baseInputAddon.className = "input-group-text"

const baseInputGroup = document.createElement("div")
baseInputGroup.className = "input-group"

const baseInputField = document.createElement("input")
baseInputField.className = "form-control"
baseInputField.spellcheck = false
baseInputField.type = "text"

;[...document.querySelectorAll("#objectInfo textarea")].forEach(el => {
	el.addEventListener("input", function () {
		this.style.height = "auto"
		this.style.height = (this.scrollHeight) + "px"
	})
})

// https://gist.github.com/codeguy/6684588?permalink_comment_id=3243980#gistcomment-3243980
function slugify(text) {
	return text
		.normalize('NFKD')
		.toLowerCase()
		.trim()
		.replace(/\s+/g, '-')
		.replace(/[^\w\-]+/g, '')
		.replace(/\-+/g, '-');
}

window.initDraw = initDraw
function initDraw() {
	// Adds exit draw button and removes list button
	showListButton.insertAdjacentHTML("afterend", '<button class="btn btn-outline-primary" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasDraw" aria-controls="offcanvasDraw">Menu</button>')
	showListButton.parentElement.appendChild(drawBackButton)
	showListButton.remove()

	// Opens draw menu
	wrapper.classList.remove('listHidden')
	bsOffcanvasDraw.show()

	window.render = render
	window.renderBackground = renderBackground
	window.updateHovering = updateHovering

	// let startPeriodField = document.getElementById('startPeriodField')
	// let endPeriodField = document.getElementById('endPeriodField')
	// let periodVisbilityInfo = document.getElementById('periodVisbilityInfo')

	let rShiftPressed = false
	let lShiftPressed = false
	let shiftPressed = false

	let highlightUncharted = highlightUnchartedEl.checked

	renderBackground(atlas)
	applyView()

	container.style.cursor = "crosshair"

	render(path)

	container.addEventListener("mousedown", e => {
		lastPos = [
			e.clientX,
			e.clientY
		]
	})

	function getCanvasCoords(x, y) {
		x -= container.offsetLeft
		y -= container.offsetTop

		const pos = [
			~~((x - (container.clientWidth / 2 - innerContainer.clientWidth / 2 + zoomOrigin[0])) / zoom) + 0.5 + canvasOffset.x,
			~~((y - (container.clientHeight / 2 - innerContainer.clientHeight / 2 + zoomOrigin[1])) / zoom) + 0.5 + canvasOffset.y
		]

		if (shiftPressed && path.length > 0) {
			const previous = path[path.length - 1]

			if (Math.abs(pos[1] - previous[1]) > Math.abs(pos[0] - previous[0])) {
				pos[0] = previous[0]
			} else {
				pos[1] = previous[1]
			}
		}

		return pos
	}

	container.addEventListener("mouseup", e => {

		if (Math.abs(lastPos[0] - e.clientX) + Math.abs(lastPos[1] - e.clientY) <= 4 && drawing) {

			const coords = getCanvasCoords(e.clientX, e.clientY)

			path.push(coords)
			render(path)

			undoHistory = []
			redoButton.disabled = true
			undoButton.disabled = false

			if (path.length >= 3) {
				finishButton.disabled = false
			}

			updatePath()
		}
	})

	container.addEventListener("mousemove", e => {
		if (!dragging && drawing && path.length > 0) {
			const coords = getCanvasCoords(e.clientX, e.clientY)
			render([...path, coords])
		}
	})

	container.addEventListener("mouseout", function () {
		if (!dragging && drawing && path.length > 0) {
			render(path)
		}
	})

	window.addEventListener("keyup", e => {
		if (e.key === "z" && e.ctrlKey) {
			undo()
		} else if (e.key === "y" && e.ctrlKey) {
			redo()
		} else if (e.key === "Shift") {
			if (e.code === "ShiftRight") {
				rShiftPressed = false
			} else if (e.code === "ShiftLeft") {
				lShiftPressed = false
			}
			shiftPressed = rShiftPressed || lShiftPressed
		}
	})

	window.addEventListener("keydown", e => {
		if (e.key === "Shift") {
			if (e.code === "ShiftRight") {
				rShiftPressed = true
			} else if (e.code === "ShiftLeft") {
				lShiftPressed = true
			}
			shiftPressed = rShiftPressed || lShiftPressed
		}
	})

	finishButton.addEventListener("click", function () {
		finish()
	})

	undoButton.addEventListener("click", e => {
		undo()
		const coords = getCanvasCoords(e.clientX, e.clientY)
		render([...path, coords])
	})

	redoButton.addEventListener("click", e => {
		redo()
		const coords = getCanvasCoords(e.clientX, e.clientY)
		render([...path, coords])
	})

	resetButton.addEventListener("click", e => {
		reset()
		const coords = getCanvasCoords(e.clientX, e.clientY)
		render([...path, coords])
	})

	resetButton.addEventListener("blur", function () {
		resetButton.textContent = "Reset"
		resetButton.className = "btn btn-secondary"
	})

	cancelButton.addEventListener("click", function () {
		back()
	})

	// Refocus on button when modal is closed
	exportModalElement.addEventListener('hidden.bs.modal', function () {
		exportButton.focus()
	})

	objectInfoForm.addEventListener('submit', e => {
		e.preventDefault()
		// Allows for html form validation with preview button
		if (e.submitter && e.submitter.value === "Preview") {
			preview()
		} else {
			exportJson()
		}
	})

	highlightUnchartedEl.addEventListener("click", function () {
		highlightUncharted = this.checked
		render(path)
	})

	function generateExportObject() {
		const exportObject = {
			id: entry ? entry.id : -1,
			name: nameField.value,
			description: descriptionField.value,
			links: {},
			path: {},
			center: {},
		}

		if (useNumericalId) {
			if (!isNaN(Number(exportObject.id))) exportObject.id = Number(exportObject.id)
		}

		const pathWithPeriodsTemp = structuredClone(pathWithPeriods)

		for (let i = pathWithPeriodsTemp.length - 1; i > 0; i--) {
			for (let j = 0; j < i; j++) {
				if (JSON.stringify(pathWithPeriodsTemp[i][1]) === JSON.stringify(pathWithPeriodsTemp[j][1])) {
					pathWithPeriodsTemp[j][0] = pathWithPeriodsTemp[i][0] + ', ' + pathWithPeriodsTemp[j][0]
					pathWithPeriodsTemp.splice(i, 1)
					break
				}
			}
		}

		pathWithPeriodsTemp.forEach(([key, value]) => {
			// TODO: Compress periods on something like 0-13, 14.
			exportObject.path[key] = value.map(point => point.map(int => int - 0.5))
			exportObject.center[key] = calculateCenter(value).map(int => int - 0.5)
		})

		const inputWebsite = websiteGroupElements.map(element => element.value.trim()).filter(element => element)
		const inputSubreddit = subredditGroupElements.map(element => element.value.trim().match(subredditPattern)?.[1]).filter(element => element)
		const inputDiscord = discordGroupElements.map(element => element.value.trim().match(discordPattern)?.[1]).filter(element => element)
		const inputWiki = wikiGroupElements.map(element => element.value.trim().replace(/ /g, '_')).filter(element => element)

		if (inputWebsite.length) exportObject.links.website = inputWebsite
		if (inputSubreddit.length) exportObject.links.subreddit = inputSubreddit
		if (inputDiscord.length) exportObject.links.discord = inputDiscord
		if (inputWiki.length) exportObject.links.wiki = inputWiki

		return exportObject
	}

	document.getElementById("exportCopy").addEventListener("click", () => {
		navigator.clipboard.writeText(exportArea.value)
	})

	function exportJson() {
		const exportObject = generateExportObject()
		const prettyJsonString = JSON.stringify(exportObject, null, "\t")
		const miniJsonString = JSON.stringify(exportObject)

		// Export area

		exportArea.value = "    " + prettyJsonString.split("\n").join("\n    ")
		if (exportArea.value > 40000) {
			exportArea.value = "    " + miniJsonString
		}
		
		// Reddit

		let redditPostJsonString = "    " + prettyJsonString.split("\n").join("\n    ")
		let redditPostUrl = `https://www.reddit.com/r/${instanceSubreddit}/submit?selftext=true&title=`
		if (exportObject.id === -1) redditPostUrl += `✨%20${encodeURIComponent(exportObject.name ?? entry.name)}`
		else redditPostUrl += `✏%20${encodeURIComponent(exportObject.name ?? entry.name)}`
		redditPostUrl += "&text="

		if (encodeURIComponent(redditPostJsonString).length > 7579 - redditPostUrl.length) {
			redditPostJsonString = "    " + miniJsonString
		}

		redditPostUrl += encodeURIComponent(redditPostJsonString)
		if (encodeURIComponent(redditPostUrl).length > 7579) {
			// redditPostButton.classList.add("disabled")
			// redditPostButton.ariaDisabled = true
			redditPostButton.dataset.bsToggle = "tooltip"
			redditPostButton.dataset.bsTitle = "This may not work due to the length of the entry. If needed, please copy manually."
			if (!redditPostTooltip) redditPostTooltip = new bootstrap.Tooltip(redditPostButton)
		} else {
			// redditPostButton.classList.remove("disabled")
			// redditPostButton.ariaDisabled = false
			redditPostButton.dataset.bsTitle = ""
		}
		redditPostButton.href = redditPostUrl

		if (exportObject.id === -1) document.getElementById("redditFlair").textContent = "New Entry"
		else document.getElementById("redditFlair").textContent = "Edit Entry"

		// GitHub

		let githubPostJsonString = prettyJsonString
		let githubPostUrl = `${instanceRepo}/new/cleanup/data/patches?filename=gh-${[...Array(4)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')}-${slugify(exportObject.name ?? entry.name)}.json&value=`

		if (encodeURIComponent(githubPostJsonString).length > 8192 - githubPostUrl.length) {
			githubPostJsonString = miniJsonString
		}

		githubPostUrl += encodeURIComponent(githubPostJsonString)
		if (githubPostUrl.length > 8192) {
			// githubPostButton.classList.add("disabled")
			// githubPostButton.ariaDisabled = true
			githubPostButton.dataset.bsToggle = "tooltip"
			githubPostButton.dataset.bsTitle = "This may not work due to the length of the entry. If needed, please copy manually."
			if (!githubPostTooltip) githubPostTooltip = new bootstrap.Tooltip(githubPostButton)
		} else {
			// githubPostButton.classList.remove("disabled")
			// githubPostButton.ariaDisabled = false
			githubPostButton.dataset.bsTitle = ""
		}
		githubPostButton.href = githubPostUrl

		console.log(githubPostUrl)

		exportModal.show()
	}

	function preview() {
		let infoElement = createInfoBlock(generateExportObject(), true)
		objectsContainer.replaceChildren()
		objectsContainer.appendChild(infoElement)
		closeObjectsListButton.classList.remove("d-none")
	}

	function undo() {
		if (path.length == 0 || !drawing) return
		undoHistory.push(path.pop())
		redoButton.disabled = false
		updatePath(path, undoHistory)
	}

	function redo() {
		if (undoHistory.length == 0 || !drawing) return
		path.push(undoHistory.pop())
		undoButton.disabled = false
		updatePath(path, undoHistory)
	}

	function finish() {
		updatePath()
		drawing = false
		disableDrawingOverride = true
		container.style.cursor = "default"
		objectInfoBody.classList.remove("d-none")
		drawControlsBody.classList.add("d-none")
		;[...document.querySelectorAll("#objectInfo textarea")].forEach(el => {
			if (el.value) el.style.height = (el.scrollHeight) + "px"
		})
		// if (isOnPeriod()) {
		// 	periodVisbilityInfo.textContent = ""
		// } else {
		// 	periodVisbilityInfo.textContent = "Not visible during this period!"
		// }
	}

	function reset() {
		// Requires button to be pressed twice to confirm reset
		if (resetButton.textContent === "Confirm Reset") {
			resetButton.textContent = "Reset"
			resetButton.className = "btn btn-secondary"

			updatePath([])
			undoHistory = []
			drawing = true
			disableDrawingOverride = false
			objectInfoBody.classList.add("d-none")
			drawControlsBody.classList.remove("d-none")

			// Blanks input values
			nameField.value = ""
			descriptionField.value = ""

			// Clears input array
			websiteGroupElements = []
			subredditGroupElements = []
			discordGroupElements = []
			wikiGroupElements = []

			// Rebuilds multi-input list
			websiteGroup.replaceChildren()
			subredditGroup.replaceChildren()
			discordGroup.replaceChildren()
			wikiGroup.replaceChildren()
			addWebsiteFields("", 0, [0])
			addSubredditFields("", 0, [0])
			addDiscordFields("", 0, [0])
			addWikiFields("", 0, [0])

			// Resets periods
			pathWithPeriods = []
			pathWithPeriods.push([defaultPeriod, []])
			initPeriodGroups()
		} else {
			resetButton.textContent = "Confirm Reset"
			resetButton.className = "btn btn-danger"
		}
	}

	function back() {
		drawing = true
		disableDrawingOverride = false
		container.style.cursor = "crosshair"
		updatePath()
		objectInfoBody.classList.add("d-none")
		drawControlsBody.classList.remove("d-none")
		// Clears preview
		objectsContainer.replaceChildren()
		closeObjectsListButton.classList.add("d-none")
	}

	function renderBackground() {

		backgroundContext.clearRect(0, 0, highlightCanvas.width, highlightCanvas.height)

		backgroundContext.fillStyle = "rgba(0, 0, 0, 1)"
		//backgroundContext.fillRect(0, 0, canvas.width, canvas.height)

		for (let i = 0; i < atlas.length; i++) {

			const path = atlas[i].path

			backgroundContext.beginPath()

			if (path[0]) {
				backgroundContext.moveTo(path[0][0] - canvasOffset.x, path[0][1] - canvasOffset.y)
			}

			for (let p = 1; p < path.length; p++) {
				backgroundContext.lineTo(path[p][0] - canvasOffset.x, path[p][1] - canvasOffset.y)
			}

			backgroundContext.closePath()

			backgroundContext.fill()
		}
	}

	function render(path) {

		if (!Array.isArray(path)) return

		highlightContext.globalCompositeOperation = "source-over"
		highlightContext.clearRect(0, 0, highlightCanvas.width, highlightCanvas.height)

		if (highlightUncharted) {
			highlightContext.drawImage(backgroundCanvas, 0, 0)
			highlightContext.fillStyle = "rgba(0, 0, 0, 0.4)"
		} else {
			highlightContext.fillStyle = "rgba(0, 0, 0, 0.6)"
		}

		highlightContext.fillRect(0, 0, highlightCanvas.width, highlightCanvas.height)

		highlightContext.beginPath()

		if (path[0]) {
			highlightContext.moveTo(path[0][0] - canvasOffset.x, path[0][1] - canvasOffset.y)
		}

		for (let i = 1; i < path.length; i++) {
			highlightContext.lineTo(path[i][0] - canvasOffset.x, path[i][1] - canvasOffset.y)
		}

		highlightContext.closePath()

		highlightContext.strokeStyle = "rgba(255, 255, 255, 1)"
		highlightContext.stroke()

		highlightContext.globalCompositeOperation = "destination-out"

		highlightContext.fillStyle = "rgba(0, 0, 0, 1)"
		highlightContext.fill()

	}

	function updateHovering(e, tapped) {
		if (dragging || (fixed && !tapped)) return
		updateCoordsDisplay(e)
	}

	const getEntry = id => {
		if (!id) return
		const entries = atlasAll.filter(entry => entry.id.toString() === id.toString())
		if (entries.length === 1) return entries[0]
	}

	function addFieldButton(inputButton, inputGroup, array, index, name) {
		if (inputButton.title === "Remove " + name) {
			removeFieldButton(inputGroup, array, index)
			return
		}
		inputButton.className = "btn btn-outline-secondary"
		inputButton.title = "Remove " + name
		inputButton.innerHTML = '<i class="bi bi-trash-fill" aria-hidden="true"></i>'
		if (name === "website") {
			addWebsiteFields(null, array.length, array)
		} else if (name === "subreddit") {
			addSubredditFields(null, array.length, array)
		} else if (name === "Discord invite") {
			addDiscordFields(null, array.length, array)
		} else if (name === "wiki page") {
			addWikiFields(null, array.length, array)
		}
	}

	function removeFieldButton(inputGroup, array, index) {
		delete array[index]
		inputGroup.remove()
	}

	function addWebsiteFields(link, index, array) {
		const inputGroup = baseInputGroup.cloneNode()
		websiteGroup.appendChild(inputGroup)

		const inputField = baseInputField.cloneNode()
		inputField.type = "url"
		inputField.id = "websiteField" + index
		inputField.placeholder = "https://example.com"
		inputField.pattern = "https?://.*"
		inputField.title = "Website URL using the http:// or https:// protocol"
		inputField.setAttribute("aria-labelledby", "websiteLabel")
		inputField.value = link
		inputGroup.appendChild(inputField)
		websiteGroupElements.push(inputField)

		const inputButton = document.createElement("button")
		inputButton.type = "button"
		// If button is the last in the array give it the add button
		if (array.length === index + 1) {
			inputButton.className = "btn btn-secondary"
			inputButton.title = "Add website"
			inputButton.innerHTML = '<i class="bi bi-plus-lg" aria-hidden="true"></i>'
			inputButton.addEventListener('click', () => addFieldButton(inputButton, inputGroup, websiteGroupElements, index, "website"))
		} else {
			inputButton.className = "btn btn-outline-secondary"
			inputButton.title = "Remove website"
			inputButton.innerHTML = '<i class="bi bi-trash-fill" aria-hidden="true"></i>'
			inputButton.addEventListener('click', () => removeFieldButton(inputGroup, websiteGroupElements, index))
		}
		inputGroup.appendChild(inputButton)
	}

	function addSubredditFields(link, index, array) {
		const inputGroup = baseInputGroup.cloneNode()
		subredditGroup.appendChild(inputGroup)

		const inputAddon = baseInputAddon.cloneNode()
		inputAddon.id = "subredditField" + index + "-addon"
		inputAddon.textContent = "reddit.com/"
		inputGroup.appendChild(inputAddon)

		const inputField = baseInputField.cloneNode()
		inputField.id = "subredditField" + index
		inputField.placeholder = "r/example"
		inputField.pattern = "^r\/[A-Za-z0-9][A-Za-z0-9_]{1,50}$"
		inputField.title = "Subreddit in format of r/example"
		inputField.minLength = "4"
		inputField.maxLength = "50"
		inputField.setAttribute("aria-labelledby", "subredditLabel")
		inputField.setAttribute("aria-describedby", "subredditField" + index + "-addon")
		if (link) {
			inputField.value = "r/" + link
		} else {
			inputField.value = ""
		}
		inputGroup.appendChild(inputField)
		subredditGroupElements.push(inputField)

		const inputButton = document.createElement("button")
		inputButton.type = "button"
		// If button is the last in the array give it the add button
		if (array.length === index + 1) {
			inputButton.className = "btn btn-secondary"
			inputButton.title = "Add subreddit"
			inputButton.innerHTML = '<i class="bi bi-plus-lg" aria-hidden="true"></i>'
			inputButton.addEventListener('click', () => addFieldButton(inputButton, inputGroup, subredditGroupElements, index, "subreddit"))
		} else {
			inputButton.className = "btn btn-outline-secondary"
			inputButton.title = "Remove subreddit"
			inputButton.innerHTML = '<i class="bi bi-trash-fill" aria-hidden="true"></i>'
			inputButton.addEventListener('click', () => removeFieldButton(inputGroup, subredditGroupElements, index))
		}

		inputField.addEventListener('paste', event => {
			let paste = (event.clipboardData || window.clipboardData).getData('text')
			paste = paste.trim().match(subredditPattern)?.[1]
			if (paste) {
				event.target.value = "r/" + paste
				event.preventDefault()
			}
		})

		inputGroup.appendChild(inputButton)
	}

	function addDiscordFields(link, index, array) {
		const inputGroup = baseInputGroup.cloneNode()
		discordGroup.appendChild(inputGroup)

		const inputAddon = baseInputAddon.cloneNode()
		inputAddon.id = "discordField" + index + "-addon"
		inputAddon.textContent = "discord.gg/"
		inputGroup.appendChild(inputAddon)

		const inputField = baseInputField.cloneNode()
		inputField.id = "discordField" + index
		inputField.placeholder = "pJkm23b2nA"
		inputField.setAttribute("aria-labelledby", "discordLabel")
		inputField.setAttribute("aria-describedby", "discordField" + index + "-addon")
		inputField.value = link
		inputGroup.appendChild(inputField)
		discordGroupElements.push(inputField)

		const inputButton = document.createElement("button")
		inputButton.type = "button"
		// If button is the last in the array give it the add button
		if (array.length === index + 1) {
			inputButton.className = "btn btn-secondary"
			inputButton.title = "Add Discord invite"
			inputButton.innerHTML = '<i class="bi bi-plus-lg" aria-hidden="true"></i>'
			inputButton.addEventListener('click', () => addFieldButton(inputButton, inputGroup, discordGroupElements, index, "Discord invite"))
		} else {
			inputButton.className = "btn btn-outline-secondary"
			inputButton.title = "Remove Discord invite"
			inputButton.innerHTML = '<i class="bi bi-trash-fill" aria-hidden="true"></i>'
			inputButton.addEventListener('click', () => removeFieldButton(inputGroup, discordGroupElements, index))
		}

		inputField.addEventListener('paste', event => {
			let paste = (event.clipboardData || window.clipboardData).getData('text')
			paste = paste.trim().match(discordPattern)?.[1]
			if (paste) {
				event.target.value = paste
				event.preventDefault()
			}
		})

		inputGroup.appendChild(inputButton)
	}

	function addWikiFields(link, index, array) {
		const inputGroup = baseInputGroup.cloneNode()
		// wikiGroup.appendChild(inputGroup)

		const inputField = baseInputField.cloneNode()
		inputField.id = "wikiField" + index
		inputField.placeholder = "Page title"
		inputField.setAttribute("aria-labelledby", "wikiLabel")
		inputField.value = link
		inputGroup.appendChild(inputField)
		wikiGroupElements.push(inputField)

		const inputButton = document.createElement("button")
		inputButton.type = "button"
		// If button is the last in the array give it the add button
		if (array.length === index + 1) {
			inputButton.className = "btn btn-secondary"
			inputButton.title = "Add wiki page"
			inputButton.innerHTML = '<i class="bi bi-plus-lg" aria-hidden="true"></i>'
			inputButton.addEventListener('click', () => addFieldButton(inputButton, inputGroup, wikiGroupElements, index, "wiki page"))
		} else {
			inputButton.className = "btn btn-outline-secondary"
			inputButton.title = "Remove wiki page"
			inputButton.innerHTML = '<i class="bi bi-trash-fill" aria-hidden="true"></i>'
			inputButton.addEventListener('click', () => removeFieldButton(inputGroup, wikiGroupElements, index))
		}
		inputGroup.appendChild(inputButton)
	}

	const params = new URLSearchParams(document.location.search)
	const entryId = params.get('id')
	entry = getEntry(entryId)

	if (entry) {

		nameField.value = entry.name
		descriptionField.value = entry.description

		if (entry.links.website.length) {
			entry.links.website.forEach((link, index, array) => {
				addWebsiteFields(link, index, array)
			})
		} else {
			addWebsiteFields("", -1, entry.links.website)
		}
		if (entry.links.subreddit.length) {
			entry.links.subreddit.forEach((link, index, array) => {
				addSubredditFields(link, index, array)
			})
		} else {
			addSubredditFields("", -1, entry.links.subreddit)
		}
		if (entry.links.discord.length) {
			entry.links.discord.forEach((link, index, array) => {
				addDiscordFields(link, index, array)
			})
		} else {
			addDiscordFields("", -1, entry.links.discord)
		}
		if (entry.links.wiki.length) {
			entry.links.wiki.forEach((link, index, array) => {
				addWikiFields(link, index, array)
			})
		} else {
			addWikiFields("", -1, entry.links.wiki)
		}
		redoButton.disabled = true
		undoButton.disabled = false

		Object.entries(entry.path).forEach(([period, path]) => {
			period.split(", ").forEach(period => {
				pathWithPeriods.push([period, path])
			})
		})

	} else {
		document.getElementById("offcanvasDrawLabel").textContent = "New Entry"
		pathWithPeriods.push([formatPeriod(currentPeriod, currentPeriod, currentVariation), []])

		// Builds multi-input list
		addWebsiteFields("", 0, [0])
		addSubredditFields("", 0, [0])
		addDiscordFields("", 0, [0])
		addWikiFields("", 0, [0])
	}

	initPeriodGroups()

	const hash = window.location.hash.substring(1)
	const [,, hashX, hashY, hashZoom] = hash.split('/')

	setView(
		isNaN(hashX) ? center[0] : Number(hashX), 
		isNaN(hashY) ? center[1] : Number(hashY), 
		isNaN(hashZoom) ? 4 : Number(hashZoom)
	)
	
	document.addEventListener('timeupdate', () => {
		renderBackground(atlas)
		updatePeriodGroups()
	})

	periodsAdd.addEventListener('click', () => {
		pathWithPeriods.push([formatPeriod(currentPeriod, currentPeriod, currentVariation), []])
		initPeriodGroups()
	})

	drawBackButton.href = "./" + formatHash(entry?.id)

	document.addEventListener('timeupdate', event => {
		drawBackButton.href = "./" + formatHash(entry?.id, event.detail.period, event.detail.period, event.detail.variation)
	})

}

function calculateCenter(path) {
	const result = polylabel(path)
	return [Math.floor(result[0]) + 0.5, Math.floor(result[1]) + 0.5]
}

function initPeriodGroups() {

	periodGroupElements = []
	periodGroups.replaceChildren()

	pathWithPeriods.forEach(([period, path], index) => {
		let periodCenter

		// Set element variables
		const periodGroupEl = periodGroupTemplate.cloneNode(true)
		periodGroupEl.id = "periodGroup" + index

		const startPeriodEl = periodGroupEl.querySelector('.period-start')
		const startPeriodListEl = periodGroupEl.querySelector('#periodStartList')
		const startPeriodLabelEl = startPeriodEl.previousElementSibling.querySelector('label')
		const startPeriodLeftEl = periodGroupEl.querySelector('#periodStartLeft')
		const startPeriodRightEl = periodGroupEl.querySelector('#periodStartRight')
		const startPeriodViewEl = periodGroupEl.querySelector('#periodStartView')

		const endPeriodEl = periodGroupEl.querySelector('.period-end')
		const endPeriodListEl = periodGroupEl.querySelector('#periodEndList')
		const endPeriodLabelEl = endPeriodEl.previousElementSibling.querySelector('label')
		const endPeriodLeftEl = periodGroupEl.querySelector('#periodEndLeft')
		const endPeriodRightEl = periodGroupEl.querySelector('#periodEndRight')
		const endPeriodViewEl = periodGroupEl.querySelector('#periodEndView')

		const periodCopyEl = periodGroupEl.querySelector('.period-copy')
		const periodDuplicateEl = periodGroupEl.querySelector('.period-duplicate')
		const periodDeleteEl = periodGroupEl.querySelector('.period-delete')
		
		const periodVariationEl = periodGroupEl.querySelector('.period-variation')
		const periodStatusEl = periodGroupEl.querySelector('.period-status')

		const [start, end, variation] = parsePeriod(period)

		// Set index
		startPeriodEl.id = "periodStart" + index
		startPeriodLabelEl.htmlFor = startPeriodEl.id
		startPeriodListEl.id += index
		startPeriodEl.setAttribute("list", startPeriodListEl.id)
		startPeriodLeftEl.id += index
		startPeriodRightEl.id += index
		startPeriodViewEl.id += index

		endPeriodEl.id = "periodEnd" + index
		endPeriodLabelEl.htmlFor = endPeriodEl.id
		endPeriodListEl.id += index
		endPeriodEl.setAttribute("list", endPeriodListEl.id)
		endPeriodLeftEl.id += index
		endPeriodRightEl.id += index
		endPeriodViewEl.id += index

		periodCopyEl.id = "periodCopy" + index
		periodVariationEl.id = "periodVariation" + index

		periodStatusEl.id = "periodStatus" + index

		// Set ranges
		startPeriodEl.min = variationsConfig[variation].drawablePeriods[0]
		endPeriodEl.min = variationsConfig[variation].drawablePeriods[0]
		startPeriodEl.max = variationsConfig[variation].drawablePeriods[1]
		endPeriodEl.max = variationsConfig[variation].drawablePeriods[1]
		startPeriodEl.value = start
		if (startPeriodEl.value === startPeriodEl.min) startPeriodLeftEl.disabled = true
		if (startPeriodEl.value === startPeriodEl.max) startPeriodRightEl.disabled = true
		endPeriodEl.value = end
		if (endPeriodEl.value === endPeriodEl.min) endPeriodLeftEl.disabled = true
		if (endPeriodEl.value === endPeriodEl.max) endPeriodRightEl.disabled = true

		// Adds tick marks to assit in preventing overlap
		startPeriodListEl.innerHTML = '<option value="' + (end - 1) + '"></option>'
		endPeriodListEl.innerHTML = '<option value="' + (start + 1) + '"></option>'

		// Removes slider controls if no timeline range exists
		if (startPeriodEl.max === 0) periodGroupEl.classList.add('no-time-slider')
		else periodGroupEl.classList.remove('no-time-slider')

		// Disable delete if only one period
		if (pathWithPeriods.length === 1) periodDeleteEl.disabled = true

		startPeriodEl.addEventListener('input', () => {
			startPeriodUpdate(startPeriodEl.value)
		})
		startPeriodLeftEl.addEventListener('click', () => {
			startPeriodEl.value = parseInt(startPeriodEl.value) - 1
			startPeriodUpdate(startPeriodEl.value)
		})
		startPeriodRightEl.addEventListener('click', () => {
			startPeriodEl.value = parseInt(startPeriodEl.value) + 1
			startPeriodUpdate(startPeriodEl.value)
		})
		startPeriodViewEl.addEventListener('click', () => {
			updateTime(parseInt(startPeriodEl.value), getCurrentVariation())
			
			// Set zoom view
			periodCenter = calculateCenter(path)
			setView(periodCenter[0], periodCenter[1], setZoomByPath(path))
		})
		
		function getCurrentVariation() {
			return periodVariationEl[periodVariationEl.selectedIndex].value
		}

		function startPeriodUpdate(value) {
			endPeriodListEl.innerHTML = '<option value="' + (parseInt(value) + 1) + '"></option>'
			
			// Update time only when value changes
			if (startPeriodEl.value !== timelineSlider.value) {
				timelineSlider.value = value
				updateTime(parseInt(value), getCurrentVariation())
			}

			// Set start incremental button disabled states
			if (startPeriodEl.value === startPeriodEl.min) {
				startPeriodLeftEl.disabled = true
				startPeriodRightEl.disabled = false
			} else if (startPeriodEl.value === startPeriodEl.max) {
				startPeriodLeftEl.disabled = false
				startPeriodRightEl.disabled = true
			} else {
				// Starting area
				startPeriodLeftEl.disabled = false
				startPeriodRightEl.disabled = false
			}
		}

		endPeriodEl.addEventListener('input', () => {
			if (path.length >= 3) {
				periodCenter = calculateCenter(path)
			}
			endPeriodUpdate(endPeriodEl.value)
		})
		endPeriodLeftEl.addEventListener('click', () => {
			endPeriodEl.value = parseInt(endPeriodEl.value) - 1
			endPeriodUpdate(endPeriodEl.value)
		})
		endPeriodRightEl.addEventListener('click', () => {
			endPeriodEl.value = parseInt(endPeriodEl.value) + 1
			endPeriodUpdate(endPeriodEl.value)
		})
		endPeriodViewEl.addEventListener('click', () => {
			updateTime(parseInt(endPeriodEl.value), getCurrentVariation())

			// Set zoom view
			periodCenter = calculateCenter(path)
			setView(periodCenter[0], periodCenter[1], setZoomByPath(path))
		})
		function endPeriodUpdate(value) {
			startPeriodListEl.innerHTML = '<option value="' + (parseInt(value) + 1) + '"></option>'

			// Update time only when value changes
			if (endPeriodEl.value !== timelineSlider.value) {
				timelineSlider.value = value
			}
			updateTime(parseInt(value), getCurrentVariation(), true)

			// Set end incremental button disabled states
			if (endPeriodEl.value === endPeriodEl.min) {
				endPeriodLeftEl.disabled = true
				endPeriodRightEl.disabled = false
			} else if (endPeriodEl.value === endPeriodEl.max) {
				endPeriodLeftEl.disabled = false
				endPeriodRightEl.disabled = true
			} else {
				endPeriodLeftEl.disabled = false
				endPeriodRightEl.disabled = false
			}
		}

		periodDeleteEl.addEventListener('click', () => {
			if (pathWithPeriods.length === 1) return
			pathWithPeriods.splice(index, 1)
			initPeriodGroups()
		})
		periodDuplicateEl.addEventListener('click', () => {
			pathWithPeriods.push([pathWithPeriods[index][0], [...pathWithPeriods[index][1]]])
			initPeriodGroups()
		})
		periodVariationEl.addEventListener('input', event => {
			const newVariation = event.target.value
			const newVariationConfig = variationsConfig[newVariation]
			startPeriodEl.min = newVariationConfig.drawablePeriods[0]
			endPeriodEl.min = newVariationConfig.drawablePeriods[0]
			startPeriodEl.max = newVariationConfig.drawablePeriods[1]
			endPeriodEl.max = newVariationConfig.drawablePeriods[1]
			startPeriodEl.value = newVariationConfig.default
			endPeriodEl.value = newVariationConfig.default
			periodVariationEl.previousElementSibling.innerHTML = newVariationConfig.icon
			if (startPeriodEl.max === 0) periodGroupEl.classList.add('no-time-slider')
			else periodGroupEl.classList.remove('no-time-slider')
			pathWithPeriods[index][0] = `${newVariationConfig.code}:${newVariationConfig.default}`
			updateTime(newVariationConfig.default, newVariation)
		})

		periodCopyEl.addEventListener("click", event => {
			const index = parseInt(event.target.id.split('periodCopy')[1])
			if (event.target.textContent === " Copy") {
				event.target.className = "period-copy btn btn-primary btn-sm flex-fill"
				event.target.innerHTML = '<i class="bi bi-clipboard-x" aria-hidden="true"></i> End'
				periodClipboard.index = index
				periodClipboard.path = [...pathWithPeriods[index][1]]
				updatePeriodGroups()
			} else if (event.target.textContent === " End") {
				event.target.className = "period-copy btn btn-secondary btn-sm flex-fill"
				event.target.innerHTML = '<i class="bi bi-clipboard" aria-hidden="true"></i> Copy'
				periodClipboard.index = null
				periodClipboard.path = null
				updatePeriodGroups()
			} else if (event.target.textContent === " Paste") {
				pathWithPeriods[index][1] = [...periodClipboard.path]
				if (pathWithPeriods.length > 2) console.log(pathWithPeriods[2])
				initPeriodGroups()
			}
		})

		periodGroups.appendChild(periodGroupEl)

		for (const variation in variationsConfig) {
			const optionEl = document.createElement('option')
			optionEl.value = variation
			optionEl.textContent = variationsConfig[variation].name
			periodVariationEl.appendChild(optionEl)
		}

		periodVariationEl.value = variation
		periodVariationEl.previousElementSibling.innerHTML = variationsConfig[variation].icon

		periodGroupElements.push({
			periodGroupEl,
			startPeriodEl,
			startPeriodLeftEl,
			startPeriodRightEl,
			startPeriodViewEl,
			endPeriodEl,
			endPeriodLeftEl,
			endPeriodRightEl,
			endPeriodViewEl,
			periodVariationEl,
			periodCopyEl,
			periodDeleteEl,
			periodStatusEl
		})
	})

	updatePeriodGroups()
}

function updatePeriodGroups() {
	let pathToActive = []
	let lastActivePathIndex
	let currentActivePathIndex
	const currentActivePathIndexes = []

	periodGroupElements.forEach((elements, index) => {
		const {
			periodGroupEl,
			startPeriodEl,
			startPeriodLeftEl,
			startPeriodRightEl,
			endPeriodEl,
			endPeriodLeftEl,
			endPeriodRightEl,
			periodVariationEl,
			periodCopyEl,
			periodDeleteEl
		} = elements

		if (periodGroupEl.dataset.active === "true") lastActivePathIndex = index
		periodGroupEl.dataset.active = ""

		let periodCenter
		if (pathWithPeriods[index][1].length >= 3) periodCenter = calculateCenter(pathWithPeriods[index][1])

		if (isOnPeriod(
			parseInt(startPeriodEl.value),
			parseInt(endPeriodEl.value),
			periodVariationEl.value,
			currentPeriod,
			currentVariation
		)) {
			pathToActive = pathWithPeriods[index][1]
			currentActivePathIndex = index
			currentActivePathIndexes.push(index)
			periodGroupEl.dataset.active = "true"
		}

		pathWithPeriods[index][0] = formatPeriod(
			parseInt(startPeriodEl.value),
			parseInt(endPeriodEl.value),
			periodVariationEl.value
		)

		if (periodClipboard.index !== null) {
			if (index !== periodClipboard.index) {
				periodCopyEl.innerHTML = '<i class="bi bi-clipboard-plus" aria-hidden="true"></i> Paste'
				if (JSON.stringify(pathWithPeriods[index][1]) === JSON.stringify(periodClipboard.path)) {
					// If contents are identical prevent pasting
					periodCopyEl.innerHTML = '<i class="bi bi-clipboard-check" aria-hidden="true"></i> Paste'
					periodCopyEl.disabled = true
				} else {
					// Ready to paste
					periodCopyEl.innerHTML = '<i class="bi bi-clipboard-plus" aria-hidden="true"></i> Paste'
					periodCopyEl.disabled = false
				}
			} else {
				// Stop paste
				periodCopyEl.className = "period-copy btn btn-primary btn-sm flex-fill"
				periodCopyEl.innerHTML = '<i class="bi bi-clipboard-x" aria-hidden="true"></i> End'
				periodDeleteEl.disabled = true
				startPeriodEl.disabled = true
				startPeriodLeftEl.disabled = true
				startPeriodRightEl.disabled = true
				endPeriodEl.disabled = true
				endPeriodLeftEl.disabled = true
				endPeriodRightEl.disabled = true
			}
		} else {
			// Default state
			periodCopyEl.innerHTML = '<i class="bi bi-clipboard" aria-hidden="true"></i> Copy'
			periodCopyEl.disabled = false
			startPeriodEl.disabled = false
			endPeriodEl.disabled = false

			// Disable delete if only one period
			if (pathWithPeriods.length === 1) periodDeleteEl.disabled = true
			else periodDeleteEl.disabled = false

			// Set start incremental button disabled states
			if (startPeriodEl.value === startPeriodEl.min) {
				startPeriodLeftEl.disabled = true
				startPeriodRightEl.disabled = false
			} else if (startPeriodEl.value === startPeriodEl.max) {
				startPeriodLeftEl.disabled = false
				startPeriodRightEl.disabled = true
			} else {
				startPeriodLeftEl.disabled = false
				startPeriodRightEl.disabled = false
			}

			// Set end incremental button disabled states
			if (endPeriodEl.value === endPeriodEl.min) {
				endPeriodLeftEl.disabled = true
				endPeriodRightEl.disabled = false
			} else if (endPeriodEl.value === endPeriodEl.max) {
				endPeriodLeftEl.disabled = false
				endPeriodRightEl.disabled = true
			} else {
				endPeriodLeftEl.disabled = false
				endPeriodRightEl.disabled = false
			}
		}
	})

	periodsStatus.textContent = ""

	if (lastActivePathIndex !== undefined) {
		if (lastActivePathIndex === currentActivePathIndex) {
			// just update the path
			const {
				startPeriodEl,
				endPeriodEl,
				periodVariationEl
			} = periodGroupElements[currentActivePathIndex]
			pathWithPeriods[currentActivePathIndex] = [
				formatPeriod(
					parseInt(startPeriodEl.value),
					parseInt(endPeriodEl.value),
					periodVariationEl.value,
				),
				path
			]
			updatePath()
		} else if (currentActivePathIndex === undefined) {
			pathWithPeriods[lastActivePathIndex][1] = path
			updatePath([])
		} else {
			// switch the path
			pathWithPeriods[lastActivePathIndex][1] = path
			updatePath(pathToActive)

		}
	} else {
		updatePath(pathToActive)
	}

	drawing = disableDrawingOverride ? false : currentActivePathIndex !== undefined
}

function updatePath(newPath, newUndoHistory) {
	path = newPath || path
	if (path.length > 3) center = calculateCenter(path)
	render(path)
	undoButton.disabled = path.length === 0; // Maybe make it undo the cancel action in the future
	undoHistory = newUndoHistory || []
	redoButton.disabled = (!undoHistory.length)

	updateErrors()
}

function updateErrors() {
	if (path.length === 0) {
		periodsStatus.textContent = "No paths available on this period!"
	}

	const { conflicts, insufficientPaths, outOfBounds, periodOutOfBounds } = getErrors()
	let errorCount = 0
	// console.log(conflicts, invalidPaths, allErrors)

	periodGroupElements.forEach((el, index) => {
		const { periodStatusEl, startPeriodViewEl, endPeriodViewEl, periodGroupEl } = el
		periodStatusEl.textContent = ""
		periodStatusEl.classList.add("d-none")
		if (conflicts?.[index]) {
			periodStatusEl.textContent += `Period conflicts with path${conflicts[index].length === 1 ? "" : "s"} ${conflicts[index].join(", ")}.\n`
		}
		if (outOfBounds?.[index]) {
			periodStatusEl.textContent += `A point is placed out of bounds.\n`
		}
		if (periodOutOfBounds?.[index]) {
			periodStatusEl.textContent += `The period is out of bounds for editing.\n`
		}
		if (insufficientPaths?.[index] !== undefined) {
			periodStatusEl.textContent += `Insufficient paths. Got ${insufficientPaths[index]}, need at least 3.\n`
			startPeriodViewEl.disabled = true
			endPeriodViewEl.disabled = true
		} else {
			startPeriodViewEl.disabled = false
			endPeriodViewEl.disabled = false
		}
		if (periodStatusEl.textContent !== "") {
			periodStatusEl.classList.remove("d-none")
			periodGroupEl.dataset.status = "error"
			errorCount += 1
		}
	})

	if (errorCount > 0) {
		periodsStatus.textContent = `Problems detected. Please check the groups indicated by red.`
		finishButton.disabled = true
	} else {
		periodsStatus.textContent = ""
		finishButton.disabled = false
		periodGroupElements.forEach((elements, index) => {
			const { periodGroupEl } = elements
			if (periodGroupEl.dataset.active === "true") periodGroupEl.dataset.status = "active"
			else periodGroupEl.dataset.status = ""
		})
	}

	// Disable drawing during conflict
	if (Object.keys(conflicts).length === 0) {
		drawing = true
		disableDrawingOverride = false
		container.style.cursor = "crosshair"
	} else {
		drawing = false
		disableDrawingOverride = true
		container.style.cursor = "default"
	}
}

function getConflicts() {

	const conflicts = {}

	for (let i = pathWithPeriods.length - 1; i > 0; i--) {
		const [start1, end1, period1] = parsePeriod(pathWithPeriods[i][0])
		for (let j = 0; j < i; j++) {
			const [start2, end2, period2] = parsePeriod(pathWithPeriods[j][0])
			if (period1 !== period2) continue
			if (
				(start2 <= start1 && start1 <= end2) ||
				(start2 <= end1 && end1 <= end2) ||
				(start1 <= start2 && start2 <= end1) ||
				(start1 <= end2 && end2 <= end1)
			) {
				conflicts[i] ||= []
				conflicts[j] ||= []
				conflicts[i].push(j)
				conflicts[j].push(i)
			}
		}
	}

	return conflicts

}

function getOutOfBounds() {

	const outOfBounds = {}

	pathCheck: for (const i in pathWithPeriods) {
		const [period, path] = pathWithPeriods[i]
		const [start, end, variation] = parsePeriod(period)
		const checkedRefPeriods = []
		for (let j = start; j <= end; j++) {
			for (const [refPeriod, refRegion] of variationsConfig[variation]?.drawableRegions) {
				if (!isOnPeriod(refPeriod[0], refPeriod[1], variation, j, variation) || checkedRefPeriods.includes(refPeriod)) continue
				checkedRefPeriods.push(refPeriod)
				const [ refX1, refY1, refX2, refY2 ] = refRegion
				for (const point of path) {
					const isOutOfBounds = !pointIsInPolygon(point, [[refX1 - 2, refY1 - 2], [refX2 + 2, refY1 - 2], [refX2 + 2, refY2 + 2], [refX1 - 2, refY2 + 2]])
					if (!isOutOfBounds) continue
					outOfBounds[i] = true
					continue pathCheck
				}
			}
		}
	}

	return outOfBounds

}

function getPeriodOutOfBounds() {

	const outOfBounds = {}

	pathCheck: for (const i in pathWithPeriods) {
		const [period] = pathWithPeriods[i]
		// console.log(i)
		const [start, end, variation] = parsePeriod(period)
		for (let j = start; j <= end; j++) {
			const [refStart, refEnd] = variationsConfig[variation]?.drawablePeriods
			if (isOnPeriod(refStart, refEnd, variation, j, variation)) continue
			outOfBounds[i] = true
			continue pathCheck
		}
	}

	return outOfBounds

}

function getErrors() {
	const insufficientPaths = {}

	pathWithPeriods.forEach(([period, path], i) => {
		if (path.length < 3) insufficientPaths[i] = path.length
	})

	// console.info('conflicts', conflicts)
	// console.info('invalid paths', invalidPaths)

	return {
		conflicts: getConflicts(),
		insufficientPaths,
		outOfBounds: getOutOfBounds(),
		periodOutOfBounds: getPeriodOutOfBounds()
	}
}

// function compressPeriod(periodsString) {
// 	let periodStrings = periodsString.split(", ")
// 	let validPeriods = new Set()
// 	periodStrings.forEach(periodString => {
// 		let [start, end] = parsePeriod(periodString)
// 		for (var i = start; i <= end; i++) {
// 			validPeriods.add(i)
// 		}
// 	})
// 	validPeriods = [...validPeriods].sort()
// }
