// ==UserScript==
// @name            Pardus Snow
// @namespace       Tro
// @author          Tro
// @version         3.0
// @description     Adds snow to pardus
// @include         http*://*.pardus.at/*
// @exclude         https://*.pardus.at/msgframe.php*
// @exclude         https://*.pardus.at/menu.php
// @grant           GM_setValue
// @grant           GM_getValue
// @updateURL       https://github.com/Tsunder/pardus-script-fun-pack/raw/master/userscripts/pardus_snow.user.js
// @downloadURL     https://github.com/Tsunder/pardus-script-fun-pack/raw/master/userscripts/pardus_snow.user.js
// ==/UserScript==

/*
    Originally adapted from http://rainbow.arch.scriptmania.com/scripts/ by Webxro (version 1).
    Version 2 onwards by Tro (Artemis), Troll (Orion) 
*/

function getRandom(max) {
    return Math.floor(max * Math.random());
}

function getRandomSize(min = GM_getValue('snowsize_min', 10), max = GM_getValue('snowsize_max', 25)) {
    let range = max - min;
    let rand = getRandom(range);
    return rand + min;
}

function getRandomColour(colours = [
    '#AAAACC',
    '#DDDDFF',
    '#CCCCDD',
    '#F3F3F3',
    '#F0FFFF'
]) {
    let rand = getRandom(colours.length);
    return colours[rand];
}

class Snowflake {

    constructor(id, {
        fontFamily = 'Arial Black',
        size = getRandomSize(),
        colour = getRandomColour(),
        pos_x = getRandom(screen.availWidth),
        pos_y = getRandom(screen.availHeight),
        sway_magnitude = Math.random() * 10,
        sway_velocity = 0,
        sway_acceleration = 0.03 + (Math.random() / 10)
    } = {}) {
        this.elem = document.createElement("span");
        this.elem.id = id;
        this.elem.innerHTML = GM_getValue('snowletter', '*');
        this.elem.style = {};
        this.size = size;
        this.pos_x = pos_x;
        this.pos_y = pos_y;
        this.sway_magnitude = sway_magnitude;
        this.sway_velocity = sway_velocity;
        this.sway_acceleration = sway_acceleration;
        this.fall_speed = GM_getValue('fall_speed', 0.3) * (this.size / 5);
        this.fontFamily = fontFamily;
        this.colour = colour;
        this.updateStyle();
    }

    updateStyle() {
        this.elem.style.position = 'fixed';
        this.elem.style.fontFamily = this.fontFamily;
        this.elem.style.fontSize = this.size + 'px';
        this.elem.style.color = this.colour;
        this.elem.style.left = this.pos_x + 'px';
        this.elem.style.top = this.pos_y + 'px';
        this.elem.style.userSelect = 'none';
    }

    getElement() {
        return this.elem;
    }

    getConfiguration() {
        return {
            fontFamily: this.fontFamily,
            size: this.size,
            colour: this.colour,
            pos_x: this.pos_x,
            pos_y: this.pos_y,
            sway_magnitude: this.sway_magnitude,
            sway_velocity: this.sway_velocity,
            sway_acceleration: this.sway_acceleration
        }
    }

    move() {
        let previous_sway_velocity = this.sway_velocity;
        this.sway_velocity += this.sway_acceleration;
        this.pos_y += this.fall_speed;
        this.pos_x += this.sway_magnitude * (Math.sin(this.sway_velocity) - Math.sin(previous_sway_velocity));

        /*
         *  Do we still fit on the screen?
         */
        if (this.pos_y >= screen.availHeight - 2 * this.size ||
            this.pos_x >= screen.availWidth - 3 * this.sway_magnitude) {
            this.pos_y = 0;
            this.pos_x = getRandom(screen.availWidth - 3 * this.sway_magnitude);
        }

        this.updateStyle();
    }
}


function init() {

    let savedData = GM_getValue('snowflakes', []);
    let snowflakes = [];

    for (let i = 0; i < GM_getValue('number_of_snowflakes', 30); i++) {
        if (i < savedData.length) {
            snowflakes.push(new Snowflake(`snowflake-${i}`, savedData[i]));
        } else {
            snowflakes.push(new Snowflake(`snowflake-${i}`));
        }
    }

    for (let snowflake of snowflakes) {
        const body = document.getElementsByTagName('body');
        if (body && body[0]) {
            body[0].appendChild(snowflake.getElement());
        }
    }

    return snowflakes;
}


function animate(snowflakes) {
    let dataToSave = []
    for (let snowflake of snowflakes) {
        snowflake.move();
        dataToSave.push(snowflake.getConfiguration());
    }

    GM_setValue('snowflakes', dataToSave);

    setTimeout(animate, 50, snowflakes);
}

let snowflakes = init();
animate(snowflakes);
