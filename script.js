// =====================================================
// MON CALENDAR SLIDESHOW
// =====================================================

let slideIndex = 1;
let slideTimer;


// =====================================================
// GOOGLE PLAY SETTINGS
// =====================================================

const APP_ID = 'com.mtw.moncalendar';

const PLAY_STORE_URL =
    'https://play.google.com/store/apps/details?id=' +
    APP_ID;


/*
Android Intent URL

This asks Android to open the Google Play Store app.

If Google Play cannot handle the request,
browser_fallback_url points to the normal
Google Play website.
*/

const PLAY_STORE_INTENT =
    'intent://details?id=' +
    APP_ID +
    '#Intent;' +
    'scheme=market;' +
    'package=com.android.vending;' +
    'S.browser_fallback_url=' +
    encodeURIComponent(PLAY_STORE_URL) +
    ';end';


// =====================================================
// INITIALIZE
// =====================================================

document.addEventListener(
    'DOMContentLoaded',
    function () {

        showSlide(slideIndex);

        autoSlide();

        autoCenterView();
    }
);


window.addEventListener(
    'load',
    autoCenterView
);


window.addEventListener(
    'resize',
    autoCenterView
);


// =====================================================
// NEXT / PREVIOUS
// =====================================================

function changeSlide(n) {

    stopAutoSlide();

    slideIndex += n;

    showSlide(slideIndex);

    autoSlide();
}


// =====================================================
// DOT CONTROL
// =====================================================

function currentSlide(n) {

    stopAutoSlide();

    slideIndex = n;

    showSlide(slideIndex);

    autoSlide();
}


// =====================================================
// SHOW SLIDE
// =====================================================

function showSlide(n) {

    const slides =
        document.getElementsByClassName('slide');

    const dots =
        document.getElementsByClassName('dot');


    if (!slides.length) {
        return;
    }


    // Last -> First
    if (n > slides.length) {
        slideIndex = 1;
    }


    // First -> Last
    if (n < 1) {
        slideIndex = slides.length;
    }


    // Hide all slides
    for (
        let i = 0;
        i < slides.length;
        i++
    ) {

        slides[i].classList.remove(
            'active'
        );
    }


    // Deactivate dots
    for (
        let i = 0;
        i < dots.length;
        i++
    ) {

        dots[i].classList.remove(
            'active'
        );
    }


    // Show slide
    slides[
        slideIndex - 1
    ].classList.add(
        'active'
    );


    // Activate dot
    if (
        dots[
            slideIndex - 1
        ]
    ) {

        dots[
            slideIndex - 1
        ].classList.add(
            'active'
        );
    }
}


// =====================================================
// AUTO SLIDE
// =====================================================

function autoSlide() {

    stopAutoSlide();


    slideTimer =
        setTimeout(
            function () {

                slideIndex++;

                showSlide(
                    slideIndex
                );

                autoSlide();

            },
            5000
        );
}


// =====================================================
// STOP AUTO SLIDE
// =====================================================

function stopAutoSlide() {

    if (slideTimer) {

        clearTimeout(
            slideTimer
        );

        slideTimer = null;
    }
}


// =====================================================
// OPEN GOOGLE PLAY
// =====================================================

function openPlayStore(event) {

    if (event) {

        event.preventDefault();

        event.stopPropagation();
    }


    stopAutoSlide();


    /*
    Detect Android.

    Flutter Android WebView normally reports
    Android in navigator.userAgent.
    */

    const userAgent =
        navigator.userAgent ||
        navigator.vendor ||
        window.opera ||
        '';


    const isAndroid =
        /android/i.test(
            userAgent
        );


    // =================================================
    // ANDROID
    // =================================================

    if (isAndroid) {

        try {

            /*
            First attempt:

            Ask Android to open
            Google Play Store.
            */

            window.location.href =
                PLAY_STORE_INTENT;


            /*
            Fallback.

            If intent:// does not work,
            try the normal Google Play URL.
            */

            setTimeout(
                function () {

                    if (
                        document.visibilityState ===
                        'visible'
                    ) {

                        try {

                            window.location.href =
                                PLAY_STORE_URL;

                        } catch (error) {

                            console.log(
                                'Play Store fallback failed:',
                                error
                            );
                        }
                    }

                },
                1500
            );


            return false;

        } catch (error) {

            console.log(
                'Android Play Store intent failed:',
                error
            );
        }
    }


    // =================================================
    // NORMAL BROWSER FALLBACK
    // =================================================

    try {

        window.location.href =
            PLAY_STORE_URL;

    } catch (error) {

        console.log(
            'Google Play navigation failed:',
            error
        );
    }


    return false;
}


// =====================================================
// CTA
// =====================================================

function handleCTA(event) {

    return openPlayStore(
        event
    );
}


// =====================================================
// AUTO CENTER
// =====================================================

function autoCenterView() {

    /*
    Do not auto-scroll when running
    as the 100px Flutter banner.
    */

    if (
        window.matchMedia(
            '(max-height: 140px)'
        ).matches
    ) {

        return;
    }


    const adContainer =
        document.querySelector(
            '.ad-container'
        );


    if (!adContainer) {
        return;
    }


    const containerRect =
        adContainer
            .getBoundingClientRect();


    const absoluteTop =
        window.scrollY +
        containerRect.top;


    const targetScrollTop =
        absoluteTop -
        (
            window.innerHeight /
            2
        ) +
        (
            containerRect.height /
            2
        );


    const maxScrollTop =
        Math.max(
            0,
            document.documentElement
                .scrollHeight -
            window.innerHeight
        );


    const boundedScrollTop =
        Math.max(
            0,
            Math.min(
                targetScrollTop,
                maxScrollTop
            )
        );


    window.scrollTo({
        top:
            boundedScrollTop,

        behavior:
            'smooth'
    });
}


// =====================================================
// PAGE VISIBILITY
// =====================================================

document.addEventListener(
    'visibilitychange',
    function () {

        /*
        Stop slideshow when Play Store,
        another app, or another page opens.
        */

        if (document.hidden) {

            stopAutoSlide();

        } else {

            autoSlide();
        }
    }
);
