// ==UserScript==
// @name         Pardus Territory Statistics Dumper
// @namespace    https://github.com/Tsunder/pardus-script-fun-pack
// @version      0.3
// @description  Adds buttons to parse and download some stats from the Territory statistics page.
// @author       Tsunder
// @match        *.pardus.at/statistics.php*
// @grant        GM_setValue
// @grant        GM_getValue
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
        h1El.after(makeDownloadButton("All", downloadHistoryAll));
        h1El.after(" ");
        h1El.after(makeDownloadButton("Domiance Map", downloadHistoryMap));
        h1El.after(" ");
        h1El.after(makeDownloadButton("Alliance Diversity", downloadHistoryDiversity));
        h1El.after(" ");
        h1El.after(makeDownloadButton("Alliance Dominance", downloadHistoryTerritory));
        h1El.after(document.createElement('br'));
        h1El.after("Download Recorded History for...");
        h1El.after(document.createElement('br'));
        h1El.after(makeDownloadButton("All", downloadAll));
        h1El.after(" ");
        h1El.after(makeDownloadButton("Domiance Map", downloadMap));
        h1El.after(" ");
        h1El.after(makeDownloadButton("Alliance Diversity", downloadDiversity));
        h1El.after(" ");
        h1El.after(makeDownloadButton("Alliance Dominance", downloadTerritory));
        h1El.after(document.createElement('br'));
        h1El.after("Download Today's Stats for...");

        // getting the day
        //postDay()
        // getting the summarized stats for all alliances
        //(Array.from(document.querySelectorAll("table.messagestyle"))).forEach((e)=>console.log(postAllianceSummary(e)));

        // data for the exact map
        // OH MY GOD LOOK AT THE PAGE SOURCE HOLY FUCKKKKK
        // disabled or not because i honestly have no idea how to use this information
        //postMapData();
        saveTheDay();

        //also saves the fact that we have saved data for the day by getting the master history string, appending, and saving to it.
        function saveTheDay() {
            let history = GM_getValue(universe + "history",false);
            if (history) {
                history = JSON.parse(history)
                history.sort();
            } else {
                history = [];
            }
            let today = postDay();
            if(history.includes(today)) {
                return;
            }
            (Array.from(document.querySelectorAll("table.messagestyle"))).forEach(saveAllianceSummary);
            saveAllianceList();
            saveMapData();
            history.push(today);
            GM_setValue(universe + "history",JSON.stringify(history));
        }

        function saveAllianceSummary(table){
            let rows = Array.from(table.getElementsByTagName("tr"))
            let key = postDay() + rows.splice(0,1)[0].innerText.split(' ')[0];
            let data = {};
            rows.forEach( (e) => {
                data[e.children[0].textContent] = e.children[1].textContent;
            })
            GM_setValue(universe + key, JSON.stringify(data))
        }

        function saveAllianceList() {
            let rows = Array.from(document.querySelector("table.messagestyle").getElementsByTagName("tr"))
            let alliances = GM_getValue(universe + "alliances", []);
            rows.splice(0,1);
            rows.forEach( (row) => {
                if (alliances.indexOf(row.children[0].textContent) == -1) {
                    alliances.push(row.children[0].textContent);
                }
            })
            GM_setValue(universe + "alliances", alliances);
        }

        function saveMapData() {
            console.log("saving map data");
            let mapTable = document.getElementById("tbl_territory");
            let dominatedSectors = Array.from(mapTable.querySelectorAll("td[class*='alliance']"));
            let data = {};
            let sectorList = GM_getValue(universe + "sectorList",[]);
            dominatedSectors.forEach((sector) => {
                let name = sector.title.split(": ")[0];
                let alliance = sector.title.split(": ")[1];
                data[name] = alliance;
                if(sectorList.indexOf(name) == -1) {
                    sectorList.push(name)
                }
            });
            GM_setValue(universe + postDay() + "map", JSON.stringify(data));
            GM_setValue(universe + "sectorList", sectorList);
        }


        //downloading requires parsing the history value to find out what days are saved
        //then, for every day, parse the day+save format.
        function downloadHistoryAll() {
        }

        function downloadHistoryAllianceSummary(type) {
            let history = JSON.parse(GM_getValue(universe + "history",[]));
            let data = {};
            GM_getValue(universe + "alliances",[]).forEach((alliance)=> {data[alliance] = []});
            let text = type + "," + history
            history.forEach((date) => {
                let day = JSON.parse(GM_getValue(universe + date + type,{}))
                for (var alliance in data) {
                    data[alliance].push(day[alliance] ? day[alliance] : 0);
                }
            })
           for (var alliance in data) {
               text += "\n" + alliance + "," + data[alliance];
           }
            download(type + " from " + history[0] + " to " + history[history.length-1], text);
        }

        function downloadHistoryDiversity () {
            downloadHistoryAllianceSummary("Diversity");
        }

        function downloadHistoryTerritory () {
            downloadHistoryAllianceSummary("Territory");
        }

        function downloadHistoryMap() {
            let history = JSON.parse(GM_getValue(universe + "history",[]));
            let data = {};
            GM_getValue(universe + "sectorList",[]).forEach((sector)=>{data[sector] = []});
            let text = "Sector Dominance," + history;
            history.forEach((date) => {
                let day = JSON.parse(GM_getValue(universe + date + "map",{}));
                for (var sector in data) {
                    data[sector].push(day[sector] ? day[sector] : " ");
                }
            })
           for (var sector in data) {
               text += "\n" + sector + "," + data[sector];
           }
            download("map from " + history[0] + " to " + history[history.length-1], text);
        }

        function makeDownloadButton(text,callback) {
        let button = document.createElement('button');
            button.innerText = text;
            button.style.margin = '10px 0';
            button.style.padding = '5px 10px';
            button.addEventListener('click',callback)
            return button
        }

        function downloadTerritory () {
            download("Territory " + postDay(),postAllianceSummary(document.querySelectorAll("table.messagestyle")[0]));
        }

        function downloadDiversity () {
            download("Diversity " + postDay(),postAllianceSummary(document.querySelectorAll("table.messagestyle")[1]));
        }

        function downloadMap () {
            download("Dominance Map " + postDay(), postMapData());
        }

        function downloadAll() {
            downloadTerritory();
            downloadDiversity();
            downloadMap();
        }
        function download(string, data) {
            var link = document.createElement('a')
            link.href = "data:text," + data;
            link.download = universe + " " + string + ".csv";
            link.click();
        }
        function postDay() {
            let day = document.querySelectorAll("a[href*='statistics.php?date']")[0].nextElementSibling.value
            return day
        }

        function postAllianceSummary(table) {
            let rows = Array.from(table.getElementsByTagName("tr"))
            let text = 'Alliance ID, Alliance Name,' + rows.splice(0,1)[0].innerText.replace(/[,]/g,'') + "\n";
            rows.forEach( (e) => {
                text += e.getAttribute("onclick").match(/\d+/g)[0] + "," + e.children[0].textContent + "," + e.children[1].textContent + "\n";
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
                e.mouseover()
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