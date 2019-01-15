// ==UserScript==
// @name         Abduzeedo(New Version) Hyperlink Underline
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add underline for hyperlink of new version Abduzeedo.com
// @author       TROJAN
// @match        https://abduzeedo.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    // 获取文章中的超链接
    var article = document.querySelector('article');
    var alink = article.querySelectorAll('a');

    // 使用 forEach 遍历，为超链接添加下划线
    alink.forEach((a) => {
        a.style.textDecoration = 'underline';
    });
})();