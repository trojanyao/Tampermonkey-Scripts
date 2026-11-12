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

    // 下载链接形如 /photos/<id>/download?ixid=...&force=true
    const DOWNLOAD_LINK = 'a[href*="/photos/"][href*="/download"]'

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

    async function buildFileName(link) {
        // 下载链接里的照片 ID
        const id = new URL(link.href).pathname.match(/^\/photos\/([^/]+)\/download/)?.[1]
        // 当前页面的照片 slug，如 a-mountain-range-...-P94s4MYZpuc
        const pageSlug = window.location.pathname.match(/^\/photos\/([^/]+)/)?.[1]
        const onPhotoPage = !!(pageSlug && id && pageSlug.endsWith(id))

        const info = await fetchPhotoInfo([id, onPhotoPage ? pageSlug : null])
        console.log('照片信息', info)

        const slug = info?.slug || (onPhotoPage ? pageSlug : id)

        // 发布日期
        const datetime = (onPhotoPage && document.querySelector('time')?.getAttribute('datetime'))
            || info?.created_at || ''
        const date = datetime.slice(0, 10).replace(/-/g, '.')

        // 摄影师：@username
        const username = info?.user?.username ? `@${info.user.username}` : getPhotographerFromDOM(link)
        const photographer = sanitize(username) || '未知摄影师'

        // 地址，没有则用标题（alt_description，即未登录时页面显示的标题），都没有则为空
        const title = sanitize(info?.alt_description || info?.description)
        const place = sanitize(info?.location?.name || info?.location?.title)
            || (title && title[0].toUpperCase() + title.slice(1))

        return `${date}【${photographer}】${place ? place + ' ' : ''}[${slug}].jpg`
    }

    let downloading = false

    // 在点击时拦截下载，保证 SPA 跳转后、页面刚打开时都能生效
    document.addEventListener('click', async (event) => {
        const link = event.target.closest?.(DOWNLOAD_LINK)
        if (!link || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return

        event.preventDefault()
        event.stopImmediatePropagation()
        if (downloading) return
        downloading = true

        const prevCursor = link.style.cursor
        link.style.cursor = 'progress'
        try {
            const [fileName, blob] = await Promise.all([
                buildFileName(link),
                fetch(link.href).then(res => {
                    if (!res.ok) throw new Error(`HTTP ${res.status}`)
                    return res.blob()
                }),
            ])

            const url = URL.createObjectURL(blob)
            const tmp = document.createElement('a')
            tmp.href = url
            tmp.download = fileName
            document.body.appendChild(tmp)
            tmp.click()
            tmp.remove()
            // 延迟释放，避免下载尚未开始就被回收
            setTimeout(() => URL.revokeObjectURL(url), 60 * 1000)
            console.log('✅ 已下载：', fileName)
        } catch (error) {
            console.error('[自定义文件名下载失败，改用默认下载] ', error)
            window.location.href = link.href
        } finally {
            link.style.cursor = prevCursor
            downloading = false
        }
    }, true)
})();
