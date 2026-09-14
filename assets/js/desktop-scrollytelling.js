/**
 * HONDA LEAD LANDING PAGE - HIGH-END DESKTOP SCROLLYTELLING ENGINE
 * Powered by GSAP Core, ScrollTrigger, ScrollSmoother, SplitText,
 * DrawSVGPlugin, MorphSVGPlugin, InertiaPlugin, CustomEase, CustomBounce, CustomWiggle.
 *
 * Implements:
 * 1. matchMedia() for clean responsive lifecycle & prefers-reduced-motion
 * 2. Full-Page Cinematic Hero Parallax with 3D Depth
 * 3. Pinned Dual-Chamber Scrollytelling Theatre for Key Features
 * 4. Pinned Horizontal Track (ContainerAnimation) for Design Showcase
 * 5. 3D Studio Levitation & Animated Price Odometer Counter
 */

(function () {
  'use strict';

  // Ensure GSAP and plugins are loaded
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    return;
  }

  // Register all available GSAP plugins
  const registeredPlugins = [ScrollTrigger];
  if (typeof ScrollSmoother !== 'undefined') registeredPlugins.push(ScrollSmoother);
  if (typeof SplitText !== 'undefined') registeredPlugins.push(SplitText);
  if (typeof CustomEase !== 'undefined') registeredPlugins.push(CustomEase);
  if (typeof CustomBounce !== 'undefined') registeredPlugins.push(CustomBounce);
  if (typeof CustomWiggle !== 'undefined') registeredPlugins.push(CustomWiggle);
  if (typeof DrawSVGPlugin !== 'undefined') registeredPlugins.push(DrawSVGPlugin);
  if (typeof MorphSVGPlugin !== 'undefined') registeredPlugins.push(MorphSVGPlugin);
  if (typeof InertiaPlugin !== 'undefined') registeredPlugins.push(InertiaPlugin);

  gsap.registerPlugin(...registeredPlugins);

  // Set global tween defaults (as recommended in gsap-core skill)
  gsap.defaults({
    duration: 0.6,
    ease: "power2.out"
  });

  // Create custom ease curves
  if (typeof CustomEase !== 'undefined') {
    CustomEase.create("leadSmooth", "M0,0 C0.16,1 0.3,1 1,1");
    CustomEase.create("leadCinematic", "M0,0 C0.25,1 0.4,1 1,1");
  }

  if (typeof CustomBounce !== 'undefined') {
    try {
      CustomBounce.create("leadBounce", { strength: 0.55, squash: 1.5 });
    } catch (e) {
      console.warn("CustomBounce:", e);
    }
  }

  // Use gsap.matchMedia() for responsive isolation & accessibility (prefers-reduced-motion)
  let mm = gsap.matchMedia();

  mm.add({
    isDesktop: "(min-width: 992px)",
    reduceMotion: "(prefers-reduced-motion: reduce)"
  }, (context) => {
    const { isDesktop, reduceMotion } = context.conditions;

    if (!isDesktop || reduceMotion) {
      return; // Gracefully bypass on mobile or reduced-motion devices
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
    // 2. HERO CINEMATIC 3D SCROLL EFFECT
    // ========================================================================
    const heroTitle = document.querySelector('.hero-title');
    const heroBanner = document.querySelector('.hero-banner-wrap');
    const heroBannerImg = document.querySelector('.hero-banner-wrap img');

    if (heroTitle && typeof SplitText !== 'undefined') {
      const splitTitle = new SplitText(heroTitle, { type: "words,chars", wordsClass: "word", charsClass: "char" });
      gsap.from(splitTitle.chars, {
        autoAlpha: 0,
        y: 45,
        rotateX: -35,
        stagger: 0.02,
        duration: 1.2,
        ease: "leadSmooth",
        delay: 0.15
      });
    }

    if (heroBanner && heroBannerImg) {
      // 3D Perspective entry
      gsap.fromTo(heroBanner, 
        { scale: 0.94, y: 30, rotationX: 6 },
        { scale: 1, y: 0, rotationX: 0, duration: 1.4, ease: "leadSmooth", delay: 0.3 }
      );

      // Parallax & 3D tilt as user scrolls out of hero
      gsap.to(heroBannerImg, {
        scale: 1.14,
        yPercent: 16,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero-section",
          start: "top top",
          end: "bottom top",
          scrub: true
        }
      });
    }

    // Highlight pills entry stagger
    gsap.from(".highlight-card", {
      autoAlpha: 0,
      y: 40,
      stagger: 0.09,
      duration: 0.8,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".hero-highlights",
        start: "top 90%"
      }
    });

    // ========================================================================
    // 3. PINNED DUAL-CHAMBER SCROLLYTELLING THEATRE (#tien-ich)
    // ========================================================================
    const theatreSection = document.querySelector('.scrolly-theatre');
    const steps = gsap.utils.toArray('.theatre-step');
    const slides = gsap.utils.toArray('.theatre-slide');
    const progressFill = document.getElementById('theatre-progress-fill');
    const currStepEl = document.querySelector('.theatre-curr-step');

    if (theatreSection && steps.length > 0 && slides.length > 0) {
      const stepCount = steps.length;

      // Set initial states
      steps.forEach((step, idx) => {
        if (idx !== 0) {
          gsap.set(step, { autoAlpha: 0, yPercent: 40 });
        }
      });
      slides.forEach((slide, idx) => {
        if (idx !== 0) {
          gsap.set(slide, { autoAlpha: 0, scale: 1.15, rotationY: 12, z: 80 });
        }
      });

      // Master Pinned Timeline
      const theatreTl = gsap.timeline({
        scrollTrigger: {
          trigger: theatreSection,
          start: "top top",
          end: () => "+=" + (stepCount * 750),
          pin: true,
          scrub: 1.1,
          anticipatePin: 1
        }
      });

      // Cycle sequentially through steps 1 to N-1
      steps.forEach((step, i) => {
        if (i > 0) {
          const prevStep = steps[i - 1];
          const prevSlide = slides[i - 1];
          const currSlide = slides[i];
          const progressPercent = ((i + 1) / stepCount) * 100;

          theatreTl
            .addLabel('step-' + i)
            // Progress rail fill
            .to(progressFill, {
              width: progressPercent + '%',
              duration: 0.4,
              ease: "none"
            })
            // Narrative step cross-transition
            .to(prevStep, {
              autoAlpha: 0,
              yPercent: -35,
              duration: 0.5,
              ease: "power2.inOut"
            }, "<")
            .to(step, {
              autoAlpha: 1,
              yPercent: 0,
              duration: 0.5,
              ease: "power2.out"
            }, "-=0.2")
            // Update counter display
            .call(() => {
              if (currStepEl) currStepEl.textContent = '0' + (i + 1);
            })
            // 3D slide chamber depth transition
            .to(prevSlide, {
              autoAlpha: 0,
              scale: 0.86,
              rotationY: -12,
              z: -120,
              duration: 0.6,
              ease: "power2.inOut"
            }, "<")
            .to(currSlide, {
              autoAlpha: 1,
              scale: 1,
              rotationY: 0,
              z: 0,
              duration: 0.6,
              ease: "power2.out"
            }, "-=0.4");

          // Special DrawSVG and MorphSVG execution on Step 2 (ABS)
          if (i === 1) {
            const drawLines = document.querySelectorAll('.tech-draw-line');
            if (drawLines.length > 0 && typeof DrawSVGPlugin !== 'undefined') {
              theatreTl.fromTo(drawLines, 
                { drawSVG: "0%" }, 
                { drawSVG: "100%", duration: 0.6, stagger: 0.08, ease: "power2.inOut" },
                "<0.1"
              );
            }
            const morphShield = document.getElementById('morph-shield');
            const morphBadge = document.getElementById('morph-abs-badge');
            if (morphShield && morphBadge && typeof MorphSVGPlugin !== 'undefined') {
              theatreTl.to(morphShield, {
                morphSVG: morphBadge,
                duration: 0.6,
                ease: "power2.inOut"
              }, "<0.2");
            }
          }
        }
      });
    }

    // ========================================================================
    // 4. PINNED HORIZONTAL SCROLL SHOWCASE (#thiet-ke)
    // Strictly adheres to gsap-scrolltrigger containerAnimation standard
    // ========================================================================
    const horizSection = document.querySelector('.horizontal-showcase-section');
    const horizTrack = document.querySelector('.horizontal-track');

    if (horizSection && horizTrack) {
      const getScrollDistance = () => -(horizTrack.scrollWidth - window.innerWidth + 100);

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

      // Internal counter-parallax inside each horizontal card via containerAnimation!
      gsap.utils.toArray('.horiz-parallax-img').forEach((img) => {
        gsap.fromTo(img,
          { xPercent: 14 },
          {
            xPercent: -14,
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
    }

    // ========================================================================
    // 5. 3D COLOR STUDIO LEVITATION & BUTTON BOUNCE
    // ========================================================================
    const vehicleImg = document.getElementById('selected-vehicle-img');
    if (vehicleImg) {
      // Gentle idle floating motion
      gsap.to(vehicleImg, {
        y: -10,
        duration: 2.4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    }

    // Button custom bounce feedback
    if (typeof CustomBounce !== 'undefined') {
      document.querySelectorAll('.btn-bounce').forEach(btn => {
        btn.addEventListener('mouseenter', () => {
          gsap.to(btn, { scale: 1.04, duration: 0.4, ease: "leadBounce" });
        });
        btn.addEventListener('mouseleave', () => {
          gsap.to(btn, { scale: 1.0, duration: 0.25, ease: "power2.out" });
        });
      });
    }

    // ========================================================================
    // 6. ANIMATED ODOMETER COUNTER FOR PRICE CALCULATOR
    // ========================================================================
    const calcTotalEl = document.getElementById('calc-total');
    if (calcTotalEl) {
      const priceWatcher = { val: 51992963 };
      const originalCalc = window.calculatePrice;

      // Enhance calculatePrice with smooth GSAP numerical ticker
      window.animatePriceCounter = function (targetNum) {
        gsap.to(priceWatcher, {
          val: targetNum,
          duration: 0.7,
          ease: "power2.out",
          onUpdate: () => {
            calcTotalEl.textContent = new Intl.NumberFormat('vi-VN').format(Math.round(priceWatcher.val)) + ' đ';
          }
        });
      };
    }

    // ========================================================================
    // 7. INERTIA GALLERY HOVER DEPTH
    // ========================================================================
    document.querySelectorAll('.gallery-item').forEach((item, index) => {
      gsap.from(item, {
        autoAlpha: 0,
        y: 40,
        scale: 0.96,
        duration: 0.8,
        delay: index * 0.06,
        scrollTrigger: {
          trigger: item,
          start: "top 88%"
        }
      });
    });

    return () => {
      // Revert all triggers and animations created within this matchMedia context
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  });

  // Ensure ScrollTrigger refreshes accurately after all fonts & images settle
  window.addEventListener('load', () => {
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 150);
  });

})();
