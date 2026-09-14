/**
 * HONDA LEAD 2026 - HIGH-END DESKTOP SCROLLYTELLING ENGINE
 * Powered by GSAP Core, ScrollTrigger, ScrollSmoother, SplitText,
 * DrawSVGPlugin, MorphSVGPlugin, InertiaPlugin, CustomEase, CustomBounce, CustomWiggle.
 *
 * Implements:
 * 1. ScrollSmoother momentum scrolling across desktop
 * 2. Full-Page Cinematic Widescreen Hero Parallax & SplitText Cascade
 * 3. 3D Showroom Turntable & Interactive Levitation
 * 4. Pinned Horizontal Track (ContainerAnimation) for Design Showcase
 * 5. Technical Blueprint HUD with DrawSVG & MorphSVG for ABS/eSP+ Engine
 * 6. Utility Grid & Gallery 3D Staggered Revelations
 * 7. Animated Odometer Counter for Price & Installment Estimator
 * 8. Smooth Accordion for FAQ
 */

(function () {
  'use strict';

  // Ensure GSAP and plugins are available
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    return;
  }

  // Register all available GSAP plugins
  const plugins = [ScrollTrigger];
  if (typeof ScrollSmoother !== 'undefined') plugins.push(ScrollSmoother);
  if (typeof SplitText !== 'undefined') plugins.push(SplitText);
  if (typeof CustomEase !== 'undefined') plugins.push(CustomEase);
  if (typeof CustomBounce !== 'undefined') plugins.push(CustomBounce);
  if (typeof CustomWiggle !== 'undefined') plugins.push(CustomWiggle);
  if (typeof DrawSVGPlugin !== 'undefined') plugins.push(DrawSVGPlugin);
  if (typeof MorphSVGPlugin !== 'undefined') plugins.push(MorphSVGPlugin);
  if (typeof InertiaPlugin !== 'undefined') plugins.push(InertiaPlugin);

  gsap.registerPlugin(...plugins);

  // Set global defaults (gsap-core best practice)
  gsap.defaults({
    duration: 0.6,
    ease: "power2.out"
  });

  // Create custom curves
  if (typeof CustomEase !== 'undefined') {
    CustomEase.create("leadSmooth", "M0,0 C0.16,1 0.3,1 1,1");
    CustomEase.create("leadCinematic", "M0,0 C0.25,1 0.4,1 1,1");
  }

  if (typeof CustomBounce !== 'undefined') {
    try {
      CustomBounce.create("leadBounce", { strength: 0.52, squash: 1.4 });
    } catch (e) {
      console.warn("CustomBounce init:", e);
    }
  }

  if (typeof CustomWiggle !== 'undefined') {
    try {
      CustomWiggle.create("leadWiggle", { wiggles: 4, type: "easeOut" });
    } catch (e) {
      console.warn("CustomWiggle init:", e);
    }
  }

  // Use gsap.matchMedia() for clean desktop lifecycle & prefers-reduced-motion support
  let mm = gsap.matchMedia();

  mm.add({
    isDesktop: "(min-width: 992px)",
    reduceMotion: "(prefers-reduced-motion: reduce)"
  }, (context) => {
    const { isDesktop, reduceMotion } = context.conditions;

    if (!isDesktop || reduceMotion) {
      return; // Skip on mobile or users preferring reduced motion
    }

    // ========================================================================
    // 1. SCROLLSMOOTHER INITIALIZATION
    // ========================================================================
    let smoother = null;
    if (typeof ScrollSmoother !== 'undefined' && document.getElementById('smooth-wrapper')) {
      smoother = ScrollSmoother.create({
        wrapper: '#smooth-wrapper',
        content: '#smooth-content',
        smooth: 1.25,
        effects: true,
        smoothTouch: false
      });
    }

    // ========================================================================
    // 2. HERO WIDESCREEN BANNER & SPLITTEXT CASCADE
    // ========================================================================
    const heroTitle = document.querySelector('.hero-title');
    const heroBannerWrap = document.querySelector('.hero-banner-wrap');
    const heroBannerImg = document.querySelector('.hero-banner-wrap img');

    if (heroTitle && typeof SplitText !== 'undefined') {
      const splitTitle = new SplitText(heroTitle, {
        type: "words,chars",
        wordsClass: "word",
        charsClass: "char"
      });

      gsap.from(splitTitle.chars, {
        autoAlpha: 0,
        y: 35,
        rotateX: -30,
        stagger: 0.018,
        duration: 1.1,
        ease: "leadSmooth",
        delay: 0.15
      });
    }

    if (heroBannerWrap && heroBannerImg) {
      // 3D Perspective entrance
      gsap.fromTo(heroBannerWrap,
        { scale: 0.94, y: 30, rotationX: 4 },
        { scale: 1, y: 0, rotationX: 0, duration: 1.3, ease: "leadSmooth", delay: 0.25 }
      );

      // Parallax scroll tilt out of Hero
      gsap.to(heroBannerImg, {
        scale: 1.12,
        yPercent: 14,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero-section",
          start: "top top",
          end: "bottom top",
          scrub: true
        }
      });
    }

    // Stagger telemetry cards
    gsap.from(".telemetry-card", {
      autoAlpha: 0,
      y: 30,
      stagger: 0.08,
      duration: 0.8,
      ease: "power3.out",
      delay: 0.5
    });

    // ========================================================================
    // 3. SECTION 1: CÁC PHIÊN BẢN (VERSIONS & 3D STUDIO)
    // ========================================================================
    const vehicleImg = document.getElementById('selected-vehicle-img');
    const colorStage = document.querySelector('.color-stage');

    if (vehicleImg && colorStage) {
      // Gentle floating levitation
      gsap.to(vehicleImg, {
        y: -10,
        duration: 2.2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });

      // Interactive 3D Cursor Tilt on Studio
      colorStage.addEventListener('mousemove', (e) => {
        const rect = colorStage.getBoundingClientRect();
        const mouseX = (e.clientX - rect.left) / rect.width - 0.5;
        const mouseY = (e.clientY - rect.top) / rect.height - 0.5;

        gsap.to(vehicleImg, {
          rotationY: mouseX * 16,
          rotationX: -mouseY * 12,
          transformPerspective: 1000,
          duration: 0.4,
          ease: "power1.out"
        });
      });

      colorStage.addEventListener('mouseleave', () => {
        gsap.to(vehicleImg, {
          rotationY: 0,
          rotationX: 0,
          duration: 0.6,
          ease: "power2.out"
        });
      });
    }

    // ========================================================================
    // 4. SECTION 2: THIẾT KẾ (PINNED HORIZONTAL SCROLL - containerAnimation)
    // Strictly follows gsap-scrolltrigger standards: ease: "none" required!
    // ========================================================================
    const horizSection = document.querySelector('.horizontal-showcase-section');
    const horizTrack = document.querySelector('.horizontal-track');

    if (horizSection && horizTrack) {
      const getScrollDistance = () => -(horizTrack.scrollWidth - window.innerWidth + 120);

      const horizTween = gsap.to(horizTrack, {
        x: getScrollDistance,
        ease: "none", // REQUIRED by gsap-scrolltrigger for 1:1 scroll synchronization
        scrollTrigger: {
          trigger: horizSection,
          start: "top top",
          end: () => "+=" + Math.abs(getScrollDistance()),
          pin: true,
          scrub: 1.1,
          invalidateOnRefresh: true
        }
      });

      // Counter-parallax on each card's image using containerAnimation
      gsap.utils.toArray('.horiz-parallax-img').forEach((img) => {
        gsap.fromTo(img,
          { xPercent: 12 },
          {
            xPercent: -12,
            ease: "none",
            scrollTrigger: {
              trigger: img.closest('.horizontal-card'),
              containerAnimation: horizTween,
              start: "left right",
              end: "right left",
              scrub: true
            }
          }
        );
      });

      // Staggered text elevation inside horizontal cards
      gsap.utils.toArray('.horizontal-card-info').forEach((info) => {
        gsap.from(info, {
          autoAlpha: 0.4,
          y: 20,
          ease: "power2.out",
          scrollTrigger: {
            trigger: info.closest('.horizontal-card'),
            containerAnimation: horizTween,
            start: "left 85%",
            toggleActions: "play none none reverse"
          }
        });
      });
    }

    // ========================================================================
    // 5. SECTION 3: ĐỘNG CƠ & ABS (BLUEPRINT DRAW-SVG & MORPH-SVG)
    // ========================================================================
    const engineSection = document.querySelector('.engine-tech-section');
    const drawLines = document.querySelectorAll('.tech-draw-line');
    const morphShield = document.getElementById('morph-shield');
    const morphBadge = document.getElementById('morph-abs-badge');

    if (engineSection) {
      const techTl = gsap.timeline({
        scrollTrigger: {
          trigger: engineSection,
          start: "top 75%",
          toggleActions: "play none none reverse"
        }
      });

      techTl.from(".tech-card", {
        autoAlpha: 0,
        y: 45,
        stagger: 0.15,
        duration: 0.8,
        ease: "power3.out"
      });

      // Draw sensor rings with DrawSVGPlugin
      if (drawLines.length > 0 && typeof DrawSVGPlugin !== 'undefined') {
        techTl.fromTo(drawLines,
          { drawSVG: "0%" },
          { drawSVG: "100%", duration: 1.0, stagger: 0.08, ease: "power2.inOut" },
          "-=0.4"
        );
      }

      // Morph shield to ABS badge with MorphSVGPlugin
      if (morphShield && morphBadge && typeof MorphSVGPlugin !== 'undefined') {
        techTl.to(morphShield, {
          morphSVG: morphBadge,
          duration: 0.8,
          ease: "power2.inOut"
        }, "-=0.3");
      }
    }

    // ========================================================================
    // 6. SECTION 4: TIỆN ÍCH & GALLERY (STAGGERED DEPTH)
    // ========================================================================
    gsap.from(".utility-sub-card", {
      autoAlpha: 0,
      y: 35,
      stagger: 0.1,
      duration: 0.7,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ".utility-cards-grid",
        start: "top 80%"
      }
    });

    gsap.utils.toArray('.gallery-item').forEach((item, idx) => {
      gsap.from(item, {
        autoAlpha: 0,
        y: 30,
        scale: 0.96,
        duration: 0.7,
        delay: (idx % 3) * 0.08,
        scrollTrigger: {
          trigger: item,
          start: "top 88%"
        }
      });
    });

    // ========================================================================
    // 7. SECTION 5: GIÁ GÓP THAM KHẢO (ANIMATED ODOMETER COUNTER)
    // ========================================================================
    const calcTotalEl = document.getElementById('calc-total');
    if (calcTotalEl) {
      const priceWatcher = { val: 51992963 };

      window.animatePriceCounter = function (targetNum) {
        gsap.to(priceWatcher, {
          val: targetNum,
          duration: 0.65,
          ease: "power2.out",
          onUpdate: () => {
            calcTotalEl.textContent = new Intl.NumberFormat('vi-VN').format(Math.round(priceWatcher.val)) + ' đ';
          }
        });

        // Subtle bounce on the receipt box
        const resultsBox = document.querySelector('.calc-results-box');
        if (resultsBox && typeof CustomWiggle !== 'undefined') {
          gsap.to(resultsBox, { scale: 1.015, duration: 0.25, yoyo: true, repeat: 1, ease: "power1.inOut" });
        }
      };
    }

    // ========================================================================
    // 8. SECTION 6: FAQ ACCORDION (SMOOTH GSAP HEIGHT ANIMATION)
    // ========================================================================
    document.querySelectorAll('.faq-item').forEach(item => {
      const btn = item.querySelector('.faq-question');
      const answer = item.querySelector('.faq-answer');
      const chevron = item.querySelector('.faq-chevron');

      if (btn && answer) {
        btn.addEventListener('click', () => {
          const isOpen = item.classList.contains('active');

          // Close all others cleanly
          document.querySelectorAll('.faq-item.active').forEach(other => {
            if (other !== item) {
              other.classList.remove('active');
              const otherAns = other.querySelector('.faq-answer');
              const otherChev = other.querySelector('.faq-chevron');
              if (otherAns) gsap.to(otherAns, { height: 0, autoAlpha: 0, duration: 0.35, ease: "power2.out", onComplete: () => { otherAns.style.display = 'none'; } });
              if (otherChev) gsap.to(otherChev, { rotation: 0, duration: 0.3 });
            }
          });

          if (!isOpen) {
            item.classList.add('active');
            answer.style.display = 'block';
            gsap.fromTo(answer,
              { height: 0, autoAlpha: 0 },
              { height: "auto", autoAlpha: 1, duration: 0.4, ease: "power2.out" }
            );
            if (chevron) gsap.to(chevron, { rotation: 180, duration: 0.35 });
          } else {
            item.classList.remove('active');
            gsap.to(answer, {
              height: 0,
              autoAlpha: 0,
              duration: 0.35,
              ease: "power2.out",
              onComplete: () => { answer.style.display = 'none'; }
            });
            if (chevron) gsap.to(chevron, { rotation: 0, duration: 0.35 });
          }
        });
      }
    });

    // Button custom bounce feedback
    if (typeof CustomBounce !== 'undefined') {
      document.querySelectorAll('.btn-bounce').forEach(btn => {
        btn.addEventListener('mouseenter', () => {
          gsap.to(btn, { scale: 1.04, duration: 0.35, ease: "leadBounce" });
        });
        btn.addEventListener('mouseleave', () => {
          gsap.to(btn, { scale: 1.0, duration: 0.25, ease: "power2.out" });
        });
      });
    }

    return () => {
      // Clean up all ScrollTriggers when context reverts
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  });

  // Ensure accurate recalculation after fonts and images finish loading
  window.addEventListener('load', () => {
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 150);
  });

})();
