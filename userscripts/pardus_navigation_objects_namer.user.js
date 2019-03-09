// ==UserScript==
// @name         Pardus Navigation Objects Namer
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Names NPCs and ships on nav screen.
// @author       Tsunder
// @match        *://*.pardus.at/main.php*
// @grant        none
// @downloadURL  https://github.com/Tsunder/pardus-script-fun-pack/raw/master/userscripts/pardus_navigation_objects_namer.user.js
// @updateURL    https://github.com/Tsunder/pardus-script-fun-pack/raw/master/userscripts/pardus_navigation_objects_namer.user.js
// ==/UserScript==

var npcString = "NPC Opponent";
var pilotString = "Another Pilot";
var otherShipsString = "View Profile";

var npcData = {
	"ancient_crystal": "Ancient Crystal",
	"asp_hatchlings": "Asp Hatchlings",
	"asp_mother": "Asp Mother",
	"bio_scavenger": "Bio Scavenger",
	"blood_amoeba": "Blood Amoeba",
	"blue_crystal": "Blue Crystal",
	"ceylacennia": "Ceylacennia",
	"cyborg_manta": "Cyborg Manta",
	"dreadscorp": "Dreadscorp",
	"drosera": "Drosera",
	"energybees": "Swarm of Energy Bees",
	"energy_locust": "Energy Locust",
	"energy_minnow": "Energy Minnow",
	"energy_sparker": "Energy Sparker",
	"eulerian": "Eulerian",
	"euryale": "Euryale",
	"euryale_swarmlings": "Euryale Swarmlings",
	"exocrab": "Exocrab",
	"feral_serpent": "Feral Serpent",
	"frost_crystal": "Frost Crystal",
	"glowprawn": "Glowprawn",
	"gorefang": "Gorefang",
	"gorefangling": "Gorefangling",
	"gorefanglings": "Swarm of Gorefanglings",
	"hidden_drug_stash": "Hidden Drug Stash",
	"ice_beast": "Ice Beast",
	"infected_creature": "Infected Creature",
	"locust_hive": "Locust Hive",
	"lucidi_mothership": "Lucidi Mothership",
	"lucidi_squad": "Lucidi Squad",
	"lucidi_warship": "Lucidi Warship",
	"manifestation_developed": "Developed Manifestation",
	"manifestation_ripe": "Ripe Manifestation",
	"manifestation_verdant": "Verdant Manifestation",
	"medusa": "Medusa",
	"medusa_swarmlings": "Medusa Swarmlings",
	"mutated_medusa": "Mutated Medusa",
	"nebula_locust": "Nebula Locust",
	"nebula_mole": "Nebula Mole",
	"nebula_serpent": "Nebula Serpent",
	"oblivion_vortex": "Oblivion Vortex",
	"pirate_experienced": "Experienced Pirate",
	"pirate_famous": "Famous Pirate",
	"pirate_inexperienced": "Inexperienced Pirate",
	"pirate_captain" : "Pirate Captain",
	"preywinder": "Preywinder",
	"rive_crystal": "Rive Crystal",
	"roidworm_horde": "Roidworm Horde",
	"sarracenia": "Sarracenia",
	"scorpion_fighter": "Scorpion Fighter",
	"shadow": "Shadow",
	"slave_trader": "Slave Trader",
	"smuggler_escorted": "Escorted Smuggler",
	"smuggler_lone": "Lone Smuggler",
	"solar_banshee": "Solar Banshee",
	"space_clam": "Space Clam",
	"space_crystal": "Space Crystal",
	"space_dragon_elder": "Elder Space Dragon",
	"space_dragon_queen": "Space Dragon Queen",
	"space_dragon_young": "Young Space Dragon",
	"space_locust": "Space Locust",
	"space_maggot": "Space Maggot",
	"space_maggot_mutated": "Mutated Space Maggot",
	"space_snail": "Space Snail",
	"space_worm": "Space Worm",
	"space_worm_albino": "Space Worm Albino",
	"space_worm_mutated": "Mutated Space Worm",
	"starclaw": "Starclaw",
	"stheno": "Stheno",
	"stheno_swarmlings": "Stheno Swarmlings",
	"vyrex_larva": "Vyrex Larva",
	"vyrex_assassin": "Vyrex Assassin",
	"vyrex_mutant_mauler": "Mutant Vyrex Mauler",
	"vyrex_stinger": "Vyrex Stinger",
	"vyrex_hatcher": "Vyrex Hatcher",
	"wormhole": "Wormhole Monster",
	"xhole": "X-hole monster",
	"x993_battlecruiser": "X-993 Battlecruiser",
	"x993_mothership": "X-993 Mothership",
	"x993_squad": "X-993 Squad",
	"xalgucennia": "Xalgucennia",
	"z15_fighter": "Z15 Fighter",
	"z15_repair_drone": "Z15 Repair Drone",
	"z15_scout": "Z15 Scout",
	"z15_spacepad": "Z15 Spacepad",
	"z16_fighter": "Z16 Fighter",
	"z16_repair_drone": "Z16 Repair Drone"
};

