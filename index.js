"use strict";

const
    config = require('./config'),
    {promisify} = require('util'),
    execCb = require('child_process').exec,
    exec = promisify(execCb);

function sendInput(args, t) {
    var cmd = config.adbPath + ' shell input ' + args;
    console.log('Executing ' + cmd);
    return exec(cmd).then((res) => {
        console.log(`stdout: ${res.stdout}`);
        console.error(`stderr: ${res.stderr}`);
        return delay(t);
    })
}

function mi8toAnyScreen(x, y) {
    var s = [x / 1080, y / 2248];
    console.log(s[0] + ', ' + s[1] + ' /*' + ptoPx(s[0], s[1]) + '*/');
}

function ptoPx(x, y) {
    return '' + Math.floor(x * config.screenSize[0]) + ' ' + Math.floor(y * config.screenSize[1]);
}


function tap(x, y, sleep = config.sleep) {
    console.log('tapping ' + x + ' ' + y);
    return sendInput('tap ' + ptoPx(x, y), sleep);
}

function longTap(x, y, sleep = config.sleep) {
    console.log('longTapping ' + x + ' ' + y);
    return sendInput('swipe ' + ptoPx(x, y) + ' ' + ptoPx(x, y) + ' ' + sleep, sleep);
}

function swipeRight(sleep = config.sleep) {
    console.log('swiping right');
    return sendInput('swipe ' + ptoPx(0.8333333333333334, 0.5338078291814946) + ' ' + ptoPx(0.18518518518518517, 0.556049822064057) + ' 100', sleep);
}

function delay(t, val) {
    return new Promise(function (resolve) {
        console.log('Sleeping for ' + t + 'ms');
        setTimeout(function () {
            console.log('Sleept for ' + t + 'ms');
            resolve(val);
        }, t);
    });
}

function renamePok() {
    return tap(0.9259259259259259, 0.9564056939501779 /*1000 2150 menu*/
    ).then(() =>
        tap(0.9259259259259259, 0.7562277580071174 /*1000 1700 appraise*/)
    ).then(() =>
        tap(0.46296296296296297, 0.44483985765124556 /*500 1000 screen middle, skip first appraise screen*/)
    ).then(() =>
        tap(0.8611111111111112, 0.2 /*930 400 camera button, the CalcyIV*/)
    ).then(() =>
        tap(0.46296296296296297, 0.6672597864768683 /*500 1500 close CalcyIV screen*/)
    ).then(() =>
        tap(0.46296296296296297, 0.6672597864768683 /*500 1500 close appraise*/)
    ).then(() =>
        tap(0.46296296296296297, 0.44483985765124556 /*500 1000 name area, open rename*/)
    ).then(() =>
        tap(0.9259259259259259, 0.9119217081850534 /*1000 2050 backspace on the keyboard*/)
    ).then(() =>
        longTap(0.46296296296296297, 0.6672597864768683 /*500 1500 context menu in input area*/)
    ).then(() =>
        tap(0.09259259259259259, 0.7117437722419929 /*100 1600 paste*/)
    ).then(() =>
        tap(0.8796296296296297, 0.645017793594306 /*950 1450 OK on input*/)
    ).then(() =>
        tap(0.46296296296296297, 0.5338078291814946 /*500 1199 OK on the rename dialog*/, 2 * config.sleep)
    ).then(() =>
        swipeRight() //goto next poke
    ).then(() =>
        renamePok()); //repeat
}

renamePok();
