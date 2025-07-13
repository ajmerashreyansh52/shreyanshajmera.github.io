// Professional Website JavaScript - Enhanced with Analytics and Video Management
document.addEventListener('DOMContentLoaded', function() {
    // Theme toggle functionality with system preference detection
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const body = document.body;
    
    // Check for saved theme preference or default to system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const currentTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
    
    body.setAttribute('data-theme', currentTheme);
    updateThemeIcon(currentTheme);
    
    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            const newTheme = e.matches ? 'dark' : 'light';
            body.setAttribute('data-theme', newTheme);
            updateThemeIcon(newTheme);
        }
    });
    
    themeToggle.addEventListener('click', function() {
        const currentTheme = body.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
        
        // Google Analytics tracking for theme toggle
        if (typeof gtag !== 'undefined') {
            gtag('event', 'theme_toggle', {
                'custom_map': {'theme': newTheme}
            });
        }
    });
    
    function updateThemeIcon(theme) {
        if (theme === 'dark') {
            themeIcon.className = 'bi bi-moon-fill';
        } else {
            themeIcon.className = 'bi bi-sun-fill';
        }
    }

    // Video management system
    const videoConfig = {
        // Add video IDs as you upload them. Set to null to hide the video.
        videos: {
            1: 'YOUR_CURRENT_VIDEO_ID', // Replace with your actual video ID
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

    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
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

    // Form handling (for future contact form)
    const contactForm = document.querySelector('#contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Google Analytics tracking for form submission
            if (typeof gtag !== 'undefined') {
                gtag('event', 'contact_form_submit');
            }
            
            // TODO: Add actual form submission logic
            console.log('Form submitted');
        });
    }

    // Mobile menu handling
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    if (navbarToggler) {
        navbarToggler.addEventListener('click', function() {
            navbarCollapse.classList.toggle('show');
        });
    }

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (navbarCollapse.classList.contains('show')) {
                navbarCollapse.classList.remove('show');
            }
        });
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

    // Initialize tooltips (if using Bootstrap tooltips)
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    const tooltipList = tooltipTriggerList.map(function(tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Lazy loading for images (future implementation)
    const lazyImages = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        });
    });

    lazyImages.forEach(img => {
        imageObserver.observe(img);
    });

    // Skills animation on scroll (future implementation)
    const skillBars = document.querySelectorAll('.skill-bar');
    const skillObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillBar = entry.target;
                const skillLevel = skillBar.dataset.skill;
                skillBar.style.width = skillLevel + '%';
            }
        });
    }, { threshold: 0.5 });

    skillBars.forEach(bar => {
        skillObserver.observe(bar);
    });

    // Project filter functionality (for future implementation)
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.dataset.filter;
            
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            // Filter projects
            projectCards.forEach(card => {
                if (filter === 'all' || card.dataset.category === filter) {
                    card.style.display = 'block';
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
            
            // Google Analytics tracking for project filter
            if (typeof gtag !== 'undefined') {
                gtag('event', 'project_filter', {
                    'filter_type': filter
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

    // Console log for debugging
    console.log('Professional website initialized successfully');
    console.log('Theme system preferences:', systemPrefersDark ? 'dark' : 'light');
    console.log('Current theme:', currentTheme);
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

// Example usage:
// To show video 2 (SOFiSTiK tutorial):
// showVideo(2, 'dQw4w9WgXcQ', 'Introduction to SOFiSTiK', 'Learn the basics of SOFiSTiK software', '2024-01-15');

// To update multiple videos at once:
// updateVideoConfig({
//     2: { youtubeId: 'dQw4w9WgXcQ', title: 'SOFiSTiK Basics', description: 'Learn SOFiSTiK fundamentals', publishDate: '2024-01-15' },
//     3: { youtubeId: 'abc123def45', title: 'Grasshopper Tutorial', description: 'Parametric design for engineers', publishDate: '2024-01-20' },
//     4: null // This will hide video 4
// });

// Google Analytics custom events (examples for future use)
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
window.addEventListener('scroll', debounce(function() {
    const scrollPercentage = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
    if (scrollPercentage > maxScrollPercentage) {
        maxScrollPercentage = scrollPercentage;
        if (maxScrollPercentage % 25 === 0) { // Track at 25%, 50%, 75%, 100%
            trackCustomEvent('scroll_depth', {
                'percentage': maxScrollPercentage
            });
        }
    }
}, 500));

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

/* 
TODO: Future JavaScript Features to Add

1. Contact Form Handler
function handleContactForm() {
    const form = document.getElementById('contact-form');
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            const formData = new FormData(form);
            
            try {
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    body: formData
                });
                
                if (response.ok) {
                    showNotification('Message sent successfully!', 'success');
                    form.reset();
                } else {
                    showNotification('Error sending message. Please try again.', 'error');
                }
            } catch (error) {
                showNotification('Network error. Please try again.', 'error');
            }
        });
    }
}

2. Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

3. Search Functionality
function initializeSearch() {
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');
    
    if (searchInput) {
        searchInput.addEventListener('input', debounce(function() {
            const query = this.value.toLowerCase();
            const results = searchContent(query);
            displaySearchResults(results);
        }, 300));
    }
}

4. Blog System
function loadBlogPosts() {
    fetch('/api/blog/posts')
        .then(response => response.json())
        .then(posts => {
            const blogContainer = document.getElementById('blog-posts');
            blogContainer.innerHTML = posts.map(post => createBlogPostHTML(post)).join('');
        })
        .catch(error => console.error('Error loading blog posts:', error));
}

5. Language Switcher
function initializeLanguageSwitcher() {
    const languageButtons = document.querySelectorAll('.language-btn');
    languageButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const lang = this.dataset.lang;
            switchLanguage(lang);
        });
    });
}

6. Dark Mode Auto-Detection Enhancement
function enhancedDarkModeDetection() {
    // Detect user's location and time zone for automatic dark mode
    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(function(position) {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            
            // Calculate sunrise/sunset times and auto-switch theme
            getSunriseSunset(lat, lng).then(times => {
                scheduleThemeChanges(times);
            });
        });
    }
}

7. Progressive Web App Features
function initializePWA() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => console.log('SW registered'))
            .catch(error => console.log('SW registration failed'));
    }
    
    // Add to home screen prompt
    let deferredPrompt;
    window.addEventListener('beforeinstallprompt', (e) => {
        deferredPrompt = e;
        showInstallButton();
    });
}

8. Performance Monitoring
function initializePerformanceMonitoring() {
    // Monitor Core Web Vitals
    if ('web-vital' in window) {
        getCLS(trackCustomEvent);
        getFID(trackCustomEvent);
        getLCP(trackCustomEvent);
    }
}

9. Accessibility Enhancements
function enhanceAccessibility() {
    // Keyboard navigation enhancement
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });
    
    document.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-navigation');
    });
    
    // High contrast mode detection
    if (window.matchMedia('(prefers-contrast: high)').matches) {
        document.body.classList.add('high-contrast');
    }
}

10. Advanced Analytics
function initializeAdvancedAnalytics() {
    // Track user interactions more granularly
    document.addEventListener('click', function(e) {
        const element = e.target;
        if (element.tagName === 'BUTTON' || element.tagName === 'A') {
            trackCustomEvent('element_click', {
                'element_type': element.tagName,
                'element_text': element.textContent.trim(),
                'element_class': element.className
            });
        }
    });
}
*/
