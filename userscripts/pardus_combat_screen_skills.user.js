// ==UserScript==
// @name         Pardus Combat Screen Skills
// @namespace    Pardus
// @author       Tro, updated by Tsunder
// @version      1.4.1.1
// @description  Adds your combat skills onto the combat page
// @downloadURL  https://gist.github.com/Tsunder/4275cdde4f0a8608d090e41d16300307/raw/pardus_combat_screen_skills.user.js
// @updateURL    https://gist.github.com/Tsunder/4275cdde4f0a8608d090e41d16300307/raw/pardus_combat_screen_skills.user.js
// @include      http*://*.pardus.at/ship2opponent_combat.php*
// @grant        GM_xmlhttpRequest
// @connect      *
// ==/UserScript==


/*
Version History

2018-10-24 - 1.4 add button to check skills
             1.4.1 refactor parsing skills
             1.4.1.1 url update

2018-09-02 - 1.3 using magic form stuff, thanks Miche/Sparkle! http://userscripts.xcom-alliance.info/

2018-08-29 - 1.2.1 skip direct link

2018-08-28 - 1.2 replaced link with button invest ASP window

2018-08-24 - 1.1 adds links to advanced skills page

2018-08-22 - 1.0 intial

*/
var trade_in_level = {
        tactics: 65,
        hit: 70,
        maneuver: 65,
        weaponry: 40,
        engineering: 33
    };
var skills = {
    tactics: {
            base: null,
            actual: null
        },
        hit: {
            base: null,
            actual: null
        },
        maneuver: {
            base: null,
            actual: null
        },
        weaponry: {
            base: null,
            actual: null
        },
        engineering: {
            base: null,
            actual: null
        }
};

if (document.URL.indexOf('pardus.at/ship2opponent_combat.php') > -1) {
    var checkSkillsBtn = document.createElement("input")
    checkSkillsBtn.id = "checkSkillsBtn";
    checkSkillsBtn.type = "button";
    checkSkillsBtn.value = "Check Skills";
    checkSkillsBtn.style.position = "relative";
    checkSkillsBtn.style.left = "4px";
    checkSkillsBtn.addEventListener('click',checkSkills,false);
    document.querySelector("input[value=Attack]").after(checkSkillsBtn);
}

function addButtonListeners(){
    for (var skill in skills){
        if (skills[skill].base > trade_in_level[skill]){
            document.getElementById('btn_trade_in_' + skill).addEventListener('click', clickTradeInButton, true);
        }
    }
}

function clickTradeInButton(evtData) {
        if (evtData.target.nodeName == 'BUTTON') {
        var btn = evtData.target;
        var _ahWtf = btn.getAttribute("skill");
        tradeInUsingForm(_ahWtf);
    }
}

function tradeInUsingForm(skill) {
    function append_input(form, name, value) {
        var input = document.createElement("input");
        input.type = "hidden";
        input.name = name;
        input.value = value;
        form.appendChild(input);
    }

    var _form_id = 'trade_in_form';
    var _frame_id = 'trade_in_frame';
    var form = document.getElementById(_form_id);
    if (form) document.body.removeChild(form);
    form = document.createElement('form');
    form.style.display = 'none';
    form.action = 'overview_advanced_skills.php';
    form.method = 'post';
    form.target = _frame_id;
    form.id = _form_id;
    append_input(form, 'action', 'invest');
    append_input(form, 'skill', skill);
    append_input(form, "final", "Y E S");

    document.body.appendChild(form);
    var frame = document.getElementById(_frame_id);
    if (!frame) {
        frame = document.createElement('iframe');
        frame.name = _frame_id;
        frame.id = frame.name;
        frame.style.display = "none";
        document.body.appendChild(frame);
    }
    form.submit();
}


function add_colour(skill, skill_level) {
    var _BTNASP = '<button id="btn_trade_in_' + skill + '" style="background-color:green" skill="' + skill + '"">' + skill_level + '</button>';
    if (skill_level >= trade_in_level[skill]) {
        return _BTNASP;
    }
    return skill_level;
}

function build_html_table() {
    var table = document.createElement('table');
    table.id = "combatSkills";
    var table_html = '';
    table.setAttribute('class', 'messagestyle');
    table.style.backgroundImage = document.querySelector('table.messagestyle').style.backgroundImage;
    table.style.position = 'absolute';
    table.style.top = '20px';
    table.style.left = '20px';
    table_html += '<tr>'
    + '<th>Skill</th>'
    + '<th>Base</th>'
    + '<th>Actual</th>'
    + '</tr>'
    + '<tr><td>Tactics</td><td>' + add_colour('tactics', skills.tactics.base) + '</td><td>' + skills.tactics.actual + '</td></tr>'
    + '<tr><td>Hit accuracy</td><td>' + add_colour('hit', skills.hit.base) + '</td><td>' + skills.hit.actual + '</td></tr>'
    + '<tr><td>Maneuver</td><td>' + add_colour('maneuver', skills.maneuver.base) + '</td><td>' + skills.maneuver.actual + '</td></tr>'
    + '<tr><td>Weaponry</td><td>' + add_colour('weaponry', skills.weaponry.base) + '</td><td>' + skills.weaponry.actual + '</td></tr>'
    + '<tr><td>Engineering</td><td>' + add_colour('engineering', skills.engineering.base) + '</td><td>' + skills.engineering.actual + '</td></tr>';
    table.innerHTML = table_html;
    return table;
}

function checkSkills() {
    var _frame_id = 'skills_page';
    var frame = document.getElementById(_frame_id);
    if (!frame) {
        frame = document.createElement('iframe');
        frame.name = _frame_id;
        frame.id = frame.name;
        frame.src = document.location.protocol + '//' + document.location.hostname + '/overview_stats.php';

        //waits until the frame is loaded to continue
        frame.addEventListener("load", function() {
            for(var skill in skills) {
                for(var j in skills[skill]) {
                var valueElement = this.contentDocument.getElementById(skill + "_" + j)
                skills[skill][j] = valueElement.innerHTML;
                }
            }
            var table = build_html_table();
            document.getElementById('checkSkillsBtn').after(table);
            addButtonListeners(skills)
        })
        document.body.append(frame);
    }
}
