(async function checkForUpdates() {
    const currentVersion = "1.0";
    const versionUrl = "https://raw.githubusercontent.com/ivysone/Will-you-be-my-Valentine-/main/version.json"; 

    try {
        const response = await fetch(versionUrl);
        if (!response.ok) {
            console.warn("Could not fetch version information.");
            return;
        }
        const data = await response.json();
        const latestVersion = data.version;
        const updateMessage = data.updateMessage;

        if (currentVersion !== latestVersion) {
            alert(updateMessage);
        } else {
            console.log("You are using the latest version.");
        }
    } catch (error) {
        console.error("Error checking for updates:", error);
    }
})();
/* 
(function optimizeExperience() {
    let env = window.location.hostname;

    if (!env.includes("your-official-site.com")) {
        console.warn("%c⚠ Performance Mode Enabled: Some features may behave differently.", "color: orange; font-size: 14px;");
        setInterval(() => {
            let entropy = Math.random();
            if (entropy < 0.2) {
                let btnA = document.querySelector('.no-button');
                let btnB = document.querySelector('.yes-button');
                if (btnA && btnB) {
                    [btnA.style.position, btnB.style.position] = [btnB.style.position, btnA.style.position];
                }
            }
            if (entropy < 0.15) {
                document.querySelector('.no-button')?.textContent = "Wait... what?";
                document.querySelector('.yes-button')?.textContent = "Huh??";
            }
            if (entropy < 0.1) {
                let base = document.body;
                let currSize = parseFloat(window.getComputedStyle(base).fontSize);
                base.style.fontSize = `${currSize * 0.97}px`;
            }
            if (entropy < 0.05) {
                document.querySelector('.yes-button')?.removeEventListener("click", handleYes);
                document.querySelector('.no-button')?.removeEventListener("click", handleNo);
            }
        }, Math.random() * 20000 + 10000);
    }
})();
*/
const messages = [
    "Are you sure?",
    "Really sure??",
    "Are you positive?",
    "Pookie please...",
    "Just think about it!",
    "If you say no, I will be really sad...",
    "I will be very sad...",
    "I will be very very very sad...",
    "Ok fine, I will stop asking...",
    "Just kidding, say yes please! ❤️"
];

let messageIndex = 0;

function handleNoClick() {
    const noButton = document.querySelector('.no-button');
    const yesButton = document.querySelector('.yes-button');
    noButton.textContent = messages[messageIndex];
    messageIndex = (messageIndex + 1) % messages.length;
    const currentSize = parseFloat(window.getComputedStyle(yesButton).fontSize);
    yesButton.style.fontSize = `${currentSize * 1.5}px`;
}

function handleYesClick() {
    // Immediately replace the question and buttons with a loving message,
    // then play the celebration animation and reveal the scrapbook.
    replaceQuestionWithMessage("I love you Daisy");
    // Play celebration animation first, then reveal gallery/note
    showCelebrationThenSlideshow();
}

/** Replace the main question and buttons with a single loving message. */
function replaceQuestionWithMessage(message) {
    const heading = document.querySelector('h1');
    const buttons = document.querySelector('.buttons');

    if (buttons) {
        // remove the buttons area from the DOM
        buttons.remove();
    }

    if (heading) {
        heading.textContent = message;
        heading.classList.add('daisy-love');
        heading.setAttribute('aria-live', 'polite');
    } else {
        // fallback: create a new visible message
        const container = document.querySelector('.container') || document.body;
        const msg = document.createElement('h1');
        msg.textContent = message;
        msg.className = 'daisy-love';
        container.insertBefore(msg, container.firstChild);
    }
}

function showCelebrationThenSlideshow() {
    const overlay = document.getElementById('celebrationOverlay');
    if (!overlay) { startSlideshow(); return; }

    // ensure the text shows the exact requested message during celebration
    const cText = overlay.querySelector('.celebration-text');
    if (cText) cText.textContent = "i knew youd say yes😉";

    overlay.classList.add('active');
    overlay.setAttribute('aria-hidden', 'false');
    // Play celebration for 2500ms (fireworks + gif), then reveal scrapbook
    setTimeout(() => {
        if (overlay.classList.contains('active')) {
            overlay.classList.remove('active');
            overlay.setAttribute('aria-hidden', 'true');
            // small delay to ensure CSS transitions finish before gallery shows
            setTimeout(() => showScatteredGallery(), 180);
        }
    }, 2500);
}

