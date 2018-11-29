// ==UserScript==
// @name         Custom Pilot Portraits
// @namespace    Tsunders
// @version      0.1.1.5
// @description  Replaces the pilot's portrait in various contexts that it shows up.
// @author       Tsunders
// @match        *://*.pardus.at/overview_stats.php*
// @match        *://forum.pardus.at/*showtopic=*
// @match        *://*.pardus.at/profile.php?*
// @match        *://chat.pardus.at/chat.php*
// @grant        none
// @downloadurl  https://gist.github.com/Tsunder/ac121bf866d1bfbd1993c7d5c3d4093f/raw/custom%2520portrait.user.js
// @updateurl    https://gist.github.com/Tsunder/ac121bf866d1bfbd1993c7d5c3d4093f/raw/custom%2520portrait.user.js

// ==/UserScript==

// known bugs: chat doesn't update new messages with modified portraits, but checks once every second instead.

// 0.1.1.5 url updates
// 0.1.1.4 profile url
// 0.1.1.3 clean up. makeshift chat updater.
// 0.1.1.2 non ID based profile
// 0.1.1.1 bug
// 0.1.1 "cleanup"
// 0.1 initial


(function() {
    var data = {
        orion : {
            use : false, //use a custom image for Artemis, default: false, do not use.
            race : "", //Custom Race name
            image : "", //Custom portrait URL
            id : 0, //Pilot ID
            name : ""//Pilot Name
        },
        artemis : {
            use : false, //use a custom image for Artemis, default: false, do not use.
            race : "", //Custom Race name
            image : "", //Custom portrait URL
            id : 0, //Pilot ID
            name : ""//Pilot Name
        },
        pegasus : {
            use : false, //use a custom image for Pegasus, default: false, do not use.
            race : "", //Custom Race name
            image : "", //Custom portrait URL
            id : 0, //Pilot ID
            name : ""//Pilot Name
        }
    };

    var lastLine = 0;


    'use strict';

    if (document.URL.indexOf('pardus.at/overview_stats') > -1) {
        var u = document.URL.split(".")[0].split("//")[1]
        if (data[u]['use'] == false) {
            return;
        }
        //console.log(u);
        var raceImage = document.getElementById("race");
        if (raceImage) {
            replaceImage(raceImage,u);
        }
    }
    else if (document.URL.indexOf('pardus.at/profile.php') > -1) {
        var u = document.URL.split(".")[0].split("//")[1]
        if (data[u]['use'] == false) {
            return;
        }
        if (document.getElementsByTagName("h1")[0].innerText.split("\'")[0].toLowerCase().localeCompare(data[u]['name'].toLowerCase()) == 0) {
            var profileImage = document.querySelector("[title^='Ska']") || document.querySelector("[title^='Human']") || document.querySelector("[title^='Keld']") || document.querySelector("[title^='Brain']")
            if (profileImage) {
                replaceImage(profileImage,u);
            }
        }
    }
    else if (document.URL.indexOf('forum.pardus.at') > -1){
       var navstrip = document.getElementById("navstrip");
        var universe = document.URL.split(".")[0].split("//")[1]
       if (navstrip) {
           if (navstrip.innerText.indexOf("Orion") > -1 ) {
               universe = "orion";
           }
           else if (navstrip.innerText.indexOf("Artemis") > -1 ) {
               universe = 'artemis';
           }
           else if (navstrip.innerText.indexOf("Pegasus") > -1 ) {
               universe = 'pegasus';
           }
           else {
               return;
           }
       } else {
           return;
       }
       if (data[universe]['use'] == false) {
           return;
       }
       var ownPosts = document.querySelectorAll("a[href$='" + data[universe]['id'] + "']");
       for (var i = 0; i < ownPosts.length; i++) {
           if (ownPosts[i].firstElementChild.getAttribute("src").indexOf("race") > -1) {
           replaceImage(ownPosts[i].firstElementChild,universe);
           }
       }
    }
    else if (document.URL.indexOf("chat.pardus.at/chat.php") > -1){
        window.setInterval(replaceImagesInChat,1000); //1000 - one second delay to allow for "all" text to load. slow connections may not have all loaded. not sure.
        //console.log(document.getMsg);
        //how to check lines once a new line has been recieved? current implementation sets a timer. would rather use this "AJAX" thing.
        //var sendBtn = document.getElementById("chatmsg_type").nextElementSibling;
        //sendBtn.addEventListener('click', replaceImagesInChat, false);
    }

//checks lines based on where it left off last time
function replaceImagesInChat() {
    var source = document.getElementById("ChatFrame").getAttribute("src")
    if (!(source.indexOf("rpg") > -1 || source.indexOf("ally") > -1 || source.indexOf("trade") > -1)) {
        //not sure about mod, admin, help channels.
        return;
    }
    var u = source.split("uni=")[1].split("&")[0].toLowerCase();
    if (data[u]['use'] == false) {
           return;
       }
    var doc = document.getElementById("ChatFrame").contentDocument;
    var prelines = doc.getElementsByClassName("date");
    var lines = [];
    for (var i = lastLine; i < prelines.length; i++) {
        lines.push(prelines[i].nextElementSibling);
    }
    for (var i = lastLine; i < lines.length; i++) {
        if(lines[i].getAttribute("href")) {
            if (lines[i].nextElementSibling.getAttribute("href").indexOf(data[u]['id']) > -1) {
                var x = lines[i].parentElement.querySelector("img[src*='race']")
                if (x) {
                    replaceImage(x,u);
                }
            }
        }
    }
    lastLine = lines.length;
    //console.log("checking");
}

//takes the image element and replaces it with data from relevant universe.
function replaceImage(ele,u) {
    ele.setAttribute("src", data[u]['image']);
    ele.setAttribute("title", data[u]['race']);
    ele.setAttribute("alt", data[u]['race']);
}
})();
