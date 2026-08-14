let slideIndex = 1;
let slideTimer;


// Google Play URL
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

        setupStoreLinks();
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
// SLIDESHOW CONTROLS
// =====================================================

function changeSlide(n) {

    stopAutoSlide();

    slideIndex += n;

    showSlide(slideIndex);

    autoSlide();
}


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


    if (n > slides.length) {
        slideIndex = 1;
    }


    if (n < 1) {
        slideIndex = slides.length;
    }


    for (
        let i = 0;
        i < slides.length;
        i++
    ) {

        slides[i]
            .classList
            .remove('active');
    }


    for (
        let i = 0;
        i < dots.length;
        i++
    ) {

        dots[i]
            .classList
            .remove('active');
    }


    slides[
        slideIndex - 1
    ]
        .classList
        .add('active');


    if (
        dots[
            slideIndex - 1
        ]
    ) {

        dots[
            slideIndex - 1
        ]
            .classList
            .add('active');
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

                showSlide(slideIndex);

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

        clearTimeout(slideTimer);

        slideTimer = null;
    }
}


// =====================================================
// SETUP GOOGLE PLAY LINKS
// =====================================================

function setupStoreLinks() {

    const links =
        document.querySelectorAll(
            '.slide-hit-area, .cta-button'
        );


    links.forEach(
        function (link) {

            link.addEventListener(
                'click',
                function () {

                    stopAutoSlide();

                }
            );

        }
    );
}


// =====================================================
// OPTIONAL WINDOW.OPEN FUNCTION
//
// You can test this manually if your WebView
// supports new windows.
//
// Example:
// onclick="return openPlayStore(event);"
// =====================================================

function openPlayStore(event) {

    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }


    stopAutoSlide();


    try {

        const newWindow =
            window.open(
                PLAY_STORE_URL,
                '_blank'
            );


        /*
        If window.open is blocked,
        use the normal HTTPS URL.
        */

        if (!newWindow) {

            window.location.href =
                PLAY_STORE_URL;
        }

    } catch (error) {

        window.location.href =
            PLAY_STORE_URL;
    }


    return false;
}


// =====================================================
// AUTO CENTER VIEW
// =====================================================

function autoCenterView() {

    // Flutter banner mode
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
            window.innerHeight / 2
        ) +
        (
            containerRect.height / 2
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
        top: boundedScrollTop,
        behavior: 'smooth'
    });
}


// =====================================================
// VISIBILITY
// =====================================================

document.addEventListener(
    'visibilitychange',
    function () {

        if (document.hidden) {

            stopAutoSlide();

        } else {

            autoSlide();
        }

    }
);
