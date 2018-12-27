// ==UserScript==
// @name        Shadow Hibeams
// @namespace   Astraltoremail@gmail.com
// @author      Tsunders
// @description Shines a light on shadows so you don't miss them.
// @include     *://*.pardus.at/main.php*
// @version     1.2
// @grant       none
// @updateURL 	https://github.com/Tsunder/pardus-script-fun-pack/raw/master/userscripts/shadow_highbeams.user.js
// @downloadURL https://github.com/Tsunder/pardus-script-fun-pack/raw/master/userscripts/shadow_highbeams.user.js
// @icon 		http://static.pardus.at/img/std/opponents/shadow.png
// ==/UserScript==

// 1.2 2018 december 27 partial refresh??
// 1.1 2018 november 28 download migration
// 1.0 2018 november 08 initial creation

var HighlightShadows = {
    Init : function() {
        console.log("first run");
        Array.from(document.querySelectorAll('#navarea a > img[src*=bio]')).forEach(e => {
            e.parentNode.setAttribute('style', 'background:#00B448')}
                                                                                      )
},
    Update: function() {
        console.log("update");
        Array.from(document.querySelectorAll('#navarea a > img[src*=bio]')).forEach(e => {
            e.parentNode.setAttribute('style', 'background:#00B448')}
                                                                                      )
    }
}
HighlightShadows.Init();
window.addUserFunction(function check(e) {return function() {e.Update()}}(HighlightShadows));