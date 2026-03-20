/* ============================================
   AJ VITANZA — Interactions, Animations & Glitch
   ============================================ */

(function () {
    'use strict';

    // ---- Scroll Progress Bar ----
    const scrollProgress = document.getElementById('scrollProgress');

    function updateScrollProgress() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        scrollProgress.style.width = progress + '%';
    }

    // ---- Navigation scroll state ----
    const nav = document.getElementById('nav');

    function updateNav() {
        if (window.scrollY > 80) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    }

    // ---- Hero Parallax (multi-layer) ----
    const heroBgImg = document.getElementById('heroBgImg');
    const heroTitle = document.getElementById('heroTitle');
    const heroContent = document.querySelector('.hero-content');
    const heroTagline = document.querySelector('.hero-tagline');
    const heroCta = document.querySelector('.hero-cta');

    function updateParallax() {
        var scrollTop = window.scrollY;
        var heroHeight = window.innerHeight;

        if (scrollTop <= heroHeight) {
            // Background parallax
            if (heroBgImg) {
                var offset = scrollTop * 0.3;
                heroBgImg.style.transform = 'scale(1.1) translate3d(0, ' + offset + 'px, 0)';
            }

            // Multi-layer content parallax + fade
            var fadeProgress = Math.max(0, 1 - scrollTop / (heroHeight * 0.5));

            if (heroContent) {
                heroContent.style.opacity = fadeProgress;
            }
            if (heroTitle) {
                heroTitle.style.transform = 'translate3d(0, ' + (scrollTop * 0.1) + 'px, 0)';
            }
            if (heroTagline) {
                heroTagline.style.transform = 'translate3d(0, ' + (scrollTop * 0.15) + 'px, 0)';
            }
            if (heroCta) {
                heroCta.style.transform = 'translate3d(0, ' + (scrollTop * 0.2) + 'px, 0)';
            }
        }
    }

    // ---- Fade scroll indicator on scroll ----
    var scrollIndicator = document.getElementById('scrollIndicator');

    function updateScrollIndicator() {
        if (!scrollIndicator) return;
        var opacity = Math.max(0, 1 - window.scrollY / 300);
        scrollIndicator.style.opacity = opacity;
    }

    // ---- Unified scroll handler (throttled via rAF) ----
    var ticking = false;

    function onScroll() {
        if (!ticking) {
            requestAnimationFrame(function () {
                updateScrollProgress();
                updateNav();
                updateParallax();
                updateScrollIndicator();
                ticking = false;
            });
            ticking = true;
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });

    // ---- Scroll Reveal (Intersection Observer) ----
    var revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-scale');

    if ('IntersectionObserver' in window) {
        var revealObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    revealObserver.unobserve(entry.target);

                    // Glitch flash on section labels
                    if (entry.target.classList.contains('section-label')) {
                        entry.target.classList.add('glitch-flash');
                    }
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -40px 0px'
        });

        revealElements.forEach(function (el) {
            revealObserver.observe(el);
        });
    } else {
        revealElements.forEach(function (el) {
            el.classList.add('revealed');
        });
    }

    var isMobile = window.matchMedia('(max-width: 768px)').matches;

    // ---- Word-by-Word Press Quote Reveal ----
    var pressQuote = document.querySelector('.press-quote');

    if (pressQuote) {
        // Get the raw HTML, preserve quote marks
        var quoteHTML = pressQuote.innerHTML;
        // Split text nodes into words while keeping HTML tags
        var tempDiv = document.createElement('div');
        tempDiv.innerHTML = quoteHTML;

        var newHTML = '';
        function processNode(node) {
            if (node.nodeType === 3) {
                // Text node — wrap each word
                var words = node.textContent.split(/(\s+)/);
                words.forEach(function (word) {
                    if (word.trim().length > 0) {
                        newHTML += '<span class="word">' + word + '</span>';
                    } else {
                        newHTML += word;
                    }
                });
            } else if (node.nodeType === 1) {
                // Element node — preserve tag
                newHTML += node.outerHTML;
            }
        }

        tempDiv.childNodes.forEach(processNode);
        pressQuote.innerHTML = newHTML;

        // Observe the quote for reveal
        if ('IntersectionObserver' in window) {
            var quoteObserver = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        var words = pressQuote.querySelectorAll('.word');
                        words.forEach(function (word, index) {
                            setTimeout(function () {
                                word.classList.add('revealed');
                            }, index * 60);
                        });
                        quoteObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.3 });

            quoteObserver.observe(pressQuote);
        }
    }

    // ---- Delayed Glitch Activation on Hero Title ----
    if (heroTitle) {
        setTimeout(function () {
            heroTitle.classList.add('glitch-active');
        }, 1500);
    }

    // ---- Smooth scroll for nav links ----
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
        link.addEventListener('click', function (e) {
            var targetId = this.getAttribute('href');
            if (targetId === '#') return;
            var target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                var navHeight = nav.offsetHeight;
                var targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ---- Cursor Glow on Hero ----
    var hero = document.querySelector('.hero');

    if (hero && !isMobile) {
        var glowEl = document.createElement('div');
        glowEl.style.cssText = 'position:absolute;inset:0;z-index:1;pointer-events:none;transition:opacity 0.3s;opacity:0;';
        hero.appendChild(glowEl);

        hero.addEventListener('mouseenter', function () {
            glowEl.style.opacity = '1';
        });
        hero.addEventListener('mouseleave', function () {
            glowEl.style.opacity = '0';
        });
        hero.addEventListener('mousemove', function (e) {
            var rect = hero.getBoundingClientRect();
            var x = e.clientX - rect.left;
            var y = e.clientY - rect.top;
            glowEl.style.background = 'radial-gradient(circle 300px at ' + x + 'px ' + y + 'px, rgba(139,26,26,0.12), transparent 70%)';
        });
    }

    // Videos are now hardcoded as thumbnail cards in HTML (no iframe embed issues)

    // ---- Initialize on load ----
    updateScrollProgress();
    updateNav();

})();
