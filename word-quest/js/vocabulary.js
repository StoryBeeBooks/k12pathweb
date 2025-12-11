/**
 * Word Quest - Vocabulary Module
 * Loads and manages vocabulary data
 */

// Vocabulary data loaded from vocabulary_data.js
let vocabularyData = typeof VOCABULARY_DATA !== 'undefined' ? VOCABULARY_DATA : [];

const Vocabulary = {
    /**
     * Initialize vocabulary
     */
    init() {
        if (typeof VOCABULARY_DATA !== 'undefined') {
            vocabularyData = VOCABULARY_DATA;
            console.log(`Loaded ${vocabularyData.length} vocabulary words`);
            return true;
        }
        return false;
    },

    /**
     * Get all vocabulary words
     */
    getAll() {
        return vocabularyData;
    },

    /**
     * Get words by difficulty level
     */
    getByLevel(level) {
        return vocabularyData.filter(w => w.difficulty_level === level);
    },

    /**
     * Get a random word
     */
    getRandom() {
        return vocabularyData[Math.floor(Math.random() * vocabularyData.length)];
    },

    /**
     * Get word by name
     */
    getWord(word) {
        return vocabularyData.find(w => w.word.toLowerCase() === word.toLowerCase());
    },

    /**
     * Search words
     */
    search(query) {
        const q = query.toLowerCase();
        return vocabularyData.filter(w => 
            w.word.toLowerCase().includes(q) ||
            w.definition.toLowerCase().includes(q) ||
            w.simplified_definition.toLowerCase().includes(q)
        );
    },

    /**
     * Get count by level
     */
    getCountByLevel() {
        return {
            1: this.getByLevel(1).length,
            2: this.getByLevel(2).length,
            3: this.getByLevel(3).length,
            total: vocabularyData.length
        };
    }
};

// Initialize vocabulary when script loads
Vocabulary.init();
