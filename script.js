/**
 * Personal Website - Browser Company Style
 * Theme toggle, scroll animations, navigation
 */

document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    initScrollReveal();
    initNavScroll();
    initMobileMenu();
    initBentoGlow();
    initPixelGrid();
});

/**
 * Theme Toggle - Switch between dark and light modes
 */
function initThemeToggle() {
    const toggle = document.getElementById('theme-toggle');
    const html = document.documentElement;

    // Check for saved preference or system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme) {
        html.setAttribute('data-theme', savedTheme);
    } else if (!systemPrefersDark) {
        html.setAttribute('data-theme', 'light');
    }

    if (toggle) {
        toggle.addEventListener('click', () => {
            const currentTheme = html.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';

            html.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }
}

/**
 * Scroll Reveal - Animate elements when they enter viewport
 */
function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);

    reveals.forEach(reveal => {
        observer.observe(reveal);
    });
}

/**
 * Navigation - Add background on scroll
 */
function initNavScroll() {
    const nav = document.querySelector('.nav');

    if (!nav) return;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    // Smooth scroll for nav links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));

            // Close mobile menu if open
            const navToggle = document.querySelector('.nav-toggle');
            const navLinks = document.querySelector('.nav-links');
            if (navToggle) navToggle.classList.remove('active');
            if (navLinks) navLinks.classList.remove('active');

            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/**
 * Mobile Menu Toggle
 */
function initMobileMenu() {
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }
}

/**
 * Bento Grid Cursor Glow Effect
 * Cards light up following cursor position
 */
function initBentoGlow() {
    const bentoCards = document.querySelectorAll('.bento-card[data-glow]');

    bentoCards.forEach(card => {
        const glowElement = card.querySelector('.bento-glow');

        if (!glowElement) return;

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Update CSS custom properties for glow position
            glowElement.style.setProperty('--glow-x', `${x}px`);
            glowElement.style.setProperty('--glow-y', `${y}px`);
        });

        card.addEventListener('mouseleave', () => {
            // Reset to center when mouse leaves
            glowElement.style.setProperty('--glow-x', '50%');
            glowElement.style.setProperty('--glow-y', '50%');
        });
    });
}

/**
 * Pixel Grid - Canvas-based for smooth 60fps performance
 */
function initPixelGrid() {
    const container = document.getElementById('pixel-grid');
    if (!container) return;

    // Create canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    container.appendChild(canvas);
    canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:1;';

    // Config
    const cellSize = 12;
    const trailLength = 12;
    const glowColor = [59, 130, 246]; // RGB blue
    let trail = [];
    let mouseX = -1, mouseY = -1;
    let animationId = null;

    // Mobile detection
    const isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    let isInteracting = false;
    let ambientCells = [];

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw ambient cells (mobile)
        if (isMobile && !isInteracting) {
            ambientCells.forEach(cell => {
                const alpha = cell.life / cell.maxLife;
                ctx.fillStyle = `rgba(${glowColor[0]}, ${glowColor[1]}, ${glowColor[2]}, ${alpha * 0.5})`;
                ctx.fillRect(cell.x * cellSize, cell.y * cellSize, cellSize - 1, cellSize - 1);
            });

            // Update ambient cells
            ambientCells = ambientCells.filter(cell => {
                cell.life -= 0.02;
                return cell.life > 0;
            });

            // Spawn new ambient cells
            if (Math.random() < 0.1) {
                const cols = Math.floor(canvas.width / cellSize);
                const rows = Math.floor(canvas.height / cellSize);
                ambientCells.push({
                    x: Math.floor(Math.random() * cols),
                    y: Math.floor(Math.random() * rows),
                    life: 1,
                    maxLife: 1
                });
            }
        }

        // Draw trail
        trail.forEach((pos, i) => {
            const alpha = 1 - (i / trailLength);
            const size = cellSize - 1;

            // Glow effect for first few
            if (i < 3) {
                ctx.shadowBlur = 8;
                ctx.shadowColor = `rgba(${glowColor[0]}, ${glowColor[1]}, ${glowColor[2]}, ${alpha})`;
            } else {
                ctx.shadowBlur = 0;
            }

            ctx.fillStyle = `rgba(${glowColor[0]}, ${glowColor[1]}, ${glowColor[2]}, ${alpha * 0.8})`;
            ctx.fillRect(pos.x * cellSize, pos.y * cellSize, size, size);
        });

        ctx.shadowBlur = 0;
        animationId = requestAnimationFrame(draw);
    }

    function addToTrail(clientX, clientY) {
        const col = Math.floor(clientX / cellSize);
        const row = Math.floor(clientY / cellSize);

        // Only add if different from last position
        if (trail.length === 0 || trail[0].x !== col || trail[0].y !== row) {
            trail.unshift({ x: col, y: row });
            if (trail.length > trailLength) {
                trail.pop();
            }
        }
    }

    // Throttled mouse handler
    let lastMove = 0;
    function handleMove(x, y) {
        const now = performance.now();
        if (now - lastMove < 16) return; // ~60fps throttle
        lastMove = now;
        mouseX = x;
        mouseY = y;
        addToTrail(x, y);
    }

    // Mouse events
    document.addEventListener('mousemove', e => handleMove(e.clientX, e.clientY), { passive: true });
    document.addEventListener('mouseleave', () => {
        // Fade out
        const fade = setInterval(() => {
            if (trail.length > 0) trail.pop();
            else clearInterval(fade);
        }, 50);
    });

    // Touch events
    document.addEventListener('touchstart', e => {
        isInteracting = true;
        ambientCells = [];
        handleMove(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });

    document.addEventListener('touchmove', e => {
        handleMove(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });

    document.addEventListener('touchend', () => {
        isInteracting = false;
        const fade = setInterval(() => {
            if (trail.length > 0) trail.pop();
            else clearInterval(fade);
        }, 50);
    });

    // Resize handler
    window.addEventListener('resize', resize);

    // Initialize
    resize();
    draw();
}
