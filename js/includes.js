// === HEADR & FOOTR ===
async function loadComponent(id, file) {
  try {
    const el = document.getElementById(id);
    const res = await fetch(file);

    if (!res.ok) throw new Error(res.status);

    el.innerHTML = await res.text();
  } catch (err) {
    console.error("Failed to load", file, err);
  }
}

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("burger")) {
    const nav = document.querySelector(".header-nav");
    nav.classList.toggle("open");
  }
});

loadComponent("header", "./components/header.txt");
loadComponent("footer", "./components/footer.txt");

// to top btn
const backToTopBtn = document.getElementById('back-to-top');

window.addEventListener('scroll', () => {
  if (window.scrollY > 200) {
    backToTopBtn.classList.add('visible');
  } else {
    backToTopBtn.classList.remove('visible');
  }
});

backToTopBtn.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

// === ABOUT ===
document.querySelectorAll('.info-toggle').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.parentElement;

    // close all others
    document.querySelectorAll('.info-item.open').forEach(openItem => {
      if (openItem !== item) {
        openItem.classList.remove('open');
      }
    });

    // toggle current one
    item.classList.toggle('open');
  });

  document.addEventListener('click', e => {
    if (!e.target.closest('.info-item')) {
      document.querySelectorAll('.info-item.open')
        .forEach(item => item.classList.remove('open'));
    }
  });
});

// byidni anim desktop
const byiDniSection = document.querySelector('.byi-dni');

if (!byiDniSection || window.matchMedia('(max-width: 768px)').matches) {
} else {
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        const section = entry.target;

        section.querySelector('.byi-text')?.classList.add('animate-byi');
        section.querySelector('.chr.delta')?.classList.add('animate-byi');

        section.querySelector('.dni-text')?.classList.add('animate-dni');
        section.querySelector('.chr.xraphim')?.classList.add('animate-dni');

        obs.unobserve(section);
      });
    },
    { threshold: 0.3 }
  );

  observer.observe(byiDniSection);
}

// socials
document.querySelectorAll('.contact-icon').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.contact-item');
    const panel = item.querySelector('.contact-panel');

    // close others
    document.querySelectorAll('.contact-item.open').forEach(open => {
      if (open !== item) {
        open.classList.remove('open');
        const otherBtn = open.querySelector('.contact-icon');
        otherBtn.style.transform = 'translateX(-50%)';
        otherBtn.setAttribute('aria-expanded', 'false');
      }
    });

    const isOpening = !item.classList.contains('open');
    item.classList.toggle('open');
    btn.setAttribute('aria-expanded', isOpening);

    if (isOpening) {
      // wait one frame so panel has layout
      requestAnimationFrame(() => {
        const panelWidth = panel.offsetWidth;
        const iconWidth = btn.offsetWidth;
        const gap = 12;

        const shift =
          panelWidth / 2 + iconWidth / 2 + gap;

        btn.style.transform =
          `translateX(calc(-50% - ${shift}px))`;
      });
    } else {
      btn.style.transform = 'translateX(-50%)';
    }
  });
});

document.addEventListener('click', e => {
  document.querySelectorAll('.contact-item.open').forEach(item => {
    if (!item.contains(e.target)) {
      item.classList.remove('open');
      const btn = item.querySelector('.contact-icon');
      btn.style.transform = 'translateX(-50%)';
      btn.setAttribute('aria-expanded', 'false');
    }
  });
});

const socialsSection = document.querySelector('.contact-socials');

if (socialsSection && window.matchMedia('(min-width: 769px)').matches) {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        socialsSection.classList.add('is-visible');
        observer.disconnect();
      }
    },
    {
      threshold: 0.2
    }
  );

  observer.observe(socialsSection);
}

// === COMMS ===
// fadein
const commSection = document.querySelector('.comm-visual');

if (commSection && window.matchMedia('(min-width: 769px)').matches) {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        commSection.classList.add('is-visible');
        observer.disconnect();
      }
    },
    { threshold: 0.2 }
  );

  observer.observe(commSection);
}

window.addEventListener("load", () => {
  document.querySelector(".comm-details")?.classList.add("fade-in");
  document.querySelector(".offer-slider")?.classList.add("fade-in");
});

// price panels
const commVisual = document.querySelector('.comm-visual');

document.querySelectorAll('.line').forEach(line => {
  line.addEventListener('click', () => {

    const isOpen = line.classList.contains('open');

    document.querySelectorAll('.line').forEach(l => {
      l.classList.remove('open', 'hidden');
    });

    if (!isOpen) {
      line.classList.add('open');

      document.querySelectorAll('.line').forEach(l => {
        if (l !== line) l.classList.add('hidden');
      });

      commVisual.classList.add('panel-open');
    } else {
      commVisual.classList.remove('panel-open');
    }
  });
});

document.addEventListener('click', (e) => {
  if (!e.target.closest('.line')) {

    document.querySelectorAll('.line').forEach(l => {
      l.classList.remove('open', 'hidden');
    });

    setTimeout(() => {
      document.querySelector('.comm-visual')
        ?.classList.remove('panel-open');
    }, 200);
  }
});

