// INTENDED TO BE USED WITH PARDUS MULTI MESSAGE, GET PARDUS MULTI MESSAGE AT https://github.com/Tsunder/pardus-script-fun-pack/raw/master/userscripts/pardus_multi_message.user.js
//
// ==UserScript==
// @name         PardusMessaging
// @namespace    jirina42@seznam.cz , astraltoremail@gmail.com
// @author       jirina, Tsunders
// @description  Adds some useful features to the standard IGM messaging in Pardus.
// @version      1.6.1
// @include      *://*.pardus.at/messages_private.php*
// @include      *://*.pardus.at/messages_alliance.php*
// @include      *://*.pardus.at/sendmsg.php*
// @include      *://*.pardus.at/options.php*
// @downloadURL  https://github.com/Tsunder/pardus-script-fun-pack/raw/master/userscripts/pardus_messaging.user.js
// @updateURL    https://github.com/Tsunder/pardus-script-fun-pack/raw/master/userscripts/pardus_messaging.user.js
// @icon         http://www.pardus.at/favicon.ico

// 1.6.1    2019 04 09  minor fix for styling
// 1.6      2019 01 23  new feature: presets can be set to "append" onto messages instead of presending.
// 1.5.2    2018 11 28  download migration
// 1.5.1    2018 11 09  update for "span" colours.
// 1.5      2018 10 31  add reply to all button, dependent on "pardus multi message"
//                          strip out remaining TFA stuff

// RIP terran federation academy forums.
// Pincedragon (orion)
// http://orion.pardus.at/profile.php?id=216482

// @grant   GM_getValue
// @grant   GM_setValue
// ==/UserScript==

// ////////////////////////////////////////////////////////////////////////
// Imported -- Rhindon's Standard Cookie Code
//      -- Stores GreaseMonkey Values instead of actual Cookies
// ////////////////////////////////////////////////////////////////////////

text = document.URL;
if(text.indexOf("orion.pardus.at") >= 0 ){
    universe = "orion";
}else if(text.indexOf("artemis.pardus.at") >= 0) {
    universe = "artemis";
}else if(text.indexOf("pegasus.pardus.at") >= 0) {
    universe = "pegasus";
}


function createCookie(name,value) {
    GM_setValue(name,value);
}

function readCookie(name) {

    try {
        var temp = GM_getValue(name);
        if(temp != '~~~DELETED~~~') return temp;
        return null;
    } catch(err) {
        return null;
    }
}
function eraseCookie(name) {
    createCookie(name,"~~~DELETED~~~");
}
// ////////////////////////////////////////////////////////////////////////
// End imported code
// ////////////////////////////////////////////////////////////////////////

