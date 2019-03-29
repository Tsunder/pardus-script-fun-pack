// ==UserScript==
// @name         Pardus Cluster Statistics
// @namespace    http://userscripts.xcom-alliance.info/, https://github.com/Tsunder/pardus-script-fun-pack
// @version      1.3.1
// @description  Indicate whether a starbase has increased or decreased it's population since the last time you viewed the Pardus Cluster Statistics page.
// @author       Miche (Orion) / Sparkle (Artemis), featuring tsunder
// @match        http*://*.pardus.at/statistics.php*
// @match        *.pardus.at/msgframe.php*
// @grant        GM_getValue
// @grant        GM_setValue
// @updateURL    https://github.com/Tsunder/pardus-script-fun-pack/raw/master/userscripts/pardus_cluster_statistics.user.js
// @downloadURL  https://github.com/Tsunder/pardus-script-fun-pack/raw/master/userscripts/pardus_cluster_statistics.user.js
// ==/UserScript==

//changes from base version:
/*
dynamic reminder in message bar!
-- colour and text changes based on how long ago the SB has been visited
-- can be disabled per universe

automatic record updating
-- automatically updates saved values to keep track of the most recent data on starbases
-- rudimentary but hopefully generally sufficient

minor text update
-- added display of population difference
-- added commas
*/

(function() {
    'use strict';
    // 1000 pop is about 12 ticks (1.5 days) before downgrade. 1500 about 16 ticks (2 days). 850 about 8 ticks (1 day) default: 1001. options: any number
    let lowPopThreshold = 1001;

    // automatically update population records when visiting page. default: true. options: true, false
    let autoUpdate = true;

    //script stuff below, do not edit
    let lowPopFontSize = '24px'; // 2x as large as regular
    let lowPopColour = '#FFA500'; // orange
    let healthy = true;

    let populationUnchangedColor = '#FFFF00'; // yellow
    let populationIncreaseColor = '#229922'; // green
    let populationDecreaseColor = '#D21414'; // red
    let universe = window.location.host.substr(0, window.location.host.indexOf('.'));

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
                let title = 'No Change';
                if (sbPopNew !== sbPopOld ) {
                    title = 'Population was: ' + sbPopOld.toLocaleString() + " (" + (sbPopNew > sbPopOld ? "+" + (sbPopNew - sbPopOld).toLocaleString():(sbPopNew - sbPopOld).toLocaleString()) + ")";
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

        function toggleReminder() {
            GM_setValue(universe + "ReminderEnabled", !(GM_getValue(universe + "ReminderEnabled", true)));
            document.getElementById("reminderButton").innerHTML = updateReminderText();
        }

        function updateReminderText() {
            let text = 'Message Bar Reminder: ';
            if (GM_getValue(universe + 'ReminderEnabled', true)) {
                text += "<font color='#5ADD5A'>ON</font>";
            } else {
                text += "<font color='#DD5555'>OFF</font>";
            }
            return text;
        }

        function autoUpdateSavedValuesForContingent(tableEl) {
            for (let i=1; i<tableEl.rows.length; i++) {
                let rowEl = tableEl.rows[i];
                let sbName = rowEl.cells[2].textContent;
                let sbPop = rowEl.cells[3].textContent.replace(/[,]/g, '');
                GM_setValue(universe + sbName.replace(/\s+/g, ''), GM_getValue(universe + "auto_" + sbName.replace(/\s+/g, ''), sbPop));
                GM_setValue(universe + "auto_" + sbName.replace(/\s+/g, ''), sbPop);
            }
        }

        function autoUpdateSavedValues() {
            let now = Date.now();
            if (now - GM_getValue(universe + "lastAutoUpdate", 0) >= 10800000) {
                let tableEl = h1El.parentNode.parentNode.querySelector('table[width="100%"]');
                let tableElTables = tableEl.querySelectorAll('table');
                autoUpdateSavedValuesForContingent(tableElTables[0]); // PFC
                autoUpdateSavedValuesForContingent(tableElTables[1]); // PEC
                autoUpdateSavedValuesForContingent(tableElTables[2]); // PUC
                // update the last time we reset to the current cached time
                let lastResetText = new Date(GM_getValue(universe + "lastAutoUpdate", now)).toUTCString() + " (Autoupdated)";
                GM_setValue(universe + 'LastReset', lastResetText);
                if (document.getElementById('lastResetText')) {
                    document.getElementById('lastResetText').textContent = 'Compared with data from: ' + lastResetText;
                }
                GM_setValue(universe + "lastAutoUpdate", now);
            }
        }

        let h1El = document.querySelector('h1');
        if (h1El.textContent === 'Statistics - Pardus Cluster') {
            GM_setValue(universe + "lastCheck", Date.now());
            if (document.location.search.includes("autoclose")) {
                parseAllContginents();
                if (healthy) {
                    window.close();
                    return;
                }
            }

            // add in reminder toggle
            let reminderButtonEl = document.createElement('button');
            reminderButtonEl.id = "reminderButton";
            reminderButtonEl.innerHTML = updateReminderText();
            reminderButtonEl.style.margin = '10px 0';
            reminderButtonEl.style.padding = '5px 10px';
            h1El.parentNode.appendChild(reminderButtonEl);
            reminderButtonEl.addEventListener('click', toggleReminder);
            h1El.parentNode.appendChild(document.createElement('br'));

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
                updateAllSavedValues();
            }
            if (autoUpdate) {
                autoUpdateSavedValues();
            }
            // update the styling for all of the contingents
            parseAllContginents();
        }
    }
    else if (document.location.pathname == "/msgframe.php") {
        if (GM_getValue( universe + "ReminderEnabled", true) == false ) {
            return;
        }
        let checkStatsLink = document.createElement('a');
        // 43200000 = twelve hours
        // most is 4 increments (zero indexed of course)
        let incrementsSinceCheck = Math.min(3, Math.floor((Date.now() - GM_getValue(universe + "lastCheck", Date.now() - 43200000 - 43200000))/43200000))
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
