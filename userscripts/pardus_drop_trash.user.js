// ==UserScript==
// @name         DropScript
// @namespace    Tsunders
// @version      0.2
// @description  Adds a button to select all "trash" in drop screen of Pardus. Edit script to define which commodities are trash
// @author       Tsunders
// @match        *://*.pardus.at/drop_cargo.php*
// @match        *://*.pardus.at/ship2ship_transfer.php*
// @grant        none
// @updateURL    https://gist.github.com/Tsunder/d02711725b9bd84a6624129d3f24e87e/raw/pardus_drop_trash.user.js
// @icon         http://static.pardus.at/img/stdhq/res/hydrogen-fuel.png
// ==/UserScript==

// Much thanks to Tro who made pardus troder, which was originally the vast majority of the code. https://github.com/Tro95/Pardus-Troder/
// Much thanks to Kuilin who made everything better, refactored the main bulk of the code.


// version history
// 0.1 made and published
// 0.2 refactored by kuilin. Extended. added some commodities to not-trash by default to prevent some accidents
(function () {
    'use strict';

    //disable or enable commodities here for "trash" by adding or removing // at the beinning. // means it's NOT trash.
	var trash = [
		'Food',
		'Energy',
		'Water',
		'Animal embryos',
		'Ore',
		'Metal',
		'Electronics',
		//'Robots',
		'Heavy plastics',
		'Hand weapons',
		'Medicines',
		'Nebula gas',
		'Chemical supplies',
		'Gem stones',
		'Liquor',
		//'Hydrogen fuel',
		'Exotic matter',
		'Optical components',
		'Radioactive cells',
		'Droid modules',
		'Bio-waste',
		//'Leech baby',
		'Nutrient clods',
		'Cybernetic X-993 Parts',
		//'X-993 Repair-Drone',
		//'Neural Stimulator',
		'Battleweapon Parts',
		'Slaves',
		//'Drugs',
		//'Package',
		//'Faction package',
		//'Explosives',
		//'VIP',
		//'Christmas Glitter',
		//'Military Explosives',
		'Human intestines',
		'Skaari limbs',
		'Keldon brains',
		'Rashkir bones',
		//'Exotic Crystal',
		//'Blue Sapphire jewels',
		//'Ruby jewels',
		//'Golden Beryl jewels',
		//'Stim Chip',
		'Neural Tissue',
		//'Capri Stim',
		//'Crimson Stim',
		//'Amber Stim'
	];

	function selectTrash() {
        let cargo = Array.from(document.querySelectorAll('form[action="' + document.location.pathname.substring(1) +'"] tr'))
        if (document.location.pathname == "/ship2ship_transfer.php") {
            cargo.shift();
            cargo.shift();
            cargo.pop();
            cargo.pop();
            cargo.pop();
        }
        cargo.filter(e=>trash.includes(e.children[1].innerText)).forEach(e=>e.children[2].children[0].click());
	}

	function addTrashButton() {
	    let dropButton = document.getElementsByName("drop")[0] || document.querySelector("input[value=Transfer]");
        let selectTrashButton = document.createElement("input");
	    selectTrashButton.id = "dropButton";
        selectTrashButton.type = "button";
	    selectTrashButton.value = "Select Trash";
	    selectTrashButton.addEventListener('click', selectTrash, false);
	    selectTrashButton.style = dropButton.getAttribute("style");
	    dropButton.after(selectTrashButton);
        dropButton.after(document.createElement("br"));
        dropButton.after(document.createElement("br"));
	}
	addTrashButton();
})();
