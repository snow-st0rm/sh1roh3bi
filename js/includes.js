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

loadComponent("header", "./components/header.html");
loadComponent("footer", "./components/footer.html");

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