function mysendmsg() {
    // Search for the messages
    var cbs = document.getElementsByName("checkbox[]");
    var player = this.getAttribute("to");
    var subject = this.getAttribute("subj");
    var from = this.getAttribute("from");
    var last = this.getAttribute("last");
    var all = this.getAttribute("all");
    var index = this.getAttribute("table");
    var private = this.getAttribute("private") == "true";
    var txt = "";

    var body = this.parentNode.parentNode.parentNode;
    var msgcelltop = body.getElementsByTagName("TR")[private?2:3];
    var msgcell = msgcelltop.getElementsByTagName("TD")[0];
    var subjcell = body.getElementsByTagName("TR")[private?1:2].getElementsByTagName("B")[0];
    var playercell = body.getElementsByTagName("TR")[0].getElementsByTagName("A")[0];
    var sentcell = playercell.parentNode.parentNode.nextSibling.nextSibling;

    txt = "\n\n---------------------------------------------------------------------\n";
    txt = txt + playercell.previousSibling.nodeValue + playercell.childNodes[0].nodeValue + "\n";
    txt = txt + subjcell.childNodes[0].nodeValue + "\n";
    txt = txt + "Sent: " + sentcell.childNodes[sentcell.childNodes.length-1].nodeValue + "\n\n";
    var skipbr = 0;
    var donutCC = false; //tracker for if the element is a part of a quoted message.
    for(var i=0; i<msgcell.childNodes.length; i++) {
        var element = msgcell.childNodes[i];
        if(element.nodeName == "BR") {
            if(skipbr == 0)
                txt = txt + "\n";
            else
                skipbr = 0;
        }else if(element.nodeName == "HR"){
            break;
        }else if (element.nodeName == "SPAN"){ //catches the color aspect
            txt += "[color=" + element.getAttribute("style").split(":")[1] + "]" + element.childNodes[0].nodeValue + "[/url]";
            continue
        }else if(element.nodeName == "FONT"){
            if(element.getAttribute("color") != "null"){
            txt = txt + "[font color=\""+element.getAttribute("color")+"\" size=\""+element.getAttribute("size")+"\"]"+element.childNodes[0].nodeValue+"[/font]";
            }else{
            txt = txt + "[font size=\""+element.getAttribute("size")+"\"]"+element.childNodes[0].nodeValue+"[/font]";
            }
            continue;
        }else if(element.nodeName == "B"){
            txt = txt + "[b]"+element.childNodes[0].nodeValue+"[/b]";
            continue;
        }else if(element.nodeName == "U"){
            txt = txt + "[u]"+element.childNodes[0].nodeValue+"[/u]";
            continue;
        }else if(element.nodeName == "I"){
            txt = txt + "[i]"+element.childNodes[0].nodeValue+"[/i]";
            continue;
        }else if(element.nodeName == "A"){
            txt = txt + "[url="+element.getAttribute("href")+"]"+element.childNodes[0].nodeValue+"[/url]";
            continue
        //not sure how to make this work RIP
        }else if(element.nodeName == "IMG"){
            //txt = txt + "test spacing ";
            txt = txt + element.getAttribute("alt");
            continue
        }else if(last == "yes" && element.nodeValue == "--------------------------------------------------------------------- "){
            break;
        }else if(element.nodeValue == "--------------------------------------------------------------------- ") {
            donutCC = true; // we are now in a quoted message
            txt = txt + element.nodeValue; // adds quote line to message
        }else if(all == "yes" && element.nodeValue.indexOf("CC: ") == 0 && !donutCC) {// if replying to all, and there's a CC line, and if this is part of the original message.
            var _CCRecipients = element.nodeValue.substring(4).split(", "); //gets an array of recipeints from the CC list (after "CC: " and seperated by ", ")
            for (var _nameIndice = 0 ; _nameIndice < _CCRecipients.length; _nameIndice++) { // comparing each recipient to the player, adds player to list if not on
                if (_CCRecipients[_nameIndice].toLowerCase().localeCompare(player.toLowerCase()) == 0 ){
                    break;
                }
                if (_nameIndice == _CCRecipients.length - 1){
                    _CCRecipients.push(player)
                    break;
                }
            }
            player = _CCRecipients.join(", "); // the to field will be populated with the CC list
            txt = txt + element.nodeValue; //adds original cclist to quoted message.
        }else{
            txt = txt + element.nodeValue;
        }
    }
    createCookie("TFA_Reply", txt);
    window.open("sendmsg.php?to="+player+"&subj="+subject,"_blank","width=800,height=600,left=100,top=50");

}

function mysendmsg2() {
    label = this.getAttribute("label");
    infoCookie = GM_getValue(universe+"_preset|"+label).split("|");
    if(infoCookie[0] != null){
        var player = infoCookie[0];
    }else{
        var player = this.getAttribute("to");
    }
    var subject = infoCookie[1];
    var last = this.getAttribute("last");
    var all = this.getAttribute("all");
    var index = this.getAttribute("table");
    var private = this.getAttribute("private") == "true";
    var txt = infoCookie[2];

    window.open("sendmsg.php?to="+player+"&subj="+subject,"_blank","width=800,height=600,left=100,top=50");
}

