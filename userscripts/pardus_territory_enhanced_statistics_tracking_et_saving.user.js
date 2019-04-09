// ==UserScript==
// @name         Pardus Territory Enhanced Statistics Tracking Et Saving
// @namespace    https://github.com/Tsunder/pardus-script-fun-pack
// @version      0.4.2
// @description  Adds buttons to parse and download some stats from the Territory statistics page.
// @author       Tsunder
// @match        *.pardus.at/statistics.php*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @updateURL    https://github.com/Tsunder/pardus-script-fun-pack/raw/master/userscripts/pardus_territory_enhanced_statistics_tracking_et_saving.user.js
// @downloadURL  https://github.com/Tsunder/pardus-script-fun-pack/raw/master/userscripts/pardus_territory_enhanced_statistics_tracking_et_saving.user.js
// ==/UserScript==

//todo : disabling recording per universe and clearing data

(function() {
    'use strict';
    let h1El = document.querySelector('h1');
    if (h1El.textContent === 'Statistics - Alliance Territory') {
        let universe = window.location.host.substr(0, window.location.host.indexOf('.'))
        universe = universe.charAt(0).toUpperCase() + universe.slice(1);
        //add buttons for downloads.
        // territory, diversity, map, and all.
        h1El.after(makeDownloadButton("All", downloadHistoryAll));
        h1El.after(" ");
        h1El.after(makeDownloadButton("Diversity Map", downloadHistoryDiversityMap));
        h1El.after(" ");
        h1El.after(makeDownloadButton("Territory Map", downloadHistoryTerritoryMap));
        h1El.after(" ");
        h1El.after(makeDownloadButton("Diversity Summary", downloadHistoryDiversity));
        h1El.after(" ");
        h1El.after(makeDownloadButton("Territory Summary", downloadHistoryTerritory));
        h1El.after(document.createElement('br'));
        h1El.after("Download Recorded History for...");
        /*h1El.after(document.createElement('br'));
        h1El.after(makeDownloadButton("All", downloadAll));
        h1El.after(" ");
        h1El.after(makeDownloadButton("Domiance Map", downloadMap));
        h1El.after(" ");
        h1El.after(makeDownloadButton("Alliance Diversity", downloadDiversity));
        h1El.after(" ");
        h1El.after(makeDownloadButton("Alliance Dominance", downloadTerritory));
        h1El.after(document.createElement('br'));
        h1El.after("Download Today's Stats for...");*/

        // getting the day
        //postDay()
        // getting the summarized stats for all alliances
        //(Array.from(document.querySelectorAll("table.messagestyle"))).forEach((e)=>console.log(postAllianceSummary(e)));

        // data for the exact map
        // OH MY GOD LOOK AT THE PAGE SOURCE HOLY FUCKKKKK
        // disabled or not because i honestly have no idea how to use this information
        //postMapData();
        let info = document.createElement('span')
        info.innerText = "Saving data in progress:";
        h1El.after(info);
        saveTheDay();
        info.innerText = " Saved All Data for " + postDay() + "!\n";
        //also saves the fact that we have saved data for the day by getting the master history string, appending, and saving to it.
        function saveTheDay() {
            let history = GM_getValue(universe + "history",false);
            if (history) {
                history = JSON.parse(history)
            } else {
                history = [];
                GM_setValue(universe + "alliances", "{}");
                GM_setValue(universe + "sectorList", "{}");
            }
            let today = postDay();
            if(history.includes(today)) {
                return;
            }
            info.innerText += " Saving list of alliances...";
            saveAllianceList();
            info.innerText += " Saving alliances summaries...";
            (Array.from(document.querySelectorAll("table.messagestyle"))).forEach(saveAllianceSummary);
            info.innerText += " Saving Map Data ...";
            saveMapData();
            info.innerText += " Saving the day...";
            history.push(today);
            GM_setValue(universe + "history",JSON.stringify(history));
        }

        function saveAllianceSummary(table){
            let rows = Array.from(table.getElementsByTagName("tr"))
            let key = postDay() + rows.splice(0,1)[0].innerText.split(' ')[0];
            let data = {};
            rows.forEach( (e) => {
                data[e.getAttribute("onclick").match(/\d+/g)[0]] = e.children[1].textContent;
            })
            GM_setValue(universe + key, JSON.stringify(data))
        }

        //not sure if this is more efficient than integrating with saveAllianceSummary()
        function saveAllianceList() {
            let rows = Array.from(document.querySelector("table.messagestyle").getElementsByTagName("tr"))
            let alliances = JSON.parse(GM_getValue(universe + "alliances"));
            rows.splice(0,1);
            rows.forEach( (row) => {
                let id = row.getAttribute("onclick").match(/\d+/g)[0];
                if (!alliances[id]) {
                    alliances[id] = row.children[0].textContent
                }
            })
            GM_setValue(universe + "alliances", JSON.stringify(alliances));
        }

        function saveMapData() {
            let sectorDiversity = unsafeWindow.sectorDiversity || window.sectorDiversity;
            let mapTable = document.getElementById("tbl_territory");
            let dominatedSectors = Array.from(mapTable.querySelectorAll("td[class*='alliance']"));
            let data = {};
            let sectorList = JSON.parse(GM_getValue(universe + "sectorList"));
            dominatedSectors.forEach((sector) => {
                let name = sector.title.split(": ")[0];
                let allianceID = sector.className.match(/\d+/g)[0];
                let sectorID = sector.id.match(/\d+/g)[0];
                data[sectorID] = [allianceID];
                if(!sectorList[sectorID]) {
                    sectorList[sectorID] = name;
                }
            });
            for (var sector in sectorDiversity) {
                let diversity = []
                sectorDiversity[sector].forEach((planet) => {
                    diversity.push(planet[1] ? planet[1] : 0);
                })
                if (!data[sector]) {
                    data[sector] = [0];
                }
                data[sector].push(diversity);
            }
            GM_setValue(universe + postDay() + "map", JSON.stringify(data));
            GM_setValue(universe + "sectorList", JSON.stringify(sectorList));
        }


        //downloading requires parsing the history value to find out what days are saved
        //then, for every day, parse the day+save format.
        function downloadHistoryAll() {
            downloadHistoryDiversity();
            downloadHistoryTerritory();
            downloadHistoryTerritoryMap();
            downloadHistoryDiversityMap();
        }

        function downloadHistoryAllianceSummary(type) {
            let history = JSON.parse(GM_getValue(universe + "history",[]));
            history.sort();
            let data = {};
            let alliances = JSON.parse(GM_getValue(universe + "alliances",[]));
            for (var i in alliances) {
                data[i] = [];
            }
            let text = type + "," + history
            history.forEach((date) => {
                let day = JSON.parse(GM_getValue(universe + date + type,{}))
                for (var alliance in data) {
                    data[alliance].push(day[alliance] ? day[alliance] : 0);
                }
            })
           for (var alliance in data) {
               text += "\n" + alliances[alliance] + "," + data[alliance];
           }
            download(type + " from " + history[0] + " to " + history[history.length-1], text);
        }

        function downloadHistoryDiversity () {
            downloadHistoryAllianceSummary("Diversity");
        }

        function downloadHistoryTerritory () {
            downloadHistoryAllianceSummary("Territory");
        }

        function downloadHistoryDiversityMap () {
            downloadHistoryMap(2);
        }

        function downloadHistoryTerritoryMap () {
            downloadHistoryMap(1);
        }

        //not sure how to integrate class data elegantly.
        //it would have to be multi cell I think, which would require reformatting the whole table.
        function downloadHistoryMap(type) {
            let classData = unsafeWindow.classData;
            let history = JSON.parse(GM_getValue(universe + "history",[]));
            history.sort();
            let data = {};
            let sectorList = JSON.parse(GM_getValue(universe + "sectorList",[]));
            let alliances = JSON.parse(GM_getValue(universe + "alliances",[]));
            for (var i in sectorList) {
                data[i] = [];
            }
            let text = "Sector Dominance," + history;
            history.forEach((date) => {
                let day = JSON.parse(GM_getValue(universe + date + "map",{}));
                for (var sector in data) {
                    if (day[sector]) {
                        if (type == 1) {
                            data[sector].push(alliances[day[sector][0]]);
                        } else {
                            data[sector].push("\"" + (day[sector][1] ? day[sector][1] : "") +"\"");
                        }
                    }
                    else {
                        data[sector].push("");
                    }
                }
            })
           for (var sector in data) {
               text += "\n" + sectorList[sector] + "," + data[sector];
           }
            download( ( type == 1 ? "Territory" : "Diversity" ) + " Map from " + history[0] + " to " + history[history.length-1], text);
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
            var blob = new Blob([data],{type:"text/csv"});
            link.href = URL.createObjectURL(blob);
            link.download = universe + " " + string + ".csv";
            document.body.after(link);
            link.click();
        }
        function postDay() {
            let day = document.querySelector("select[onchange*='statistics.php?date']").value;
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
            let mapTable = document.getElementById("tbl_territory");
            let dominatedSectors = Array.from(mapTable.querySelectorAll("td[class*='alliance']"));
            let text = "Sector,Alliance Name,Alliance ID\n"
            dominatedSectors.forEach((e) => {
                e.mouseover()
                let _ID = e.className.match(/\d+/g)[0];
                text += e.title.split(": ").toString() + "," + _ID + "\n";
            })
            return text
        }
    }
})();
