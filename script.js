// Loading Screen
document.addEventListener('DOMContentLoaded', function() {
  // Hide loading screen after content loads
  setTimeout(() => {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
      loadingScreen.style.opacity = '0';
      setTimeout(() => {
        loadingScreen.style.display = 'none';
      }, 500);
    }
  }, 1500);

  // Initialize animations
  initializeAnimations();
  
  // Initialize smooth scrolling
  initializeSmoothScroll();
  
  // Initialize skill bar animations
  initializeSkillBars();
  
  // Initialize project map interactions
  initializeProjectMap();
  
  // Initialize navbar scroll effect
  initializeNavbarScroll();
});

// Theme Toggle Functionality
function toggleTheme() {
  const body = document.body;
  const navbar = document.getElementById('mainNavbar');
  const footer = document.getElementById('mainFooter');
  const themeIcon = document.getElementById('themeIcon');

  body.classList.toggle('bg-dark');
  body.classList.toggle('text-light');

  // Update navbar
  if (body.classList.contains('bg-dark')) {
    navbar.classList.remove('bg-white', 'navbar-light');
    navbar.classList.add('bg-dark', 'navbar-dark');
    themeIcon.classList.remove('bi-moon');
    themeIcon.classList.add('bi-sun');
  } else {
    navbar.classList.remove('bg-dark', 'navbar-dark');
    navbar.classList.add('bg-white', 'navbar-light');
    themeIcon.classList.remove('bi-sun');
    themeIcon.classList.add('bi-moon');
  }

  // Update footer
  if (body.classList.contains('bg-dark')) {
    footer.classList.remove('bg-light');
    footer.classList.add('bg-dark', 'text-light');
  } else {
    footer.classList.remove('bg-dark', 'text-light');
    footer.classList.add('bg-light');
  }

  // Update sections with bg-light class
  const lightSections = document.querySelectorAll('.bg-light');
  lightSections.forEach(section => {
    if (body.classList.contains('bg-dark')) {
      section.classList.add('bg-dark', 'text-light');
      section.classList.remove('bg-light');
    } else {
      section.classList.remove('bg-dark', 'text-light');
      section.classList.add('bg-light');
    }
  });

  // Save theme preference
  localStorage.setItem('theme', body.classList.contains('bg-dark') ? 'dark' : 'light');
}

// Initialize theme from localStorage
function initializeTheme() {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    toggleTheme();
  }
}

// Smooth scrolling for navigation links
function initializeSmoothScroll() {
  const smoothScrollLinks = document.querySelectorAll('.smooth-scroll');
  
  smoothScrollLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      
      if (targetSection) {
        const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });

  // Back to top functionality
  const backToTopLink = document.querySelector('a[href="#"]');
  if (backToTopLink) {
    backToTopLink.addEventListener('click', function(e) {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
}

// Initialize animations on scroll
function initializeAnimations() {
  const animatedElements = document.querySelectorAll('[data-aos]');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const element = entry.target;
        const delay = element.getAttribute('data-aos-delay') || 0;
        
        setTimeout(() => {
          element.classList.add('fade-in');
        }, delay);
        
        observer.unobserve(element);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  animatedElements.forEach(el => {
    observer.observe(el);
  });
}

// Initialize skill bar animations
function initializeSkillBars() {
  const skillBars = document.querySelectorAll('.skill-fill');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const skillBar = entry.target;
        const width = skillBar.style.width;
        
        // Reset width to 0 and animate
        skillBar.style.width = '0%';
        setTimeout(() => {
          skillBar.style.width = width;
        }, 200);
        
        observer.unobserve(skillBar);
      }
    });
  }, {
    threshold: 0.5
  });

  skillBars.forEach(bar => {
    observer.observe(bar);
  });
}

// Initialize project map interactions
function initializeProjectMap() {
  const mapPoints = document.querySelectorAll('.map-point');
  
  mapPoints.forEach(point => {
    point.addEventListener('mouseenter', function() {
      this.style.transform = 'scale(1.2)';
    });
    
    point.addEventListener('mouseleave', function() {
      this.style.transform = 'scale(1)';
    });
    
    point.addEventListener('click', function() {
      const country = this.getAttribute('data-country');
      // You can add more detailed project information here
      console.log(`Clicked on ${country} project`);
    });
  });
}

