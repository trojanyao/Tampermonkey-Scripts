// ==UserScript==
// charset=utf-8
// @name         Unsplash 下载文件名修改 Unsplash Change Photo Name
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Change the file name of download photo.
// @author       TROJAN
// @match        https://unsplash.com/photos/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    async function changeName() {
        // 获取下载按钮
        let a = document.querySelector('header > div:last-child > div:last-child > div > a')

        // ----- 图片信息 -----
        // 发布日期
        let dateStr = document.querySelector('time').innerText
        let date = new Date(dateStr).toLocaleDateString().replace(/\//g, '.')
        // 位置
        let location = document.querySelector('header+div > div > div > div:last-child > div:nth-child(4) > div')
        location = location?.innerText || undefined
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
        a.download = `${date} ${location ? '【' + location + '】' : ' '}Photo by ${photographer} [${link}].jpg`
    }

    window.onload = () => {
        changeName()
    }
})();