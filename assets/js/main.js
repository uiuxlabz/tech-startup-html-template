/* ============================================================
   LABSKY — Main JavaScript
   ============================================================ */
(function () {
  'use strict';

  /* -----------------------------------------------------------
     1. Header scroll state
     ----------------------------------------------------------- */
  const header = document.querySelector('.header');

  function updateHeader() {
    if (!header) return;
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();

  /* -----------------------------------------------------------
     2. Burger toggle + mobile nav
     ----------------------------------------------------------- */
  const burger = document.querySelector('.burger');
  const mobileNav = document.querySelector('.mobile-nav');

  if (burger && mobileNav) {
    burger.addEventListener('click', function () {
      const isOpen = burger.classList.toggle('active');
      mobileNav.classList.toggle('active', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close mobile nav on link click
    mobileNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        burger.classList.remove('active');
        mobileNav.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  /* -----------------------------------------------------------
     3. Active nav link
     ----------------------------------------------------------- */
  function setActiveNav() {
    var currentPage = window.location.pathname.split('/').pop() || 'index.html';

    document.querySelectorAll('.nav a, .mobile-nav a').forEach(function (link) {
      var href = link.getAttribute('href');
      if (!href) return;
      var linkPage = href.split('/').pop();
      if (linkPage === currentPage) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  setActiveNav();

  /* -----------------------------------------------------------
     4. [data-year] — auto-fill current year
     ----------------------------------------------------------- */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* -----------------------------------------------------------
     5. IntersectionObserver — reveal animations
     ----------------------------------------------------------- */
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    var revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');

    if (revealElements.length > 0) {
      var revealObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add('revealed');
              revealObserver.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.1,
          rootMargin: '0px 0px -40px 0px'
        }
      );

      revealElements.forEach(function (el) {
        revealObserver.observe(el);
      });
    }
  } else {
    // Reduced motion: show everything immediately
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(function (el) {
      el.classList.add('revealed');
    });
  }

  /* -----------------------------------------------------------
     6. [data-form] — form validation + submit
     ----------------------------------------------------------- */
  document.querySelectorAll('[data-form]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var okMsg = form.querySelector('.form-ok');
      var errMsg = form.querySelector('.form-err');

      // Reset
      if (okMsg) okMsg.classList.remove('visible');
      if (errMsg) errMsg.classList.remove('visible');

      // Validate required fields
      var requiredFields = form.querySelectorAll('[required]');
      var allValid = true;

      requiredFields.forEach(function (field) {
        if (!field.value.trim()) {
          allValid = false;
          field.style.borderColor = '#EF4444';
          field.addEventListener(
            'input',
            function () {
              field.style.borderColor = '';
            },
            { once: true }
          );
        }
      });

      // Email validation
      var emailField = form.querySelector('input[type="email"]');
      if (emailField && emailField.value) {
        var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(emailField.value)) {
          allValid = false;
          emailField.style.borderColor = '#EF4444';
        }
      }

      if (allValid) {
        if (okMsg) {
          okMsg.classList.add('visible');
        }
        form.reset();
      } else {
        if (errMsg) {
          errMsg.classList.add('visible');
        }
      }
    });
  });

  /* -----------------------------------------------------------
     7. Smooth scroll for anchor links
     ----------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;
      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        var headerHeight = header ? header.offsetHeight : 0;
        var targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
        window.scrollTo({
          top: targetPosition,
          behavior: prefersReducedMotion ? 'auto' : 'smooth'
        });
      }
    });
  });

  /* -----------------------------------------------------------
     8. Pricing toggle (monthly/annual)
     ----------------------------------------------------------- */
  var pricingToggle = document.querySelector('#pricing-toggle');
  if (pricingToggle) {
    pricingToggle.addEventListener('change', function () {
      var isAnnual = this.checked;
      document.querySelectorAll('[data-monthly]').forEach(function (el) {
        el.style.display = isAnnual ? 'none' : '';
      });
      document.querySelectorAll('[data-annual]').forEach(function (el) {
        el.style.display = isAnnual ? '' : 'none';
      });
    });
  }

  /* -----------------------------------------------------------
     9. Back to top button
     ----------------------------------------------------------- */
  var backToTop = document.querySelector('.back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 500) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    }, { passive: true });

    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });
  }

  /* -----------------------------------------------------------
     10. Stats counter animation
     ----------------------------------------------------------- */
  if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    var statNumbers = document.querySelectorAll('[data-count]');

    if (statNumbers.length > 0) {
      var counterObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              var el = entry.target;
              var target = parseInt(el.getAttribute('data-count'), 10);
              var duration = 1500;
              var start = 0;
              var startTime = null;

              function animate(timestamp) {
                if (!startTime) startTime = timestamp;
                var progress = Math.min((timestamp - startTime) / duration, 1);
                var eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
                el.textContent = Math.floor(eased * target).toLocaleString();
                if (progress < 1) {
                  requestAnimationFrame(animate);
                } else {
                  el.textContent = target.toLocaleString();
                }
              }

              requestAnimationFrame(animate);
              counterObserver.unobserve(el);
            }
          });
        },
        { threshold: 0.5 }
      );

      statNumbers.forEach(function (el) {
        counterObserver.observe(el);
      });
    }
  }

  /* -----------------------------------------------------------
     11. Testimonial auto-scroll (optional)
     ----------------------------------------------------------- */
  var testimonialTrack = document.querySelector('.testimonial-track');
  if (testimonialTrack && !prefersReducedMotion) {
    var scrollSpeed = 1;
    var paused = false;

    testimonialTrack.addEventListener('mouseenter', function () {
      paused = true;
    });

    testimonialTrack.addEventListener('mouseleave', function () {
      paused = false;
    });

    function autoScrollTestimonials() {
      if (!paused && testimonialTrack) {
        if (testimonialTrack.scrollLeft >= testimonialTrack.scrollWidth - testimonialTrack.clientWidth) {
          testimonialTrack.scrollLeft = 0;
        } else {
          testimonialTrack.scrollLeft += scrollSpeed;
        }
      }
      requestAnimationFrame(autoScrollTestimonials);
    }

    autoScrollTestimonials();
  }

})();
