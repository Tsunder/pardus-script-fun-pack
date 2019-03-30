// ==UserScript==
// @name         Pardus Territory Statistics Dumper
// @namespace    https://github.com/Tsunder/pardus-script-fun-pack
// @version      0.2
// @description  Adds buttons to parse and download some stats from the Territory statistics page.
// @author       Tsunder
// @match        *.pardus.at/statistics.php*
// @grant        none
// @updateURL    https://github.com/Tsunder/pardus-script-fun-pack/raw/master/userscripts/pardus_territory_statistics_dumper.user.js
// @downloadURL  https://github.com/Tsunder/pardus-script-fun-pack/raw/master/userscripts/pardus_territory_statistics_dumper.user.js
// ==/UserScript==

(function() {
    'use strict';
    let universe = window.location.host.substr(0, window.location.host.indexOf('.'))
    universe = universe.charAt(0).toUpperCase() + universe.slice(1);
    let h1El = document.querySelector('h1');
    if (h1El.textContent === 'Statistics - Alliance Territory') {
        //add buttons for downloads.
        // territory, diversity, map, and all.
        h1El.after(makeDownloadButton("All", downloadAll));
        h1El.after(" ");
        h1El.after(makeDownloadButton("Domiance Map", downloadMap));
        h1El.after(" ");
        h1El.after(makeDownloadButton("Alliance Diversity", downloadDiversity));
        h1El.after(" ");
        h1El.after(makeDownloadButton("Alliance Dominance", downloadTerritory));
        h1El.after(document.createElement('br'));
        h1El.after("Download CSV for...");

        // getting the day
        //postDay();
        // getting the summarized stats for all alliances
        //(Array.from(document.querySelectorAll("table.messagestyle"))).forEach(postAllianceSummary);

        // data for the exact map
        // OH MY GOD LOOK AT THE PAGE SOURCE HOLY FUCKKKKK
        // disabled or not because i honestly have no idea how to use this information
        //postMapData();

        function makeDownloadButton(text,callback) {
        let button = document.createElement('button');
            button.innerText = text;
            button.style.margin = '10px 0';
            button.style.padding = '5px 10px';
            button.addEventListener('click',callback)
            return button
        }

        function downloadTerritory () {
            var link = document.createElement('a')
            link.href = "data:text," + postAllianceSummary(document.querySelectorAll("table.messagestyle")[0]);
            link.download = universe + " Territory " + postDay() + ".csv";
            link.click();
        }

        function downloadDiversity () {
            var link = document.createElement('a')
            link.href = "data:text," + postAllianceSummary(document.querySelectorAll("table.messagestyle")[1]);
            link.download = universe + " Diversity" + postDay() + ".csv";
            link.click();
        }

        function downloadMap () {
            var link = document.createElement('a')
            link.href = "data:text," + postMapData;
            link.download = universe + " Dominance Map " + postDay() + ".csv";
            link.click();
        }

        function downloadAll() {
            downloadTerritory();
            downloadDiversity();
            downloadMap();
        }

        function postDay() {
            let day = document.querySelectorAll("a[href*='statistics.php?date']")[0].nextElementSibling.value
            return day
        }

        function postAllianceSummary(table) {
            let rows = Array.from(table.getElementsByTagName("tr"))
            let text = 'Alliance ID, Alliance Name,' + rows.splice(0,1)[0].innerText + "\n";
            rows.forEach( (e) => {
                text += e.getAttribute("onclick").match(/\d+/g)[0] + "," + e.children[0].innerText + "," + e.children[1].innerText + "\n";
            })
            return text
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

            return text
        }
    }
})();
