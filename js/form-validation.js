/**
 * Form Validation Script
 * Provides client-side validation for contact and booking forms
 */

(function() {
    'use strict';

    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    // Phone validation regex (flexible format)
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;

    /**
     * Validate email address
     */
    function validateEmail(email) {
        if (!email || email.trim() === '') {
            return { valid: false, message: 'Email is required' };
        }
        if (!emailRegex.test(email)) {
            return { valid: false, message: 'Please enter a valid email address' };
        }
        return { valid: true };
    }

    /**
     * Validate name
     */
    function validateName(name) {
        if (!name || name.trim() === '') {
            return { valid: false, message: 'Name is required' };
        }
        if (name.trim().length < 2) {
            return { valid: false, message: 'Name must be at least 2 characters' };
        }
        if (name.trim().length > 100) {
            return { valid: false, message: 'Name is too long' };
        }
        return { valid: true };
    }

    /**
     * Validate phone number
     */
    function validatePhone(phone) {
        if (!phone || phone.trim() === '') {
            return { valid: true }; // Phone is optional
        }
        const cleaned = phone.replace(/[\s\-\(\)]/g, '');
        if (cleaned.length < 10) {
            return { valid: false, message: 'Please enter a valid phone number' };
        }
        if (!phoneRegex.test(phone)) {
            return { valid: false, message: 'Phone number contains invalid characters' };
        }
        return { valid: true };
    }

    /**
     * Validate message/textarea
     */
    function validateMessage(message, minLength = 10) {
        if (!message || message.trim() === '') {
            return { valid: false, message: 'Message is required' };
        }
        if (message.trim().length < minLength) {
            return { valid: false, message: `Message must be at least ${minLength} characters` };
        }
        return { valid: true };
    }

    /**
     * Show error message for a field
     */
    function showError(field, message) {
        const formGroup = field.closest('.form-group');
        if (!formGroup) return;

        // Remove existing error
        const existingError = formGroup.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        // Add error class to field
        field.classList.add('error');

        // Create and show error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        formGroup.appendChild(errorDiv);
    }

    /**
     * Clear error for a field
     */
    function clearError(field) {
        const formGroup = field.closest('.form-group');
        if (!formGroup) return;

        field.classList.remove('error');
        const errorMessage = formGroup.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    }

    /**
     * Real-time validation for contact form
     */
    function setupContactFormValidation() {
        const contactForm = document.querySelector('.contact-form');
        if (!contactForm) return;

        const nameField = contactForm.querySelector('#name');
        const emailField = contactForm.querySelector('#email');
        const phoneField = contactForm.querySelector('#phone');
        const messageField = contactForm.querySelector('#message');

        // Real-time validation
        if (nameField) {
            nameField.addEventListener('blur', function() {
                const result = validateName(this.value);
                if (!result.valid) {
                    showError(this, result.message);
                } else {
                    clearError(this);
                }
            });
        }

        if (emailField) {
            emailField.addEventListener('blur', function() {
                const result = validateEmail(this.value);
                if (!result.valid) {
                    showError(this, result.message);
                } else {
                    clearError(this);
                }
            });
        }

        if (phoneField) {
            phoneField.addEventListener('blur', function() {
                const result = validatePhone(this.value);
                if (!result.valid) {
                    showError(this, result.message);
                } else {
                    clearError(this);
                }
            });
        }

        if (messageField) {
            messageField.addEventListener('blur', function() {
                const result = validateMessage(this.value);
                if (!result.valid) {
                    showError(this, result.message);
                } else {
                    clearError(this);
                }
            });
        }

        // Form submission validation
        contactForm.addEventListener('submit', function(e) {
            let isValid = true;

            // Validate all fields
            if (nameField) {
                const nameResult = validateName(nameField.value);
                if (!nameResult.valid) {
                    showError(nameField, nameResult.message);
                    isValid = false;
                }
            }

            if (emailField) {
                const emailResult = validateEmail(emailField.value);
                if (!emailResult.valid) {
                    showError(emailField, emailResult.message);
                    isValid = false;
                }
            }

            if (phoneField && phoneField.value) {
                const phoneResult = validatePhone(phoneField.value);
                if (!phoneResult.valid) {
                    showError(phoneField, phoneResult.message);
                    isValid = false;
                }
            }

            if (messageField) {
                const messageResult = validateMessage(messageField.value);
                if (!messageResult.valid) {
                    showError(messageField, messageResult.message);
                    isValid = false;
                }
            }

            if (!isValid) {
                e.preventDefault();
                return false;
            }
        });
    }

    /**
     * Validate booking form
     */
    function setupBookingFormValidation() {
        const bookingForm = document.querySelector('.booking-form');
        if (!bookingForm) return;

        bookingForm.addEventListener('submit', function(e) {
            const tickets = parseInt(bookingForm.querySelector('#tickets')?.value || 0);
            
            if (tickets < 1 || tickets > 10) {
                e.preventDefault();
                alert('Number of tickets must be between 1 and 10');
                return false;
            }
        });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            setupContactFormValidation();
            setupBookingFormValidation();
        });
    } else {
        setupContactFormValidation();
        setupBookingFormValidation();
    }

    // Export validation functions for use in other scripts
    window.FormValidation = {
        validateEmail,
        validateName,
        validatePhone,
        validateMessage,
        showError,
        clearError
    };
})();

