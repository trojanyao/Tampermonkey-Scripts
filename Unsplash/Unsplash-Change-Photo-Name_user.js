// ==UserScript==
// @name         Unsplash 下载文件名修改 Unsplash Change Photo Name
// @license      MIT License
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Change the file name of download photo.
// @author       TROJAN
// @match        https://unsplash.com/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.2/moment.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/441752/Unsplash%20%E4%B8%8B%E8%BD%BD%E6%96%87%E4%BB%B6%E5%90%8D%E4%BF%AE%E6%94%B9%20Unsplash%20Change%20Photo%20Name.user.js
// @updateURL https://update.greasyfork.org/scripts/441752/Unsplash%20%E4%B8%8B%E8%BD%BD%E6%96%87%E4%BB%B6%E5%90%8D%E4%BF%AE%E6%94%B9%20Unsplash%20Change%20Photo%20Name.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 去掉文件名中的非法字符
    function sanitize(str) {
        return (str || '')
            .replace(/[\\/:*?"<>|\r\n\t]+/g, ' ')
            .replace(/\s+/g, ' ')
            .trim()
    }

    // 通过 Unsplash 站内接口获取照片信息（比 DOM 层级选择器稳定）
    async function fetchPhotoInfo(ids) {
        for (const id of new Set(ids.filter(Boolean))) {
            try {
                const res = await fetch(`/napi/photos/${id}`, { credentials: 'include' })
                if (res.ok) return await res.json()
            } catch (error) {
                console.warn('[获取照片信息失败] ', id, error)
            }
        }
        return null
    }

    // DOM 兜底：在下载按钮附近查找摄影师主页链接（/@username）
    function getPhotographerFromDOM(link) {
        let node = link
        while (node && node !== document.body) {
            const profile = [...node.querySelectorAll('a[href*="/@"]')]
                .find(a => /^\/@[^/?#]+$/.test(new URL(a.href).pathname))
            if (profile) return new URL(profile.href).pathname.slice(1)
            node = node.parentElement
        }
        return undefined
    }

    async function changeName() {
        // 获取下载按钮
        let a = document.querySelector('header > div:last-child > div:last-child > div > a')

        // 当前页面的照片 slug，如 a-mountain-range-...-P94s4MYZpuc
        const pageSlug = window.location.pathname.match(/^\/photos\/([^/]+)/)?.[1]
        if (!pageSlug) return

        const info = await fetchPhotoInfo([pageSlug, pageSlug.slice(-11)])
        console.log('照片信息', info)

        const slug = info?.slug || pageSlug

        // ----- 图片信息 -----
        // 发布日期
        const datetime = document.querySelector('time')?.getAttribute('datetime') || info?.created_at || ''
        const date = datetime.slice(0, 10).replace(/-/g, '.')

        // 摄影师：@username
        const username = info?.user?.username ? `@${info.user.username}` : getPhotographerFromDOM(a)
        const photographer = sanitize(username) || '未知摄影师'

        // 地址，没有则用标题（alt_description，即未登录时页面显示的标题），都没有则为空
        const title = sanitize(info?.alt_description || info?.description)
        const place = sanitize(info?.location?.name || info?.location?.title)
            || (title && title[0].toUpperCase() + title.slice(1))

        // 图片地址（跨域获取）
        try {
            a.removeAttribute('target')
            let imgUrl = a.href
            const res = await fetch(imgUrl)
            const blob = await res.blob()
            imgUrl = window.URL.createObjectURL(blob)
            console.log('图片实际地址', imgUrl)
            a.href = imgUrl
        } catch(error) {
            console.error('[跨域获取图片 Blob 地址失败] ', error)
        }

        // 修改文件名
        a.download = `${date}【${photographer}】${place ? place + ' ' : ''}[${slug}].jpg`
        console.log('✅ 可以下载：', a.download)
    }

    window.onload = () => {
        changeName()
    }
})();