function addLinksToMessage(messageTable, private, index) {

    var body = messageTable.getElementsByTagName("TBODY")[0];
    var newcell = document.createElement("TD");
    var newrow = document.createElement("TR");
    newrow.appendChild(newcell);

    var msgcelltop = body.getElementsByTagName("TR")[private?2:3];
    var msgcell = msgcelltop.getElementsByTagName("TD")[0];
    var subj = body.getElementsByTagName("TR")[private?1:2].getElementsByTagName("B")[0].childNodes[0].nodeValue;

    playercell = body.getElementsByTagName("TR")[0];
    if(playercell.getElementsByTagName("A").length == 0)
        return;
    var player = playercell.getElementsByTagName("A")[0].childNodes[0].nodeValue;

    subj = subj.substr(9);

    var btn = document.createElement("input");
    //btn.id = cb.value;
    btn.type = "button";
    btn.value = "Re:";
    btn.addEventListener("click", mysendmsg, false);
    btn.setAttribute("to", player);
    btn.setAttribute("from", player);
    btn.setAttribute("subj", subj);
    btn.setAttribute("last", "no");
    btn.setAttribute("all", "no");
    btn.setAttribute("private", private);
    newcell.appendChild(btn);
    newcell.appendChild(document.createTextNode(" "));

    var btn = document.createElement("input");
    //btn.id = cb.value;
    btn.type = "button";
    btn.value = "Re: last";
    btn.addEventListener("click", mysendmsg, false);
    btn.setAttribute("to", player);
    btn.setAttribute("from", player);
    btn.setAttribute("subj", subj);
    btn.setAttribute("last", "yes");
    btn.setAttribute("all", "no");
    btn.setAttribute("private", private);
    newcell.appendChild(btn);
    newcell.appendChild(document.createTextNode(" "));

    var btn = document.createElement("input");
    //btn.id = cb.value;
    btn.type = "button";
    btn.value = "Re: All";
    btn.addEventListener("click", mysendmsg, false);
    btn.setAttribute("to", player);
    btn.setAttribute("from", player);
    btn.setAttribute("subj", subj);
    btn.setAttribute("last", "no");
    btn.setAttribute("all", "yes");
    btn.setAttribute("private", private);
    newcell.appendChild(btn);
    newcell.appendChild(document.createTextNode(" "));

    var btn = document.createElement("input");
    //btn.id = cb.value;
    btn.type = "button";
    btn.value = "Re: All: last";
    btn.addEventListener("click", mysendmsg, false);
    btn.setAttribute("to", player);
    btn.setAttribute("from", player);
    btn.setAttribute("subj", subj);
    btn.setAttribute("last", "yes");
    btn.setAttribute("all", "yes");
    btn.setAttribute("private", private);
    newcell.appendChild(btn);
    newcell.appendChild(document.createTextNode(" "));

    var btn = document.createElement("input");
    //btn.id = cb.value;
    btn.type = "button";
    btn.value = "Fw:";
    btn.addEventListener("click", mysendmsg, false);
    btn.setAttribute("to", "");
    btn.setAttribute("from", player);
    btn.setAttribute("subj", subj);
    btn.setAttribute("last", "no");
    btn.setAttribute("all", "no");
    btn.setAttribute("private", private);
    newcell.appendChild(btn);
    newcell.appendChild(document.createTextNode(" "));

    var btn = document.createElement("input");
    //btn.id = cb.value;
    btn.type = "button";
    btn.value = "Fw: last";
    btn.addEventListener("click", mysendmsg, false);
    btn.setAttribute("to", "");
    btn.setAttribute("from", player);
    btn.setAttribute("subj", subj);
    btn.setAttribute("last", "yes");
    btn.setAttribute("all", "no");
    btn.setAttribute("private", private);
    newcell.appendChild(btn);

    /*presetBtn = new Array();
    loadPresetData(player,private,subj,index);
    if(presetBtn.length > 0){
    newcell.appendChild(document.createTextNode(" "));

    for(i=0; i<presetBtn.length; i++){
    newcell.appendChild(presetBtn[i]);
    newcell.appendChild(document.createTextNode(" "));
    }
    }

    body.appendChild(document.createTextNode(""));*/
    body.appendChild(newrow);

}

