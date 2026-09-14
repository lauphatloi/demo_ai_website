/**
 * HONDA LEAD LANDING PAGE - DESKTOP SCROLLYTELLING ENGINE
 * Powers premium GSAP plugins: ScrollSmoother, SplitText, ScrollTrigger,
 * MorphSVG, DrawSVG, InertiaPlugin, CustomEase, CustomBounce, CustomWiggle.
 *
 * ONLY activated on Desktop (width >= 992px) to preserve peak mobile speed.
 */

(function () {
  'use strict';

  // Only run on desktop devices with width >= 992px
  if (window.innerWidth < 992) {
    return;
  }

  // Ensure GSAP core is available
  if (typeof gsap === 'undefined') {
    return;
  }

  // Register GSAP plugins safely
  const registeredPlugins = [];
  if (typeof ScrollTrigger !== 'undefined') registeredPlugins.push(ScrollTrigger);
  if (typeof ScrollSmoother !== 'undefined') registeredPlugins.push(ScrollSmoother);
  if (typeof SplitText !== 'undefined') registeredPlugins.push(SplitText);
  if (typeof CustomEase !== 'undefined') registeredPlugins.push(CustomEase);
  if (typeof CustomBounce !== 'undefined') registeredPlugins.push(CustomBounce);
  if (typeof CustomWiggle !== 'undefined') registeredPlugins.push(CustomWiggle);
  if (typeof DrawSVGPlugin !== 'undefined') registeredPlugins.push(DrawSVGPlugin);
  if (typeof MorphSVGPlugin !== 'undefined') registeredPlugins.push(MorphSVGPlugin);
  if (typeof InertiaPlugin !== 'undefined') registeredPlugins.push(InertiaPlugin);

  gsap.registerPlugin(...registeredPlugins);

  // Initialize Custom Easing curves
  if (typeof CustomEase !== 'undefined') {
    CustomEase.create("leadSmooth", "M0,0 C0.16,1 0.3,1 1,1");
    CustomEase.create("leadExpo", "M0,0 C0.25,1 0.5,1 1,1");
  }

  if (typeof CustomBounce !== 'undefined') {
    try {
      CustomBounce.create("leadBounce", { strength: 0.5, squash: 1.5 });
    } catch (e) {
      console.warn("CustomBounce init:", e);
    }
  }

  if (typeof CustomWiggle !== 'undefined') {
    try {
      CustomWiggle.create("leadWiggle", { wiggles: 3, type: "ease-out" });
    } catch (e) {
      console.warn("CustomWiggle init:", e);
    }
  }

  // 1. Initialize ScrollSmoother if wrapper exists
  let smoother = null;
  if (typeof ScrollSmoother !== 'undefined' && document.getElementById('smooth-wrapper')) {
    smoother = ScrollSmoother.create({
      wrapper: '#smooth-wrapper',
      content: '#smooth-content',
      smooth: 1.15,
      effects: true,
      smoothTouch: false
    });
  }

  // 2. SplitText Headline Animations
  if (typeof SplitText !== 'undefined') {
    // Hero Title Reveal
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
      const splitHero = new SplitText(heroTitle, { type: 'words,chars', wordsClass: 'word', charsClass: 'char' });
      gsap.from(splitHero.chars, {
        opacity: 0,
        y: 40,
        rotateX: -30,
        stagger: 0.02,
        duration: 1.1,
        ease: typeof CustomEase !== 'undefined' ? "leadSmooth" : "power3.out",
        delay: 0.2
      });
    }

    // Hero Tagline Reveal
    const heroDesc = document.querySelector('.hero-desc');
    if (heroDesc) {
      const splitDesc = new SplitText(heroDesc, { type: 'words' });
      gsap.from(splitDesc.words, {
        opacity: 0,
        y: 20,
        stagger: 0.015,
        duration: 0.8,
        ease: "power2.out",
        delay: 0.6
      });
    }

    // Section Titles on Scroll
    document.querySelectorAll('.section-title').forEach(title => {
      const splitTitle = new SplitText(title, { type: 'words' });
      gsap.from(splitTitle.words, {
        opacity: 0,
        y: 30,
        stagger: 0.03,
        duration: 0.9,
        ease: "power2.out",
        scrollTrigger: {
          trigger: title,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        }
      });
    });
  }

  // 3. Hero Banner Parallax & Floating Badges
  const heroBanner = document.querySelector('.hero-banner-wrap img');
  if (heroBanner && typeof ScrollTrigger !== 'undefined') {
    gsap.from(heroBanner, {
      scale: 1.08,
      duration: 1.6,
      ease: "power2.out"
    });

    gsap.to(heroBanner, {
      yPercent: 12,
      ease: "none",
      scrollTrigger: {
        trigger: '.hero-section',
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    });

    // Animate Highlight Cards Stagger
    gsap.from('.highlight-card', {
      opacity: 0,
      y: 35,
      stagger: 0.1,
      duration: 0.8,
      ease: "power2.out",
      delay: 0.5
    });
  }

  // 4. Scrollytelling Feature Cards (Pin & Progressive Reveal)
  if (typeof ScrollTrigger !== 'undefined') {
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach((card, index) => {
      const media = card.querySelector('.feature-card-media img');
      const content = card.querySelector('.feature-card-content');
      const bullets = card.querySelectorAll('.feature-bullets li');

      // Timeline for each feature card entry
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: card,
          start: 'top 78%',
          toggleActions: 'play none none reverse'
        }
      });

      tl.from(card, {
        opacity: 0,
        y: 60,
        duration: 0.8,
        ease: typeof CustomEase !== 'undefined' ? "leadSmooth" : "power3.out"
      })
      .from(media, {
        scale: 1.12,
        duration: 1.2,
        ease: "power2.out"
      }, "-=0.6")
      .from(bullets, {
        opacity: 0,
        x: -20,
        stagger: 0.08,
        duration: 0.5,
        ease: "power2.out"
      }, "-=0.8");

      // Subtle parallax on media
      if (media) {
        gsap.to(media, {
          yPercent: index % 2 === 0 ? 8 : -8,
          ease: "none",
          scrollTrigger: {
            trigger: card,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
          }
        });
      }
    });
  }

  // 5. Technical Line Art SVG Draw Animation (DrawSVGPlugin)
  if (typeof DrawSVGPlugin !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    const drawPaths = document.querySelectorAll('.tech-draw-line');
    if (drawPaths.length > 0) {
      gsap.from(drawPaths, {
        drawSVG: "0%",
        duration: 2.0,
        ease: "power2.inOut",
        stagger: 0.15,
        scrollTrigger: {
          trigger: '#tech-schematic',
          start: 'top 75%'
        }
      });
    }
  }

  // 6. Interactive Morphing Shape (MorphSVGPlugin)
  if (typeof MorphSVGPlugin !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    const morphTarget = document.querySelector('#morph-shield');
    const morphSource = document.querySelector('#morph-abs-badge');
    if (morphTarget && morphSource) {
      gsap.to(morphTarget, {
        morphSVG: morphSource,
        duration: 1.4,
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: '#abs-feature-trigger',
          start: 'top 70%',
          toggleActions: 'play none none reverse'
        }
      });
    }
  }

  // 7. Interactive Physics Dragging for Gallery (InertiaPlugin & Draggable)
  if (typeof Draggable !== 'undefined' && typeof InertiaPlugin !== 'undefined') {
    const galleryContainer = document.querySelector('.gallery-interactive-track');
    if (galleryContainer) {
      Draggable.create(galleryContainer, {
        type: "x",
        inertia: true,
        bounds: galleryContainer.parentElement,
        edgeResistance: 0.65
      });
    }
  }

  // 8. CustomBounce / Wiggle on CTA button hover
  if (typeof CustomBounce !== 'undefined') {
    const primaryBtns = document.querySelectorAll('.btn-bounce');
    primaryBtns.forEach(btn => {
      btn.addEventListener('mouseenter', () => {
        gsap.to(btn, {
          scale: 1.04,
          duration: 0.4,
          ease: "leadBounce"
        });
      });
      btn.addEventListener('mouseleave', () => {
        gsap.to(btn, {
          scale: 1.0,
          duration: 0.3,
          ease: "power2.out"
        });
      });
    });
  }

  // Refresh ScrollTrigger after assets loaded
  window.addEventListener('load', () => {
    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.refresh();
    }
  });

})();
