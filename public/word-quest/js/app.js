/**
 * Word Quest - Main Application
 * Initializes and coordinates all modules
 */

const App = {
    currentScreen: 'homeScreen',
    selectedLevel: null,

    /**
     * Initialize the application
     */
    init() {
        // Initialize modules
        Storage.init();
        Audio.init();
        Shop.init();

        // Generate stars background
        this.generateStars();

        // Set up event listeners
        this.setupEventListeners();

        // Update UI with saved data
        this.updateStats();
        this.updateProgress();
        this.updateLevelCounts();
        
        // Render collection showcase
        Shop.renderCollection();

        // Show home screen
        this.showScreen('homeScreen');

        // Show daily tip
        this.showRandomTip();

        console.log('Word Quest initialized! 🚀');
    },

    /**
     * Generate animated stars for background
     */
    generateStars() {
        const container = document.getElementById('starsContainer');
        const starCount = 100;

        for (let i = 0; i < starCount; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            
            // Random position
            star.style.left = `${Math.random() * 100}%`;
            star.style.top = `${Math.random() * 100}%`;
            
            // Random size
            const size = Math.random() * 3 + 1;
            star.style.width = `${size}px`;
            star.style.height = `${size}px`;
            
            // Random animation
            star.style.setProperty('--duration', `${Math.random() * 3 + 2}s`);
            star.style.setProperty('--opacity', Math.random() * 0.7 + 0.3);
            
            container.appendChild(star);
        }
    },

    /**
     * Set up all event listeners
     */
    setupEventListeners() {
        // Level selection
        document.querySelectorAll('.level-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.level-btn').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                this.selectedLevel = parseInt(btn.dataset.level);
            });
        });

        // Home screen buttons
        document.getElementById('startLearning').addEventListener('click', () => {
            Game.startLearning(this.selectedLevel);
        });

        document.getElementById('viewSkillTree').addEventListener('click', () => {
            this.showScreen('skillTreeScreen');
            SkillTree.init();
        });

        document.getElementById('quickReview').addEventListener('click', () => {
            Game.startQuiz();
        });

        // Learn screen
        document.getElementById('learnBack').addEventListener('click', () => {
            this.showScreen('homeScreen');
        });

        document.getElementById('flashcard').addEventListener('click', () => {
            document.getElementById('flashcard').classList.toggle('flipped');
        });

        document.getElementById('pronounceBtn').addEventListener('click', (e) => {
            e.stopPropagation();
            const word = document.getElementById('wordText').textContent;
            Audio.pronounceWord(word);
        });

        document.getElementById('gotIt').addEventListener('click', () => {
            Game.handleGotIt();
        });

        document.getElementById('needPractice').addEventListener('click', () => {
            Game.handleNeedPractice();
        });

        // Quiz screen
        document.getElementById('quizBack').addEventListener('click', () => {
            if (confirm('Are you sure you want to quit the quiz?')) {
                this.showScreen('homeScreen');
            }
        });

        document.getElementById('quizPronounce').addEventListener('click', () => {
            const word = document.getElementById('quizWord').textContent;
            Audio.pronounceWord(word);
        });

        // Multiple choice answers
        document.querySelectorAll('.answer-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                if (!btn.disabled) {
                    Game.handleMCAnswer(btn);
                }
            });
        });

        // Cloze input
        document.getElementById('clozeInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                Game.handleClozeAnswer();
            }
        });

        document.getElementById('checkCloze').addEventListener('click', () => {
            Game.handleClozeAnswer();
        });

        // Quiz feedback
        document.getElementById('nextQuestion').addEventListener('click', () => {
            Game.nextQuizQuestion();
        });

        // Results screen
        document.getElementById('continueBtn').addEventListener('click', () => {
            Game.startLearning(this.selectedLevel);
        });

        document.getElementById('retryBtn').addEventListener('click', () => {
            Game.retryQuiz();
        });

        document.getElementById('homeBtn').addEventListener('click', () => {
            this.showScreen('homeScreen');
        });

        // Skill tree
        document.getElementById('skillTreeBack').addEventListener('click', () => {
            this.showScreen('homeScreen');
        });

        // Shop toggle
        const shopToggleBtn = document.getElementById('shopToggleBtn');
        const shopClose = document.getElementById('shopClose');
        
        if (shopToggleBtn) {
            shopToggleBtn.addEventListener('click', () => {
                Shop.toggle();
            });
        }
        
        if (shopClose) {
            shopClose.addEventListener('click', () => {
                Shop.toggle();
            });
        }

        // Game rules toggle
        const rulesToggle = document.getElementById('rulesToggle');
        const rulesContent = document.getElementById('rulesContent');
        
        if (rulesToggle && rulesContent) {
            rulesToggle.addEventListener('click', () => {
                rulesToggle.classList.toggle('active');
                rulesContent.classList.toggle('open');
            });
        }

        // Open shop from collection showcase
        const openShopBtn = document.getElementById('openShopFromCollection');
        if (openShopBtn) {
            openShopBtn.addEventListener('click', () => {
                Shop.toggle();
            });
        }

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (this.currentScreen === 'learnScreen') {
                if (e.key === ' ' || e.key === 'Enter') {
                    document.getElementById('flashcard').classList.toggle('flipped');
                } else if (e.key === 'ArrowRight' || e.key === 'g') {
                    Game.handleGotIt();
                } else if (e.key === 'ArrowLeft' || e.key === 'p') {
                    Game.handleNeedPractice();
                }
            }
        });
    },

    /**
     * Show a specific screen
     */
    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });

        const screen = document.getElementById(screenId);
        if (screen) {
            screen.classList.add('active');
            this.currentScreen = screenId;
        }

        // Update stats when returning to home
        if (screenId === 'homeScreen') {
            this.updateStats();
            this.updateProgress();
        }
    },

    /**
     * Update stats display in header
     */
    updateStats() {
        const stats = Storage.getStats();
        const progress = Storage.getProgress();

        document.getElementById('totalXP').textContent = stats.totalXP.toLocaleString();
        document.getElementById('streak').textContent = stats.streak;
        document.getElementById('wordsMastered').textContent = progress.masteredWords.length;
        
        // Update shop XP display if visible
        Shop.updateXPDisplay();
    },

    /**
     * Update progress bar on home screen
     */
    updateProgress() {
        const progress = Storage.getProgress();
        const total = Vocabulary.getAll().length;
        const mastered = progress.masteredWords.length;
        const percentage = Math.round((mastered / total) * 100);

        document.getElementById('progressPercent').textContent = `${percentage}%`;
        document.getElementById('progressFill').style.width = `${percentage}%`;
        document.getElementById('learnedCount').textContent = mastered;
        document.getElementById('totalWords').textContent = total;
        
        // Update milestones
        const milestones = document.querySelectorAll('.milestone');
        milestones.forEach(milestone => {
            const milestoneValue = parseInt(milestone.getAttribute('data-label'));
            if (percentage >= milestoneValue) {
                milestone.classList.add('reached');
            } else {
                milestone.classList.remove('reached');
            }
        });
    },

    /**
     * Update level word counts
     */
    updateLevelCounts() {
        const level1 = Vocabulary.getByLevel(1);
        const level2 = Vocabulary.getByLevel(2);
        const level3 = Vocabulary.getByLevel(3);

        document.getElementById('level1Count').textContent = level1.length;
        document.getElementById('level2Count').textContent = level2.length;
        document.getElementById('level3Count').textContent = level3.length;
    },

    /**
     * Show random daily tip
     */
    showRandomTip() {
        const tips = [
            'Tip: Learning 5 words a day = 150+ words in a month!',
            'Tip: Use new words in sentences to remember them better.',
            'Tip: Review words you got wrong to strengthen memory.',
            'Tip: Consistency beats intensity - practice a little every day!',
            'Tip: Say words out loud to help remember pronunciation.',
            'Tip: Connect new words to words you already know.',
            'Tip: Take breaks - your brain learns while you rest!',
            'Tip: The more you practice, the faster you\'ll master words!',
            'Tip: Don\'t be afraid to make mistakes - they help you learn!'
        ];

        const tip = tips[Math.floor(Math.random() * tips.length)];
        document.getElementById('dailyTip').textContent = tip;
    },

    /**
     * Show celebration overlay
     */
    showCelebration(message) {
        const overlay = document.getElementById('celebrationOverlay');
        const messageEl = document.getElementById('celebrationMessage');
        
        messageEl.textContent = message;
        overlay.classList.remove('hidden');
        overlay.classList.add('show');

        // Add confetti effect
        this.createConfetti();

        // Auto-hide after 2 seconds
        setTimeout(() => {
            overlay.classList.remove('show');
            setTimeout(() => overlay.classList.add('hidden'), 300);
        }, 2000);
    },

    /**
     * Create confetti effect
     */
    createConfetti() {
        const colors = ['#6c5ce7', '#00cec9', '#fd79a8', '#fdcb6e', '#55efc4'];
        const overlay = document.getElementById('celebrationOverlay');

        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.style.cssText = `
                position: absolute;
                width: 10px;
                height: 10px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                left: ${Math.random() * 100}%;
                top: -10px;
                opacity: 0;
                border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
                animation: confettiFall ${Math.random() * 2 + 1}s ease-out forwards;
                animation-delay: ${Math.random() * 0.5}s;
            `;
            overlay.appendChild(confetti);

            // Clean up after animation
            setTimeout(() => confetti.remove(), 3000);
        }
    }
};

// Add confetti animation
const confettiStyle = document.createElement('style');
confettiStyle.textContent = `
    @keyframes confettiFall {
        0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(confettiStyle);

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Wait for vocabulary to load
    if (typeof Vocabulary !== 'undefined' && Vocabulary.getAll().length > 0) {
        App.init();
    } else {
        // Retry after a short delay
        setTimeout(() => App.init(), 100);
    }
});