function loadPresetData(player,private,subj,index){
    //unused
    if(GM_getValue(universe+"_preset_ids") == null){
        GM_setValue(universe+"_preset_ids","");
    }
    allPresets = loadPresets();
    if(allPresets[0] == "") return;
    for(i in allPresets){
        infoCookie = GM_getValue(universe+"_preset|"+allPresets[i]).split("|");

        presetBtn[i] = document.createElement("input");
        presetBtn[i].type = "button";
        presetBtn[i].value = allPresets[i];
        presetBtn[i].addEventListener("click", mysendmsg2, false);
        presetBtn[i].setAttribute("last", "no");
        presetBtn[i].setAttribute("all", "no");
        presetBtn[i].setAttribute("private", private);
        presetBtn[i].setAttribute("label", allPresets[i]);
        presetBtn[i].setAttribute("to", player);

    }
}
function deletePreset(id){
    del = confirm("Do you really wish to delete this preset? ("+id+")");
    if(!del) return;

    var deleteMe = document.getElementById(id);
    deleteMe.parentNode.removeChild(deleteMe);

    newcookie = "";
    divs = document.getElementById("messaging").getElementsByTagName("div");
    for(i = 0; i < divs.length; i++){
        newcookie += divs[i].id+"|";
    }
    newcookie = newcookie.slice(0,-1);
    GM_setValue(universe+"_preset_ids",newcookie);
    if(newcookie.split("|").length == 1){
        GM_setValue(universe+"_preset_ids","");
        GM_setValue(universe+"_preset|"+id,null);
    }

}

function createNewPreset(label,ignore){
    //create callback
    function addDeleteHandler(target,id){
        target.addEventListener("click", function() {deletePreset(id);}, false);
    }
    to = "";
    subj = "";
    if(!label || typeof(label) !== "string"){
        label = prompt("Enter a label for your button. The label will appear as a link in the options screen. Click that link to edit the preset, which you want add to your messaging interface.");
        if(label == null || label == "") return;
        label = label.replace(/\|/g,"_");
        label = label.replace(/ /g,"_");
        alreadyStored = GM_getValue(universe+"_preset_ids").split("|");
        for(i in alreadyStored){
            if(alreadyStored[i] == label){
                alert("Invalid identifier. Please use a unique name!");
                return;
            }
        }
    }else{
        labeldata = GM_getValue(universe+"_preset|"+label).split("|");
        to = labeldata[0];
        subj = labeldata[1];
    }

    newElement = document.createElement("div");
    newElement.id = label;

    delLink = document.createElement("a");
    delLink.innerHTML = "<font color='#FFFFFF'>[DEL]</font>";

    //use callback
    addDeleteHandler(delLink,newElement.id);

    newLink = document.createElement("a");
    newLink.target = "_blank";
    newLink.href= "sendmsg.php?to=&subj="+subj+"&preset="+label;
    newLink.innerHTML = "<font color='#FFFFFF'>[EDIT]</font>";

    newElement.appendChild(delLink);
    newElement.appendChild(document.createTextNode(" "));
    newElement.appendChild(newLink);
    newElement.appendChild(document.createTextNode(" "+label));

    document.getElementById("messaging").appendChild(newElement);

    if(!ignore){
        newcookie = label;
        GM_setValue(universe+"_preset|"+label,"||");
        if(GM_getValue(universe+"_preset_ids") == null || GM_getValue(universe+"_preset_ids") == ""){
            GM_setValue(universe+"_preset_ids",newcookie);
        }else{
            GM_setValue(universe+"_preset_ids",GM_getValue(universe+"_preset_ids")+"|"+newcookie);
        }
    }
}

function addLinks() {
    // Log
    //GM_log("addLinks Start");

    // Check that we're on the right page

    var private;
    if(text.indexOf("messages_private.php") >= 0)
        private = true;
    else if(text.indexOf("messages_alliance.php") >= 0)
        private = false;
    else
        return;

    // Search for the messages
    var tables;
    var min;
    var max;
    if(private) {
        var form1 = document.getElementsByName("form1")[0];
        tables = form1.getElementsByTagName("table");
        min = 0;
        max = tables.length;
    } else {
        var search = document.getElementsByName("search")[0];
        var container = search.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
        tables = container.getElementsByTagName("table");
        min = 1;
        max = tables.length - 2;
    }


    for(var i = max-1; i >= min; i--) {
        parseColorCode(tables[i], private);
        addLinksToMessage(tables[i], private, i);
    }

    // Log
    //GM_log("addLinks End");
}

