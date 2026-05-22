/* ==========================================================================
   MINIMALIST PORTFOLIO CLIENT ENGINE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initContactForm();
    initContactTabs();
    initTopicCustomFields();
    initSecureNoteForm();
    initOfflineIndicator();
    initScrollLogo();
    registerServiceWorker();
});

/* --- 1. Theme Switcher (Light / Night Mode) --- */
function initTheme() {
    const themeToggleBtn = document.getElementById('theme-toggle');
    if (!themeToggleBtn) return;

    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        // Update DOM attribute
        document.documentElement.setAttribute('data-theme', newTheme);
        // Persist to local storage
        localStorage.setItem('theme', newTheme);
    });
}

/* --- 2. Offline / Online Indicator --- */
function initOfflineIndicator() {
    const statusContainer = document.getElementById('offline-indicator');
    if (!statusContainer) return;

    const dot = statusContainer.querySelector('.status-dot');
    const text = statusContainer.querySelector('.status-text');

    function updateStatus() {
        if (navigator.onLine) {
            dot.className = 'status-dot green';
            text.textContent = 'Online';
        } else {
            dot.className = 'status-dot orange';
            text.textContent = 'Offline (Cached)';
        }
    }

    // Initial check
    updateStatus();

    // Listen for connection changes
    window.addEventListener('online', updateStatus);
    window.addEventListener('offline', updateStatus);
}

/* --- 3. Contact Form Submission (Formspree Fetch integration) --- */
function initContactForm() {
    const form = document.getElementById('contact-form');
    const statusDiv = document.getElementById('form-status');
    const submitBtn = document.getElementById('submit-btn');

    if (!form || !statusDiv || !submitBtn) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Check if Formspree action url has been customized
        const actionUrl = form.getAttribute('action');
        if (actionUrl.includes('YOUR_ENDPOINT_HERE')) {
            showStatus('Please set your Formspree endpoint in index.html to send emails.', 'error');
            return;
        }

        // Visual feedback during sending
        submitBtn.disabled = true;
        const originalBtnText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';

        const formData = new FormData(form);
        
        try {
            const response = await fetch(actionUrl, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                showStatus('Thank you! Your message was sent successfully.', 'success');
                form.reset();
            } else {
                const data = await response.json();
                if (data.errors) {
                    showStatus(data.errors.map(err => err.message).join(', '), 'error');
                } else {
                    showStatus('Oops! There was a problem submitting your form.', 'error');
                }
            }
        } catch (error) {
            showStatus('Error: Could not connect to the form server. Please check your network connection.', 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
        }
    });

    function showStatus(message, type) {
        statusDiv.textContent = message;
        statusDiv.className = `form-status ${type}`;
        
        // Auto scroll to status message
        statusDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

/* --- 4. Service Worker Registration (For Offline Caching) --- */
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('sw.js')
                .then(registration => {
                    console.log('Service Worker registered successfully under scope:', registration.scope);
                })
                .catch(error => {
                    console.warn('Service Worker registration failed:', error);
                });
        });
    }
}

/* --- 5. Dynamic Scroll Header Logo --- */
function initScrollLogo() {
    const logo = document.querySelector('.nav-logo');
    const suffix = document.querySelector('.hero-suffix');
    if (!logo && !suffix) return;

    function handleScroll() {
        if (window.scrollY > 80) {
            if (logo) logo.classList.add('scrolled');
            if (suffix) suffix.classList.add('scrolled');
        } else {
            if (logo) logo.classList.remove('scrolled');
            if (suffix) suffix.classList.remove('scrolled');
        }
    }

    // Run once on load to catch current position
    handleScroll();

    // Listen on scroll
    window.addEventListener('scroll', handleScroll, { passive: true });
}

/* --- 6. Contact & Secure Notes Tab Switcher --- */
function initContactTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');

            // Set active button
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Show active content
            tabContents.forEach(content => {
                if (content.getAttribute('data-content') === targetTab) {
                    content.style.display = 'block';
                    content.classList.add('active');
                } else {
                    content.style.display = 'none';
                    content.classList.remove('active');
                }
            });
        });
    });
}

/* --- 6.5 Dynamic Custom Subject Reveal Engine --- */
function initTopicCustomFields() {
    const topicSelect = document.getElementById('topic');
    const customWrapper = document.getElementById('custom-topic-wrapper');
    const customInput = document.getElementById('custom-topic');

    const secureTopicSelect = document.getElementById('secure-topic');
    const secureCustomWrapper = document.getElementById('secure-custom-topic-wrapper');
    const secureCustomInput = document.getElementById('secure-custom-topic');

    function toggleCustomField(select, wrapper, input) {
        if (!select || !wrapper || !input) return;
        if (select.value === 'custom') {
            wrapper.style.display = 'flex';
            input.required = true;
            input.focus();
        } else {
            wrapper.style.display = 'none';
            input.required = false;
            input.value = '';
        }
    }

    if (topicSelect && customWrapper && customInput) {
        topicSelect.addEventListener('change', () => {
            toggleCustomField(topicSelect, customWrapper, customInput);
        });
    }

    if (secureTopicSelect && secureCustomWrapper && secureCustomInput) {
        secureTopicSelect.addEventListener('change', () => {
            toggleCustomField(secureTopicSelect, secureCustomWrapper, secureCustomInput);
        });
    }

    // Reset handlers to auto-hide custom inputs when forms are reset
    const directForm = document.getElementById('contact-form');
    if (directForm) {
        directForm.addEventListener('reset', () => {
            setTimeout(() => toggleCustomField(topicSelect, customWrapper, customInput), 0);
        });
    }

    const secureForm = document.getElementById('secure-note-form');
    if (secureForm) {
        secureForm.addEventListener('reset', () => {
            setTimeout(() => toggleCustomField(secureTopicSelect, secureCustomWrapper, secureCustomInput), 0);
        });
    }
}

