/* ====================================
   HausKloud Website - Main JavaScript
   ==================================== */

// Constants
const HAUSKLOUD_MONTHLY = 30000;

// Storage Category Pricing (averaged from verified sources - Jan 2026)
// See HausKloud_Pricing_Verification_Report.md for sources
const storagePricing = {
    hyperscale: {
        name: 'Hyperscale Cloud (AWS, Azure, GCP)',
        // Average: AWS $0.023, Azure $0.018, GCP $0.020 = ~$0.020/GB
        // Egress: AWS $0.09, Azure $0.087, GCP $0.12 = ~$0.10/GB avg
        storage: 0.020,
        egress: 0.10,
        hasEgress: true
    },
    zeroegress: {
        name: 'Zero-Egress Cloud (Backblaze, Wasabi, etc.)',
        // Average: Backblaze $6/TB, Wasabi $6.99/TB, Seagate $7.50/TB = ~$6.50/TB = $0.0065/GB
        storage: 0.0065,
        egress: 0,
        hasEgress: false
    },
    onprem: {
        name: 'On-Prem / Self-Managed',
        // Fully loaded: $100-$150/TB/year = ~$0.010/GB/month avg
        // Plus MAM software (CatDV, Reach Engine, iconik, etc.): ~$3-5k/month
        storage: 0.010,
        egress: 0,
        hasEgress: false,
        mamMonthly: 4000 // Average MAM software cost per month
    }
};

// ====================================
// Mini Calculator
// ====================================
function formatCurrency(num) {
    if (num >= 1000000) {
        return '$' + (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return '$' + (num / 1000).toFixed(0) + 'K';
    }
    return '$' + num.toFixed(0);
}

function calculateStorageCost(monthlyTB, category, years) {
    const monthlyGB = monthlyTB * 1000;
    const months = years * 12;
    const pricing = storagePricing[category];
    const egressRate = 0.10; // 10% monthly retrieval rate assumption

    let runningTotal = 0;

    for (let m = 1; m <= months; m++) {
        const cumulativeGB = monthlyGB * m;

        // Storage cost
        let monthlyCost = cumulativeGB * pricing.storage;

        // Add egress if applicable (hyperscale only)
        if (pricing.hasEgress) {
            const egressGB = cumulativeGB * egressRate;
            monthlyCost += egressGB * pricing.egress;
        }

        // Add MAM software cost if applicable (on-prem only)
        if (pricing.mamMonthly) {
            monthlyCost += pricing.mamMonthly;
        }

        runningTotal += monthlyCost;
    }

    return runningTotal;
}

function updateMiniCalculator() {
    const monthlyTB = parseInt(document.getElementById('calcTB').value);
    const category = document.getElementById('calcProvider').value;
    const years = parseInt(document.getElementById('calcYears').value);
    const months = years * 12;

    // Update TB display
    document.getElementById('calcTBValue').textContent = monthlyTB;

    // Calculate costs
    const currentCost = calculateStorageCost(monthlyTB, category, years);
    const hauskloudCost = HAUSKLOUD_MONTHLY * months;
    const savings = currentCost - hauskloudCost;
    const savingsPercent = currentCost > 0 ? ((savings / currentCost) * 100).toFixed(0) : 0;

    // Update display
    document.getElementById('calcCurrentCost').textContent = formatCurrency(currentCost);
    document.getElementById('calcHausKloudCost').textContent = formatCurrency(hauskloudCost);

    // Get message containers
    const savingsMessage = document.getElementById('calcSavingsMessage');
    const competitiveMessage = document.getElementById('calcCompetitiveMessage');
    const ctaSavings = document.getElementById('calcCtaSavings');
    const ctaCompetitive = document.getElementById('calcCtaCompetitive');

    if (savings > 0) {
        // HausKloud saves money - show savings messaging
        savingsMessage.style.display = 'block';
        competitiveMessage.style.display = 'none';
        ctaSavings.style.display = 'block';
        ctaCompetitive.style.display = 'none';

        document.getElementById('calcSavings').textContent = formatCurrency(savings);
        document.getElementById('calcSavingsPercent').textContent = savingsPercent + '% of your storage budget';
    } else {
        // Current setup is cheaper - show competitive messaging
        savingsMessage.style.display = 'none';
        competitiveMessage.style.display = 'block';
        ctaSavings.style.display = 'none';
        ctaCompetitive.style.display = 'block';

        document.getElementById('calcDifference').textContent = formatCurrency(Math.abs(savings));
        document.getElementById('calcDifferencePercent').textContent = Math.abs(savingsPercent) + '% less than HausKloud over this period';
    }
}

// ====================================
// Smooth Scroll
// ====================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ====================================
// Scroll Reveal Animations
// ====================================
function initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
        observer.observe(el);
    });
}

