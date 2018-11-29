// INTENDED TO BE USED WITH PARDUS MESSAGING
// ==UserScript==
// @name           Pardus Multi Message
// @namespace      http://userscripts.xcom-alliance.info/
// @version        3.5
// @author         Miche (Orion) / Sparkle (Artemis), Pincedragon (Orion)
// @description    Enhances the Pardus message window to allow multiple recipients seperated by commas or newlines as well as configurable lists of pilot names that remain independent across universe. Based on work by Ivar (Artemis).
// @include        http*://*.pardus.at/sendmsg.php*
// @include        http*://*.pardus.at/msgframe.php
// @updateURL      https://github.com/Tsunder/pardus-script-fun-pack/raw/master/userscripts/pardus_multi_message.user.js
// @downloadURL    https://github.com/Tsunder/pardus-script-fun-pack/raw/master/userscripts/pardus_multi_message.user.js
// @icon           http://userscripts.xcom-alliance.info/multi_message/icon.png
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM_xmlhttpRequest
// ==/UserScript==

/*****************************************************************************************
	Version Information
	3.5 ( 28-Nov-2018)
	- download migration
	
    3.4 ( 31-Oct-2018)
    - added compatibility with PardusMessaging

    3.3 ( 29-Mar-2018)
    - removed old debugging code
    - implemented a delay between each message being sent to prevent dropped requests

	3.2 ( 27-May-2013)
	- disable the send message button as soon as it is clicked to prevent double-clicks

	3.1 ( 10-May-2013 )
	- released for general use
	- moved configuration to show on the side of the screen (to accomodate small screens)
	- added ability to restrict alerting when you attempt to send yourself a message
	- updated reflow of the send message page to be more robust
	- settings changes are applied immediately when the "Save and Close" button is pressed
	- removed default "first run" settings and incorporated into the open settings code
	- css only added to the page once
	- moved the resize link so that it won't disappear off screen for small screens

	3.01 ( 10-Apr-2012 )
	- implemented universe independent custom lists and settings
	- added settings panel to allow customising the settings via the send message window

	1.07 ( 10-Jul-2011 )
	- added hard coded custom lists of recipients for Orion universe only

	1.06 ( 10-Jul-2011 )
	- initial reflow of the send message window based on Ivar's original code

    **************************************************************************************

	Credit to Ivar (Artemis) for the original script that I then started hacking at:
	- http://pardus.rukh.de/dl/pardus_multi_message.user.js

*****************************************************************************************/


/*
	**************************************************************************************
		Shared utility methods
	**************************************************************************************
*/

function getUniverse() {
	var universe = window.location.host.substr(0, window.location.host.indexOf('.'));
	universe = universe.substr(0,1).toUpperCase() + universe.substr(1).toLowerCase();
	return universe;
}