function addReply() {
    // Check that we're on the correct page

    var letter;
    if(text.indexOf("sendmsg.php") < 0) {
        return;
    }

    var reply = readCookie("TFA_Reply");
    if(reply == null)
        var reply = readCookie("TFA_Reply_preset");
    if(reply == null)
        return;

    var input = document.getElementById("textarea");
    input.value = reply;
    eraseCookie("TFA_Reply");
    eraseCookie("TFA_Reply_preset");

}

function createOptions(){

    if(text.indexOf("options.php") < 0) return;

    if(GM_getValue(universe+"_preset_ids") == null){
        GM_setValue(universe+"_preset_ids","");
    }
    source = document.getElementsByTagName("form")[0].parentNode.getElementsByTagName("table")[0];
    form = source.parentNode;
    clone = source.cloneNode(true);
    clone.id = "messaging";
    form.appendChild(document.createElement("br"));
    form.appendChild(document.createElement("br"));
    form.appendChild(clone);
    custom1 = document.getElementById("messaging");
    custom1.getElementsByTagName("th")[0].childNodes[0].nodeValue = "Pardus Messaging";
    custom1.getElementsByTagName("td")[0].childNodes[0].nodeValue = "You can set up preset messages here, edit or remove them.";

    c1row = custom1.getElementsByTagName("tr")[2];
    c1row.removeChild(custom1.getElementsByTagName("td")[1]);

    c1btn = document.createElement("input");
    c1btn.type = "button";
    c1btn.value = "New Preset";
    c1btn.addEventListener("click", createNewPreset, false);

    c1row.appendChild(c1btn);

    savedPresets = new Array();
    savedPresets = loadPresets();

    if(savedPresets[0].length > 0){
        for(i = 0; i < savedPresets.length; i++){
            createNewPreset(savedPresets[i],true);
        }
    }

}

function loadPresets(){
    arr = GM_getValue(universe+"_preset_ids").split("|");
    return arr;
}



function usePMforCookie(){
    if(text.indexOf("preset=") < 0){
        return;
    }

    if(GM_getValue(universe+"_preset_ids") == null){
        GM_setValue(universe+"_preset_ids","");
    }


    label = text.split("preset=")[1];
    infoCookie = GM_getValue(universe+"_preset|"+label).split("|");

    newRecipient = document.createElement("input");
    newRecipient.type = "text";
    newRecipient.id = "recipient";

    append = document.createElement("input");
    append.type = "checkbox";
    append.id = "append"
    appendLabel = document.createElement("label");
    appendLabel.setAttribute("for","append");
    appendLabel.innerText = "Append preset to end of message."

    newSubmit = document.createElement("input");
    newSubmit.type = "button";
    newSubmit.value = "Save preset";
    newSubmit.onclick = function(){
        newcookie = "";
        newcookie += document.getElementById("recipient").value+"|";
        newcookie += document.getElementsByName("textfield")[0].value+"|";
        newcookie += document.getElementsByName("textarea")[0].value+"|";
        newcookie += document.getElementsByName("append").checked;
        if(newcookie.split("|").length == 4){
            GM_setValue(universe+"_preset|"+label,newcookie);
        }else{
            alert("Error! Preset could not be saved!\n\nPlease do not use the '|' sign!");
        }
        window.close();
    };

    document.getElementsByTagName("th")[0].innerHTML = "<font color='#FF0000'>Preset mode for label: "+label+"</font>";

    document.getElementsByName("recipient")[0].parentNode.appendChild(newRecipient);
    deleteElement(document.getElementById("recipient2"));
    deleteElement(document.getElementById("attach_signature"));
    deleteElement(document.getElementById("resizeLink"));
    deleteElement(document.getElementsByTagName("label")[0]);
    deleteElement(document.getElementsByTagName("input")[0]);

    document.getElementById("Send").parentElement.previousElementSibling.appendChild(append);
    document.getElementById("Send").parentElement.previousElementSibling.appendChild(appendLabel);
    document.getElementById("Send").parentElement.appendChild(newSubmit);
    deleteElement(document.getElementById("Send"));


    document.getElementById("recipient").value = infoCookie[0];
    document.getElementsByName("textfield")[0].value = infoCookie[1];
    document.getElementsByName("textarea")[0].value = infoCookie[2];
    document.getElementById("append").checked = infoCookie[3]
}

