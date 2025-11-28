/**
 * Interactive Features Script
 * Handles mobile menu, smooth scrolling, animations, and UI interactions
 */

(function() {
    'use strict';

    /**
     * Mobile menu toggle
     */
    function initMobileMenu() {
        const mobileToggle = document.querySelector('.mobile-menu-toggle');
        const nav = document.querySelector('header nav');
        const header = document.querySelector('header');

        if (!mobileToggle || !nav) return;

        mobileToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            nav.classList.toggle('active');
            mobileToggle.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (nav.classList.contains('active') && 
                !nav.contains(e.target) && 
                !mobileToggle.contains(e.target)) {
                nav.classList.remove('active');
                mobileToggle.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        });

        // Close menu on window resize (if switching to desktop)
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768 && nav.classList.contains('active')) {
                nav.classList.remove('active');
                mobileToggle.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        });
    }

    /**
     * Smooth scrolling for anchor links
     */
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                
                // Skip empty hash or just #
                if (href === '#' || href === '') {
                    e.preventDefault();
                    return;
                }

                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    const headerOffset = 80;
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });

                    // Close mobile menu if open
                    const nav = document.querySelector('header nav');
                    if (nav && nav.classList.contains('active')) {
                        nav.classList.remove('active');
                        document.querySelector('.mobile-menu-toggle').classList.remove('active');
                        document.body.classList.remove('menu-open');
                    }
                }
            });
        });
    }

    /**
     * Scroll animations - fade in elements on scroll
     */
    function initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe elements with animation class
        document.querySelectorAll('.show-card, .info-card, .faq-item, .department-card').forEach(el => {
            el.classList.add('animate-on-scroll');
            observer.observe(el);
        });
    }

    /**
     * FAQ accordion functionality
     */
    function initFAQAccordion() {
        const faqItems = document.querySelectorAll('.faq-item');
        
        faqItems.forEach(item => {
            const question = item.querySelector('h4');
            if (!question) return;

            question.style.cursor = 'pointer';
            question.setAttribute('tabindex', '0');
            question.setAttribute('role', 'button');
            question.setAttribute('aria-expanded', 'false');

            const answer = item.querySelector('p');
            if (answer) {
                answer.style.display = 'none';
            }

            const toggleAnswer = () => {
                const isExpanded = question.getAttribute('aria-expanded') === 'true';
                question.setAttribute('aria-expanded', !isExpanded);
                
                if (answer) {
                    if (isExpanded) {
                        answer.style.display = 'none';
                        item.classList.remove('active');
                    } else {
                        answer.style.display = 'block';
                        item.classList.add('active');
                    }
                }
            };

            question.addEventListener('click', toggleAnswer);
            question.addEventListener('keypress', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleAnswer();
                }
            });
        });
    }

    /**
     * Header scroll effect - add shadow when scrolling
     */
    function initHeaderScrollEffect() {
        const header = document.querySelector('header');
        if (!header) return;

        let lastScroll = 0;
        window.addEventListener('scroll', function() {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }

            lastScroll = currentScroll;
        });
    }

    /**
     * Back to top button
     */
    function initBackToTop() {
        // Create back to top button
        const backToTop = document.createElement('button');
        backToTop.className = 'back-to-top';
        backToTop.innerHTML = '↑';
        backToTop.setAttribute('aria-label', 'Back to top');
        backToTop.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: #8B4513;
            color: white;
            border: none;
            cursor: pointer;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.3s, visibility 0.3s;
            z-index: 1000;
            font-size: 24px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.3);
        `;

        document.body.appendChild(backToTop);

        // Show/hide button based on scroll position
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTop.style.opacity = '1';
                backToTop.style.visibility = 'visible';
            } else {
                backToTop.style.opacity = '0';
                backToTop.style.visibility = 'hidden';
            }
        });

        // Scroll to top on click
        backToTop.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    /**
     * Form field focus effects
     */
    function initFormFocusEffects() {
        const formFields = document.querySelectorAll('input, textarea, select');
        
        formFields.forEach(field => {
            field.addEventListener('focus', function() {
                this.closest('.form-group')?.classList.add('focused');
            });

            field.addEventListener('blur', function() {
                if (!this.value) {
                    this.closest('.form-group')?.classList.remove('focused');
                }
            });
        });
    }

    /**
     * Initialize all interactive features
     */
    function init() {
        initMobileMenu();
        initSmoothScroll();
        initScrollAnimations();
        initFAQAccordion();
        initHeaderScrollEffect();
        initBackToTop();
        initFormFocusEffects();
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Export functions
    window.Interactive = {
        initMobileMenu,
        initSmoothScroll,
        initScrollAnimations
    };
})();

