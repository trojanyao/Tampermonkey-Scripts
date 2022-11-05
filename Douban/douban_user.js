// ==UserScript==
// @name         豆瓣评分隐藏
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  有时候，在看电影之前不想先看到评分，被先入为主。因此，该脚本可以暂时隐藏豆瓣评分，点击按钮可以查看评分。
// @author       TROJANYAO
// @match        https://movie.douban.com/*
// @grant        none
// ==/UserScript==

document.addEventListener("DOMContentLoaded", addMask())
initCSS()
showRate()
deleteTheShit()

// 初始化 CSS 样式
function initCSS() {
	// 插入新的样式表
	let newStyle = document.createElement("style")
	newStyle.type = "text/css"
	newStyle.innerHTML =
		"#show-rate {" +
		"color: #27a;" +
		"padding: 5px 10px;" +
		"position: absolute;" +
		"top: 50%;" +
		"left: 50%;" +
		"transform: translate(-50%, -50%);" +
		"z-inde: 1000;" +
		"border: 1px solid #27a;" +
		"border-radius: 20px;" +
		"cursor: pointer;" +
		"background: transparent;" +
		"}" +
		"@keyframes removeMask{" +
		"0{filter: blur(10px)}" +
		"100%{filter: blur(0)}" +
		"}" +
		"remove-mask{" +
		"animation: 5000ms removeMask" +
		"}"

	document.querySelector("head").appendChild(newStyle)
}

// 毛玻璃效果
function addMask() {
	// 获取评分容器及其子容器
	let interest = document.querySelector("#interest_sectl")
	let rating = interest.querySelector(".rating_wrap")
	let better_than = interest.querySelector(".rating_betterthan")

	// 对子容器分别实现毛玻璃效果
	rating.style.filter = "blur(10px)"
	better_than.style.filter = "blur(10px)"

	// 禁用原有的 :hover 样式
	rating.style.pointerEvents = "none"
	better_than.style.pointerEvents = "none"

	//rating.style.transition = 'filter .1s linear';
	//better_than.style.transition = 'filter .1s linear';
}

// 显示评分
function showRate() {
	// 获取评分容器及其子容器
	let interest = document.querySelector("#interest_sectl")
	let rating = interest.querySelector(".rating_wrap")
	let better_than = interest.querySelector(".rating_betterthan")

	rating.style.transition = "filter 200ms linear"
	better_than.style.transition = "filter 200ms ease-in"

	// 调整外层容器 position ，以让按钮定位
	interest.style.position = "relative"

	// 创建 “显示评分” 按钮
	let show_rate = document.createElement("button")
	show_rate.id = "show-rate"
	show_rate.innerHTML = "显示评分"

	// 追加 “显示评分” 按钮
	interest.appendChild(show_rate)

	// “显示评分” 按钮 :hover 样式
	show_rate.onmouseover = function () {
		show_rate.style.color = "white"
		show_rate.style.background = "#27a"
	}

	show_rate.onmouseout = function () {
		show_rate.style.color = "#27a"
		show_rate.style.background = "transparent"
	}

	// “显示评分” 按钮点击事件
	show_rate.onclick = function () {
		//rating.classList.add('remove-mask');
		//better_than.classList.add('remove-mask');

		rating.style.filter = ""
		better_than.style.filter = ""

		show_rate.style.display = "none"

		// 回复原有的 :hover 样式
		rating.style.pointerEvents = ""
		better_than.style.pointerEvents = ""
	}
}

// 移除短评和影评
function deleteTheShit() {
	const comment = document.querySelector("#comments-section")
	comment.style.display = "none"

	const reviews = document.querySelector("#reviews-wrapper")
	reviews.style.display = "none"
}
