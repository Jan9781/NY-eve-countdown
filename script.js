// Initialize Lucide Icons
lucide.createIcons();

// Loader Logic
function startLoader() {
    const loader = document.getElementById('loader-wrapper');
    if (!loader) return;

    // Create audio elements with absolute paths to ensure they load
    const swoosh = new Audio('assets/swoosh.mp3');
    const plink = new Audio('assets/logoplink.mp3');
    
    // Set volume
    swoosh.volume = 0.6;
    plink.volume = 0.8;

    // Force the animation to start by adding a class
    loader.classList.add('active');

    // Function to play sound with a fallback for browser restrictions
    const playSound = (audio) => {
        const playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.log("Audio playback blocked. Click anywhere to enable sound.");
                // Add a one-time listener to play on first interaction if blocked
                document.addEventListener('click', () => {
                    audio.play();
                }, { once: true });
            });
        }
    };

    // Play entrance swoosh immediately
    playSound(swoosh);

    // Play plink when it hits the middle and bounces (around 0.8s - 1.0s)
    setTimeout(() => {
        plink.currentTime = 0;
        playSound(plink);
    }, 1000);

    // Play exit swoosh (around 1.8s)
    setTimeout(() => {
        swoosh.currentTime = 0;
        playSound(swoosh);
    }, 1800);

    setTimeout(() => {
        loader.classList.add('fade-out');
        setTimeout(() => {
            loader.remove();
        }, 1000);
    }, 2500); // Matches the 2.5s animation duration
}

// Run as soon as the DOM is ready, don't wait for images/assets
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startLoader);
} else {
    startLoader();
}

// Countdown Logic
const targetDate = new Date("January 1, 2026 00:00:00").getTime();
let isNewYear = false;
let prevValues = { days: null, hours: null, minutes: null, seconds: null };

function updateCountdown() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance < 0 && !isNewYear) {
        triggerNewYear();
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    updateElement("days", String(days).padStart(2, "0"));
    updateElement("hours", String(hours).padStart(2, "0"));
    updateElement("minutes", String(minutes).padStart(2, "0"));
    updateElement("seconds", String(seconds).padStart(2, "0"));
}

function updateElement(id, value) {
    const el = document.getElementById(id);
    if (!el || prevValues[id] === value) return;

    el.innerText = value;
    el.classList.remove("number-pop");
    void el.offsetWidth; // Trigger reflow
    el.classList.add("number-pop");
    prevValues[id] = value;
}

const timerInterval = setInterval(updateCountdown, 1000);
updateCountdown();

// Theme Management
function setTheme(theme) {
    document.body.className = `theme-${theme} overflow-x-hidden`;
    localStorage.setItem('ny-theme', theme);
    toggleThemeMenu(false);
}

// Load saved theme
const savedTheme = localStorage.getItem('ny-theme');
if (savedTheme) setTheme(savedTheme);

// UI Toggles
function toggleThemeMenu(show) {
    const menu = document.getElementById("theme-menu");
    if (show === undefined) menu.classList.toggle("hidden");
    else show ? menu.classList.remove("hidden") : menu.classList.add("hidden");
    if (!menu.classList.contains("hidden")) document.getElementById("dev-menu").classList.add("hidden");
}

function toggleDevMenu() {
    const menu = document.getElementById("dev-menu");
    menu.classList.toggle("hidden");
    document.getElementById("theme-menu").classList.add("hidden");
}

// Fullscreen Mode
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().then(() => {
            document.body.classList.add("fullscreen-mode");
        });
    } else {
        document.exitFullscreen();
    }
}

document.addEventListener("fullscreenchange", () => {
    if (!document.fullscreenElement) {
        document.body.classList.remove("fullscreen-mode");
    }
});

// Festive Elements Spawning
function createFestiveElements() {
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
}

// Snow Effect
function createSnow() {
    const container = document.getElementById('snow-container');
    const count = 150;
    
    for (let i = 0; i < count; i++) {
        const snow = document.createElement('div');
        snow.className = 'snowflake';
        
        const size = Math.random() * 3 + 2;
        const left = Math.random() * 100;
        const duration = Math.random() * 15 + 10;
        const delay = Math.random() * -20;
        const opacity = Math.random() * 0.5 + 0.3;
        
        snow.style.width = `${size}px`;
        snow.style.height = `${size}px`;
        snow.style.left = `${left}vw`;
        snow.style.animationDuration = `${duration}s`;
        snow.style.animationDelay = `${delay}s`;
        snow.style.opacity = opacity;
        snow.style.filter = `blur(${Math.random() * 1}px)`;
        
        container.appendChild(snow);
    }
}

createFestiveElements();
createSnow();

// Confetti System
const canvas = document.getElementById('confetti-canvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

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

function triggerNewYear() {
    isNewYear = true;
    document.getElementById('countdown-container').classList.add('hidden');
    document.getElementById('celebration-msg').classList.remove('hidden');
    
    for (let i = 0; i < 150; i++) {
        particles.push(new Particle());
    }
    animateConfetti();
}

function animateConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    requestAnimationFrame(animateConfetti);
}

// Dev Tools
function simulateExcitement(mode) {
    if (mode === 'high') {
        triggerNewYear();
    }
    toggleDevMenu();
}

function resetExcitement() {
    location.reload();
}

// Close menus on click outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.relative') && !e.target.closest('#dev-menu') && !e.target.closest('button')) {
        toggleThemeMenu(false);
        document.getElementById('dev-menu').classList.add('hidden');
    }
});