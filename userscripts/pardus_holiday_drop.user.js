// ==UserScript==
// @name         Donate from Cargo
// @namespace    Tsunders
// @version      0.3
// @description  Adds a Donate button to your drop cargo screen! ^_^ Remember to disable this once the holiday drive is over!
// @author       Tsunders
// @match        *.pardus.at/drop_cargo.php*
// @grant        none
// @icon         http://static.pardus.at/img/stdhq/128/ships/harrier_xmas.png
// @updateURL    https://github.com/Tsunder/pardus-script-fun-pack/raw/master/userscripts/pardus_holiday_drop.user.js
// ==/UserScript==

(function() {
    'use strict';

    function addDonateButton() {
        let dropButton = document.getElementsByName("drop")[0];
        let donateButton = document.createElement("input");
        let donateSpan = document.createElement("span");
        donateButton.id = "donate";
        donateButton.name = "donate";
        donateButton.type = "submit";
        donateButton.value = "Donate";
        donateButton.addEventListener('click', donate, false);
        donateButton.style = dropButton.getAttribute("style");
        donateSpan.appendChild(donateButton);
        dropButton.parentNode.insertBefore(donateSpan,dropButton.parentNode.lastChild.previousElementSibling);
    }
    addDonateButton();
    function donate() {
        document.querySelector('form[action="drop_cargo.php"]').action = "xmas_charity.php"
    }
})();
