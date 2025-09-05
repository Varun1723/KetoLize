/**
 * Ketolize - Balance Body & Soul
 * Minimal JavaScript for essential functionality
 * Mobile menu, section navigation, form validation
 */

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

/**
 * Initialize all app functionality
 */
function initializeApp() {
    initMobileMenu();
    initSectionNavigation();
    initFormValidation();
    initModalFunctionality();
    initAnimations();
    
    // Show home section by default
    showSection('home');
    updateActiveNavLink('home');
}

/**
 * Mobile Menu Toggle Functionality
 */
function initMobileMenu() {
    const menuToggle = document.querySelector('.nav__toggle');
    const menu = document.querySelector('.nav__menu');
    const menuLinks = document.querySelectorAll('.nav__link');
    
    if (!menuToggle || !menu) return;
    
    // Toggle menu
    menuToggle.addEventListener('click', function() {
        const isActive = menu.classList.contains('active');
        
        if (isActive) {
            closeMenu();
        } else {
            openMenu();
        }
    });
    
    // Close menu when clicking on links
    menuLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!menu.contains(e.target) && !menuToggle.contains(e.target)) {
            closeMenu();
        }
    });
    
    function openMenu() {
        menu.classList.add('active');
        menuToggle.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
        
        // Animate hamburger to X
        const hamburgers = menuToggle.querySelectorAll('.hamburger');
        if (hamburgers.length >= 3) {
            hamburgers[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            hamburgers[1].style.opacity = '0';
            hamburgers[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        }
    }
    
    function closeMenu() {
        menu.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        
        // Reset hamburger
        const hamburgers = menuToggle.querySelectorAll('.hamburger');
        if (hamburgers.length >= 3) {
            hamburgers[0].style.transform = '';
            hamburgers[1].style.opacity = '1';
            hamburgers[2].style.transform = '';
        }
    }
}

/**
 * Section Navigation (Single Page App)
 */
function initSectionNavigation() {
    const navLinks = document.querySelectorAll('[data-section]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionName = this.getAttribute('data-section');
            if (sectionName) {
                showSection(sectionName);
                updateActiveNavLink(sectionName);
                updateBrowserHistory(sectionName);
            }
        });
    });
}

/**
 * Show specific section and hide others
 */
function showSection(sectionName) {
    // Get all main sections (exclude testimonials which should always show on home)
    const allSections = document.querySelectorAll('main > .section');
    const targetSection = document.getElementById(sectionName);
    const testimonialsSection = document.querySelector('.testimonials');
    
    if (!targetSection) {
        show404Modal();
        return;
    }
    
    // Hide all sections first
    allSections.forEach(section => {
        if (section.classList.contains('testimonials')) {
            // Handle testimonials separately - only show on home
            if (sectionName === 'home') {
                section.classList.remove('hidden');
            } else {
                section.classList.add('hidden');
            }
        } else {
            section.classList.add('hidden');
        }
    });
    
    // Show target section
    targetSection.classList.remove('hidden');
    
    // Scroll to top smoothly
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
    
    // Update page title
    updatePageTitle(sectionName);
    
    // Add entrance animation
    setTimeout(() => {
        addSectionAnimation(targetSection);
    }, 100);
}

/**
 * Update active navigation link
 */
function updateActiveNavLink(sectionName) {
    const navLinks = document.querySelectorAll('.nav__link');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        const linkSection = link.getAttribute('data-section');
        if (linkSection === sectionName) {
            link.classList.add('active');
        }
    });
}

/**
 * Update page title based on section
 */
function updatePageTitle(sectionName) {
    const titles = {
        'home': 'Ketolize - Balance Body & Soul',
        'about': 'About Us - Ketolize',
        'services': 'Our Services - Ketolize',
        'recipes': 'Keto Recipes - Ketolize',
        'blog': 'Blog - Ketolize',
        'contact': 'Contact Us - Ketolize',
        'booking': 'Book Consultation - Ketolize'
    };
    
    document.title = titles[sectionName] || 'Ketolize - Balance Body & Soul';
}

/**
 * Add entrance animation to section
 */
function addSectionAnimation(section) {
    if (!section) return;
    
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    
    // Trigger animation
    requestAnimationFrame(() => {
        section.style.opacity = '1';
        section.style.transform = 'translateY(0)';
    });
    
    // Clean up styles after animation
    setTimeout(() => {
        section.style.transition = '';
        section.style.opacity = '';
        section.style.transform = '';
    }, 700);
}

/**
 * Form Validation
 */
