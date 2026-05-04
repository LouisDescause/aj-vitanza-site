/* ============================================
   AJ VITANZA — Ultimate Interactions & Effects
   ============================================ */

(function () {
    'use strict';

    var isMobile = window.matchMedia('(max-width: 768px)').matches || 'ontouchstart' in window;

    // ============================================
    // Loading Screen
    // ============================================
    var loader = document.getElementById('loader');

    window.addEventListener('load', function () {
        setTimeout(function () {
            if (loader) {
                loader.classList.add('hidden');
                document.body.style.overflow = '';
            }
        }, 2000);
    });

    document.body.style.overflow = 'hidden';

    // ============================================
    // Custom Cursor (desktop only)
    // ============================================
    var cursorDot = document.getElementById('cursorDot');
    var cursorRing = document.getElementById('cursorRing');
    var mouseX = 0, mouseY = 0;
    var ringX = 0, ringY = 0;

    var prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!isMobile && !prefersReducedMotion && cursorDot && cursorRing) {
        document.body.classList.add('cursor-active');

        document.addEventListener('mousemove', function (e) {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursorDot.style.left = mouseX + 'px';
            cursorDot.style.top = mouseY + 'px';
        }, { passive: true });

        var ringRunning = true;
        function animateRing() {
            if (!ringRunning) return;
            /* Slower, silkier trail for the big soft glow */
            ringX += (mouseX - ringX) * 0.09;
            ringY += (mouseY - ringY) * 0.09;
            cursorRing.style.left = ringX + 'px';
            cursorRing.style.top = ringY + 'px';
            requestAnimationFrame(animateRing);
        }
        animateRing();
        /* Pause the cursor RAF loop when the tab is hidden — saves battery
           and keeps the main thread quiet while the user is elsewhere. */
        document.addEventListener('visibilitychange', function () {
            if (document.hidden) {
                ringRunning = false;
            } else if (!ringRunning) {
                ringRunning = true;
                animateRing();
            }
        });

        var hoverTargets = document.querySelectorAll('a, button, .btn, .dsp-btn, .video-card, .stream-link, .track-item, .nav-links a');
        hoverTargets.forEach(function (el) {
            el.addEventListener('mouseenter', function () {
                cursorDot.classList.add('hovering');
                cursorRing.classList.add('hovering');
            });
            el.addEventListener('mouseleave', function () {
                cursorDot.classList.remove('hovering');
                cursorRing.classList.remove('hovering');
            });
        });

        document.addEventListener('mousedown', function () { cursorRing.classList.add('clicking'); });
        document.addEventListener('mouseup', function () { cursorRing.classList.remove('clicking'); });

        // Magnetic effect
        var magneticEls = document.querySelectorAll('.btn, .btn-signup, .dsp-btn, .nav-logo');
        magneticEls.forEach(function (el) {
            el.addEventListener('mousemove', function (e) {
                var rect = el.getBoundingClientRect();
                var x = e.clientX - rect.left - rect.width / 2;
                var y = e.clientY - rect.top - rect.height / 2;
                el.style.transform = 'translate(' + (x * 0.15) + 'px, ' + (y * 0.15) + 'px)';
            });
            el.addEventListener('mouseleave', function () {
                el.style.transform = '';
            });
        });
    }

    // Hero particle canvas was retired — pure-CSS gradient-blob layer replaced it.
    // (Old code deleted to keep the JS bundle lean.)

    // ============================================
    // Scroll Progress Bar
    // ============================================
    var scrollProgress = document.getElementById('scrollProgress');

    function updateScrollProgress() {
        var scrollTop = window.scrollY;
        var docHeight = document.documentElement.scrollHeight - window.innerHeight;
        var progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        if (scrollProgress) scrollProgress.style.width = progress + '%';
    }

    // ============================================
    // Navigation scroll state
    // ============================================
    var nav = document.getElementById('nav');

    function updateNav() {
        if (nav) {
            if (window.scrollY > 80) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
        }
    }

    // ============================================
    // Hero Parallax
    // ============================================
    var heroBgImg = document.getElementById('heroBgImg');
    var heroTitle = document.getElementById('heroTitle');
    var heroContent = document.querySelector('.hero-content');
    var heroTagline = document.querySelector('.hero-tagline');
    var heroCta = document.querySelector('.hero-cta');

    function updateParallax() {
        var scrollTop = window.scrollY;
        var heroHeight = window.innerHeight;
        if (scrollTop <= heroHeight) {
            if (heroBgImg) {
                heroBgImg.style.transform = 'scale(1.1) translate3d(0, ' + (scrollTop * 0.3) + 'px, 0)';
            }
            var fadeProgress = Math.max(0, 1 - scrollTop / (heroHeight * 0.5));
            if (heroContent) heroContent.style.opacity = fadeProgress;
            if (heroTitle) heroTitle.style.transform = 'translate3d(0, ' + (scrollTop * 0.1) + 'px, 0)';
            if (heroTagline) heroTagline.style.transform = 'translate3d(0, ' + (scrollTop * 0.15) + 'px, 0)';
            if (heroCta) heroCta.style.transform = 'translate3d(0, ' + (scrollTop * 0.2) + 'px, 0)';
        }
    }

    // ============================================
    // Fade scroll indicator
    // ============================================
    var scrollIndicator = document.getElementById('scrollIndicator');

    function updateScrollIndicator() {
        if (!scrollIndicator) return;
        scrollIndicator.style.opacity = Math.max(0, 1 - window.scrollY / 300);
    }

    // ============================================
    // Unified scroll handler
    // ============================================
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

    // ============================================
    // Scroll Reveal
    // ============================================
    var revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-scale');

    if ('IntersectionObserver' in window) {
        var revealObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

        revealElements.forEach(function (el) { revealObserver.observe(el); });
    } else {
        revealElements.forEach(function (el) { el.classList.add('revealed'); });
    }

    // ============================================
    // Word-by-Word Press Quote Reveal
    // ============================================
    var pressQuote = document.querySelector('.press-quote');

    if (pressQuote) {
        var quoteHTML = pressQuote.innerHTML;
        var tempDiv = document.createElement('div');
        tempDiv.innerHTML = quoteHTML;
        var newHTML = '';
        function processNode(node) {
            if (node.nodeType === 3) {
                var words = node.textContent.split(/(\s+)/);
                words.forEach(function (word) {
                    if (word.trim().length > 0) {
                        newHTML += '<span class="word">' + word + '</span>';
                    } else {
                        newHTML += word;
                    }
                });
            } else if (node.nodeType === 1) {
                newHTML += node.outerHTML;
            }
        }
        tempDiv.childNodes.forEach(processNode);
        pressQuote.innerHTML = newHTML;

        if ('IntersectionObserver' in window) {
            var quoteObserver = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        var words = pressQuote.querySelectorAll('.word');
                        words.forEach(function (word, index) {
                            setTimeout(function () { word.classList.add('revealed'); }, index * 60);
                        });
                        quoteObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.3 });
            quoteObserver.observe(pressQuote);
        }
    }

    // ============================================
    // Smooth scroll for nav links
    // Lands the jump past the nav AND past any in-section fade zone so the
    // content is centered instead of buried behind the blur gradient.
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
        link.addEventListener('click', function (e) {
            var targetId = this.getAttribute('href');
            if (targetId === '#') return;
            var target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                var navHeight = nav ? nav.offsetHeight : 0;
                /* Extra offset for beige sections — their top ~30% is a painterly
                   slate→beige fade; skip past it so the scroll lands on the
                   content (cover art, title, tracklist). */
                var extraOffset = 0;
                if (target.classList.contains('beige-section')) {
                    extraOffset = Math.min(target.offsetHeight * 0.22, 260);
                }
                var targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight + extraOffset;
                window.scrollTo({ top: targetPosition, behavior: 'smooth' });
            }
        });
    });

    // ============================================
    // Cursor Glow on Hero
    // ============================================
    var hero = document.querySelector('.hero');

    if (hero && !isMobile) {
        var glowEl = document.createElement('div');
        glowEl.style.cssText = 'position:absolute;inset:0;z-index:1;pointer-events:none;transition:opacity 0.3s;opacity:0;';
        hero.appendChild(glowEl);
        hero.addEventListener('mouseenter', function () { glowEl.style.opacity = '1'; });
        hero.addEventListener('mouseleave', function () { glowEl.style.opacity = '0'; });
        hero.addEventListener('mousemove', function (e) {
            var rect = hero.getBoundingClientRect();
            var x = e.clientX - rect.left;
            var y = e.clientY - rect.top;
            glowEl.style.background = 'radial-gradient(circle 320px at ' + x + 'px ' + y + 'px, rgba(138,155,181,0.20), rgba(184,196,212,0.10) 45%, transparent 75%)';
        });
    }

    // ============================================
    // 3D Tilt on Cover Art
    // ============================================
    if (!isMobile) {
        var coverImg = document.getElementById('coverImg');
        var coverDisplay = document.querySelector('.cover-art-display');

        if (coverDisplay && coverImg) {
            coverDisplay.addEventListener('mousemove', function (e) {
                var rect = coverDisplay.getBoundingClientRect();
                var x = (e.clientX - rect.left) / rect.width;
                var y = (e.clientY - rect.top) / rect.height;
                var rotateX = (y - 0.5) * -12;
                var rotateY = (x - 0.5) * 12;
                coverImg.style.transform = 'perspective(1000px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) scale(1.02)';
            });
            coverDisplay.addEventListener('mouseleave', function () {
                coverImg.style.transform = '';
            });
        }
    }

    // ============================================
    // Horizontal Video Scroll (drag to scroll)
    // ============================================
    var videoScroll = document.getElementById('videoGrid');

    if (videoScroll && !isMobile) {
        var isDown = false;
        var startX, scrollLeft;

        videoScroll.addEventListener('mousedown', function (e) {
            isDown = true;
            startX = e.pageX - videoScroll.offsetLeft;
            scrollLeft = videoScroll.scrollLeft;
        });
        videoScroll.addEventListener('mouseleave', function () { isDown = false; });
        videoScroll.addEventListener('mouseup', function () { isDown = false; });
        videoScroll.addEventListener('mousemove', function (e) {
            if (!isDown) return;
            e.preventDefault();
            var x = e.pageX - videoScroll.offsetLeft;
            var walk = (x - startX) * 1.5;
            videoScroll.scrollLeft = scrollLeft - walk;
        });
    }

    // ============================================
    // 3D Tilt on Video Cards
    // ============================================
    if (!isMobile) {
        var videoCards = document.querySelectorAll('.video-card');
        videoCards.forEach(function (card) {
            card.addEventListener('mousemove', function (e) {
                var rect = card.getBoundingClientRect();
                var x = (e.clientX - rect.left) / rect.width;
                var y = (e.clientY - rect.top) / rect.height;
                var rotateX = (y - 0.5) * -10;
                var rotateY = (x - 0.5) * 10;
                card.style.transform = 'perspective(800px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateY(-6px)';
            });
            card.addEventListener('mouseleave', function () {
                card.style.transform = '';
            });
        });
    }

    // ============================================
    // Section Parallax on Scroll
    // ============================================
    if (!isMobile) {
        var sections = document.querySelectorAll('.ep, .music, .videos, .press, .signup');

        var sectionObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.05 });

        sections.forEach(function (section) {
            section.style.opacity = '0';
            section.style.transform = 'translateY(40px)';
            sectionObserver.observe(section);
        });
    }

    // ============================================
    // Initialize
    // ============================================
    updateScrollProgress();
    updateNav();

})();
