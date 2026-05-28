// ===== Navbar Scroll =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// ===== Mobile Menu =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// ===== Active Nav Link =====
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
    const pos = window.scrollY + 100;
    sections.forEach(section => {
        if (pos >= section.offsetTop && pos < section.offsetTop + section.offsetHeight) {
            navLinks.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            const active = navLinks.querySelector(`a[href="#${section.id}"]`);
            if (active) active.classList.add('active');
        }
    });
});

// ===== Scroll Animations =====
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add('visible'), i * 100);
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });
document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));

// ===== Counter Animation =====
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const target = parseInt(entry.target.dataset.target);
            const start = performance.now();
            function update(now) {
                const progress = Math.min((now - start) / 2000, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                entry.target.textContent = Math.round(eased * target);
                if (progress < 1) requestAnimationFrame(update);
            }
            requestAnimationFrame(update);
            counterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });
document.querySelectorAll('.stat-number[data-target]').forEach(c => counterObserver.observe(c));

// ===== Booking Modal =====
let currentStep = 1;
let selectedService = '';
let selectedPrice = 0;

function openBookingModal(service, price) {
    const modal = document.getElementById('bookingModal');
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';

    if (service) {
        selectedService = service;
        selectedPrice = price;
        const radio = document.querySelector(`input[name="service"][value="${service}"]`);
        if (radio) radio.checked = true;
    }

    // Set min date to today
    const dateInput = document.getElementById('bookingDate');
    dateInput.min = new Date().toISOString().split('T')[0];

    goToStep(1);
}

function closeBookingModal() {
    const modal = document.getElementById('bookingModal');
    modal.classList.remove('open');
    document.body.style.overflow = '';
    goToStep(1);
    // Reset form
    document.querySelectorAll('.modal input[type="radio"]').forEach(r => r.checked = false);
    document.querySelectorAll('.modal input[type="text"], .modal input[type="tel"], .modal input[type="email"], .modal input[type="date"], .modal textarea').forEach(i => i.value = '');
}

function goToStep(step) {
    currentStep = step;
    document.querySelectorAll('.modal-step').forEach(s => s.classList.remove('active'));
    document.getElementById(`step${step}`).classList.add('active');

    // Update step indicators
    document.querySelectorAll('.step-dot').forEach(dot => {
        const dotStep = parseInt(dot.dataset.step);
        dot.classList.remove('active', 'done');
        if (dotStep === step) dot.classList.add('active');
        else if (dotStep < step) dot.classList.add('done');
    });
}

function nextStep(step) {
    // Validate current step
    if (currentStep === 1) {
        const selected = document.querySelector('input[name="service"]:checked');
        if (!selected) {
            alert('Please select a service');
            return;
        }
        selectedService = selected.value;
        selectedPrice = parseInt(selected.dataset.price);
    }

    if (currentStep === 2) {
        const date = document.getElementById('bookingDate').value;
        const time = document.querySelector('input[name="time"]:checked');
        if (!date) {
            alert('Please select a date');
            return;
        }
        if (!time) {
            alert('Please select a time slot');
            return;
        }
    }

    if (currentStep === 3) {
        const name = document.getElementById('custName').value.trim();
        const phone = document.getElementById('custPhone').value.trim();
        const bike = document.getElementById('custBike').value.trim();
        if (!name || !phone || !bike) {
            alert('Please fill in all required fields');
            return;
        }
    }

    // If going to review step, populate summary
    if (step === 4) {
        populateReview();
    }

    goToStep(step);
}

function prevStep(step) {
    goToStep(step);
}

function populateReview() {
    const date = document.getElementById('bookingDate').value;
    const time = document.querySelector('input[name="time"]:checked');

    document.getElementById('reviewService').textContent = selectedService;
    document.getElementById('reviewPrice').textContent = `RM${selectedPrice}`;
    document.getElementById('reviewDate').textContent = date ? new Date(date).toLocaleDateString('en-MY', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : '-';
    document.getElementById('reviewTime').textContent = time ? formatTime(time.value) : '-';
    document.getElementById('reviewName').textContent = document.getElementById('custName').value || '-';
    document.getElementById('reviewPhone').textContent = document.getElementById('custPhone').value || '-';
    document.getElementById('reviewBike').textContent = document.getElementById('custBike').value || '-';
}

function formatTime(time24) {
    const [h, m] = time24.split(':');
    const hour = parseInt(h);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const h12 = hour > 12 ? hour - 12 : hour;
    return `${h12}:${m} ${ampm}`;
}

async function submitBooking() {
    const booking = {
        service: selectedService,
        price: selectedPrice,
        date: document.getElementById('bookingDate').value,
        time: document.querySelector('input[name="time"]:checked')?.value,
        name: document.getElementById('custName').value.trim(),
        phone: document.getElementById('custPhone').value.trim(),
        email: document.getElementById('custEmail').value.trim(),
        bike: document.getElementById('custBike').value.trim(),
        notes: document.getElementById('custNotes').value.trim(),
        createdAt: new Date().toISOString()
    };

    try {
        const res = await fetch('/api/bookings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(booking)
        });

        if (res.ok) {
            document.querySelectorAll('.modal-step').forEach(s => s.classList.remove('active'));
            document.getElementById('stepSuccess').classList.add('active');
        } else {
            alert('Something went wrong. Please try again.');
        }
    } catch (err) {
        alert('Could not connect to server. Please try again later.');
    }
}

// Close modal on overlay click
document.getElementById('bookingModal').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeBookingModal();
});

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeBookingModal();
});

// ===== Smooth Scroll =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
});
