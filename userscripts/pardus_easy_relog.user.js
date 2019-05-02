// ==UserScript==
// @name         Easier Relog
// @namespace    https://github.com/Tsunder/pardus-script-fun-pack
// @version      0.1
// @description  Makes it slightly easier to get into your universe, maybe?
// @author       Tsunders
// @match        *.pardus.at/game.php*
// @downloadURL  https://github.com/Tsunder/pardus-script-fun-pack/raw/master/userscripts/pardus_easy_relog.user.js
// @updateURL    https://github.com/Tsunder/pardus-script-fun-pack/raw/master/userscripts/pardus_easy_relog.user.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    if (document.querySelector("h2 font")) {
        if (document.querySelector("h3 a[href*='www.pardus.at/index.php?section=login']")) {
            let universe = window.location.host.substr(0, window.location.host.indexOf('.'));
            universe = universe.charAt(0).toUpperCase() + universe.slice(1);
            document.querySelector("h3 a[href*='www.pardus.at/index.php?section=login']").search = "?section=account_play&universe=" + universe;
        }
    }
})();
