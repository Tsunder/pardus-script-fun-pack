// ==UserScript==
// @name         Map Linkz
// @namespace    Pardus
// @version      0.1.5
// @description  Adds links to the sector map of combat logs
// @author       Tsunders
// @updateURL    https://github.com/Tsunder/pardus-script-fun-pack/raw/master/userscripts/pardus_combat_log_map_links.user.js
// @downloadURL  https://github.com/Tsunder/pardus-script-fun-pack/raw/master/userscripts/pardus_combat_log_map_links.user.js
// @match        http*://*.pardus.at/overview_combat_log.php*
// @match        http*://*.pardus.at/combat_details.php*
// @match        *.pardus.at/acs_log.php*
// @grant        none
// @icon         http://www.pardus.at/favicon.ico

// 0.1.5 add ACS logs, rename
// 0.1.4 migrate to map.xcom and add coord highlighting
// 0.1.3 download migration and icon
// 0.1.2.2 url fix
// 0.1.2.1 url update
// 0.1.2 compatilibty with some combat uploaders. link now shows near top of page.
// 0.1.1 fluff fix
// 0.1  initial publishing

// ==/UserScript==

// Options, in case of URL changes or language

var baseURL = "http://map.xcom-alliance.info"; //mapper URL, assumes the mapper has the format /Universe/Sector for its sectors.
var combatLogFluff = "Confrontation in "; //combat log fluff text before the sector name

(function() {
    'use strict';
    var str = document.location.hostname;
    var universe = str.substring(0, str.indexOf("."));
    universe = universe.charAt(0).toUpperCase() + universe.substring(1);

    if(document.URL.indexOf('pardus.at/overview_combat_log.php') > -1) {
        var tableData = document.querySelectorAll('td[onclick^=combatDetails]');

        for (var i = 0; i < tableData.length; i++) {
            var _text = tableData[i].innerHTML;
            if (_text.indexOf(" [") > -1) {
                var _sector = _text.substring(0,_text.indexOf(" ["));
                var x = _text.substring(_text.indexOf("[")+1,_text.indexOf(",")),
                    y = _text.substring(_text.indexOf(",")+1,_text.indexOf("]"));
                tableData[i].innerHTML = '<a target="_blank" href="' + baseURL  + '/' + _sector + `.html?x=${x}&y=${y}">` + _text + '</a>';
                tableData[i].removeAttribute("onclick");
            }
        }
    }
    else if (document.URL.indexOf('pardus.at/combat_details.php') > -1) {
     var tableData = document.querySelectorAll('tr th');
     for (var i = 0; i < tableData.length; i++) {
            var _text = tableData[i].innerHTML;
            if (_text.indexOf(" [") > -1) {
                var _split = _text.split(combatLogFluff);
                var _sector = _split[1].substring(0, _split[1].indexOf(" ["));
                var x = _split[1].substring(_split[1].indexOf("[")+1,_split[1].indexOf(",")),
                    y = _split[1].substring(_split[1].indexOf(",")+1,_split[1].indexOf("]"));

                var _sectorLink = document.createElement("a");
                _sectorLink.appendChild(document.createTextNode(_sector));
                _sectorLink.setAttribute("target", "_blank");
                _sectorLink.setAttribute("href", baseURL + "/" +  _sector +`.html?x=${x}&y=${y}`);

                var _details = document.getElementsByTagName("h2")[0];
                _details.append(document.createElement("br"));
                _details.append(_sectorLink);
            }
        }
    }
    else if (document.URL.indexOf('pardus.at/acs_log.php') > -1) {
        var rows = Array.from(document.getElementsByTagName("tr"));
        if (rows.length > 9) {
            //cut it down to just the fun messages
            rows.pop();
            rows.splice(0,8);
            var sector = "";
            var coords =""
            var url = "";
            for (var i in rows) {
                sector = rows[i].children[2]
                coords = rows[i].children[3]
                url = `${baseURL}/${sector.innerText}.html?x=${/(\d+)/.exec(coords.innerText)[0]}&y=${/(\d+)(?=])/.exec(coords.innerText)[0]}`;
                sector.innerHTML = `<a target="_blank" href="${url}"> ${sector.innerText}</a>`
               coords.innerHTML = `<a target="_blank" href="${url}"> ${coords.innerText}</a>`
            }
        }
    }
})();
