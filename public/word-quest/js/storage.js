/**
 * Word Quest - Storage Module
 * Handles localStorage for progress tracking
 */

const Storage = {
    KEYS: {
        PROGRESS: 'wordquest_progress',
        SETTINGS: 'wordquest_settings',
        STATS: 'wordquest_stats'
    },

    // Default data structures
    defaultProgress: {
        masteredWords: [],      // Array of word strings that are mastered
        learningWords: [],      // Words currently being learned
        wordScores: {},         // { word: { correct: 0, attempts: 0, lastSeen: timestamp } }
        currentLevel: 1,
        lastSessionDate: null
    },

    defaultStats: {
        totalXP: 0,
        streak: 0,
        longestStreak: 0,
        totalWordsLearned: 0,
        totalQuizzesTaken: 0,
        totalCorrectAnswers: 0,
        totalAttempts: 0,
        lastPlayDate: null
    },

    defaultSettings: {
        soundEnabled: true,
        autoPlayAudio: false,
        sessionSize: 5,         // Words per learning session
        quizSize: 10            // Questions per quiz
    },

    /**
     * Initialize storage with defaults if empty
     */
    init() {
        if (!this.getProgress()) {
            this.saveProgress(this.defaultProgress);
        }
        if (!this.getStats()) {
            this.saveStats(this.defaultStats);
        }
        if (!this.getSettings()) {
            this.saveSettings(this.defaultSettings);
        }
        
        // Check and update streak
        this.updateStreak();
    },

    /**
     * Progress Management
     */
    getProgress() {
        try {
            const data = localStorage.getItem(this.KEYS.PROGRESS);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error('Error reading progress:', e);
            return null;
        }
    },

    saveProgress(progress) {
        try {
            localStorage.setItem(this.KEYS.PROGRESS, JSON.stringify(progress));
        } catch (e) {
            console.error('Error saving progress:', e);
        }
    },

    /**
     * Mark a word as mastered
     */
    masterWord(word) {
        const progress = this.getProgress();
        if (!progress.masteredWords.includes(word)) {
            progress.masteredWords.push(word);
            
            // Remove from learning if present
            progress.learningWords = progress.learningWords.filter(w => w !== word);
            
            this.saveProgress(progress);
            
            // Update stats
            const stats = this.getStats();
            stats.totalWordsLearned++;
            this.saveStats(stats);
            
            return true;
        }
        return false;
    },

    /**
     * Check if word is mastered
     */
    isWordMastered(word) {
        const progress = this.getProgress();
        return progress.masteredWords.includes(word);
    },

    /**
     * Update word score after quiz
     */
    updateWordScore(word, correct) {
        const progress = this.getProgress();
        
        if (!progress.wordScores[word]) {
            progress.wordScores[word] = { correct: 0, attempts: 0, lastSeen: null };
        }
        
        progress.wordScores[word].attempts++;
        if (correct) {
            progress.wordScores[word].correct++;
        }
        progress.wordScores[word].lastSeen = Date.now();
        
        // Save the score first
        this.saveProgress(progress);
        
        // Auto-master if answered correctly 3+ times with 80%+ accuracy
        const score = progress.wordScores[word];
        if (score.correct >= 3 && (score.correct / score.attempts) >= 0.8) {
            this.masterWord(word);
            return true; // Indicates word was mastered
        }
        
        return false;
    },

    /**
     * Get word score
     */
    getWordScore(word) {
        const progress = this.getProgress();
        return progress.wordScores[word] || { correct: 0, attempts: 0, lastSeen: null };
    },

    /**
     * Stats Management
     */
    getStats() {
        try {
            const data = localStorage.getItem(this.KEYS.STATS);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error('Error reading stats:', e);
            return null;
        }
    },

    saveStats(stats) {
        try {
            localStorage.setItem(this.KEYS.STATS, JSON.stringify(stats));
        } catch (e) {
            console.error('Error saving stats:', e);
        }
    },

    /**
     * Add XP
     */
    addXP(amount) {
        const stats = this.getStats();
        stats.totalXP += amount;
        this.saveStats(stats);
        return stats.totalXP;
    },

    /**
     * Update streak based on play date
     */
    updateStreak() {
        const stats = this.getStats();
        const today = new Date().toDateString();
        const lastPlay = stats.lastPlayDate;

        if (!lastPlay) {
            // First time playing
            stats.streak = 0;
        } else if (lastPlay === today) {
            // Already played today, keep streak
        } else {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            
            if (lastPlay === yesterday.toDateString()) {
                // Played yesterday, streak continues
                // Will be incremented when they complete a session
            } else {
                // Missed a day, reset streak
                stats.streak = 0;
            }
        }
        
        this.saveStats(stats);
        return stats.streak;
    },

    /**
     * Increment streak (call after 100% accuracy quiz)
     */
    incrementStreak() {
        const stats = this.getStats();
        stats.streak++;
        stats.lastPlayDate = new Date().toDateString();
        
        if (stats.streak > stats.longestStreak) {
            stats.longestStreak = stats.streak;
        }
        
        this.saveStats(stats);
        return stats.streak;
    },

    /**
     * Reset streak to 0 (call when accuracy < 100%)
     */
    resetStreak() {
        const stats = this.getStats();
        stats.streak = 0;
        stats.lastPlayDate = new Date().toDateString();
        this.saveStats(stats);
        return stats.streak;
    },

    /**
     * Record quiz results
     */
    recordQuizResults(correct, total) {
        const stats = this.getStats();
        stats.totalQuizzesTaken++;
        stats.totalCorrectAnswers += correct;
        stats.totalAttempts += total;
        this.saveStats(stats);
    },

    /**
     * Settings Management
     */
    getSettings() {
        try {
            const data = localStorage.getItem(this.KEYS.SETTINGS);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error('Error reading settings:', e);
            return null;
        }
    },

    saveSettings(settings) {
        try {
            localStorage.setItem(this.KEYS.SETTINGS, JSON.stringify(settings));
        } catch (e) {
            console.error('Error saving settings:', e);
        }
    },

    /**
     * Get words that need review (seen but not mastered, or low accuracy)
     */
    getWordsNeedingReview(allWords, limit = 10) {
        const progress = this.getProgress();
        const needsReview = [];

        for (const word of allWords) {
            if (progress.masteredWords.includes(word.word)) continue;
            
            const score = progress.wordScores[word.word];
            if (score && score.attempts > 0) {
                const accuracy = score.correct / score.attempts;
                if (accuracy < 0.8) {
                    needsReview.push({
                        ...word,
                        accuracy,
                        attempts: score.attempts
                    });
                }
            }
        }

        // Sort by accuracy (lowest first)
        needsReview.sort((a, b) => a.accuracy - b.accuracy);
        
        return needsReview.slice(0, limit);
    },

    /**
     * Get new words (never seen)
     */
    getNewWords(allWords, level = null, limit = 10) {
        const progress = this.getProgress();
        const newWords = [];

        for (const word of allWords) {
            if (level && word.difficulty_level !== level) continue;
            if (progress.masteredWords.includes(word.word)) continue;
            if (progress.wordScores[word.word]) continue;
            
            newWords.push(word);
        }

        // Shuffle and return limited
        return this.shuffle(newWords).slice(0, limit);
    },

    /**
     * Utility: Shuffle array
     */
    shuffle(array) {
        const arr = [...array];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    },

    /**
     * Reset all progress (for testing or user request)
     */
    resetAll() {
        localStorage.removeItem(this.KEYS.PROGRESS);
        localStorage.removeItem(this.KEYS.STATS);
        localStorage.removeItem(this.KEYS.SETTINGS);
        this.init();
    },

    /**
     * Export data for backup
     */
    exportData() {
        return {
            progress: this.getProgress(),
            stats: this.getStats(),
            settings: this.getSettings(),
            exportDate: new Date().toISOString()
        };
    },

    /**
     * Import data from backup
     */
    importData(data) {
        if (data.progress) this.saveProgress(data.progress);
        if (data.stats) this.saveStats(data.stats);
        if (data.settings) this.saveSettings(data.settings);
    },

    /**
     * Get owned collectibles
     */
    getOwnedItems() {
        try {
            const data = localStorage.getItem('wordquest_collectibles');
            return data ? JSON.parse(data) : [];
        } catch (e) {
            return [];
        }
    },

    /**
     * Save owned collectibles
     */
    saveOwnedItems(items) {
        try {
            localStorage.setItem('wordquest_collectibles', JSON.stringify(items));
        } catch (e) {
            console.error('Error saving collectibles:', e);
        }
    },

    /**
     * Update word progress (wrapper for updateWordScore for new UI)
     */
    updateWordProgress(word, correct) {
        return this.updateWordScore(word, correct);
    },

    /**
     * Add word to practice list
     */
    addToPractice(word) {
        const progress = this.getProgress();
        if (!progress.practiceList) {
            progress.practiceList = [];
        }
        if (!progress.practiceList.includes(word)) {
            progress.practiceList.push(word);
            this.saveProgress(progress);
        }
    },

    /**
     * Get words in practice list
     */
    getPracticeList() {
        const progress = this.getProgress();
        return progress.practiceList || [];
    },

    /**
     * Remove word from practice list
     */
    removeFromPractice(word) {
        const progress = this.getProgress();
        if (progress.practiceList) {
            progress.practiceList = progress.practiceList.filter(w => w !== word);
            this.saveProgress(progress);
        }
    }
};

// Initialize on load
Storage.init();