if (document.URL.search('pardus.at/msgframe.php') > -1) {

/*
	**************************************************************************************
		Save the current pilot name to assist in de-duping when sending to lists of pilots
	**************************************************************************************
*/

	GM_setValue('currentPilotName' + getUniverse(), document.getElementById('universe').getAttribute('alt').split(': ')[1]);

} else {

	var WIDTH_OF_SETTINGS_PANEL = 300;
	var HEIGHT_TO_RESIZE_TOGGLE = 300;
	var b_ERROR_WHILST_SENDING_A_MESSAGE = false;
    var THROTTLE_DELAY_MS = 100;

/*
	**************************************************************************************
		Common utility methods
	**************************************************************************************
*/

	Array.prototype.unique = function() {
		var o = {}, i, l = this.length, r = [];
		for(i=0; i<l; i+=1) o[this[i]] = this[i];
		for(i in o) r.push(o[i]);
		return r;
	};

	String.prototype.strim = function() {
		return this.replace(/(^\s*)|(\s*$)/g, "");
	};

/*
	**************************************************************************************
		Methods to drive the settings panel
	**************************************************************************************
*/

	function cssForSettingsPanel() {
		if (document.getElementById('MultiMessageSettingsPanelCSS')) return;
		var CSS = document.createElement('STYLE');
		CSS.setAttribute('type','text/css');
		CSS.setAttribute('id','MultiMessageSettingsPanelCSS');
		// http://www.dailycoding.com/Utils/Converter/ImageToBase64.aspx
		var CSS_background = "data:image/gif;base64,R0lGODdhAQACAPAAABQaPAYGISwAAAAAAQACAAACAkQKADs=";
		var css = "\n/* Injected css from the Multi Message userscript */ \n\n";
		css += '#settingsWrapper { position:absolute;right:18px;top:25px; }' + '\n';
		css += '#settingsWrapper { background-image:url(' + CSS_background + ');padding:6px;font-size:11px;border:1px solid #aab;text-align:left; }' + '\n';
		css += '#settingsWrapper h3 { background-color:#aab;color:#000;text-align:center;padding:5px 8px;margin:0;font-size:11px; }' + '\n';
		css += '#settingsWrapper h4 { margin:5px 0;float:left;clear:left; }' + '\n';
		css += '#settingsWrapper .grouptitles { float:left;clear:left; }' + '\n';
		css += '#settingsWrapper .radios { float:right; }' + '\n';
		css += '#settingsWrapper .checkboxes { float:left;clear:left;margin-bottom:5px; }' + '\n';
		css += '#settingsWrapper hr { border:none;border-top:1px solid #aab;height:1px;margin:5px 0;clear:both; }' + '\n';
		css += '#settingsWrapper input[type="text"], #settingsWrapper textarea { border:1px solid #aab;border-radius:2px;padding:2px;background-color:#00001C;color:#D0D1D9;font-family:Arial,Verdana;font-size:11px; }' + '\n';
		css += '#settingsWrapper input[type="text"] { width:100px; }' + '\n';
		css += '#settingsWrapper textarea { width:280px;height:65px;margin:5px 0;float:left;clear:both; }' + '\n';
		css += '#settingsWrapper .buttons { text-align:right;margin:10px 0 5px; }' + '\n';
		css += '#settingsWrapper .buttons span { margin:0 0 0 10px;border-radius:3px;background-color:green;padding:3px 8px;border:1px solid #AAAABB;cursor:pointer;color:#D0D1D9;font-weight:bold; }' + '\n';
		css += '#settingsWrapper .buttons span#cancelAndCloseSettings { background-color:#c11;color:#D0D1D9; }' + '\n';
		CSS.innerHTML = css;
		document.body.appendChild(CSS);
	}

	function writeCurrentSettingsToSettingsPanel() {
		document.getElementById('settingsBCC_ON').checked = GM_getValue('DefaultBCCState' + universe, '') == 'checked';
		document.getElementById('settingsBCC_OFF').checked = !document.getElementById('settingsBCC_ON').checked;
		document.getElementById('settingsWarnSelf').checked = GM_getValue('SettingsWarnSelf' + universe, '') == 'true';
		document.getElementById('settingsQL1Name').value = GM_getValue('QuickList1LinkName' + universe, '') == '' ? 'List 1' : GM_getValue('QuickList1LinkName' + universe, '');
		document.getElementById('settingsQL1_ON').checked = GM_getValue('QuickList1LinkDisplay' + universe, '') == 'true';
		document.getElementById('settingsQL1_OFF').checked = !document.getElementById('settingsQL1_ON').checked;
		document.getElementById('settingsQL1Names').value = GM_getValue('QuickList1PilotNames' + universe, '') == '' ? 'Pilot 1, Pilot 2, Pilot 3' : GM_getValue('QuickList1PilotNames' + universe, '');
		document.getElementById('settingsQL2Name').value = GM_getValue('QuickList2LinkName' + universe, '') == '' ? 'List 2' : GM_getValue('QuickList2LinkName' + universe, '');
		document.getElementById('settingsQL2_ON').checked = GM_getValue('QuickList2LinkDisplay' + universe, '') == 'true';
		document.getElementById('settingsQL2_OFF').checked = !document.getElementById('settingsQL2_ON').checked;
		document.getElementById('settingsQL2Names').value = GM_getValue('QuickList2PilotNames' + universe, '') == '' ? 'Pilot 1, Pilot 2, Pilot 3' : GM_getValue('QuickList2PilotNames' + universe, '');
	}

	function getSettingsPanelHTML(universe) {
		var html = '';
		html += '<h3>Configuring Multi-Messenger options for ' + universe + '</h3>';
		html += '<hr/>';
		html += '<div>By default the BCC checkbox is ';
			html += '<input type="radio" name="settingsBCC" id="settingsBCC_ON"> <label for="settingsBCC_ON">ON</label> ';
			html += '<input type="radio" name="settingsBCC" id="settingsBCC_OFF"> <label for="settingsBCC_OFF">OFF</label> ';
		html += '</div>';
		html += '<hr/>';
		html += '<div class="checkboxes">';
			html += '<input type="checkbox" name="settingsWarnSelf" id="settingsWarnSelf"> <label for="settingsWarnSelf">Show an alert when sending yourself a message</label><br/>';
		html += '</div>';
		html += '<hr/>';
		html += '<h4>Group List 1</h4>';
		html += '<div class="grouptitles"><input type="text" id="settingsQL1Name" value=""></div>';
		html += '<div class="radios">';
			html += '<input type="radio" name="settingsQL1" id="settingsQL1_ON"> <label for="settingsQL1_ON">Show group</label> ';
			html += '<input type="radio" name="settingsQL1" id="settingsQL1_OFF"> <label for="settingsQL1_OFF">Hide group</label> ';
		html += '</div>';
		html += '<textarea id="settingsQL1Names"></textarea>';
		html += '<hr/>';
		html += '<h4>Group List 2</h4>';
		html += '<div class="grouptitles"><input type="text" id="settingsQL2Name" value=""></div>';
		html += '<div class="radios">';
			html += '<input type="radio" name="settingsQL2" id="settingsQL2_ON"> <label for="settingsQL2_ON">Show group</label> ';
			html += '<input type="radio" name="settingsQL2" id="settingsQL2_OFF"> <label for="settingsQL2_OFF">Hide group</label> ';
		html += '</div>';
		html += '<textarea id="settingsQL2Names"></textarea>';
		html += '<hr/>';
		html += '<div class="buttons"><span id="saveAndCloseSettings">Save and Close</span> <span id="cancelAndCloseSettings">Cancel</span></div>';
		return html;
	}

	function attachEventsForSettingsPanelButtons() {
		if (document.getElementById('saveAndCloseSettings')) {
			document.getElementById('saveAndCloseSettings').addEventListener('click', saveAndCloseSettingsPanel, false);
		}
		if (document.getElementById('cancelAndCloseSettings')) {
			document.getElementById('cancelAndCloseSettings').addEventListener('click', saveAndCloseSettingsPanel, false);
		}
	}

	function addSettingsPanelToPageSide() {
		cssForSettingsPanel();
		var div = document.createElement('div');
		div.setAttribute('id','settingsWrapper');
		div.innerHTML = getSettingsPanelHTML(getUniverse());
		document.getElementById('sendform').parentNode.appendChild(div);
		attachEventsForSettingsPanelButtons();
		writeCurrentSettingsToSettingsPanel();
		window.resizeBy(WIDTH_OF_SETTINGS_PANEL, 0);
	}

	function saveAndCloseSettingsPanel(e) {
		if (e.target.id == 'saveAndCloseSettings') {
			var universe = getUniverse();
			GM_setValue('DefaultBCCState' + universe, document.getElementById('settingsBCC_ON').checked ? 'checked' : '');
			document.getElementById('bcc').checked = document.getElementById('settingsBCC_ON').checked;
			GM_setValue('SettingsWarnSelf' + universe, document.getElementById('settingsWarnSelf').checked === true ? 'true' : 'false');
			var _QuickList1LinkDisplay = (document.getElementById('settingsQL1_ON').checked) ? 'true' : 'false';
			GM_setValue('QuickList1LinkDisplay' + universe, _QuickList1LinkDisplay);
			var _QuickList1LinkName = document.getElementById('settingsQL1Name').value;
			GM_setValue('QuickList1LinkName' + universe, _QuickList1LinkName);
			var _QuickList1PilotNames = document.getElementById('settingsQL1Names').value;
			document.getElementById('customlink1').innerHTML = _QuickList1LinkName;
			document.getElementById('customlink1').style.display = _QuickList1LinkDisplay == 'true' && _QuickList1LinkName != ''  ? 'block' : 'none';
			GM_setValue('QuickList1PilotNames' + universe, _QuickList1PilotNames);
			var _QuickList2LinkDisplay = (document.getElementById('settingsQL2_ON').checked) ? 'true' : 'false';
			GM_setValue('QuickList2LinkDisplay' + universe, _QuickList2LinkDisplay);
			var _QuickList2LinkName = document.getElementById('settingsQL2Name').value;
			GM_setValue('QuickList2LinkName' + universe, _QuickList2LinkName);
			var _QuickList2PilotNames = document.getElementById('settingsQL2Names').value;
			document.getElementById('customlink2').innerHTML = _QuickList2LinkName;
			document.getElementById('customlink2').style.display = _QuickList2LinkDisplay == 'true' && _QuickList2LinkName != '' ? 'block' : 'none';
			GM_setValue('QuickList2PilotNames' + universe, _QuickList2PilotNames);
		}
		document.getElementById('settingsWrapper').parentNode.removeChild(document.getElementById('settingsWrapper'));
		window.resizeBy((0-WIDTH_OF_SETTINGS_PANEL),0);
		document.getElementById('mmsettingslink').style.visibility = 'visible';
	}

	function openSettingsPanel(e) {
		e.target.style.visibility = 'hidden';
		addSettingsPanelToPageSide();
	}

/*
	**************************************************************************************
		Support the configurable quicklinks
	**************************************************************************************
*/

	function clickCustomQuickLink(e) {
		var universe = getUniverse();
		var pilotList = '';
		if (e.target.id == 'customlink1') {
			pilotList = GM_getValue('QuickList1PilotNames' + universe,'');
		} else if (e.target.id == 'customlink2') {
			pilotList = GM_getValue('QuickList2PilotNames' + universe,'');
		}
		if (pilotList == '') {
			return;
		}
		// remove the current pilot from the list if included
		var currentPilotName = GM_getValue('currentPilotName' + universe,'').toLowerCase();
		var newPilotArray = [];
		var arr = pilotList.strim().split(",");
		for(var i = 0; i < arr.length; i++) {
			arr[i] = arr[i].strim();
			if (arr[i].toLowerCase() != currentPilotName) {
				newPilotArray.push(arr[i]);
			}
		}
		document.getElementById('recipient2').value = newPilotArray.join(', ');
	}

/*
	*****************************************************************************************************************************\
		Enable and disable form elements triggered by clicking on the send button
	*******************************************************************************************************************************
*/

	function _toggleOnScreenFormElements(state) {
		var sendButton = document.getElementById('sendbutton');
		sendButton.disabled = state;
		if (state == true) {
			sendButton.style.backgroundColor = '#999';
			sendButton.setAttribute('value', 'Sending...');
		} else {
			sendButton.style.backgroundColor = '#00001C';
			sendButton.setAttribute('value', 'Send');
		}
//		var recipientTextarea = document.getElementById('recipient2');
//		recipientTextarea.disabled = state;
//		var subjectInput = document.getElementById('subject');
//		subjectInput.disabled = state;
//		var bodyTextarea = document.getElementById('textarea');
//		bodyTextarea.disabled = state;
	}

	function disableOnScreenFormElements() {
		_toggleOnScreenFormElements(true);
	}

	function reenableOnScreenFormElements() {
		_toggleOnScreenFormElements(false);
	}

/*
	*****************************************************************************************************************************\
		Handle the clicking of the send button and sending of each message
	*******************************************************************************************************************************
*/

	function getRecipients() {
		// handle the recipients list delimiters being either COMMA, NEWLINE or SEMI-COLON
		var arr = newrecp.value.strim().replace(/\n|;/g, ",").split(",");
		var cleanedArr = [];
		for(var i = 0; i < arr.length; i++) {
			if (arr[i].strim() != "") {
				cleanedArr.push(arr[i].strim());
			}
		}
		return cleanedArr.unique();
	}

	function sendMessages(button) {
		button.setAttribute('disabled','disabled');
		var recipients = getRecipients();
		var recipientTextarea = document.getElementById('recipient2');
		if (recipientTextarea.value == "" || recipients.length === 0) {
			alert("Please enter at least one recipient!");
			recipientTextarea.focus();
			button.removeAttribute('disabled');
			return false;
		}
		var bodyTextarea = document.getElementById('textarea');
		if (bodyTextarea.value == "") {
			alert("Please enter a message!");
			bodyTextarea.focus();
			button.removeAttribute('disabled');
			return false;
		}
		disableOnScreenFormElements();
		b_ERROR_WHILST_SENDING_A_MESSAGE = false;
		var d = document.getElementById('errormsg');
		if (d) {
			d.parentNode.removeChild(d);
		}
		msgcount = recipients.length;
		for (let i=0; i<recipients.length; i++) {
			if (recipients[i] != '') {
               setTimeout(function() {
                    sendXMLHTTP(recipients[i]);
                }, i * THROTTLE_DELAY_MS);
			}
		}
	}

	function sendXMLHTTP(to) {
		var params = "";
		var msg = document.getElementById('textarea').value;
		if (!document.getElementById('bcc').checked && getRecipients().length > 1) {
            var _quoteIndex = msg.indexOf("\n---------------------------------------------------------------------"); // first occurence of a "quote" as per pardus messaging
            if (_quoteIndex > -1 ) { //only adds CCs between text if there is a quoted message. otherwise add at end.
                msg = msg.substring(0,_quoteIndex) + "\n\nCC: "+getRecipients().join(", ") + msg.substring(_quoteIndex);
            } else {
                msg += "\n\nCC: "+getRecipients().join(", ");
            }
		}
		params += "recipient="+encodeURIComponent(to);
		params += "&textfield="+encodeURIComponent(document.getElementById('subject').value);
		params += "&textarea="+encodeURIComponent(msg);
		if (document.getElementById('attach_signature').disabled == false) {
			if (document.getElementById('attach_signature').checked) {
				params += "&attach_signature="+document.getElementById('attach_signature').value;
			}
		}
		params += "&Send=Send";
		var b_WarnSelf = GM_getValue('SettingsWarnSelf' + getUniverse(), '') == 'true';
		GM_xmlhttpRequest({
			method: "POST",
			url: document.location,
			data: params,
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
				"Content-Length": params.length
			},
			onload: function(response) {
				var nop = response.responseText.indexOf("This player does not exist!");
				var nos = response.responseText.indexOf("Sorry, you cannot send yourself messages");
				if (nop > -1 || (nos > -1 && b_WarnSelf)) {
					b_ERROR_WHILST_SENDING_A_MESSAGE = true;
					reenableOnScreenFormElements();
					if (nop > -1) {
						var d = document.getElementById('errormsg');
						if (d == null) {
							d = document.createElement('div');
							d.setAttribute('id', 'errormsg');
							d.style.color = '#c00';
							d.style.fontWeight = 'bold';
							var s = document.createElement('span');
							d.appendChild(document.createTextNode('The following pilots do not exist: '));
							d.appendChild(s);
							s.appendChild(document.createTextNode(to));
							newrecp.parentNode.appendChild(d);
						} else {
							d.children[0].appendChild(document.createTextNode(', '+to));
						}
					} else if (nos > -1 && b_WarnSelf) {
						alert('You cannot send a message to yourself');
					}
					var recipientTextarea = document.getElementById('recipient2');
					recipientTextarea.focus();
					return;
				}
				if (--msgcount == 0 && !b_ERROR_WHILST_SENDING_A_MESSAGE) {
					var arr = getRecipients();
					if (arr.length > 1) {
						alert("The message was sent to the following pilots:\n\n"+arr.join("\n"));
					}
					self.close();
				}
			}
		});
	}

