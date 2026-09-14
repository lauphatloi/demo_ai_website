/**
 * HONDA LEAD LANDING PAGE - CORE LIGHTWEIGHT ENGINE
 * Optimized for Mobile Speed & Middle-Aged Audience Ergonomics
 */

(function () {
  'use strict';

  // --- 1. ACCESSIBILITY CONTROLS (Font Size & High Contrast) ---
  const htmlEl = document.documentElement;
  const btnFontNormal = document.getElementById('btn-font-normal');
  const btnFontLarge = document.getElementById('btn-font-large');
  const btnFontXLarge = document.getElementById('btn-font-xlarge');

  function setFontSize(size) {
    if (size === 'xlarge') {
      htmlEl.setAttribute('data-font-size', 'xlarge');
      localStorage.setItem('lead_font_size', 'xlarge');
    } else if (size === 'large') {
      htmlEl.setAttribute('data-font-size', 'large');
      localStorage.setItem('lead_font_size', 'large');
    } else {
      htmlEl.removeAttribute('data-font-size');
      localStorage.removeItem('lead_font_size');
    }
    updateFontButtons(size);
  }

  function updateFontButtons(size) {
    if (btnFontNormal) btnFontNormal.classList.toggle('active', size === 'normal' || !size);
    if (btnFontLarge) btnFontLarge.classList.toggle('active', size === 'large');
    if (btnFontXLarge) btnFontXLarge.classList.toggle('active', size === 'xlarge');
  }

  // Restore saved preference
  const savedFontSize = localStorage.getItem('lead_font_size');
  if (savedFontSize) {
    setFontSize(savedFontSize);
  }

  if (btnFontNormal) btnFontNormal.addEventListener('click', () => setFontSize('normal'));
  if (btnFontLarge) btnFontLarge.addEventListener('click', () => setFontSize('large'));
  if (btnFontXLarge) btnFontXLarge.addEventListener('click', () => setFontSize('xlarge'));

  // --- 2. MOBILE NAVIGATION DRAWER ---
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileNavOverlay = document.getElementById('mobile-nav-overlay');
  const mobileDrawerClose = document.getElementById('mobile-drawer-close');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-item a');

  function openMobileNav() {
    if (mobileNavOverlay) mobileNavOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileNav() {
    if (mobileNavOverlay) mobileNavOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', openMobileNav);
  if (mobileDrawerClose) mobileDrawerClose.addEventListener('click', closeMobileNav);
  if (mobileNavOverlay) {
    mobileNavOverlay.addEventListener('click', function (e) {
      if (e.target === mobileNavOverlay) closeMobileNav();
    });
  }
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', closeMobileNav);
  });

  // --- 3. HEADER SCROLL & BACK TO TOP ---
  const siteHeader = document.querySelector('.site-header');
  const backToTop = document.getElementById('back-to-top');

  window.addEventListener('scroll', function () {
    const scrollY = window.scrollY || window.pageYOffset;
    if (siteHeader) {
      siteHeader.classList.toggle('scrolled', scrollY > 40);
    }
    if (backToTop) {
      backToTop.classList.toggle('visible', scrollY > 500);
    }
  }, { passive: true });

  if (backToTop) {
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --- 4. COLOR & VERSION SELECTOR DATA & LOGIC ---
  const vehicleData = {
    'dac-biet': {
      name: 'Phiên bản Đặc biệt',
      badgeClass: 'badge-special',
      badgeText: 'Trang bị phanh ABS cao cấp',
      price: 45644727,
      priceFormatted: '45.644.727 VNĐ',
      vatNote: '(Đã bao gồm VAT 8% • Giá đề xuất từ Honda Việt Nam)',
      features: ['Phanh ABS bánh trước an toàn', 'Cốp 37L có đèn & tấm chia ngăn', 'Động cơ eSP+ 4 van 125cc', 'Cổng sạc Type-C & Hộc đồ sâu'],
      colors: [
        {
          id: 'bac-den',
          name: 'Bạc Đen (Màu mới sang trọng)',
          hex: '#94a3b8',
          image: 'assets/images/phien-ban-dac-biet-xam-den.avif',
          alt: 'Honda Lead 2026 Phiên bản Đặc biệt Bạc Đen'
        },
        {
          id: 'den-nau',
          name: 'Đen Nâu (Bí ẩn & Quý phái)',
          hex: '#451a03',
          image: 'assets/images/phien-ban-dac-biet-den-nau.avif',
          alt: 'Honda Lead 2026 Phiên bản Đặc biệt Đen Nâu'
        },
        {
          id: 'xanh-den',
          name: 'Xanh Đen (Cá tính & Thời thượng)',
          hex: '#1e3a8a',
          image: 'assets/images/phien-ban-dac-biet-xanh-den.avif',
          alt: 'Honda Lead 2026 Phiên bản Đặc biệt Xanh Đen'
        }
      ]
    },
    'cao-cap': {
      name: 'Phiên bản Cao cấp',
      badgeClass: 'badge-premium',
      badgeText: 'Thiết kế Trắng Đen thanh lịch',
      price: 41717455,
      priceFormatted: '41.717.455 VNĐ',
      vatNote: '(Đã bao gồm VAT 8% • Giá đề xuất từ Honda Việt Nam)',
      features: ['Hệ thống phanh kết hợp CBS', 'Cốp 37L có đèn & tấm chia ngăn', 'Động cơ eSP+ 4 van 125cc', 'Cổng sạc Type-C & Khóa Smart Key'],
      colors: [
        {
          id: 'trang-den',
          name: 'Trắng Đen (Mới đầy nữ tính & Tinh khôi)',
          hex: '#f8fafc',
          image: 'assets/images/phien-ban-cao-cap-mau-trang-den.avif',
          alt: 'Honda Lead 2026 Phiên bản Cao cấp Trắng Đen'
        }
      ]
    },
    'tieu-chuan': {
      name: 'Phiên bản Tiêu chuẩn',
      badgeClass: 'badge-standard',
      badgeText: 'Màu Đỏ Đen May Mắn',
      price: 39557455,
      priceFormatted: '39.557.455 VNĐ',
      vatNote: '(Đã bao gồm VAT 8% • Giá đề xuất từ Honda Việt Nam)',
      features: ['Hệ thống phanh kết hợp CBS', 'Cốp cực đại >37 Lít', 'Động cơ eSP+ 4 van êm ái', 'Khóa thông minh Honda Smart Key'],
      colors: [
        {
          id: 'do-den',
          name: 'Đỏ Đen (Thanh lịch & Thời thượng)',
          hex: '#dc2626',
          image: 'assets/images/phien-ban-tieu-chuan-do-den.avif',
          alt: 'Honda Lead 2026 Phiên bản Tiêu chuẩn Đỏ Đen'
        }
      ]
    }
  };

  let currentVersionKey = 'dac-biet';
  let currentColorIndex = 0;

  const versionTabs = document.querySelectorAll('.version-tab');
  const colorImg = document.getElementById('selected-vehicle-img');
  const colorBadge = document.getElementById('color-badge');
  const colorTitle = document.getElementById('color-version-title');
  const colorPrice = document.getElementById('color-price-val');
  const colorPriceNote = document.getElementById('color-price-note');
  const colorSwatchesContainer = document.getElementById('color-swatches-container');
  const colorSpecsContainer = document.getElementById('color-specs-mini');
  const btnSelectThisColor = document.getElementById('btn-select-this-color');

  function renderColorSection(versionKey, colorIdx = 0) {
    const version = vehicleData[versionKey];
    if (!version) return;

    currentVersionKey = versionKey;
    currentColorIndex = colorIdx;
    const activeColor = version.colors[colorIdx] || version.colors[0];

    // Update active tab
    versionTabs.forEach(tab => {
      tab.classList.toggle('active', tab.dataset.version === versionKey);
    });

    // Update badge & title
    if (colorBadge) {
      colorBadge.className = 'color-badge-tag ' + version.badgeClass;
      colorBadge.textContent = version.badgeText;
    }
    if (colorTitle) {
      colorTitle.textContent = `${version.name} - ${activeColor.name}`;
    }
    if (colorPrice) {
      colorPrice.textContent = version.priceFormatted;
    }
    if (colorPriceNote) {
      colorPriceNote.textContent = version.vatNote;
    }

    // Image change with 3D turntable transition
    if (colorImg) {
      if (typeof gsap !== 'undefined' && window.innerWidth >= 992) {
        gsap.to(colorImg, {
          rotationY: -15,
          scale: 0.94,
          opacity: 0.2,
          duration: 0.2,
          ease: "power2.in",
          onComplete: () => {
            colorImg.src = activeColor.image;
            colorImg.alt = activeColor.alt;
            gsap.fromTo(colorImg, 
              { rotationY: 15, scale: 0.94, opacity: 0.2 },
              { rotationY: 0, scale: 1, opacity: 1, duration: 0.45, ease: "power2.out" }
            );
          }
        });
      } else {
        colorImg.style.opacity = '0.3';
        setTimeout(() => {
          colorImg.src = activeColor.image;
          colorImg.alt = activeColor.alt;
          colorImg.style.opacity = '1';
        }, 150);
      }
    }

    // Render swatches
    if (colorSwatchesContainer) {
      colorSwatchesContainer.innerHTML = '';
      version.colors.forEach((col, idx) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'swatch-btn' + (idx === colorIdx ? ' active' : '');
        btn.setAttribute('aria-label', `Chọn màu ${col.name}`);
        btn.innerHTML = `
          <span class="swatch-circle" style="background-color: ${col.hex}"></span>
          <span>${col.name.split('(')[0].trim()}</span>
        `;
        btn.addEventListener('click', () => {
          renderColorSection(versionKey, idx);
        });
        colorSwatchesContainer.appendChild(btn);
      });
    }

    // Render mini specs
    if (colorSpecsContainer) {
      colorSpecsContainer.innerHTML = version.features.map(f => `
        <div class="spec-mini-item">
          <span class="spec-mini-label">Trang bị nổi bật</span>
          <span class="spec-mini-val">${f}</span>
        </div>
      `).join('');
    }

    // Update CTA text
    if (btnSelectThisColor) {
      btnSelectThisColor.textContent = `Nhận báo giá lăn bánh ${version.name}`;
    }
  }

  // Version tab listeners
  versionTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const vKey = tab.dataset.version;
      renderColorSection(vKey, 0);
    });
  });

  if (btnSelectThisColor) {
    btnSelectThisColor.addEventListener('click', () => {
      const calcSelect = document.getElementById('calc-version');
      if (calcSelect) {
        calcSelect.value = currentVersionKey;
        calculatePrice();
      }
      const calcSection = document.getElementById('gia-gop') || document.getElementById('gia-lan-banh');
      if (calcSection) {
        calcSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // Initial render of color section
  renderColorSection('dac-biet', 0);

  // --- 5. ON-THE-ROAD PRICE & LOAN CALCULATOR ---
  const calcVersionSelect = document.getElementById('calc-version');
  const calcAreaSelect = document.getElementById('calc-area');
  const calcDownPaymentSelect = document.getElementById('calc-down-payment');
  const calcTermSelect = document.getElementById('calc-term');

  const calcBasePriceEl = document.getElementById('calc-base-price');
  const calcTaxEl = document.getElementById('calc-tax');
  const calcPlateEl = document.getElementById('calc-plate');
  const calcInsuranceEl = document.getElementById('calc-insurance');
  const calcTotalEl = document.getElementById('calc-total');
  const calcLoanNoteEl = document.getElementById('calc-loan-note');

  function formatVND(num) {
    return new Intl.NumberFormat('vi-VN').format(Math.round(num)) + ' đ';
  }

  function calculatePrice() {
    if (!calcVersionSelect || !calcAreaSelect) return;

    const versionKey = calcVersionSelect.value;
    const area = calcAreaSelect.value;
    const basePrice = vehicleData[versionKey] ? vehicleData[versionKey].price : 45644727;

    // Lệ phí trước bạ
    // Khu vực 1 & 2: 5% giá niêm yết; Khu vực 3 (huyện): 2%
    let taxRate = 0.05;
    let plateFee = 4000000;

    if (area === 'kv1') {
      // Hà Nội & TP.HCM
      taxRate = 0.05;
      plateFee = basePrice > 40000000 ? 4000000 : 2000000;
    } else if (area === 'kv2') {
      // Thành phố, thị xã thuộc tỉnh
      taxRate = 0.05;
      plateFee = 800000;
    } else {
      // Huyện, xã
      taxRate = 0.02;
      plateFee = 50000;
    }

    const registrationTax = basePrice * taxRate;
    const insuranceFee = 66000; // Bảo hiểm trách nhiệm dân sự bắt buộc
    const totalOnTheRoad = basePrice + registrationTax + plateFee + insuranceFee;

    // Render results
    if (calcBasePriceEl) calcBasePriceEl.textContent = formatVND(basePrice);
    if (calcTaxEl) calcTaxEl.textContent = formatVND(registrationTax);
    if (calcPlateEl) calcPlateEl.textContent = formatVND(plateFee);
    if (calcInsuranceEl) calcInsuranceEl.textContent = formatVND(insuranceFee);
    if (typeof window.animatePriceCounter === 'function') {
      window.animatePriceCounter(totalOnTheRoad);
    } else {
      if (calcTotalEl) calcTotalEl.textContent = formatVND(totalOnTheRoad);
    }

    // Trả góp
    if (calcDownPaymentSelect && calcTermSelect && calcLoanNoteEl) {
      const downPercent = parseFloat(calcDownPaymentSelect.value) / 100;
      const termMonths = parseInt(calcTermSelect.value, 10);
      const downAmount = basePrice * downPercent;
      const loanAmount = basePrice - downAmount;

      // Giả định lãi suất tham khảo ~ 0.99% / tháng theo dư nợ ban đầu
      const monthlyInterest = loanAmount * 0.0099;
      const monthlyPrincipal = loanAmount / termMonths;
      const monthlyPayment = monthlyPrincipal + monthlyInterest;

      calcLoanNoteEl.innerHTML = `
        <strong>Ước tính mua trả góp lãi suất ưu đãi:</strong><br>
        • Trả trước ${(downPercent * 100)}%: <strong>${formatVND(downAmount)}</strong><br>
        • Vay lại: <strong>${formatVND(loanAmount)}</strong> trong <strong>${termMonths} tháng</strong><br>
        • Góp mỗi tháng khoảng: <strong style="color:#ff2a4b; font-size:1.15em; font-family:var(--font-mono);">${formatVND(monthlyPayment)} / tháng</strong><br>
        <span style="font-size: 0.88em; color: #94a3b8;">(Hỗ trợ chỉ cần CCCD gắn chip, duyệt hồ sơ 15 phút, không cần chứng minh thu nhập)</span>
      `;
    }
  }

  if (calcVersionSelect) calcVersionSelect.addEventListener('change', calculatePrice);
  if (calcAreaSelect) calcAreaSelect.addEventListener('change', calculatePrice);
  if (calcDownPaymentSelect) calcDownPaymentSelect.addEventListener('change', calculatePrice);
  if (calcTermSelect) calcTermSelect.addEventListener('change', calculatePrice);

  // Initial calculation
  calculatePrice();

  // --- 6. FAQ ACCORDION ---
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (questionBtn) {
      questionBtn.addEventListener('click', () => {
        // On desktop, GSAP desktop-scrollytelling handles smooth height & chevron animation
        if (window.innerWidth >= 992 && typeof gsap !== 'undefined') {
          return;
        }
        const isOpen = item.classList.contains('active');
        // Close all others for senior clarity
        faqItems.forEach(other => other.classList.remove('active'));
        if (!isOpen) {
          item.classList.add('active');
        }
      });
    }
  });

  // --- 7. CONSULTATION / TEST RIDE FORM & MODAL ---
  const testRideForm = document.getElementById('test-ride-form');
  const successModal = document.getElementById('success-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');

  if (testRideForm) {
    testRideForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const nameInput = document.getElementById('lead-name');
      const phoneInput = document.getElementById('lead-phone');

      if (!nameInput.value.trim() || !phoneInput.value.trim()) {
        alert('Quý khách vui lòng điền đầy đủ Họ tên và Số điện thoại để nhân viên HEAD hỗ trợ.');
        return;
      }

      // Show success modal
      const modalCustomerName = document.getElementById('modal-customer-name');
      if (modalCustomerName) {
        modalCustomerName.textContent = nameInput.value.trim();
      }
      if (successModal) {
        successModal.classList.add('open');
      }
      testRideForm.reset();
    });
  }

  if (modalCloseBtn && successModal) {
    modalCloseBtn.addEventListener('click', () => {
      successModal.classList.remove('open');
    });
  }

  if (successModal) {
    successModal.addEventListener('click', (e) => {
      if (e.target === successModal) successModal.classList.remove('open');
    });
  }

  // --- 8. SMOOTH SCROLLING FOR IN-PAGE ANCHORS ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          const headerOffset = 80;
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  });

  // --- 9. ULTRA-LIGHT INTERSECTION OBSERVER (For Mobile 60-120fps entry) ---
  if ('IntersectionObserver' in window) {
    const fadeObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    document.querySelectorAll('.feature-card, .highlight-card, .faq-item, .gallery-item').forEach(el => {
      fadeObserver.observe(el);
    });
  }

})();
