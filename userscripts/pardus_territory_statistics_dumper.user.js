// ==UserScript==
// @name         Pardus Territory Statistics Dumper
// @namespace    https://github.com/Tsunder/pardus-script-fun-pack
// @version      0.1
// @description  Dumps the stats of the page into console.
// @author       Tsunder
// @match        *.pardus.at/statistics.php*
// @grant        none
// @updateURL    https://github.com/Tsunder/pardus-script-fun-pack/raw/master/userscripts/pardus_territory_statistics_dumper.user.js
// @downloadURL  https://github.com/Tsunder/pardus-script-fun-pack/raw/master/userscripts/pardus_territory_statistics_dumper.user.js
// ==/UserScript==

(function() {
    'use strict';
    let h1El = document.querySelector('h1');
    if (h1El.textContent === 'Statistics - Alliance Territory') {
        // getting the day
        postDay();
        // getting the summarized stats for all alliances
        (Array.from(document.querySelectorAll("table.messagestyle"))).forEach(postAllianceSummary);

        // data for the exact map
        // OH MY GOD LOOK AT THE PAGE SOURCE HOLY FUCKKKKK
        // disabled or not because i honestly have no idea how to use this information
        postMapData();

        function postDay() {
            let day = document.querySelectorAll("a[href*='statistics.php?date']")[0].nextElementSibling.value
            console.log(day)
        }

        function postAllianceSummary(table) {
            let rows = Array.from(table.getElementsByTagName("tr"))
            let text = 'Alliance ID, Alliance Name,' + rows.splice(0,1)[0].innerText + "\n";
            rows.forEach( (e) => {
                text += e.getAttribute("onclick").match(/\d+/g)[0] + "," + e.children[0].innerText + "," + e.children[1].innerText + "\n";
            })
            console.log(text)
        }

        // OH MY GOD LOOK AT THE PAGE SOURCE HOLY FUCKKKKK
        function postMapData() {
            //kind of useless
            let mapTable = document.getElementById("tbl_territory");
            //lets take only the cells that have data
            // no, only the cells that have someone with dominance.
            let dominatedSectors = Array.from(mapTable.querySelectorAll("td[class*='alliance']"));
            let text = "Sector,Alliance Name,Alliance ID\n"
            dominatedSectors.forEach((e) => {
                //technically you can use tostring for the below.
                //let [_sector, _alliance] = e.title.split(": ")
                let _ID = e.className.match(/\d+/g)[0];
                text += e.title.split(": ").toString() + "," + _ID + "\n";
                //text += _sector + "," + _alliance + "," + _ID + "\n";
            })

            console.log(text)
        }
    }
})();
