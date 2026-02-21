// ==UserScript==
// @name         Peacemaker No Premium Attack Buttons
// @namespace    Tsunders
// @version      2026-02-21
// @description  Hides the premium attack buttons against NPCs. This should help avoi
// @author       You
// @match        *.pardus.at/ship2opponent_combat.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pardus.at
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
let button1 = document.getElementsByName("button1")
if (button1.length>0){
    button1[0].setAttribute("class","disabled")
    var button2 = document.getElementsByName("button2")[0]
    var button3 = document.getElementsByName("button3")[0]
    var button4 = document.getElementsByName("button4")[0]
    var button5 = document.getElementsByName("button5")[0]
    button2.setAttribute("class","disabled")
    button3.setAttribute("class","disabled")
    button4.setAttribute("class","disabled")
    button5.setAttribute("class","disabled")
}
    let ok = document.getElementsByName("ok")[0]
    ok.setAttribute("class","disabled")
    ok.parentElement.append(document.createElement("br"))


    var enableAttackBox = document.createElement("input")
    enableAttackBox.id = "enableAttack"
    enableAttackBox.type = "checkbox"
    ok.parentElement.append(enableAttackBox)
    var text = document.createElement("text")
    text.innerText = "  Enable Attack buttons."
    ok.parentElement.append(text)
    text.addEventListener("click",function() {
        enableAttackBox.click()
                          })
    document.getElementById("enableAttack").addEventListener('change',function(){
        var state = this.checked ? "enabled" : "disabled";
        if (button1.length>0){
            button1[0].setAttribute("class",state)
            var button2 = document.getElementsByName("button2")[0]
            var button3 = document.getElementsByName("button3")[0]
            var button4 = document.getElementsByName("button4")[0]
            var button5 = document.getElementsByName("button5")[0]
            button2.setAttribute("class",state)
            button3.setAttribute("class",state)
            button4.setAttribute("class",state)
            button5.setAttribute("class",state)
            }
        document.getElementsByName("ok")[0].setAttribute("class",state)
        }
)
})();