function deleteElement(element){
    var deleteMe = element;
    deleteMe.parentNode.removeChild(deleteMe);
}

function addPMshortcuts(){
    if(text.indexOf("messages_") < 0) return;

    if(GM_getValue(universe+"_quicklinks_groups") == null || GM_getValue(universe+"_quicklinks_pilots") == null){
        GM_setValue(universe+"_quicklinks_groups","");
        GM_setValue(universe+"_quicklinks_pilots","");
    }
    function openPopup(url){
        newwindow=window.open(url,'name','height=400,width=200');
        if(window.focus) {newwindow.focus();}
    }
    groupArray = loadPresetGroups();
    pilotArray = loadPresetPilots();

    quicklinks = "<tr><td align=\"left\" style=\"padding:5px;\">";
    if(groupArray != ""){
        for(i in groupArray){
            quicklinks += "<u><b>"+groupArray[i]+"</b></u><br>";
            for(j in pilotArray[0]){
                if(pilotArray[1][j] == groupArray[i]){
                    quicklinks += "<a href=\"javascript:newWindow=window.open('http://orion.pardus.at/sendmsg.php?to="+pilotArray[0][j]+"&quicklinks=true','',width=400,height=200);newWindow.focus();newWindow.resizeTo(550,500);newWindow.focus();\"><font color=\""+pilotArray[2][j]+"\">"+pilotArray[0][j]+"</font></a><br>";
                }
            }
            quicklinks += "<br>";
        }
    }
    //show by default, if cookie not set
    if(GM_getValue(universe+"_quicklinks_showHide") == "none"){
        showHideState = "none";
        quicklinks += "<a href=\"javascript:void(0);\" id=\"showHideOptions\">[Show options]</a>";
    }else{
        showHideState = "block";
        quicklinks += "<a href=\"javascript:void(0);\" id=\"showHideOptions\">[Hide options]</a>";
    }
    quicklinks += "<div id=\"message_quick_advanced\" style=\"display:"+showHideState+"\"><br>";
    quicklinks += "<a href=\"javascript:void(0);\" id=\"newGroup\">[Add new group]</a><br>";
    quicklinks += "<a href=\"javascript:void(0);\" id=\"newPilot\">[Add new pilot]</a><br>";
    quicklinks += "<br>";
    quicklinks += "<a href=\"javascript:void(0);\" id=\"sortGroupsLink\">[Sort groups A-Z]</a><br>";
    quicklinks += "<a href=\"javascript:void(0);\" id=\"sortPilotsLink\">[Sort pilots A-Z]</a><br>";
    quicklinks += "<br>";
    quicklinks += "<a href=\"javascript:void(0);\" id=\"deleteGroup\">[Delete group]</a><br>";
    quicklinks += "<a href=\"javascript:void(0);\" id=\"deletePilot\">[Delete pilot]</a></div></td></tr>";

    tableheaders = document.getElementsByTagName("th");
    for(i=0; i<tableheaders.length; i++){
        if(tableheaders[i].innerHTML.match("Report")){
            targetTable = i;
        }
    }
    tableheaders[targetTable].parentNode.parentNode.parentNode.parentNode.innerHTML += "<table id=\"message_quicklinks\" width=\"135\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\" style=\"background:url(http://static.pardus.at/images/bg.gif)\"><tr><th>Quicklinks</th></tr>"+quicklinks+"</table><p> </p>";

    sortGroupsLink = document.getElementById("sortGroupsLink");
    sortGroupsLink.onclick = function(){
        sortAndSave(universe+"_quicklinks_groups");
        document.location.reload(true);
    };
    sortPilotsLink = document.getElementById("sortPilotsLink");
    sortPilotsLink.onclick = function(){
        sortAndSave(universe+"_quicklinks_pilots");
        document.location.reload(true);
    };
    newGroup = document.getElementById("newGroup");
    newGroup.onclick = function(){
        addNewGroup();
        document.location.reload(true);
    };
    newPilot = document.getElementById("newPilot");
    newPilot.onclick = function(){
        addNewPilot();
        document.location.reload(true);
    };
    deletePilot = document.getElementById("deletePilot");
    deletePilot.onclick = function(){
        deletePilotByName();
        document.location.reload(true);
    };
    deleteGroup = document.getElementById("deleteGroup");
    deleteGroup.onclick = function(){
        deleteGroupByName();
        document.location.reload(true);
    };
    showHideOptions = document.getElementById("showHideOptions");
    showHideOptions.onclick = function(){
        if(document.getElementById("message_quick_advanced").style.display != "none"){
            document.getElementById("message_quick_advanced").style.display = "none";
            GM_setValue(universe+"_quicklinks_showHide","none");
            document.getElementById("showHideOptions").innerHTML = "[Show options]";
        }else{
            document.getElementById("message_quick_advanced").style.display = "block";
            GM_setValue(universe+"_quicklinks_showHide","block");
            document.getElementById("showHideOptions").innerHTML = "[Hide options]";
        }
    };
}

