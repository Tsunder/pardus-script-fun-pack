// ==UserScript==
// @name         Pardus Revnue Service
// @namespace    https://github.com/Tsunder/pardus-script-fun-pack
// @version      0.1
// @description  Displays building profit per tick.
// @author       Tsunders
// @match        *.pardus.at/building_trade.php*
// @grant        none
// @downloadURL  https://github.com/Tsunder/pardus-script-fun-pack/raw/master/userscripts/pardus_revenue_service.user.js
// @updateURL    https://github.com/Tsunder/pardus-script-fun-pack/raw/master/userscripts/pardus_revenue_service.user.js
// ==/UserScript==

(function() {
    'use strict';
    let net = 0;
    let baseTable = document.querySelectorAll("tr[id*='baserow']")
    let shipTable = document.querySelectorAll("tr[id*='shiprow']")
    for (var row = 0; row < baseTable.length; row++) {
        net += (baseTable[row].children[3].innerText.replace(/,/g,'') < 0 ) ? shipTable[row].children[3].innerText.replace(/,/g,'') * baseTable[row].children[3].innerText.replace(/,/g,'') : baseTable[row].children[3].innerText.replace(/,/g,'') * baseTable[row].children[6].innerText.replace(/,/g,'')
    }
    let creditflowEl = document.createElement("tr");
    creditflowEl.style = "background-color:#003040";
    creditflowEl.innerHTML = "<td colspan='4'>Profit per Tick</td><td colspan='4' align='right'>" + net.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "</td>";
    baseTable[0].parentElement.append(creditflowEl);
    let creditflowDayEl = document.createElement("tr");
    creditflowDayEl.style = "background-color:#003040";
    creditflowDayEl.innerHTML = "<td colspan='4'>Profit per Day</td><td colspan='4' align='right'>" + (net*4).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "</td>";
    baseTable[0].parentElement.append(creditflowDayEl);
    let creditflowWeekEl = document.createElement("tr");
    creditflowWeekEl.style = "background-color:#003040";
    creditflowWeekEl.innerHTML = "<td colspan='4'>Profit per Week</td><td colspan='4' align='right'>" + (net*28).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "</td>";
    baseTable[0].parentElement.append(creditflowWeekEl);
})();
