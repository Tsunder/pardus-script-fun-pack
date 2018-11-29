// ==UserScript==
// @name           Pardus chat links
// @namespace      pardus.at
// @author         Lucky, (C) 2009-2013, tsunders 2018
// @version        0.2.1
// @description    Pardus chat links
// @downloadurl    https://github.com/Tsunder/pardus-script-fun-pack/raw/master/userscripts/pardus_chat_links.user.js
// @updateurl      https://github.com/Tsunder/pardus-script-fun-pack/raw/master/userscripts/pardus_chat_links.user.js
// @include        http*://chat.pardus.at/chattext.php*
// @icon           http://www.pardus.at/favicon.ico
// ==/UserScript==


window.setTimeout(chatLinks, 51);

var linesRead = 0;

function chatLinks() {
	var thisline, chatlines;

	chatlines = document.evaluate(
		'//span[@style]',
		document,
		null,
		XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
		null);


    if (chatlines.snapshotLength - 1 != linesRead)
    {
        for (var i = linesRead; i < chatlines.snapshotLength; i++)
        {
            thisline = chatlines.snapshotItem(i);
            if(thisline.innerHTML.search('acs_log') == -1)
            {
                var replacementString = thisline.innerHTML.replace(/\s(http|https|ftp|www)(:\/\/|\.)([^<\s]+)/gi,
                                                                   '<a href="$1$2$3" target="_blank">$1$2$3<\/a>');
                if (thisline.innerHTML.localeCompare(replacementString) != 0)
                {
                    thisline.innerHTML = replacementString;
                    thisline.innerHTML = thisline.innerHTML.replace(/href=\"www./gi, 'href="http://www.');
                }
            }
        }
        linesRead = chatlines.snapshotLength - 1;
    }
    window.setTimeout(chatLinks, 1000);
}
