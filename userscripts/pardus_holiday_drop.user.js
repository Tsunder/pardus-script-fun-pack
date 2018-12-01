// ==UserScript==
// @name         Drop To Donate
// @namespace    Tsunders
// @version      0.1
// @description  When you drop stuff, you donate it instead! ^_^
// @author       Tsunders
// @match        *://*.pardus.at/drop_cargo.php*
// @grant        none
// @icon         http://static.pardus.at/img/stdhq/96/ships/harrier_xmas.png
// @updateURL    https://github.com/Tsunder/pardus-script-fun-pack/raw/master/userscripts/pardus_holiday_drop.user.js
// ==/UserScript==

(function() {
    'use strict';

    document.querySelector('form[action="drop_cargo.php"]').action = "xmas_charity.php"
    document.querySelector('input[name="drop"]').name = "donate";

    /*let dropButton = document.querySelector('input[name="drop"]')
    let donateButton = document.createElement("input")
    donateButton.name = "donate";
    donateButton.value = "Donate";
    donateButton.type = "submit";
    donateButton.style = dropButton.getAttribute("style");
    donateButton.addEventListener("click",donation,false)

    dropButton.hidden = "hidden";
    dropButton.after(donateButton);

    function donation(evtData){

    }*/
})();
