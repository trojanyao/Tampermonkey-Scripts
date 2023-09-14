// ==UserScript==
// @name         新标签页打开微博
// @version      0.1
// @description  直接从微博底部工具栏在新标签页打开微博
// @author       minimalistrojan
// @match        https://weibo.com/*
// @icon         https://www.google.com/s2/favicons?domain=weibo.com
// @grant        none
// @require
// ==/UserScript==

(function () {
	// window.onload 全局只会运行一次，可能会和其他冲突，因此使用 addEventListener
	window.addEventListener("load", function () {
		setTimeout(() => {
			/* === 查找微博列表 === */
			const weiboList = document.querySelectorAll("article.woo-panel-main");

			/* === 遍历微博列表 === */
			weiboList.forEach((weibo) => {
				/* === 查找微博链接 === */
				const weiboLink = weibo.querySelector(
					"header > .woo-box-item-flex > .woo-box-flex > .woo-box-flex:last-child > a"
				).href;

				/* === 底部容器 === */
				const toolbar = weibo.querySelector(
					"footer > .woo-box-flex > .woo-box-item-flex > .woo-box-flex"
				);

				/* === 创建按钮 === */
				const newBtn = document.createElement("div");

				// 查找子元素类名
				const toolItemClassName = toolbar.querySelector(".woo-box-item-flex").className;

				newBtn.className = toolItemClassName;
				newBtn.style.fontSize = "14px";
				newBtn.innerHTML = `<a href="${weiboLink}" target="blank" style="color: grey; text-decoration: none;">新标签页打开</a>`;

				/* === 追加按钮 === */
				toolbar.appendChild(newBtn);
			});
		}, 1000);
	});
})();
