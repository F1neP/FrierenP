(function () {
    'use strict';

    var root = document.documentElement;
    var themeToggle = document.getElementById('myonoffswitch');

    if (themeToggle) {
        var savedTheme;
        var preferredDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        var theme;

        try {
            savedTheme = localStorage.getItem('themeState');
        } catch (error) {
            savedTheme = null;
        }

        theme = savedTheme || (preferredDark ? 'Dark' : 'Light');

        var applyTheme = function (nextTheme) {
            theme = nextTheme;
            root.dataset.theme = theme;
            themeToggle.checked = theme === 'Light';
            themeToggle.setAttribute('aria-label', theme === 'Dark' ? 'Switch to light theme' : 'Switch to dark theme');

            try {
                localStorage.setItem('themeState', theme);
            } catch (error) {
                // The selected theme still applies when storage is unavailable.
            }
        };

        applyTheme(theme);

        themeToggle.addEventListener('change', function () {
            applyTheme(theme === 'Dark' ? 'Light' : 'Dark');
        });
    }

    var homeThemeButtons = Array.prototype.slice.call(document.querySelectorAll('[data-home-theme-option]'));

    if (homeThemeButtons.length) {
        var themeColorMeta = document.querySelector('meta[name="theme-color"]');

        var applyHomeTheme = function (nextTheme, persist) {
            var selectedTheme = nextTheme === 'white' ? 'white' : 'black';
            root.dataset.homeTheme = selectedTheme;

            homeThemeButtons.forEach(function (button) {
                button.setAttribute('aria-pressed', String(button.dataset.homeThemeOption === selectedTheme));
            });

            if (themeColorMeta) {
                themeColorMeta.setAttribute('content', selectedTheme === 'white' ? '#edf0ee' : '#080808');
            }

            if (persist) {
                try {
                    localStorage.setItem('homeTheme', selectedTheme);
                } catch (error) {
                    // The selected homepage theme still applies when storage is unavailable.
                }
            }
        };

        homeThemeButtons.forEach(function (button) {
            button.addEventListener('click', function () {
                applyHomeTheme(button.dataset.homeThemeOption, true);
            });
        });

        applyHomeTheme(root.dataset.homeTheme, false);
    }

    if ((document.body.classList.contains('proof-page') || document.body.classList.contains('share-page')) &&
        window.matchMedia &&
        window.matchMedia('(pointer: fine)').matches &&
        !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        var pointerFrame = 0;
        var pointerX = 0;
        var pointerY = 0;

        document.addEventListener('pointermove', function (event) {
            pointerX = event.clientX;
            pointerY = event.clientY;

            if (pointerFrame) {
                return;
            }

            pointerFrame = window.requestAnimationFrame(function () {
                root.style.setProperty('--mx', (pointerX / window.innerWidth * 100).toFixed(1) + '%');
                root.style.setProperty('--my', (pointerY / window.innerHeight * 100).toFixed(1) + '%');
                pointerFrame = 0;
            });
        }, { passive: true });
    }
}());
