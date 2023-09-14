// ==UserScript==
// @name         微博取消收藏
// @version      0.1
// @description  直接从微博底部工具栏取消收藏
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
				newBtn.innerText = "取消收藏";

				/* === 按钮事件 === */
				newBtn.addEventListener("click", async () => {
					// 右上角菜单
					const toggleBtn = weibo.querySelector(".woo-pop-ctrl > .woo-box-flex i");

					await toggleBtn.click();

					// 查找取消收藏按钮
					const cancelBtn = document.querySelectorAll(".woo-pop-wrap-main .woo-box-flex")[1];
					cancelBtn.click();
				});

				/* === 追加按钮 === */
				toolbar.appendChild(newBtn);
			});
		}, 1500);
	});
})();
