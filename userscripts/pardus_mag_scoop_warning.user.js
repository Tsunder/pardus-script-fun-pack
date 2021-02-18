// ==UserScript==
// @name         Mag Scoop Warning
// @namespace    https://github.com/Tsunder/
// @version      0.2
// @description  Adds visual warning for having cargo in magnetic scoop.
// @author       Tsunder
// @match        http*://*.pardus.at/main.php*
// @grant        none
// @downloadURL  https://github.com/Tsunder/pardus-script-fun-pack/raw/master/userscripts/pardus_mag_scoop_warning.user.js
// @updateURL    https://github.com/Tsunder/pardus-script-fun-pack/raw/master/userscripts/pardus_mag_scoop_warning.user.js

// ==/UserScript==

(function() {
    'use strict';

    /*
    const cargobox = document.getElementById("cargo_content")
    if (!cargobox) {
        return;
    }*/
    //const cargotext = cargobox.lastChild.firstChild;


    //if (cargobox.innerText.indexOf("t in magnetic")>-1) {
        //addmag(cargobox)
    //}

    function addmag(cargobox) {
        let magwarning = document.createElement("div");
        magwarning.id="magwarning";
        magwarning.setAttribute("style","background-color: #cfc;padding: 40px; border: 1px solid grey")
        magwarning.innerText = "Hey love, you're in mag scoop!"
        cargobox.parentElement.append(magwarning);
    }

    //maybe works??
    //document.onreadystatechange = () { if (document.readyState != "complete") {return;} run();}
    function run() {
        //console.log("complete");
        let cargobox = document.getElementById("cargo_content")
        if (!cargobox) {return;}
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
    run();

   /*function mutationHandler(mutationList) {
       mutationList.forEach(function(mutation) {
           if (mutation.type == "attributes") {

                var cargobox = document.getElementById("cargo_content")
                if (!cargobox) {
                    return;
                }
               console.log("mutating!");
                if (cargobox.innerText.indexOf("t in magnetic")>0) {
                    if(document.getElementById("magwarning")) {
                        magwarning.setAttribute("display","");
                    }
                    else {
                        cargobox.parentElement.append(magwarning);
                    }
                }
                else {
                    magwarning.setAttribute("display","none");
                }
            }
            else {
                //console.log(mutation);
            }
        });
    };
    const MutationObserver = window.MutationObserver;
    const observer = new MutationObserver(mutationHandler);
    const config = { attributes: true, childList: true, subtree: true };
    var target = document.querySelector("#cargo_content");//should be identical to cargobox??
    */
    //observer.observe(target,config);

    //console.log("mutation observer made and running");

})();
