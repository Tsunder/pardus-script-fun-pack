// ==UserScript==
// @name         Blackmarket Sanity Lock
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Locks uncommon black market sales and purchases to reduce accidents.
// @author       Tsunder
// @match        *.pardus.at/blackmarket.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pardus.at
// @grant        GM_getValue
// @grant        GM_setValue
// @updateURL    https://github.com/Tsunder/pardus-script-fun-pack/raw/master/userscripts/pardus_bm_sanity_lock.user.js
// @downloadURL  https://github.com/Tsunder/pardus-script-fun-pack/raw/master/userscripts/pardus_bm_sanity_lock.user.js

// ==/UserScript==

(function() {
    'use strict';

    //by default, lock stuff
    //on page load, make it so for commodities other than drugs, fuel, FWE, EM, MOE, military explosives are locked
    //press button to unlock
    //button becomes red and says that BM is unlocked
    //press button to lock again
    var tradeButton = document.querySelector('input[value="<- Transfer ->"]')
    if (!tradeButton) {return;}
    var lockButton = document.createElement("input");
    lockButton.id = "toggleLock";
    lockButton.type = "button";
    lockButton.addEventListener('click', toggleLock, false);
    lockButton.style = tradeButton.getAttribute("style");
    refreshLockButton();
    tradeButton.parentElement.appendChild(lockButton);


    var uni = document.location.host[0];
    var locked = GM_getValue(`${uni}locked`,true)
    refreshLockButton();
    tradeButton.parentElement.appendChild(lockButton);


    var cells = Array.from(document.querySelectorAll('[name*="buy"],[name*="sell"]'))

    var allowedItems = [
        "buy_1",
        "sell_1",
        "buy_2",
        "sell_2",
        "buy_3",
        "sell_3",
        "buy_5",
        "sell_5",
        "buy_6",
        "sell_6",
        "buy_7",
        "sell_7",
        "buy_16",
        "sell_16",
        "buy_17",
        "sell_17",
        "buy_51",
        "sell_51",
        "buy_105",
        "sell_105",
    ]
    if (locked) {
        cells.forEach(cell => lockRow(cell));
    }

    function lockRow(el) {
        if(allowedItems.includes(el.id)) { return; }

        el.setAttribute('maxlength', 0)
        el.value = ""

        let maxfill = el.parentElement.previousSibling.previousSibling.lastChild
        maxfill.setAttribute('nohref', maxfill.getAttribute('href'));
        maxfill.removeAttribute('href');
    }


    function unlockRow(el) {

        el.setAttribute('maxlength', 20)
        let maxfill = el.parentElement.previousSibling.previousSibling.lastChild
        maxfill.setAttribute('href', maxfill.getAttribute('nohref'));
        maxfill.removeAttribute('nohref');
    }

    function toggleLock() {
        if (locked) {
            cells.forEach(cell => unlockRow(cell));

            GM_setValue(`${uni}locked`,!locked)
            locked = !locked
            refreshLockButton()
        } else {
            cells.forEach(cell => lockRow(cell));
            GM_setValue(`${uni}locked`,!locked)
            locked = !locked
            refreshLockButton()
        }
    }

    function refreshLockButton() {

        if(locked) {
            lockButton.value = "Sanity Lock Enabled\nClick to disable";
            lockButton.style['background-color'] = "#11bb2266"
            lockButton.style.color = null

        } else {
            lockButton.value = "Sanity Lock DISABLED\nClick to enable";
            lockButton.style['background-color'] = "#EE3311DD"
            lockButton.style.color="#333333FF"

        }
    }

})();
