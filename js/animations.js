/* ====================================
   HausKloud Website - Animation System
   ==================================== */

// ====================================
// Hero Particle System
// ====================================
class ParticleSystem {
    constructor(container) {
        this.container = container;
        this.particles = [];
        this.particleCount = 30;
        this.isRunning = true;
        this.init();
    }

    init() {
        // Create particles
        for (let i = 0; i < this.particleCount; i++) {
            this.createParticle(i);
        }
    }

    createParticle(index) {
        const particle = document.createElement('div');
        particle.className = 'hero-particle';

        // Random size class
        const sizeRandom = Math.random();
        if (sizeRandom < 0.3) {
            particle.classList.add('small');
        } else if (sizeRandom > 0.85) {
            particle.classList.add('large');
        }

        // Random color class
        const colorRandom = Math.random();
        if (colorRandom < 0.15) {
            particle.classList.add('cyan');
        } else if (colorRandom > 0.85) {
            particle.classList.add('green');
        }

        // Random horizontal position
        particle.style.left = Math.random() * 100 + '%';

        // Random animation delay for staggered effect
        particle.style.animationDelay = (Math.random() * 15) + 's';

        // Random animation duration for variety
        particle.style.animationDuration = (12 + Math.random() * 8) + 's';

        this.container.appendChild(particle);
        this.particles.push(particle);
    }

    destroy() {
        this.isRunning = false;
        this.particles.forEach(p => p.remove());
        this.particles = [];
    }
}

// ====================================
// Pipeline Flow Animation
// ====================================
class PipelineFlow {
    constructor(container) {
        this.container = container;
        this.isRunning = true;
        this.particleInterval = null;
        this.init();
    }

    init() {
        // Start continuous particle flow
        this.startFlow();
    }

    createFlowParticle(pipelineClass, color) {
        const particle = document.createElement('div');
        particle.className = 'flow-particle ' + (color || '');

        const pipeline = this.container.querySelector('.' + pipelineClass);
        if (pipeline) {
            pipeline.appendChild(particle);

            // Remove after animation completes
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.remove();
                }
            }, 2000);
        }
    }

    startFlow() {
        // Create particles at intervals
        this.particleInterval = setInterval(() => {
            if (!this.isRunning) return;

            // Create particles for each pipeline
            this.createFlowParticle('orch-pipeline:nth-child(2)');
            setTimeout(() => this.createFlowParticle('orch-pipeline:nth-child(4)', 'pink'), 500);
            setTimeout(() => this.createFlowParticle('orch-pipeline:nth-child(6)', 'cyan'), 1000);
        }, 3000);
    }

    destroy() {
        this.isRunning = false;
        if (this.particleInterval) {
            clearInterval(this.particleInterval);
        }
    }
}

// ====================================
// Intersection Observer for Animation Triggers
// ====================================
class AnimationTrigger {
    constructor() {
        this.observers = [];
        this.init();
    }

    init() {
        // Observe orchestration section
        this.observeOrchestration();

        // Observe stats for counter animation
        this.observeStats();
    }

    observeOrchestration() {
        const orchestrationSection = document.querySelector('.orchestration');
        if (!orchestrationSection) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Add animation classes when section is visible
                    entry.target.querySelectorAll('.storage-cube').forEach(cube => {
                        cube.classList.add('cube-breathe');
                    });

                    entry.target.querySelectorAll('.tape-reel').forEach(reel => {
                        reel.classList.add('tape-spinning');
                    });

                    entry.target.querySelectorAll('.sd-icon-large').forEach(icon => {
                        icon.classList.add('sd-card-float');
                    });
                }
            });
        }, { threshold: 0.3 });

        observer.observe(orchestrationSection);
        this.observers.push(observer);
    }

    observeStats() {
        const stats = document.querySelectorAll('.proof-number, .stat-number');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.dataset.animated) {
                    entry.target.dataset.animated = 'true';

                    // Add pulse animation to savings-related numbers
                    if (entry.target.closest('.calc-savings') ||
                        entry.target.textContent.includes('50%')) {
                        entry.target.classList.add('savings-pulse');
                    }
                }
            });
        }, { threshold: 0.5 });

        stats.forEach(stat => observer.observe(stat));
        this.observers.push(observer);
    }

    destroy() {
        this.observers.forEach(observer => observer.disconnect());
        this.observers = [];
    }
}

// ====================================
// Glow Trail Effect (for cursor)
// ====================================
class GlowTrail {
    constructor() {
        this.enabled = false; // Disabled by default for performance
        this.trail = [];
        this.maxTrailLength = 10;

        if (this.enabled) {
            this.init();
        }
    }

    init() {
        document.addEventListener('mousemove', (e) => {
            this.createTrailDot(e.clientX, e.clientY);
        });
    }

    createTrailDot(x, y) {
        const dot = document.createElement('div');
        dot.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            width: 6px;
            height: 6px;
            background: var(--primary);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            opacity: 0.6;
            transform: translate(-50%, -50%);
            transition: opacity 0.3s, transform 0.3s;
        `;

        document.body.appendChild(dot);
        this.trail.push(dot);

        // Fade out and remove
        setTimeout(() => {
            dot.style.opacity = '0';
            dot.style.transform = 'translate(-50%, -50%) scale(0)';
        }, 50);

        setTimeout(() => {
            dot.remove();
            this.trail = this.trail.filter(d => d !== dot);
        }, 350);

        // Limit trail length
        if (this.trail.length > this.maxTrailLength) {
            const oldDot = this.trail.shift();
            if (oldDot) oldDot.remove();
        }
    }
}

// ====================================
// Magnetic Button Effect
// ====================================
class MagneticButton {
    constructor(button) {
        this.button = button;
        this.boundMouseMove = this.onMouseMove.bind(this);
        this.boundMouseLeave = this.onMouseLeave.bind(this);
        this.init();
    }

    init() {
        this.button.addEventListener('mousemove', this.boundMouseMove);
        this.button.addEventListener('mouseleave', this.boundMouseLeave);
    }

    onMouseMove(e) {
        const rect = this.button.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        this.button.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    }

    onMouseLeave() {
        this.button.style.transform = '';
    }

    destroy() {
        this.button.removeEventListener('mousemove', this.boundMouseMove);
        this.button.removeEventListener('mouseleave', this.boundMouseLeave);
    }
}

// ====================================
// Initialize All Animations
// ====================================
let particleSystem = null;
let animationTrigger = null;
let magneticButtons = [];

document.addEventListener('DOMContentLoaded', () => {
    // Initialize hero particle system
    const heroParticles = document.getElementById('heroParticles');
    if (heroParticles) {
        particleSystem = new ParticleSystem(heroParticles);
    }

    // Initialize animation triggers
    animationTrigger = new AnimationTrigger();

    // Initialize magnetic buttons (optional - can be performance intensive)
    // document.querySelectorAll('.btn-primary').forEach(btn => {
    //     magneticButtons.push(new MagneticButton(btn));
    // });

    // Add hover effects to cards
    document.querySelectorAll('.benefit-card, .comparison-card').forEach(card => {
        card.classList.add('hover-lift');
    });

    // Add glow effect to primary buttons
    document.querySelectorAll('.btn-primary').forEach(btn => {
        btn.classList.add('btn-glow', 'btn-ripple');
    });
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (particleSystem) particleSystem.destroy();
    if (animationTrigger) animationTrigger.destroy();
    magneticButtons.forEach(mb => mb.destroy());
});

// Pause animations when tab is not visible
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        if (particleSystem) particleSystem.isRunning = false;
    } else {
        if (particleSystem) particleSystem.isRunning = true;
    }
});
