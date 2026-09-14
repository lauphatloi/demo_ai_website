/**
 * HONDA LEAD 2026 - HIGH-END DESKTOP SCROLLYTELLING ENGINE
 * Powered by GSAP Core, ScrollTrigger, ScrollSmoother, SplitText,
 * DrawSVGPlugin, MorphSVGPlugin, InertiaPlugin, CustomEase, CustomBounce, CustomWiggle.
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

  // Set global tween defaults
  gsap.defaults({
    duration: 0.55,
    ease: "power2.out"
  });

  // Create custom curves
  if (typeof CustomEase !== 'undefined') {
    CustomEase.create("leadSmooth", "M0,0 C0.16,1 0.3,1 1,1");
    CustomEase.create("leadCinematic", "M0,0 C0.25,1 0.4,1 1,1");
  }

  if (typeof CustomBounce !== 'undefined') {
    try {
      CustomBounce.create("leadBounce", { strength: 0.5, squash: 1.35 });
    } catch (e) {
      console.warn("CustomBounce:", e);
    }
  }

  if (typeof CustomWiggle !== 'undefined') {
    try {
      CustomWiggle.create("leadWiggle", { wiggles: 4, type: "easeOut" });
    } catch (e) {
      console.warn("CustomWiggle:", e);
    }
  }

  // Desktop matchMedia setup
  let mm = gsap.matchMedia();

  mm.add({
    isDesktop: "(min-width: 992px)",
    reduceMotion: "(prefers-reduced-motion: reduce)"
  }, (context) => {
    const { isDesktop, reduceMotion } = context.conditions;

    if (!isDesktop || reduceMotion) {
      return;
    }

    // ========================================================================
    // 1. SCROLLSMOOTHER
    // ========================================================================
    let smoother = null;
    if (typeof ScrollSmoother !== 'undefined' && document.getElementById('smooth-wrapper')) {
      smoother = ScrollSmoother.create({
        wrapper: '#smooth-wrapper',
        content: '#smooth-content',
        smooth: 1.2,
        effects: true,
        smoothTouch: false
      });
    }

    // ========================================================================
    // 2. HERO SECTION (Widescreen Parallax & SplitText)
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
        y: 28,
        rotateX: -25,
        stagger: 0.015,
        duration: 1.0,
        ease: "leadSmooth",
        delay: 0.1
      });
    }

    if (heroBannerWrap && heroBannerImg) {
      // 3D Perspective entrance
      gsap.fromTo(heroBannerWrap,
        { scale: 0.95, y: 24, rotationX: 3 },
        { scale: 1, y: 0, rotationX: 0, duration: 1.2, ease: "leadSmooth", delay: 0.2 }
      );

      // Parallax scroll tilt out of Hero
      gsap.to(heroBannerImg, {
        scale: 1.1,
        yPercent: 12,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero-section",
          start: "top top",
          end: "bottom top",
          scrub: true
        }
      });
    }

    // HUD Bar entrance
    gsap.from(".hero-hud-bar", {
      autoAlpha: 0,
      y: 20,
      duration: 0.8,
      ease: "power3.out",
      delay: 0.4
    });

    // ========================================================================
    // 3. SECTION 1: CÁC PHIÊN BẢN (3D TURNTABLE STUDIO)
    // ========================================================================
    const vehicleImg = document.getElementById('selected-vehicle-img');
    const turntable = document.querySelector('.stage-turntable') || document.querySelector('.color-stage-card');

    if (vehicleImg) {
      // Gentle floating levitation
      gsap.to(vehicleImg, {
        y: -8,
        duration: 2.2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    }

    if (turntable && vehicleImg) {
      // Interactive 3D Cursor Tilt
      turntable.addEventListener('mousemove', (e) => {
        const rect = turntable.getBoundingClientRect();
        const mouseX = (e.clientX - rect.left) / rect.width - 0.5;
        const mouseY = (e.clientY - rect.top) / rect.height - 0.5;

        gsap.to(vehicleImg, {
          rotationY: mouseX * 18,
          rotationX: -mouseY * 12,
          transformPerspective: 1000,
          duration: 0.35,
          ease: "power1.out"
        });
      });

      turntable.addEventListener('mouseleave', () => {
        gsap.to(vehicleImg, {
          rotationY: 0,
          rotationX: 0,
          duration: 0.6,
          ease: "power2.out"
        });
      });
    }

    // ========================================================================
    // 4. SECTION 2: THIẾT KẾ (PINNED HORIZONTAL SCROLL)
    // ContainerAnimation requires ease: "none"
    // ========================================================================
    const horizSection = document.querySelector('.horizontal-showcase-section');
    const horizTrack = document.querySelector('.horizontal-track');

    if (horizSection && horizTrack) {
      const getScrollDistance = () => -(horizTrack.scrollWidth - window.innerWidth + 120);

      const horizTween = gsap.to(horizTrack, {
        x: getScrollDistance,
        ease: "none", // REQUIRED for 1:1 scroll sync
        scrollTrigger: {
          trigger: horizSection,
          start: "top top",
          end: () => "+=" + Math.abs(getScrollDistance()),
          pin: true,
          scrub: 1.1,
          invalidateOnRefresh: true
        }
      });

      // Parallax translation inside horizontal cards
      gsap.utils.toArray('.horiz-parallax-img').forEach((img) => {
        gsap.fromTo(img,
          { xPercent: 10 },
          {
            xPercent: -10,
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

      // Card elevation
      gsap.utils.toArray('.horizontal-card .card-body').forEach((body) => {
        gsap.from(body, {
          autoAlpha: 0.4,
          y: 16,
          ease: "power2.out",
          scrollTrigger: {
            trigger: body.closest('.horizontal-card'),
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
    const engineSection = document.querySelector('.engine-section');
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

      techTl.from(".blueprint-card", {
        autoAlpha: 0,
        y: 40,
        stagger: 0.15,
        duration: 0.7,
        ease: "power3.out"
      });

      // Draw sensor circles with DrawSVG
      if (drawLines.length > 0 && typeof DrawSVGPlugin !== 'undefined') {
        techTl.fromTo(drawLines,
          { drawSVG: "0%" },
          { drawSVG: "100%", duration: 0.9, stagger: 0.08, ease: "power2.inOut" },
          "-=0.3"
        );
      }

      // Morph shield to circular ABS badge with MorphSVG
      if (morphShield && morphBadge && typeof MorphSVGPlugin !== 'undefined') {
        techTl.to(morphShield, {
          morphSVG: morphBadge,
          duration: 0.75,
          ease: "power2.inOut"
        }, "-=0.25");
      }
    }

    // ========================================================================
    // 6. SECTION 4: TIỆN ÍCH & GALLERY
    // ========================================================================
    gsap.from(".util-mini-card", {
      autoAlpha: 0,
      y: 30,
      stagger: 0.08,
      duration: 0.6,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ".utility-grid-container",
        start: "top 80%"
      }
    });

    gsap.utils.toArray('.gallery-card').forEach((card, idx) => {
      gsap.from(card, {
        autoAlpha: 0,
        y: 25,
        scale: 0.96,
        duration: 0.6,
        delay: (idx % 3) * 0.06,
        scrollTrigger: {
          trigger: card,
          start: "top 88%"
        }
      });
    });

    // ========================================================================
    // 7. SECTION 5: GIÁ GÓP (ANIMATED ODOMETER COUNTER)
    // ========================================================================
    const calcTotalEl = document.getElementById('calc-total');
    if (calcTotalEl) {
      const priceWatcher = { val: 51992963 };

      window.animatePriceCounter = function (targetNum) {
        gsap.to(priceWatcher, {
          val: targetNum,
          duration: 0.6,
          ease: "power2.out",
          onUpdate: () => {
            calcTotalEl.textContent = new Intl.NumberFormat('vi-VN').format(Math.round(priceWatcher.val)) + ' đ';
          }
        });

        const receiptPanel = document.querySelector('.calc-screen-panel');
        if (receiptPanel && typeof CustomWiggle !== 'undefined') {
          gsap.to(receiptPanel, { scale: 1.012, duration: 0.2, yoyo: true, repeat: 1, ease: "power1.inOut" });
        }
      };
    }

    // ========================================================================
    // 8. SECTION 6: FAQ ACCORDION (SMOOTH GSAP HEIGHT)
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
              if (otherAns) {
                gsap.to(otherAns, {
                  height: 0,
                  autoAlpha: 0,
                  duration: 0.3,
                  ease: "power2.out",
                  onComplete: () => { otherAns.style.display = 'none'; }
                });
              }
              if (otherChev) gsap.to(otherChev, { rotation: 0, duration: 0.25 });
            }
          });

          if (!isOpen) {
            item.classList.add('active');
            answer.style.display = 'block';
            gsap.fromTo(answer,
              { height: 0, autoAlpha: 0 },
              { height: "auto", autoAlpha: 1, duration: 0.35, ease: "power2.out" }
            );
            if (chevron) gsap.to(chevron, { rotation: 180, duration: 0.3 });
          } else {
            item.classList.remove('active');
            gsap.to(answer, {
              height: 0,
              autoAlpha: 0,
              duration: 0.3,
              ease: "power2.out",
              onComplete: () => { answer.style.display = 'none'; }
            });
            if (chevron) gsap.to(chevron, { rotation: 0, duration: 0.3 });
          }
        });
      }
    });

    // Custom bounce on buttons
    if (typeof CustomBounce !== 'undefined') {
      document.querySelectorAll('.btn-bounce').forEach(btn => {
        btn.addEventListener('mouseenter', () => {
          gsap.to(btn, { scale: 1.035, duration: 0.3, ease: "leadBounce" });
        });
        btn.addEventListener('mouseleave', () => {
          gsap.to(btn, { scale: 1.0, duration: 0.2, ease: "power2.out" });
        });
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  });

  // Refresh ScrollTrigger once fonts and images settle
  window.addEventListener('load', () => {
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 150);
  });

})();
