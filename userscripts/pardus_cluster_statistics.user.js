// ==UserScript==
// @name         Pardus Cluster Statistics
// @namespace    http://userscripts.xcom-alliance.info/, https://github.com/Tsunder/pardus-script-fun-pack
// @version      1.2
// @description  Indicate whether a starbase has increased or decreased it's population since the last time you viewed the Pardus Cluster Statistics page. Now with a reminder in the message bar.
// @author       Miche (Orion) / Sparkle (Artemis), featuring tsunder
// @match        http*://*.pardus.at/statistics.php*
// @match        *.pardus.at/msgframe.php*
// @grant        GM_getValue
// @grant        GM_setValue
// @updateURL    https://github.com/Tsunder/pardus-script-fun-pack/raw/master/userscripts/pardus_cluster_statistics.user.js
// @downloadURL  https://github.com/Tsunder/pardus-script-fun-pack/raw/master/userscripts/pardus_cluster_statistics.user.js
// ==/UserScript==

(function() {
    'use strict';
    let populationUnchangedColor = '#FFFF00'; // yellow
    let populationIncreaseColor = '#229922'; // green
    let populationDecreaseColor = '#D21414'; // red
    let universe = window.location.host.substr(0, window.location.host.indexOf('.'));

    let lowPopThreshold = 1001; // 1000 pop is about 12 ticks (1.5 days) before downgrade. 1500 about 16 ticks (2 days). 850 about 8 ticks (1 day)
    let lowPopFontSize = "24px"; // 2x as large as regular
    let lowPopColour = '#FFA500'; // orange
    let healthy = true;

    if (document.location.pathname.includes("statistics.php")) {

        function parseContingent(tableEl) {
            for (let i=1; i<tableEl.rows.length; i++) {
                let rowEl = tableEl.rows[i];
                let sbName = rowEl.cells[2].textContent;
                let sbPopNew = rowEl.cells[3].textContent.replace(/[,]/g, '');
                let sbPopOld = GM_getValue(universe + sbName.replace(/\s+/g, ''), sbPopNew);
                // cast the population strings into numbers
                sbPopNew = sbPopNew - 0;
                sbPopOld = sbPopOld - 0;
                let color = populationUnchangedColor;
                if (sbPopNew < sbPopOld) {
                    color = populationDecreaseColor;
                    if (sbPopNew < lowPopThreshold) {
                        rowEl.style.fontSize = lowPopFontSize;
                        color = lowPopColour;
                        healthy = false;
                    }
                } else if (sbPopNew > sbPopOld) {
                    color = populationIncreaseColor;
                }
                rowEl.style.color = color;
                let title = '';
                if (sbPopNew !== sbPopOld ) {
                    title = 'Population was: ' + sbPopOld;
                }
                rowEl.title = title;
                rowEl.style.cursor = 'default';
            }
        }

        function parseAllContginents() {
            let tableEl = h1El.parentNode.parentNode.querySelector('table[width="100%"]');
            let tableElTables = tableEl.querySelectorAll('table');
            parseContingent(tableElTables[0]); // PFC
            parseContingent(tableElTables[1]); // PEC
            parseContingent(tableElTables[2]); // PUC
        }

        function updateSavedValuesForContingent(tableEl) {
            for (let i=1; i<tableEl.rows.length; i++) {
                let rowEl = tableEl.rows[i];
                let sbName = rowEl.cells[2].textContent;
                let sbPop = rowEl.cells[3].textContent.replace(/[,]/g, '');
                GM_setValue(universe + sbName.replace(/\s+/g, ''), sbPop);
            }
        }

        function updateAllSavedValues() {
            let tableEl = h1El.parentNode.parentNode.querySelector('table[width="100%"]');
            let tableElTables = tableEl.querySelectorAll('table');
            updateSavedValuesForContingent(tableElTables[0]); // PFC
            updateSavedValuesForContingent(tableElTables[1]); // PEC
            updateSavedValuesForContingent(tableElTables[2]); // PUC
            // update the last time we reset to the current cached time
            let lastResetText = h1El.parentNode.querySelector('span.cached').textContent.replace(/Last updated\:/,'');
            GM_setValue(universe + 'LastReset', lastResetText);
            if (document.getElementById('lastResetText')) {
                document.getElementById('lastResetText').textContent = 'Compared with data from: ' + lastResetText;
            }
            // update the styling for all of the contingents
            parseAllContginents();
        }

        let h1El = document.querySelector('h1');
        if (h1El.textContent === 'Statistics - Pardus Cluster') {
            GM_setValue(universe + "lastCheck", Date.now());
            // add in a reset values button
            let buttonEl = document.createElement('button');
            buttonEl.textContent = 'Reset Starbase Values';
            buttonEl.style.margin = '10px 0';
            buttonEl.style.padding = '5px 10px';
            h1El.parentNode.appendChild(buttonEl);
            buttonEl.addEventListener('click', updateAllSavedValues);
            // add in the time the data is to be compared against
            let lastResetTextValue = GM_getValue(universe + 'LastReset', '');
            if (lastResetTextValue !== '') {
                let lastResetText = document.createElement('div');
                lastResetText.id = 'lastResetText';
                lastResetText.textContent = 'Compared with data from: ' + lastResetTextValue;
                lastResetText.style.textAlign = 'center';
                lastResetText.style.margin = '0 0 20px 0';
                h1El.parentNode.appendChild(lastResetText);
            } else {
                buttonEl.style.marginBottom = '20px';
            }
            // update the styling for all of the contingents
            parseAllContginents();
            if (document.location.search.includes("autoclose")) {
                if (healthy) {
                    window.close();
                }
            }
        }
    }
    else if (document.location.pathname == "/msgframe.php") {
        let checkStatsLink = document.createElement('a');
        // 43200000 = twelve hours
        // most is 4 increments (zero indexed of course)
        let incrementsSinceCheck = Math.min(3, Math.floor((Date.now() - GM_getValue(universe + "lastCheck", 0))/43200000))
        checkStatsLink.href = "statistics.php?display=parduscluster&autoclose";
        checkStatsLink.target = "_blank";
        checkStatsLink.innerText = ["Check PC SBs", "Check PC SB Pops", "Check Pardus Cluster Starbase Populations", "Low Population SBs? In YOUR cluster? It's more likely than you think! Get a free PC Health Check Today!"][incrementsSinceCheck];
        checkStatsLink.style.color = [ populationIncreaseColor, populationUnchangedColor, populationDecreaseColor, lowPopColour][incrementsSinceCheck];
        checkStatsLink.style.fontSize = ['','',"14px","16px"][incrementsSinceCheck];
        let brEl = document.querySelector("a[href*='statistics']");
        brEl.innerHTML += " | ";
        brEl.after(checkStatsLink);
    }
})();
