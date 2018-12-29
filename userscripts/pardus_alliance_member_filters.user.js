// ==UserScript==
// @name         Pardus Alliance Member Filters (WIP)
// @namespace    pardus.at
// @version      0.1
// @description  DOES NOTHING adds some sorting features to the members tab.
// @author       You
// @match        *://*.pardus.at/alliance_members.php*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
/*
goals:
- toggle for show all / by various activity
- show free building slots

*/
    // Your code here...
    var members = Array.from(document.getElementsByClassName('first')[0].parentElement.children);
    var hiddenMembers = {}
    var filters = {};
    var FILTER_OPTIONS = [
        ["Inactivity",[
          ["oneweek", "1 week"],
          ["onemonth", "1 month"],
          ["twomonths", "2 months"],
          ["threemonths", "3 months"],
          ["fourmonths", "4 months"],
          ["fivemonths", "5 months"],
          ["sixmonths", "6 months"],
          ["longtime", "Too long"]
            ]
         ],
        ["Free Slots", [
            ["zeroslots", 0],
            ["oneslots", 1],
            ["twoslots", 2],
            ["threeslots", 3],
            ["fourslots", 4],
            ["fiveslots", 5],
            ["sixslots", 6]
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
        ele.append(filterButton)
    }

    //this is the part where it is supposed to filter everyone according to everything.
    function filterMembers() {
        for (var i in FILTER_OPTIONS[0][1]) {
            if (document.getElementById(FILTER_OPTIONS[0][1][i][0]).checked) {
                for (var _member in members) {
                    if (members[_member].innerHTML.includes(FILTER_HTMLS[FILTER_OPTIONS[0][1][i][0]])) {
                       hiddenMembers[_member]= true;
                       console.log("for: " + FILTER_OPTIONS[0][1][i][0] + " added " + _member)
                    }
                }
            }
        }
        console.log("total hiding: " + hiddenMembers);
        for (var _member in members) {
            if (hiddenMembers[_member] > -1) {
                members[_member].parentElement.setAttribute("hidden","hidden");
                delete hiddenMembers[_member];
            } else {
                members[_member].parentElement.removeAttribute("hidden");
            }

        }
        console.log("all hid?" + hiddenMembers);
    }
})();