function deleteGroupByName(){
    delName = prompt("Enter a group you wish to remove");
    if(!delName) return;
    pilots = new Array();
    pilots = loadPresetPilots();
    newCookie = "";
    for(i in pilots[0]){
        if(pilots[1][i] != delName){
            newCookie += pilots[0][i]+"~"+pilots[1][i]+"~"+pilots[2][i]+"|";
        }
    }
    newCookie = newCookie.slice(0,-1);
    GM_setValue(universe+"_quicklinks_pilots",newCookie);
    groups = new Array();
    groups = loadPresetGroups();
    newGroupCookie = "";
    for(i in groups){
        if(groups[i] != delName){
            newGroupCookie += groups[i]+"|";
        }
    }
    newGroupCookie = newGroupCookie.slice(0,-1);
    GM_setValue(universe+"_quicklinks_groups",newGroupCookie);
}

function deletePilotByName(){
    delName = prompt("Enter a pilot you wish to remove");
    if(!delName) return;
    pilots = new Array();
    pilots = loadPresetPilots();
    newCookie = "";

    for(i in pilots[0]){
        if(pilots[0][i] != delName){
            newCookie += pilots[0][i]+"~"+pilots[1][i]+"~"+pilots[2][i]+"|";
        }
    }
    newCookie = newCookie.slice(0,-1);
    GM_setValue(universe+"_quicklinks_pilots",newCookie);
}

function addNewPilot(){
    groups = loadPresetGroups();
    if(groups == ""){
        alert("You have to create at least one group, before you can add a pilot.");
        return;
    }
    newpilotname = prompt("Please enter the pilot you want to save");
    newpilotname = newpilotname.replace(/\|/g,"").replace(/~/g,"").trim();
    if(!newpilotname) return;
    color = prompt("You can enter a color here(If you leave it blank, the link will be white)").replace(/ /g,"");
    if(!color) color = "#FFFFFF";

    grouptextForPrompt = "";
    for(i in groups){
        grouptextForPrompt += "\n--> "+groups[i];
    }
    targetgroup = prompt("Which group do you want to add the pilot \""+newpilotname+"\" to?\nAvailable options are:"+grouptextForPrompt);
    targetgroup = targetgroup.replace(/\|/g,"");

    if(!inArray(targetgroup,groups) || targetgroup == ""){
        alert("Group name invalid. Pilot not saved.");
        return;
    }
    if(GM_getValue(universe+"_quicklinks_pilots") != ""){
        GM_setValue(universe+"_quicklinks_pilots",GM_getValue(universe+"_quicklinks_pilots")+"|"+newpilotname+"~"+targetgroup+"~"+color);
    }else{
        GM_setValue(universe+"_quicklinks_pilots",newpilotname+"~"+targetgroup+"~"+color);
    }
}

function inArray(value,arr){
    for(i in arr){
        if(arr[i] == value) return true;
    }
    return false;
}