// gallery
window.addEventListener("load", () => {
  const section = document.querySelector(".comm-examples");
  section?.classList.add("visible");
});

const cards = document.querySelectorAll(".art-card");
const lightbox = document.getElementById("gallery-lightbox");
const imgDisplay = document.getElementById("gallery-image");

const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const closeBtn = document.getElementById("close-btn");

let images = [];
let currentIndex = 0;
let isZoomed = false;

const galleries = {
  sketch: ["001.webp", "002.webp", "003.webp", "004.webp", "005.webp", "006.webp"],
  lineart: ["001.webp", "002.webp", "003.webp"],
  flatcolor: ["001.webp", "002.webp", "003.webp", "004.webp", "005.webp"],
  shading: ["001.webp", "002.webp", "003.webp", "004.webp"],
  fullrender: ["001.webp", "002.webp", "003.webp", "004.webp"],

  ychpfps: ["ychPreview.webp", "ychPlaceholder.webp", "ychRender.webp", "ychRender2.webp"],
  pngtub: ["spritesdisplay.webp", "001.webp", "002.webp", "003.webp", "004.webp", "005.webp", "006.webp", "007.webp", "008.webp", "009.webp", "010.webp", "011.webp", "012.webp", "muted.webp"]
};

cards.forEach(card => {
  card.addEventListener("click", () => {
    const folder = card.dataset.folder;

    images = (galleries[folder] || []).map(
      file => `img/${folder}/${file}`
    );

    if (images.length === 0) return;

    currentIndex = 0;
    openGallery();
  });
});

function openGallery() {
  lightbox.classList.add("active");

  if (images.length <= 1) {
    prevBtn.style.display = "none";
    nextBtn.style.display = "none";
  } else {
    prevBtn.style.display = "block";
    nextBtn.style.display = "block";
  }

  updateImage();
}

function closeGallery() {
  lightbox.classList.remove("active");
  resetZoom();
}

function updateImage() {
  resetZoom();
  if (imgDisplay) imgDisplay.src = images[currentIndex];
}

nextBtn?.addEventListener("click", (e) => {
  e.stopPropagation();
  currentIndex = (currentIndex + 1) % images.length;
  updateImage();
});

prevBtn?.addEventListener("click", (e) => {
  e.stopPropagation();
  currentIndex = (currentIndex - 1 + images.length) % images.length;
  updateImage();
});

closeBtn?.addEventListener("click", closeGallery);

lightbox?.addEventListener("click", (e) => {
  if (e.target === lightbox) {
    closeGallery();
  }
});

imgDisplay?.addEventListener("click", (e) => {
  e.stopPropagation();

  if (hasMoved) return;

  isZoomed = !isZoomed;

  if (isZoomed) {
    imgDisplay?.classList.add("zoomed");

    currentX = 0;
    currentY = 0;
    imgDisplay?.style.setProperty("--x", "0px");
    imgDisplay?.style.setProperty("--y", "0px");

  } else {
    resetZoom();
  }
});

function resetZoom() {
  isZoomed = false;
  isDragging = false;
  hasMoved = false;

  currentX = 0;
  currentY = 0;

  imgDisplay?.classList.remove("zoomed", "dragging");
  imgDisplay?.style.setProperty("--x", "0px");
  imgDisplay?.style.setProperty("--y", "0px");
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeGallery();
});

// img zoom drag
let isDragging = false;
let hasMoved = false;

let startX = 0;
let startY = 0;

let currentX = 0;
let currentY = 0;

imgDisplay?.addEventListener("mousedown", (e) => {
  if (!isZoomed) return;

  isDragging = true;
  hasMoved = false;

  startX = e.clientX;
  startY = e.clientY;

  imgDisplay?.classList.add("dragging");
});

imgDisplay?.addEventListener("dragstart", (e) => {
  e.preventDefault();
});

document.addEventListener("mousemove", (e) => {
  if (!isDragging) return;

  const dx = e.clientX - startX;
  const dy = e.clientY - startY;

  if (Math.abs(dx) > 2 || Math.abs(dy) > 2) {
    hasMoved = true;
  }

  currentX += dx;
  currentY += dy;

  imgDisplay?.style.setProperty("--x", `${currentX}px`);
  imgDisplay?.style.setProperty("--y", `${currentY}px`);

  startX = e.clientX;
  startY = e.clientY;
});


document.addEventListener("mouseup", () => {
  isDragging = false;
  if (imgDisplay) imgDisplay.classList.remove("dragging");
});

// mobilegallery
let touchStartX = 0;
let touchEndX = 0;
let isTouchDragging = false;

imgDisplay?.addEventListener("touchstart", (e) => {
  const touch = e.touches[0];

  touchStartX = touch.clientX;

  startX = touch.clientX;
  startY = touch.clientY;

  isTouchDragging = false;
});

imgDisplay?.addEventListener("touchend", (e) => {
  if (isZoomed || isTouchDragging) return;

  touchEndX = e.changedTouches[0].clientX;
  const diff = touchStartX - touchEndX;

  if (Math.abs(diff) < 50) return;

  if (diff > 0) {
    currentIndex = (currentIndex + 1) % images.length;
  } else {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
  }

  updateImage();
});

