// Initialize Lucide Icons
lucide.createIcons();

/**
 * Countdown Manager
 * Centralized control for the countdown, celebration, and developer tools.
 */
const CountdownManager = {
    originalTarget: new Date("January 1, 2026 00:00:00").getTime(),
    targetDate: new Date("January 1, 2026 00:00:00").getTime(),
    isNewYear: false,
    prevValues: { days: null, hours: null, minutes: null, seconds: null },
    celebrationInterval: null,
    timerInterval: null,

    init() {
        this.loadTheme();
        this.setupEventListeners();
        this.createFestiveElements();
        this.createSnow();
        this.startTimer();
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
    },

    startTimer() {
        if (this.timerInterval) clearInterval(this.timerInterval);
        this.update();
        this.timerInterval = setInterval(() => this.update(), 1000);
    },

    update() {
        const now = Date.now();
        const distance = this.targetDate - now;

        if (distance <= 0 && !this.isNewYear) {
            this.activateCelebration();
            return;
        }

        if (this.isNewYear) return;

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        this.updateElement("days", String(days).padStart(2, "0"));
        this.updateElement("hours", String(hours).padStart(2, "0"));
        this.updateElement("minutes", String(minutes).padStart(2, "0"));
        this.updateElement("seconds", String(seconds).padStart(2, "0"));
    },

    updateElement(id, value) {
        const el = document.getElementById(id);
        if (!el || this.prevValues[id] === value) return;

        el.innerText = value;
        el.classList.remove("number-pop");
        void el.offsetWidth; // Trigger reflow
        el.classList.add("number-pop");
        this.prevValues[id] = value;
    },

    activateCelebration() {
        this.isNewYear = true;
        const countdown = document.getElementById('countdown-container');
        const celebration = document.getElementById('celebration-msg');
        
        // Play celebration sound
        const celebrateAudio = new Audio('assets/celebrate_6Ly1unY.mp3');
        celebrateAudio.volume = 0.8;
        celebrateAudio.play().catch(e => console.log("Celebration audio blocked:", e));

        // Animate out countdown
        countdown.style.transition = "all 1s cubic-bezier(0.34, 1.56, 0.64, 1)";
        countdown.style.transform = "scale(0) rotate(20deg)";
        countdown.style.opacity = "0";

        setTimeout(() => {
            countdown.classList.add('hidden');
            celebration.classList.remove('hidden');
            celebration.classList.add('animate-celebrate-in');
            
            // Intense confetti burst
            for (let i = 0; i < 300; i++) {
                particles.push(new Particle());
            }
            this.animateConfetti();
            
            // Continuous bursts
            this.celebrationInterval = setInterval(() => {
                if (particles.length < 500) {
                    for (let i = 0; i < 50; i++) particles.push(new Particle());
                }
            }, 2000);
            
            // Stop bursts after 30 seconds
            setTimeout(() => {
                if (this.celebrationInterval) clearInterval(this.celebrationInterval);
            }, 30000);
        }, 800);
    },

    // Developer Tools
    setCustomCountdown(seconds) {
        console.log(`DevTools: Setting ${seconds}s countdown`);
        this.reset(false); // Silent reset
        this.targetDate = Date.now() + (seconds * 1000);
        this.isNewYear = false;
        this.update();
        document.getElementById("dev-menu").classList.add("hidden");
    },

    reset(closeMenu = true) {
        console.log("DevTools: Full Reset");
        this.targetDate = this.originalTarget;
        this.isNewYear = false;
        
        if (this.celebrationInterval) clearInterval(this.celebrationInterval);
        
        const countdown = document.getElementById('countdown-container');
        const celebration = document.getElementById('celebration-msg');
        
        // Reset UI Styles
        countdown.classList.remove('hidden');
        countdown.style.transform = "scale(1) rotate(0deg)";
        countdown.style.opacity = "1";
        countdown.style.transition = "none";
        
        celebration.classList.add('hidden');
        celebration.classList.remove('animate-celebrate-in');
        
        // Clear particles
        particles = [];
        this.prevValues = { days: null, hours: null, minutes: null, seconds: null };
        
        this.update();
        if (closeMenu) document.getElementById("dev-menu").classList.add("hidden");
    },

    // Theme & UI
    loadTheme() {
        const savedTheme = localStorage.getItem('ny-theme') || 'gold';
        this.setTheme(savedTheme);
    },

    setTheme(theme) {
        document.body.className = `theme-${theme} overflow-x-hidden`;
        localStorage.setItem('ny-theme', theme);
        document.getElementById("theme-menu").classList.add("hidden");
    },

    toggleThemeMenu(show) {
        const menu = document.getElementById("theme-menu");
        const devMenu = document.getElementById("dev-menu");
        if (show === undefined) menu.classList.toggle("hidden");
        else show ? menu.classList.remove("hidden") : menu.classList.add("hidden");
        if (!menu.classList.contains("hidden")) devMenu.classList.add("hidden");
    },

    toggleDevMenu() {
        const menu = document.getElementById("dev-menu");
        const themeMenu = document.getElementById("theme-menu");
        menu.classList.toggle("hidden");
        themeMenu.classList.add("hidden");
    },

    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().then(() => {
                document.body.classList.add("fullscreen-mode");
            });
        } else {
            document.exitFullscreen();
        }
    },

    setupEventListeners() {
        document.addEventListener("fullscreenchange", () => {
            if (!document.fullscreenElement) {
                document.body.classList.remove("fullscreen-mode");
            }
        });

        document.addEventListener('click', (e) => {
            if (!e.target.closest('.relative') && !e.target.closest('#dev-menu') && !e.target.closest('button')) {
                this.toggleThemeMenu(false);
                document.getElementById('dev-menu').classList.add('hidden');
            }
        });
    },

    // Visual Effects
    createFestiveElements() {
        const container = document.getElementById('festive-container');
        const icons = ['sparkles', 'star', 'party-popper', 'gift', 'glass-water', 'music', 'heart'];
        for (let i = 0; i < 40; i++) {
            const el = document.createElement('div');
            el.className = 'festive-element';
            const icon = icons[Math.floor(Math.random() * icons.length)];
            el.innerHTML = `<i data-lucide="${icon}" class="w-6 h-6 text-primary"></i>`;
            el.style.left = Math.random() * 100 + 'vw';
            el.style.top = Math.random() * 100 + 'vh';
            el.style.animationDuration = (Math.random() * 15 + 15) + 's';
            el.style.animationDelay = (Math.random() * 10) + 's';
            container.appendChild(el);
        }
        lucide.createIcons();
    },

    createSnow() {
        const container = document.getElementById('snow-container');
        for (let i = 0; i < 150; i++) {
            const snow = document.createElement('div');
            snow.className = 'snowflake';
            snow.style.width = `${Math.random() * 3 + 2}px`;
            snow.style.height = snow.style.width;
            snow.style.left = `${Math.random() * 100}vw`;
            snow.style.animationDuration = `${Math.random() * 15 + 10}s`;
            snow.style.animationDelay = `${Math.random() * -20}s`;
            snow.style.opacity = Math.random() * 0.5 + 0.3;
            container.appendChild(snow);
        }
    },

    resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    },

    animateConfetti() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(() => this.animateConfetti());
    }
};

