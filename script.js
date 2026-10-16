// ========================================
// БАЗОВЫЕ НАСТРОЙКИ
// ========================================
const header = document.querySelector(".site-header");
const revealElements = document.querySelectorAll(".reveal");
const navLinks = document.querySelectorAll('a[href^="#"]');
const parallaxItems = document.querySelectorAll("[data-parallax]");

const cursor = document.querySelector(".cursor");
const cursorDot = document.querySelector(".cursor-dot");
const interactiveElements = document.querySelectorAll(".interactive");

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = window.matchMedia("(pointer: fine)").matches;

// ========================================
// ПЛАВНЫЙ СКРОЛЛ К СЕКЦИЯМ
// ========================================
navLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const targetId = link.getAttribute("href");

    if (!targetId || !targetId.startsWith("#")) return;

    const targetElement = document.querySelector(targetId);
    if (!targetElement) return;

    event.preventDefault();

    const headerOffset = header ? header.offsetHeight : 0;
    const targetPosition =
      targetElement.getBoundingClientRect().top + window.pageYOffset - headerOffset + 8;

    window.scrollTo({
      top: targetPosition,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  });
});

// ========================================
// СОСТОЯНИЕ HEADER ПРИ СКРОЛЛЕ
// ========================================
function toggleHeaderState() {
  if (!header) return;

  if (window.scrollY > 20) {
    header.classList.add("is-scrolled");
  } else {
    header.classList.remove("is-scrolled");
  }
}

toggleHeaderState();
window.addEventListener("scroll", toggleHeaderState);

// ========================================
// REVEAL-Анимации через IntersectionObserver
// ========================================
if (!prefersReducedMotion) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.15,
      rootMargin: "0px 0px -40px 0px",
    }
  );

  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("is-visible"));
}

// ========================================
// ПАРАЛЛАКС ДЛЯ ОТДЕЛЬНЫХ ЭЛЕМЕНТОВ
// ========================================
if (!prefersReducedMotion && parallaxItems.length) {
  const updateParallax = () => {
    const viewportHeight = window.innerHeight;

    parallaxItems.forEach((item) => {
      const speed = Number(item.dataset.parallax) || 10;
      const rect = item.getBoundingClientRect();

      // Рассчитываем смещение относительно центра экрана
      const distanceFromCenter = rect.top + rect.height / 2 - viewportHeight / 2;
      const translateY = -(distanceFromCenter * speed) / 1000;

      item.style.transform = `translate3d(0, ${translateY}px, 0)`;
    });
  };

  updateParallax();
  window.addEventListener("scroll", updateParallax, { passive: true });
  window.addEventListener("resize", updateParallax);
}

// ========================================
// КАСТОМНЫЙ КУРСОР
// ========================================
if (!prefersReducedMotion && finePointer && cursor && cursorDot) {
  let mouseX = 0;
  let mouseY = 0;
  let cursorX = 0;
  let cursorY = 0;
  let dotX = 0;
  let dotY = 0;
  let animationFrameId;

  const showCursor = () => {
    cursor.classList.add("is-visible");
    cursorDot.classList.add("is-visible");
  };

  const hideCursor = () => {
    cursor.classList.remove("is-visible");
    cursorDot.classList.remove("is-visible");
  };

  const animateCursor = () => {
    cursorX += (mouseX - cursorX) * 0.16;
    cursorY += (mouseY - cursorY) * 0.16;

    dotX += (mouseX - dotX) * 0.32;
    dotY += (mouseY - dotY) * 0.32;

    cursor.style.transform = `translate(${cursorX}px, ${cursorY}px) translate(-50%, -50%)`;
    cursorDot.style.transform = `translate(${dotX}px, ${dotY}px) translate(-50%, -50%)`;

    animationFrameId = requestAnimationFrame(animateCursor);
  };

  window.addEventListener("mousemove", (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
    showCursor();
  });

  window.addEventListener("mouseout", (event) => {
    if (!event.relatedTarget) {
      hideCursor();
    }
  });

  interactiveElements.forEach((element) => {
    element.addEventListener("mouseenter", () => cursor.classList.add("is-active"));
    element.addEventListener("mouseleave", () => cursor.classList.remove("is-active"));
    element.addEventListener("focus", () => cursor.classList.add("is-active"));
    element.addEventListener("blur", () => cursor.classList.remove("is-active"));
  });

  animateCursor();

  window.addEventListener("beforeunload", () => {
    cancelAnimationFrame(animationFrameId);
  });
}// JavaScript Document