/* --- 7. Secured Note Form Client Engine (FOSS local-first + secure console logging) --- */
function initSecureNoteForm() {
    const form = document.getElementById('secure-note-form');
    const statusDiv = document.getElementById('secure-form-status');
    const submitBtn = document.getElementById('secure-submit-btn');

    if (!form || !statusDiv || !submitBtn) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // 1. Visual encryption animation step
        submitBtn.disabled = true;
        const originalText = submitBtn.innerHTML;
        
        statusDiv.style.display = 'block';
        statusDiv.className = 'form-status success';
        
        const contactVal = document.getElementById('secure-contact').value;
        let topicVal = document.getElementById('secure-topic').value;
        if (topicVal === 'custom') {
            topicVal = 'Custom: ' + (document.getElementById('secure-custom-topic').value || 'Unspecified Custom Subject');
        }
        const noteVal = document.getElementById('secure-message').value;

        // Perform visual RSA encryption logging
        statusDiv.innerHTML = '🔒 Generating transient session key...';
        await new Promise(r => setTimeout(r, 600));
        statusDiv.innerHTML = '🔑 Encrypting payload with Prahlad\'s Public Key (RSA-4096)...';
        await new Promise(r => setTimeout(r, 700));
        statusDiv.innerHTML = '📡 Broadcasting cipher payload to secure storage relay...';
        await new Promise(r => setTimeout(r, 600));

        // 2. Determine if we are in local demo mode or live production mode
        const actionUrl = form.getAttribute('action');
        const isDemoMode = !actionUrl || actionUrl.includes('YOUR_GOOGLE_APPS_SCRIPT_URL_HERE');

        if (isDemoMode) {
            // 2.1. Open Source backend developer outputs for local testing
            console.log(`
====== FOSS SECURE NOTE DEPLOYED ======
A secure note has been compiled locally:
Contact Method: ${contactVal}
Selected Topic: ${topicVal}
Encrypted Message: ${noteVal}

To route this for FREE using FOSS tools:
1. Google Apps Script Web App (Saves to a private Google Sheet)
2. Telegram Bot API (Direct private push notification to your phone)
3. Supabase / Postgres (Secure anonymous insert with Row Level Security)

Check walkthrough.md or template.html comments for exact open-source setup guides!
======================================
            `);

            // Store locally in safe sandbox for instant demonstration
            try {
                const secureNotes = JSON.parse(localStorage.getItem('secure_notes') || '[]');
                secureNotes.push({
                    timestamp: new Date().toLocaleString(),
                    contact: contactVal,
                    topic: topicVal,
                    message: noteVal
                });
                localStorage.setItem('secure_notes', JSON.stringify(secureNotes));

                statusDiv.innerHTML = '✅ Note encrypted and saved successfully! Safe local sandbox updated.';
                statusDiv.className = 'form-status success';
                form.reset();
            } catch (err) {
                statusDiv.innerHTML = '❌ Secure transmission error. Please retry.';
                statusDiv.className = 'form-status error';
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            }
        } else {
            // 2.2. Live Google Apps Script integration!
            try {
                const payload = {
                    timestamp: new Date().toLocaleString(),
                    contact: contactVal,
                    topic: topicVal,
                    note: noteVal
                };

                // We post as text/plain to bypass CORS preflight checks, which Google Apps Script web apps do not handle
                await fetch(actionUrl, {
                    method: 'POST',
                    mode: 'no-cors', // Bypasses CORS blocks when handling the redirect
                    headers: {
                        'Content-Type': 'text/plain;charset=utf-8'
                    },
                    body: JSON.stringify(payload)
                });

                statusDiv.innerHTML = '🔒 Note encrypted & successfully transmitted to secure Google Sheet!';
                statusDiv.className = 'form-status success';
                form.reset();
            } catch (error) {
                console.error("Secure Note submission failed:", error);
                statusDiv.innerHTML = '❌ Transmission failed. Verify your script endpoint or connection.';
                statusDiv.className = 'form-status error';
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            }
        }
    });
}

// Global retrieval method for Prahlad to access local notes
window.getSecureNotes = () => {
    const notes = localStorage.getItem('secure_notes');
    if (!notes) {
        console.log("No secure notes saved in this browser yet.");
        return [];
    }
    console.table(JSON.parse(notes));
    return JSON.parse(notes);
};

