/**
 * HONDA LEAD 2026 - PROFESSIONAL AUTOMOTIVE UI/UX ENGINE
 * Subtle, polished animations powered by GSAP & ScrollTrigger.
 * Clean, natural scrolling without scroll-hijacking or disruptive pinning.
 */

(function () {
  'use strict';

  if (typeof gsap === 'undefined') {
    return;
  }

  // Register ScrollTrigger if loaded
  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  // 1. Subtle Hero Entrance
  const heroHeader = document.querySelector('.hero-header-box');
  const heroBanner = document.querySelector('.hero-banner-container');
  const heroHighlights = document.querySelectorAll('.highlight-item');

  if (heroHeader) {
    gsap.from(heroHeader, {
      y: 24,
      opacity: 0,
      duration: 0.8,
      ease: "power2.out"
    });
  }

  if (heroBanner) {
    gsap.from(heroBanner, {
      y: 30,
      opacity: 0,
      duration: 0.9,
      delay: 0.15,
      ease: "power2.out"
    });
  }

  if (heroHighlights.length > 0) {
    gsap.from(heroHighlights, {
      y: 20,
      opacity: 0,
      stagger: 0.08,
      duration: 0.6,
      delay: 0.3,
      ease: "power2.out"
    });
  }

  // 2. Animated Odometer Counter for Price Calculator
  const calcTotalEl = document.getElementById('calc-total');
  if (calcTotalEl) {
    const priceWatcher = { val: 2978927 };

    window.animatePriceCounter = function (targetNum) {
      gsap.to(priceWatcher, {
        val: targetNum,
        duration: 0.55,
        ease: "power2.out",
        onUpdate: () => {
          calcTotalEl.textContent = new Intl.NumberFormat('vi-VN').format(Math.round(priceWatcher.val)) + ' đ / tháng';
        }
      });
    };
  }

  // 3. Smooth FAQ Accordion Animation
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    const chevron = item.querySelector('.faq-chevron');

    if (btn && answer) {
      btn.addEventListener('click', () => {
        const isOpen = item.classList.contains('active');

        // Close other items
        faqItems.forEach(other => {
          if (other !== item && other.classList.contains('active')) {
            other.classList.remove('active');
            const otherAns = other.querySelector('.faq-answer');
            const otherChev = other.querySelector('.faq-chevron');
            if (otherAns) {
              gsap.to(otherAns, {
                height: 0,
                opacity: 0,
                duration: 0.25,
                ease: "power2.out",
                onComplete: () => { otherAns.style.display = 'none'; }
              });
            }
            if (otherChev) gsap.to(otherChev, { rotation: 0, duration: 0.2 });
          }
        });

        if (!isOpen) {
          item.classList.add('active');
          answer.style.display = 'block';
          gsap.fromTo(answer,
            { height: 0, opacity: 0 },
            { height: "auto", opacity: 1, duration: 0.3, ease: "power2.out" }
          );
          if (chevron) gsap.to(chevron, { rotation: 180, duration: 0.25 });
        } else {
          item.classList.remove('active');
          gsap.to(answer, {
            height: 0,
            opacity: 0,
            duration: 0.25,
            ease: "power2.out",
            onComplete: () => { answer.style.display = 'none'; }
          });
          if (chevron) gsap.to(chevron, { rotation: 0, duration: 0.25 });
        }
      });
    }
  });

  // 4. Smooth Card Reveal on Scroll (Subtle & Performant)
  if (typeof ScrollTrigger !== 'undefined') {
    const revealCards = document.querySelectorAll('.design-card, .tech-item-card, .utility-mini-card, .gallery-item');
    revealCards.forEach(card => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: "top 90%",
          toggleActions: "play none none none"
        },
        y: 24,
        opacity: 0,
        duration: 0.6,
        ease: "power2.out"
      });
    });
  }

})();
