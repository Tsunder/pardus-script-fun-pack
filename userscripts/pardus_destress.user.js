// ==UserScript==
// @name         Destress call
// @namespace    Pardus.at
// @version      1.0
// @description  Destressing
// @author       Baldur
// @include      *pardus.at/msgframe.php*
// @include      *pardus.at/distresscall.php*
// @downloadURL  
// @updateURL    
// @grant        GM_getValue
// @grant        GM_setValue
// ==/UserScript==

(function() {

    var calltype = "fuel" // can be "fuel" or "attack"
    'use strict';
    let uni = document.location.host[0];
    if (document.location.pathname == "/msgframe.php") {
        function submitDistress () {
            var form = document.createElement("form");
            form.style.display = 'none';
            form.action = 'distresscall.php?smirk';
            form.method = 'post';
            form.target = "distresscall.php";
            var input = document.createElement("input");
            input.name = "d_type";
            input.value = calltype;
            form.append(input);
            document.body.appendChild(form);
            form.submit();
        }
        if(Date.now() > GM_getValue(`${uni}LastDistress`,0) + 10*60*1000) {
        let sendDistressEl = document.createElement("a");
            sendDistressEl.innerText = "Destress";
            sendDistressEl.addEventListener("click", submitDistress);
            let brEl = document.querySelector("a[href*='statistics']");
            brEl.after(sendDistressEl);
            brEl.after( " | ");
        }
    } else {
        if(document.getElementsByTagName("font").length > 0) {
        } else {
            GM_setValue(`${uni}LastDistress`, Date.now());
        }
        if(document.location.search.includes("smirk")) {
           window.close();
            return;
        }
    }
})();