// Global functions for HTML onclick attributes
function triggerNewYear() { CountdownManager.setCustomCountdown(2); }
function simulateExcitement(mode) { if (mode === 'high') CountdownManager.setCustomCountdown(10); }
function resetExcitement() { CountdownManager.reset(); }
function setTheme(theme) { CountdownManager.setTheme(theme); }
function toggleThemeMenu(show) { CountdownManager.toggleThemeMenu(show); }
function toggleDevMenu() { CountdownManager.toggleDevMenu(); }
function toggleFullscreen() { CountdownManager.toggleFullscreen(); }

// Confetti Particle Class
const canvas = document.getElementById('confetti-canvas');
const ctx = canvas.getContext('2d');
let particles = [];

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height - canvas.height;
        this.size = Math.random() * 8 + 4;
        this.speed = Math.random() * 3 + 2;
        this.color = `hsl(${Math.random() * 360}, 70%, 60%)`;
        this.angle = Math.random() * 360;
        this.spin = Math.random() * 5 - 2.5;
    }
    update() {
        this.y += this.speed;
        this.angle += this.spin;
        if (this.y > canvas.height) {
            this.y = -20;
            this.x = Math.random() * canvas.width;
        }
    }
    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle * Math.PI / 180);
        ctx.fillStyle = this.color;
        ctx.fillRect(-this.size/2, -this.size/2, this.size, this.size);
        ctx.restore();
    }
}

// Start the system
CountdownManager.init();
