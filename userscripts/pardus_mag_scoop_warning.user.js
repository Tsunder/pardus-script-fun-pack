// ==UserScript==
// @name         Mag Scoop Warning
// @namespace    Pardus
// @version      0.3
// @description  displays mag scoop warning
// @author       Tsunders
// @match        *.pardus.at/main.php*
// @downloadURL  https://github.com/Tsunder/pardus-script-fun-pack/raw/master/userscripts/pardus_mag_scoop_warning.user.js
// @updateURL    https://github.com/Tsunder/pardus-script-fun-pack/raw/master/userscripts/pardus_mag_scoop_warning.user.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    if (!(document.getElementById("cargo"))) {
        return;
    }
    const MutationObserver = window.MutationObserver;
    const observer = new MutationObserver(run);
    const config = { attributes: false, childList: true, subtree: true };

    var target = document.querySelector("#cargo")
    observer.observe(target,config);
    function addmag(cargobox) {
        let magwarning = document.createElement("div");
        magwarning.id="magwarning";
        magwarning.setAttribute("style","background-color: #cfc;padding: 40px; border: 1px solid grey")
        magwarning.innerText = "Hey love, you're in mag scoop!"
        cargobox.parentElement.append(magwarning);
    }

    function run() {
        let cargobox = document.getElementById("cargo_content")
        if (cargobox.innerText.indexOf("t in magnetic")>0) {
            let magwarning = document.getElementById("magwarning")
            if (!magwarning) {
                addmag(cargobox);
            } else {
                magwarning.display = ""
            }
        } else {
            let magwarning = document.getElementById("magwarning")
            if (!magwarning) {
            } else {
                magwarning.display = "none"
            }
        }

    }
})();