var shipData = {
    "sabre" : "Sabre",
    "rustclaw" : "Rustclaw",
    "interceptor" : "Interceptor",
    "lanner_mini" : "Lanner Mini",
    "harrier" : "Harrier",
    "mercury" : "Mercury",
    "hercules" : "Hercules",
    "lanner" : "Lanner",
    "hawk" : "Hawk",
    "gargantua" : "Gargantua",
    "behemoth" : "Behemoth",
    "liberator" : "Liberator",
    "leviathan" : "Leviathan",
    "bopx" : "Bop-X",
    "wasp" : "Wasp",
    "adder" : "Adder",
    "thunderbird" : "Thunderbird",
    "viper_defence_craft" : "Viper Defence Craft",
    "babel_transporter" : "Babel Transporter",
    "piranha" : "Piranha",
    "nighthawk" : "Nighthawk",
    "nighthawk_deluxe" : "Nighthawk Deluxe",
    "mantis" : "Mantis",
    "extender" : "Extender",
    "gauntlet" : "Gauntlet",
    "doomstar" : "Doomstar",
    "war_nova" : "War Nova",
    "ficon" : "Ficon",
    "tyrant" : "Tyrant",
    "spectre" : "Spectre",
    "shadow_stealth_craft" : "Shadow Stealth Craft",
    "venom" : "Venom",
    "constrictor" : "Constrictor",
    "phantom_advanced_stealth_craft" : "Phantom Advanced Stealth Craft",
    "dominator" : "Dominator",
    "boa_ultimate_carrier" : "Boa Ultimate Carrier",
    "mooncrusher" : "Mooncrusher",
    "rustfire" : "Rustfire",
    "marauder" : "Marauder",
    "junkeriv" : "Junker IV",
    "slider" : "Slider",
    "elpadre" : "El Padre",
    "chitin" : "Chitin",
    "horpor" : "Horpor",
    "scorpion" : "Scorpion",
    "rover" : "Rover",
    "reaper" : "Reaper",
    "blood_lanner" : "Blood Lanner",
    "sudden_death" : "Sudden Death",
    "harvester" : "Harvester",
    "trident" : "Trident",
    "celeus" : "Celeus",
    "pantagruel" : "Pantagruel",
    "vulcan" : "Vulcan",
    "nano" : "Nano",
    "liberator_eps" : "Liberator EPS"
}

var PardusNavigationObjectsNamer = {
    Init : function() { this.doStuff() },
    Update : function () { this.doStuff() },
    doStuff : function () {
        Array.from(document.querySelectorAll('td.navNpc img')).forEach(e => {
            var _name = e.src.substring(e.src.lastIndexOf('/') + 1,e.src.lastIndexOf('.'))
            e.title = e.title.replace(npcString, npcData[_name]) || e.title.replace(npcString, _name.replace(/_/g,' '))
        });
        Array.from(document.querySelectorAll('td.navShip img')).forEach(e => {
            var _name = e.src.substring(e.src.lastIndexOf('/') + 1,e.src.lastIndexOf('.'))
            e.title = e.title.replace(pilotString, shipData[_name]) || e.title.replace(pilotString, _name.replace(/_/g,' '))
        })
        Array.from(document.querySelectorAll('#otherships_content td')).forEach(e => {
            var _style = e.getAttribute("style")
            var _name = _style.substring(_style.lastIndexOf('/') + 1,_style.lastIndexOf('.'))
            e.title = e.title.replace(otherShipsString, shipData[_name]) || e.title.replace(otherShipsString, _name.replace(/_/g,' '))
        })
    }
}


PardusNavigationObjectsNamer.Init();
window.addUserFunction(function(Pnom) {
    return function() {
        Pnom.Update();
    }
}(PardusNavigationObjectsNamer))
