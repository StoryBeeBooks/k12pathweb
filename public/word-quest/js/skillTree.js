/**
 * Word Quest - Skill Tree Module
 * Generates and manages the constellation-style skill tree
 */

const SkillTree = {
    container: null,
    
    /**
     * Initialize skill tree
     */
    init() {
        this.container = document.getElementById('skillTreeContainer');
        this.render();
    },

    /**
     * Render the complete skill tree
     */
    render() {
        const progress = Storage.getProgress();
        const masteredWords = new Set(progress.masteredWords);

        // Group words by level
        const levels = {
            1: Vocabulary.getByLevel(1),
            2: Vocabulary.getByLevel(2),
            3: Vocabulary.getByLevel(3)
        };

        // Render each level's constellation
        for (let level = 1; level <= 3; level++) {
            this.renderConstellation(level, levels[level], masteredWords);
            this.updateLevelProgress(level, levels[level], masteredWords);
        }
    },

    /**
     * Render a single level's constellation
     */
    renderConstellation(level, words, masteredWords) {
        const container = document.getElementById(`constellation${level}`);
        if (!container) return;

        container.innerHTML = '';

        // Group words into clusters of 4 for visual organization
        const clusters = this.chunkArray(words, 4);

        clusters.forEach((cluster, clusterIndex) => {
            cluster.forEach((word, wordIndex) => {
                const node = this.createStarNode(word, masteredWords, clusterIndex * 4 + wordIndex + 1);
                container.appendChild(node);
            });
        });
    },

    /**
     * Create a single star node
     */
    createStarNode(wordObj, masteredWords, index) {
        const node = document.createElement('div');
        node.className = 'star-node';
        node.dataset.word = wordObj.word;
        
        // Determine state
        const isMastered = masteredWords.has(wordObj.word);
        const score = Storage.getWordScore(wordObj.word);
        const hasAttempted = score.attempts > 0;

        if (isMastered) {
            node.classList.add('mastered');
            node.innerHTML = '★';
        } else if (hasAttempted) {
            node.classList.add('available');
            node.innerHTML = index;
        } else {
            node.classList.add('available');
            node.innerHTML = index;
        }

        // Add tooltip
        const tooltip = document.createElement('span');
        tooltip.className = 'tooltip';
        tooltip.textContent = wordObj.word;
        node.appendChild(tooltip);

        // Click handler - show word details or start practice
        node.addEventListener('click', () => {
            if (!node.classList.contains('locked')) {
                this.showWordDetails(wordObj);
            }
        });

        return node;
    },

    /**
     * Show word details in a modal or navigate to learn
     */
    showWordDetails(wordObj) {
        const score = Storage.getWordScore(wordObj.word);
        const isMastered = Storage.isWordMastered(wordObj.word);

        // For now, pronounce the word and show a quick alert
        // In a full implementation, this could open a modal
        Audio.pronounceWord(wordObj.word);
        
        // Could trigger learning mode for this specific word
        console.log('Word details:', wordObj, 'Score:', score, 'Mastered:', isMastered);
    },

    /**
     * Update level progress display
     */
    updateLevelProgress(level, words, masteredWords) {
        const progressEl = document.getElementById(`level${level}Progress`);
        if (!progressEl) return;

        const mastered = words.filter(w => masteredWords.has(w.word)).length;
        progressEl.textContent = `${mastered}/${words.length}`;
    },

    /**
     * Animate a newly mastered word
     */
    animateMastery(word) {
        const node = document.querySelector(`.star-node[data-word="${word}"]`);
        if (!node) return;

        node.classList.remove('available');
        node.classList.add('mastered');
        node.innerHTML = '★';

        // Add celebration animation
        node.style.animation = 'none';
        node.offsetHeight; // Trigger reflow
        node.style.animation = 'starBurst 0.5s ease-out';
    },

    /**
     * Refresh the skill tree (call after progress changes)
     */
    refresh() {
        this.render();
    },

    /**
     * Get completion percentage for a level
     */
    getLevelCompletion(level) {
        const progress = Storage.getProgress();
        const words = Vocabulary.getByLevel(level);
        const mastered = words.filter(w => progress.masteredWords.includes(w.word)).length;
        return {
            mastered,
            total: words.length,
            percentage: Math.round((mastered / words.length) * 100)
        };
    },

    /**
     * Get overall completion
     */
    getOverallCompletion() {
        const progress = Storage.getProgress();
        const total = Vocabulary.getAll().length;
        const mastered = progress.masteredWords.length;
        return {
            mastered,
            total,
            percentage: Math.round((mastered / total) * 100)
        };
    },

    /**
     * Utility: Split array into chunks
     */
    chunkArray(array, size) {
        const chunks = [];
        for (let i = 0; i < array.length; i += size) {
            chunks.push(array.slice(i, i + size));
        }
        return chunks;
    }
};

// Add CSS animation for star burst
const style = document.createElement('style');
style.textContent = `
    @keyframes starBurst {
        0% { transform: scale(1); }
        50% { transform: scale(1.5); box-shadow: 0 0 30px rgba(0, 184, 148, 0.8); }
        100% { transform: scale(1); }
    }
`;
document.head.appendChild(style);