function initFormValidation() {
    const bookingForm = document.querySelector('.booking-form');
    const contactForm = document.querySelector('.contact-form');
    
    if (bookingForm) {
        initBookingFormValidation(bookingForm);
    }
    
    if (contactForm) {
        initContactFormValidation(contactForm);
    }
}

/**
 * Booking form validation
 */
function initBookingFormValidation(form) {
    const requiredFields = [
        { id: 'fullName', label: 'Full Name' },
        { id: 'email', label: 'Email Address' }
    ];
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        let isValid = true;
        
        // Clear previous errors
        clearErrors(form);
        
        // Validate required fields
        requiredFields.forEach(field => {
            const input = form.querySelector(`#${field.id}`);
            if (input) {
                const value = input.value.trim();
                
                if (!value) {
                    showError(input, `${field.label} is required`);
                    isValid = false;
                }
            }
        });
        
        // Validate email format
        const emailInput = form.querySelector('#email');
        if (emailInput) {
            const email = emailInput.value.trim();
            if (email && !isValidEmail(email)) {
                showError(emailInput, 'Please enter a valid email address');
                isValid = false;
            }
        }
        
        if (isValid) {
            handleFormSubmission(form, 'booking');
        }
    });
    
    // Real-time validation
    requiredFields.forEach(field => {
        const input = form.querySelector(`#${field.id}`);
        if (input) {
            input.addEventListener('blur', function() {
                validateField(this, field.label);
            });
            
            input.addEventListener('input', function() {
                clearFieldError(this);
            });
        }
    });
}

/**
 * Contact form validation
 */
function initContactFormValidation(form) {
    const requiredFields = [
        { id: 'contactName', label: 'Name' },
        { id: 'contactEmail', label: 'Email' },
        { id: 'message', label: 'Message' }
    ];
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        let isValid = true;
        
        // Clear previous errors
        clearErrors(form);
        
        // Validate required fields
        requiredFields.forEach(field => {
            const input = form.querySelector(`#${field.id}`);
            if (input) {
                const value = input.value.trim();
                
                if (!value) {
                    showError(input, `${field.label} is required`);
                    isValid = false;
                }
            }
        });
        
        // Validate email format
        const emailInput = form.querySelector('#contactEmail');
        if (emailInput) {
            const email = emailInput.value.trim();
            if (email && !isValidEmail(email)) {
                showError(emailInput, 'Please enter a valid email address');
                isValid = false;
            }
        }
        
        if (isValid) {
            handleFormSubmission(form, 'contact');
        }
    });
}

/**
 * Validate individual field
 */
function validateField(input, label) {
    const value = input.value.trim();
    
    if (!value) {
        showError(input, `${label} is required`);
        return false;
    }
    
    if (input.type === 'email' && !isValidEmail(value)) {
        showError(input, 'Please enter a valid email address');
        return false;
    }
    
    clearFieldError(input);
    return true;
}

/**
 * Show form field error
 */
function showError(input, message) {
    const errorElement = input.parentNode.querySelector('.error-message');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
    
    input.classList.add('error');
    input.setAttribute('aria-invalid', 'true');
    
    // Add error styling
    input.style.borderColor = 'var(--color-error)';
    input.style.boxShadow = '0 0 0 3px rgba(255, 87, 87, 0.1)';
}

/**
 * Clear field error
 */
function clearFieldError(input) {
    const errorElement = input.parentNode.querySelector('.error-message');
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
    }
    
    input.classList.remove('error');
    input.removeAttribute('aria-invalid');
    input.style.borderColor = '';
    input.style.boxShadow = '';
}

/**
 * Clear all form errors
 */
function clearErrors(form) {
    const errorElements = form.querySelectorAll('.error-message');
    const inputs = form.querySelectorAll('.form-control');
    
    errorElements.forEach(error => {
        error.textContent = '';
        error.style.display = 'none';
    });
    
    inputs.forEach(input => {
        input.classList.remove('error');
        input.removeAttribute('aria-invalid');
        input.style.borderColor = '';
        input.style.boxShadow = '';
    });
}

/**
 * Validate email format
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Handle form submission
 */
function handleFormSubmission(form, type) {
    const submitButton = form.querySelector('button[type="submit"]');
    if (!submitButton) return;
    
    const originalText = submitButton.textContent;
    
    // Show loading state
    submitButton.disabled = true;
    submitButton.textContent = 'Submitting...';
    submitButton.style.opacity = '0.7';
    
    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
        // Reset button
        submitButton.disabled = false;
        submitButton.textContent = originalText;
        submitButton.style.opacity = '1';
        
        // Show success message
        showSuccessMessage(form, type);
        
        // Reset form
        form.reset();
        
    }, 2000);
}