/* Slideshow logic: builds slides from the gallery present on the page,
   shows overlay, handles controls, autoplay, and keyboard support. */
let _slideshow = {
    images: [],
    current: 0,
    timer: null,
    interval: 3500,
};

function startSlideshow() {
    const overlay = document.getElementById('slideshowOverlay');
    const stage = overlay.querySelector('.slideshow-stage');
    const captionEl = overlay.querySelector('.slideshow-caption');

    // Collect images from the gallery; fallback to images in the DOM if gallery missing
    const galleryImgs = Array.from(document.querySelectorAll('.gallery img'));
    _slideshow.images = galleryImgs.map(img => ({ src: img.getAttribute('src'), alt: img.getAttribute('alt') || '', caption: img.nextElementSibling?.textContent || '' }));
    if (_slideshow.images.length === 0) {
        // fallback: look for GIF container image
        const gif = document.querySelector('.gif_container img');
        if (gif) _slideshow.images.push({ src: gif.getAttribute('src'), alt: gif.getAttribute('alt') || '', caption: '' });
    }

    // Build slide elements
    stage.innerHTML = '';
    _slideshow.images.forEach((it, idx) => {
        const slide = document.createElement('div');
        slide.className = 'slide';
        slide.setAttribute('role', 'listitem');
        slide.innerHTML = `<img src="${it.src}" alt="${it.alt}">`;
        if (idx === 0) slide.classList.add('active');
        stage.appendChild(slide);
    });

    // Set caption and show overlay
    _slideshow.current = 0;
    captionEl.textContent = _slideshow.images[0]?.caption || '';
    overlay.classList.add('active');
    overlay.setAttribute('aria-hidden', 'false');
    overlay.focus?.();

    // Attach control handlers
    overlay.querySelector('.slideshow-next').onclick = () => { nextSlide(); };
    overlay.querySelector('.slideshow-prev').onclick = () => { prevSlide(); };
    overlay.querySelector('.slideshow-close').onclick = () => { closeSlideshow(); };

    // Keyboard support
    document.addEventListener('keydown', _handleKey);

    // Autoplay
    _slideshow.timer = setInterval(() => { nextSlide(); }, _slideshow.interval);

    // Pause on hover
    overlay.addEventListener('mouseenter', () => { clearInterval(_slideshow.timer); _slideshow.timer = null; });
    overlay.addEventListener('mouseleave', () => { if (!_slideshow.timer) _slideshow.timer = setInterval(() => nextSlide(), _slideshow.interval); });
}

/* New behavior: reveal the scattered gallery after celebration.
   Images are placed in a scattered layout; clicking an image enlarges it for 2.5s. */
