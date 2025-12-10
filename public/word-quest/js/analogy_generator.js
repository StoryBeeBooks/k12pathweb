/**
 * Word Quest - Dynamic Analogy Generator
 * Generates SSAT-style analogy questions from mastered vocabulary
 * 
 * Features:
 * - Dynamic questions based on student's mastered words
 * - Test limit system to prevent XP farming
 * - Multiple relationship types (synonym, antonym, degree, etc.)
 */

const AnalogyGenerator = {
    // Relationship type definitions
    RELATIONSHIPS: {
        SYNONYM: 'synonym',
        ANTONYM: 'antonym',
        DEGREE: 'degree'
    },

    // Common antonym pairs for elementary vocabulary
    ANTONYM_PAIRS: [
        ['happy', 'sad'], ['big', 'small'], ['hot', 'cold'], ['fast', 'slow'],
        ['loud', 'quiet'], ['bright', 'dim'], ['hard', 'soft'], ['light', 'dark'],
        ['young', 'old'], ['new', 'ancient'], ['wet', 'dry'], ['full', 'empty'],
        ['strong', 'weak'], ['brave', 'afraid'], ['kind', 'cruel'], ['clean', 'dirty'],
        ['rich', 'poor'], ['thick', 'thin'], ['deep', 'shallow'], ['wide', 'narrow'],
        ['rough', 'smooth'], ['sharp', 'dull'], ['sweet', 'sour'], ['fresh', 'stale'],
        ['honest', 'dishonest'], ['gentle', 'fierce'], ['calm', 'anxious'], ['humble', 'proud'],
        ['rare', 'common'], ['ancient', 'modern'], ['brief', 'lengthy'], ['eager', 'reluctant'],
        ['abundant', 'scarce'], ['bold', 'timid'], ['cautious', 'reckless'], ['cozy', 'uncomfortable'],
        ['destroy', 'create'], ['expand', 'shrink'], ['ascend', 'descend'], ['accept', 'reject'],
        ['praise', 'criticize'], ['succeed', 'fail'], ['appear', 'vanish'], ['permit', 'forbid'],
        ['generous', 'stingy'], ['optimistic', 'pessimistic'], ['visible', 'invisible'], ['innocent', 'guilty'],
        ['flexible', 'rigid'], ['permanent', 'temporary'], ['polite', 'rude'], ['nervous', 'calm']
    ],

    // Degree relationships (lesser to greater intensity)
    DEGREE_GROUPS: [
        ['warm', 'hot', 'scorching'],
        ['cool', 'cold', 'freezing'],
        ['sad', 'unhappy', 'miserable'],
        ['happy', 'joyful', 'ecstatic'],
        ['big', 'large', 'enormous'],
        ['small', 'tiny', 'minuscule'],
        ['angry', 'mad', 'furious'],
        ['scared', 'afraid', 'terrified'],
        ['good', 'great', 'excellent'],
        ['bad', 'terrible', 'awful'],
        ['like', 'enjoy', 'love'],
        ['dislike', 'hate', 'despise'],
        ['tired', 'exhausted', 'drained'],
        ['hungry', 'starving', 'famished'],
        ['wet', 'soaked', 'drenched'],
        ['pretty', 'beautiful', 'gorgeous'],
        ['smart', 'clever', 'brilliant'],
        ['fast', 'quick', 'rapid'],
        ['slow', 'sluggish', 'crawling']
    ],

    /**
     * Get mastered vocabulary word objects
     */
    getMasteredVocabulary() {
        const progress = Storage.getProgress();
        const masteredWordStrings = progress.masteredWords || [];
        
        // Get full word objects for mastered words
        return VOCABULARY_DATA.filter(word => 
            masteredWordStrings.includes(word.word)
        );
    },

    /**
     * Calculate tests allowed based on mastered words
     * Formula: 20 tests at 100 words, +2 tests per 5 additional words
     * Unlimited at 450+ words
     */
    getTestsAllowed() {
        const progress = Storage.getProgress();
        const masteredCount = progress.masteredWords.length;
        
        if (masteredCount < 100) return 0;
        if (masteredCount >= 450) return Infinity;
        
        const base = 20;
        const additionalWords = masteredCount - 100;
        const bonusTests = Math.floor(additionalWords / 5) * 2;
        
        return base + bonusTests;
    },

    /**
     * Get tests taken count
     */
    getTestsTaken() {
        const progress = Storage.getProgress();
        return progress.analogyTestsTaken || 0;
    },

    /**
     * Get remaining tests
     */
    getTestsRemaining() {
        const allowed = this.getTestsAllowed();
        if (allowed === Infinity) return Infinity;
        const taken = this.getTestsTaken();
        return Math.max(0, allowed - taken);
    },

    /**
     * Check if student can take a test
     */
    canTakeTest() {
        const progress = Storage.getProgress();
        const masteredCount = progress.masteredWords.length;
        
        if (masteredCount < 100) return { allowed: false, reason: 'unlock', masteredCount };
        if (masteredCount >= 450) return { allowed: true, unlimited: true };
        
        const remaining = this.getTestsRemaining();
        if (remaining <= 0) {
            return { 
                allowed: false, 
                reason: 'limit', 
                testsAllowed: this.getTestsAllowed(),
                testsTaken: this.getTestsTaken(),
                wordsToNextTest: this.getWordsUntilNextTest()
            };
        }
        
        return { allowed: true, remaining };
    },

    /**
     * Calculate words needed until next test unlocks
     */
    getWordsUntilNextTest() {
        const progress = Storage.getProgress();
        const masteredCount = progress.masteredWords.length;
        
        if (masteredCount >= 400) return 0;
        
        // Find how many more words needed to unlock 2 more tests
        const currentBonus = Math.floor((masteredCount - 100) / 5) * 2;
        const nextBonus = currentBonus + 2;
        const wordsForNextBonus = 100 + Math.ceil(nextBonus / 2) * 5;
        
        return Math.max(0, wordsForNextBonus - masteredCount);
    },

    /**
     * Increment test count after completing a test
     */
    recordTestTaken() {
        const progress = Storage.getProgress();
        progress.analogyTestsTaken = (progress.analogyTestsTaken || 0) + 1;
        Storage.saveProgress(progress);
    },

    /**
     * Find synonym pairs from mastered words
     */
    findSynonymPairs(masteredWords) {
        const pairs = [];
        
        for (let i = 0; i < masteredWords.length; i++) {
            const word1 = masteredWords[i];
            if (!word1.synonyms || word1.synonyms.length === 0) continue;
            
            for (const synonym of word1.synonyms) {
                // Check if synonym is also in mastered words
                const word2 = masteredWords.find(w => 
                    w.word.toLowerCase() === synonym.toLowerCase()
                );
                
                if (word2) {
                    pairs.push({
                        type: this.RELATIONSHIPS.SYNONYM,
                        word1: word1.word,
                        word2: word2.word,
                        definition1: word1.simplified_definition,
                        definition2: word2.simplified_definition
                    });
                }
            }
        }
        
        return pairs;
    },

    /**
     * Find antonym pairs from mastered words
     */
    findAntonymPairs(masteredWords) {
        const pairs = [];
        const masteredWordStrings = masteredWords.map(w => w.word.toLowerCase());
        
        for (const [word1, word2] of this.ANTONYM_PAIRS) {
            const hasWord1 = masteredWordStrings.includes(word1);
            const hasWord2 = masteredWordStrings.includes(word2);
            
            if (hasWord1 && hasWord2) {
                pairs.push({
                    type: this.RELATIONSHIPS.ANTONYM,
                    word1: word1,
                    word2: word2
                });
            }
        }
        
        return pairs;
    },

    /**
     * Find degree relationship pairs from mastered words
     */
    findDegreePairs(masteredWords) {
        const pairs = [];
        const masteredWordStrings = masteredWords.map(w => w.word.toLowerCase());
        
        for (const group of this.DEGREE_GROUPS) {
            for (let i = 0; i < group.length - 1; i++) {
                if (masteredWordStrings.includes(group[i]) && 
                    masteredWordStrings.includes(group[i + 1])) {
                    pairs.push({
                        type: this.RELATIONSHIPS.DEGREE,
                        word1: group[i],
                        word2: group[i + 1]
                    });
                }
            }
        }
        
        return pairs;
    },

    /**
     * Generate a single analogy question
     */
    generateQuestion(stemPair, answerPair, allMasteredWords, usedWords) {
        // Create distractor options from other mastered words
        const distractors = this.generateDistractors(answerPair, allMasteredWords, usedWords, 4);
        
        // Build options array with correct answer and distractors
        const options = [
            { text: `${answerPair.word1} is to ${answerPair.word2}`, isCorrect: true }
        ];
        
        distractors.forEach(d => {
            options.push({ text: `${d.word1} is to ${d.word2}`, isCorrect: false });
        });
        
        // Shuffle options
        this.shuffleArray(options);
        
        // Assign letters
        const letters = ['A', 'B', 'C', 'D', 'E'];
        options.forEach((opt, i) => {
            opt.letter = letters[i];
        });
        
        return {
            questionText: `${stemPair.word1.toUpperCase()} is to ${stemPair.word2.toUpperCase()} as`,
            relationship: stemPair.type,
            options: options
        };
    },

    /**
     * Generate distractor word pairs
     */
    generateDistractors(correctPair, allMasteredWords, usedWords, count) {
        const distractors = [];
        const masteredWordStrings = allMasteredWords.map(w => w.word.toLowerCase());
        const used = new Set([
            ...usedWords,
            correctPair.word1.toLowerCase(),
            correctPair.word2.toLowerCase()
        ]);
        
        // Create random word pairs that don't share the same relationship
        const available = masteredWordStrings.filter(w => !used.has(w));
        
        // Shuffle available words
        this.shuffleArray(available);
        
        for (let i = 0; i + 1 < available.length && distractors.length < count; i += 2) {
            distractors.push({
                word1: available[i],
                word2: available[i + 1]
            });
            used.add(available[i]);
            used.add(available[i + 1]);
        }
        
        // If we don't have enough, add some common word pairs
        const fallbackPairs = [
            ['book', 'read'], ['car', 'drive'], ['food', 'eat'], ['water', 'drink'],
            ['pen', 'write'], ['bed', 'sleep'], ['sun', 'shine'], ['rain', 'fall'],
            ['bird', 'fly'], ['fish', 'swim'], ['dog', 'bark'], ['cat', 'meow']
        ];
        
        for (const pair of fallbackPairs) {
            if (distractors.length >= count) break;
            if (!used.has(pair[0]) && !used.has(pair[1])) {
                distractors.push({ word1: pair[0], word2: pair[1] });
            }
        }
        
        return distractors.slice(0, count);
    },

    /**
     * Generate a full test of 10 questions
     */
    generateTest() {
        const masteredWords = this.getMasteredVocabulary();
        
        if (masteredWords.length < 100) {
            return { error: 'Not enough mastered words', required: 100, current: masteredWords.length };
        }
        
        // Find all relationship pairs
        const synonymPairs = this.findSynonymPairs(masteredWords);
        const antonymPairs = this.findAntonymPairs(masteredWords);
        const degreePairs = this.findDegreePairs(masteredWords);
        
        // Combine all pairs
        let allPairs = [...synonymPairs, ...antonymPairs, ...degreePairs];
        
        // If not enough relationship pairs, create synonym-based questions using synonyms directly
        if (allPairs.length < 20) {
            // Add questions using word + its synonym (even if synonym not mastered)
            for (const word of masteredWords) {
                if (word.synonyms && word.synonyms.length >= 1) {
                    allPairs.push({
                        type: this.RELATIONSHIPS.SYNONYM,
                        word1: word.word,
                        word2: word.synonyms[0]
                    });
                }
            }
        }
        
        // Shuffle pairs
        this.shuffleArray(allPairs);
        
        // Generate 10 questions
        const questions = [];
        const usedWords = new Set();
        
        for (let i = 0; i < 10 && allPairs.length >= 2; i++) {
            // Get stem pair (the question)
            const stemPair = allPairs.shift();
            
            // Find answer pair with same relationship type
            let answerPairIndex = allPairs.findIndex(p => p.type === stemPair.type);
            
            // If no same-type pair, just use any pair
            if (answerPairIndex === -1 && allPairs.length > 0) {
                answerPairIndex = 0;
            }
            
            if (answerPairIndex === -1) {
                // Create a fallback answer pair using synonyms
                const availableWord = masteredWords.find(w => 
                    w.synonyms && 
                    w.synonyms.length > 0 && 
                    !usedWords.has(w.word.toLowerCase())
                );
                
                if (availableWord) {
                    const answerPair = {
                        type: this.RELATIONSHIPS.SYNONYM,
                        word1: availableWord.word,
                        word2: availableWord.synonyms[0]
                    };
                    
                    const question = this.generateQuestion(stemPair, answerPair, masteredWords, [...usedWords]);
                    questions.push(question);
                    
                    usedWords.add(stemPair.word1.toLowerCase());
                    usedWords.add(stemPair.word2.toLowerCase());
                    usedWords.add(answerPair.word1.toLowerCase());
                    usedWords.add(answerPair.word2.toLowerCase());
                }
                continue;
            }
            
            const answerPair = allPairs.splice(answerPairIndex, 1)[0];
            
            const question = this.generateQuestion(stemPair, answerPair, masteredWords, [...usedWords]);
            questions.push(question);
            
            // Track used words
            usedWords.add(stemPair.word1.toLowerCase());
            usedWords.add(stemPair.word2.toLowerCase());
            usedWords.add(answerPair.word1.toLowerCase());
            usedWords.add(answerPair.word2.toLowerCase());
        }
        
        // If we still don't have 10 questions, fill with synonym-definition style
        while (questions.length < 10) {
            const availableWords = masteredWords.filter(w => 
                w.synonyms && 
                w.synonyms.length > 0 && 
                !usedWords.has(w.word.toLowerCase())
            );
            
            if (availableWords.length < 2) break;
            
            const word1 = availableWords[0];
            const word2 = availableWords[1];
            
            const stemPair = {
                type: this.RELATIONSHIPS.SYNONYM,
                word1: word1.word,
                word2: word1.synonyms[0]
            };
            
            const answerPair = {
                type: this.RELATIONSHIPS.SYNONYM,
                word1: word2.word,
                word2: word2.synonyms[0]
            };
            
            const question = this.generateQuestion(stemPair, answerPair, masteredWords, [...usedWords]);
            questions.push(question);
            
            usedWords.add(word1.word.toLowerCase());
            usedWords.add(word2.word.toLowerCase());
        }
        
        return { questions: questions.slice(0, 10) };
    },

    /**
     * Shuffle array in place
     */
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    },

    /**
     * Get status text for UI display
     */
    getStatusText() {
        const progress = Storage.getProgress();
        const masteredCount = progress.masteredWords.length;
        
        if (masteredCount < 100) {
            return `🔒 Master ${100 - masteredCount} more words to unlock`;
        }
        
        if (masteredCount >= 400) {
            return `✨ Unlimited tests available!`;
        }
        
        const remaining = this.getTestsRemaining();
        const taken = this.getTestsTaken();
        const allowed = this.getTestsAllowed();
        
        if (remaining === 0) {
            const wordsNeeded = this.getWordsUntilNextTest();
            return `⏳ Master ${wordsNeeded} more words for +2 tests`;
        }
        
        return `🎯 ${remaining} tests remaining (${taken}/${allowed} used)`;
    }
};