/**
 * Show success message
 */
function showSuccessMessage(form, type) {
    const messages = {
        'booking': 'Thank you! Your consultation request has been submitted. We\'ll contact you within 24 hours.',
        'contact': 'Thank you for your message! We\'ll get back to you as soon as possible.'
    };
    
    const message = messages[type] || 'Thank you for your submission!';
    
    // Create success message element
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.innerHTML = `
        <div style="
            background: rgba(111, 239, 224, 0.1);
            border: 1px solid var(--color-primary);
            color: var(--color-primary);
            padding: var(--spacing-md);
            border-radius: var(--radius-md);
            margin-bottom: var(--spacing-md);
            text-align: center;
            font-weight: 500;
        ">
            ${message}
        </div>
    `;
    
    // Insert at top of form
    form.insertBefore(successDiv, form.firstChild);
    
    // Remove after 5 seconds
    setTimeout(() => {
        if (successDiv.parentNode) {
            successDiv.remove();
        }
    }, 5000);
}

/**
 * Modal Functionality
 */
function initModalFunctionality() {
    const modal404 = document.getElementById('modal-404');
    
    if (modal404) {
        const closeButton = modal404.querySelector('.modal__close');
        const overlay = modal404.querySelector('.modal__overlay');
        const homeButton = modal404.querySelector('[data-section="home"]');
        
        // Close modal events
        if (closeButton) {
            closeButton.addEventListener('click', () => hide404Modal());
        }
        
        if (overlay) {
            overlay.addEventListener('click', () => hide404Modal());
        }
        
        if (homeButton) {
            homeButton.addEventListener('click', () => {
                hide404Modal();
                showSection('home');
                updateActiveNavLink('home');
            });
        }
        
        // Close on Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && !modal404.classList.contains('hidden')) {
                hide404Modal();
            }
        });
    }
}

/**
 * Show 404 modal
 */
function show404Modal() {
    const modal = document.getElementById('modal-404');
    if (modal) {
        modal.classList.remove('hidden');
        modal.setAttribute('aria-hidden', 'false');
        
        // Focus management
        const closeButton = modal.querySelector('.modal__close');
        if (closeButton) {
            closeButton.focus();
        }
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
    }
}

/**
 * Hide 404 modal
 */
function hide404Modal() {
    const modal = document.getElementById('modal-404');
    if (modal) {
        modal.classList.add('hidden');
        modal.setAttribute('aria-hidden', 'true');
        
        // Restore body scroll
        document.body.style.overflow = '';
    }
}

/**
 * Initialize scroll animations
 */
function initAnimations() {
    // Only initialize if IntersectionObserver is supported
    if ('IntersectionObserver' in window) {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'fadeInUp 0.8s ease-out forwards';
                }
            });
        }, observerOptions);
        
        // Observe cards and other elements
        const animatedElements = document.querySelectorAll(
            '.feature-card, .pricing-card, .recipe-card, .blog-card, .testimonial-card'
        );
        
        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            observer.observe(el);
        });
    }
}

/**
 * Add to browser history when section changes
 */
function updateBrowserHistory(sectionName) {
    const title = document.title;
    const url = sectionName === 'home' ? '/' : `/#${sectionName}`;
    
    if (history.pushState) {
        history.pushState({ section: sectionName }, title, url);
    }
}

/**
 * Handle browser back/forward buttons
 */
window.addEventListener('popstate', function(e) {
    const section = e.state ? e.state.section : 'home';
    showSection(section);
    updateActiveNavLink(section);
});

/**
 * Utility: Debounce function
 */
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

/**
 * Handle window resize
 */
window.addEventListener('resize', debounce(() => {
    // Close mobile menu on resize to desktop
    if (window.innerWidth > 640) {
        const menu = document.querySelector('.nav__menu');
        const toggle = document.querySelector('.nav__toggle');
        
        if (menu && menu.classList.contains('active')) {
            menu.classList.remove('active');
            if (toggle) {
                toggle.setAttribute('aria-expanded', 'false');
            }
            document.body.style.overflow = '';
            
            // Reset hamburger
            if (toggle) {
                const hamburgers = toggle.querySelectorAll('.hamburger');
                if (hamburgers.length >= 3) {
                    hamburgers[0].style.transform = '';
                    hamburgers[1].style.opacity = '1';
                    hamburgers[2].style.transform = '';
                }
            }
        }
    }
}, 250));

/**
 * Performance: Preload critical images
 */
function preloadImages() {
    const criticalImages = [
        'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=500&h=600&fit=crop'
    ];
    
    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Initialize image preloading
preloadImages();