// ==UserScript==
// @name         Pardus Relations Randomizer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  randomizes the relations gains/losses. Why would you want this? I don't know.
// @author       tsunders
// @match        *://*.pardus.at/faction_relations.php*
// @grant        none
// @updateURL    https://github.com/Tsunder/pardus-script-fun-pack/raw/master/userscripts/pardus_relations_randomizer.user.js
// @icon         http://static.pardus.at/img/std/forum/emoticons/emot-q.gif
// ==/UserScript==

(function() {
    'use strict';
    randomChanges();
    //let table = document.querySelector('td[title*="Federation"]').parentElement.parentElement.parentElement.parentElement.parentElement.parentElement

    function randomChanges(){
        let colorList = ["#E70000","#8C8C8C","#06E800"] // negative, neutral , positive
        let changes = Array.from(document.querySelectorAll('td[width="25%"]>span'))
        changes.forEach(e=> {
            var _direction = Math.floor(Math.random()*3)-1
            e.style.color = colorList[_direction+1]
            if (_direction != 0 ) {
                e.innerText = Math.ceil(Math.random()*2) + Math.floor(Math.random()*3) + Math.floor(Math.random()*2)
            } else {
                e.innerText = 0
            }
        })
    }
})();