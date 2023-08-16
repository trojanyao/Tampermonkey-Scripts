// ==UserScript==
// @name         微博直接跳转详情页
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  微博底部工具栏增强：直接复制链接，或在新标签页中打开详情
// @author       You
// @include      https://weibo.com/*
// @icon         https://www.google.com/s2/favicons?domain=weibo.com
// @grant        none
// @require
// ==/UserScript==

(function () {
	window.onload = function () {
		// 引入 Toast Notification（消息提示）库
		var css = document.createElement('link')
		css.setAttribute('rel', 'stylesheet')
		css.setAttribute('type', 'text/css')
		css.href = "https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css"
		console.log('引入样式表', css)
		document.head.appendChild(css)

		// 添加页面 <script> 元素
		let script = document.createElement('script')
		script.setAttribute('type', 'text/javascript')
		script.src = "https://cdn.jsdelivr.net/npm/toastify-js"
		document.head.appendChild(script)


		// 获取微博卡片
		var cards = document.querySelectorAll('article.woo-panel-main');
		console.log('微博卡片', cards);

		// 微博卡片循环遍历
		for (var i = 0; i < cards.length; i++) {
			var btnsWrap = cards[i].querySelector('footer .woo-box-flex')
			// console.log('按钮列表容器', btnsWrap)

			// ----- 取消收藏 -----
			// 1. 创建取消收藏按钮
			var cancelBtn = document.createElement('div')
			cancelBtn.classList.add('woo-box-item-flex')
			cancelBtn.innerHTML = `<div id="${i}" class="woo-box-flex woo-box-alignCenter woo-box-justifyCenter">取消收藏</div>`
			cancelBtn.style.color = 'grey'
			cancelBtn.style.fontSize = '12px'
			cancelBtn.style.cursor = 'pointer'
			// console.log('取消收藏按钮', cancelBtn)

			// 提取点击下拉菜单
			let dropdown = cards[i].querySelector('span.woo-pop-ctrl > div > i')


			// 2. 添加点击事件监听
			cancelBtn.addEventListener('click', (e) => {
				// let id = parseInt(e.target.id)
				// console.log(id)
				
				console.log('右上角按钮', dropdown)
				dropdown.click()

				// setTimeout(() => {
				// 	// 提取点击取消收藏
				// 	var cancelFav = cards[id].querySelector('.woo-pop-wrap-main > div + div')
				// 	console.log('取消收藏按钮', cancelFav)
				// 	// cancelFav.click()
				// }, 1000)
			})


			// 1. 提取取消收藏按钮
			// if (i === 0) {
			// 	// 提取点击下拉菜单
			// 	var dropdown = cards[0].querySelector('span.woo-pop-ctrl > div > i')
			// 	console.log('右上角按钮', dropdown)
			// 	dropdown.click()

			// 	setTimeout(() => {
			// 		// 提取点击取消收藏
			// 		var cancelFav = cards[0].querySelector('.woo-pop-wrap-main > div + div')
			// 		console.log('取消收藏按钮', cancelFav)
			// 		// cancelFav.click()
			// 	}, 1000)
			// }

			// 插入按钮
			btnsWrap.appendChild(cancelBtn)



			// 1. 提取原始链接
			// var link = cards[i].querySelector('header > div > div > div + div a').href
			// console.log('原始链接', link)


			// 创建按钮（打开链接）
			// var openBtn = document.createElement('div')
			// openBtn.innerHTML = `<a href="${link}" target="blank"><span><span>微博链接</span></span></a>`
			//console.log('打开按钮', openBtn)


			// 创建按钮（复制链接）
			// var copyBtn = document.createElement('li')
			// copyBtn.innerHTML = `<a class="S_txt2"><span class="pos"><span class="line S_line1">复制</span></span></a>`
			// copyBtn.addEventListener('click', function (e) {
			// 	try {
			// 		navigator.clipboard.writeText(e.target.closest('li').previousElementSibling.firstElementChild.href)
			// 		console.log('复制成功')
			// 		Toastify({
			// 			text: "复制成功",
			// 			duration: 1000,
			// 			gravity: "bottom", // `top` or `bottom`
			// 			position: "center", // `left`, `center` or `right`
			// 			style: { background: 'linear-gradient(to bottom, #fa7d3c 0%,#f56010 100%)' },
			// 			stopOnFocus: true, // Prevents dismissing of toast on hover
			// 		}).showToast();
			// 	} catch (err) {
			// 		console.error('复制失败', err)
			// 	}
			// 	// console.log('剪贴板对象', navigator.clipboard)

			// })

			// 插入按钮
			// btnList.insertBefore(openBtn, shareBtn)
			// btnList.insertBefore(copyBtn, shareBtn)

			// 修改按钮样式
			// btnList.querySelectorAll('li').forEach(li => {
			// 	li.style.width = '16.5%'
			// })
		}

		// ########## 一键打开所有微博 ##########
		// var openAll = document.createElement('div')
		// openAll.innerHTML = '<div>一键打开本页所有微博</div>'
		// openAll.style = 'position: fixed; top: 10px; right: 10px; z-index: 9999; padding: 10px; border: 1px solid #fa7d3c;'
		// openAll.onclick = function () {
		// 	// 获取链接数组
		// 	let linkArr = []
		// 	let cards = document.querySelectorAll('.WB_feed_type');
		// 	for (let i = 0; i < cards.length; i++) {
		// 		let btnList = cards[i].querySelector('.WB_feed_handle ul')
		// 		let shareBtn = btnList.querySelectorAll('li')[3]
		// 		console.log('分享按钮', shareBtn)
		// 		let link = shareBtn.querySelector('a').getAttribute('action-data').match(/https:\/\/\S+&mid/g)[0].replace('&mid', '')
		// 		if (link.includes('&url=')) {
		// 			// 转发微博（格式：<原微博链接>&url=<当前微博链接>）提取当前微博的原始链接
		// 			link = link.match(/&url=(.+)/)[1]
		// 		}

		// 		let a = document.createElement('a')
		// 		a.href = link
		// 		a.target = '_blank'
		// 		a.click()
		// 		console.log('打开新标签页', link)
		// 	}
		// }
		// document.querySelector('body').appendChild(openAll)


		// ########## 一键取消本页所有微博收藏 ##########
		// var cancelAll = document.createElement('div')
		// cancelAll.innerHTML = '<div>一键取消本页所有收藏</div>'
		// cancelAll.style = 'position: fixed; top: 60px; right: 10px; z-index: 9999; padding: 10px; border: 1px solid #fa7d3c;'
		// cancelAll.onclick = function () {
		// 	let cards = document.querySelectorAll('.WB_feed_type');
		// 	for (let k = 0; k < cards.length; k++) {
		// 		let cancelFav = cards[k].querySelector('.WB_feed_handle ul').querySelectorAll('li')[0].querySelector('a')
		// 		console.log('收藏按钮', cancelFav)
		// 		cancelFav.click()
		// 	}
		// }
		// document.body.appendChild(cancelAll)
	}
})();