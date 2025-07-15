// Professional Website JavaScript - Cleaned and Optimized
document.addEventListener('DOMContentLoaded', function() {
    
    // === NAVIGATION FUNCTIONALITY ===
    initializeNavigation();
    
    // === SCROLL EFFECTS ===
    initializeScrollEffects();
    
    // === ANIMATIONS ===
    initializeAnimations();
    
    // === VIDEOS ===
    initializeVideoSystem();
    
    // === ANALYTICS ===
    initializeAnalytics();
    
    // === BACK TO TOP ===
    initializeBackToTop();
    
    console.log('Professional website initialized successfully');
});

// Navigation Functions
function initializeNavigation() {
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    // Mobile menu toggle
    if (navbarToggler && navbarCollapse) {
        navbarToggler.addEventListener('click', function(e) {
            e.preventDefault();
            navbarCollapse.classList.toggle('show');
            const isExpanded = navbarCollapse.classList.contains('show');
            navbarToggler.setAttribute('aria-expanded', isExpanded);
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
                // Close mobile menu
                if (navbarCollapse?.classList.contains('show')) {
                    navbarCollapse.classList.remove('show');
                    navbarToggler?.setAttribute('aria-expanded', 'false');
                }
                
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Track navigation
                trackEvent('navigation_click', {
                    section: this.getAttribute('href').substring(1)
                });
            }
        });
    });
}

// Scroll Effects
function initializeScrollEffects() {
    const navbar = document.querySelector('.navbar');
    
    // Navbar background change on scroll
    window.addEventListener('scroll', debounce(function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }, 10));

    // Active navigation highlighting
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-link');

    function highlightActiveSection() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
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

    window.addEventListener('scroll', debounce(highlightActiveSection, 10));
}

// Animations
function initializeAnimations() {
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

    // Observe elements for animation
    const elementsToAnimate = document.querySelectorAll('.card, .experience-item, .contact-item');
    elementsToAnimate.forEach(el => observer.observe(el));
}

// Video System
function initializeVideoSystem() {
    const videoConfig = {
        1: 'dXG51nwp46U', // SOFiSTiK Installation
        2: null, // Future: SOFiSTiK tutorial
        3: null, // Future: Grasshopper tutorial
        4: null, // Future: Cable-stayed bridge analysis
        5: null, // Future: Post-tensioning design
        6: null  // Future: Karamba 3D tutorial
    };

    // Show/hide videos based on configuration
    Object.keys(videoConfig).forEach(videoId => {
        const videoElement = document.querySelector(`[data-video-id="${videoId}"]`);
        if (videoElement) {
            if (videoConfig[videoId]) {
                videoElement.classList.remove('d-none');
                updateVideoInfo(videoElement, videoId, videoConfig[videoId]);
            } else {
                videoElement.classList.add('d-none');
            }
        }
    });
}

function updateVideoInfo(videoElement, videoId, youtubeId) {
    if (videoId !== '1') { // Don't update the main video
        const iframe = videoElement.querySelector('iframe');
        if (iframe) {
            iframe.src = iframe.src.replace(`YOUR_VIDEO_ID_${videoId}`, youtubeId);
        }
    }
}

// Analytics
function initializeAnalytics() {
    // Email click tracking
    document.querySelectorAll('a[href^="mailto:"]').forEach(emailLink => {
        emailLink.addEventListener('click', function() {
            trackEvent('email_click', {
                email_address: this.href.replace('mailto:', '')
            });
        });
    });

    // External link tracking
    document.querySelectorAll('a[target="_blank"]').forEach(externalLink => {
        externalLink.addEventListener('click', function() {
            trackEvent('external_link_click', {
                link_url: this.href
            });
        });
    });

    // CV download tracking
    document.querySelectorAll('a[download]').forEach(downloadLink => {
        downloadLink.addEventListener('click', function() {
            trackEvent('cv_download', {
                file_name: this.href.split('/').pop()
            });
        });
    });

    // Scroll depth tracking
    initializeScrollTracking();
}

function initializeScrollTracking() {
    let maxScrollPercentage = 0;
    
    const trackScrollDepth = debounce(function() {
        const scrollPercentage = Math.round(
            (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
        );
        
        if (scrollPercentage > maxScrollPercentage) {
            maxScrollPercentage = scrollPercentage;
            if (maxScrollPercentage % 25 === 0) { // Track at 25%, 50%, 75%, 100%
                trackEvent('scroll_depth', {
                    percentage: maxScrollPercentage
                });
            }
        }
    }, 500);

    window.addEventListener('scroll', trackScrollDepth);
}

// Back to Top Button
function initializeBackToTop() {
    const backToTop = document.createElement('button');
    backToTop.innerHTML = '<i class="bi bi-arrow-up"></i>';
    backToTop.className = 'back-to-top';
    backToTop.setAttribute('aria-label', 'Back to top');
    document.body.appendChild(backToTop);

    // Show/hide button based on scroll position
    window.addEventListener('scroll', debounce(function() {
        backToTop.style.display = window.scrollY > 300 ? 'block' : 'none';
    }, 10));

    // Scroll to top functionality
    backToTop.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        
        trackEvent('back_to_top_click');
    });
}

// Utility Functions
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

function trackEvent(eventName, parameters = {}) {
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, parameters);
        console.log(`Analytics event tracked: ${eventName}`, parameters);
    }
}

// Public API for Video Management
window.showVideo = function(videoId, youtubeId, title, description, publishDate) {
    const videoElement = document.querySelector(`[data-video-id="${videoId}"]`);
    if (videoElement) {
        videoElement.classList.remove('d-none');
        
        // Update iframe
        const iframe = videoElement.querySelector('iframe');
        if (iframe) {
            iframe.src = `https://www.youtube.com/embed/${youtubeId}`;
        }
        
        // Update content
        if (title) {
            const titleElement = videoElement.querySelector('.card-title');
            if (titleElement) titleElement.textContent = title;
        }
        
        if (description) {
            const descElement = videoElement.querySelector('.card-text');
            if (descElement) descElement.textContent = description;
        }
        
        // Update status
        const statusElement = videoElement.querySelector('.text-muted');
        if (statusElement && statusElement.textContent === 'Coming Soon') {
            statusElement.textContent = publishDate ? 
                `Published: ${publishDate}` : 
                `Published: ${new Date().toLocaleDateString()}`;
        }
        
        console.log(`Video ${videoId} is now visible with YouTube ID: ${youtubeId}`);
    }
};

window.hideVideo = function(videoId) {
    const videoElement = document.querySelector(`[data-video-id="${videoId}"]`);
    if (videoElement) {
        videoElement.classList.add('d-none');
        console.log(`Video ${videoId} is now hidden`);
    }
};
