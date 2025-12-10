/**
 * Word Quest - Clean Modern App
 * Redesigned for Better UX
 */

const App = {
    currentLevel: null,
    currentView: 'dashboard',
    learningWords: [],
    currentWordIndex: 0,
    sessionXP: 0,
    quizWords: [],
    quizIndex: 0,
    quizScore: 0,
    incorrectWords: [],

    /**
     * Initialize the app
     */
    init() {
        this.bindEvents();
        this.updateStats();
        this.updateProgress();
        this.updateLevelCounts();
        this.showRandomTip();
        Shop.init();
        
        // Update collection count
        this.updateCollectionCount();
    },

    /**
     * Bind all event listeners
     */
    bindEvents() {
        // Navigation
        document.querySelectorAll('.nav-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const view = e.currentTarget.dataset.view;
                this.handleNavigation(view);
            });
        });

        // Back buttons
        document.querySelectorAll('.back-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.showView('dashboardView');
                this.updateNavActive('dashboard');
                this.resetSession();
            });
        });

        // Start Learning
        document.getElementById('startLearning').addEventListener('click', () => {
            this.startLearning();
        });

        // Quick Review
        document.getElementById('quickReview').addEventListener('click', () => {
            this.startQuickReview();
        });

        // Skill Galaxy
        document.getElementById('viewSkillTree').addEventListener('click', () => {
            this.showSkillTree();
        });

        // Shop button
        document.getElementById('openShopBtn').addEventListener('click', () => {
            this.openShop();
        });

        // Level selection
        document.querySelectorAll('.level-chip').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const level = parseInt(e.currentTarget.dataset.level);
                this.selectLevel(level);
            });
        });

        // Flashcard flip
        document.getElementById('flashcard').addEventListener('click', () => {
            document.getElementById('flashcard').classList.toggle('flipped');
        });

        // Learn actions
        document.getElementById('gotIt').addEventListener('click', () => {
            this.handleGotIt();
        });

        document.getElementById('needPractice').addEventListener('click', () => {
            this.handleNeedPractice();
        });

        // Audio button
        document.getElementById('playAudio').addEventListener('click', (e) => {
            e.stopPropagation();
            this.playAudio();
        });

        // Results buttons
        document.getElementById('continueBtn').addEventListener('click', () => {
            this.startLearning();
        });

        document.getElementById('homeBtn').addEventListener('click', () => {
            this.showView('dashboard');
            this.updateNavActive('dashboard');
        });

        // Modal close buttons
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modalId = e.currentTarget.dataset.close;
                this.closeModal(modalId);
            });
        });

        // Shop close
        document.getElementById('closeShop').addEventListener('click', () => {
            this.closeShop();
        });

        document.getElementById('shopOverlay').addEventListener('click', () => {
            this.closeShop();
        });

        // Click outside modal to close
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('open');
                }
            });
        });
    },

    /**
     * Handle bottom navigation
     */
    handleNavigation(view) {
        this.updateNavActive(view);
        
        if (view === 'dashboard') {
            this.showView('dashboardView');
        } else if (view === 'collection') {
            this.openModal('collectionModal');
            this.renderCollection();
        } else if (view === 'rules') {
            this.openModal('rulesModal');
        }
    },

    /**
     * Update navigation active state
     */
    updateNavActive(view) {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.toggle('active', item.dataset.view === view);
        });
    },

    /**
     * Show a view
     */
    showView(viewId) {
        document.querySelectorAll('.view').forEach(view => {
            view.classList.remove('active');
        });
        
        const targetView = document.getElementById(viewId);
        if (targetView) {
            targetView.classList.add('active');
        }
    },

    /**
     * Open modal
     */
    openModal(modalId) {
        document.getElementById(modalId).classList.add('open');
    },

    /**
     * Close modal
     */
    closeModal(modalId) {
        document.getElementById(modalId).classList.remove('open');
    },

    /**
     * Open shop
     */
    openShop() {
        document.getElementById('shopPanel').classList.add('open');
        document.getElementById('shopOverlay').classList.add('open');
        Shop.updateXPDisplay();
        Shop.renderItems();
    },

    /**
     * Close shop
     */
    closeShop() {
        document.getElementById('shopPanel').classList.remove('open');
        document.getElementById('shopOverlay').classList.remove('open');
    },

    /**
     * Reset session state
     */
    resetSession() {
        this.learningWords = [];
        this.currentWordIndex = 0;
        this.sessionXP = 0;
        this.quizWords = [];
        this.quizIndex = 0;
        this.quizScore = 0;
        this.incorrectWords = [];
        this.gotItWords = [];
    },

    /**
     * Select difficulty level
     */
    selectLevel(level) {
        document.querySelectorAll('.level-chip').forEach(btn => {
            const btnLevel = parseInt(btn.dataset.level);
            btn.classList.toggle('selected', btnLevel === level);
        });
        
        this.currentLevel = this.currentLevel === level ? null : level;
    },

    /**
     * Start learning session
     */
    startLearning() {
        let words;
        if (this.currentLevel) {
            words = Vocabulary.getByLevel(this.currentLevel);
        } else {
            words = Vocabulary.getAll();
        }

        // Filter out mastered words and shuffle
        const progress = Storage.getProgress();
        words = words.filter(w => !progress.masteredWords.includes(w.word));
        words = this.shuffleArray([...words]).slice(0, 5);

        if (words.length === 0) {
            this.showMessage('All words mastered! Try a different level.');
            return;
        }

        this.learningWords = words;
        this.currentWordIndex = 0;
        this.sessionXP = 0;

        this.showView('learnScreen');
        this.showWord();
    },

    /**
     * Start quick review
     */
    startQuickReview() {
        const progress = Storage.getProgress();
        let words = progress.needsPractice
            .map(w => Vocabulary.getWord(w))
            .filter(w => w);

        if (words.length === 0) {
            words = Vocabulary.getAll();
        }

        words = this.shuffleArray([...words]).slice(0, 5);
        this.learningWords = words;
        this.currentWordIndex = 0;
        this.sessionXP = 0;

        this.showView('learnScreen');
        this.showWord();
    },

    /**
     * Show current word
     */
    showWord() {
        const word = this.learningWords[this.currentWordIndex];
        if (!word) return;

        document.getElementById('flashcard').classList.remove('flipped');
        document.getElementById('wordText').textContent = word.word;
        document.getElementById('definitionSimple').textContent = word.simplified_definition;
        document.getElementById('definitionFormal').textContent = word.definition;
        document.getElementById('synonymsList').textContent = word.synonyms.join(', ');
        document.getElementById('exampleSentence').textContent = `"${word.example_sentence}"`;

        document.getElementById('sessionProgress').textContent = 
            `${this.currentWordIndex + 1} / ${this.learningWords.length}`;
        // XP only shown after quiz completion with 80%+ accuracy
        document.getElementById('sessionXP').parentElement.innerHTML = '<span class="session-xp-note">Pass quiz with 80%+ to earn XP!</span>';
    },

    /**
     * Handle "Got It" button - tracks as correct, XP awarded at end based on accuracy
     */
    handleGotIt() {
        const word = this.learningWords[this.currentWordIndex];
        // Track this word as "got it" for quiz scoring
        if (!this.gotItWords) this.gotItWords = [];
        this.gotItWords.push(word.word);
        
        this.nextWord();
    },

    /**
     * Handle "Need Practice" button - adds to practice list, XP awarded at end based on accuracy
     */
    handleNeedPractice() {
        const word = this.learningWords[this.currentWordIndex];
        Storage.addToPractice(word.word);
        
        this.nextWord();
    },

    /**
     * Move to next word or start quiz
     */
    nextWord() {
        this.currentWordIndex++;
        
        if (this.currentWordIndex >= this.learningWords.length) {
            this.startQuiz();
        } else {
            this.showWord();
        }
        
        this.updateStats();
    },

    /**
     * Start quiz on learned words
     */
    startQuiz() {
        this.quizWords = [...this.learningWords];
        this.quizIndex = 0;
        this.quizScore = 0;
        this.incorrectWords = [];

        this.showView('quizScreen');
        this.showQuizQuestion();
    },

    /**
     * Show quiz question
     */
    showQuizQuestion() {
        const word = this.quizWords[this.quizIndex];
        if (!word) return;

        const questionType = Math.random() > 0.5 ? 'definition' : 'cloze';
        const container = document.getElementById('quizContainer');

        document.getElementById('quizProgress').textContent = 
            `${this.quizIndex + 1} / ${this.quizWords.length}`;
        document.getElementById('quizScore').textContent = this.quizScore;

        if (questionType === 'definition') {
            this.renderDefinitionQuestion(container, word);
        } else {
            this.renderClozeQuestion(container, word);
        }
    },

    /**
     * Render definition question
     */
    renderDefinitionQuestion(container, word) {
        const options = this.generateOptions(word);
        
        container.innerHTML = `
            <div class="quiz-question">
                <span class="question-type-badge">What does this word mean?</span>
                <h2 class="quiz-word">${word.word}</h2>
            </div>
            <div class="answer-options">
                ${options.map((opt, i) => `
                    <button class="answer-btn" data-correct="${opt === word.simplified_definition}" data-answer="${opt}">
                        <span class="answer-letter">${String.fromCharCode(65 + i)}</span>
                        <span class="answer-text">${opt}</span>
                    </button>
                `).join('')}
            </div>
        `;

        container.querySelectorAll('.answer-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleAnswer(e, word));
        });
    },

    /**
     * Render cloze question
     */
    renderClozeQuestion(container, word) {
        const sentence = word.example_sentence.replace(
            new RegExp(word.word, 'gi'),
            '<span class="cloze-blank">_____</span>'
        );

        container.innerHTML = `
            <div class="quiz-question">
                <span class="question-type-badge">Fill in the blank</span>
                <p class="cloze-sentence">${sentence}</p>
            </div>
            <div class="cloze-input-container">
                <input type="text" class="cloze-input" id="clozeInput" placeholder="Type the word..." autocomplete="off">
                <button class="btn btn-primary" id="submitCloze">Check</button>
            </div>
        `;

        const input = document.getElementById('clozeInput');
        const submitBtn = document.getElementById('submitCloze');

        submitBtn.addEventListener('click', () => this.checkClozeAnswer(word));
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.checkClozeAnswer(word);
        });
        
        input.focus();
    },

    /**
     * Generate answer options
     */
    generateOptions(correctWord) {
        const allWords = Vocabulary.getByLevel(correctWord.difficulty_level);
        const others = allWords
            .filter(w => w.word !== correctWord.word)
            .map(w => w.simplified_definition);
        
        const shuffled = this.shuffleArray(others).slice(0, 3);
        const options = [...shuffled, correctWord.simplified_definition];
        return this.shuffleArray(options);
    },

    /**
     * Handle multiple choice answer
     */
    handleAnswer(e, word) {
        const btn = e.currentTarget;
        const isCorrect = btn.dataset.correct === 'true';
        
        document.querySelectorAll('.answer-btn').forEach(b => {
            b.disabled = true;
            if (b.dataset.correct === 'true') {
                b.classList.add('correct');
            }
        });

        if (isCorrect) {
            btn.classList.add('correct');
            this.handleCorrectAnswer(word);
        } else {
            btn.classList.add('incorrect');
            this.handleIncorrectAnswer(word);
        }

        setTimeout(() => this.nextQuizQuestion(), 1500);
    },

    /**
     * Check cloze answer
     */
    checkClozeAnswer(word) {
        const input = document.getElementById('clozeInput');
        const answer = input.value.trim().toLowerCase();
        const correct = word.word.toLowerCase();

        input.disabled = true;
        document.getElementById('submitCloze').disabled = true;

        if (answer === correct) {
            input.style.borderColor = 'var(--success)';
            input.style.background = 'var(--success-bg)';
            this.handleCorrectAnswer(word);
        } else {
            input.style.borderColor = 'var(--danger)';
            input.style.background = 'var(--danger-bg)';
            input.value = `${answer} → ${word.word}`;
            this.handleIncorrectAnswer(word);
        }

        setTimeout(() => this.nextQuizQuestion(), 1500);
    },

    /**
     * Handle correct answer - just track score, XP awarded at end
     */
    handleCorrectAnswer(word) {
        this.quizScore++;
    },

    /**
     * Handle incorrect answer - track for review
     */
    handleIncorrectAnswer(word) {
        this.incorrectWords.push(word);
    },

    /**
     * Check if word is mastered - called in showResults for words answered correctly
     */
    checkMastery(word) {
        const progress = Storage.getProgress();
        const wordProgress = progress.wordScores[word.word] || { correct: 0, attempts: 0 };
        
        if (wordProgress.correct >= 3) {
            const accuracy = wordProgress.correct / wordProgress.attempts;
            if (accuracy >= 0.8 && !progress.masteredWords.includes(word.word)) {
                Storage.masterWord(word.word);
                Storage.addXP(20);
                this.sessionXP += 20;
                this.celebrate(`Word Mastered! 🌟`, '🎉');
            }
        }
    },

    /**
     * Next quiz question
     */
    nextQuizQuestion() {
        this.quizIndex++;
        
        if (this.quizIndex >= this.quizWords.length) {
            this.showResults();
        } else {
            this.showQuizQuestion();
        }
        
        this.updateStats();
    },

    /**
     * Show results screen - XP only awarded if accuracy >= 80%
     */
    showResults() {
        const total = this.quizWords.length;
        const accuracy = Math.round((this.quizScore / total) * 100);
        
        // Calculate XP earned this session
        let earnedXP = 0;
        
        // Only award XP if accuracy >= 80%
        if (accuracy >= 80) {
            // Base XP: 10 per correct answer
            earnedXP = this.quizScore * 10;
            
            // Perfect score bonus
            if (this.quizScore === total) {
                earnedXP += 25;
            }
            
            // Award the XP
            Storage.addXP(earnedXP);
            
            // Update word progress for all words
            this.quizWords.forEach(word => {
                const wasCorrect = !this.incorrectWords.find(w => w.word === word.word);
                Storage.updateWordProgress(word.word, wasCorrect);
                
                // Check mastery for correct words
                if (wasCorrect) {
                    this.checkMastery(word);
                }
            });
        }
        
        // Add incorrect words to practice list regardless of accuracy
        this.incorrectWords.forEach(word => {
            Storage.addToPractice(word.word);
        });
        
        this.sessionXP = earnedXP;

        document.getElementById('resultsIcon').textContent = 
            accuracy >= 80 ? '🎉' : accuracy >= 50 ? '👍' : '💪';
        document.getElementById('resultsTitle').textContent = 
            accuracy >= 80 ? 'Excellent!' : accuracy >= 50 ? 'Good Job!' : 'Keep Practicing!';
        document.getElementById('resultScore').textContent = `${this.quizScore}/${total}`;
        document.getElementById('resultXP').textContent = accuracy >= 80 ? `+${this.sessionXP}` : '+0';
        document.getElementById('resultAccuracy').textContent = `${accuracy}%`;
        
        // Show XP requirement message if below 80%
        const xpNote = document.getElementById('xpNote');
        if (xpNote) {
            xpNote.textContent = accuracy < 80 ? 'Score 80%+ to earn XP!' : '';
            xpNote.style.display = accuracy < 80 ? 'block' : 'none';
        }

        const reviewContainer = document.getElementById('wordsReview');
        if (this.incorrectWords.length > 0) {
            reviewContainer.innerHTML = `
                <h3>Words to Review</h3>
                <div class="review-list">
                    ${this.incorrectWords.map(w => `<span class="review-word">${w.word}</span>`).join('')}
                </div>
            `;
        } else {
            reviewContainer.innerHTML = '';
        }

        this.showView('resultsScreen');
        this.updateStats();
        this.updateProgress();
    },

    /**
     * Show skill tree
     */
    showSkillTree() {
        this.showView('skillTreeScreen');
        this.renderSkillTree();
    },

    /**
     * Render skill tree
     */
    renderSkillTree() {
        const container = document.getElementById('skillTreeContainer');
        const progress = Storage.getProgress();
        const levels = [1, 2, 3];
        const levelNames = ['🌱 Explorer', '⚡ Adventurer', '🔥 Champion'];

        container.innerHTML = levels.map((level, i) => {
            const words = Vocabulary.getByLevel(level);
            const mastered = words.filter(w => progress.masteredWords.includes(w.word)).length;

            return `
                <div class="galaxy-level">
                    <h3 class="level-title">
                        ${levelNames[i]}
                        <span class="level-progress">${mastered} / ${words.length}</span>
                    </h3>
                    <div class="constellation">
                        ${words.map(word => {
                            const isMastered = progress.masteredWords.includes(word.word);
                            const hasProgress = progress.wordScores[word.word];
                            const status = isMastered ? 'mastered' : hasProgress ? 'available' : 'locked';
                            return `<div class="star-node ${status}" title="${word.word}">${word.word.charAt(0).toUpperCase()}</div>`;
                        }).join('')}
                    </div>
                </div>
            `;
        }).join('');
    },

    /**
     * Render collection
     */
    renderCollection() {
        const owned = Storage.getOwnedItems();
        const categories = Shop.getCategories();
        
        // Update counts
        document.getElementById('modalCollectionOwned').textContent = owned.length;
        document.getElementById('modalCollectionTotal').textContent = COLLECTIBLES_DATA.items.length;

        // Render category buttons
        const catContainer = document.getElementById('collectionCategories');
        catContainer.innerHTML = categories.map(cat => `
            <button class="category-btn ${cat.id === 'all' ? 'active' : ''}" data-category="${cat.id}">
                <span class="cat-icon">${cat.icon}</span>
                <span class="cat-name">${cat.name}</span>
            </button>
        `).join('');

        catContainer.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                catContainer.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
                e.currentTarget.classList.add('active');
                this.filterCollection(e.currentTarget.dataset.category);
            });
        });

        // Render items
        this.filterCollection('all');
    },

    /**
     * Filter collection by category
     */
    filterCollection(category) {
        const owned = Storage.getOwnedItems();
        let items = COLLECTIBLES_DATA.items.filter(item => owned.includes(item.id));
        
        if (category !== 'all') {
            items = items.filter(item => item.category === category);
        }

        const container = document.getElementById('collectionItems');
        
        if (items.length === 0) {
            container.innerHTML = `<p style="color: var(--text-muted); text-align: center; width: 100%;">No items in this category yet!</p>`;
            return;
        }

        container.innerHTML = items.map(item => `
            <div class="collection-item ${item.rarity}" title="${item.name}">
                ${item.emoji}
            </div>
        `).join('');
    },

    /**
     * Update collection count on dashboard
     */
    updateCollectionCount() {
        const owned = Storage.getOwnedItems();
        document.getElementById('collectionOwned').textContent = owned.length;
    },

    /**
     * Update stats display
     */
    updateStats() {
        const progress = Storage.getProgress();
        const stats = Storage.getStats();
        document.getElementById('totalXP').textContent = stats.totalXP;
        document.getElementById('streak').textContent = stats.streak;
        document.getElementById('wordsMastered').textContent = progress.masteredWords.length;
        
        this.updateCollectionCount();
        Shop.updateXPDisplay();
    },

    /**
     * Update progress display
     */
    updateProgress() {
        const progress = Storage.getProgress();
        const total = Vocabulary.getAll().length;
        const mastered = progress.masteredWords.length;
        const percentage = Math.round((mastered / total) * 100);

        // Update text
        document.getElementById('progressPercent').textContent = `${percentage}%`;
        document.getElementById('learnedCount').textContent = mastered;
        document.getElementById('totalWords').textContent = total;

        // Update ring
        const ring = document.getElementById('progressRing');
        const circumference = 2 * Math.PI * 45;
        const offset = circumference - (percentage / 100) * circumference;
        ring.style.strokeDashoffset = offset;

        // Update milestone bar
        document.getElementById('milestoneFill').style.width = `${percentage}%`;

        // Update milestone markers
        document.querySelectorAll('.marker').forEach(marker => {
            const value = parseInt(marker.dataset.value);
            marker.classList.toggle('reached', percentage >= value);
        });
    },

    /**
     * Update level counts
     */
    updateLevelCounts() {
        document.getElementById('level1Count').textContent = Vocabulary.getByLevel(1).length;
        document.getElementById('level2Count').textContent = Vocabulary.getByLevel(2).length;
        document.getElementById('level3Count').textContent = Vocabulary.getByLevel(3).length;
    },

    /**
     * Show random tip
     */
    showRandomTip() {
        const tips = [
            'Learn 5 words a day = 150+ words in a month!',
            'Use new words in sentences to remember them better.',
            'Review words you got wrong to strengthen memory.',
            'Consistency beats intensity - practice daily!',
            'Say words out loud to help remember pronunciation.',
            'Connect new words to words you already know.',
            'Take breaks - your brain learns while you rest!',
        ];
        const tip = tips[Math.floor(Math.random() * tips.length)];
        document.getElementById('dailyTip').textContent = tip;
    },

    /**
     * Play audio
     */
    playAudio() {
        const word = this.learningWords[this.currentWordIndex];
        if (word && 'speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(word.word);
            utterance.rate = 0.8;
            speechSynthesis.speak(utterance);
        }
    },

    /**
     * Show celebration
     */
    celebrate(message, icon = '🎉') {
        const overlay = document.getElementById('celebrationOverlay');
        document.getElementById('celebrationIcon').textContent = icon;
        document.getElementById('celebrationMessage').textContent = message;
        overlay.classList.add('show');
        
        setTimeout(() => {
            overlay.classList.remove('show');
        }, 2000);
    },

    /**
     * Show message
     */
    showMessage(text) {
        alert(text); // Simple for now
    },

    /**
     * Shuffle array
     */
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