imgDisplay?.addEventListener("touchmove", (e) => {
  if (!isZoomed) return;

  const touch = e.touches[0];

  const dx = touch.clientX - startX;
  const dy = touch.clientY - startY;

  if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
    isTouchDragging = true;
  }

  currentX += dx;
  currentY += dy;

  imgDisplay?.style.setProperty("--x", `${currentX}px`);
  imgDisplay?.style.setProperty("--y", `${currentY}px`);

  startX = touch.clientX;
  startY = touch.clientY;
});

imgDisplay?.addEventListener("touchstart", (e) => {
  const touch = e.touches[0];
  startX = touch.clientX;
  startY = touch.clientY;
});

// bgref
document.querySelectorAll(".bg-item img").forEach(img => {
  img.addEventListener("click", (e) => {
    e.stopPropagation();

    images = [img.src];
    currentIndex = 0;

    openGallery();
  });
});

// carousel
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const offerTrack = document.querySelector(".offer-track");

if (offerTrack) {
  const offerPanels = document.querySelectorAll(".offer-panel");
  const leftArrow = document.querySelector(".offer-arrow.left");
  const rightArrow = document.querySelector(".offer-arrow.right");
  let offerIndex = 0;
  let autoScroll;

  function startAutoScroll() {
    if (prefersReducedMotion) return;
    clearInterval(autoScroll);
    autoScroll = setInterval(nextSlide, 5000);
  }

  function scrollToPanel(index) {
    const viewport = document.querySelector(".offer-viewport");
    const scrollX = index * viewport.clientWidth;
    offerTrack.scrollTo({ left: scrollX, behavior: "smooth" });
  }

  function nextSlide() {
    offerIndex = (offerIndex + 1) % offerPanels.length;
    scrollToPanel(offerIndex);
  }

  function prevSlide() {
    offerIndex = (offerIndex - 1 + offerPanels.length) % offerPanels.length;
    scrollToPanel(offerIndex);
  }

  function resetAutoScroll() {
    if (prefersReducedMotion) return;
    clearInterval(autoScroll);
    startAutoScroll();
  }

  rightArrow?.addEventListener("click", () => {
    nextSlide();
    resetAutoScroll();
  });

  leftArrow?.addEventListener("click", () => {
    prevSlide();
    resetAutoScroll();
  });

  startAutoScroll();

  const offerObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        offerPanels.forEach(p => p.classList.remove("active"));
        entry.target.classList.add("active");
      }
    });
  }, {
    root: document.querySelector(".offer-viewport"),
    threshold: 0.6
  });

  offerPanels.forEach(panel => offerObserver.observe(panel));

  const offerImages = document.querySelectorAll(".offer-img");

  offerImages.forEach((imgBox) => {
    imgBox.addEventListener("click", (e) => {
      e.stopPropagation();
      const panel = imgBox.closest(".offer-panel");
      const folder = panel.dataset.folder;
      if (!folder || !galleries[folder]) return;
      images = galleries[folder].map(file => `img/${folder}/${file}`);
      currentIndex = 0;
      openGallery();
    });
  });
}

// feedback carousel
const feedbackTrack = document.querySelector(".feedback-track");
const feedbackCards = document.querySelectorAll(".feedback-card");
const feedbackLeft = document.querySelector(".feedback-arrow.feedback-left");
const feedbackRight = document.querySelector(".feedback-arrow.feedback-right");

let feedbackIndex = 0;
let feedbackAutoScroll;

function startFeedbackAutoScroll() {
  if (prefersReducedMotion) return;
  clearInterval(feedbackAutoScroll);
  feedbackAutoScroll = setInterval(nextFeedback, 5000);
}

function scrollToFeedback(index) {
  const viewport = document.querySelector(".feedback-viewport");
  const scrollX = index * viewport.clientWidth;
  feedbackTrack?.scrollTo({ left: scrollX, behavior: "smooth" });
}

function nextFeedback() {
  feedbackIndex = (feedbackIndex + 1) % feedbackCards.length;
  scrollToFeedback(feedbackIndex);
}

function prevFeedback() {
  feedbackIndex = (feedbackIndex - 1 + feedbackCards.length) % feedbackCards.length;
  scrollToFeedback(feedbackIndex);
}

feedbackRight?.addEventListener("click", () => {
  nextFeedback();
  clearInterval(feedbackAutoScroll);
  startFeedbackAutoScroll();
});

feedbackLeft?.addEventListener("click", () => {
  prevFeedback();
  clearInterval(feedbackAutoScroll);
  startFeedbackAutoScroll();
});

if (feedbackTrack) startFeedbackAutoScroll();

const feedbackObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      feedbackCards.forEach(c => c.classList.remove("active"));
      entry.target.classList.add("active");
    }
  });
}, {
  root: document.querySelector(".feedback-viewport"),
  threshold: 0.6
});

feedbackCards.forEach(card => feedbackObserver.observe(card));
