/**
 * Premium Loader System
 * Handles the entrance animation, audio synchronization, and cleanup.
 */

const LoaderSystem = {
    config: {
        duration: 2500,
        swooshPath: 'assets/swoosh.mp3',
        plinkPath: 'assets/logoplink.mp3',
        timings: {
            plink: 1000,
            exitSwoosh: 1800
        }
    },

    init() {
        this.wrapper = document.getElementById('loader-wrapper');
        this.logo = document.getElementById('loader-logo');
        
        if (!this.wrapper || !this.logo) return;

        // Initialize Audio with crossOrigin for better compatibility
        this.swoosh = new Audio();
        this.swoosh.src = this.config.swooshPath;
        this.swoosh.preload = 'auto';
        
        this.plink = new Audio();
        this.plink.src = this.config.plinkPath;
        this.plink.preload = 'auto';

        this.swoosh.volume = 0.5;
        this.plink.volume = 0.7;

        // Try to "unlock" audio as aggressively as possible
        this.setupAudioUnlock();

        // Start the sequence
        this.startSequence();
    },

    setupAudioUnlock() {
        // List of events that can unlock audio in various browsers
        const unlockEvents = ['click', 'touchstart', 'keydown', 'mousedown', 'mousemove', 'wheel'];
        
        const unlock = () => {
            // Play and immediately pause to "prime" the audio engine
            this.swoosh.play().then(() => {
                this.swoosh.pause();
                this.swoosh.currentTime = 0;
            }).catch(() => {});
            
            this.plink.play().then(() => {
                this.plink.pause();
                this.plink.currentTime = 0;
            }).catch(() => {});

            // Remove listeners once unlocked
            unlockEvents.forEach(event => document.removeEventListener(event, unlock));
        };

        unlockEvents.forEach(event => document.addEventListener(event, unlock, { once: true }));
    },

    playSound(audio) {
        // Attempt to play
        const playPromise = audio.play();
        
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.warn("Autoplay prevented by browser. Audio will play on first movement/click.", error);
            });
        }
    },

    startSequence() {
        console.log("Loader sequence starting...");
        
        // Small delay to ensure DOM is fully painted before animation starts
        setTimeout(() => {
            this.wrapper.classList.add('active');
            console.log("Active class added to loader");
            
            this.playSound(this.swoosh);

            // Plink at the bounce peak
            setTimeout(() => {
                console.log("Playing plink...");
                this.plink.currentTime = 0;
                this.playSound(this.plink);
            }, this.config.timings.plink);

            // Exit swoosh
            setTimeout(() => {
                console.log("Playing exit swoosh...");
                this.swoosh.currentTime = 0;
                this.playSound(this.swoosh);
            }, this.config.timings.exitSwoosh);

            // Cleanup
            setTimeout(() => {
                console.log("Fading out loader...");
                this.wrapper.classList.add('fade-out');
                setTimeout(() => {
                    this.wrapper.remove();
                    console.log("Loader removed from DOM");
                }, 1000);
            }, this.config.duration);
        }, 100); // Increased delay slightly for stability
    }
};

// Execute as soon as possible, but also try on window load for audio readiness
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => LoaderSystem.init());
} else {
    LoaderSystem.init();
}

// Fallback to ensure it runs even if DOMContentLoaded was missed
window.addEventListener('load', () => {
    if (!document.getElementById('loader-wrapper').classList.contains('active')) {
        LoaderSystem.init();
    }
});
