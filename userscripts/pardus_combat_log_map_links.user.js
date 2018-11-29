// ==UserScript==
// @name         Combat Log Sector Links
// @namespace    Pardus
// @version      0.1.2.2
// @description  Adds links to the sector map of combat logs
// @author       Tsunders
// @updateURL    https://gist.github.com/Tsunder/8bcf52bcc7799d1356befa29a64c2296/raw/pardus_combat_log_map_links.user.js
// @downloadURL  https://gist.github.com/Tsunder/8bcf52bcc7799d1356befa29a64c2296/raw/pardus_combat_log_map_links.user.js
// @match        http*://*.pardus.at/overview_combat_log.php*
// @match        http*://*.pardus.at/combat_details.php*
// @grant        none

// version 0.1.2.2 url fix
// version 0.1.2.1 url update
// version 0.1.2 compatilibty with some combat uploaders. link now shows near top of page.
// version 0.1.1 fluff fix
// version 0.1  initial publishing

// ==/UserScript==

// Options, in case of URL changes or language

var baseURL = "http://pardusmap.mhwva.net"; //mapper URL, assumes the mapper has the format /Universe/Sector for its sectors.
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
                tableData[i].innerHTML = '<a target="_blank" href="' + baseURL + '/' + universe + '/' + _sector + '">' + _text + '</a>';
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

                var _sectorLink = document.createElement("a");
                _sectorLink.appendChild(document.createTextNode(_sector));
                _sectorLink.setAttribute("target", "_blank");
                _sectorLink.setAttribute("href", baseURL + "/" + universe + "/" + _sector);

                var _details = document.getElementsByTagName("h2")[0];
                _details.append(document.createElement("br"));
                _details.append(_sectorLink);
            }
        }
    }
})();