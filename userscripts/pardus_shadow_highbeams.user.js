// ==UserScript==
// @name        Shadow Hibeams
// @namespace   Astraltoremail@gmail.com
// @author      Tsunders
// @description Shines a light on shadows so you don't miss them.
// @include     http*://*.pardus.at/main.php*
// @version     1.0
// @grant       none
// @updateURL 	https://github.com/Tsunder/pardus-script-fun-pack/raw/master/userscripts/shadow_highbeams.user.js
// @downloadURL https://github.com/Tsunder/pardus-script-fun-pack/raw/master/userscripts/shadow_highbeams.user.js
// @icon 		http://static.pardus.at/img/std/opponents/shadow.png
// ==/UserScript==

// 1.0 2018 november 08 initial creation

function HighlightShadows() {
    var shadows = document.querySelectorAll('#navarea a > img[src*=shadow]');
    for (var i = 0; i < shadows.length; i++) {
        shadows[i].parentNode.setAttribute('style', 'background:#00B448');
    }
}

HighlightShadows();