// Navbar scroll effect
function initializeNavbarScroll() {
  const navbar = document.getElementById('mainNavbar');
  
  window.addEventListener('scroll', function() {
    if (window.scrollY > 100) {
      navbar.style.background = 'rgba(0, 0, 0, 0.95)';
      navbar.style.backdropFilter = 'blur(10px)';
    } else {
      navbar.style.background = '';
      navbar.style.backdropFilter = '';
    }
  });
}

// Dynamic text effects
function initializeTextEffects() {
  const gradientTexts = document.querySelectorAll('.gradient-text');
  
  gradientTexts.forEach(text => {
    text.addEventListener('mouseenter', function() {
      this.style.animationDuration = '0.5s';
    });
    
    text.addEventListener('mouseleave', function() {
      this.style.animationDuration = '3s';
    });
  });
}

// Statistics counter animation
function initializeCounters() {
  const counters = document.querySelectorAll('.stat-item strong');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = counter.textContent;
        const isNumber = !isNaN(target.replace(/[+%€M]/g, ''));
        
        if (isNumber) {
          animateCounter(counter, target);
        }
        
        observer.unobserve(counter);
      }
    });
  });

  counters.forEach(counter => {
    observer.observe(counter);
  });
}

function animateCounter(element, target) {
  const cleanTarget = target.replace(/[+%€M]/g, '');
  const numTarget = parseFloat(cleanTarget);
  const suffix = target.replace(cleanTarget, '');
  
  let current = 0;
  const increment = numTarget / 50;
  const timer = setInterval(() => {
    current += increment;
    if (current >= numTarget) {
      current = numTarget;
      clearInterval(timer);
    }
    element.textContent = Math.floor(current) + suffix;
  }, 40);
}

// Timeline animation
function initializeTimeline() {
  const timelineItems = document.querySelectorAll('.timeline-item');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, {
    threshold: 0.3
  });

  timelineItems.forEach((item, index) => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(50px)';
    item.style.transition = `all 0.6s ease ${index * 0.1}s`;
    observer.observe(item);
  });
}

// Project card interactions
function initializeProjectCards() {
  const projectCards = document.querySelectorAll('.project-card');
  
  projectCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0) scale(1)';
    });
  });
}

// Parallax effect for hero section
function initializeParallax() {
  const hero = document.querySelector('.hero');
  
  window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.5;
    
    if (hero) {
      hero.style.transform = `translateY(${rate}px)`;
    }
  });
}

// Initialize all effects when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  initializeTheme();
  initializeTextEffects();
  initializeCounters();
  initializeTimeline();
  initializeProjectCards();
  initializeParallax();
});

// Responsive navigation
function initializeResponsiveNav() {
  const navbarToggler = document.querySelector('.navbar-toggler');
  const navbarCollapse = document.querySelector('.navbar-collapse');
  
  // Close mobile menu when clicking on a link
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navbarCollapse.classList.contains('show')) {
        navbarToggler.click();
      }
    });
  });
}

// Contact form enhancement (if added later)
function initializeContactForm() {
  const contactForm = document.querySelector('#contactForm');
  
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Add form submission logic here
      const formData = new FormData(this);
      console.log('Form submitted:', Object.fromEntries(formData));
      
      // Show success message
      showNotification('Message sent successfully!', 'success');
    });
  }
}

// Notification system
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `alert alert-${type} notification`;
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 10000;
    opacity: 0;
    transform: translateX(100%);
    transition: all 0.3s ease;
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.opacity = '1';
    notification.style.transform = 'translateX(0)';
  }, 100);
  
  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
}

// Enhanced scroll spy for navigation
function initializeScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  
  window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.clientHeight;
      
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}

// Initialize all functionality
document.addEventListener('DOMContentLoaded', function() {
  initializeResponsiveNav();
  initializeContactForm();
  initializeScrollSpy();
});

// Performance optimization - debounced scroll handler
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

// Apply debouncing to scroll events
window.addEventListener('scroll', debounce(() => {
  // Scroll-dependent functions go here
}, 10));
