let slideIndex = 1;
let slideTimer;

const APP_ID = 'com.mtw.moncalendar';

const PLAY_STORE_URL =
    `https://play.google.com/store/apps/details?id=${APP_ID}`;


// =====================================================
// INITIALIZE
// =====================================================

document.addEventListener('DOMContentLoaded', function () {
    showSlide(slideIndex);
    autoSlide();
    autoCenterView();
});

window.addEventListener('load', autoCenterView);
window.addEventListener('resize', autoCenterView);


// =====================================================
// SLIDESHOW CONTROLS
// =====================================================

function changeSlide(n) {
    clearTimeout(slideTimer);

    slideIndex += n;

    showSlide(slideIndex);
    autoSlide();
}


function currentSlide(n) {
    clearTimeout(slideTimer);

    slideIndex = n;

    showSlide(slideIndex);
    autoSlide();
}


// =====================================================
// SHOW CURRENT SLIDE
// =====================================================

function showSlide(n) {
    const slides = document.getElementsByClassName('slide');
    const dots = document.getElementsByClassName('dot');

    if (!slides || slides.length === 0) {
        return;
    }

    if (n > slides.length) {
        slideIndex = 1;
    }

    if (n < 1) {
        slideIndex = slides.length;
    }

    // Hide all slides
    for (let i = 0; i < slides.length; i++) {
        slides[i].classList.remove('active');
    }

    // Remove active class from all dots
    for (let i = 0; i < dots.length; i++) {
        dots[i].classList.remove('active');
    }

    // Show selected slide
    slides[slideIndex - 1].classList.add('active');

    // Activate selected dot
    if (dots[slideIndex - 1]) {
        dots[slideIndex - 1].classList.add('active');
    }
}


// =====================================================
// AUTO SLIDESHOW
// =====================================================

function autoSlide() {
    clearTimeout(slideTimer);

    slideTimer = setTimeout(function () {

        slideIndex++;

        showSlide(slideIndex);

        autoSlide();

    }, 5000);
}


// =====================================================
// OPEN GOOGLE PLAY
// =====================================================

function openPlayStore(event) {

    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }

    clearTimeout(slideTimer);

    console.log('Opening Google Play:', PLAY_STORE_URL);


    // =================================================
    // OPTION 1
    // Flutter webview_flutter JavaScript Channel
    //
    // Flutter:
    //
    // ..addJavaScriptChannel(
    //   'OpenUrl',
    //   onMessageReceived: ...
    // )
    //
    // Creates:
    // window.OpenUrl.postMessage(...)
    // =================================================

    if (
        window.OpenUrl &&
        typeof window.OpenUrl.postMessage === 'function'
    ) {

        console.log('Using Flutter OpenUrl channel');

        window.OpenUrl.postMessage(PLAY_STORE_URL);

        return false;
    }


    // =================================================
    // OPTION 2
    // Optional PlayStore JavaScript Channel
    // =================================================

    if (
        window.PlayStore &&
        typeof window.PlayStore.postMessage === 'function'
    ) {

        console.log('Using Flutter PlayStore channel');

        window.PlayStore.postMessage(PLAY_STORE_URL);

        return false;
    }


    // =================================================
    // OPTION 3
    // flutter_inappwebview
    // =================================================

    if (
        window.flutter_inappwebview &&
        typeof window.flutter_inappwebview.callHandler === 'function'
    ) {

        console.log('Using flutter_inappwebview');

        window.flutter_inappwebview.callHandler(
            'openUrl',
            PLAY_STORE_URL
        );

        return false;
    }


    // =================================================
    // OPTION 4
    // Normal browser fallback
    // =================================================

    console.log('Using normal browser navigation');

    window.location.href = PLAY_STORE_URL;

    return false;
}


// =====================================================
// CTA BUTTON
// =====================================================

function handleCTA(event) {
    return openPlayStore(event);
}


// =====================================================
// AUTO CENTER VIEW
// =====================================================

function autoCenterView() {

    // Do not auto-scroll in small Flutter banner mode
    if (window.matchMedia('(max-height: 140px)').matches) {
        return;
    }

    const adContainer =
        document.querySelector('.ad-container');

    if (!adContainer) {
        return;
    }

    const containerRect =
        adContainer.getBoundingClientRect();

    const absoluteTop =
        window.scrollY + containerRect.top;

    const targetScrollTop =
        absoluteTop
        - (window.innerHeight / 2)
        + (containerRect.height / 2);

    const maxScrollTop =
        Math.max(
            0,
            document.documentElement.scrollHeight
            - window.innerHeight
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
// OPTIONAL:
// Pause slideshow when browser/app is hidden
// =====================================================

document.addEventListener(
    'visibilitychange',
    function () {

        if (document.hidden) {

            clearTimeout(slideTimer);

        } else {

            autoSlide();

        }
    }
);
