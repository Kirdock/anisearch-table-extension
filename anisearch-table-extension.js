// ==UserScript==
// @name         Anisearch table extension
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Adds update, start and end date to the anime table
// @author       Kirdock
// @match        https://www.anisearch.de/usercp/list/anime*
// @match        https://www.anisearch.com/usercp/list/anime*
// @icon         https://www.anisearch.de/favicon-196x196.png
// @grant        GM_addStyle
// ==/UserScript==

(function() {
    'use strict';
    const tld = new URL(window.location.href).host.split('.').pop();
    const langDict = {
        com: {
            updateDate: 'Update Date',
            endDate: 'Finish Date',
            fromDate: 'Start Date'
        },
        de: {
            updateDate: 'Änderungsdatum',
            endDate: 'Enddatum',
            fromDate: 'Startdatum'
        }
    };
    const selectedDict = langDict[tld] ?? langDict.com;

    const config = [
        {
            name: selectedDict.fromDate,
            sort: 'from_date',
            arrayIndex: 15,
        },
        {
            name: selectedDict.endDate,
            sort: 'end_date',
            arrayIndex: 16,
        },
        {
            name: selectedDict.updateDate,
            sort: 'updated',
            arrayIndex: 14,
        },
    ]

    const table = document.querySelector('#content-inner table');
    if(!table) {
        return;
    }
    const headerCount = table.querySelectorAll('thead th')?.length;
    if(headerCount !== 5) {
        return;
    }

    GM_addStyle(`
    table tr>th:nth-child(1) {
      width: 260px;
    }
    table tr>th:nth-child(3) {
      width: 100px !important;
    }
    `);

    for(const conf of config) {
        addHeader(table, conf.name, conf.sort);
    }

    const rows = table.querySelectorAll('tbody>tr');

    for (const row of rows) {
        // status, id, ?, # half stars, ?, ?, language, subtitle, ?, watched/max episodes, ?, ?, ?, ?, update date, from date, end date, notes, ? array, watched/max episodes, ?, ?, ?
        const data = JSON.parse(row.querySelector('div[data-rating]').attributes['data-rating'].value);

        for (const conf of config) {
            const date = secondsToDateString(data[conf.arrayIndex]);
            appendCell(row, date, conf.name);
        }
    }

    function secondsToDateString(seconds) {
        if(seconds === 0) {
            return '';
        }
        return new Date(seconds * 1000).toLocaleDateString();
    }

    function appendCell(row, text, title) {
        const beforeElement = row.querySelector('[data-title="Bewertung"]');
        const cell = document.createElement('td');
        cell.innerText = text;
        cell.setAttribute('data-title', title);
        row.insertBefore(cell, beforeElement);
    }

    function addHeader(table, headerName, sortIdenticator) {
        const header = table.querySelector('thead>tr');
        const newHeader = document.createElement('th');
        const beforeElement = document.querySelector('th:nth-last-child(2)');


        if (sortIdenticator) {
            const currentUrl = new URL(window.location.href);
            const oldSort = currentUrl.searchParams.get('sort');
            const innerLink = document.createElement('a');


            currentUrl.searchParams.set('sort', sortIdenticator);
            if (oldSort === sortIdenticator) {
                const isDesc = currentUrl.searchParams.get('order') === 'desc';
                const newOrder = isDesc ? 'asc' : 'desc';
                currentUrl.searchParams.set('order', newOrder);
                innerLink.setAttribute('class', isDesc ? 'down' : 'up');
            }

            innerLink.innerText = headerName;
            innerLink.setAttribute('href', `${currentUrl.pathname.substring(1)}${currentUrl.search}`);
            newHeader.appendChild(innerLink);
        } else {
            newHeader.innerText = headerName;
        }
        header.insertBefore(newHeader, beforeElement);
    }
})();