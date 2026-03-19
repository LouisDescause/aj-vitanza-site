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

    // ---- YouTube Videos (via RSS → cors proxy) ----
    var videoGrid = document.getElementById('videoGrid');
    var CHANNEL_ID = 'UCZKk2Y6Uu-bgNiOxLEwxOQw';
    var VIDEO_COUNT = 3;

    function renderVideos(videoIds, titles) {
        if (!videoGrid) return;
        videoGrid.innerHTML = '';
        videoGrid.classList.add('videos-grid-loaded');
        videoIds.forEach(function (id, i) {
            var title = (titles && titles[i]) ? titles[i] : 'Watch on YouTube';
            var card = document.createElement('a');
            card.className = 'video-card';
            card.href = 'https://www.youtube.com/watch?v=' + id;
            card.target = '_blank';
            card.rel = 'noopener';
            if (i > 0) card.style.setProperty('--delay', (i * 0.15) + 's');
            card.innerHTML =
                '<div class="video-thumb">' +
                    '<img src="https://img.youtube.com/vi/' + id + '/maxresdefault.jpg" ' +
                        'alt="' + title + '" loading="lazy" ' +
                        'onerror="this.src=\'https://img.youtube.com/vi/' + id + '/hqdefault.jpg\'">' +
                    '<div class="video-play">' +
                        '<svg viewBox="0 0 68 48" width="68" height="48"><path d="M66.52 7.74c-.78-2.93-2.49-5.41-5.42-6.19C55.79.13 34 0 34 0S12.21.13 6.9 1.55C3.97 2.33 2.27 4.81 1.48 7.74.06 13.05 0 24 0 24s.06 10.95 1.48 16.26c.78 2.93 2.49 5.41 5.42 6.19C12.21 47.87 34 48 34 48s21.79-.13 27.1-1.55c2.93-.78 4.64-3.26 5.42-6.19C67.94 34.95 68 24 68 24s-.06-10.95-1.48-16.26z" fill="rgba(255,255,255,0.9)"/><path d="M45 24L27 14v20" fill="#0a0a0a"/></svg>' +
                    '</div>' +
                '</div>' +
                '<div class="video-info">' +
                    '<span class="video-title">' + title + '</span>' +
                '</div>';
            videoGrid.appendChild(card);
        });
    }

    function loadYouTubeVideos() {
        var rssUrl = 'https://www.youtube.com/feeds/videos.xml?channel_id=' + CHANNEL_ID;
        // Use a public CORS proxy to fetch the RSS feed
        var proxyUrl = 'https://api.allorigins.win/raw?url=' + encodeURIComponent(rssUrl);

        fetch(proxyUrl)
            .then(function (res) { return res.text(); })
            .then(function (xmlText) {
                var parser = new DOMParser();
                var xml = parser.parseFromString(xmlText, 'text/xml');
                var entries = xml.querySelectorAll('entry');
                var ids = [];
                var titles = [];
                for (var i = 0; i < Math.min(VIDEO_COUNT, entries.length); i++) {
                    var videoId = entries[i].querySelector('videoId');
                    var titleEl = entries[i].querySelector('title');
                    if (videoId) {
                        ids.push(videoId.textContent);
                        titles.push(titleEl ? titleEl.textContent : 'Watch on YouTube');
                    } else {
                        var link = entries[i].querySelector('link');
                        if (link) {
                            var href = link.getAttribute('href');
                            var match = href && href.match(/v=([^&]+)/);
                            if (match) {
                                ids.push(match[1]);
                                titles.push(titleEl ? titleEl.textContent : 'Watch on YouTube');
                            }
                        }
                    }
                }
                if (ids.length > 0) {
                    renderVideos(ids, titles);
                } else {
                    fallbackVideos();
                }
            })
            .catch(function () {
                fallbackVideos();
            });
    }

    function fallbackVideos() {
        // Fallback: link to YouTube channel
        if (!videoGrid) return;
        videoGrid.classList.add('video-featured');
        videoGrid.innerHTML =
            '<a class="video-card video-card-channel" href="https://www.youtube.com/channel/' + CHANNEL_ID + '" target="_blank" rel="noopener">' +
                '<div class="video-thumb">' +
                    '<div class="video-play video-play-lg">' +
                        '<svg viewBox="0 0 68 48" width="68" height="48"><path d="M66.52 7.74c-.78-2.93-2.49-5.41-5.42-6.19C55.79.13 34 0 34 0S12.21.13 6.9 1.55C3.97 2.33 2.27 4.81 1.48 7.74.06 13.05 0 24 0 24s.06 10.95 1.48 16.26c.78 2.93 2.49 5.41 5.42 6.19C12.21 47.87 34 48 34 48s21.79-.13 27.1-1.55c2.93-.78 4.64-3.26 5.42-6.19C67.94 34.95 68 24 68 24s-.06-10.95-1.48-16.26z" fill="rgba(255,255,255,0.9)"/><path d="M45 24L27 14v20" fill="#0a0a0a"/></svg>' +
                    '</div>' +
                '</div>' +
                '<div class="video-info"><span class="video-title">Watch AJ Vitanza on YouTube</span></div>' +
            '</a>';
    }

    loadYouTubeVideos();

    // ---- Initialize on load ----
    updateScrollProgress();
    updateNav();

})();
