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
<<<<<<< HEAD
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
=======
 * Pixel Grid Cursor/Touch Trail Effect
 * Desktop: follows cursor with trail
 * Mobile: follows touch with trail + ambient animation
 */
function initPixelGrid() {
    const grid = document.getElementById('pixel-grid');
    if (!grid) return;

    // Grid configuration
    const cellSize = 12;
    let cols, rows, cells = [];
    let trail = [];
    const trailLength = 8;
>>>>>>> 35b8569 (Browser Company style redesign with pixel trail effect)

    // Mobile detection
    const isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    let isInteracting = false;
<<<<<<< HEAD
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
=======
    let ambientInterval = null;

    // Create the grid
    function createGrid() {
        cols = Math.ceil(window.innerWidth / cellSize);
        rows = Math.ceil(window.innerHeight / cellSize);

        grid.style.gridTemplateColumns = `repeat(${cols}, ${cellSize}px)`;
        grid.style.gridTemplateRows = `repeat(${rows}, ${cellSize}px)`;

        grid.innerHTML = '';
        cells = [];

        const totalCells = cols * rows;
        for (let i = 0; i < totalCells; i++) {
            const cell = document.createElement('div');
            cell.className = 'pixel-cell';
            grid.appendChild(cell);
            cells.push(cell);
        }

        // Start ambient animation on mobile
        if (isMobile) {
            startAmbientAnimation();
        }
    }

    // Get cell index from position
    function getCellIndex(x, y) {
        const col = Math.floor(x / cellSize);
        const row = Math.floor(y / cellSize);
        if (col >= 0 && col < cols && row >= 0 && row < rows) {
            return row * cols + col;
        }
        return -1;
    }

    // Clear all trail classes
    function clearTrail() {
        cells.forEach(cell => {
            cell.classList.remove('active', 'trail-1', 'trail-2', 'trail-3', 'trail-4', 'ambient');
        });
    }

    // Update trail visualization
    function updateTrail() {
        // Clear only trail classes, not ambient
        cells.forEach(cell => {
            cell.classList.remove('active', 'trail-1', 'trail-2', 'trail-3', 'trail-4');
        });

        trail.forEach((index, i) => {
            if (index >= 0 && index < cells.length) {
                const cell = cells[index];
                cell.classList.remove('ambient'); // Remove ambient if in trail
                if (i === 0) {
                    cell.classList.add('active');
                } else if (i <= 2) {
                    cell.classList.add('trail-1');
                } else if (i <= 4) {
                    cell.classList.add('trail-2');
                } else if (i <= 6) {
                    cell.classList.add('trail-3');
                } else {
                    cell.classList.add('trail-4');
                }
            }
        });
    }

    // Handle position update (mouse or touch)
    let lastIndex = -1;
    function handlePosition(x, y) {
        const index = getCellIndex(x, y);

        if (index !== lastIndex && index >= 0) {
            trail = trail.filter(i => i !== index);
            trail.unshift(index);
            if (trail.length > trailLength) {
                trail.pop();
            }
            updateTrail();
            lastIndex = index;
        }
    }

    // Fade out trail
    function fadeOutTrail() {
        const fadeInterval = setInterval(() => {
            if (trail.length > 0) {
                trail.pop();
                updateTrail();
            } else {
                clearInterval(fadeInterval);
            }
        }, 100);
    }

    // Ambient animation for mobile (random pulses when not touching)
    function startAmbientAnimation() {
        if (ambientInterval) return;

        ambientInterval = setInterval(() => {
            if (isInteracting || cells.length === 0) return;

            // Light up 2-4 random cells
            const numCells = Math.floor(Math.random() * 3) + 2;
            for (let i = 0; i < numCells; i++) {
                const randomIndex = Math.floor(Math.random() * cells.length);
                const cell = cells[randomIndex];

                // Add ambient class
                cell.classList.add('ambient');

                // Remove after random delay
                setTimeout(() => {
                    cell.classList.remove('ambient');
                }, Math.random() * 1000 + 500);
            }
        }, 800);
    }

    function stopAmbientAnimation() {
        if (ambientInterval) {
            clearInterval(ambientInterval);
            ambientInterval = null;
        }
    }

    // Mouse events (desktop)
    document.addEventListener('mousemove', (e) => {
        handlePosition(e.clientX, e.clientY);
    });

    document.addEventListener('mouseleave', () => {
        fadeOutTrail();
    });

    // Touch events (mobile)
    document.addEventListener('touchstart', (e) => {
        isInteracting = true;
        // Clear ambient cells when starting touch
        cells.forEach(cell => cell.classList.remove('ambient'));

        const touch = e.touches[0];
        handlePosition(touch.clientX, touch.clientY);
    }, { passive: true });

    document.addEventListener('touchmove', (e) => {
        const touch = e.touches[0];
        handlePosition(touch.clientX, touch.clientY);
>>>>>>> 35b8569 (Browser Company style redesign with pixel trail effect)
    }, { passive: true });

    document.addEventListener('touchend', () => {
        isInteracting = false;
<<<<<<< HEAD
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
=======
        fadeOutTrail();

        // Restart ambient animation after a delay
        if (isMobile) {
            setTimeout(() => {
                if (!isInteracting) {
                    startAmbientAnimation();
                }
            }, 1000);
        }
    });

    // Handle window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            trail = [];
            stopAmbientAnimation();
            createGrid();
        }, 200);
    });

    // Initialize grid
    createGrid();
>>>>>>> 35b8569 (Browser Company style redesign with pixel trail effect)
}
