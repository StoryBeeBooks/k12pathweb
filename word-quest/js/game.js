/**
 * Word Quest - Game Module
 * Handles learning and quiz game mechanics
 */

const Game = {
    // Current session state
    session: {
        mode: null,           // 'learn' or 'quiz'
        level: 1,
        words: [],
        currentIndex: 0,
        correct: 0,
        xpEarned: 0,
        wrongWords: []
    },

    // XP rewards
    XP: {
        LEARN_WORD: 5,
        QUIZ_CORRECT: 10,
        QUIZ_PERFECT: 25,
        STREAK_BONUS: 5,
        MASTERY_BONUS: 20
    },

    /**
     * Start a learning session
     */
    startLearning(level = null) {
        const settings = Storage.getSettings();
        const sessionSize = settings.sessionSize || 5;

        // Get words for the session
        let words = [];
        
        // Mix of new words and review words
        const newWords = Storage.getNewWords(Vocabulary.getAll(), level, Math.ceil(sessionSize * 0.7));
        const reviewWords = Storage.getWordsNeedingReview(Vocabulary.getAll(), Math.floor(sessionSize * 0.3));
        
        words = [...newWords, ...reviewWords];
        
        // If not enough words, get more from the level
        if (words.length < sessionSize) {
            const levelWords = level ? Vocabulary.getByLevel(level) : Vocabulary.getAll();
            const unmastered = levelWords.filter(w => !Storage.isWordMastered(w.word));
            const additional = Storage.shuffle(unmastered).slice(0, sessionSize - words.length);
            words = [...words, ...additional];
        }

        // Shuffle the final list
        words = Storage.shuffle(words).slice(0, sessionSize);

        if (words.length === 0) {
            alert('Great job! You\'ve mastered all available words at this level!');
            return false;
        }

        // Initialize session
        this.session = {
            mode: 'learn',
            level: level || 'mixed',
            words: words,
            currentIndex: 0,
            correct: 0,
            xpEarned: 0,
            wrongWords: []
        };

        // Show learn screen
        App.showScreen('learnScreen');
        this.showCurrentLearnCard();

        return true;
    },

    /**
     * Show current flashcard in learn mode
     */
    showCurrentLearnCard() {
        const word = this.session.words[this.session.currentIndex];
        if (!word) return;

        // Update progress
        document.getElementById('sessionCurrent').textContent = this.session.currentIndex + 1;
        document.getElementById('sessionTotal').textContent = this.session.words.length;
        document.getElementById('sessionXP').textContent = this.session.xpEarned;

        // Update card content
        document.getElementById('wordText').textContent = word.word;
        document.getElementById('definitionSimple').textContent = word.simplified_definition;
        document.getElementById('definitionFormal').textContent = word.definition;
        document.getElementById('synonymsList').textContent = word.synonyms.join(', ');
        document.getElementById('exampleSentence').textContent = `"${word.example_sentence}"`;

        // Reset card flip
        const flashcard = document.getElementById('flashcard');
        flashcard.classList.remove('flipped');
    },

    /**
     * Handle "Got It" in learn mode
     */
    handleGotIt() {
        const word = this.session.words[this.session.currentIndex];
        
        // Update score and check if mastered
        const wasMastered = Storage.updateWordScore(word.word, true);
        this.session.xpEarned += this.XP.LEARN_WORD;
        Storage.addXP(this.XP.LEARN_WORD);

        // Check for mastery
        if (wasMastered) {
            this.session.xpEarned += this.XP.MASTERY_BONUS;
            Storage.addXP(this.XP.MASTERY_BONUS);
            App.showCelebration(`🎉 "${word.word}" Mastered!`);
        }

        this.nextLearnCard();
    },

    /**
     * Handle "Need Practice" in learn mode
     */
    handleNeedPractice() {
        const word = this.session.words[this.session.currentIndex];
        
        // Add to wrong words for review
        this.session.wrongWords.push(word);
        
        // Small XP for attempting
        this.session.xpEarned += 2;
        Storage.addXP(2);

        this.nextLearnCard();
    },

    /**
     * Move to next card in learn mode
     */
    nextLearnCard() {
        this.session.currentIndex++;

        if (this.session.currentIndex >= this.session.words.length) {
            // Session complete - start quiz on learned words
            this.startQuiz(this.session.words);
        } else {
            this.showCurrentLearnCard();
        }
    },

    /**
     * Start a quiz
     */
    startQuiz(words = null) {
        const settings = Storage.getSettings();
        
        if (!words) {
            // Get quiz words - mix of mastered and learning
            const allWords = Vocabulary.getAll();
            const progress = Storage.getProgress();
            
            // Prioritize words that need review
            const reviewWords = Storage.getWordsNeedingReview(allWords, 5);
            const masteredWords = Storage.shuffle(
                allWords.filter(w => progress.masteredWords.includes(w.word))
            ).slice(0, 3);
            const otherWords = Storage.shuffle(
                allWords.filter(w => 
                    !progress.masteredWords.includes(w.word) && 
                    !reviewWords.find(r => r.word === w.word)
                )
            ).slice(0, 2);
            
            words = Storage.shuffle([...reviewWords, ...masteredWords, ...otherWords]);
        }

        words = words.slice(0, settings.quizSize || 10);

        if (words.length === 0) {
            alert('No words available for quiz. Learn some words first!');
            App.showScreen('homeScreen');
            return false;
        }

        // Initialize quiz session
        this.session = {
            mode: 'quiz',
            level: this.session.level,
            words: words,
            currentIndex: 0,
            correct: 0,
            xpEarned: 0,
            wrongWords: []
        };

        // Show quiz screen
        App.showScreen('quizScreen');
        this.showCurrentQuizQuestion();

        return true;
    },

    /**
     * Show current quiz question
     */
    showCurrentQuizQuestion() {
        const word = this.session.words[this.session.currentIndex];
        if (!word) return;

        // Update progress
        document.getElementById('quizCurrent').textContent = this.session.currentIndex + 1;
        document.getElementById('quizTotal').textContent = this.session.words.length;
        document.getElementById('quizCorrect').textContent = this.session.correct;

        // Hide feedback
        document.getElementById('quizFeedback').classList.add('hidden');

        // Randomly choose question type (70% multiple choice, 30% cloze)
        const questionType = Math.random() < 0.7 ? 'mc' : 'cloze';

        if (questionType === 'mc') {
            this.showMultipleChoiceQuestion(word);
        } else {
            this.showClozeQuestion(word);
        }
    },

    /**
     * Show multiple choice question
     */
    showMultipleChoiceQuestion(word) {
        document.getElementById('mcQuestion').classList.remove('hidden');
        document.getElementById('clozeQuestion').classList.add('hidden');

        document.getElementById('quizWord').textContent = word.word;

        // Generate answer options
        const correctAnswer = word.simplified_definition;
        const wrongAnswers = this.getWrongDefinitions(word, 3);
        
        const options = Storage.shuffle([correctAnswer, ...wrongAnswers]);

        const optionsContainer = document.getElementById('answerOptions');
        const buttons = optionsContainer.querySelectorAll('.answer-btn');
        const letters = ['A', 'B', 'C', 'D'];

        buttons.forEach((btn, i) => {
            btn.querySelector('.answer-letter').textContent = letters[i];
            btn.querySelector('.answer-text').textContent = options[i];
            btn.classList.remove('correct', 'incorrect');
            btn.disabled = false;
            btn.dataset.correct = options[i] === correctAnswer ? 'true' : 'false';
        });
    },

    /**
     * Get wrong definitions for multiple choice
     */
    getWrongDefinitions(currentWord, count) {
        const allWords = Vocabulary.getAll();
        const otherWords = allWords.filter(w => w.word !== currentWord.word);
        const shuffled = Storage.shuffle(otherWords);
        return shuffled.slice(0, count).map(w => w.simplified_definition);
    },

    /**
     * Show cloze (fill-in-the-blank) question
     */
    showClozeQuestion(word) {
        document.getElementById('mcQuestion').classList.add('hidden');
        document.getElementById('clozeQuestion').classList.remove('hidden');

        // Parse cloze sentence
        const sentence = word.cloze_sentence;
        const sentenceHtml = sentence.replace('_____', '<span class="cloze-blank">_____</span>');
        document.getElementById('clozeSentence').innerHTML = sentenceHtml;

        // Set hint
        document.querySelector('#clozeHint .hint-text').textContent = word.simplified_definition;

        // Clear input
        const input = document.getElementById('clozeInput');
        input.value = '';
        input.dataset.answer = word.word;
        input.focus();
    },

    /**
     * Handle multiple choice answer
     */
    handleMCAnswer(button) {
        const word = this.session.words[this.session.currentIndex];
        const isCorrect = button.dataset.correct === 'true';

        // Disable all buttons
        document.querySelectorAll('.answer-btn').forEach(btn => {
            btn.disabled = true;
            if (btn.dataset.correct === 'true') {
                btn.classList.add('correct');
            }
        });

        if (isCorrect) {
            button.classList.add('correct');
            this.handleCorrectAnswer(word);
        } else {
            button.classList.add('incorrect');
            this.handleWrongAnswer(word);
        }
    },

    /**
     * Handle cloze answer
     */
    handleClozeAnswer() {
        const input = document.getElementById('clozeInput');
        const userAnswer = input.value.trim().toLowerCase();
        const correctAnswer = input.dataset.answer.toLowerCase();
        const word = this.session.words[this.session.currentIndex];

        // Check answer (allow some flexibility)
        const isCorrect = userAnswer === correctAnswer || 
                          this.levenshteinDistance(userAnswer, correctAnswer) <= 1;

        if (isCorrect) {
            this.handleCorrectAnswer(word);
        } else {
            this.handleWrongAnswer(word);
        }
    },

    /**
     * Handle correct answer
     */
    handleCorrectAnswer(word) {
        this.session.correct++;
        this.session.xpEarned += this.XP.QUIZ_CORRECT;
        Storage.addXP(this.XP.QUIZ_CORRECT);
        
        // Update score and check if word was just mastered
        const wasMastered = Storage.updateWordScore(word.word, true);

        // Play success sound
        Audio.playSuccess();

        // Check for mastery (either just now or previously)
        if (wasMastered) {
            this.session.xpEarned += this.XP.MASTERY_BONUS;
            Storage.addXP(this.XP.MASTERY_BONUS);
            App.showCelebration(`🎉 "${word.word}" Mastered!`);
        }

        this.showQuizFeedback(true, word);
    },

    /**
     * Handle wrong answer
     */
    handleWrongAnswer(word) {
        this.session.wrongWords.push(word);
        Storage.updateWordScore(word.word, false);

        // Play error sound
        Audio.playError();

        this.showQuizFeedback(false, word);
    },

    /**
     * Show feedback after answer
     */
    showQuizFeedback(correct, word) {
        const feedback = document.getElementById('quizFeedback');
        feedback.classList.remove('hidden');
        
        document.getElementById('mcQuestion').classList.add('hidden');
        document.getElementById('clozeQuestion').classList.add('hidden');

        const icon = document.getElementById('feedbackIcon');
        const message = document.getElementById('feedbackMessage');
        const wordInfo = document.getElementById('feedbackWord');

        if (correct) {
            icon.textContent = '✓';
            icon.className = 'feedback-icon success';
            message.textContent = this.getCorrectMessage();
        } else {
            icon.textContent = '✗';
            icon.className = 'feedback-icon error';
            message.textContent = this.getWrongMessage();
        }

        wordInfo.innerHTML = `<strong>${word.word}</strong> = ${word.simplified_definition}`;
    },

    /**
     * Get random correct message
     */
    getCorrectMessage() {
        const messages = [
            'Correct! 🎉',
            'Great job! ⭐',
            'You got it! 🚀',
            'Excellent! 💫',
            'Perfect! 🌟',
            'Amazing! 🎯',
            'Well done! 👏'
        ];
        return messages[Math.floor(Math.random() * messages.length)];
    },

    /**
     * Get random wrong message
     */
    getWrongMessage() {
        const messages = [
            'Not quite, but keep trying!',
            'Almost! Let\'s learn this one.',
            'Good try! Here\'s the answer:',
            'Keep going! You\'ll get it next time.',
            'No worries! Now you know.'
        ];
        return messages[Math.floor(Math.random() * messages.length)];
    },

    /**
     * Move to next quiz question
     */
    nextQuizQuestion() {
        this.session.currentIndex++;

        if (this.session.currentIndex >= this.session.words.length) {
            this.showQuizResults();
        } else {
            this.showCurrentQuizQuestion();
        }
    },

    /**
     * Show quiz results
     */
    showQuizResults() {
        const total = this.session.words.length;
        const correct = this.session.correct;
        const accuracy = Math.round((correct / total) * 100);

        // Bonus for perfect score
        if (correct === total) {
            this.session.xpEarned += this.XP.QUIZ_PERFECT;
            Storage.addXP(this.XP.QUIZ_PERFECT);
        }

        // Update streak
        Storage.incrementStreak();
        Storage.recordQuizResults(correct, total);

        // Show results screen
        App.showScreen('resultsScreen');

        // Update results display
        const resultsIcon = document.getElementById('resultsIcon');
        const resultsTitle = document.getElementById('resultsTitle');

        if (accuracy >= 90) {
            resultsIcon.textContent = '🏆';
            resultsTitle.textContent = 'Outstanding!';
            Audio.playLevelUp();
        } else if (accuracy >= 70) {
            resultsIcon.textContent = '🎉';
            resultsTitle.textContent = 'Great Job!';
            Audio.playSuccess();
        } else if (accuracy >= 50) {
            resultsIcon.textContent = '👍';
            resultsTitle.textContent = 'Good Effort!';
        } else {
            resultsIcon.textContent = '💪';
            resultsTitle.textContent = 'Keep Practicing!';
        }

        document.getElementById('resultScore').textContent = `${correct}/${total}`;
        document.getElementById('resultXP').textContent = `+${this.session.xpEarned}`;
        document.getElementById('resultAccuracy').textContent = `${accuracy}%`;

        // Show words to review
        const reviewList = document.getElementById('reviewList');
        const wordsReview = document.getElementById('wordsReview');

        if (this.session.wrongWords.length > 0) {
            wordsReview.classList.remove('hidden');
            reviewList.innerHTML = this.session.wrongWords
                .map(w => `<span class="review-word">${w.word}</span>`)
                .join('');
        } else {
            wordsReview.classList.add('hidden');
        }

        // Update home screen stats
        App.updateStats();

        // Refresh skill tree
        if (typeof SkillTree !== 'undefined') {
            SkillTree.refresh();
        }
    },

    /**
     * Retry the quiz with the same words
     */
    retryQuiz() {
        this.startQuiz(this.session.words);
    },

    /**
     * Calculate Levenshtein distance for fuzzy matching
     */
    levenshteinDistance(a, b) {
        if (a.length === 0) return b.length;
        if (b.length === 0) return a.length;

        const matrix = [];

        for (let i = 0; i <= b.length; i++) {
            matrix[i] = [i];
        }

        for (let j = 0; j <= a.length; j++) {
            matrix[0][j] = j;
        }

        for (let i = 1; i <= b.length; i++) {
            for (let j = 1; j <= a.length; j++) {
                if (b.charAt(i - 1) === a.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1,
                        matrix[i][j - 1] + 1,
                        matrix[i - 1][j] + 1
                    );
                }
            }
        }

        return matrix[b.length][a.length];
    }
};
