/**
 * Dynamic Content Loading Script
 * Handles AJAX form submissions and dynamic content updates
 */

(function() {
    'use strict';

    /**
     * Handle contact form submission via AJAX
     */
    function handleContactForm() {
        const contactForm = document.querySelector('.contact-form');
        if (!contactForm) return;

        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const submitButton = contactForm.querySelector('.submit-button');
            const originalText = submitButton.textContent;
            
            // Disable button and show loading state
            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';

            // Collect form data
            const formData = new FormData(contactForm);

            // Send AJAX request
            fetch('process_contact.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Show success message
                    showMessage('success', data.message);
                    contactForm.reset();
                    
                    // Clear any error messages
                    contactForm.querySelectorAll('.error-message').forEach(err => err.remove());
                    contactForm.querySelectorAll('.error').forEach(field => field.classList.remove('error'));
                } else {
                    // Show error messages
                    if (data.errors && Array.isArray(data.errors)) {
                        showMessage('error', data.errors.join('<br>'));
                    } else {
                        showMessage('error', data.message || 'An error occurred. Please try again.');
                    }
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showMessage('error', 'Network error. Please check your connection and try again.');
            })
            .finally(() => {
                submitButton.disabled = false;
                submitButton.textContent = originalText;
            });
        });
    }

    /**
     * Handle newsletter subscription
     */
    function handleNewsletterForm() {
        const newsletterForm = document.querySelector('.newsletter-form');
        if (!newsletterForm) return;

        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const emailInput = newsletterForm.querySelector('input[type="email"]');
            const submitButton = newsletterForm.querySelector('button[type="submit"]');
            const email = emailInput.value.trim();

            if (!email) {
                showMessage('error', 'Please enter your email address');
                return;
            }

            const originalText = submitButton.textContent;
            submitButton.disabled = true;
            submitButton.textContent = 'Subscribing...';

            const formData = new FormData();
            formData.append('email', email);

            fetch('newsletter.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showMessage('success', data.message);
                    newsletterForm.reset();
                } else {
                    showMessage('error', data.message || 'Subscription failed. Please try again.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showMessage('error', 'Network error. Please try again later.');
            })
            .finally(() => {
                submitButton.disabled = false;
                submitButton.textContent = originalText;
            });
        });
    }

    /**
     * Handle booking form submission
     */
    function handleBookingForm() {
        const bookingForm = document.querySelector('.booking-form');
        if (!bookingForm) return;

        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const submitButton = bookingForm.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            
            submitButton.disabled = true;
            submitButton.textContent = 'Processing...';

            const formData = new FormData(bookingForm);

            fetch('booking.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showMessage('success', data.message);
                    if (data.booking) {
                        // Display booking summary
                        displayBookingSummary(data.booking);
                    }
                    bookingForm.reset();
                } else {
                    if (data.errors && Array.isArray(data.errors)) {
                        showMessage('error', data.errors.join('<br>'));
                    } else {
                        showMessage('error', data.message || 'Booking failed. Please try again.');
                    }
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showMessage('error', 'Network error. Please try again later.');
            })
            .finally(() => {
                submitButton.disabled = false;
                submitButton.textContent = originalText;
            });
        });
    }

    /**
     * Display booking summary
     */
    function displayBookingSummary(booking) {
        const summaryHTML = `
            <div class="booking-summary">
                <h3>Booking Summary</h3>
                <p><strong>Show:</strong> ${booking.show}</p>
                <p><strong>Date:</strong> ${booking.date}</p>
                <p><strong>Section:</strong> ${booking.section}</p>
                <p><strong>Tickets:</strong> ${booking.tickets}</p>
                <p><strong>Total Price:</strong> $${parseFloat(booking.total_price).toFixed(2)}</p>
            </div>
        `;
        
        const bookingForm = document.querySelector('.booking-form');
        if (bookingForm) {
            const existingSummary = bookingForm.querySelector('.booking-summary');
            if (existingSummary) {
                existingSummary.remove();
            }
            bookingForm.insertAdjacentHTML('afterend', summaryHTML);
        }
    }

    /**
     * Show message to user
     */
    function showMessage(type, message) {
        // Remove existing messages
        const existingMessage = document.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Create message element
        const messageDiv = document.createElement('div');
        messageDiv.className = `form-message ${type}`;
        messageDiv.innerHTML = message;

        // Insert message (try to find form first)
        const form = document.querySelector('.contact-form, .newsletter-form, .booking-form');
        if (form) {
            form.insertBefore(messageDiv, form.firstChild);
        } else {
            // Fallback: insert at top of body
            document.body.insertBefore(messageDiv, document.body.firstChild);
        }

        // Auto-remove after 5 seconds
        setTimeout(() => {
            messageDiv.style.opacity = '0';
            messageDiv.style.transition = 'opacity 0.3s';
            setTimeout(() => messageDiv.remove(), 300);
        }, 5000);
    }

    /**
     * Load shows dynamically (if needed)
     */
    function loadShows() {
        // This could fetch shows from an API endpoint
        // For now, shows are static in HTML
        console.log('Shows loaded from static HTML');
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            handleContactForm();
            handleNewsletterForm();
            handleBookingForm();
            loadShows();
        });
    } else {
        handleContactForm();
        handleNewsletterForm();
        handleBookingForm();
        loadShows();
    }

    // Export functions for use in other scripts
    window.DynamicContent = {
        showMessage,
        handleContactForm,
        handleNewsletterForm,
        handleBookingForm
    };
})();

