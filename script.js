// =====================================================
// MON CALENDAR SLIDESHOW
// =====================================================

let slideIndex = 1;

let slideTimer;


// =====================================================
// GOOGLE PLAY URL
// =====================================================

const PLAY_STORE_URL =
    'https://play.google.com/store/apps/details?id=com.mtw.moncalendar';


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


// =====================================================
// WINDOW LOAD
// =====================================================

window.addEventListener(
    'load',
    function () {

        autoCenterView();

    }
);


// =====================================================
// WINDOW RESIZE
// =====================================================

window.addEventListener(
    'resize',
    function () {

        autoCenterView();

    }
);


// =====================================================
// NEXT / PREVIOUS SLIDE
// =====================================================

function changeSlide(n) {

    stopAutoSlide();

    slideIndex += n;

    showSlide(slideIndex);

    autoSlide();

}


// =====================================================
// DOT NAVIGATION
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
        document.getElementsByClassName(
            'slide'
        );


    const dots =
        document.getElementsByClassName(
            'dot'
        );


    // No slides
    if (
        !slides ||
        slides.length === 0
    ) {

        return;

    }


    // Go back to first slide
    if (
        n > slides.length
    ) {

        slideIndex = 1;

    }


    // Go to last slide
    if (
        n < 1
    ) {

        slideIndex =
            slides.length;

    }


    // ===============================================
    // HIDE ALL SLIDES
    // ===============================================

    for (
        let i = 0;
        i < slides.length;
        i++
    ) {

        slides[i]
            .classList
            .remove(
                'active'
            );

    }


    // ===============================================
    // DEACTIVATE ALL DOTS
    // ===============================================

    for (
        let i = 0;
        i < dots.length;
        i++
    ) {

        dots[i]
            .classList
            .remove(
                'active'
            );

    }


    // ===============================================
    // SHOW CURRENT SLIDE
    // ===============================================

    slides[
        slideIndex - 1
    ]
        .classList
        .add(
            'active'
        );


    // ===============================================
    // ACTIVATE CURRENT DOT
    // ===============================================

    if (
        dots[
            slideIndex - 1
        ]
    ) {

        dots[
            slideIndex - 1
        ]
            .classList
            .add(
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

    if (
        slideTimer
    ) {

        clearTimeout(
            slideTimer
        );


        slideTimer =
            null;

    }

}


// =====================================================
// OPTIONAL PLAY STORE FUNCTION
//
// Uses HTTPS ONLY.
//
// No intent://
// No market://
//
// This function is available if you want to use:
// onclick="openPlayStore(event)"
//
// But slide 1 and slide 3 do NOT require it.
// They use normal <a href=""> links.
// =====================================================

function openPlayStore(event) {

    if (
        event
    ) {

        event.preventDefault();

        event.stopPropagation();

    }


    stopAutoSlide();


    window.location.href =
        PLAY_STORE_URL;


    return false;

}


// =====================================================
// AUTO CENTER
// =====================================================

function autoCenterView() {

    /*
    Flutter banner mode.

    Do not scroll when WebView
    height is around 100px.
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


    if (
        !adContainer
    ) {

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

            document
                .documentElement
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

        if (
            document.hidden
        ) {

            stopAutoSlide();

        }

        else {

            autoSlide();

        }

    }
);
