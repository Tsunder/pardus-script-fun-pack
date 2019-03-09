// ==UserScript==
// @name         Pardus Navigation Objects Namer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Names NPCs and ships on the map.
// @author       Tsunder
// @match        *://*.pardus.at/main.php*
// @grant        none
// @updateURL    https://github.com/Tsunder/pardus-script-fun-pack/raw/master/userscripts/pardus_navigation_objects_namer.user.js
// @downloadURL  https://github.com/Tsunder/pardus-script-fun-pack/raw/master/userscripts/pardus_navigation_objects_namer.user.js
// ==/UserScript==

//in case of language setting. but then again, the file names are all english so.
var npcString = "NPC Opponent";
var pilotString = "Another Pilot";


var PardusNavigationObjectsNamer = {
    Init : function () {
        Array.from(document.querySelectorAll('td.navNpc img')).forEach(e => {e.title = e.title.replace(npcString, e.src.substring(e.src.lastIndexOf('/') + 1,e.src.lastIndexOf('.')).replace(/_/g,' '))});
        Array.from(document.querySelectorAll('td.navShip img')).forEach(e => {e.title = e.title.replace(pilotString, e.src.substring(e.src.lastIndexOf('/') + 1,e.src.lastIndexOf('.')).replace(/_/g,' '))})
    },
    Update : function () {
        Array.from(document.querySelectorAll('td.navNpc img')).forEach(e => {e.title = e.title.replace(npcString, e.src.substring(e.src.lastIndexOf('/') + 1,e.src.lastIndexOf('.')).replace(/_/g,' '))});
        Array.from(document.querySelectorAll('td.navShip img')).forEach(e => {e.title = e.title.replace(pilotString, e.src.substring(e.src.lastIndexOf('/') + 1,e.src.lastIndexOf('.')).replace(/_/g,' '))})
    }
}


PardusNavigationObjectsNamer.Init();
window.addUserFunction(function(Pnom) {
    return function() {
        Pnom.Update();
    }
}(PardusNavigationObjectsNamer))
