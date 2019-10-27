// ==Bookmarklet==
// @name Google Translation
// @author azu
// ==/Bookmarklet==
(function() {
    const origOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(...args) {
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
    googleTranslateScript.onload = () => {
        // Automatic translate
        setTimeout(() => {
            translate();
        }, 1000);
    };
    document.body.appendChild(googleTranslateScript);
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
    // Bootstrap
    (() => {
        // title
        const title = document.querySelector("title");
        title && title.classList.add("notranslate");
        // pre tag
        Array.from(document.querySelectorAll("pre"), pre => {
            pre.classList.add("notranslate");
        });
    })();
})();
