// Initialize Lucide Icons
lucide.createIcons();

// Countdown Logic
const targetDate = new Date("January 1, 2026 00:00:00").getTime();
let isNewYear = false;

// Store previous values to detect changes for animations
let prevValues = {
    days: null,
    hours: null,
    minutes: null,
    seconds: null
};

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
    if (!el) return;

    if (prevValues[id] !== value) {
        el.innerText = value;
        el.classList.remove("number-change");
        void el.offsetWidth; // Trigger reflow
        el.classList.add("number-change");
        prevValues[id] = value;
    }
}

const timerInterval = setInterval(updateCountdown, 1000);
updateCountdown();

// Theme Management
function setTheme(theme) {
    const body = document.body;
    const html = document.documentElement;
    
    // Reset
    body.classList.remove("theme-midnight", "theme-aurora", "theme-sunset");
    
    if (theme === "midnight") {
        body.classList.add("theme-midnight");
        html.classList.add("dark");
        updateColors("text-indigo-400", "bg-indigo-500");
    } else if (theme === "aurora") {
        body.classList.add("theme-aurora");
        html.classList.add("dark");
        updateColors("text-emerald-400", "bg-emerald-500");
    } else if (theme === "sunset") {
        body.classList.add("theme-sunset");
        html.classList.add("dark");
        updateColors("text-rose-400", "bg-rose-500");
    } else if (theme === "default") {
        html.classList.add("dark");
        updateColors("text-indigo-400", "bg-indigo-600");
    }
    
    toggleThemeMenu(false);
}

function updateColors(textClass, bgClass) {
    document.querySelectorAll(".countdown-item span:first-child").forEach(el => {
        el.className = `text-5xl md:text-7xl font-black number-animate ${textClass} group-hover:text-white transition-colors`;
    });
    document.querySelectorAll(".bg-indigo-600, .bg-emerald-500, .bg-rose-500, .bg-indigo-500").forEach(el => {
        el.classList.remove("bg-indigo-600", "bg-emerald-500", "bg-rose-500", "bg-indigo-500");
        el.classList.add(bgClass);
    });
}

function toggleThemeMenu(show) {
    const menu = document.getElementById("theme-menu");
    if (!menu) return;
    if (show === undefined) {
        menu.classList.toggle("hidden");
    } else {
        show ? menu.classList.remove("hidden") : menu.classList.add("hidden");
    }
}

function toggleMobileMenu() {
    const menu = document.getElementById("mobile-menu");
    if (menu) menu.classList.toggle("hidden");
}

// Fullscreen Mode
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().then(() => {
            document.body.classList.add("fullscreen-mode");
        }).catch(err => {
            console.error(`Error attempting to enable full-screen mode: ${err.message}`);
        });
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen().then(() => {
                document.body.classList.remove("fullscreen-mode");
            });
        }
    }
}

// Listen for fullscreen change (e.g. Esc key)
document.addEventListener("fullscreenchange", () => {
    if (!document.fullscreenElement) {
        document.body.classList.remove("fullscreen-mode");
    }
});

// Reveal on Scroll
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("active");
        }
    });
}, observerOptions);

document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

// Developer Mode / New Year Trigger
function triggerDevMode() {
    triggerNewYear();
}

function triggerNewYear() {
    isNewYear = true;
    clearInterval(timerInterval);
    
    const container = document.getElementById("countdown-container");
    if (container) container.classList.add("hidden");
    
    const msg = document.getElementById("celebration-msg");
    if (msg) {
        msg.classList.remove("hidden");
        msg.classList.add("active");
    }
    
    startConfetti();
    createFireworks();
}

// Confetti Effect
function startConfetti() {
    const canvas = document.getElementById("confetti-canvas");
    if (!canvas) return;
    canvas.style.display = "block";
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const colors = ["#6366f1", "#a855f7", "#ec4899", "#eab308", "#22c55e"];

    for (let i = 0; i < 150; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            size: Math.random() * 10 + 5,
            color: colors[Math.floor(Math.random() * colors.length)],
            speed: Math.random() * 3 + 2,
            angle: Math.random() * 360
        });
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.angle * Math.PI / 180);
            ctx.fillStyle = p.color;
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
            ctx.restore();

            p.y += p.speed;
            p.angle += 2;
            if (p.y > canvas.height) p.y = -20;
        });
        requestAnimationFrame(draw);
    }
    draw();
}

function createFireworks() {
    const container = document.body;
    for (let i = 0; i < 10; i++) {
        setTimeout(() => {
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * (window.innerHeight / 2);
            const color = `hsl(${Math.random() * 360}, 70%, 60%)`;
            
            for (let j = 0; j < 30; j++) {
                const firework = document.createElement("div");
                firework.className = "firework";
                firework.style.left = x + "px";
                firework.style.top = y + "px";
                firework.style.backgroundColor = color;
                container.appendChild(firework);

                const angle = (j / 30) * Math.PI * 2;
                const velocity = Math.random() * 100 + 50;
                const vx = Math.cos(angle) * velocity;
                const vy = Math.sin(angle) * velocity;

                firework.animate([
                    { transform: "translate(0, 0) scale(1)", opacity: 1 },
                    { transform: `translate(${vx}px, ${vy}px) scale(0)`, opacity: 0 }
                ], {
                    duration: 1000,
                    easing: "ease-out",
                    fill: "forwards"
                });

                setTimeout(() => firework.remove(), 1000);
            }
        }, i * 500);
    }
}

// Close dropdown on click outside
window.addEventListener("click", (e) => {
    if (!e.target.closest("button")) {
        toggleThemeMenu(false);
    }
});

// Set default dark mode on load
document.addEventListener("DOMContentLoaded", () => {
    document.documentElement.classList.add("dark");
    setTheme("default");
});
