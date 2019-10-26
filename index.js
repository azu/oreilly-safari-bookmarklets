// ==Bookmarklet==
// @name Oreilly Safari Translation
// @author azu
// ==/Bookmarklet==
(function () {
    const origOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (...args) {
        const originalURL = args[1];
        try {
            const url = new URL(originalURL);
            if (url.host === "translate.googleapis.com" && url.searchParams.get("client") === "te") {
                url.searchParams.set("client", "webapp");
                args[1] = url.toString();
            }
        } catch (error) {
            /* nope */
        } finally {
            origOpen.apply(this, args);
        }
    };
    window.googleTranslateElementInit = function googleTranslateElementInit() {
        new google.translate.TranslateElement(
            { autoDisplay: true, multilanguagePage: true },
            "google_translate_element"
        );
    };
    const googleTranslateScript = document.createElement("script");
    googleTranslateScript.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    document.body.appendChild(googleTranslateScript);

    const isTranslated = () => {
        const iframe = document.querySelector(".goog-te-banner-frame");
        if (!iframe) {
            return false;
        }
        const finishSection = iframe.contentWindow.document.querySelector(`[id=":0.finishSection"]`);
        const style = window.getComputedStyle(finishSection);
        return style.display === "none";
    }
    // onChangeURL
    const translate = () => {
        const iframe = document.querySelector(".goog-te-banner-frame");
        if (!iframe) {
            return;
        }
        const confirmButton = iframe.contentWindow.document.querySelector(`button[id=":0.confirm"]`);
        if (!confirmButton) {
            return;
        }
        confirmButton.click();
        return true;
    };
    const restoreTranslate = () => {
        const iframe = document.querySelector(".goog-te-banner-frame");
        if (!iframe) {
            return;
        }
        const confirmButton = iframe.contentWindow.document.querySelector(`button[id=":0.restore"]`);
        if (!confirmButton) {
            return;
        }
        confirmButton.click();
        return true;
    };
    const goToPrev = () => {
        const next = document.querySelector(".prev");
        if (next) {
            next.click();
        }
    }
    const goToNext = () => {
        const next = document.querySelector(".next");
        if (next) {
            next.click();
        }
    }
    let isChangedArrow = false;
    const _wr = function (type) {
        var orig = history[type];
        return function () {
            var rv = orig.apply(this, arguments);
            var e = new Event(type);
            e.arguments = arguments;
            window.dispatchEvent(e);
            return rv;
        };
    };
    history.pushState = _wr('pushState');
    history.replaceState = _wr('replaceState');
    window.addEventListener("pushState", (event) => {
        if (isChangedArrow) {
            setTimeout(() => {
                translate();
            }, 1000);
            isChangedArrow = false;
        }
    });
    document.addEventListener("keydown", (event) => {
        if (event.key === "ArrowRight" || event.which === 37) {
            isChangedArrow = true;
            restoreTranslate();
            requestAnimationFrame(() => {
                goToNext();
            });
            event.preventDefault();
        } else if (event.key === "ArrowLeft" || event.which === 39) {
            isChangedArrow = true;
            restoreTranslate();
            requestAnimationFrame(() => {
                goToPrev();
            });
            event.preventDefault();
        }
    });
    function addcss(css) {
        var head = document.head;
        var s = document.createElement('style');
        s.setAttribute('type', 'text/css');
        if (s.styleSheet) {   // IE
            s.styleSheet.cssText = css;
        } else {                // the world
            s.appendChild(document.createTextNode(css));
        }
        head.appendChild(s);
    }

    // notranslate class to
    (() => {
        // title
        document.querySelector("title").classList.add("notranslate");
        // pre tag
        Array.from(document.querySelectorAll("pre"), pre => {
            pre.classList.add("notranslate");
        });
        // toc
        document.querySelector(".tocList").classList.add("notranslate");
    })();
    // Bootstrap
    setTimeout(() => {
        translate();
    }, 1000);
    const CSS = `
    .goog-te-banner-frame {
        top: auto!important;
        bottom: 0;
    }
    `;

    addcss(CSS);

})();
