/*!
 * The 2017 r/place Atlas
 * Copyright (c) 2017 Roland Rytz <roland@draemm.li>
 * Copyright (c) 2022 Place Atlas contributors
 * Licensed under AGPL-3.0 (https://2017.place-atlas.stefanocoding.me/license.txt)
 */

window.addEventListener("error", e => {
	console.error(e)
	let errorMessage = "<h4 class=\"mb-3\">An error has occurred:</h4>"
	errorMessage += "<p class=\"text-danger\">" + e.message + "</p>"
	errorMessage += "<p class=\"text-danger\">on line " + e.lineno + "</p>"
	errorMessage += "<p>If this keeps happening, feel free to tell us on <a href=\"https://discord.gg/pJkm23b2nA\">our Discord server</a>.</p>"
	document.getElementById("loadingContent").innerHTML = errorMessage
})

function getPositionOfEntry(entry) {
	let startX = canvasSize.x, startY = canvasSize.y
	for (const [x, y] of entry.path) {
		startX = Math.min(x, startX)
		startY = Math.min(y, startY)
	}
	if (startX === canvasSize.x || startY === canvasSize.y) return null
	return [parseInt(startX), parseInt(startY)]
}

const areaMap = new Map()

// Modified from https://stackoverflow.com/a/33670691
function calcPolygonArea(vertices) {
	const hit = areaMap.get(vertices)
	if (hit) {
		return hit
	}

	let total = 0

	for (let i = 0, l = vertices.length; i < l; i++) {
		const addX = vertices[i][0]
		const addY = vertices[i === vertices.length - 1 ? 0 : i + 1][1]
		const subX = vertices[i === vertices.length - 1 ? 0 : i + 1][0]
		const subY = vertices[i][1]

		total += (addX * addY * 0.5)
		total -= (subX * subY * 0.5)
	}

	const area = Math.floor(Math.abs(total))
	areaMap.set(vertices, area)

	return area
}