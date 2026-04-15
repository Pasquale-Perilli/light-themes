// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net
// @version      2026-04-15
// @description  try to take over the world!
// @author       You
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// ==/UserScript==

(function() {
    'use strict';

    if(window.location.hostname.startsWith('opensearch.') == false){ //Only apply the script to subdomains starting with opensearch
       // console.log("Hostname is " + window.location.hostname);
        return;
    }

     const LIGHT_THEME_URL = 'https://cdn.jsdelivr.net/gh/Pasquale-Perilli/light-themes@master/opensearch/eui_theme_light.css';

    // Function to inject CSS
    function injectCSS(css) {
        GM_addStyle(css);
    }

    // Function to fetch and inject the light theme
    function loadLightTheme() {
        console.log("Loading light theme css");
        GM_xmlhttpRequest({
            method: "GET",
            url: LIGHT_THEME_URL,
            onload: function(response) {
                console.log("Now checking download response...");
                if (response.status === 200) {
                    injectCSS(response.responseText);
                    console.log('Light theme CSS injected');
                    // Now remove the dark theme style tag
                    removeDarkThemeStyle();
                }
            },
            onerror: function(error) {
                console.error('Failed to load light theme CSS:', error);
            }
        });
        console.log('Finished loading light theme css');
    }

    // Function to remove the dark theme style tag
    function removeDarkThemeStyle() {
        const observer = new MutationObserver((mutations, obs) => {
            const darkStyle = [...document.querySelectorAll('style')].find(style =>
                style.textContent.includes('dark')
            );
            if (darkStyle) {
                darkStyle.textContent = ''; // Clear its content
                obs.disconnect();
                console.log('Dark theme style tag cleared');
            }
        });
        observer.observe(document.head || document.documentElement, { childList: true, subtree: true });
    }



    // Function to replace --dark classes with --light
    function replaceDarkClasses() {
        console.log('Starting process of light mode enablment with TM');
        document.querySelectorAll('*').forEach(element => {
            const classes = [...element.classList];
            classes.forEach(className => {
                if (className.includes('--dark')) {
                    const newClass = className.replace('--dark', '--light');
                    console.log("New class name is " + newClass);
                    element.classList.replace(className, newClass);
                }
            });
        });
        console.log("Finished applying light mode with TM");
    }

    function removeStyleTagWithDarkTheme(){
      console.log("Removing dark style tag");
        const styleTag = [...document.querySelectorAll('style')].find( style => {
            style.textContent.includes('dark')
        } );
        if (styleTag){
          styleTag.remove();
          console.log("Removing stylesheet");
        }
      console.log("Finished");
    }

    function applyInlineRules(){
      console.log('Starting to apply inline rules');
        const allElements = document.querySelectorAll('*:not(figure)');
      Array.from(allElements).forEach( child => {
        //child.style.backgroundColor = '#ece5e3';
        child.style.color = '#000000';
      } );
        const allLabels = document.querySelectorAll('.euiDescriptionList__title');
        Array.from(allLabels).forEach( label => {
          label.style.backgroundColor = "#f9c38f";
        } );
        console.log('Finished inline rules');

    }

    // Use a MutationObserver to detect when the UI is ready
    const observer = new MutationObserver((mutations, obs) => {
        // Look for a stable element that appears when the UI is loaded
        const header = document.querySelector('.euiHeader') || document.querySelector('[data-test-subj="headerGlobalNav"]');
        if (header) {
            // Stop observing
            obs.disconnect();
            // Run the class replacement
            setTimeout( () => {
                replaceDarkClasses();
                removeStyleTagWithDarkTheme();
                loadLightTheme();
                applyInlineRules();
            }, 5000);
        }
    });

    // Start observing the body for added nodes
    observer.observe(document.body, { childList: true, subtree: true });


})();
