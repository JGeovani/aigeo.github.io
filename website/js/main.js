// Mobile menu toggle
document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            const isOpen = !mobileMenu.classList.contains('hidden');
            mobileMenu.classList.toggle('hidden');
            mobileMenuBtn.setAttribute('aria-expanded', String(!isOpen));
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
                mobileMenuBtn.focus();
            }
        });
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (!href || href === '#') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                // Close mobile menu if open
                if (mobileMenu) mobileMenu.classList.add('hidden');
            }
        });
    });

    // Contact form handling — simplified: open wa.me with prefilled text
    const contactForm = document.getElementById('contact-form');
    const formMessage = document.getElementById('form-message');
    if (contactForm && formMessage) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(contactForm);
            const name = (formData.get('name') || '').toString().trim();
            const message = (formData.get('message') || '').toString().trim();

            if (!name || !message) {
                formMessage.className = 'text-center p-4 rounded-lg bg-red-600/20 text-red-400 border border-red-600/20';
                formMessage.textContent = 'Please provide your name and a message.';
                formMessage.classList.remove('hidden');
                setTimeout(() => formMessage.classList.add('hidden'), 4000);
                return;
            }

            const text = `Name: ${name}\n\n${message}`;
            const waUrl = `https://wa.me/5585989045569?text=${encodeURIComponent(text)}`;

            // UI feedback
            formMessage.className = 'text-center p-4 rounded-lg bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20';
            formMessage.textContent = 'Opening WhatsApp...';
            formMessage.classList.remove('hidden');

            // Open WhatsApp in new tab/window (works on desktop/mobile)
            window.open(waUrl, '_blank');
            contactForm.reset();

            setTimeout(() => formMessage.classList.add('hidden'), 4000);
        });
    }

    // Add scroll effect to navigation
    const nav = document.querySelector('nav');
    window.addEventListener('scroll', () => {
        if (!nav) return;
        if (window.scrollY > 100) nav.classList.add('bg-deep-blue/95'); else nav.classList.remove('bg-deep-blue/95');
    });

    // Intersection Observer for animations
    const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.style.animationPlayState = 'running';
        });
    }, observerOptions);
    document.querySelectorAll('.fade-in').forEach(el => { el.style.animationPlayState = 'paused'; observer.observe(el); });

    // Project modal wiring (accessible)
    const modal = document.getElementById('project-modal');
    const modalPanel = modal ? modal.querySelector('.modal-panel') : null;
    const modalCloseEls = modal ? modal.querySelectorAll('[data-close]') : [];

    let lastFocused = null;

    // Small dataset for project details (extendable)
    const PROJECTS = {
        'viabilizai': {
            title: 'ViabilizAI',
            image: 'assets/viabilizai-hero.jpg',
            alt: 'ViabilizAI program hero image',
            desc: 'A program enabling social mobility through AI sponsorship, connecting underrepresented communities with technology education and opportunities.',
            features: ['AI Education', 'Social Impact', 'Mentorship & scholarships'],
            actions: [
                { type: 'link', label: 'Learn more', href: '#projects' },
                { type: 'whatsapp', label: 'Contact via WhatsApp', number: '5585989045569' }
            ]
        }
    };

    function openModal(projectId) {
        if (!modal) return;
        lastFocused = document.activeElement;

        // populate modal
        const data = PROJECTS[projectId] || null;
        const titleEl = modal.querySelector('#modal-title');
        const descEl = modal.querySelector('#modal-desc');
        const featuresEl = modal.querySelector('#modal-features');
        const actionsEl = modal.querySelector('#modal-actions');
        const imgEl = modal.querySelector('#modal-image');

        if (data) {
            titleEl.textContent = data.title;
            descEl.textContent = data.desc;
            imgEl.src = data.image || '';
            imgEl.alt = data.alt || data.title;
            // features
            featuresEl.innerHTML = '';
            (data.features || []).forEach(f => {
                const li = document.createElement('li'); li.textContent = f; featuresEl.appendChild(li);
            });
            // actions
            actionsEl.innerHTML = '';
            (data.actions || []).forEach(a => {
                if (a.type === 'link') {
                    const el = document.createElement('a'); el.href = a.href; el.className = 'btn-outline'; el.textContent = a.label; actionsEl.appendChild(el);
                } else if (a.type === 'whatsapp') {
                    const btn = document.createElement('button'); btn.className = 'btn-primary'; btn.textContent = a.label;
                    btn.addEventListener('click', () => {
                        const wa = `https://wa.me/${a.number}?text=${encodeURIComponent('Hi, I\'m interested in ' + data.title)}`;
                        window.open(wa, '_blank');
                    });
                    actionsEl.appendChild(btn);
                }
            });
        }

        modal.classList.remove('hidden');
        // focus first focusable element in modal or panel
        const focusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        (focusable || modalPanel).focus();
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        if (!modal) return;
        modal.classList.add('hidden');
        document.body.style.overflow = '';
        if (lastFocused) lastFocused.focus();
    }

    // Open when clicking project card triggers (passes project id)
    document.querySelectorAll('[data-project]').forEach(el => {
        const pid = el.getAttribute('data-project');
        el.addEventListener('click', (e) => { e.preventDefault(); openModal(pid); });
        el.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(pid); } });
    });

    // Close via backdrop or close buttons
    modalCloseEls.forEach(btn => btn.addEventListener('click', closeModal));
    if (modal) modal.addEventListener('click', (e) => { if (e.target.classList.contains('modal-backdrop')) closeModal(); });

    // Close on Escape
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modal && !modal.classList.contains('hidden')) closeModal(); });

    // Simple focus trap inside modal
    document.addEventListener('focus', function(e) {
        if (!modal || modal.classList.contains('hidden')) return;
        if (modal && !modal.contains(e.target)) {
            e.stopPropagation();
            (modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])') || modalPanel).focus();
        }
    }, true);
});