function addNewGroup(){
    newgroupname = prompt("Please enter the desired groupname");
    newgroupname = newgroupname.replace(/\|/g,"").trim();
    if(newgroupname){
        if(GM_getValue(universe+"_quicklinks_groups") != ""){
            GM_setValue(universe+"_quicklinks_groups",GM_getValue(universe+"_quicklinks_groups")+"|"+newgroupname);
        }else{
            GM_setValue(universe+"_quicklinks_groups",newgroupname);
        }
    }
}

function sortAndSave(sourcecookie){
    groups = GM_getValue(sourcecookie).split("|").sort(function(a, b){
            var x = a.toLowerCase();
            var y = b.toLowerCase();
            return x < y ? -1 : x > y ? 1 : 0;
    });
    newCookie = "";

    for(i in groups){
        newCookie += groups[i]+"|";
    }
    newCookie = newCookie.slice(0,-1);

    GM_setValue(sourcecookie,newCookie);
}

function loadPresetGroups(){
    groups = GM_getValue(universe+"_quicklinks_groups").split("|");
    return groups;
}

function loadPresetPilots(){
    pilotNames = new Array();
    pilotGroup = new Array();
    pilotColor = new Array();

    pilotDataFiles = GM_getValue(universe+"_quicklinks_pilots").split("|");

    for(i in pilotDataFiles){
        pilotinfo = pilotDataFiles[i].split("~");
        pilotNames[i] = pilotinfo[0];
        pilotGroup[i] = pilotinfo[1];
        pilotColor[i] = pilotinfo[2];
    }

    pilots = new Array();
    pilots[0] = pilotNames;
    pilots[1] = pilotGroup;
    pilots[2] = pilotColor;

    return pilots;
}

function addPresetButtons(){
    //only add presetbuttons when opening PMs with quicklinks
    //if(text.indexOf("&quicklinks=true") < 0) return;

    //add presetbuttons for each PM
    if(text.indexOf("sendmsg.php?") < 0) return;


    allPresets = loadPresets();
    if(allPresets[0] == "") return;
    //callback function
    function addPresetHandler(target,to,subj,msg,app){
        target.addEventListener("click", function() {setPMToPreset(to,subj,msg,app);}, false);
    }

    presetButton = new Array();
    for(i in allPresets){
        infoCookie = GM_getValue(universe+"_preset|"+allPresets[i]).split("|");

        presetButton[i] = document.createElement("input");
        presetButton[i].type = "button";
        presetButton[i].value = allPresets[i];
        addPresetHandler(presetButton[i],infoCookie[0],infoCookie[1],infoCookie[2],infoCookie[3]);
        document.getElementsByTagName("body")[0].appendChild(presetButton[i]);
        document.getElementsByTagName("body")[0].appendChild(document.createTextNode(" "));
    }
}
function setPMToPreset(to,subj,msg,app){
    if(to != "") document.getElementById("recipient2").value = to;
    document.getElementsByName("textfield")[0].value = subj;
    if (app) {
        document.getElementById("textarea").value += "\n" + msg;
    }
    else {
        document.getElementById("textarea").value = msg+"\n"+document.getElementById("textarea").value;
    }
}
function parseColorCode(messageTable,private){
    var msgCell = messageTable.getElementsByTagName("tr")[private?2:3].getElementsByTagName("td")[0];
    var skipBR = 0;
    var emptyElement = document.createTextNode("");

    messageText = msgCell.innerHTML.replace(/&lt;font/gi,'<font').replace(/&lt;\/font&gt;/gi,'</font>');
    messageText = messageText.replace(/&lt;u&gt;/gi,'<u>').replace(/&lt;\/u&gt;/gi,'</u>');
    messageText = messageText.replace(/&lt;b&gt;/gi,'<b>').replace(/&lt;\/b&gt;/gi,'</b>');
    messageText = messageText.replace(/&lt;i&gt;/gi,'<i>').replace(/&lt;\/i&gt;/gi,'</i>');
    messageText = messageText.replace(/&gt;/gi,'>').replace(/&quot;/gi,'"');
    msgCell.innerHTML = messageText;
}

addLinks();
addReply();
createOptions();
usePMforCookie();
addPMshortcuts();
addPresetButtons();
