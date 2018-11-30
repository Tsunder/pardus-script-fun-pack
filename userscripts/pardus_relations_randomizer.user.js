// ==UserScript==
// @name         Pardus Relations Randomizer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  randomizes the relations gains/losses. Why would you want this? I don't know. WIP
// @author       tsunders
// @match        *://*.pardus.at/faction_relations.php*
// @grant        none
// @updateURL    https://github.com/Tsunder/pardus-script-fun-pack/raw/master/userscripts/pardus_relations_randomizer.user.js
// @icon         http://static.pardus.at/img/std/forum/emoticons/emot-q.gif
// ==/UserScript==

/***
to do: 
 -the relations table
 -using numbers instead of ?
 - calculating a fake value for dispositions
**/

(function() {
    'use strict';

    randomChanges();
    //randomInfluences();
    //randomLobbying();
    randomDispositions();
    randomRelations();

    function randomRelations() {
        let federation = document.querySelectorAll('[title="Federation"]')
        let empire = document.querySelectorAll('[title="Empire"]')
        let union = document.querySelectorAll('[title="Union"]')

        let relations = [
        [federation[0], empire[0]],
        [empire[1], union[0]],
        [union[1], federation[1]]
        ]
        for (var _row in relations) {
            let position = Math.floor(Math.random()*416);
            //console.log(relations[_row][0].parentElement.nextElementSibling.querySelector("tr"))
            for (var _ele in relations[_row]) {
                relations[_row][_ele].previousElementSibling.width=position
                relations[_row][_ele].nextElementSibling.width=416-position
            }
        }
    }

    function randomInfluences() {
        let diplomacyTable = document.querySelector('td[title*="Federation"]').parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.children
    }

    //partially overlaps with randomDispositions
    function randomLobbying() {
        let _largeSign = [ "//static.pardus.at/img/std/disposition_plus.png", "//static.pardus.at/img/std/disposition_neutral.png", "//static.pardus.at/img/std/disposition_minus.png"];
        document.querySelectorAll('th+td[colspan="2"]').forEach( function (e) {
            e.children[0].src = _largeSign[Math.floor(Math.random()*3)]
        })
    }

    function randomDispositions() {
        let _largeSign = [ "//static.pardus.at/img/std/disposition_plus.png", "//static.pardus.at/img/std/disposition_neutral.png", "//static.pardus.at/img/std/disposition_minus.png"];
        let _colors = ["#8C8C8C", "#E70000", "#06E800"]; //neutral, negative, positive
        let _signSrc = [ "//static.pardus.at/img/std/disposition_single_neutral.png" , "//static.pardus.at/img/std/disposition_single_plus.png", "//static.pardus.at/img/std/disposition_single_minus.png"]
        Array.from(document.querySelectorAll('span[style*="font-size:8px"]')).forEach( function (e) {
            var _disposition = Math.floor(Math.random()*3)* Math.floor(Math.random()*2)
            e.style.color = _colors[_disposition];
            e.parentElement.previousElementSibling.children[0].src = _signSrc[_disposition];
        });

        Array.from(document.querySelectorAll('td[width="30"]>span[style*="font-size:16px;color:"]')).forEach(function(e){
            e.innerText= "?"})
        Array.from(document.querySelectorAll('th[colspan="2"]~td[align="center"]~td[align="center"]')).forEach(function(e) {
            console.log(e)
            e.children[0].innerText = "?";
            e.previousElementSibling.children[0].innerText = "?";
        });
        document.querySelectorAll('img[title*="Disposition"]').forEach(function(e){
            if(e.parentElement) {
                e.parentElement.innerHTML='<img src="' + _largeSign[Math.floor(Math.random()*3)] +'" height="16" width="16" alt="Indifferent Disposition" title="Indifferent Disposition">'
            }
        })
    }


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