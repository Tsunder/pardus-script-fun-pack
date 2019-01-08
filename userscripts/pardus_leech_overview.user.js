// ==UserScript==
// @name         Leech repair time (overview)
// @namespace    https://github.com/Tsunder/pardus-script-fun-pack
// @version      0.1
// @description  shows estimated time until a leech repairs to full armor on ship overview screen
// @author       tsunders
// @match        *://*.pardus.at/overview_ship.php*
// @grant        none
// @updateURL    https://github.com/Tsunder/pardus-script-fun-pack/raw/master/userscripts/pardus_leech_overview.user.js
// @downloadURL  https://github.com/Tsunder/pardus-script-fun-pack/raw/master/userscripts/pardus_leech_overview.user.js

// ==/UserScript==

// independent implmentation of http://www.thewaistelands.info/2013/02/21/leech-repair-time/

(function() {
    'use strict';

    // Your code here...
    let leech = document.querySelector('tr a[onmouseover*="Leech repairs"]');
    let armor = document.querySelector('tr a[onmouseover*="Armor points"]');
    if(leech && armor) {
        let leechSpeed = parseInt(leech.parentElement.nextElementSibling.innerText);
        let armorPoints = armor.parentElement.nextElementSibling.innerText.split(' / ');
        //console.log(armorPoints)
        let repairTicksToFull = Math.ceil((armorPoints[1] - armorPoints[0]) / leechSpeed);
        let tr = document.createElement("tr");
        let days = Math.floor(repairTicksToFull/72);
        let hours = Math.floor(repairTicksToFull/3) - days;
        let minutes = (repairTicksToFull * 20) % 60;
        tr.insertCell(0).innerHTML = "Full armor in";
        tr.insertCell(1).innerText = days + "d " + hours + "h " + minutes + "m";
        leech.parentElement.parentElement.after(tr);
    }
})();
