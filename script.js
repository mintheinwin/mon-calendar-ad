/* =====================================================
   MON CALENDAR SLIDESHOW
===================================================== */

let slideIndex = 1;
let slideTimer = null;


const PLAY_STORE_URL =
    'https://play.google.com/store/apps/details?id=com.mtw.moncalendar';


/* =====================================================
   INITIALIZE
===================================================== */

document.addEventListener(
    'DOMContentLoaded',
    function () {

        showSlide(slideIndex);

        startAutoSlide();
    }
);


/* =====================================================
   SHOW SLIDE
===================================================== */

function showSlide(n) {

    const slides =
        document.querySelectorAll('.slide');

    const dots =
        document.querySelectorAll('.dot');


    if (slides.length === 0) {
        return;
    }


    /* Loop forward */

    if (n > slides.length) {
        slideIndex = 1;
    }


    /* Loop backward */

    if (n < 1) {
        slideIndex = slides.length;
    }


    /* Hide everything */

    slides.forEach(function (slide) {

        slide.classList.remove('active');

    });


    dots.forEach(function (dot) {

        dot.classList.remove('active');

    });


    /* Show current slide */

    const currentSlide =
        slides[slideIndex - 1];


    if (currentSlide) {

        currentSlide.classList.add('active');

    }


    /* Activate dot */

    const currentDot =
        dots[slideIndex - 1];


    if (currentDot) {

        currentDot.classList.add('active');

    }
}


/* =====================================================
   NEXT / PREVIOUS
===================================================== */

function changeSlide(direction) {

    stopAutoSlide();


    slideIndex += direction;


    showSlide(slideIndex);


    startAutoSlide();
}


/* =====================================================
   DOT CLICK
===================================================== */

function currentSlide(number) {

    stopAutoSlide();


    slideIndex = number;


    showSlide(slideIndex);


    startAutoSlide();
}


/* =====================================================
   AUTO SLIDESHOW
===================================================== */

function startAutoSlide() {

    stopAutoSlide();


    slideTimer =
        setTimeout(
            function () {

                slideIndex++;


                showSlide(slideIndex);


                startAutoSlide();

            },

            5000
        );
}


/* =====================================================
   STOP AUTO SLIDESHOW
===================================================== */

function stopAutoSlide() {

    if (slideTimer !== null) {

        clearTimeout(slideTimer);


        slideTimer = null;

    }
}


/* =====================================================
   OPEN EXTERNAL LINK

   IMPORTANT:

   No intent://
   No market://

   Only HTTPS.

===================================================== */

function openExternalLink(event, url) {

    if (event) {

        event.preventDefault();

        event.stopPropagation();

    }


    stopAutoSlide();


    const targetUrl =
        url || PLAY_STORE_URL;


    /*
     * Try opening a new browsing context.
     *
     * In Chrome/browser this normally creates
     * a new tab/window.
     *
     * In Flutter WebView the result depends on
     * the WebView's native configuration.
     */

    try {

        const externalWindow =
            window.open(
                targetUrl,
                '_blank'
            );


        /*
         * window.open() may return null when
         * new-window requests are blocked.
         */

        if (externalWindow) {

            try {

                externalWindow.opener = null;

            } catch (error) {

                // Ignore.
            }


            return false;
        }

    } catch (error) {

        console.log(
            'window.open failed:',
            error
        );
    }


    /*
     * Fallback:
     *
     * If the WebView/browser does not support
     * a new window, navigate normally.
     */

    try {

        window.location.href =
            targetUrl;

    } catch (error) {

        console.log(
            'Navigation failed:',
            error
        );
    }


    return false;
}


/* =====================================================
   PAUSE WHEN PAGE IS HIDDEN
===================================================== */

document.addEventListener(
    'visibilitychange',
    function () {

        if (document.hidden) {

            stopAutoSlide();

        } else {

            startAutoSlide();

        }
    }
);
