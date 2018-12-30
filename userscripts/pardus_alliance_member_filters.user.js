// ==UserScript==
// @name         Pardus Alliance Member Filters (WIP)
// @namespace    pardus.at
// @version      0.2
// @description  adds some sorting features to the members tab.
// @author       Tsunder
// @match        *://*.pardus.at/alliance_members.php*
// @grant        none
// @updateURL    https://github.com/Tsunder/pardus-script-fun-pack/raw/master/userscripts/pardus_alliance_member_filters.user.js
// ==/UserScript==

(function() {
    'use strict';
/*
goals:
- toggle for show all / by various activity -- done
- show free building slots -- done!
- multiple filters - not done. multiple filters works only iff one selection from multiple is chosen.
*/
    var members = Array.from(document.getElementsByClassName('first')[0].parentElement.children);
    members.shift(); //removes the top element
    var showMembers = {}, hideMembers = {};
    var filters = {};
    var FILTER_OPTIONS = [
        ["Show Only",[
          ["oneweek", "less than 1 week"],
          ["onemonth", "over 1 week"],
          ["twomonths", "1 month"],
          ["threemonths", "2 months"],
          ["fourmonths", "3 months"],
          ["fivemonths", "4 months"],
          ["sixmonths", "5 months"],
          ["longtime", "Too long"]
            ]
         ],
        ["Free Slots", [
            ["zeroslots", "0 slots"],
            ["oneslots", 1],
            ["twoslots", 2],
            ["threeslots", 3],
            ["fourslots", 4],
            ["fiveslots", 5],
            ["sixslots", 6]
            ]
         ],
        ["Other Settings", [
            ["exactbuildingslots", "Select only exact amount of slots"]
            ]
         ]
        ];

    var FILTER_HTMLS = {
        "oneweek" : "less&nbsp;than<br><b>1</b>&nbsp;week<br>ago",
        "onemonth" : "more&nbsp;than&nbsp;<br><b>1</b>&nbsp;week<br>ago",
        "twomonths"   : "more&nbsp;than&nbsp;<br><b>1</b>&nbsp;month<br>ago",
        "threemonths" : "more&nbsp;than&nbsp;<br><b>2</b>&nbsp;months<br>ago",
        "fourmonths" : "more&nbsp;than&nbsp;<br><b>3</b>&nbsp;months<br>ago",
        "fivemonths" : "more&nbsp;than&nbsp;<br><b>4</b>&nbsp;months<br>ago",
        "sixmonths" : "more&nbsp;than&nbsp;<br><b>5</b>&nbsp;months<br>ago",
        "longtime": "more&nbsp;than&nbsp;<br><b>6</b>&nbsp;months<br>ago"
    }

    addControls();
    for (var i in members) {
        members[i].children[4].append("free slots: " + (getBuildingSlots(members[i]) - getUsedBuildingSlots(members[i])));
    }

    function addControls () {
        var _br = document.createElement("br");
        var _updateSpan = document.querySelector('span');
        var _controlElement = document.createElement("div");
        _updateSpan.append(document.createElement("br"));
        _updateSpan.after(_controlElement);

        _controlElement.id = "controls";
        _controlElement.append(document.createElement("br"));
        _controlElement.append("Show");
        _controlElement.append(document.createElement("br"));
        addTable(_controlElement);
        addFilterButton(_controlElement);
        addClearButton(_controlElement);
    }

    //adds all options to the options table.
    function addTable(ele) {
        var table = document.createElement("table");
        table.id = "filters";
        table.style.align = 'center';
        table.style.margin = '10px 0';
        //table.style="background:url(//static.pardus.at/img/std/bg.gif)"
        table.width = '100%'
        var tbody = document.createElement("tbody");
        var tr = tbody.insertRow();
        for (var _i in FILTER_OPTIONS) {
            var _td = tr.insertCell()
            _td.innerText = FILTER_OPTIONS[_i][0]
            var _options = document.createElement("tr")
            _td.appendChild(_options);
            for (var _j in FILTER_OPTIONS[_i][1]) {
                var _checkRow = document.createElement("tr");
                _options.appendChild(_checkRow);
                var _optionCheck = document.createElement("input");
                _optionCheck.type = "checkbox";
                _optionCheck.id = FILTER_OPTIONS[_i][1][_j][0];
                _checkRow.appendChild(_optionCheck);
                _checkRow.appendChild(document.createTextNode(FILTER_OPTIONS[_i][1][_j][1]));
            }
        }

        table.appendChild(tbody);
        ele.append(table);
    }

    function addFilterButton(ele) {
        var filterButton = document.createElement("input");
        filterButton.type = "button";
        filterButton.value = "Filter";
        filterButton.addEventListener("click", filterMembers);
        ele.append(document.createElement("br"))
        ele.append(filterButton)
        ele.append(document.createElement("br"))
    }

    function addClearButton(ele) {
        var filterButton = document.createElement("input");
        filterButton.type = "button";
        filterButton.value = "Clear";
        filterButton.addEventListener("click", clearMembers);
        ele.append(document.createElement("br"))
        ele.append(filterButton)
        ele.append(document.createElement("br"))
    }

    function clearMembers() {
        members.forEach((e)=>{e.removeAttribute("hidden")});
    }

    //this is the part where it is supposed to filter everyone according to everything.
    function filterMembers() {
        hideMembers = {};
        showMembers = {};
        //filters for activity
        //iterates over every activity setting, looks for the checkbox for that setting being ticked, and searches the member list for members that have the specific age of activity
        for (var i in FILTER_OPTIONS[0][1]) {
            if (document.getElementById(FILTER_OPTIONS[0][1][i][0]).checked) {
                for (var _member in members) {
                    if (members[_member].innerHTML.includes(FILTER_HTMLS[FILTER_OPTIONS[0][1][i][0]])) {
                       showMembers[_member] = true;
                    }
                    else hideMembers[_member] = true;
                }
            }
        }

        //filters for open building slots
        for (var i in FILTER_OPTIONS[1][1]) {
            if (document.getElementById(FILTER_OPTIONS[1][1][i][0]).checked) {
                for (var _member in members) {
                    if (document.getElementById("exactbuildingslots").checked) {
                        if (getBuildingSlots(members[_member]) - getUsedBuildingSlots(members[_member]) == i) {
                            console.log(parseInt(members[_member].children[2].innerText.replace(/,/g,'')) + " " + getBuildingSlots(members[_member]) + " "+ getUsedBuildingSlots(members[_member]))
                            showMembers[_member] = true;
                        } else hideMembers[_member] = true;
                    }
                    else if (getBuildingSlots(members[_member]) - getUsedBuildingSlots(members[_member]) >= i) {
                        showMembers[_member] = true;
                    }
                    else hideMembers[_member] = true;
                }
            }
        }

        //does the hiding/showing
        for (var _member in members) {
            if (showMembers[_member] && !(hideMembers[_member])) {
                members[_member].removeAttribute("hidden");
            } else {
                members[_member].setAttribute("hidden","hidden");
            }
        }
    }

    function getBuildingSlots(member) {
        var exp = parseInt(member.children[2].innerText.replace(/,/g,''))
        return Math.floor(Math.log10(exp/10))
    }

    function getUsedBuildingSlots(member) {
        return member.children[4].querySelectorAll('img').length
    }
})();
