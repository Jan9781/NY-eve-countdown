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

        // Initialize Audio
        this.swoosh = new Audio(this.config.swooshPath);
        this.plink = new Audio(this.config.plinkPath);
        this.swoosh.volume = 0.5;
        this.plink.volume = 0.7;

        // Start the sequence
        this.startSequence();
    },

    playSound(audio) {
        const playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise.catch(() => {
                // If blocked, we'll try again on the first user interaction
                const enableAudio = () => {
                    audio.play();
                    document.removeEventListener('click', enableAudio);
                    document.removeEventListener('touchstart', enableAudio);
                };
                document.addEventListener('click', enableAudio);
                document.addEventListener('touchstart', enableAudio);
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

// Execute immediately
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => LoaderSystem.init());
} else {
    LoaderSystem.init();
}
