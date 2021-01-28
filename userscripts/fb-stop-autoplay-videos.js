// ==UserScript==
// @name         Stop Facebook UP NEXT video
// @description  Stops FB auto-playing the next video when watching them in full-screen.
// @version      0.1
// @author       zbluebugz
// @namesapce    hhttps://github.com/zbluebugz/filters-fb/tree/main/userscripts
// @updateURL    https://raw.githubusercontent.com/zbluebugz/filters-fb/main/userscripts/fb-stop-autoplay-videos.js
// @match        https://www.facebook.com/*
// @grant        none
// @license      MIT
// ==/UserScript==

// for use in Tampermonkey

'use strict';

var waitingForPopup = false;
var currLocation = '';

function waitForUpNextVideoToDisplay() {
    // get the "first" element that matches the query .. (this usually has the text "UP NEXT"
    let upButton = document.querySelector('div[role="dialog"] div[role="main"] div[data-pagelet="TahoeVideo"] div[role="button"] div span') ;
    if ( upButton !== null ) {
        if (upButton.textContent.match("UP NEXT") ) {
            // find the cancel button ... there's three buttons
            // - so get them all and then find the one that has the text "Cancel" ..
            let unButtons = document.querySelectorAll('div[role="dialog"] div[role="main"] div[data-pagelet="TahoeVideo"] div[role="button"] div span') ;
            unButtons.forEach( btn => {
                if ( btn.textContent === "Cancel" ) {
                    btn.click();
                    // console.info("--- cancelled autoplay next video ...");
                    return ;
                }
            })
        }
    }
    else {
        setTimeout(function() {
            // console.log('waiting ...');
            waitingForPopup = true;
            if (location.href.indexOf("/videos/") != -1) {
                waitForUpNextVideoToDisplay();
            } else {
                waitingForPopup = false;
            }
        }, 500);
    }
}

function onVideoPage() {
    if (location.href.indexOf("/videos/") != -1 && !waitingForPopup && location.href != currLocation ) {
        console.log('watching a video in full screen ... ', location.href);
        currLocation = location.href;
        waitForUpNextVideoToDisplay();
    }
}

(function() {
    let videoPageIntervalID = window.setInterval(onVideoPage, 1000);
})();
