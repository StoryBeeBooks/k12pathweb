/**
 * Word Quest - Desktop App
 * Redesigned for Desktop-First Experience
 */

const App = {
    currentLevel: null,
    currentView: 'dashboardView',
    learningWords: [],
    currentWordIndex: 0,
    sessionXP: 0,
    quizWords: [],
    quizIndex: 0,
    quizScore: 0,
    incorrectWords: [],
    gotItWords: [],
    quizHasWrongAnswer: false,

    /**
     * Initialize the app
     */
    init() {
        Storage.init();
        this.bindEvents();
        this.updateStats();
        this.updateProgress();
        this.updateLevelCounts();
        this.showRandomTip();
        this.updateCollectionPreview();
        this.initDreamHome();
        Shop.init();
    },

    /**
     * Bind all event listeners
     */
    bindEvents() {
        // Side buttons
        document.getElementById('quickReviewBtn').addEventListener('click', () => {
            this.startQuickReview();
        });

        document.getElementById('skillGalaxyBtn').addEventListener('click', () => {
            this.showSkillGalaxy();
        });

        document.getElementById('shopBtn').addEventListener('click', () => {
            this.openShop();
        });

        document.getElementById('rulesBtn').addEventListener('click', () => {
            this.openModal('rulesModal');
        });

        // Level selection - clicking a level starts learning directly
        document.querySelectorAll('.level-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const level = parseInt(e.currentTarget.dataset.level);
                this.selectLevel(level);
            });
        });

        // Analogy test button (main dashboard)
        document.getElementById('analogyTestBtnMain').addEventListener('click', () => {
            this.startAnalogyTest();
        });

        // Flashcard
        document.getElementById('flashcard').addEventListener('click', () => {
            document.getElementById('flashcard').classList.toggle('flipped');
        });

        // Learn buttons
        document.getElementById('gotIt').addEventListener('click', () => {
            this.handleGotIt();
        });

        document.getElementById('needPractice').addEventListener('click', () => {
            this.handleNeedPractice();
        });

        // Audio button
        document.getElementById('playAudio').addEventListener('click', (e) => {
            e.stopPropagation();
            this.playWordAudio();
        });

        // Back buttons
        document.getElementById('learnBackBtn').addEventListener('click', () => {
            this.goToDashboard();
        });

        document.getElementById('quizBackBtn').addEventListener('click', () => {
            // If user got any wrong answers during quiz, break the streak
            if (this.quizHasWrongAnswer) {
                Storage.resetStreak();
                this.updateStats();
            }
            this.goToDashboard();
        });

        document.getElementById('galaxyBackBtn').addEventListener('click', () => {
            this.goToDashboard();
        });

        document.getElementById('collectionBackBtn').addEventListener('click', () => {
            this.goToDashboard();
        });

        document.getElementById('analogyBackBtn').addEventListener('click', () => {
            this.goToDashboard();
        });

        // Dream home toggle (main page)
        document.getElementById('dreamHomeToggle').addEventListener('click', () => {
            this.toggleDreamHome();
        });

        // Mini dream home toggle
        document.getElementById('miniDreamHomeToggle').addEventListener('click', () => {
            this.toggleMiniDreamHome();
        });

        // Collection card click
        document.getElementById('collectionCard').addEventListener('click', () => {
            this.openCollection();
        });

        // Results buttons
        document.getElementById('continueBtn').addEventListener('click', () => {
            this.startLearning();
        });

        document.getElementById('homeBtn').addEventListener('click', () => {
            this.goToDashboard();
        });

        // Analogy results buttons
        document.getElementById('analogyRetryBtn').addEventListener('click', () => {
            this.startAnalogyTest();
        });

        document.getElementById('analogyHomeBtn').addEventListener('click', () => {
            this.goToDashboard();
        });

        // Shop
        document.getElementById('closeShop').addEventListener('click', () => {
            this.closeShop();
        });

        document.getElementById('shopOverlay').addEventListener('click', () => {
            this.closeShop();
        });

        // Modal close buttons
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modalId = e.currentTarget.dataset.close;
                this.closeModal(modalId);
            });
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
     * Go to dashboard
     */
    goToDashboard() {
        this.resetSession();
        this.showView('dashboardView');
        this.updateStats();
        this.updateProgress();
        this.updateLevelCounts();
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
            this.currentView = viewId;
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
     * Open collection view
     */
    openCollection() {
        this.showView('collectionScreen');
        this.renderCollectionCategories();
        this.renderCollectionItems('all');
        this.updateMiniDreamHome();
        this.initMiniImageComparison();
    },

    /**
     * Render collection category filters
     */
    renderCollectionCategories() {
        const container = document.getElementById('collectionCategories');
        const categories = COLLECTIBLES_DATA.categories;
        
        let html = `<button class="category-btn active" data-category="all">All</button>`;
        categories.forEach(cat => {
            html += `<button class="category-btn" data-category="${cat.id}">${cat.name}</button>`;
        });
        
        container.innerHTML = html;
        
        container.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                container.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
                e.currentTarget.classList.add('active');
                this.renderCollectionItems(e.currentTarget.dataset.category);
            });
        });
    },

    /**
     * Render collection items with enhanced styling
     */
    renderCollectionItems(category) {
        const container = document.getElementById('collectionItems');
        const owned = Storage.getOwnedItems();
        
        let items = COLLECTIBLES_DATA.items;
        if (category !== 'all') {
            items = items.filter(item => item.category === category);
        }
        
        // Update counts
        const ownedCount = document.getElementById('modalCollectionOwned');
        const totalCount = document.getElementById('modalCollectionTotal');
        if (ownedCount) ownedCount.textContent = owned.length;
        if (totalCount) totalCount.textContent = COLLECTIBLES_DATA.items.length;
        
        const html = items.map(item => {
            const isOwned = owned.includes(item.id);
            const categoryData = COLLECTIBLES_DATA.categories.find(c => c.id === item.category);
            const rarityData = COLLECTIBLES_DATA.rarities[item.rarity];
            
            return `
                <div class="collection-item ${isOwned ? 'owned' : 'locked'}">
                    <div class="collection-item-glow"></div>
                    <div class="collection-item-emoji">${isOwned ? item.emoji : '❓'}</div>
                    <div class="collection-item-name">${isOwned ? item.name : '???'}</div>
                    ${isOwned ? `<div class="collection-item-rarity" style="color: ${rarityData?.color || '#b2bec3'}">${rarityData?.label || item.rarity}</div>` : ''}
                </div>
            `;
        }).join('');
        
        container.innerHTML = html;
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
     * Select difficulty level and start learning
     */
    selectLevel(level) {
        document.querySelectorAll('.level-btn').forEach(btn => {
            const btnLevel = parseInt(btn.dataset.level);
            btn.classList.toggle('selected', btnLevel === level);
        });
        this.currentLevel = level;
        
        // Immediately start learning with selected level
        this.startLearning();
    },

    /**
     * Start learning session
     */
    startLearning() {
        this.resetSession();
        
        const progress = Storage.getProgress();
        let words;

        if (this.currentLevel) {
            words = Vocabulary.getByLevel(this.currentLevel);
        } else {
            words = Vocabulary.getAll();
        }

        // Filter out mastered words
        words = words.filter(w => !progress.masteredWords.includes(w.word));

        if (words.length === 0) {
            alert('You have mastered all words in this level! Try another level or review your words.');
            return;
        }

        words = this.shuffleArray([...words]).slice(0, 5);
        this.learningWords = words;
        this.currentWordIndex = 0;

        this.showView('learnScreen');
        this.showWord();
    },

    /**
     * Start quick review
     */
    startQuickReview() {
        this.resetSession();
        
        const progress = Storage.getProgress();
        const practiceList = progress.practiceList || [];
        
        let words;
        if (practiceList.length > 0) {
            words = practiceList
                .map(w => Vocabulary.getWord(w))
                .filter(w => w);
        } else {
            words = Vocabulary.getAll();
        }

        if (words.length === 0) {
            alert('No words to review. Start learning first!');
            return;
        }

        words = this.shuffleArray([...words]).slice(0, 5);
        this.learningWords = words;
        this.currentWordIndex = 0;

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
    },

    /**
     * Handle "Got It" button
     */
    handleGotIt() {
        const word = this.learningWords[this.currentWordIndex];
        if (!this.gotItWords) this.gotItWords = [];
        this.gotItWords.push(word.word);
        this.nextWord();
    },

    /**
     * Handle "Need Practice" button
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
    },

    /**
     * Play word audio
     */
    playWordAudio() {
        const word = this.learningWords[this.currentWordIndex];
        if (word && typeof Audio !== 'undefined' && Audio.speak) {
            Audio.speak(word.word);
        } else {
            // Fallback to browser speech synthesis
            const utterance = new SpeechSynthesisUtterance(word.word);
            speechSynthesis.speak(utterance);
        }
    },

    /**
     * Start quiz
     */
    startQuiz() {
        this.quizWords = this.shuffleArray([...this.learningWords]);
        this.quizIndex = 0;
        this.quizScore = 0;
        this.incorrectWords = [];
        this.quizHasWrongAnswer = false;

        this.showView('quizScreen');
        this.showQuizQuestion();
    },

    /**
     * Show quiz question
     */
    showQuizQuestion() {
        const word = this.quizWords[this.quizIndex];
        const container = document.getElementById('quizContent');
        
        // Clear any existing content and reset state to prevent visual carryover
        container.innerHTML = '';
        
        // Update progress bar
        const progress = ((this.quizIndex) / this.quizWords.length) * 100;
        document.getElementById('quizProgressFill').style.width = `${progress}%`;
        document.getElementById('quizScoreDisplay').textContent = this.quizScore;

        // Randomly choose question type
        const questionType = Math.random() > 0.5 ? 'definition' : 'cloze';
        
        // Small delay to ensure DOM is cleared before rendering new question
        requestAnimationFrame(() => {
            if (questionType === 'definition') {
                this.renderDefinitionQuestion(container, word);
            } else {
                this.renderClozeQuestion(container, word);
            }
        });
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
            <div class="cloze-answer">
                <input type="text" class="cloze-input" id="clozeInput" placeholder="Type the word..." autocomplete="off">
                <button class="cloze-submit-btn" id="clozeSubmit">Submit</button>
            </div>
        `;

        const input = document.getElementById('clozeInput');
        const submitBtn = document.getElementById('clozeSubmit');
        
        // Flag to prevent multiple submissions
        let isSubmitting = false;
        
        const submitAnswer = () => {
            if (isSubmitting) return; // Prevent multiple submissions
            isSubmitting = true;
            
            // Disable input and button immediately
            input.disabled = true;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Submitted';
            
            this.handleClozeAnswer(input.value, word);
        };
        
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                submitAnswer();
            }
        });
        
        submitBtn.addEventListener('click', submitAnswer);
        
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
            this.handleCorrectAnswer(word);
        } else {
            btn.classList.add('incorrect');
            this.handleIncorrectAnswer(word);
        }

        setTimeout(() => this.nextQuizQuestion(), 1500);
    },

    /**
     * Handle cloze answer
     */
    handleClozeAnswer(answer, word) {
        const input = document.getElementById('clozeInput');
        const isCorrect = answer.toLowerCase().trim() === word.word.toLowerCase();

        if (isCorrect) {
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
     * Handle correct answer
     */
    handleCorrectAnswer(word) {
        this.quizScore++;
    },

    /**
     * Handle incorrect answer
     */
    handleIncorrectAnswer(word) {
        this.incorrectWords.push(word);
        this.quizHasWrongAnswer = true;
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
    },

    /**
     * Show results screen
     */
    showResults() {
        const total = this.quizWords.length;
        const accuracy = Math.round((this.quizScore / total) * 100);
        
        let earnedXP = 0;
        
        // Only award XP if accuracy >= 80%
        if (accuracy >= 80) {
            earnedXP = this.quizScore * 10;
            
            if (this.quizScore === total) {
                earnedXP += 25;
            }
            
            Storage.addXP(earnedXP);
            
            // Update word progress and check for mastery
            this.quizWords.forEach(word => {
                const wasCorrect = !this.incorrectWords.find(w => w.word === word.word);
                const wasMastered = Storage.updateWordProgress(word.word, wasCorrect);
                
                if (wasMastered) {
                    Storage.addXP(20);
                    earnedXP += 20;
                    this.celebrate(`"${word.word}" Mastered! 🌟`, '⭐');
                }
            });
        }
        
        // Add incorrect words to practice list
        this.incorrectWords.forEach(word => {
            Storage.addToPractice(word.word);
        });
        
        this.sessionXP = earnedXP;

        // Update UI
        document.getElementById('resultsIcon').textContent = 
            accuracy >= 80 ? '🎉' : accuracy >= 50 ? '👍' : '💪';
        document.getElementById('resultsTitle').textContent = 
            accuracy >= 80 ? 'Excellent!' : accuracy >= 50 ? 'Good Job!' : 'Keep Practicing!';
        document.getElementById('resultScore').textContent = `${this.quizScore}/${total}`;
        document.getElementById('resultXP').textContent = accuracy >= 80 ? `+${this.sessionXP}` : '+0';
        document.getElementById('resultAccuracy').textContent = `${accuracy}%`;
        
        const xpNote = document.getElementById('xpNote');
        if (xpNote) {
            xpNote.textContent = accuracy < 80 ? 'Score 80%+ to earn XP!' : '';
            xpNote.style.display = accuracy < 80 ? 'block' : 'none';
        }

        // Update streak: increment on 100% accuracy, reset otherwise
        if (accuracy === 100) {
            Storage.incrementStreak();
        } else {
            Storage.resetStreak();
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
     * Check if word is mastered
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
                // Update dream home progress
                this.updateDreamHomeProgress();
            }
        }
    },

    // ==================== ANALOGY TEST ====================
    
    /**
     * Start analogy test
     */
    startAnalogyTest() {
        const canTest = AnalogyGenerator.canTakeTest();
        
        if (!canTest.allowed) {
            if (canTest.reason === 'unlock') {
                alert(`🧩 Analogy Test Locked!\n\nYou need to master 100 words to unlock this SSAT-style test.\n\nCurrent progress: ${canTest.masteredCount}/100 words mastered.\n\nKeep learning to unlock this feature!`);
            } else if (canTest.reason === 'limit') {
                alert(`⏳ Test Limit Reached!\n\nYou've used all ${canTest.testsAllowed} available tests.\n\nMaster ${canTest.wordsToNextTest} more words to unlock 2 more tests!\n\n💡 Tip: At 450 mastered words, tests become unlimited!`);
            }
            return;
        }
        
        // Generate dynamic test from mastered words
        const testResult = AnalogyGenerator.generateTest();
        
        if (testResult.error) {
            alert(`Error generating test: ${testResult.error}`);
            return;
        }
        
        // Reset analogy test state
        this.analogyQuestions = testResult.questions;
        this.analogyIndex = 0;
        this.analogyScore = 0;
        this.analogyAnswered = false;
        
        this.showView('analogyScreen');
        this.renderAnalogyQuestion();
    },
    
    /**
     * Render current analogy question
     */
    renderAnalogyQuestion() {
        const question = this.analogyQuestions[this.analogyIndex];
        const container = document.getElementById('analogyContent');
        
        // Update progress
        const progressPercent = ((this.analogyIndex) / 10) * 100;
        document.getElementById('analogyProgressFill').style.width = `${progressPercent}%`;
        document.getElementById('analogyScoreDisplay').textContent = this.analogyScore;
        
        container.innerHTML = `
            <div class="analogy-card">
                <div class="analogy-number">Question ${this.analogyIndex + 1} of 10</div>
                <div class="analogy-stem">
                    <span class="stem-highlight">${question.questionText}</span>
                </div>
                <div class="analogy-options">
                    ${question.options.map(opt => `
                        <button class="analogy-option" data-letter="${opt.letter}" data-correct="${opt.isCorrect}">
                            <span class="option-letter">(${opt.letter})</span>
                            <span class="option-text">${opt.text}</span>
                        </button>
                    `).join('')}
                </div>
            </div>
        `;
        
        this.analogyAnswered = false;
        
        // Bind option clicks
        container.querySelectorAll('.analogy-option').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleAnalogyAnswer(e));
        });
    },
    
    /**
     * Handle analogy answer selection
     */
    handleAnalogyAnswer(e) {
        if (this.analogyAnswered) return;
        this.analogyAnswered = true;
        
        const btn = e.currentTarget;
        const isCorrect = btn.dataset.correct === 'true';
        
        // Disable all buttons and show correct/incorrect
        document.querySelectorAll('.analogy-option').forEach(b => {
            b.disabled = true;
            if (b.dataset.correct === 'true') {
                b.classList.add('correct');
            }
        });
        
        if (isCorrect) {
            btn.classList.add('correct');
            this.analogyScore++;
            document.getElementById('analogyScoreDisplay').textContent = this.analogyScore;
        } else {
            btn.classList.add('incorrect');
        }
        
        // Move to next question after delay
        setTimeout(() => {
            this.analogyIndex++;
            if (this.analogyIndex < 10) {
                this.renderAnalogyQuestion();
            } else {
                this.showAnalogyResults();
            }
        }, 1500);
    },
    
    /**
     * Show analogy test results
     */
    showAnalogyResults() {
        const total = 10;
        const accuracy = Math.round((this.analogyScore / total) * 100);
        let earnedXP = 0;
        
        // Record that a test was taken
        AnalogyGenerator.recordTestTaken();
        
        // Award XP only if 80%+ accuracy
        if (accuracy >= 80) {
            earnedXP = 100;
            Storage.addXP(earnedXP);
        }
        
        // Update progress bar to full
        document.getElementById('analogyProgressFill').style.width = '100%';
        
        // Update UI
        document.getElementById('analogyResultsIcon').textContent = 
            accuracy >= 80 ? '🏆' : accuracy >= 50 ? '🧩' : '📚';
        document.getElementById('analogyResultsTitle').textContent = 
            accuracy >= 80 ? 'Excellent Work!' : accuracy >= 50 ? 'Good Effort!' : 'Keep Practicing!';
        document.getElementById('analogyResultScore').textContent = `${this.analogyScore}/${total}`;
        document.getElementById('analogyResultXP').textContent = accuracy >= 80 ? `+${earnedXP}` : '+0';
        document.getElementById('analogyResultAccuracy').textContent = `${accuracy}%`;
        
        const xpNote = document.getElementById('analogyXpNote');
        if (xpNote) {
            xpNote.textContent = accuracy < 80 ? 'Score 80%+ to earn XP!' : '';
            xpNote.style.display = accuracy < 80 ? 'block' : 'none';
        }
        
        this.showView('analogyResultsScreen');
        this.updateStats();
    },

    /**
     * Show skill galaxy
     */
    showSkillGalaxy() {
        this.showView('skillGalaxyScreen');
        this.renderSkillGalaxy();
    },

    /**
     * Render skill galaxy
     */
    renderSkillGalaxy() {
        const container = document.getElementById('skillGalaxyContainer');
        const progress = Storage.getProgress();
        const levels = [1, 2, 3];
        const levelNames = ['🌱 Explorer', '⚡ Adventurer', '🔥 Champion'];

        container.innerHTML = levels.map((level, i) => {
            const words = Vocabulary.getByLevel(level);
            const mastered = words.filter(w => progress.masteredWords.includes(w.word)).length;
            
            return `
                <div class="galaxy-level">
                    <h3>
                        ${levelNames[i]}
                        <span class="level-progress-text">${mastered} / ${words.length} mastered</span>
                    </h3>
                    <div class="constellation">
                        ${words.map(word => {
                            const isMastered = progress.masteredWords.includes(word.word);
                            const hasProgress = progress.wordScores[word.word];
                            const status = isMastered ? 'mastered' : hasProgress ? 'available' : 'locked';
                            return `<div class="star-node ${status}" data-word="${word.word}" title="${word.word}">${word.word.charAt(0).toUpperCase()}</div>`;
                        }).join('')}
                    </div>
                </div>
            `;
        }).join('');

        // Add click handlers to star nodes
        container.querySelectorAll('.star-node').forEach(node => {
            node.addEventListener('click', () => {
                const wordStr = node.dataset.word;
                const word = Vocabulary.getWord(wordStr);
                if (word) {
                    this.showWordDetail(word);
                }
            });
        });
    },

    /**
     * Show word detail popup
     */
    showWordDetail(word) {
        const progress = Storage.getProgress();
        const isMastered = progress.masteredWords.includes(word.word);
        const score = progress.wordScores[word.word] || 0;
        
        const statusText = isMastered ? '⭐ Mastered' : score > 0 ? `📊 Progress: ${score}/3` : '🔒 Not started';
        const statusClass = isMastered ? 'mastered' : score > 0 ? 'in-progress' : 'locked';
        
        const modal = document.createElement('div');
        modal.className = 'word-detail-modal';
        modal.innerHTML = `
            <div class="word-detail-overlay"></div>
            <div class="word-detail-card">
                <button class="word-detail-close">&times;</button>
                <div class="word-detail-header">
                    <h2>${word.word}</h2>
                    <span class="word-detail-status ${statusClass}">${statusText}</span>
                </div>
                <div class="word-detail-body">
                    <p class="word-detail-definition">${word.simplified_definition}</p>
                    <p class="word-detail-example">"${word.example_sentence}"</p>
                    ${word.synonyms ? `<p class="word-detail-synonyms"><strong>Synonyms:</strong> ${word.synonyms.join(', ')}</p>` : ''}
                </div>
                <div class="word-detail-level">Level ${word.difficulty_level} ${['', '🌱', '⚡', '🔥'][word.difficulty_level]}</div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Close handlers
        modal.querySelector('.word-detail-close').addEventListener('click', () => modal.remove());
        modal.querySelector('.word-detail-overlay').addEventListener('click', () => modal.remove());
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
        
        this.updateCollectionPreview();
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

        document.getElementById('progressPercent').textContent = `${percentage}%`;
        document.getElementById('learnedCount').textContent = mastered;
        document.getElementById('totalWords').textContent = total;

        // Update progress ring
        const circumference = 2 * Math.PI * 52;
        const offset = circumference - (percentage / 100) * circumference;
        const ring = document.getElementById('progressRing');
        if (ring) {
            ring.style.strokeDashoffset = offset;
        }

        // Update milestone markers
        const milestones = [25, 50, 75, 100];
        document.querySelectorAll('.marker').forEach(marker => {
            const value = parseInt(marker.dataset.value);
            marker.classList.toggle('reached', percentage >= value);
        });

        // Update milestone fill
        const milestoneFill = document.getElementById('milestoneFill');
        if (milestoneFill) {
            milestoneFill.style.width = `${percentage}%`;
        }
    },

    /**
     * Update level counts and mastered counts
     */
    updateLevelCounts() {
        const progress = Storage.getProgress();
        const masteredWords = progress.masteredWords || [];
        
        [1, 2, 3].forEach(level => {
            const levelWords = Vocabulary.getByLevel(level);
            const totalCount = levelWords.length;
            const masteredCount = levelWords.filter(w => masteredWords.includes(w.word)).length;
            
            // Update total word count
            const countEl = document.getElementById(`level${level}Count`);
            if (countEl) {
                countEl.textContent = totalCount;
            }
            
            // Update mastered count
            const masteredEl = document.getElementById(`level${level}Mastered`);
            if (masteredEl) {
                masteredEl.textContent = masteredCount;
            }
        });
        
        // Update analogy test button status
        this.updateAnalogyButtonStatus();
    },
    
    /**
     * Update analogy test button lock status
     */
    updateAnalogyButtonStatus() {
        const progress = Storage.getProgress();
        const masteredCount = (progress.masteredWords || []).length;
        const REQUIRED = 100;
        const isUnlocked = masteredCount >= REQUIRED;
        
        const btn = document.getElementById('analogyTestBtnMain');
        const lockStatus = document.getElementById('analogyLockStatus');
        
        if (btn) {
            btn.classList.toggle('unlocked', isUnlocked);
            
            // Add warning style if at limit
            const canTest = AnalogyGenerator.canTakeTest();
            btn.classList.toggle('at-limit', canTest.reason === 'limit');
        }
        
        if (lockStatus) {
            lockStatus.textContent = AnalogyGenerator.getStatusText();
        }
    },

    /**
     * Update collection preview
     */
    updateCollectionPreview() {
        const owned = Storage.getOwnedItems();
        const container = document.getElementById('collectionPreview');
        const countEl = document.getElementById('collectionOwned');
        
        if (countEl) {
            countEl.textContent = owned.length;
        }
        
        if (!container) return;

        if (owned.length === 0) {
            container.innerHTML = '<p class="empty-collection">Start learning to earn XP and buy collectibles!</p>';
            return;
        }

        const items = owned.slice(0, 8).map(id => {
            const item = COLLECTIBLES_DATA.items.find(i => i.id === id);
            return item ? `<div class="collection-item-preview">${item.emoji}</div>` : '';
        }).join('');

        container.innerHTML = items;
    },

    /**
     * Show random tip
     */
    showRandomTip() {
        const tips = [
            "Learn 5 words a day = 150+ words in a month!",
            "Review words you marked 'Need Practice' in Quick Review mode.",
            "Score 80%+ on quizzes to earn XP rewards!",
            "Check your progress in the Skill Galaxy.",
            "Mastering a word gives you bonus XP!",
            "Consistency beats intensity - study a little every day.",
            "Use context clues from example sentences.",
            "Synonyms help you remember word meanings.",
            "Visit the Shop to spend your hard-earned XP!",
            "Perfect score on a quiz = bonus 25 XP!"
        ];
        
        const tip = tips[Math.floor(Math.random() * tips.length)];
        document.getElementById('dailyTip').textContent = tip;
    },

    /**
     * Celebrate achievement
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
     * Shuffle array
     */
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    },

    /**
     * Initialize Dream Home section with interactive slider
     */
    initDreamHome() {
        this.updateDreamHomeProgress();
        this.initImageComparison();
    },

    /**
     * Update Dream Home progress based on mastered words
     */
    updateDreamHomeProgress() {
        const progress = Storage.getProgress();
        const totalWords = 500;
        const masteredCount = progress.masteredWords.length;
        const percent = Math.round((masteredCount / totalWords) * 100);
        
        // Update progress bar
        const fillEl = document.getElementById('dreamHomeFill');
        const percentEl = document.getElementById('dreamHomePercent');
        const headerPercentEl = document.getElementById('dhHeaderPercent');
        
        if (fillEl) fillEl.style.width = `${percent}%`;
        if (percentEl) percentEl.textContent = percent;
        if (headerPercentEl) headerPercentEl.textContent = `${percent}%`;
        
        // Update stats
        const wordsLearnedEl = document.getElementById('dhWordsLearned');
        const elementsEarnedEl = document.getElementById('dhElementsEarned');
        const wordsRemainingEl = document.getElementById('dhWordsRemaining');
        
        if (wordsLearnedEl) wordsLearnedEl.textContent = masteredCount;
        if (elementsEarnedEl) elementsEarnedEl.textContent = Storage.getOwnedItems().length; // Elements from shop
        if (wordsRemainingEl) wordsRemainingEl.textContent = totalWords - masteredCount;
        
        // Update slider position based on progress (reveal more of the view)
        this.updateComparisonSlider(percent);
        
        // Also update mini version if exists
        this.updateMiniDreamHome();
    },

    /**
     * Update the comparison slider to reflect progress
     */
    updateComparisonSlider(percent) {
        const slider = document.getElementById('comparisonSlider');
        const before = document.getElementById('comparisonBefore');
        
        if (!slider || !before) return;
        
        // As progress increases, reveal more of the house (after image)
        // Start at 50%, end at showing full house at 100%
        const sliderPos = 50 - (percent * 0.5); // 50% -> 0% as progress goes 0% -> 100%
        
        slider.style.left = `${sliderPos}%`;
        // Set both webkit and standard clip-path for Safari/iPad compatibility
        before.style.webkitClipPath = `inset(0 ${100 - sliderPos}% 0 0)`;
        before.style.clipPath = `inset(0 ${100 - sliderPos}% 0 0)`;
    },

    /**
     * Initialize the interactive image comparison slider
     */
    initImageComparison() {
        const container = document.getElementById('imageComparison');
        const slider = document.getElementById('comparisonSlider');
        const before = document.getElementById('comparisonBefore');
        
        if (!container || !slider || !before) return;
        
        let isDragging = false;
        
        const updateSliderPosition = (x) => {
            const rect = container.getBoundingClientRect();
            let pos = ((x - rect.left) / rect.width) * 100;
            
            // Clamp between 0 and 100
            pos = Math.max(0, Math.min(100, pos));
            
            slider.style.left = `${pos}%`;
            // Set both webkit and standard clip-path for Safari/iPad compatibility
            before.style.webkitClipPath = `inset(0 ${100 - pos}% 0 0)`;
            before.style.clipPath = `inset(0 ${100 - pos}% 0 0)`;
        };
        
        // Mouse events
        container.addEventListener('mousedown', (e) => {
            isDragging = true;
            updateSliderPosition(e.clientX);
            container.style.cursor = 'grabbing';
        });
        
        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            updateSliderPosition(e.clientX);
        });
        
        document.addEventListener('mouseup', () => {
            isDragging = false;
            container.style.cursor = 'ew-resize';
        });
        
        // Touch events for mobile
        container.addEventListener('touchstart', (e) => {
            isDragging = true;
            updateSliderPosition(e.touches[0].clientX);
        }, { passive: true });
        
        container.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            updateSliderPosition(e.touches[0].clientX);
        }, { passive: true });
        
        container.addEventListener('touchend', () => {
            isDragging = false;
        });
        
        // Click to position
        container.addEventListener('click', (e) => {
            updateSliderPosition(e.clientX);
        });
    },

    /**
     * Toggle main dream home collapsed state
     */
    toggleDreamHome() {
        const section = document.querySelector('.dream-home-section');
        if (section) {
            section.classList.toggle('collapsed');
        }
    },

    /**
     * Toggle mini dream home collapsed state
     */
    toggleMiniDreamHome() {
        const container = document.getElementById('miniDreamHome');
        if (container) {
            container.classList.toggle('collapsed');
        }
    },

    /**
     * Update mini dream home preview on collection page
     */
    updateMiniDreamHome() {
        const progress = Storage.getProgress();
        const totalWords = 500;
        const masteredCount = progress.masteredWords.length;
        const percent = Math.round((masteredCount / totalWords) * 100);
        
        // Update percent display
        const percentEl = document.getElementById('miniDhPercent');
        if (percentEl) percentEl.textContent = `${percent}%`;
        
        // Update mini slider position
        const slider = document.getElementById('miniComparisonSlider');
        const before = document.getElementById('miniComparisonBefore');
        
        if (slider && before) {
            const sliderPos = 50 - (percent * 0.5);
            slider.style.left = `${sliderPos}%`;
            // Set both webkit and standard clip-path for Safari/iPad compatibility
            before.style.webkitClipPath = `inset(0 ${100 - sliderPos}% 0 0)`;
            before.style.clipPath = `inset(0 ${100 - sliderPos}% 0 0)`;
        }
    },

    /**
     * Initialize mini image comparison slider on collection page
     */
    initMiniImageComparison() {
        const container = document.getElementById('miniImageComparison');
        const slider = document.getElementById('miniComparisonSlider');
        const before = document.getElementById('miniComparisonBefore');
        
        if (!container || !slider || !before) return;
        
        let isDragging = false;
        
        const updateSliderPosition = (x) => {
            const rect = container.getBoundingClientRect();
            let pos = ((x - rect.left) / rect.width) * 100;
            pos = Math.max(0, Math.min(100, pos));
            
            slider.style.left = `${pos}%`;
            // Set both webkit and standard clip-path for Safari/iPad compatibility
            before.style.webkitClipPath = `inset(0 ${100 - pos}% 0 0)`;
            before.style.clipPath = `inset(0 ${100 - pos}% 0 0)`;
        };
        
        // Mouse events
        container.addEventListener('mousedown', (e) => {
            isDragging = true;
            updateSliderPosition(e.clientX);
            container.style.cursor = 'grabbing';
        });
        
        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            updateSliderPosition(e.clientX);
        });
        
        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                container.style.cursor = 'ew-resize';
            }
        });
        
        // Touch events
        container.addEventListener('touchstart', (e) => {
            isDragging = true;
            updateSliderPosition(e.touches[0].clientX);
        }, { passive: true });
        
        container.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            updateSliderPosition(e.touches[0].clientX);
        }, { passive: true });
        
        container.addEventListener('touchend', () => {
            isDragging = false;
        });
        
        // Click to position
        container.addEventListener('click', (e) => {
            updateSliderPosition(e.clientX);
        });
    }
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
