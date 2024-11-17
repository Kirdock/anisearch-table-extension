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

    if(!ratingElement) {
        return;
    }

    const ratingValue = ratingElement.attributes['data-rating']?.value;

    if(!ratingValue) {
        return;
    }

    const data = JSON.parse(ratingValue);
    setDefaultLang(data, 6, defaultLang);
    setDefaultLang(data, 7, defaultSubtitle);

    ratingElement.setAttribute('data-rating', JSON.stringify(data));

    function setDefaultLang(array, index, defaultString) {
        if (array[index] !== 'xx') {
            return;
        }
        array[index] = defaultString;
    }
})();
