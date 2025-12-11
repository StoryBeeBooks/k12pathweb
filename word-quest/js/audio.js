/**
 * Word Quest - Audio Module
 * Handles text-to-speech pronunciation using Web Speech API
 */

const Audio = {
    synth: window.speechSynthesis,
    voices: [],
    preferredVoice: null,
    enabled: true,

    /**
     * Initialize audio system
     */
    init() {
        // Load voices
        this.loadVoices();
        
        // Some browsers load voices asynchronously
        if (speechSynthesis.onvoiceschanged !== undefined) {
            speechSynthesis.onvoiceschanged = () => this.loadVoices();
        }

        // Check settings
        const settings = Storage.getSettings();
        this.enabled = settings.soundEnabled;
    },

    /**
     * Load available voices and select preferred one
     */
    loadVoices() {
        this.voices = this.synth.getVoices();
        
        // Prefer English US voices
        const preferredVoices = [
            'Google US English',
            'Microsoft Zira',
            'Microsoft David',
            'Samantha',
            'Alex',
            'en-US'
        ];

        for (const name of preferredVoices) {
            const voice = this.voices.find(v => 
                v.name.includes(name) || v.lang.includes(name)
            );
            if (voice) {
                this.preferredVoice = voice;
                break;
            }
        }

        // Fallback to any English voice
        if (!this.preferredVoice) {
            this.preferredVoice = this.voices.find(v => v.lang.startsWith('en'));
        }
    },

    /**
     * Speak a word or phrase
     */
    speak(text, rate = 0.9) {
        if (!this.enabled || !this.synth) return;

        // Cancel any ongoing speech
        this.synth.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        
        if (this.preferredVoice) {
            utterance.voice = this.preferredVoice;
        }
        
        utterance.rate = rate;
        utterance.pitch = 1;
        utterance.volume = 1;

        this.synth.speak(utterance);
    },

    /**
     * Pronounce a vocabulary word (slower, clearer)
     */
    pronounceWord(word) {
        this.speak(word, 0.8);
    },

    /**
     * Read a sentence
     */
    readSentence(sentence) {
        this.speak(sentence, 0.95);
    },

    /**
     * Play success sound effect
     */
    playSuccess() {
        if (!this.enabled) return;
        this.playTone(523.25, 0.1); // C5
        setTimeout(() => this.playTone(659.25, 0.1), 100); // E5
        setTimeout(() => this.playTone(783.99, 0.15), 200); // G5
    },

    /**
     * Play error sound effect
     */
    playError() {
        if (!this.enabled) return;
        this.playTone(311.13, 0.15); // Eb4
        setTimeout(() => this.playTone(277.18, 0.2), 150); // Db4
    },

    /**
     * Play a simple tone
     */
    playTone(frequency, duration) {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.value = frequency;
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + duration);
        } catch (e) {
            // Audio context not supported, fail silently
        }
    },

    /**
     * Play level up sound
     */
    playLevelUp() {
        if (!this.enabled) return;
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        notes.forEach((freq, i) => {
            setTimeout(() => this.playTone(freq, 0.15), i * 100);
        });
    },

    /**
     * Toggle sound on/off
     */
    toggle() {
        this.enabled = !this.enabled;
        const settings = Storage.getSettings();
        settings.soundEnabled = this.enabled;
        Storage.saveSettings(settings);
        return this.enabled;
    },

    /**
     * Set enabled state
     */
    setEnabled(enabled) {
        this.enabled = enabled;
        const settings = Storage.getSettings();
        settings.soundEnabled = enabled;
        Storage.saveSettings(settings);
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    Audio.init();
});