/*
	**************************************************************************************
		Here is where the magic begins...
	**************************************************************************************
*/

	var universe = getUniverse();

	var msgcount = 0;
	var recipientCell = document.getElementById('recipient2').parentNode;
	var oldrecp = document.getElementById('recipient2');

	// make the title look good
	var titleCell = document.getElementsByTagName('TABLE')[2].rows[0].cells[0];
		titleCell.style.padding = '5px 0';
		titleCell.style.fontSize = '11px';
		titleCell.setAttribute('colspan', 2);

	// remove some functionality we don't want and set the layout to be simple
	var checkbutton = document.getElementsByName('checkname')[0];
	if (typeof checkbutton != "undefined") {
		checkbutton.parentNode.removeChild(checkbutton);
	} else {
		// remove the view profile link
		var viewProfileLink = document.getElementById('recipient2').nextElementSibling;
		viewProfileLink.parentNode.removeChild(viewProfileLink);
		// grab the race and alliance details
		var raceAllianceData = '';
		var imgs = recipientCell.parentNode.lastChild.previousSibling.getElementsByTagName('IMG');
		if (imgs.length) raceAllianceData = ' (' + imgs[0].alt + ')';
		// update the title with the profile link. race and alliance data
		titleCell.innerHTML = 'Replying to a message from: <a href="' + viewProfileLink.href + '" style="color:#116;text-decoration:underline;" target="_blank">' + oldrecp.value + raceAllianceData + '</a>';
	}

	// make the table a little wider to prevent the text areas wrapping and making nasty gaps
	document.getElementsByTagName('TABLE')[2].width='490';

	// add in some brief instructions
	var p = document.createElement('p');
		p.style.fontSize = '11px';
		p.style.margin = '0 4px 2px 0';
		p.style.textAlign = 'left';
	p.innerHTML = "Comma separate pilot names and use the BCC checkbox at the bottom to hide the pilot list";
	var tables = document.getElementsByTagName('TABLE');
	var newRow = tables[2].insertRow(1);
	var newCell = newRow.insertCell(0);
	newCell.setAttribute('colspan','2');
	newCell.appendChild(p);

	// set the widths for the table correctly
	recipientCell.previousElementSibling.setAttribute('width','65');

	// top align the "To:" string
	recipientCell.previousElementSibling.getElementsByTagName('B')[0].setAttribute('style', 'margin:4px 0 0;display:block;');
	recipientCell.previousElementSibling.setAttribute('valign','top');

	// remove the image cell for the pilot
	recipientCell.parentNode.removeChild(recipientCell.parentNode.lastChild.previousSibling);

	// add in the custom lists
	var customLinkHTML = '<div style="font-size:9px;font-weight:bold;color:#3C3;margin-top:3px;width:65px;overflow:hidden;">';
		customLinkHTML += '<span id="customlink1" style="cursor:pointer;margin-top:2px;display:' + (GM_getValue('QuickList1LinkDisplay' + universe, '') == 'true' && GM_getValue('QuickList1LinkName' + universe, '') != '' ? 'block' : 'none') + '">' + GM_getValue('QuickList1LinkName' + universe, '') + '</span>';
		customLinkHTML += '<span id="customlink2" style="cursor:pointer;margin-top:2px;display:' + (GM_getValue('QuickList2LinkDisplay' + universe, '') == 'true' && GM_getValue('QuickList2LinkName' + universe, '') != '' ? 'block' : 'none') + '">' + GM_getValue('QuickList2LinkName' + universe, '') + '</span>';
		customLinkHTML += '</div>';
	recipientCell.previousElementSibling.innerHTML += customLinkHTML;
	document.getElementById('customlink1').addEventListener('click', clickCustomQuickLink, true);
	document.getElementById('customlink2').addEventListener('click', clickCustomQuickLink, true);

	// replace the input for a textarea for the recipients
	var newrecp = document.createElement('textarea');
		newrecp.setAttribute('name', 'recipient');
		newrecp.setAttribute('id', 'recipient2');
		newrecp.setAttribute('tabindex', 1);
		newrecp.style.backgroundColor = '#00001c';
		newrecp.style.font = '12px Arial,Verdana';
		newrecp.style.color = '#D0D1D9';
		newrecp.style.border = '1px solid #aab';
		newrecp.style.borderRadius = '3px';
		newrecp.style.padding = '2px';
		newrecp.style.marginBottom = '2px';
		newrecp.style.width = '390px';
		newrecp.style.height = '40px';
	recipientCell.replaceChild(newrecp, oldrecp);

	// include the recipient in the To field if this is a reply message
	var recipient = '';
	var searchParams = location.search.substr(1).split('&');
	for (var loop=0; loop<searchParams.length; loop++) {
		if (searchParams[loop].indexOf('to=')>-1) {
			recipient = searchParams[loop].substr(3);
		}
	}
	if (recipient=='undefined') recipient = '';
	newrecp.value = unescape(recipient);

	// style up the subject field
	var subject = document.getElementsByName('textfield')[0];
		subject.setAttribute('id', 'subject');
		subject.style.width = '390px';
		subject.style.border = '1px solid #aab';
		subject.style.borderRadius = '2px';
		subject.style.padding = '2px';
		subject.style.marginBottom = '2px';

	// top align the "Subject:" string
	subject.parentNode.previousElementSibling.getElementsByTagName('B')[0].setAttribute('style', 'margin:4px 0 0;display:block;');
	subject.parentNode.previousElementSibling.setAttribute('valign','top');

	// style up the message body field
	var body = document.getElementsByName('textarea')[0];
		body.style.border = '1px solid #aab';
		body.style.borderRadius = '2px';
		body.style.padding = '2px';
		body.style.width = '390px';
		body.style.height = '175px';
		body.removeAttribute('cols');

	body.parentNode.removeAttribute('colspan');

	// top align the "Message:" string
	body.parentNode.previousElementSibling.getElementsByTagName('B')[0].setAttribute('style', 'margin:4px 0 0;display:block;');
	body.parentNode.previousElementSibling.setAttribute('valign','top');

	// remove the old resize link
	var el = document.getElementById('resizeLink');
	el.parentNode.removeChild(el);

	// add a replacement resize link to accomodate resizing offscreen for small screens
	function resizeBodyTextareaLink(e) {
		var resizeValue = HEIGHT_TO_RESIZE_TOGGLE;
		var displayText = '';
		if (e.target.textContent.indexOf('+') > -1) {
			displayText = 'SIZE -';
		} else {
			resizeValue = 0 - resizeValue;
			displayText = 'SIZE +';
		}
		document.getElementById('resizeLinkNew').innerHTML = displayText;
		window.resizeBy(0,resizeValue);
		document.getElementById('textarea').style.height = parseInt(document.getElementById('textarea').style.height, 10) + resizeValue + 'px';
	}
	var resLinkNew = document.createElement('B');
		resLinkNew.setAttribute('style','display:block;margin-top:150px;');
		resLinkNew.innerHTML = '<font size="1"><a href="javascript://" id="resizeLinkNew">SIZE +</a></font>';
	body.parentNode.previousElementSibling.appendChild(resLinkNew);
	document.getElementById('resizeLinkNew').addEventListener('click', resizeBodyTextareaLink, false);

	// add some space between the send button and the message
	document.getElementById('textarea').style.marginBottom = '8px';

	// add in the BCC checkbox
	var bcc = document.createElement('input');
		bcc.setAttribute('type', 'checkbox');
		bcc.setAttribute('id', 'bcc');
		bcc.checked = GM_getValue('DefaultBCCState' + universe, '');
	var atsig = document.getElementById('attach_signature');
	atsig.parentNode.insertBefore(bcc, atsig);
	atsig.parentNode.insertBefore(document.createTextNode('BCC '), atsig);

	// style up a new send button
	var button = document.createElement('input');
		button.setAttribute('id', 'sendbutton');
		button.setAttribute('type', 'button');
		button.setAttribute('value', 'Send');
		button.style.width = '100px';
		button.style.border = '1px solid #aab';
		button.style.borderRadius = '3px';
		button.style.padding = '2px';
		button.style.marginLeft = '10px';
		button.style.cursor = 'pointer';
		button.style.fontWeight = 'bold';
		button.setAttribute('tabindex', 4);
	atsig.parentNode.appendChild(button);
	atsig.parentNode.style.paddingRight = '4px';

	// attach our send button click functionality
	button.addEventListener('click', function () { sendMessages(this); }, false);

	// remove the old send button
	var inp = document.getElementById('Send');
	inp.parentNode.parentNode.removeChild(inp.parentNode);

	// add a warning on spamming and a link to the rule
	var p = document.createElement('p');
		p.style.fontSize = '11px';
		p.style.margin = '5px 0 0';
		p.innerHTML = "Ensure you understand the <a href=\"http://www.pardus.at/index.php?section=rules\" target=\"_blank\">Rule against Spamming</a>.<span style=\"float:right;margin-right:5px;cursor:pointer;\" id=\"mmsettingslink\">Show multi-message settings</span>";
	var newRow = tables[2].insertRow();
	var newCell = newRow.insertCell(0);
		newCell.setAttribute('colspan','2');
		newCell.appendChild(p);

	// float the form to accomodate the settings panel
	document.getElementById('sendform').style.cssFloat = 'left';
	document.getElementById('sendform').style.margin = '0 3px';

	// attach the method to run when the user clicks on the Show settings link
	document.getElementById('mmsettingslink').addEventListener('click', openSettingsPanel, false);

}