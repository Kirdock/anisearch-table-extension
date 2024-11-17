// ==UserScript==
// @name         anisearch-rating-default-lang
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Sets a default lang for language and subtitle for rating
// @author       Kirdock
// @match        https://www.anisearch.de/anime/*
// @icon         https://www.anisearch.de/favicon-196x196.png
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    const defaultLang = 'ja';
    const defaultSubtitle = 'de';
    const ratingElement = document.querySelector('[data-rating]');

    if (!ratingElement) {
        return;
    }

    const ratingValue = ratingElement.attributes['data-rating']?.value;

    if (!ratingValue) {
        return;
    }
    const data = JSON.parse(ratingValue);
    data[6] = data[6] === 'xx' ? defaultLang : data[6];
    data[7] = data[7] === 'xx' ? defaultSubtitle : data[7];
    ratingElement.setAttribute('data-rating', JSON.stringify(data));
})();
