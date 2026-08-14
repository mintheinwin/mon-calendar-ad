let slideIndex = 1;
let slideTimer;
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.mtw.moncalendar';

// Initialize slideshow
document.addEventListener('DOMContentLoaded', function() {
    showSlide(slideIndex);
    autoSlide();
    autoCenterView();
    initSlideLinks();
});

window.addEventListener('load', autoCenterView);
window.addEventListener('resize', autoCenterView);

// Next/previous controls
function changeSlide(n) {
    clearTimeout(slideTimer);
    showSlide(slideIndex += n);
    autoSlide();
}

// Thumbnail image controls
function currentSlide(n) {
    clearTimeout(slideTimer);
    showSlide(slideIndex = n);
    autoSlide();
}

// Main slide display function
function showSlide(n) {
    let slides = document.getElementsByClassName('slide');
    let dots = document.getElementsByClassName('dot');

    if (n > slides.length) {
        slideIndex = 1;
    }
    if (n < 1) {
        slideIndex = slides.length;
    }

    for (let i = 0; i < slides.length; i++) {
        slides[i].classList.remove('active');
    }
    for (let i = 0; i < dots.length; i++) {
        dots[i].classList.remove('active');
    }

    slides[slideIndex - 1].classList.add('active');
    dots[slideIndex - 1].classList.add('active');
}

function autoSlide() {
    slideTimer = setTimeout(function() {
        slideIndex++;
        showSlide(slideIndex);
        autoSlide();
    }, 5000);
}

function openPlayStore(url) {
    const playStoreUrl = url || PLAY_STORE_URL;

    // Flutter / Android WebView JavaScript channels
    if (window.OpenUrl && typeof window.OpenUrl.postMessage === 'function') {
        window.OpenUrl.postMessage(playStoreUrl);
        return true;
    }
    if (window.PlayStore && typeof window.PlayStore.postMessage === 'function') {
        window.PlayStore.postMessage(playStoreUrl);
        return true;
    }
    if (window.flutter_inappwebview && typeof window.flutter_inappwebview.callHandler === 'function') {
        window.flutter_inappwebview.callHandler('openUrl', playStoreUrl);
        return true;
    }

    // Hidden anchor click often works when location.href is blocked in WebView
    const tempLink = document.createElement('a');
    tempLink.href = playStoreUrl;
    tempLink.target = '_blank';
    tempLink.rel = 'noopener noreferrer';
    tempLink.style.display = 'none';
    document.body.appendChild(tempLink);
    tempLink.click();
    document.body.removeChild(tempLink);

    // Fallback navigation
    try {
        (window.top || window).location.href = playStoreUrl;
    } catch (error) {
        window.location.href = playStoreUrl;
    }

    return true;
}

function handlePlayStoreClick(event, url) {
    clearTimeout(slideTimer);
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    openPlayStore(url);
    return false;
}

function initSlideLinks() {
    document.querySelectorAll('.slide-hit-area').forEach(function(link) {
        const url = link.getAttribute('href') || PLAY_STORE_URL;
        let touchStartX = 0;
        let touchStartY = 0;
        let touchMoved = false;

        link.addEventListener('touchstart', function(event) {
            touchMoved = false;
            clearTimeout(slideTimer);

            if (event.touches && event.touches.length > 0) {
                touchStartX = event.touches[0].clientX;
                touchStartY = event.touches[0].clientY;
            }
        }, { passive: true });

        link.addEventListener('touchmove', function(event) {
            if (!event.touches || event.touches.length === 0) {
                return;
            }

            const deltaX = Math.abs(event.touches[0].clientX - touchStartX);
            const deltaY = Math.abs(event.touches[0].clientY - touchStartY);
            if (deltaX > 8 || deltaY > 8) {
                touchMoved = true;
            }
        }, { passive: true });

        link.addEventListener('touchend', function(event) {
            if (touchMoved) {
                autoSlide();
                return;
            }

            event.preventDefault();
            event.stopPropagation();
            openPlayStore(url);
        });

        link.addEventListener('click', function(event) {
            event.preventDefault();
            event.stopPropagation();
            openPlayStore(url);
        });
    });
}

function autoCenterView() {
    if (window.matchMedia('(max-height: 140px)').matches) {
        return;
    }

    const adContainer = document.querySelector('.ad-container');
    if (!adContainer) {
        return;
    }

    const containerRect = adContainer.getBoundingClientRect();
    const absoluteTop = window.scrollY + containerRect.top;
    const targetScrollTop = absoluteTop - (window.innerHeight / 2) + (containerRect.height / 2);
    const maxScrollTop = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    const boundedScrollTop = Math.max(0, Math.min(targetScrollTop, maxScrollTop));

    window.scrollTo({
        top: boundedScrollTop,
        behavior: 'smooth'
    });
}

function handleCTA() {
    openPlayStore(PLAY_STORE_URL);
}
