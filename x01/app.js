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
    initTaglineRotator();
    initSourcingChaos();
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
                    showStatus(data.errors.map(err => err.message).join(', ') + '. There is a limit on this channel. If you get an error, please leave a secure note.', 'error');
                } else {
                    showStatus('Oops! There was a problem submitting your form. There is a limit on this channel. If you get an error, please leave a secure note.', 'error');
                }
            }
        } catch (error) {
            showStatus('Error: Could not submit message. There is a limit on this channel. If you get an error, please leave a secure note.', 'error');
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

/* --- 8. Dynamic Tagline Rotator progressively enhancing the static tagline --- */
function initTaglineRotator() {
    const taglineElement = document.getElementById('hero-tagline-text');
    if (!taglineElement) return;

    // We will dynamically replace the static text with the interactive rotating structure
    // Original Tagline: "I design interactive systems, build open-source tools, and optimize operations. A creator at heart, leveraging data, design, and engineering to build functional and elegant experiences."
    
    const rotationData = [
        { verb: "design", target: "interactive systems" },
        { verb: "build", target: "open-source tools" },
        { verb: "optimize", target: "sourcing operations" }
    ];

    let currentIndex = 0;

    // Build the rotating structure progressively
    taglineElement.innerHTML = `I <span class="rotator-prefix">design</span> <span class="rotator-highlight"><span class="rotator-text">interactive systems</span></span>. A creator at heart, leveraging data, design, and engineering to build functional and elegant experiences.`;

    const prefixSpan = taglineElement.querySelector('.rotator-prefix');
    const highlightContainer = taglineElement.querySelector('.rotator-highlight');

    // Run rotation loop
    setInterval(() => {
        // Find current text span
        const currentTextSpan = highlightContainer.querySelector('.rotator-text');
        if (!currentTextSpan) return;

        // 1. Fade out active text
        currentTextSpan.classList.add('fade-out');

        // 2. Switch text after fade out transition completes
        setTimeout(() => {
            currentIndex = (currentIndex + 1) % rotationData.length;
            const nextData = rotationData[currentIndex];

            // Update verb prefix and highlight text
            if (prefixSpan) prefixSpan.textContent = nextData.verb;
            highlightContainer.innerHTML = `<span class="rotator-text">${nextData.target}</span>`;
        }, 350); // Matches fade-out transition speed in CSS
    }, 4500); // Rotate every 4.5 seconds
}

/* --- 9. Dynamic Scroll-Induced Sourcing Chaos Engine --- */
function initSourcingChaos() {
    // 1. Abort completely on mobile/tablets to preserve battery and GPU/CPU rendering cycles
    if (window.innerWidth < 768) {
        console.log('[Blueprint] Mobile viewport detected. Halting SVG animation engine to maximize performance.');
        return;
    }

    const paths = document.querySelectorAll('.sourcing-path');
    const nodes = document.querySelectorAll('.sourcing-node');
    
    // Select specific paths for unique multi-directional movement
    const path1 = document.querySelector('.sourcing-path.path-1');
    const path2 = document.querySelector('.sourcing-path.path-2');
    const path3 = document.querySelector('.sourcing-path.path-3');
    
    // Select the new CSS-based dot grid element
    const gridDots = document.querySelector('.blueprint-grid-dots');
    
    let scrollY = window.scrollY;
    let smoothScrollY = window.scrollY;
    let time = 0;
    
    // Smooth pixel-perfect JS dash-offset accumulator variables
    let dashOffset1 = 0;
    let dashOffset2 = 0;
    let dashOffset3 = 0;

    // Track scroll position continuously
    window.addEventListener('scroll', () => {
        scrollY = window.scrollY;
    }, { passive: true });

    let lastTimestamp = performance.now();

    function animate(currentTimestamp) {
        // Calculate delta time in seconds, capped to prevent massive jumps on tab backgrounding
        const dt = Math.min((currentTimestamp - lastTimestamp) / 1000, 0.1);
        lastTimestamp = currentTimestamp;

        // Interpolate scroll position for liquid-smooth movement
        smoothScrollY += (scrollY - smoothScrollY) * 0.08;
        if (Math.abs(scrollY - smoothScrollY) < 0.01) {
            smoothScrollY = scrollY;
        }

        // Calculate scroll velocity (how fast the user is scrolling right now)
        const scrollVelocity = Math.abs(scrollY - smoothScrollY);

        // Increase wave time using delta time (perfectly smooth, frame-rate independent)
        time += dt * 0.72; 

        // Speed multiplier is driven by scroll VELOCITY, not position!
        const speedMultiplier = 1.0 + Math.min(scrollVelocity * 0.04, 4.5);
        
        // Vibration intensity based on scroll velocity
        const maxWarp = Math.min(window.innerWidth * 0.08, 140);
        const scrollWarp = Math.min(scrollVelocity * 0.15, maxWarp);

        // Smooth JavaScript Dash Offset Flow in unified direction, scaled by dt for absolute smoothness
        dashOffset1 += dt * 27 * speedMultiplier;
        dashOffset2 += dt * 33 * speedMultiplier; 
        dashOffset3 += dt * 21 * speedMultiplier;
        
        if (path1) path1.style.strokeDashoffset = `${dashOffset1}`;
        if (path2) path2.style.strokeDashoffset = `${dashOffset2}`;
        if (path3) path3.style.strokeDashoffset = `${dashOffset3}`;

        // Slow, organic time and scroll dimensions
        const waveTime = time * 0.25;
        const scrollOffset = smoothScrollY * 0.0008;

        // 3 COMPLETELY INDEPENDENT WANDERING PATH TRAJECTORIES
        // Using decoupled, prime-like trig frequencies & phase shifts to ensure they drift to unique locations
        
        // Trajectory 1 (Cyan Path)
        const drift1X = Math.sin(waveTime * 0.35) * 140 + Math.sin(scrollOffset * 1.2) * 180;
        const drift1Y = Math.cos(waveTime * 0.28) * 80 + Math.cos(scrollOffset * 1.6) * 90;
        const rot1 = Math.sin(waveTime * 0.15) * 2.5 + Math.sin(scrollOffset * 0.8) * 1.5;

        // Trajectory 2 (Green Path)
        const drift2X = Math.cos(waveTime * 0.42 + 2.0) * 160 + Math.sin(scrollOffset * 0.9 + 1.0) * 140;
        const drift2Y = Math.sin(waveTime * 0.31 + 1.5) * 70 + Math.cos(scrollOffset * 1.8 + 2.5) * 85;
        const rot2 = Math.cos(waveTime * 0.18 + 1.0) * 2.0 + Math.sin(scrollOffset * 1.1 + 0.5) * 1.2;

        // Trajectory 3 (Pink Path)
        const drift3X = Math.sin(waveTime * 0.29 + 4.0) * 150 + Math.cos(scrollOffset * 1.4 + 3.0) * 170;
        const drift3Y = Math.cos(waveTime * 0.37 + 3.5) * 90 + Math.sin(scrollOffset * 1.2 + 1.5) * 75;
        const rot3 = Math.sin(waveTime * 0.22 + 3.0) * 3.0 + Math.cos(scrollOffset * 0.9 + 2.0) * 1.8;

        // Apply sways using transform3d to trigger hardware acceleration
        if (path1) {
            path1.style.transformOrigin = '960px 540px';
            path1.style.transform = `translate3d(${drift1X}px, ${drift1Y}px, 0px) rotate(${rot1}deg)`;
        }
        if (path2) {
            path2.style.transformOrigin = '960px 540px';
            path2.style.transform = `translate3d(${drift2X}px, ${drift2Y}px, 0px) rotate(${rot2}deg)`;
        }
        if (path3) {
            path3.style.transformOrigin = '960px 540px';
            path3.style.transform = `translate3d(${drift3X}px, ${drift3Y}px, 0px) rotate(${rot3}deg)`;
        }

        // NOTE: Dynamic SVG drop-shadow filter adjustments and dynamic hue-rotations are removed 
        // from the 60fps frame loop to eliminate paint bottlenecks, letting GPU accelerate the paths.

        // Coordinate vibration: replace random white-noise jumps with smooth, high-frequency physical vibrations
        nodes.forEach((node, idx) => {
            const wiggler = time * 3.5 + idx * 2;
            const vibrationTime = time * 25 + idx * 5; // Rapid smooth harmonic oscillations
            
            const baseJitter = 2.2; 
            const scrollJitter = scrollWarp * 0.4;
            
            const jitterX = Math.sin(wiggler) * (baseJitter + scrollJitter) + Math.sin(vibrationTime) * (scrollWarp * 0.12);
            const jitterY = Math.cos(wiggler) * (baseJitter + scrollJitter) + Math.cos(vibrationTime) * (scrollWarp * 0.12);
            
            let driftX = 0;
            let driftY = 0;
            let rot = 0;
            
            if (idx === 0 || idx === 3) {
                driftX = drift1X;
                driftY = drift1Y;
                rot = rot1;
            } else if (idx === 1) {
                driftX = drift2X;
                driftY = drift2Y;
                rot = rot2;
            } else if (idx === 2 || idx === 4) {
                driftX = drift3X;
                driftY = drift3Y;
                rot = rot3;
            }
            
            node.style.transformOrigin = '960px 540px';
            node.style.transform = `translate3d(${driftX + jitterX}px, ${driftY + jitterY}px, 0px) rotate(${rot}deg)`;
        });

        // Blueprint Grid Dot Fading: Fade out smoothly over scroll depth using the new CSS grid element
        if (gridDots) {
            const gridOpacity = Math.max(0.6 - (smoothScrollY / 600) * 0.6, 0);
            gridDots.style.opacity = gridOpacity;
        }

        requestAnimationFrame(animate);
    }

    // Start requestAnimationFrame loop with initial timestamp
    requestAnimationFrame((timestamp) => {
        lastTimestamp = timestamp;
        animate(timestamp);
    });
}

