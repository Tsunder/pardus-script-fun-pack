// ==UserScript==
// @name         Drop To Donate
// @namespace    Tsunders
// @version      0.2
// @description  When you drop stuff, you donate it instead! ^_^ Remember to disable this once the holiday drive is over. Also disable if you want to drop undonatable stuff like illegal commodities.
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

    function addUndonateButton() {
	    let donateButton = document.getElementsByName("donate")[0];
        let undonateButton = document.createElement("input");
        let undonateSpan = document.createElement("span");
        undonateButton.id = "undonate";
        undonateButton.type = "button";
	    undonateButton.value = "Undonate";
	    undonateButton.addEventListener('click', undonate, false);
	    undonateButton.style = donateButton.getAttribute("style");
        undonateSpan.appendChild(undonateButton);
	    donateButton.parentNode.insertBefore(undonateSpan,donateButton.parentNode.lastChild.previousElementSibling);
	}
    addUndonateButton();
    function undonate() {
            document.querySelector('form[action="xmas_charity.php"]').action = "drop_cargo.php"
    document.querySelector('input[name="donate"]').name = "drop";
    }
})();
