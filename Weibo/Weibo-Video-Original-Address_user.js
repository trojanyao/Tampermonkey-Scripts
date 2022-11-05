// ==UserScript==
// @name         微博直接跳转详情页
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  获取微博视频直链
// @author       You
// @include      https://weibo.com/*
// @icon         https://www.google.com/s2/favicons?domain=weibo.com
// @grant        none
// @require
// ==/UserScript==

(function () {
	window.onload = function () {
		// 获取视频直链
		// 获取「微博视频」或「H5视频」
		var rawUrl, video = document.querySelector('.WB_video') || document.querySelector('[node-type=fl_h5_video]')
		console.log('视频组件', video)
		let videoSource = video.getAttribute('video-sources')
		if (videoSource) {
			videoSource = decodeURIComponent(decodeURIComponent(videoSource))
			console.log('原始链接', videoSource)
			let videoArr = videoSource.match(/quality_label_list=(\[[\S\s]+\])/)?.[1]
			videoArr = JSON.parse(videoArr)
			console.log('视频对象数组', videoArr)
			console.log('视频链接', videoArr[0].url)
			navigator.clipboard.writeText(videoArr[0].url)
		} else if (video.getAttribute('action-data')) {
			// H5 视频
			rawUrl = video.getAttribute('action-data')
			var realUrl = decodeURIComponent(rawUrl).match(/video_src=(\S+)$/)[1]
			console.log('视频链接', 'https:' + realUrl)
			navigator.clipboard.writeText(`https:${realUrl}`)
		}
	}
})();