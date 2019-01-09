// ==UserScript==
// @name         Pardus Alliance Member Filters
// @namespace    pardus.at
// @version      0.4
// @description  adds some sorting features to the members tab.
// @author       Tsunder
// @match        *://*.pardus.at/alliance_members.php*
// @grant        none
// @updateURL    https://github.com/Tsunder/pardus-script-fun-pack/raw/master/userscripts/pardus_alliance_member_filters.user.js
// @downloadURL  https://github.com/Tsunder/pardus-script-fun-pack/raw/master/userscripts/pardus_alliance_member_filters.user.js
// ==/UserScript==

(function() {
    'use strict';

    var members = Array.from(document.getElementsByClassName('first')[0].parentElement.children);
    members.shift(); //removes the top element
    var filters = [ //gets reset in filterMembers()
        [],
        [],
        []
    ];
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
            ["zeroslots", 0],
            ["oneslots", 1],
            ["twoslots", 2],
            ["threeslots", 3],
            ["fourslots", 4],
            ["fiveslots", 5],
            ["sixslots", 6]
            ]
         ],
        ["Other Settings", [
            ["exactbuildingslots", "Only exact available building slots."],
            ["hasstarbase", "Only pilots who have a starbase."],
            ["nostarbase", "Only pilots who do not have a starbase."]
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
        members[i].children[4].append("Free slots: " + (getBuildingSlots(members[i]) - getUsedBuildingSlots(members[i])));
    }

    function addControls () {
        var _br = document.createElement("br");
        var _updateSpan = document.querySelector('span');
        var _controlElement = document.createElement("div");
        _updateSpan.append(document.createElement("br"));
        _updateSpan.after(_controlElement);

        _controlElement.id = "controls";
        _controlElement.append(document.createElement("br"));
        _controlElement.append("Member filters");
        _controlElement.append(document.createElement("br"));
        addTable(_controlElement);
        //addFilterButton(_controlElement);
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
                _optionCheck.addEventListener("click", filterMembers);
                _checkRow.appendChild(_optionCheck);
                _checkRow.appendChild(document.createTextNode(FILTER_OPTIONS[_i][1][_j][1]));
            }
        }

        table.appendChild(tbody);
        ele.append(table);
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
        for (var i in FILTER_OPTIONS) {
            for (var j in FILTER_OPTIONS[i][1]) {
                document.getElementById(FILTER_OPTIONS[i][1][j][0]).checked = false
            }
        }

    }

    //this is the part where it is supposed to filter everyone according to everything.
    function filterMembers() {
        //clears the filters
        filters = [
            [],
            [],
            []
        ]
        let _alternating = true; // alternates background colours

        //finds  which filters are active
        for (var i in FILTER_OPTIONS) {
            for (var j in FILTER_OPTIONS[i][1]) {
                if(document.getElementById(FILTER_OPTIONS[i][1][j][0]).checked){
                    filters[i].push(parseInt(j)); //for some reason j is a string, so we change it to int
                }
            }
        }
        var _hasBuildings = filters[1].length == 0;
        var _hasActivity = filters[0].length == 0;
        var _starbase = true;

        for (var _member in members) {
            //checks player activity if needed
            for (var i in filters[0]) {
                if (!_hasActivity) {
                    if (members[_member].innerHTML.includes(FILTER_HTMLS[FILTER_OPTIONS[0][1][filters[0][i]][0]])) {
                        _hasActivity = true;
                    }
                }
            }

            //checks building slots if needed
            _hasBuildings = filters[1].length == 0;
            for (var i in filters[1]) {
                if (!_hasBuildings) {
                    //checks if it's looking for exact number of slots or equal or more
                    if (filters[2].includes(0)) {
                        if (getBuildingSlots(members[_member]) - getUsedBuildingSlots(members[_member]) == filters[1][i]) {
                            _hasBuildings = true;
                        }
                    }
                    else if (getBuildingSlots(members[_member]) - getUsedBuildingSlots(members[_member]) >= filters[1][i]) {
                        _hasBuildings = true;
                    }
                }
            }

            //checks starbase filters
            _starbase = true;
            if (filters[2].includes(1)) { // checks has starbase
                _starbase = members[_member].children[4].innerHTML.indexOf("starbase") > -1;
            }
            else if (filters[2].includes(2)) { // checks if doesn't have starbase
                _starbase = !(members[_member].children[4].innerHTML.indexOf("starbase") > -1);
            }

            //only shows if both activity and building slots are met
            _hasActivity = filters[0].length == 0;
            if (_hasActivity && _hasBuildings && _starbase) {
                members[_member].removeAttribute("hidden");
                _alternating = !_alternating; // changes the style
                if (_alternating) {
                    members[_member].setAttribute("class","alternating");
                } else {
                    members[_member].removeAttribute("class");
                }
            } else {
                members[_member].setAttribute("hidden","hidden");
            }
        }
    }

    function getBuildingSlots(member) {
        var _exp = parseInt(member.children[2].innerText.replace(/,/g,''))
        return Math.floor(Math.log10(_exp/10))
    }

    function getUsedBuildingSlots(member) {
        return member.children[4].querySelectorAll('img').length
    }
})();