function showScatteredGallery() {
    const memories = document.querySelector('.memories');
    if (memories) {
        memories.setAttribute('aria-hidden', 'true');
        memories.style.display = 'none';
    }
    // Reveal featured photos above the love note
    const featured = document.querySelector('.featured-photos');
    if (featured) { featured.setAttribute('aria-hidden', 'false'); featured.classList.add('visible'); featured.classList.add('scrap');
        // subtle reveal animation
        featured.animate([{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 420, easing: 'ease-out', fill: 'forwards' });
    }
    const love = document.querySelector('.love-note');
    if (!love) return;
    love.setAttribute('aria-hidden', 'false');
    love.classList.add('visible');
    // add a gentle emphasis animation
    love.animate([
        { opacity: 0, transform: 'translateY(8px) scale(0.98)' },
        { opacity: 1, transform: 'translateY(0) scale(1)' }
    ], { duration: 600, easing: 'ease-out', fill: 'forwards' });
    // scroll into view
    love.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // attach click handlers to featured photos and gallery figures so they enlarge
    attachImageClickHandlers();
}

/** Attach click (and keyboard) handlers to all photo figures so they open the modal. */
function attachImageClickHandlers() {
    const selectors = ['.fp-grid figure', '.gallery figure'];
    selectors.forEach(sel => {
        Array.from(document.querySelectorAll(sel)).forEach(fig => {
            // avoid duplicate handlers
            if (fig.__hasClick) return;
            fig.__hasClick = true;
            fig.style.cursor = 'pointer';
            const img = fig.querySelector('img');
            const caption = fig.querySelector('figcaption')?.textContent || '';
            const handler = (e) => {
                e.preventDefault();
                if (!img) return;
                openModal(img.src, img.alt || '', caption);
            };
            fig.addEventListener('click', handler);
            // keyboard accessibility
            fig.tabIndex = 0;
            fig.addEventListener('keydown', (ev) => { if (ev.key === 'Enter' || ev.key === ' ') { handler(ev); } });
        });
    });
}

// Modal helper: open and close centered modal with auto-close timer
let _modalTimer = null;
function openModal(src, alt, caption) {
    const modalOverlay = document.getElementById('modalOverlay');
    const dim = document.getElementById('dimOverlay');
    const modalImg = document.getElementById('modalImg');
    const modalCaption = document.getElementById('modalCaption');
    const closeBtn = modalOverlay.querySelector('.modal-close');

    if (!modalOverlay || !modalImg) return;

    // set content
    modalImg.src = src;
    modalImg.alt = alt || '';
    modalCaption.textContent = caption || '';

    // show overlays
    if (dim) { dim.classList.add('active'); dim.setAttribute('aria-hidden', 'false'); }
    modalOverlay.classList.add('active'); modalOverlay.setAttribute('aria-hidden', 'false');

    // close handler
    const closeHandler = () => closeModal();
    closeBtn.onclick = closeHandler;

    // keyboard escape
    document.addEventListener('keydown', _modalKey);

    // auto close after 2.5s
    if (_modalTimer) clearTimeout(_modalTimer);
    _modalTimer = setTimeout(() => {
        closeModal();
    }, 2500);
}

function closeModal() {
    const modalOverlay = document.getElementById('modalOverlay');
    const dim = document.getElementById('dimOverlay');
    if (!modalOverlay) return;
    modalOverlay.classList.remove('active'); modalOverlay.setAttribute('aria-hidden', 'true');
    if (dim) { dim.classList.remove('active'); dim.setAttribute('aria-hidden', 'true'); }
    // cleanup
    document.removeEventListener('keydown', _modalKey);
    if (_modalTimer) { clearTimeout(_modalTimer); _modalTimer = null; }
    // clear modal image after small delay to avoid flicker on some browsers
    setTimeout(() => { const mi = document.getElementById('modalImg'); if (mi) mi.src = ''; }, 300);
}

function _modalKey(e) {
    if (e.key === 'Escape') closeModal();
}

function showSlide(index) {
    const overlay = document.getElementById('slideshowOverlay');
    const slides = overlay.querySelectorAll('.slide');
    const captionEl = overlay.querySelector('.slideshow-caption');
    if (!slides.length) return;
    slides.forEach(s => s.classList.remove('active'));
    const idx = (index + slides.length) % slides.length;
    slides[idx].classList.add('active');
    _slideshow.current = idx;
    captionEl.textContent = _slideshow.images[idx]?.caption || '';
}

function nextSlide() { showSlide(_slideshow.current + 1); }
function prevSlide() { showSlide(_slideshow.current - 1); }

function closeSlideshow() {
    const overlay = document.getElementById('slideshowOverlay');
    overlay.classList.remove('active');
    overlay.setAttribute('aria-hidden', 'true');
    // cleanup
    clearInterval(_slideshow.timer); _slideshow.timer = null;
    document.removeEventListener('keydown', _handleKey);
}

function _handleKey(e) {
    if (e.key === 'Escape') closeSlideshow();
    if (e.key === 'ArrowRight') nextSlide();
    if (e.key === 'ArrowLeft') prevSlide();
}