// ==UserScript==
// @license      MIT License
// @name         Unsplash 下载文件名修改 Unsplash Change Photo Name
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Change the file name of download photo.
// @author       TROJAN
// @match        https://unsplash.com/photos/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.2/moment.min.js
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    async function changeName() {
        // 获取下载按钮
        let a = document.querySelector('header > div:last-child > div:last-child > div > a')

        // ----- 图片信息 -----
        // 发布日期
        let date, dateStr = document.querySelector('time').innerText
        if (dateStr.includes('ago')) {
            // 最近发布，无确切日期
            let daysAgo = dateStr.match(/\d+/g)?.[0]
            console.log('几天前', daysAgo)
            date = moment().subtract(daysAgo).format('YYYY.MM.DD')
        } else {
            // 较早发布，有准确日期
            date = new Date(dateStr).toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '.')
        }
        console.log('日期', date)

        // 位置
        let location = document.querySelector('header+div > div > div > div:last-child > div:nth-child(3) > div')
        location = location?.innerText || undefined
        if (location === 'Share') {
            location = document.querySelector('header+div > div > div > div:last-child > div:nth-child(4) > div')
            location = location?.innerText || undefined
        }
        // 作者
        let photographer = document.querySelector('header+div > div > div > div > header > div > span > div:last-child > span a').href
        photographer = photographer.match(/\@\w+/)[0]
        // 链接
        let link = document.URL.replace('https://', '')
        // console.log('链接', link)
        // 图片地址（跨域获取）
        a.removeAttribute('target')
        let imgUrl = a.href
        const res = await fetch(imgUrl)
        const blob = await res.blob()
        imgUrl = window.URL.createObjectURL(blob)
        // console.log('图片实际地址', imgUrl)
        a.href = imgUrl

        // 修改文件名
        a.download = `${date}${location ? '【' + location + '】' : ' '}Photo by ${photographer} [${link}].jpg`
    }

    window.onload = () => {
        changeName()
    }
})();
