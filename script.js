// Professional Website JavaScript - Dark Mode Removed
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu handling
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    if (navbarToggler && navbarCollapse) {
        navbarToggler.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Toggle the collapse
            if (navbarCollapse.classList.contains('show')) {
                navbarCollapse.classList.remove('show');
                navbarToggler.setAttribute('aria-expanded', 'false');
            } else {
                navbarCollapse.classList.add('show');
                navbarToggler.setAttribute('aria-expanded', 'true');
            }
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navbarCollapse.contains(e.target) && !navbarToggler.contains(e.target)) {
                navbarCollapse.classList.remove('show');
                navbarToggler.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                // Close mobile menu if open
                if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                    navbarCollapse.classList.remove('show');
                    if (navbarToggler) {
                        navbarToggler.setAttribute('aria-expanded', 'false');
                    }
                }
                
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Google Analytics tracking for navigation
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'navigation_click', {
                        'section': this.getAttribute('href').substring(1)
                    });
                }
            }
        });
    });

    // Navbar background change on scroll
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', debounce(function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }, 10));

    // Add active class to current section in navigation
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-link');

    function highlightNavItem() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${current}`) {
                item.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', debounce(highlightNavItem, 10));

    // Animate elements on scroll (Intersection Observer)
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe all cards and sections
    const observeElements = document.querySelectorAll('.card, .experience-item, .contact-item');
    observeElements.forEach(el => {
        observer.observe(el);
    });

    // Back to top button functionality
    const backToTop = document.createElement('button');
    backToTop.innerHTML = '<i class="bi bi-arrow-up"></i>';
    backToTop.className = 'back-to-top';
    backToTop.setAttribute('aria-label', 'Back to top');
    document.body.appendChild(backToTop);

    window.addEventListener('scroll', debounce(function() {
        if (window.scrollY > 300) {
            backToTop.style.display = 'block';
        } else {
            backToTop.style.display = 'none';
        }
    }, 10));

    backToTop.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        
        // Google Analytics tracking
        if (typeof gtag !== 'undefined') {
            gtag('event', 'back_to_top_click');
        }
    });

    // Video management system
    const videoConfig = {
        videos: {
            1: 'dXG51nwp46U', // Current video ID
            2: null, // SOFiSTiK tutorial
            3: null, // Grasshopper tutorial
            4: null, // Cable-stayed bridge analysis
            5: null, // Post-tensioning design
            6: null  // Karamba 3D tutorial
        }
    };

    // Show/hide videos based on configuration
    Object.keys(videoConfig.videos).forEach(videoId => {
        const videoElement = document.querySelector(`[data-video-id="${videoId}"]`);
        if (videoElement) {
            if (videoConfig.videos[videoId]) {
                videoElement.classList.remove('d-none');
                // Update iframe src with actual video ID
                const iframe = videoElement.querySelector('iframe');
                if (iframe && videoId !== '1') { // Don't update the main video
                    iframe.src = iframe.src.replace('YOUR_VIDEO_ID_' + videoId, videoConfig.videos[videoId]);
                }
            } else {
                videoElement.classList.add('d-none');
            }
        }
    });

    // Email click tracking
    document.querySelectorAll('a[href^="mailto:"]').forEach(emailLink => {
        emailLink.addEventListener('click', function() {
            if (typeof gtag !== 'undefined') {
                gtag('event', 'email_click', {
                    'email_address': this.href.replace('mailto:', '')
                });
            }
        });
    });

    // External link tracking
    document.querySelectorAll('a[target="_blank"]').forEach(externalLink => {
        externalLink.addEventListener('click', function() {
            if (typeof gtag !== 'undefined') {
                gtag('event', 'external_link_click', {
                    'link_url': this.href
                });
            }
        });
    });

    // CV download tracking
    document.querySelectorAll('a[download]').forEach(downloadLink => {
        downloadLink.addEventListener('click', function() {
            if (typeof gtag !== 'undefined') {
                gtag('event', 'cv_download', {
                    'file_name': this.href.split('/').pop()
                });
            }
        });
    });

    // Performance optimization: Debounce scroll events
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Initialize tooltips (if using Bootstrap tooltips)
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    const tooltipList = tooltipTriggerList.map(function(tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Console log for debugging
    console.log('Professional website initialized successfully');
});

// Functions to show/hide videos (call these when you add new videos)
function showVideo(videoId, youtubeId, title, description, publishDate) {
    const videoElement = document.querySelector(`[data-video-id="${videoId}"]`);
    if (videoElement) {
        videoElement.classList.remove('d-none');
        
        // Update iframe src
        const iframe = videoElement.querySelector('iframe');
        if (iframe) {
            iframe.src = `https://www.youtube.com/embed/${youtubeId}`;
        }
        
        // Update title if provided
        if (title) {
            const titleElement = videoElement.querySelector('.card-title');
            if (titleElement) {
                titleElement.textContent = title;
            }
        }
        
        // Update description if provided
        if (description) {
            const descElement = videoElement.querySelector('.card-text');
            if (descElement) {
                descElement.textContent = description;
            }
        }
        
        // Update publish date
        const statusElement = videoElement.querySelector('.text-muted');
        if (statusElement && statusElement.textContent === 'Coming Soon') {
            statusElement.textContent = publishDate ? `Published: ${publishDate}` : `Published: ${new Date().toLocaleDateString()}`;
        }
        
        console.log(`Video ${videoId} is now visible with YouTube ID: ${youtubeId}`);
    }
}

function hideVideo(videoId) {
    const videoElement = document.querySelector(`[data-video-id="${videoId}"]`);
    if (videoElement) {
        videoElement.classList.add('d-none');
        console.log(`Video ${videoId} is now hidden`);
    }
}

// Utility function to update all video configurations at once
function updateVideoConfig(newConfig) {
    Object.keys(newConfig).forEach(videoId => {
        if (newConfig[videoId]) {
            const { youtubeId, title, description, publishDate } = newConfig[videoId];
            showVideo(videoId, youtubeId, title, description, publishDate);
        } else {
            hideVideo(videoId);
        }
    });
}

// Google Analytics custom events
function trackCustomEvent(eventName, parameters = {}) {
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, parameters);
        console.log(`Analytics event tracked: ${eventName}`, parameters);
    }
}

// Track video interactions
function trackVideoInteraction(videoId, action) {
    trackCustomEvent('video_interaction', {
        'video_id': videoId,
        'action': action // 'play', 'pause', 'complete'
    });
}

// Track scroll depth
let maxScrollPercentage = 0;
const debounceScrollTracker = debounce(function() {
    const scrollPercentage = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
    if (scrollPercentage > maxScrollPercentage) {
        maxScrollPercentage = scrollPercentage;
        if (maxScrollPercentage % 25 === 0) { // Track at 25%, 50%, 75%, 100%
            trackCustomEvent('scroll_depth', {
                'percentage': maxScrollPercentage
            });
        }
    }
}, 500);

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

window.addEventListener('scroll', debounceScrollTracker);

// Track time on page
let timeOnPage = 0;
setInterval(() => {
    timeOnPage += 30; // Increment every 30 seconds
    if (timeOnPage % 60 === 0) { // Track every minute
        trackCustomEvent('time_on_page', {
            'seconds': timeOnPage
        });
    }
}, 30000);