// ====================================
// Navigation Background on Scroll
// ====================================
function initNavScroll() {
    const nav = document.querySelector('.nav');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            nav.style.background = 'rgba(10, 22, 40, 0.95)';
        } else {
            nav.style.background = 'rgba(10, 22, 40, 0.9)';
        }

        lastScroll = currentScroll;
    });
}

// ====================================
// Ripple Effect for Buttons
// ====================================
function initRippleEffect() {
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const ripple = document.createElement('span');
            ripple.className = 'ripple';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';

            this.appendChild(ripple);

            setTimeout(() => ripple.remove(), 600);
        });
    });
}

// ====================================
// Number Counter Animation
// ====================================
function animateCounter(element, start, end, duration) {
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
            current = end;
            clearInterval(timer);
        }
        element.textContent = formatCurrency(current);
    }, 16);
}

// ====================================
// Reasons Stack Accordion
// ====================================
function initReasonsStack() {
    const stack = document.getElementById('reasonsStack');
    if (!stack) return;

    const cards = stack.querySelectorAll('.reason-card');

    cards.forEach(card => {
        card.addEventListener('click', () => {
            const wasExpanded = card.classList.contains('expanded');

            // Close all cards first
            cards.forEach(c => c.classList.remove('expanded'));

            // Toggle the clicked card
            if (!wasExpanded) {
                card.classList.add('expanded');
                stack.classList.add('has-expanded');

                // Scroll the card into better view
                setTimeout(() => {
                    const cardRect = card.getBoundingClientRect();
                    const viewportHeight = window.innerHeight;
                    const cardCenter = cardRect.top + cardRect.height / 2;
                    const viewportCenter = viewportHeight / 2;

                    if (cardCenter < 150 || cardCenter > viewportHeight - 150) {
                        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                }, 100);
            } else {
                stack.classList.remove('has-expanded');
            }
        });
    });

    // Close expanded card when clicking outside
    document.addEventListener('click', (e) => {
        if (!stack.contains(e.target)) {
            cards.forEach(c => c.classList.remove('expanded'));
            stack.classList.remove('has-expanded');
        }
    });
}

// ====================================
// Demo Modal
// ====================================
function initDemoModal() {
    const modal = document.getElementById('demoModal');
    const modalClose = document.getElementById('modalClose');
    const demoForm = document.getElementById('demoForm');
    const modalSuccess = document.getElementById('modalSuccess');

    if (!modal) return;

    // Open modal when clicking discovery call buttons
    document.querySelectorAll('a[href*="Discovery%20Call"], a[href*="Discovery Call"]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    // Close modal
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    modalClose.addEventListener('click', closeModal);

    // Close on overlay click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    // Form submission
    demoForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = demoForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        const formData = new FormData(demoForm);

        try {
            const response = await fetch('https://formspree.io/f/xkoogayb', {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                demoForm.classList.add('hidden');
                modalSuccess.classList.add('show');

                setTimeout(() => demoForm.reset(), 500);

                setTimeout(() => {
                    closeModal();
                    setTimeout(() => {
                        demoForm.classList.remove('hidden');
                        modalSuccess.classList.remove('show');
                    }, 300);
                }, 3000);
            } else {
                throw new Error('Submission failed');
            }
        } catch (error) {
            alert('Something went wrong. Please email info@haus.video directly.');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
}

// ====================================
// Initialize on DOM Ready
// ====================================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize mini calculator
    const calcTB = document.getElementById('calcTB');
    const calcProvider = document.getElementById('calcProvider');
    const calcYears = document.getElementById('calcYears');

    if (calcTB && calcProvider && calcYears) {
        calcTB.addEventListener('input', updateMiniCalculator);
        calcProvider.addEventListener('change', updateMiniCalculator);
        calcYears.addEventListener('change', updateMiniCalculator);

        // Initial calculation
        updateMiniCalculator();
    }

    // Initialize other features
    initSmoothScroll();
    initScrollReveal();
    initNavScroll();
    initRippleEffect();
    initReasonsStack();
    initDemoModal();

    // Add reveal classes to sections
    document.querySelectorAll('.comparison-card').forEach((card, i) => {
        card.classList.add('reveal');
        card.style.transitionDelay = (i * 0.2) + 's';
    });

    document.querySelectorAll('.benefit-card').forEach((card, i) => {
        card.classList.add('reveal');
        card.style.transitionDelay = (i * 0.1) + 's';
    });

    document.querySelectorAll('.orch-stat-card').forEach((card, i) => {
        card.classList.add('reveal');
        card.style.transitionDelay = (i * 0.15) + 's';
    });
});
