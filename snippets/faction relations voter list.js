//
// prints out list of players that are voting neutral against at least one of the factions
// names are seperated by commas
// go to diplomacy> faction relations page and press F12, then paste this entire text into the console to use
//
let test = Array.from(document.querySelectorAll('span[style*="color:#8C8C8C"]'))
test.shift();
test.shift();
let list = [];
test.forEach(e=>{if(list.indexOf(e.innerText) == -1)list.push(e.innerText)});
list.toString();
