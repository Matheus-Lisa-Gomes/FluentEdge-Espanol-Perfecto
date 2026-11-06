/**
 * FluentEdge: Español Perfecto (A1–C2 MCER / DELE) - Main Application Controller
 */

import { MAIN_SUBJECTS, SUB_THEMES, generateRandomTreeTopic, generateTopicFromTree, getDefaultStartingTopic, checkTopicAdherence, generateRandomTechTreeTopic, TECH_MAIN_SUBJECTS, TECH_SUB_THEMES, CEFR_DESCRIPTORS } from './data/topics.js';
import { getRandomVocabularySet, getRandomSingleVocabularyWord, VOCABULARY_LEXICON } from './data/vocabulary.js';
import { analyzeQuickMetrics, evaluateEssay, checkTargetWordUsage, generateAiEssayPrompt, LEVEL_SPECS, getLevelSpec } from './modules/evaluator.js';
import { SpeechEngine, SPEAKING_CADENCE_BY_LEVEL } from './modules/speech.js';

const MCER_LEVEL_ORDER = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

class FluentEdgeApp {
    constructor() {
        this.targetLevel = 'C1';
        try {
            const saved = localStorage.getItem('fluentedge_es_target_level');
            if (saved && MCER_LEVEL_ORDER.includes(saved.toUpperCase())) {
                this.targetLevel = saved.toUpperCase();
            }
        } catch (_) {}

        this.topicDifficulty = 'all';
        try {
            this.topicDifficulty = localStorage.getItem('fluentedge_es_topic_difficulty') || 'all';
        } catch (_) {}

        this.hasDrawnTopic = false;
        this.currentTopic = getDefaultStartingTopic(this.targetLevel, this.topicDifficulty);

        this.activeVocabulary = [];
        this.speechEngine = new SpeechEngine();
        this.lastEvaluationResult = null;
        this.meetsC1Threshold = false;
        this.currentStage = 1;

        // Individual Word Practice (Repeat-After-Me Drill) state
        this.practiceQueue = [];
        this.practiceCurrentIndex = 0;
        this.masteredPracticeWords = new Set();
        this.practiceSpeed = 0.88;
        this.currentWordPracticeController = null;
        this.isPracticingWord = false;

        this.dom = {};
        this.init();
    }

    init() {
        this.cacheDomElements();
        this.bindEvents();
        this.bindHotkeys();
        this.setupSpeechEngineCallbacks();
        this.initVoiceSelection();
        this.setTargetLevel(this.targetLevel, true);
        this.setTopicDifficulty(this.topicDifficulty, false);
        this.loadTopic(this.currentTopic);
        this.updateEducationalRequirementsCard();
        this.setStage(1);
    }

    cacheDomElements() {
        this.dom = {
            brandCrest: document.getElementById('brandCrest'),
            levelBtns: document.querySelectorAll('.mcer-level-btn'),

            // Voice & Accent Header Controls
            headerVoiceBar: document.getElementById('headerVoiceBar'),
            voiceFlagCards: document.querySelectorAll('.voice-flag-card'),
            voiceGenderBtns: document.querySelectorAll('.voice-gender-btn'),

            // Stepper
            stepIndicator1: document.getElementById('stepIndicator1'),
            stepIndicator2: document.getElementById('stepIndicator2'),
            stepIndicator3: document.getElementById('stepIndicator3'),
            step3LockIcon: document.getElementById('step3LockIcon'),
            step1LexisHint: document.getElementById('step1LexisHint'),
            step2WordCountHint: document.getElementById('step2WordCountHint'),
            targetWordCountHint: document.getElementById('targetWordCountHint'),

            // Workspaces & Stages
            mainWritingWorkspace: document.getElementById('mainWritingWorkspace'),
            stage1Panel: document.getElementById('stage1Panel'),
            stage2Panel: document.getElementById('stage2Panel'),
            speakingStudio: document.getElementById('speakingStudio'),
            chromeOriginNotice: document.getElementById('chromeOriginNotice'),
            proceedToStage2Btn: document.getElementById('proceedToStage2Btn'),
            backToStage1Btn: document.getElementById('backToStage1Btn'),
            writingTopicPill: document.getElementById('writingTopicPill'),
            stage2VocabDock: document.getElementById('stage2LexisDock'),
            stage2VocabChips: document.getElementById('stage2VocabChips'),
            stage2VocabCountDisplay: document.getElementById('stage2VocabCountDisplay'),

            // Educational Requirements Card
            stage1ReqsCard: document.getElementById('stage1ReqsCard'),
            reqsLevelIndicator: document.getElementById('reqsLevelIndicator'),
            reqsLevelTagline: document.getElementById('reqsLevelTagline'),
            reqsHeaderCallout: document.getElementById('reqsHeaderCallout'),
            reqsWordMetric: document.getElementById('reqsWordMetric'),
            reqsWordDesc: document.getElementById('reqsWordDesc'),
            reqsLexisMetric: document.getElementById('reqsLexisMetric'),
            reqsLexisDesc: document.getElementById('reqsLexisDesc'),
            reqsSyntaxMetric: document.getElementById('reqsSyntaxMetric'),
            reqsSyntaxDesc: document.getElementById('reqsSyntaxDesc'),
            reqsPassMetric: document.getElementById('reqsPassMetric'),
            reqsPassDesc: document.getElementById('reqsPassDesc'),

            // Topic Card & Tree Architecture
            rerollTopicBtn: document.getElementById('rerollTopicBtn'),
            rerollTechTopicBtn: document.getElementById('rerollTechTopicBtn'),
            topicTreeBadge: document.getElementById('topicTreeBadge'),
            topicTreeBadgeText: document.getElementById('topicTreeBadgeText'),
            topicDifficultySelector: document.getElementById('topicDifficultySelector'),
            topicDifficultyBtn: document.getElementById('topicDifficultyBtn'),
            topicDifficultyValue: document.getElementById('topicDifficultyValue'),
            topicDifficultyDropdown: document.getElementById('topicDifficultyDropdown'),
            diffIndicatorDot: document.getElementById('diffIndicatorDot'),
            topicComplexityBadge: document.getElementById('topicComplexityBadge'),
            topicCategory: document.getElementById('topicCategory'),
            topicType: document.getElementById('topicType'),
            topicTime: document.getElementById('topicTime'),
            topicTitle: document.getElementById('topicTitle'),
            topicMainSubjectNode: document.getElementById('topicMainSubjectNode'),
            topicMainSubjectText: document.getElementById('topicMainSubjectText'),
            topicSubTheme1Node: document.getElementById('topicSubTheme1Node'),
            topicSubTheme1Text: document.getElementById('topicSubTheme1Text'),
            topicSubTheme2Node: document.getElementById('topicSubTheme2Node'),
            topicSubTheme2Text: document.getElementById('topicSubTheme2Text'),
            topicDirective: document.getElementById('topicDirective'),
            vocabGrid: document.getElementById('vocabGrid'),
            vocabUsedCounter: document.getElementById('vocabUsedCounter'),
            rerollVocabBtn: document.getElementById('rerollVocabBtn'),

            // Writing Studio
            essayInput: document.getElementById('essayInput'),
            spanishAccentToolbar: document.getElementById('spanishAccentToolbar'),
            liveWordCount: document.getElementById('liveWordCount'),
            liveParaCount: document.getElementById('liveParaCount'),
            targetParaCountHint: document.getElementById('targetParaCountHint'),
            lengthGuidanceBadge: document.getElementById('lengthGuidanceBadge'),
            radarBadgesRow: document.getElementById('radarBadgesRow'),
            radarCountDisplay: document.getElementById('radarCountDisplay'),
            evaluateEssayBtn: document.getElementById('evaluateEssayBtn'),
            clearEssayBtn: document.getElementById('clearEssayBtn'),

            // Evaluation Modal
            evalModalBackdrop: document.getElementById('evalModalBackdrop'),
            closeEvalModalBtn: document.getElementById('closeEvalModalBtn'),
            evalScoreTotal: document.getElementById('evalScoreTotal'),
            evalPercentage: document.getElementById('evalPercentage'),
            evalVerdictTitle: document.getElementById('evalVerdictTitle'),
            evalVerdictDesc: document.getElementById('evalVerdictDesc'),
            scaleContentScore: document.getElementById('scaleContentScore'),
            scaleContentFeedback: document.getElementById('scaleContentFeedback'),
            scaleCommScore: document.getElementById('scaleCommScore'),
            scaleCommFeedback: document.getElementById('scaleCommFeedback'),
            scaleOrgScore: document.getElementById('scaleOrgScore'),
            scaleOrgFeedback: document.getElementById('scaleOrgFeedback'),
            scaleLangScore: document.getElementById('scaleLangScore'),
            scaleLangFeedback: document.getElementById('scaleLangFeedback'),
            gatekeeperBanner: document.getElementById('gatekeeperBanner'),
            gatekeeperHeading: document.getElementById('gatekeeperHeading'),
            gatekeeperSubtext: document.getElementById('gatekeeperSubtext'),
            gatekeeperActionBtn: document.getElementById('gatekeeperActionBtn'),

            // Requirement Alert Modal
            reqAlertBackdrop: document.getElementById('reqAlertBackdrop'),
            reqAlertCard: document.getElementById('reqAlertCard'),
            reqAlertPill: document.getElementById('reqAlertPill'),
            reqAlertTitle: document.getElementById('reqAlertTitle'),
            reqAlertDesc: document.getElementById('reqAlertDesc'),
            reqAlertBody: document.getElementById('reqAlertBody'),
            reqAlertActionBtn: document.getElementById('reqAlertActionBtn'),
            closeReqAlertBtn: document.getElementById('closeReqAlertBtn'),

            // Speaking Studio
            returnToWritingBtn: document.getElementById('returnToWritingBtn'),
            teleprompterText: document.getElementById('teleprompterText'),
            retrySpeakingBtn: document.getElementById('retrySpeakingBtn'),
            startSpeakingBtn: document.getElementById('startSpeakingBtn'),
            stopSpeakingBtn: document.getElementById('stopSpeakingBtn'),
            playModelAudioBtn: document.getElementById('playModelAudioBtn'),
            playModelAudioBtnText: document.getElementById('playModelAudioBtnText'),
            stopModelAudioBtn: document.getElementById('stopModelAudioBtn'),
            visualizerCanvas: document.getElementById('visualizerCanvas'),
            liveSpeakingWpm: document.getElementById('liveSpeakingWpm'),
            liveSpeakingAcc: document.getElementById('liveSpeakingAcc'),
            liveSpeakingTime: document.getElementById('liveSpeakingTime'),
            speakingReportPanel: document.getElementById('speakingReportPanel'),
            speakingVoiceTip: document.getElementById('speakingVoiceTip'),
            speakingVoiceTipName: document.getElementById('speakingVoiceTipName'),

            // AI Essay Prompt Generator
            copyAiPromptBtn: document.getElementById('copyAiPromptBtn'),
            copyAiPromptBtnText: document.getElementById('copyAiPromptBtnText'),
            previewAiPromptBtn: document.getElementById('previewAiPromptBtn'),
            reqAlertCopyAiBtn: document.getElementById('reqAlertCopyAiBtn'),
            reqAlertCopyAiBtnText: document.getElementById('reqAlertCopyAiBtnText'),
            aiPromptModalBackdrop: document.getElementById('aiPromptModalBackdrop'),
            aiPromptModalCard: document.getElementById('aiPromptModalCard'),
            closeAiPromptModalBtn: document.getElementById('closeAiPromptModalBtn'),
            copyPromptInsideModalBtn: document.getElementById('copyPromptInsideModalBtn'),
            modalCopyBtnText: document.getElementById('modalCopyBtnText'),
            primaryCopyAiPromptBtn: document.getElementById('primaryCopyAiPromptBtn'),
            primaryCopyBtnLabel: document.getElementById('primaryCopyBtnLabel'),
            aiPromptLevelBadge: document.getElementById('aiPromptLevelBadge'),
            aiPromptWordTargetBadge: document.getElementById('aiPromptWordTargetBadge'),
            aiPromptFocusBadge: document.getElementById('aiPromptFocusBadge'),
            aiPromptVocabChips: document.getElementById('aiPromptVocabChips'),
            aiPromptVocabCount: document.getElementById('aiPromptVocabCount'),
            aiPromptTextarea: document.getElementById('aiPromptTextarea'),

            // Individual Word Practice Modal
            wordPracticeModalBackdrop: document.getElementById('wordPracticeModalBackdrop'),
            closeWordPracticeModalBtn: document.getElementById('closeWordPracticeModalBtn'),
            wordPracticeStepPill: document.getElementById('wordPracticeStepPill'),
            wordPracticeTargetWord: document.getElementById('wordPracticeTargetWord'),
            wordPracticePosBadge: document.getElementById('wordPracticePosBadge'),
            wordPracticeSyllables: document.getElementById('wordPracticeSyllables'),
            wordPracticeDefBox: document.getElementById('wordPracticeDefBox'),
            wordPracticeDefText: document.getElementById('wordPracticeDefText'),
            wordPracticePlayModelBtn: document.getElementById('wordPracticePlayModelBtn'),
            wordPracticeModelBtnLabel: document.getElementById('wordPracticeModelBtnLabel'),
            wordPracticeSpeedSlowBtn: document.getElementById('wordPracticeSpeedSlowBtn'),
            wordPracticeSpeedNormalBtn: document.getElementById('wordPracticeSpeedNormalBtn'),
            wordPracticeVoiceTag: document.getElementById('wordPracticeVoiceTag'),
            wordPracticeMicBtn: document.getElementById('wordPracticeMicBtn'),
            wordPracticeMicStatusLabel: document.getElementById('wordPracticeMicStatusLabel'),
            wordPracticeMicStatusHint: document.getElementById('wordPracticeMicStatusHint'),
            wordPracticeScoreBadge: document.getElementById('wordPracticeScoreBadge'),
            wordPracticeScorePct: document.getElementById('wordPracticeScorePct'),
            wordPracticeMeterFill: document.getElementById('wordPracticeMeterFill'),
            wordPracticeTargetDisplay: document.getElementById('wordPracticeTargetDisplay'),
            wordPracticeSpokenDisplay: document.getElementById('wordPracticeSpokenDisplay'),
            wordPracticeFeedbackText: document.getElementById('wordPracticeFeedbackText'),
            wordPracticePrevBtn: document.getElementById('wordPracticePrevBtn'),
            wordPracticeNextBtn: document.getElementById('wordPracticeNextBtn'),
            wordPracticeMasteredSummary: document.getElementById('wordPracticeMasteredSummary')
        };
    }

    bindEvents() {
        // 6-Level MCER Selector Buttons (A1, A2, B1, B2, C1, C2)
        if (this.dom.levelBtns) {
            this.dom.levelBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const lvl = btn.getAttribute('data-level');
                    if (lvl) this.setTargetLevel(lvl);
                });
            });
        }

        // Voice gender & flag buttons
        if (this.dom.voiceGenderBtns) {
            this.dom.voiceGenderBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const voiceId = btn.getAttribute('data-voice');
                    this.selectVoice(voiceId);
                });
            });
        }

        if (this.dom.voiceFlagCards) {
            this.dom.voiceFlagCards.forEach(card => {
                const badge = card.querySelector('.flag-badge-btn');
                if (badge) {
                    badge.addEventListener('click', () => {
                        const accent = card.getAttribute('data-accent');
                        const defaultVoice = accent === 'es' ? 'es_lucia' : 'ar_elena';
                        this.selectVoice(defaultVoice);
                    });
                }
            });
        }

        // Stepper navigation
        if (this.dom.stepIndicator1) {
            this.dom.stepIndicator1.addEventListener('click', () => this.setStage(1));
        }
        if (this.dom.stepIndicator2) {
            this.dom.stepIndicator2.addEventListener('click', () => this.setStage(2));
        }
        if (this.dom.stepIndicator3) {
            this.dom.stepIndicator3.addEventListener('click', () => this.setStage(3));
        }
        if (this.dom.proceedToStage2Btn) {
            this.dom.proceedToStage2Btn.addEventListener('click', () => this.setStage(2));
        }
        if (this.dom.backToStage1Btn) {
            this.dom.backToStage1Btn.addEventListener('click', () => this.setStage(1));
        }

        // Topic Difficulty Dropdown
        if (this.dom.topicDifficultyBtn && this.dom.topicDifficultyDropdown) {
            this.dom.topicDifficultyBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const isOpen = this.dom.topicDifficultyDropdown.classList.toggle('open');
                this.dom.topicDifficultyBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
            });

            this.dom.topicDifficultyDropdown.querySelectorAll('.difficulty-option').forEach(opt => {
                opt.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const diff = opt.getAttribute('data-difficulty') || 'all';
                    this.dom.topicDifficultyDropdown.classList.remove('open');
                    this.dom.topicDifficultyBtn.setAttribute('aria-expanded', 'false');
                    this.setTopicDifficulty(diff, true);
                });
            });

            document.addEventListener('click', () => {
                this.dom.topicDifficultyDropdown.classList.remove('open');
                this.dom.topicDifficultyBtn.setAttribute('aria-expanded', 'false');
            });
        }

        // Topic & Vocab Reroll
        if (this.dom.rerollTopicBtn) {
            this.dom.rerollTopicBtn.addEventListener('click', () => this.rerollTopic());
        }
        if (this.dom.rerollTechTopicBtn) {
            this.dom.rerollTechTopicBtn.addEventListener('click', () => this.rerollTechTopic());
        }
        if (this.dom.rerollVocabBtn) {
            this.dom.rerollVocabBtn.addEventListener('click', () => this.refreshRandomVocabulary(true));
        }

        // Spanish Orthographic Quick-Insert Toolbar
        if (this.dom.spanishAccentToolbar) {
            this.dom.spanishAccentToolbar.querySelectorAll('.accent-char-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const ch = btn.getAttribute('data-char');
                    if (ch && this.dom.essayInput) {
                        const input = this.dom.essayInput;
                        const start = input.selectionStart || 0;
                        const end = input.selectionEnd || 0;
                        const val = input.value;
                        input.value = val.slice(0, start) + ch + val.slice(end);
                        input.focus();
                        input.setSelectionRange(start + ch.length, start + ch.length);
                        this.handleEditorInput();
                    }
                });
            });
        }

        // Writing Editor
        if (this.dom.essayInput) {
            this.dom.essayInput.addEventListener('input', () => this.handleEditorInput());
        }
        if (this.dom.evaluateEssayBtn) {
            this.dom.evaluateEssayBtn.addEventListener('click', () => this.triggerEvaluation());
        }
        if (this.dom.clearEssayBtn) {
            this.dom.clearEssayBtn.addEventListener('click', () => this.clearEssay());
        }

        // Evaluation Modal
        if (this.dom.closeEvalModalBtn) {
            this.dom.closeEvalModalBtn.addEventListener('click', () => this.closeEvaluationModal());
        }
        if (this.dom.evalModalBackdrop) {
            this.dom.evalModalBackdrop.addEventListener('click', (e) => {
                if (e.target === this.dom.evalModalBackdrop) this.closeEvaluationModal();
            });
        }
        if (this.dom.gatekeeperActionBtn) {
            this.dom.gatekeeperActionBtn.addEventListener('click', () => this.handleGatekeeperAction());
        }

        // Requirement Alert Modal
        if (this.dom.closeReqAlertBtn) {
            this.dom.closeReqAlertBtn.addEventListener('click', () => this.closeRequirementAlert());
        }
        if (this.dom.reqAlertActionBtn) {
            this.dom.reqAlertActionBtn.addEventListener('click', () => this.closeRequirementAlert());
        }
        if (this.dom.reqAlertBackdrop) {
            this.dom.reqAlertBackdrop.addEventListener('click', (e) => {
                if (e.target === this.dom.reqAlertBackdrop) this.closeRequirementAlert();
            });
        }

        // Speaking Studio
        if (this.dom.returnToWritingBtn) {
            this.dom.returnToWritingBtn.addEventListener('click', () => this.returnToWriting());
        }
        if (this.dom.startSpeakingBtn) {
            this.dom.startSpeakingBtn.addEventListener('click', () => this.startSpeakingSession());
        }
        if (this.dom.stopSpeakingBtn) {
            this.dom.stopSpeakingBtn.addEventListener('click', () => this.stopSpeakingSession());
        }
        if (this.dom.retrySpeakingBtn) {
            this.dom.retrySpeakingBtn.addEventListener('click', () => this.retrySpeakingSession());
        }
        if (this.dom.playModelAudioBtn) {
            this.dom.playModelAudioBtn.addEventListener('click', () => this.playModelAudio());
        }
        if (this.dom.stopModelAudioBtn) {
            this.dom.stopModelAudioBtn.addEventListener('click', () => this.stopModelAudio());
        }

        // AI Essay Prompt Generator
        if (this.dom.copyAiPromptBtn) {
            this.dom.copyAiPromptBtn.addEventListener('click', () => this.handleQuickCopyAiPrompt());
        }
        if (this.dom.previewAiPromptBtn) {
            this.dom.previewAiPromptBtn.addEventListener('click', () => this.openAiPromptModal());
        }
        if (this.dom.closeAiPromptModalBtn) {
            this.dom.closeAiPromptModalBtn.addEventListener('click', () => this.closeAiPromptModal());
        }
        if (this.dom.copyPromptInsideModalBtn) {
            this.dom.copyPromptInsideModalBtn.addEventListener('click', () => this.handleModalCopyAiPrompt());
        }
        if (this.dom.primaryCopyAiPromptBtn) {
            this.dom.primaryCopyAiPromptBtn.addEventListener('click', () => this.handleModalCopyAiPrompt());
        }
        if (this.dom.aiPromptModalBackdrop) {
            this.dom.aiPromptModalBackdrop.addEventListener('click', (e) => {
                if (e.target === this.dom.aiPromptModalBackdrop) this.closeAiPromptModal();
            });
        }
        if (this.dom.reqAlertCopyAiBtn) {
            this.dom.reqAlertCopyAiBtn.addEventListener('click', () => {
                this.closeRequirementAlert();
                this.handleQuickCopyAiPrompt(true);
            });
        }

        // Individual Word Practice Modal
        if (this.dom.closeWordPracticeModalBtn) {
            this.dom.closeWordPracticeModalBtn.addEventListener('click', () => this.closeWordPracticeModal());
        }
        if (this.dom.wordPracticeModalBackdrop) {
            this.dom.wordPracticeModalBackdrop.addEventListener('click', (e) => {
                if (e.target === this.dom.wordPracticeModalBackdrop) this.closeWordPracticeModal();
            });
        }
        if (this.dom.wordPracticePlayModelBtn) {
            this.dom.wordPracticePlayModelBtn.addEventListener('click', () => this.playCurrentPracticeModelAudio());
        }
        if (this.dom.wordPracticeSpeedSlowBtn) {
            this.dom.wordPracticeSpeedSlowBtn.addEventListener('click', () => this.setPracticeSpeed(0.7));
        }
        if (this.dom.wordPracticeSpeedNormalBtn) {
            this.dom.wordPracticeSpeedNormalBtn.addEventListener('click', () => this.setPracticeSpeed(0.88));
        }
        if (this.dom.wordPracticeMicBtn) {
            this.dom.wordPracticeMicBtn.addEventListener('click', () => this.toggleWordPracticeRecording());
        }
        if (this.dom.wordPracticePrevBtn) {
            this.dom.wordPracticePrevBtn.addEventListener('click', () => this.prevWordPractice());
        }
        if (this.dom.wordPracticeNextBtn) {
            this.dom.wordPracticeNextBtn.addEventListener('click', () => this.nextWordPractice());
        }
    }

    bindHotkeys() {
        document.addEventListener('keydown', (e) => {
            const reqAlertOpen = this.dom.reqAlertBackdrop && (
                this.dom.reqAlertBackdrop.classList.contains('open') ||
                this.dom.reqAlertBackdrop.style.display === 'flex'
            );

            if (reqAlertOpen && (e.key === 'Escape' || e.key === 'Enter')) {
                e.preventDefault();
                this.closeRequirementAlert();
                return;
            }

            const aiPromptOpen = this.dom.aiPromptModalBackdrop && (
                this.dom.aiPromptModalBackdrop.classList.contains('open') ||
                this.dom.aiPromptModalBackdrop.style.display === 'flex'
            );

            if (aiPromptOpen) {
                if (e.key === 'Escape') {
                    e.preventDefault();
                    this.closeAiPromptModal();
                    return;
                }
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.handleModalCopyAiPrompt();
                    return;
                }
            }

            const wordPracticeOpen = this.dom.wordPracticeModalBackdrop && (
                this.dom.wordPracticeModalBackdrop.classList.contains('open') ||
                this.dom.wordPracticeModalBackdrop.style.display === 'flex'
            );

            if (wordPracticeOpen && e.key === 'Escape') {
                e.preventDefault();
                this.closeWordPracticeModal();
                return;
            }

            const modalOpen = (this.dom.evalModalBackdrop && this.dom.evalModalBackdrop.classList.contains('open')) ||
                Boolean(reqAlertOpen) ||
                Boolean(aiPromptOpen) ||
                Boolean(wordPracticeOpen);

            const inTextField = ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName);

            if (e.altKey && e.key === '1' && !modalOpen) {
                e.preventDefault();
                this.setStage(1);
                return;
            }
            if (e.altKey && e.key === '2' && !modalOpen) {
                e.preventDefault();
                this.setStage(2);
                return;
            }
            if (e.altKey && e.key === '3' && !modalOpen) {
                e.preventDefault();
                this.setStage(3);
                return;
            }
            if (e.key === 'Enter' && this.currentStage === 1 && !inTextField && !modalOpen) {
                e.preventDefault();
                this.setStage(2);
                return;
            }
            if (e.altKey && (e.key === 'p' || e.key === 'P') && !modalOpen) {
                e.preventDefault();
                this.handleQuickCopyAiPrompt();
                return;
            }
            // Alt+M -> Cycle through A1 -> A2 -> B1 -> B2 -> C1 -> C2
            if (e.altKey && (e.key === 'm' || e.key === 'M') && !modalOpen) {
                e.preventDefault();
                const idx = MCER_LEVEL_ORDER.indexOf(this.targetLevel);
                const nextLevel = MCER_LEVEL_ORDER[(idx + 1) % MCER_LEVEL_ORDER.length];
                this.setTargetLevel(nextLevel);
                return;
            }
            if (e.altKey && (e.key === 't' || e.key === 'T') && !modalOpen) {
                e.preventDefault();
                this.rerollTopic();
                return;
            }
            if (e.altKey && (e.key === 'k' || e.key === 'K' || e.key === 'w' || e.key === 'W') && !modalOpen) {
                e.preventDefault();
                this.rerollTechTopic();
                return;
            }
            if (e.ctrlKey && e.key === 'Enter' && !modalOpen) {
                e.preventDefault();
                this.triggerEvaluation();
            }
        });
    }

    setupSpeechEngineCallbacks() {
        this.speechEngine.onStateChange = ({ status }) => {
            if (status === 'recording') {
                if (this.dom.startSpeakingBtn) this.dom.startSpeakingBtn.style.display = 'none';
                if (this.dom.retrySpeakingBtn) this.dom.retrySpeakingBtn.style.display = 'none';
                if (this.dom.stopSpeakingBtn) this.dom.stopSpeakingBtn.style.display = 'inline-flex';
            } else if (status === 'idle') {
                if (!this._isEvaluatingSpeech) {
                    if (this.dom.startSpeakingBtn) this.dom.startSpeakingBtn.style.display = 'inline-flex';
                    if (this.dom.retrySpeakingBtn) this.dom.retrySpeakingBtn.style.display = 'inline-flex';
                    if (this.dom.stopSpeakingBtn) this.dom.stopSpeakingBtn.style.display = 'none';
                }
            } else if (status === 'model_speaking') {
                if (this.dom.playModelAudioBtn) this.dom.playModelAudioBtn.style.display = 'none';
                if (this.dom.stopModelAudioBtn) this.dom.stopModelAudioBtn.style.display = 'inline-flex';
            }
        };

        this.speechEngine.onComplete = () => {
            this.stopSpeakingSession();
        };

        this.speechEngine.onWordUpdate = ({ tokens, accuracy, wpm, elapsedSeconds }) => {
            this.updateTeleprompterDisplay(tokens);
            if (this.dom.liveSpeakingAcc) this.dom.liveSpeakingAcc.textContent = `${accuracy}%`;
            if (this.dom.liveSpeakingWpm) this.dom.liveSpeakingWpm.textContent = `${wpm}`;
            if (this.dom.liveSpeakingTime) this.dom.liveSpeakingTime.textContent = this.formatSeconds(elapsedSeconds);
        };

        this.speechEngine.onMetricsUpdate = ({ elapsedSeconds, wpm }) => {
            if (this.dom.liveSpeakingTime) this.dom.liveSpeakingTime.textContent = this.formatSeconds(elapsedSeconds);
            if (this.dom.liveSpeakingWpm) this.dom.liveSpeakingWpm.textContent = `${wpm}`;
        };

        this.speechEngine.onVoiceChange = ({ voiceId }) => {
            this.updateVoiceUI(voiceId);
        };
    }

    initVoiceSelection() {
        let savedVoice = 'ar_elena';
        try {
            savedVoice = localStorage.getItem('fluentedge_es_selected_voice') || 'ar_elena';
        } catch (_) {}
        this.speechEngine.setVoice(savedVoice);
        this.updateVoiceUI(this.speechEngine.currentVoiceId);
    }

    selectVoice(voiceId) {
        if (!voiceId) return;
        this.speechEngine.setVoice(voiceId);
        try {
            localStorage.setItem('fluentedge_es_selected_voice', voiceId);
        } catch (_) {}
        this.updateVoiceUI(voiceId);
    }

    updateVoiceUI(voiceId) {
        if (!this.dom.voiceGenderBtns) return;
        let selectedAccent = 'ar';
        this.dom.voiceGenderBtns.forEach(btn => {
            const isActive = btn.getAttribute('data-voice') === voiceId;
            btn.classList.toggle('active', isActive);
            if (isActive) {
                selectedAccent = btn.getAttribute('data-accent') || 'ar';
            }
        });

        if (this.dom.voiceFlagCards) {
            this.dom.voiceFlagCards.forEach(card => {
                const isCardActive = card.getAttribute('data-accent') === selectedAccent;
                card.classList.toggle('active', isCardActive);
                card.classList.toggle('active-accent', isCardActive);
            });
        }

        const voiceLabels = {
            ar_elena: 'Escuchar Voz Modelo (Elena · 🇦🇷 Argentina)',
            ar_mateo: 'Escuchar Voz Modelo (Mateo · 🇦🇷 Argentina)',
            es_lucia: 'Escuchar Voz Modelo (Lucía · 🇪🇸 España)',
            es_alvaro: 'Escuchar Voz Modelo (Álvaro · 🇪🇸 España)'
        };
        const label = voiceLabels[voiceId] || 'Escuchar Voz Modelo';

        if (this.dom.playModelAudioBtnText) {
            this.dom.playModelAudioBtnText.textContent = label;
        }

        const tipVoiceLabels = {
            ar_elena: 'Elena (🇦🇷 Rioplatense)',
            ar_mateo: 'Mateo (🇦🇷 Rioplatense)',
            es_lucia: 'Lucía (🇪🇸 Peninsular)',
            es_alvaro: 'Álvaro (🇪🇸 Peninsular)'
        };
        const tipVoice = tipVoiceLabels[voiceId] || 'la voz seleccionada';
        if (this.dom.speakingVoiceTipName) {
            this.dom.speakingVoiceTipName.textContent = tipVoice;
        }
    }

    setTargetLevel(level, force = false) {
        const normLevel = MCER_LEVEL_ORDER.includes(String(level).toUpperCase())
            ? String(level).toUpperCase()
            : 'C1';

        if (!force && normLevel === this.targetLevel) {
            return;
        }
        if (!force && this.hasEssayContent()) {
            if (!confirm(`Tienes un borrador en curso. ¿Deseas cambiar al nivel oficial MCER ${normLevel}? Esto ajustará la extensión requerida y renovará las 10 palabras del léxico para el nivel ${normLevel}.`)) {
                return;
            }
        }

        this.targetLevel = normLevel;
        this.speechEngine.setTargetLevel(normLevel);
        try {
            localStorage.setItem('fluentedge_es_target_level', normLevel);
        } catch (_) {}

        const spec = getLevelSpec(normLevel);

        // Update 6-level buttons
        if (this.dom.levelBtns) {
            this.dom.levelBtns.forEach(btn => {
                const isActive = btn.getAttribute('data-level') === normLevel;
                btn.classList.toggle('active', isActive);
                btn.setAttribute('aria-checked', isActive ? 'true' : 'false');
            });
        }

        // Update body theme class (theme-a1 .. theme-c2)
        MCER_LEVEL_ORDER.forEach(lvl => {
            document.body.classList.remove(`theme-${lvl.toLowerCase()}`);
        });
        document.body.classList.add(`theme-${normLevel.toLowerCase()}`);

        if (this.dom.brandCrest) {
            this.dom.brandCrest.textContent = normLevel;
            this.dom.brandCrest.title = `FluentEdge Español Perfecto — Nivel Activo: ${spec.name}`;
        }

        if (this.dom.step1LexisHint) {
            this.dom.step1LexisHint.textContent = `Estándar ${normLevel}, Rúbricas y Flujo`;
        }
        if (this.dom.step2WordCountHint) {
            this.dom.step2WordCountHint.textContent = `${spec.minWords}–${spec.maxWords} Palabras y Radar ${normLevel}`;
        }
        if (this.dom.targetWordCountHint) {
            this.dom.targetWordCountHint.textContent = `(${spec.minWords}–${spec.maxWords} ±${spec.leniency} meta)`;
        }
        if (this.dom.targetParaCountHint) {
            this.dom.targetParaCountHint.textContent = spec.minParagraphs === spec.maxParagraphs
                ? `(${spec.minParagraphs} meta)`
                : `(${spec.minParagraphs}–${spec.maxParagraphs} meta)`;
        }

        // Update current topic directive for the newly chosen level
        if (this.currentTopic && !this.currentTopic.isTechTopic) {
            this.currentTopic = generateTopicFromTree(
                this.currentTopic.subjectId,
                this.currentTopic.theme1Id,
                this.currentTopic.theme2Id,
                normLevel,
                this.currentTopic.difficulty
            );
            if (this.dom.topicDirective) {
                this.dom.topicDirective.textContent = this.currentTopic.directive;
            }
        }

        this.updateEducationalRequirementsCard();
        this.refreshRandomVocabulary(true);
        this.handleEditorInput();
    }

    updateEducationalRequirementsCard() {
        const spec = getLevelSpec(this.targetLevel);
        const descriptor = CEFR_DESCRIPTORS[this.targetLevel] || CEFR_DESCRIPTORS.C1;
        const allowedMin = spec.minWords - spec.leniency;
        const allowedMax = spec.maxWords + spec.leniency;

        if (this.dom.reqsLevelIndicator) {
            this.dom.reqsLevelIndicator.textContent = `ESTÁNDAR MCER ${spec.level}`;
        }
        if (this.dom.reqsLevelTagline) {
            this.dom.reqsLevelTagline.textContent = `${spec.name} · Certificación Oficial DELE`;
        }
        if (this.dom.reqsHeaderCallout) {
            this.dom.reqsHeaderCallout.textContent = descriptor.focus;
        }
        if (this.dom.reqsWordMetric) {
            this.dom.reqsWordMetric.textContent = `${spec.minWords} – ${spec.maxWords} palabras (margen: ${allowedMin}–${allowedMax})`;
        }
        if (this.dom.reqsWordDesc) {
            const paraText = spec.minParagraphs === spec.maxParagraphs
                ? `Estructurado en ${spec.minParagraphs} párrafos claros.`
                : `Estructurado entre ${spec.minParagraphs} y ${spec.maxParagraphs} párrafos bien diferenciados.`;
            this.dom.reqsWordDesc.textContent = `${paraText} Registro: ${descriptor.register}.`;
        }
        if (this.dom.reqsLexisMetric) {
            this.dom.reqsLexisMetric.textContent = '10 / 10 Palabras Requeridas';
        }
        if (this.dom.reqsLexisDesc) {
            this.dom.reqsLexisDesc.textContent = `Incorpora las 10 palabras del nivel ${spec.level} (3 verbos, 3 sustantivos, 2 adjetivos y 2 adverbios) con naturalidad. Se admiten conjugaciones y concordancias de género y número.`;
        }
        if (this.dom.reqsSyntaxMetric) {
            this.dom.reqsSyntaxMetric.textContent = `Mínimo ${spec.minStructures} Estructuras (${spec.level})`;
        }
        if (this.dom.reqsSyntaxDesc) {
            if (spec.level === 'A1' || spec.level === 'A2') {
                this.dom.reqsSyntaxDesc.textContent = 'Usa conectores básicos («porque», «además», «por eso»), contrastes con ser/estar/haber, perífrasis («ir a + inf.», «tener que + inf.») y comparativos.';
            } else if (spec.level === 'B1' || spec.level === 'B2') {
                this.dom.reqsSyntaxDesc.textContent = 'Integra subjuntivo de valoración («es fundamental que...»), conectores contraargumentativos («sin embargo», «no obstante»), pasiva refleja con «se» y condicionales.';
            } else {
                this.dom.reqsSyntaxDesc.textContent = 'Demuestra dominio superior: subjuntivo en -ra/-se («pudiera», «hubiese»), fórmulas académicas («cabe destacar», «resulta innegable»), relativos («cuyo», «el cual») y estructuras hendidas.';
            }
        }
        if (this.dom.reqsPassMetric) {
            this.dom.reqsPassMetric.textContent = `≥ ${spec.passScorePct}% Puntuación Global`;
        }
        if (this.dom.reqsPassDesc) {
            const cadence = SPEAKING_CADENCE_BY_LEVEL[spec.level] || SPEAKING_CADENCE_BY_LEVEL.C1;
            this.dom.reqsPassDesc.textContent = `Supera el ${spec.passScorePct}% en las 4 escalas DELE para desbloquear la Etapa 3 (meta de cadencia oral: ${cadence.min}–${cadence.max} palabras por minuto).`;
        }
    }

    setStage(stageNum) {
        if (stageNum === 3) {
            const text = this.dom.essayInput ? this.dom.essayInput.value.trim() : '';
            if (!text) {
                this.setStage(2);
                return;
            }
        }

        this.currentStage = stageNum;

        if (this.dom.stage1Panel) {
            this.dom.stage1Panel.style.display = stageNum === 1 ? 'block' : 'none';
            this.dom.stage1Panel.classList.toggle('active-stage', stageNum === 1);
        }
        if (this.dom.stage2Panel) {
            this.dom.stage2Panel.style.display = stageNum === 2 ? 'block' : 'none';
            this.dom.stage2Panel.classList.toggle('active-stage', stageNum === 2);
        }
        if (this.dom.speakingStudio) {
            this.dom.speakingStudio.style.display = stageNum === 3 ? 'block' : 'none';
            this.dom.speakingStudio.classList.toggle('active-stage', stageNum === 3);
        }

        if (this.dom.stepIndicator1) {
            this.dom.stepIndicator1.classList.toggle('active', stageNum === 1);
            this.dom.stepIndicator1.classList.toggle('completed', stageNum > 1);
        }
        if (this.dom.stepIndicator2) {
            this.dom.stepIndicator2.classList.toggle('active', stageNum === 2);
            this.dom.stepIndicator2.classList.toggle('completed', stageNum > 2);
        }
        if (this.dom.stepIndicator3) {
            this.dom.stepIndicator3.classList.toggle('active', stageNum === 3);
            if (stageNum === 3 && this.dom.step3LockIcon) {
                this.dom.step3LockIcon.innerHTML = '3';
            }
        }

        if (stageNum === 1) {
            this.updateEducationalRequirementsCard();
        } else if (stageNum === 2) {
            this.handleEditorInput();
        } else if (stageNum === 3) {
            if (this.dom.chromeOriginNotice) {
                this.dom.chromeOriginNotice.style.display = window.location.protocol === 'file:' ? 'block' : 'none';
            }
            const text = this.dom.essayInput ? this.dom.essayInput.value.trim() : '';
            if (text) {
                this.speechEngine.setTargetText(text);
                this.renderTeleprompterTokens(this.speechEngine.targetTokens);
            }
        }

        window.scrollTo(0, 0);
    }

    refreshRandomVocabulary(force = false) {
        if (force || !this.activeVocabulary || this.activeVocabulary.length === 0) {
            this.activeVocabulary = getRandomVocabularySet(this.targetLevel);
        }
        this.renderVocabularyChips();
        if (this.dom.essayInput) {
            this.handleEditorInput();
        }
    }

    loadTopic(topic = null) {
        if (topic && typeof topic === 'object') {
            this.currentTopic = topic;
        } else if (!this.currentTopic) {
            this.currentTopic = generateRandomTreeTopic(this.targetLevel, this.topicDifficulty);
        }
        const current = this.currentTopic;

        if (this.dom.topicCategory) this.dom.topicCategory.textContent = current.category || 'Sociedad y Cultura';
        if (this.dom.topicTitle) this.dom.topicTitle.textContent = current.title;

        // Topic Complexity Badge
        if (this.dom.topicComplexityBadge) {
            const diffMap = {
                easy: { label: 'Fácil', cls: 'tier-easy' },
                medium: { label: 'Media', cls: 'tier-medium' },
                hard: { label: 'Difícil', cls: 'tier-hard' }
            };
            const info = diffMap[current.difficulty] || diffMap.medium;
            this.dom.topicComplexityBadge.textContent = info.label;
            this.dom.topicComplexityBadge.className = `topic-complexity-badge ${info.cls}`;
        }

        if (this.dom.topicTreeBadge) {
            if (current.isTechTopic) {
                this.dom.topicTreeBadge.classList.add('tech-mode');
                if (this.dom.topicTreeBadgeText) this.dom.topicTreeBadgeText.textContent = 'Enfoque Tecnológico';
            } else {
                this.dom.topicTreeBadge.classList.remove('tech-mode');
                if (this.dom.topicTreeBadgeText) this.dom.topicTreeBadgeText.textContent = 'Enfoque Obligatorio';
            }
        }

        if (this.dom.topicMainSubjectText) {
            this.dom.topicMainSubjectText.textContent = current.subjectName || 'Tema Principal';
        }
        if (this.dom.topicSubTheme1Text) {
            this.dom.topicSubTheme1Text.textContent = current.theme1Name || 'Subtema 1';
        }
        if (this.dom.topicSubTheme2Text) {
            this.dom.topicSubTheme2Text.textContent = current.theme2Name || 'Subtema 2';
        }
        if (this.dom.topicDirective) {
            this.dom.topicDirective.textContent = current.directive;
        }
        if (this.dom.writingTopicPill) {
            this.dom.writingTopicPill.textContent = current.title;
        }

        this.refreshRandomVocabulary(true);
        this.handleEditorInput();
    }

    setTopicDifficulty(difficulty, reroll = true) {
        const normDiff = ['all', 'easy', 'medium', 'hard'].includes(String(difficulty).toLowerCase())
            ? String(difficulty).toLowerCase()
            : 'all';
        this.topicDifficulty = normDiff;

        try {
            localStorage.setItem('fluentedge_es_topic_difficulty', normDiff);
        } catch (_) {}

        const labels = {
            all: 'Todas',
            easy: 'Fácil',
            medium: 'Media',
            hard: 'Difícil'
        };
        const dotClasses = {
            all: 'dot-all',
            easy: 'dot-easy',
            medium: 'dot-medium',
            hard: 'dot-hard'
        };

        if (this.dom.topicDifficultyValue) {
            this.dom.topicDifficultyValue.textContent = labels[normDiff] || 'Todas';
        }
        if (this.dom.diffIndicatorDot) {
            this.dom.diffIndicatorDot.className = `diff-indicator-dot ${dotClasses[normDiff] || 'dot-all'}`;
        }
        if (this.dom.topicDifficultyDropdown) {
            this.dom.topicDifficultyDropdown.querySelectorAll('.difficulty-option').forEach(opt => {
                const isActive = opt.getAttribute('data-difficulty') === normDiff;
                opt.classList.toggle('active', isActive);
                opt.setAttribute('aria-selected', isActive ? 'true' : 'false');
            });
        }

        if (reroll) {
            this.rerollTopic();
        }
    }

    rerollTopic() {
        this.hasDrawnTopic = true;
        const newTopic = generateRandomTreeTopic(this.targetLevel, this.topicDifficulty);
        this.currentTopic = newTopic;
        if (this.dom.essayInput) this.dom.essayInput.value = '';
        this.loadTopic(newTopic);
    }

    rerollTechTopic() {
        this.hasDrawnTopic = true;
        const newTopic = generateRandomTechTreeTopic(this.targetLevel, this.topicDifficulty);
        this.currentTopic = newTopic;
        if (this.dom.essayInput) this.dom.essayInput.value = '';
        this.loadTopic(newTopic);
    }

    renderVocabularyChips() {
        if (!this.activeVocabulary || this.activeVocabulary.length === 0) {
            this.activeVocabulary = getRandomVocabularySet(this.targetLevel);
        }
        const text = this.dom.essayInput ? (this.dom.essayInput.value || '') : '';

        if (this.dom.vocabGrid) {
            this.dom.vocabGrid.innerHTML = this.activeVocabulary.map((v) => {
                const usage = checkTargetWordUsage(v, text);
                const headword = v.headword || v.word;
                const displayWord = v.displayWord || headword;
                const posClass = `pos-${(v.pos || 'sustantivo').toLowerCase()}`;
                const definition = v.definition || '';
                return `
                  <div class="vocab-chip ${usage.used ? 'used' : ''}" data-word="${headword}">
                    <div class="vocab-chip-top">
                      <div class="vocab-word-title">
                        <span class="vocab-word-text">${displayWord}</span>
                      </div>
                      <div class="vocab-chip-actions">
                        <span class="vocab-used-check">✓</span>
                        <button class="vocab-audio-btn" data-speak="${displayWord}" title="Escuchar pronunciación de «${displayWord}»" aria-label="Escuchar pronunciación de ${displayWord}">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
                        </button>
                        <button class="vocab-reroll-btn" data-reroll-word="${headword}" data-pos="${v.pos}" title="Cambiar este ${v.pos} por otro del mismo nivel" aria-label="Cambiar ${displayWord}">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                            <polyline points="23 4 23 10 17 10"></polyline>
                            <polyline points="1 20 1 14 7 14"></polyline>
                            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
                          </svg>
                        </button>
                      </div>
                    </div>
                    ${definition ? `<div class="vocab-definition">${definition}</div>` : ''}
                    <div class="vocab-pills-row">
                      <span class="vocab-pos-pill ${posClass}">${v.pos}</span>
                      <span class="vocab-cefr-pill">${v.cefr}</span>
                    </div>
                  </div>
                `;
            }).join('');

            this.dom.vocabGrid.querySelectorAll('.vocab-audio-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const word = btn.getAttribute('data-speak');
                    btn.classList.add('playing');
                    this.speechEngine.speakVocabWord(
                        word,
                        0.88,
                        () => { btn.classList.add('playing'); },
                        () => { btn.classList.remove('playing'); }
                    );
                });
            });

            this.dom.vocabGrid.querySelectorAll('.vocab-reroll-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const word = btn.getAttribute('data-reroll-word');
                    this.rerollSingleWord(word);
                });
            });
        }
    }

    rerollSingleWord(targetHeadword) {
        if (!this.activeVocabulary || this.activeVocabulary.length === 0) return;

        const normTarget = (targetHeadword || '').toLowerCase().trim();
        const index = this.activeVocabulary.findIndex(v => (v.headword || v.word || '').toLowerCase().trim() === normTarget);
        if (index === -1) return;

        const currentItem = this.activeVocabulary[index];
        const pos = (currentItem.pos || 'sustantivo').toLowerCase();
        const currentHeadwords = this.activeVocabulary.map(v => v.headword || v.word);

        const replacement = getRandomSingleVocabularyWord(pos, currentHeadwords, this.targetLevel);
        if (!replacement) return;

        this.activeVocabulary[index] = replacement;
        this.renderVocabularyChips();
        this.handleEditorInput();

        if (this.dom.vocabGrid) {
            const newChip = this.dom.vocabGrid.querySelector(`[data-word="${replacement.headword}"]`);
            if (newChip) {
                newChip.classList.add('chip-rerolled-flash');
                setTimeout(() => newChip.classList.remove('chip-rerolled-flash'), 500);
            }
        }
    }

    handleEditorInput() {
        const text = this.dom.essayInput ? this.dom.essayInput.value : '';
        const metrics = analyzeQuickMetrics(text, this.activeVocabulary, this.targetLevel);

        if (this.dom.liveWordCount) this.dom.liveWordCount.textContent = metrics.wordCount;
        if (this.dom.liveParaCount) this.dom.liveParaCount.textContent = metrics.paragraphCount;

        if (this.dom.liveWordCount) {
            this.dom.liveWordCount.className = 'metric-live-val';
            if (metrics.wordsMet) this.dom.liveWordCount.classList.add('optimal');
            else if (metrics.wordCount > 0) this.dom.liveWordCount.classList.add('warning');
        }
        if (this.dom.liveParaCount) {
            this.dom.liveParaCount.className = 'metric-live-val';
            if (metrics.paragraphsMet) this.dom.liveParaCount.classList.add('optimal');
            else if (metrics.paragraphCount > 0) this.dom.liveParaCount.classList.add('warning');
        }

        if (this.dom.lengthGuidanceBadge) {
            if (metrics.wordsMet && metrics.paragraphsMet) {
                this.dom.lengthGuidanceBadge.textContent = `✓ Extensión y Párrafos Cumplidos (${metrics.wordCount} pal., ${metrics.paragraphCount} párr.)`;
                this.dom.lengthGuidanceBadge.className = 'radar-badge active';
            } else if (metrics.wordCount > 0 && !metrics.wordsMet) {
                if (metrics.wordCount < metrics.allowedMinWords) {
                    this.dom.lengthGuidanceBadge.textContent = `Faltan ${metrics.allowedMinWords - metrics.wordCount} palabras (rango ${metrics.allowedMinWords}–${metrics.allowedMaxWords})`;
                } else {
                    this.dom.lengthGuidanceBadge.textContent = `Exceso de palabras (${metrics.wordCount} / máx. ${metrics.allowedMaxWords})`;
                }
                this.dom.lengthGuidanceBadge.className = 'radar-badge';
            } else if (metrics.paragraphCount > 0 && !metrics.paragraphsMet) {
                this.dom.lengthGuidanceBadge.textContent = `Requiere ${metrics.minParagraphs}–${metrics.maxParagraphs} párrafos (actual: ${metrics.paragraphCount})`;
                this.dom.lengthGuidanceBadge.className = 'radar-badge';
            } else {
                this.dom.lengthGuidanceBadge.textContent = 'Esperando texto';
                this.dom.lengthGuidanceBadge.className = 'radar-badge';
            }
        }

        if (this.dom.vocabUsedCounter) {
            this.dom.vocabUsedCounter.textContent = `${metrics.targetWordsUsed}/${metrics.targetWordsTotal}`;
        }

        metrics.vocabStatus.forEach(status => {
            if (this.dom.vocabGrid) {
                const chip = this.dom.vocabGrid.querySelector(`[data-word="${status.word}"]`);
                if (chip) chip.classList.toggle('used', status.used);
            }
        });

        const minRequiredStructures = metrics.minRequiredStructures;
        const detectedStructuresCount = metrics.detectedGrammar.length;
        const structuresMet = detectedStructuresCount >= minRequiredStructures;
        const levelLabel = this.targetLevel;

        if (this.dom.radarCountDisplay) {
            if (detectedStructuresCount === 0) {
                this.dom.radarCountDisplay.textContent = `0/${minRequiredStructures} Estructuras Requeridas (${levelLabel})`;
                this.dom.radarCountDisplay.className = 'radar-count-badge zero';
            } else if (!structuresMet) {
                const needed = minRequiredStructures - detectedStructuresCount;
                this.dom.radarCountDisplay.textContent = `${detectedStructuresCount}/${minRequiredStructures} Estructuras (Falta${needed === 1 ? '' : 'n'} ${needed})`;
                this.dom.radarCountDisplay.className = 'radar-count-badge in-progress';
            } else {
                this.dom.radarCountDisplay.textContent = `✓ ${detectedStructuresCount}/${minRequiredStructures} Estructuras Cumplidas (${levelLabel})`;
                this.dom.radarCountDisplay.className = 'radar-count-badge fulfilled';
            }
        }

        if (this.dom.radarBadgesRow) {
            if (detectedStructuresCount > 0) {
                this.dom.radarBadgesRow.innerHTML = metrics.detectedGrammar.map(g => `
                  <span class="radar-badge active" title="${g.description || ''}">
                    ✓ ${g.name}
                  </span>
                `).join('');
            } else {
                this.dom.radarBadgesRow.innerHTML = `
                  <span class="radar-badge-empty">
                    Aún no se detectan estructuras del nivel ${levelLabel}. Incorpora al menos ${minRequiredStructures} construcciones gramaticales para desbloquear la evaluación.
                  </span>
                `;
            }
        }

        const topicAdherence = checkTopicAdherence(text, this.currentTopic);
        const isTopicOk = Boolean(topicAdherence.isOnTopic);
        if (this.dom.topicMainSubjectNode) {
            this.dom.topicMainSubjectNode.classList.toggle('fulfilled', Boolean(topicAdherence.subjectOk));
            this.dom.topicMainSubjectNode.title = topicAdherence.subjectOk
                ? `Tema Principal abordado (${topicAdherence.subjectFound.join(', ')})`
                : `Tema Principal: menciona conceptos relacionados con «${this.currentTopic?.subjectName || 'el tema'}»`;
        }
        if (this.dom.topicSubTheme1Node) {
            this.dom.topicSubTheme1Node.classList.toggle('fulfilled', Boolean(topicAdherence.theme1Ok));
            this.dom.topicSubTheme1Node.title = topicAdherence.theme1Ok
                ? `Subtema 1 abordado (${topicAdherence.theme1Found.join(', ')})`
                : `Subtema 1: menciona conceptos relacionados con «${this.currentTopic?.theme1Name || 'Subtema 1'}»`;
        }
        if (this.dom.topicSubTheme2Node) {
            this.dom.topicSubTheme2Node.classList.toggle('fulfilled', Boolean(topicAdherence.theme2Ok));
            this.dom.topicSubTheme2Node.title = topicAdherence.theme2Ok
                ? `Subtema 2 abordado (${topicAdherence.theme2Found.join(', ')})`
                : `Subtema 2: menciona conceptos relacionados con «${this.currentTopic?.theme2Name || 'Subtema 2'}»`;
        }

        const allLexisFulfilled = metrics.targetWordsTotal > 0 && metrics.targetWordsUsed >= metrics.targetWordsTotal;
        const allSyntaxFulfilled = structuresMet;
        const allWordsFulfilled = metrics.wordsMet;
        const allParasFulfilled = metrics.paragraphsMet;
        const allReady = allLexisFulfilled && allSyntaxFulfilled && isTopicOk && allWordsFulfilled && allParasFulfilled;

        if (this.dom.evaluateEssayBtn) {
            if (allReady) {
                this.dom.evaluateEssayBtn.classList.remove('btn-locked-lexis');
                this.dom.evaluateEssayBtn.classList.add('btn-lexis-ready');
                this.dom.evaluateEssayBtn.setAttribute('aria-disabled', 'false');
                this.dom.evaluateEssayBtn.innerHTML = `
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                  Evaluar Texto (Todos los Requisitos Cumplidos)
                  <kbd class="hotkey-badge">Ctrl+↵</kbd>
                `;
            } else {
                this.dom.evaluateEssayBtn.classList.remove('btn-lexis-ready');
                this.dom.evaluateEssayBtn.classList.add('btn-locked-lexis');
                this.dom.evaluateEssayBtn.setAttribute('aria-disabled', 'true');

                const parts = [];
                if (!allWordsFulfilled) parts.push(`${metrics.wordCount}/${metrics.allowedMinWords}-${metrics.allowedMaxWords} pal.`);
                if (!allParasFulfilled) parts.push(`${metrics.paragraphCount}/${metrics.minParagraphs}-${metrics.maxParagraphs} párr.`);
                if (!allLexisFulfilled) parts.push(`${metrics.targetWordsUsed}/${metrics.targetWordsTotal} Léxico`);
                if (!allSyntaxFulfilled) parts.push(`${detectedStructuresCount}/${minRequiredStructures} Sintaxis`);
                if (!isTopicOk && metrics.wordCount > 0) parts.push('Enfoque Temático');

                const statusSummary = parts.join(' • ') || 'Requisitos Pendientes';
                this.dom.evaluateEssayBtn.innerHTML = `
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                  Evaluar Texto (${statusSummary})
                  <kbd class="hotkey-badge">Ctrl+↵</kbd>
                `;
            }
        }
    }

    hasEssayContent() {
        return Boolean(this.dom.essayInput && this.dom.essayInput.value.trim().length > 0);
    }

    clearEssay() {
        if (this.hasEssayContent()) {
            if (!confirm('¿Estás seguro de que deseas borrar tu borrador actual?')) {
                return;
            }
        }
        if (this.dom.essayInput) this.dom.essayInput.value = '';
        this.handleEditorInput();
    }

    showRequirementAlert({
        isTextEmpty,
        wordCount,
        paragraphCount,
        targetMin,
        targetMax,
        allowedMinWords,
        allowedMaxWords,
        minParagraphs,
        maxParagraphs,
        targetWordsUsed,
        targetWordsTotal,
        missingLexis,
        detectedStructures = [],
        detectedStructuresCount = 0,
        minRequiredStructures = 4,
        isMissingStructures = false,
        topicAdherence = null
    }) {
        if (!this.dom.reqAlertBackdrop || !this.dom.reqAlertBody) return;

        let itemsHtml = '';

        // 1. Extensión de Palabras
        if (isTextEmpty) {
            itemsHtml += `
              <div class="req-item item-missing">
                <div class="req-item-icon">✕</div>
                <div class="req-item-content">
                  <div class="req-item-title">
                    <span>Texto Requerido</span>
                    <span style="font-size: 13px; color: #f87171; font-weight: 700;">0 Palabras</span>
                  </div>
                  <div class="req-item-subtitle">
                    El editor está vacío. Escribe tu texto en español o genera un modelo con el botón «Prompt IA» antes de evaluar.
                  </div>
                </div>
              </div>
            `;
        } else if (wordCount < allowedMinWords || wordCount > allowedMaxWords) {
            const msg = wordCount < allowedMinWords
                ? `Te faltan ${allowedMinWords - wordCount} palabras para alcanzar el mínimo permitido (${allowedMinWords}–${allowedMaxWords} palabras para el nivel ${this.targetLevel}).`
                : `Superas el límite máximo por ${wordCount - allowedMaxWords} palabras (máximo permitido: ${allowedMaxWords} palabras para ${this.targetLevel}).`;
            itemsHtml += `
              <div class="req-item item-missing">
                <div class="req-item-icon">✕</div>
                <div class="req-item-content">
                  <div class="req-item-title">
                    <span>Extensión del Nivel ${this.targetLevel}</span>
                    <span style="font-size: 13px; color: #f87171; font-weight: 700;">${wordCount} / ${allowedMinWords}–${allowedMaxWords} Palabras</span>
                  </div>
                  <div class="req-item-subtitle">${msg}</div>
                </div>
              </div>
            `;
        } else {
            itemsHtml += `
              <div class="req-item item-met">
                <div class="req-item-icon">✓</div>
                <div class="req-item-content">
                  <div class="req-item-title">
                    <span>Extensión de Palabras Cumplida</span>
                    <span style="font-size: 13px; color: #34d399; font-weight: 700;">${wordCount} Palabras (${allowedMinWords}–${allowedMaxWords})</span>
                  </div>
                  <div class="req-item-subtitle">Cumple el rango oficial del nivel ${this.targetLevel} (${targetMin}–${targetMax} ±5).</div>
                </div>
              </div>
            `;
        }

        // 2. Arquitectura de Párrafos
        if (paragraphCount < minParagraphs || paragraphCount > maxParagraphs) {
            itemsHtml += `
              <div class="req-item item-missing">
                <div class="req-item-icon">✕</div>
                <div class="req-item-content">
                  <div class="req-item-title">
                    <span>Estructura de Párrafos</span>
                    <span style="font-size: 13px; color: #f87171; font-weight: 700;">${paragraphCount} / ${minParagraphs}–${maxParagraphs} Párrafos</span>
                  </div>
                  <div class="req-item-subtitle">
                    El nivel ${this.targetLevel} exige entre ${minParagraphs} y ${maxParagraphs} párrafos separados por una línea en blanco.
                  </div>
                </div>
              </div>
            `;
        } else {
            itemsHtml += `
              <div class="req-item item-met">
                <div class="req-item-icon">✓</div>
                <div class="req-item-content">
                  <div class="req-item-title">
                    <span>Estructura de Párrafos Cumplida</span>
                    <span style="font-size: 13px; color: #34d399; font-weight: 700;">${paragraphCount} Párrafos</span>
                  </div>
                  <div class="req-item-subtitle">Distribución de párrafos adecuada para el nivel ${this.targetLevel}.</div>
                </div>
              </div>
            `;
        }

        // 3. Léxico Obligatorio (10/10)
        if (missingLexis && missingLexis.length > 0) {
            const missingChipsHtml = missingLexis.map(item => `
              <span class="req-missing-chip" title="${item.definition || item.word}">
                ${item.pos ? `<span class="pos-tag pos-${(item.pos || '').toLowerCase()}">${item.pos}</span>` : ''}
                ${item.word}
              </span>
            `).join('');

            itemsHtml += `
              <div class="req-item item-missing">
                <div class="req-item-icon">✕</div>
                <div class="req-item-content">
                  <div class="req-item-title">
                    <span>Léxico Meta Obligatorio</span>
                    <span style="font-size: 13px; color: #fbbf24; font-weight: 700;">${targetWordsUsed} / ${targetWordsTotal} Usadas (Faltan ${missingLexis.length})</span>
                  </div>
                  <div class="req-item-subtitle">
                    Debes integrar las ${targetWordsTotal} palabras obligatorias de la columna izquierda antes de evaluar:
                  </div>
                  <div class="req-missing-chips-box">
                    <div class="req-chips-flex">${missingChipsHtml}</div>
                  </div>
                </div>
              </div>
            `;
        } else {
            itemsHtml += `
              <div class="req-item item-met">
                <div class="req-item-icon">✓</div>
                <div class="req-item-content">
                  <div class="req-item-title">
                    <span>Léxico Meta Completo</span>
                    <span style="font-size: 13px; color: #34d399; font-weight: 700;">${targetWordsTotal} / ${targetWordsTotal} Usadas</span>
                  </div>
                  <div class="req-item-subtitle">Has incorporado correctamente las 10 palabras obligatorias.</div>
                </div>
              </div>
            `;
        }

        // 4. Radar Gramatical y Sintáctico
        if (isMissingStructures) {
            const needed = minRequiredStructures - detectedStructuresCount;
            itemsHtml += `
              <div class="req-item item-missing">
                <div class="req-item-icon">✕</div>
                <div class="req-item-content">
                  <div class="req-item-title">
                    <span>Radar Gramatical (${this.targetLevel})</span>
                    <span style="font-size: 13px; color: #fbbf24; font-weight: 700;">${detectedStructuresCount} / ${minRequiredStructures} Detectadas (Faltan ${needed})</span>
                  </div>
                  <div class="req-item-subtitle">
                    Incorpora al menos ${minRequiredStructures} estructuras gramaticales (p. ej. «sin embargo», «es fundamental que», «se observa», «cabe destacar», «a medida que»).
                  </div>
                </div>
              </div>
            `;
        } else {
            itemsHtml += `
              <div class="req-item item-met">
                <div class="req-item-icon">✓</div>
                <div class="req-item-content">
                  <div class="req-item-title">
                    <span>Radar Gramatical Cumplido</span>
                    <span style="font-size: 13px; color: #34d399; font-weight: 700;">${detectedStructuresCount} / ${minRequiredStructures} Estructuras</span>
                  </div>
                  <div class="req-item-subtitle">Se cumple el mínimo de estructuras sintácticas para ${this.targetLevel}.</div>
                </div>
              </div>
            `;
        }

        // 5. Enfoque Temático
        if (topicAdherence && !topicAdherence.isOnTopic) {
            itemsHtml += `
              <div class="req-item item-missing">
                <div class="req-item-icon">✕</div>
                <div class="req-item-content">
                  <div class="req-item-title">
                    <span>Coherencia con el Tema Sorteado</span>
                    <span style="font-size: 13px; color: #fbbf24; font-weight: 700;">Enfoque Insuficiente</span>
                  </div>
                  <div class="req-item-subtitle">
                    Menciona conceptos relacionados con «${this.currentTopic?.subjectName || 'el tema'}» y sus subtemas («${this.currentTopic?.theme1Name || ''}» y «${this.currentTopic?.theme2Name || ''}»).
                  </div>
                </div>
              </div>
            `;
        }

        this.dom.reqAlertBody.innerHTML = itemsHtml;
        this.dom.reqAlertBackdrop.style.display = 'flex';
        void this.dom.reqAlertBackdrop.offsetWidth;
        this.dom.reqAlertBackdrop.classList.add('open');
    }

    closeRequirementAlert() {
        if (!this.dom.reqAlertBackdrop) return;
        this.dom.reqAlertBackdrop.classList.remove('open');
        setTimeout(() => {
            this.dom.reqAlertBackdrop.style.display = 'none';
            if (this.dom.essayInput) this.dom.essayInput.focus();
        }, 250);
    }

    triggerEvaluation() {
        const text = this.dom.essayInput ? this.dom.essayInput.value.trim() : '';
        const words = text ? text.split(/\s+/).filter(Boolean) : [];
        const metrics = analyzeQuickMetrics(text, this.activeVocabulary, this.targetLevel);
        const missingVocab = metrics.vocabStatus.filter(v => !v.used);
        const missingLexis = missingVocab.map(v => {
            const fullItem = this.activeVocabulary.find(av => (av.headword || av.word) === v.word);
            return {
                word: fullItem?.displayWord || v.word,
                pos: v.pos || '',
                definition: fullItem?.definition || ''
            };
        });

        const isTextEmpty = !text || words.length === 0;
        const isWordsInvalid = !isTextEmpty && !metrics.wordsMet;
        const isParasInvalid = !isTextEmpty && !metrics.paragraphsMet;
        const isMissingLexis = missingLexis.length > 0;
        const detectedStructuresCount = metrics.detectedGrammar.length;
        const minRequiredStructures = metrics.minRequiredStructures;
        const isMissingStructures = detectedStructuresCount < minRequiredStructures;

        const adherence = checkTopicAdherence(text, this.currentTopic);
        const isTopicMissing = !isTextEmpty && !adherence.isOnTopic;

        if (isTextEmpty || isWordsInvalid || isParasInvalid || isMissingLexis || isMissingStructures || isTopicMissing) {
            this.showRequirementAlert({
                isTextEmpty,
                wordCount: words.length,
                paragraphCount: metrics.paragraphCount,
                targetMin: metrics.targetMin,
                targetMax: metrics.targetMax,
                allowedMinWords: metrics.allowedMinWords,
                allowedMaxWords: metrics.allowedMaxWords,
                minParagraphs: metrics.minParagraphs,
                maxParagraphs: metrics.maxParagraphs,
                targetWordsUsed: metrics.targetWordsUsed,
                targetWordsTotal: metrics.targetWordsTotal,
                missingLexis,
                detectedStructures: metrics.detectedGrammar,
                detectedStructuresCount,
                minRequiredStructures,
                isMissingStructures,
                topicAdherence: adherence
            });
            return;
        }

        const evalResult = evaluateEssay(text, this.currentTopic, this.targetLevel, this.activeVocabulary);
        this.lastEvaluationResult = evalResult;
        this.meetsC1Threshold = evalResult.meetsThreshold;

        const spec = getLevelSpec(this.targetLevel);

        this.dom.evalScoreTotal.textContent = evalResult.rawTotal;
        this.dom.evalPercentage.textContent = `${evalResult.percentage}%`;
        this.dom.evalVerdictTitle.textContent = evalResult.meetsThreshold
            ? `Apto · ${spec.scaleBadge}`
            : `En Progreso · ${spec.scaleBadge}`;
        this.dom.evalVerdictTitle.className = `cefr-verdict-title ${evalResult.meetsThreshold ? 'pass' : 'revise'}`;
        this.dom.evalVerdictDesc.textContent = evalResult.meetsThreshold
            ? `¡Excelente trabajo! Tu texto cumple todos los criterios del nivel ${spec.name} con una calificación del ${evalResult.percentage}%.`
            : `Tu texto obtuvo ${evalResult.percentage}% (se requiere ≥${spec.passScorePct}% para ${spec.level}). Revisa las recomendaciones o avanza en modo práctica.`;

        const renderScale = (scoreEl, feedbackEl, scale) => {
            if (scoreEl) scoreEl.textContent = `${scale.score} / ${scale.max}`;
            if (feedbackEl) feedbackEl.innerHTML = scale.feedback.map(fb => `<li>${fb}</li>`).join('');
        };

        renderScale(this.dom.scaleContentScore, this.dom.scaleContentFeedback, evalResult.scales.content);
        renderScale(this.dom.scaleCommScore, this.dom.scaleCommFeedback, evalResult.scales.communicative);
        renderScale(this.dom.scaleOrgScore, this.dom.scaleOrgFeedback, evalResult.scales.organisation);
        renderScale(this.dom.scaleLangScore, this.dom.scaleLangFeedback, evalResult.scales.language);

        if (evalResult.meetsThreshold) {
            this.dom.gatekeeperBanner.className = 'gatekeeper-banner unlocked';
            this.dom.gatekeeperHeading.textContent = `✓ Estándar ${spec.level} Confirmado (${evalResult.percentage}%)`;
            this.dom.gatekeeperSubtext.textContent = 'Has desbloqueado la Etapa 3: lee tu texto en voz alta para evaluar tu pronunciación y cadencia en español.';
            this.dom.gatekeeperActionBtn.className = 'btn btn-emerald';
            this.dom.gatekeeperActionBtn.textContent = 'Avanzar a la Etapa 3: Habla →';

            this.dom.stepIndicator2.classList.add('completed');
            this.dom.stepIndicator3.classList.add('active');
            if (this.dom.step3LockIcon) this.dom.step3LockIcon.innerHTML = '3';
        } else {
            this.dom.gatekeeperBanner.className = 'gatekeeper-banner locked';
            this.dom.gatekeeperHeading.textContent = `Umbral ${spec.level} No Alcanzado (Se Recomienda Revisar)`;
            this.dom.gatekeeperSubtext.textContent = `Obtuviste ${evalResult.percentage}% (mínimo ${spec.passScorePct}%). Puedes perfeccionar el texto o practicar la pronunciación igualmente.`;
            this.dom.gatekeeperActionBtn.className = 'btn btn-secondary';
            this.dom.gatekeeperActionBtn.textContent = 'Practicar Pronunciación de Todos Modos →';
        }

        this.dom.evalModalBackdrop.classList.add('open');
    }

    closeEvaluationModal() {
        if (this.dom.evalModalBackdrop) {
            this.dom.evalModalBackdrop.classList.remove('open');
        }
    }

    handleGatekeeperAction() {
        this.closeEvaluationModal();
        this.proceedToSpeakingPhase();
    }

    proceedToSpeakingPhase() {
        const text = this.dom.essayInput ? this.dom.essayInput.value.trim() : '';
        if (!text) return;

        this.setStage(3);
        if (this.dom.liveSpeakingWpm) this.dom.liveSpeakingWpm.textContent = '0';
        if (this.dom.liveSpeakingAcc) this.dom.liveSpeakingAcc.textContent = '0%';
        if (this.dom.liveSpeakingTime) this.dom.liveSpeakingTime.textContent = '00:00';
        if (this.dom.speakingReportPanel) this.dom.speakingReportPanel.style.display = 'none';
    }

    renderTeleprompterTokens(tokens) {
        if (!this.dom.teleprompterText) return;
        this.dom.teleprompterText.innerHTML = tokens.map(token => `
          <span class="teleprompter-word ${token.status}" data-index="${token.index}">
            ${token.text}
          </span>
        `).join(' ');

        this._teleprompterSpans = Array.from(this.dom.teleprompterText.querySelectorAll('.teleprompter-word'));
        this._teleprompterSpans.forEach(el => {
            el.addEventListener('click', () => {
                const wordText = el.textContent.trim();
                this.speechEngine.speakText(wordText, 0.88);
            });
        });
    }

    updateTeleprompterDisplay(tokens) {
        if (!this._teleprompterSpans || this._teleprompterSpans.length !== tokens.length) {
            this._teleprompterSpans = Array.from(this.dom.teleprompterText.querySelectorAll('.teleprompter-word'));
        }
        const spans = this._teleprompterSpans;
        const len = Math.min(tokens.length, spans.length);
        const activeIdx = this.speechEngine ? this.speechEngine.currentWordIndex : -1;

        for (let i = 0; i < len; i++) {
            const isFocus = (i === activeIdx && tokens[i].status === 'pending');
            const targetClass = isFocus
                ? 'teleprompter-word pending active-focus'
                : `teleprompter-word ${tokens[i].status}`;

            if (spans[i].className !== targetClass) {
                spans[i].className = targetClass;
            }
        }
    }

    returnToWriting() {
        this.speechEngine.stopListening();
        this.speechEngine.stopSpeakingModel();
        this.setStage(2);
    }

    retrySpeakingSession() {
        const text = this.dom.essayInput ? this.dom.essayInput.value.trim() : '';
        if (!text) return;
        this.speechEngine.stopListening();
        this.speechEngine.stopSpeakingModel();
        this.speechEngine.setTargetText(text);
        this.renderTeleprompterTokens(this.speechEngine.targetTokens);
        if (this.dom.speakingReportPanel) this.dom.speakingReportPanel.style.display = 'none';
        if (this.dom.liveSpeakingWpm) this.dom.liveSpeakingWpm.textContent = '0';
        if (this.dom.liveSpeakingAcc) this.dom.liveSpeakingAcc.textContent = '0%';
        if (this.dom.liveSpeakingTime) this.dom.liveSpeakingTime.textContent = '00:00';
        this.startSpeakingSession();
    }

    async startSpeakingSession() {
        const text = this.dom.essayInput ? this.dom.essayInput.value.trim() : '';
        if (!text) return;

        if (this.speechEngine.targetTokens.length > 0 &&
            this.speechEngine.currentWordIndex >= this.speechEngine.targetTokens.length) {
            this.speechEngine.setTargetText(text);
            this.renderTeleprompterTokens(this.speechEngine.targetTokens);
            if (this.dom.speakingReportPanel) this.dom.speakingReportPanel.style.display = 'none';
        }

        await this.speechEngine.startListening(this.dom.visualizerCanvas);
    }

    async stopSpeakingSession() {
        if (this._isEvaluatingSpeech) return;
        this._isEvaluatingSpeech = true;

        try {
            await this.speechEngine.stopListening();
            const report = this.speechEngine.getFinalSpeakingAssessment();
            this.renderSpeakingReport(report);
        } finally {
            this._isEvaluatingSpeech = false;
            if (this.dom.stopSpeakingBtn) this.dom.stopSpeakingBtn.style.display = 'none';
            if (this.dom.startSpeakingBtn) this.dom.startSpeakingBtn.style.display = 'inline-flex';
            if (this.dom.retrySpeakingBtn) this.dom.retrySpeakingBtn.style.display = 'inline-flex';
        }
    }

    renderSpeakingReport(report) {
        if (!this.dom.speakingReportPanel) return;
        this.dom.speakingReportPanel.style.display = 'block';
        setTimeout(() => {
            this.dom.speakingReportPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 80);

        const deviated = report.deviatedWords || [];
        const mastered = report.matchedPolysyllabic || [];
        const wpm = report.wpm || 0;
        const accuracy = report.pronunciationAccuracy || 0;
        const coverage = report.readRatio || 0;
        const cadenceSpec = SPEAKING_CADENCE_BY_LEVEL[this.targetLevel] || SPEAKING_CADENCE_BY_LEVEL.C1;

        this.dom.speakingReportPanel.innerHTML = `
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 12px;">
            <div>
              <h3 style="margin: 0 0 4px 0;">Informe de Evaluación Oral MCER ${this.targetLevel}</h3>
              <div style="font-size: 13.5px; color: var(--text-muted);">Análisis Fonético y Prosódico en Tiempo Real (${this.speechEngine.getVoiceInfo().regionLabel})</div>
            </div>
            <div style="display: flex; gap: 8px; align-items: center;">
              <span class="cefr-pill ${report.meetsC1Speaking ? 'badge-c1' : 'badge-b2'}">${report.speakingBand}</span>
              <span class="cefr-pill badge-c1">${report.overallPercentage || accuracy}% Global</span>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 24px;">
            <div class="scale-card" style="text-align: center;">
              <div style="font-size: 13px; text-transform: uppercase; color: var(--text-muted); letter-spacing: 0.5px;">Precisión Fonética</div>
              <div style="font-size: 38px; font-weight: 800; color: var(--gold-light); font-family: var(--font-serif);">${accuracy}%</div>
              <div style="font-size: 14px; color: var(--emerald);">${report.matchedCount} / ${report.totalWords} palabras reconocidas</div>
            </div>

            <div class="scale-card" style="text-align: center;">
              <div style="font-size: 13px; text-transform: uppercase; color: var(--text-muted); letter-spacing: 0.5px;">Cadencia y Fluidez</div>
              <div style="font-size: 38px; font-weight: 800; color: var(--blue-accent); font-family: var(--font-serif);">${wpm} <span style="font-size: 16.5px;">PPM</span></div>
              <div style="font-size: 14px; color: var(--text-secondary);">Meta Nivel ${this.targetLevel}: ${cadenceSpec.min}–${cadenceSpec.max} PPM</div>
            </div>

            <div class="scale-card" style="text-align: center;">
              <div style="font-size: 13px; text-transform: uppercase; color: var(--text-muted); letter-spacing: 0.5px;">Cobertura del Discurso</div>
              <div style="font-size: 38px; font-weight: 800; color: var(--text-primary); font-family: var(--font-mono);">${coverage}%</div>
              <div style="font-size: 14px; color: var(--text-secondary);">Tiempo total: ${this.formatSeconds(report.elapsedSeconds)}</div>
            </div>
          </div>

          <div class="scales-grid" style="grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 24px;">
            <div class="scale-card">
              <div class="scale-card-header">
                <span class="scale-name">Articulación y Vocalización</span>
                <span class="scale-score-pill">${report.scores.pronunciation.score} / 5</span>
              </div>
              <ul class="scale-feedback-list">
                ${report.scores.pronunciation.feedback.map(f => `<li>${f}</li>`).join('')}
              </ul>
            </div>

            <div class="scale-card">
              <div class="scale-card-header">
                <span class="scale-name">Ritmo y Sinalefa</span>
                <span class="scale-score-pill">${report.scores.fluency.score} / 5</span>
              </div>
              <ul class="scale-feedback-list">
                ${report.scores.fluency.feedback.map(f => `<li>${f}</li>`).join('')}
              </ul>
            </div>

            <div class="scale-card">
              <div class="scale-card-header">
                <span class="scale-name">Dominio Discursivo</span>
                <span class="scale-score-pill">${report.scores.discourse.score} / 5</span>
              </div>
              <ul class="scale-feedback-list">
                ${report.scores.discourse.feedback.map(f => `<li>${f}</li>`).join('')}
              </ul>
            </div>
          </div>

          <div class="speaking-diagnostic-section">
            ${deviated.length > 0 ? `
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; flex-wrap: wrap; gap: 10px;">
                <div class="diagnostic-title" style="margin-bottom: 0;">
                  <span>Palabras Recomendadas para Práctica de Sílaba Tónica (${deviated.length})</span>
                </div>
                <button type="button" class="btn btn-emerald btn-sm start-word-drill-btn" id="startFullWordDrillBtn">
                  <span>Iniciar Taller «Repite Después de Mí» (${deviated.length} palabras)</span>
                </button>
              </div>
              <div class="word-diagnostic-grid">
                ${deviated.map(w => {
                    const clean = w.toLowerCase().replace(/[^a-záéíóúüñ0-9]/g, '');
                    const isMastered = this.masteredPracticeWords.has(clean);
                    return `
                      <div class="diagnostic-word-pill deviation ${isMastered ? 'mastered-in-drill' : ''}" data-word-pill="${clean}">
                        <span>${isMastered ? '✓ ' : ''}${w}</span>
                        <button type="button" class="diagnostic-word-btn" data-word="${w}" title="Escuchar pronunciación modelo de «${w}»">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
                        </button>
                        <button type="button" class="diagnostic-word-practice-btn" data-word="${w}" title="Practicar «${w}» en el taller fonético">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v1a7 7 0 0 1-14 0v-1"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>
                        </button>
                      </div>
                    `;
                }).join('')}
              </div>
            ` : `
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; flex-wrap: wrap; gap: 10px;">
                <div class="diagnostic-title" style="color: var(--emerald); margin-bottom: 0;">
                  <span>✓ Pronunciación Nítida sin Desviaciones Fonéticas</span>
                </div>
                ${mastered.length > 0 ? `
                  <button type="button" class="btn btn-secondary btn-sm start-word-drill-btn" id="startFullWordDrillBtn">
                    <span>Practicar Léxico Polisílabo (${mastered.length} palabras)</span>
                  </button>
                ` : ''}
              </div>
            `}
          </div>
        `;

        this.dom.speakingReportPanel.querySelectorAll('.diagnostic-word-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const word = btn.getAttribute('data-word');
                if (word) this.speechEngine.speakVocabWord(word, 0.88);
            });
        });

        this.dom.speakingReportPanel.querySelectorAll('.diagnostic-word-practice-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const word = btn.getAttribute('data-word');
                if (word) {
                    const queue = deviated.length > 0 ? deviated : [word];
                    this.openWordPracticeDrill(queue, word);
                }
            });
        });

        document.getElementById('startFullWordDrillBtn')?.addEventListener('click', () => {
            const targetWords = deviated.length > 0 ? deviated : (mastered.length > 0 ? mastered : []);
            if (targetWords.length > 0) this.openWordPracticeDrill(targetWords);
        });
    }

    playModelAudio() {
        const text = this.dom.essayInput ? this.dom.essayInput.value.trim() : '';
        if (!text) return;
        this.speechEngine.speakText(text, 0.94, () => {
            if (this.dom.playModelAudioBtn) this.dom.playModelAudioBtn.style.display = 'inline-flex';
            if (this.dom.stopModelAudioBtn) this.dom.stopModelAudioBtn.style.display = 'none';
        });
    }

    stopModelAudio() {
        this.speechEngine.stopSpeakingModel();
        if (this.dom.playModelAudioBtn) this.dom.playModelAudioBtn.style.display = 'inline-flex';
        if (this.dom.stopModelAudioBtn) this.dom.stopModelAudioBtn.style.display = 'none';
    }

    // =========================================================================
    // INDIVIDUAL WORD PRACTICE DRILL (TALLER REPITE DESPUÉS DE MÍ)
    // =========================================================================
    openWordPracticeDrill(wordList = [], initialWord = null) {
        if (!wordList || wordList.length === 0) return;
        const uniqueWords = Array.from(new Set(wordList.map(w => w.trim()).filter(Boolean)));
        if (uniqueWords.length === 0) return;

        this.practiceQueue = uniqueWords;
        let targetIdx = 0;
        if (initialWord) {
            const cleanInit = initialWord.toLowerCase().trim();
            const foundIdx = this.practiceQueue.findIndex(w => w.toLowerCase().trim() === cleanInit);
            if (foundIdx !== -1) targetIdx = foundIdx;
        }
        this.practiceCurrentIndex = targetIdx;

        if (!this.dom.wordPracticeModalBackdrop) return;
        this.dom.wordPracticeModalBackdrop.style.display = 'flex';
        requestAnimationFrame(() => {
            this.dom.wordPracticeModalBackdrop.classList.add('open');
        });

        this.renderCurrentWordPractice();
    }

    renderCurrentWordPractice() {
        if (!this.practiceQueue || this.practiceQueue.length === 0) return;
        const currentWord = this.practiceQueue[this.practiceCurrentIndex] || '';
        const cleanWord = currentWord.toLowerCase().trim().replace(/[^a-záéíóúüñ]/g, '');

        if (this.dom.wordPracticeStepPill) {
            this.dom.wordPracticeStepPill.textContent = `Palabra ${this.practiceCurrentIndex + 1} de ${this.practiceQueue.length}`;
        }
        this.updatePracticeMasteredSummary();

        if (this.dom.wordPracticeTargetWord) {
            this.dom.wordPracticeTargetWord.textContent = currentWord;
        }

        const phonetics = this.speechEngine.getWordSyllableAndStress(cleanWord);
        if (this.dom.wordPracticeSyllables) {
            this.dom.wordPracticeSyllables.innerHTML = phonetics.formattedHtml || phonetics.formattedText || currentWord;
        }

        const { pos, definition, cefr } = this.findWordDefinitionAndPos(cleanWord);
        if (this.dom.wordPracticePosBadge) {
            this.dom.wordPracticePosBadge.textContent = `${pos || 'léxico'} · ${cefr || this.targetLevel}`;
        }
        if (this.dom.wordPracticeDefText) {
            this.dom.wordPracticeDefText.textContent = definition || 'Pronuncia con claridad cada vocal y apoya la voz en la sílaba tónica destacada en mayúsculas.';
        }

        if (this.dom.wordPracticeVoiceTag) {
            const voiceInfo = this.speechEngine.getVoiceInfo();
            this.dom.wordPracticeVoiceTag.textContent = voiceInfo.shortName;
        }

        this.resetWordPracticeMicState();

        const isMastered = this.masteredPracticeWords.has(cleanWord);
        if (this.dom.wordPracticeScoreBadge) {
            this.dom.wordPracticeScoreBadge.className = isMastered
                ? 'word-practice-score-badge status-mastered'
                : 'word-practice-score-badge status-awaiting';
            this.dom.wordPracticeScoreBadge.textContent = isMastered ? '✓ Dominada' : 'Esperando Intento';
        }
        if (this.dom.wordPracticeScorePct) {
            this.dom.wordPracticeScorePct.textContent = isMastered ? '100%' : '--%';
        }
        if (this.dom.wordPracticeMeterFill) {
            this.dom.wordPracticeMeterFill.style.width = isMastered ? '100%' : '0%';
        }
        if (this.dom.wordPracticeTargetDisplay) {
            this.dom.wordPracticeTargetDisplay.textContent = currentWord;
        }
        if (this.dom.wordPracticeSpokenDisplay) {
            this.dom.wordPracticeSpokenDisplay.textContent = isMastered ? `"${currentWord}"` : '—';
        }
        if (this.dom.wordPracticePrevBtn) {
            this.dom.wordPracticePrevBtn.disabled = (this.practiceCurrentIndex === 0);
        }
        if (this.dom.wordPracticeNextBtn) {
            const isLast = (this.practiceCurrentIndex === this.practiceQueue.length - 1);
            this.dom.wordPracticeNextBtn.innerHTML = isLast
                ? `<span>Finalizar Taller ✓</span>`
                : `<span>Siguiente Palabra →</span>`;
        }
    }

    playCurrentPracticeModelAudio() {
        if (!this.practiceQueue || this.practiceQueue.length === 0) return;
        const currentWord = this.practiceQueue[this.practiceCurrentIndex];
        if (!currentWord) return;

        if (this.dom.wordPracticePlayModelBtn) this.dom.wordPracticePlayModelBtn.classList.add('playing');
        if (this.dom.wordPracticeModelBtnLabel) this.dom.wordPracticeModelBtnLabel.textContent = 'Reproduciendo...';

        this.speechEngine.speakVocabWord(
            currentWord,
            this.practiceSpeed || 0.88,
            () => {},
            () => {
                if (this.dom.wordPracticePlayModelBtn) this.dom.wordPracticePlayModelBtn.classList.remove('playing');
                if (this.dom.wordPracticeModelBtnLabel) this.dom.wordPracticeModelBtnLabel.textContent = 'Escuchar Voz Modelo';
            }
        );
    }

    setPracticeSpeed(speed) {
        this.practiceSpeed = speed;
        if (this.dom.wordPracticeSpeedSlowBtn && this.dom.wordPracticeSpeedNormalBtn) {
            this.dom.wordPracticeSpeedSlowBtn.classList.toggle('active', speed <= 0.75);
            this.dom.wordPracticeSpeedNormalBtn.classList.toggle('active', speed > 0.75);
        }
    }

    toggleWordPracticeRecording() {
        if (this.isPracticingWord) {
            this.stopWordPracticeRecording();
        } else {
            this.startWordPracticeRecording();
        }
    }

    startWordPracticeRecording() {
        if (!this.practiceQueue || this.practiceQueue.length === 0) return;
        const currentWord = this.practiceQueue[this.practiceCurrentIndex];
        if (!currentWord) return;

        this.speechEngine.stopSpeakingModel();
        this.isPracticingWord = true;

        if (this.dom.wordPracticeMicBtn) this.dom.wordPracticeMicBtn.classList.add('listening');
        if (this.dom.wordPracticeMicStatusLabel) this.dom.wordPracticeMicStatusLabel.textContent = 'Escuchando... Pronuncia la palabra ahora';
        if (this.dom.wordPracticeSpokenDisplay) this.dom.wordPracticeSpokenDisplay.textContent = 'Escuchando...';

        this.currentWordPracticeController = this.speechEngine.evaluateSingleWordPronunciation(currentWord, {
            onInterim: (interim) => {
                if (this.dom.wordPracticeSpokenDisplay && interim) {
                    this.dom.wordPracticeSpokenDisplay.textContent = `"${interim}..."`;
                }
            },
            onResult: (result) => this.handleWordPracticeResult(result),
            onError: (errMsg) => this.handleWordPracticeError(errMsg),
            onEnd: () => this.resetWordPracticeMicState()
        });
    }

    stopWordPracticeRecording() {
        if (this.currentWordPracticeController) {
            this.currentWordPracticeController.stop();
            this.currentWordPracticeController = null;
        }
        this.resetWordPracticeMicState();
    }

    resetWordPracticeMicState() {
        this.isPracticingWord = false;
        if (this.dom.wordPracticeMicBtn) this.dom.wordPracticeMicBtn.classList.remove('listening');
        if (this.dom.wordPracticeMicStatusLabel) {
            this.dom.wordPracticeMicStatusLabel.textContent = 'Pulsa para Hablar (Repite Después de Mí)';
        }
    }

    handleWordPracticeResult(result) {
        this.resetWordPracticeMicState();
        if (!result) return;
        const { similarityPct, isMastered, status, feedback, spokenWord, targetWord } = result;

        if (this.dom.wordPracticeScorePct) this.dom.wordPracticeScorePct.textContent = `${similarityPct}%`;
        if (this.dom.wordPracticeMeterFill) {
            this.dom.wordPracticeMeterFill.style.width = `${similarityPct}%`;
            this.dom.wordPracticeMeterFill.className = `word-practice-meter-fill meter-${status}`;
        }
        if (this.dom.wordPracticeScoreBadge) {
            this.dom.wordPracticeScoreBadge.className = `word-practice-score-badge status-${status}`;
            this.dom.wordPracticeScoreBadge.textContent = isMastered ? '✓ Dominada' : (status === 'close' ? 'Casi Perfecta' : 'Repetir');
        }
        if (this.dom.wordPracticeSpokenDisplay) {
            this.dom.wordPracticeSpokenDisplay.textContent = `"${spokenWord || 'poco claro'}"`;
        }
        if (this.dom.wordPracticeFeedbackText) {
            this.dom.wordPracticeFeedbackText.textContent = feedback;
        }

        if (isMastered) {
            const clean = targetWord.toLowerCase().replace(/[^a-záéíóúüñ0-9]/g, '');
            this.masteredPracticeWords.add(clean);
            this.updatePracticeMasteredSummary();
        }
    }

    handleWordPracticeError(errMsg) {
        this.resetWordPracticeMicState();
        if (this.dom.wordPracticeFeedbackText) this.dom.wordPracticeFeedbackText.textContent = errMsg;
    }

    updatePracticeMasteredSummary() {
        if (!this.dom.wordPracticeMasteredSummary || !this.practiceQueue) return;
        const count = this.practiceQueue.filter(w => {
            const clean = w.toLowerCase().replace(/[^a-záéíóúüñ0-9]/g, '');
            return this.masteredPracticeWords.has(clean);
        }).length;
        this.dom.wordPracticeMasteredSummary.textContent = `${count} de ${this.practiceQueue.length} Dominadas`;
    }

    nextWordPractice() {
        this.stopWordPracticeRecording();
        this.speechEngine.stopSpeakingModel();
        if (this.practiceCurrentIndex < this.practiceQueue.length - 1) {
            this.practiceCurrentIndex++;
            this.renderCurrentWordPractice();
        } else {
            this.closeWordPracticeModal();
        }
    }

    prevWordPractice() {
        this.stopWordPracticeRecording();
        this.speechEngine.stopSpeakingModel();
        if (this.practiceCurrentIndex > 0) {
            this.practiceCurrentIndex--;
            this.renderCurrentWordPractice();
        }
    }

    closeWordPracticeModal() {
        this.stopWordPracticeRecording();
        this.speechEngine.stopSpeakingModel();
        if (!this.dom.wordPracticeModalBackdrop) return;
        this.dom.wordPracticeModalBackdrop.classList.remove('open');
        setTimeout(() => {
            this.dom.wordPracticeModalBackdrop.style.display = 'none';
        }, 250);
    }

    findWordDefinitionAndPos(cleanWord) {
        const found = VOCABULARY_LEXICON.find(v => v.headword === cleanWord);
        if (found) {
            return { pos: found.pos, definition: found.definition, cefr: found.cefr };
        }
        return { pos: 'léxico', definition: '', cefr: this.targetLevel };
    }

    formatSeconds(totalSeconds) {
        const mins = Math.floor(totalSeconds / 60);
        const secs = totalSeconds % 60;
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }

    // =========================================================================
    // AI ESSAY PROMPT GENERATOR
    // =========================================================================
    getAiEssayPrompt() {
        return generateAiEssayPrompt(this.currentTopic, this.activeVocabulary, this.targetLevel);
    }

    async copyTextToClipboard(text) {
        if (navigator.clipboard && window.isSecureContext) {
            try {
                await navigator.clipboard.writeText(text);
                return true;
            } catch (_) {}
        }
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        let ok = false;
        try { ok = document.execCommand('copy'); } catch (_) {}
        document.body.removeChild(textArea);
        return ok;
    }

    async handleQuickCopyAiPrompt(fromAlert = false) {
        const promptText = this.getAiEssayPrompt();
        const success = await this.copyTextToClipboard(promptText);
        if (success) {
            if (this.dom.copyAiPromptBtn && this.dom.copyAiPromptBtnText) {
                this.dom.copyAiPromptBtn.classList.add('copied');
                const orig = this.dom.copyAiPromptBtnText.textContent;
                this.dom.copyAiPromptBtnText.textContent = '✓ ¡Prompt Copiado!';
                setTimeout(() => {
                    this.dom.copyAiPromptBtn.classList.remove('copied');
                    this.dom.copyAiPromptBtnText.textContent = orig;
                }, 2500);
            }
            if (fromAlert && this.dom.reqAlertCopyAiBtnText) {
                this.dom.reqAlertCopyAiBtnText.textContent = '✓ ¡Copiado al Portapapeles!';
            }
        } else {
            this.openAiPromptModal();
        }
    }

    openAiPromptModal() {
        if (!this.dom.aiPromptModalBackdrop) return;
        const spec = getLevelSpec(this.targetLevel);
        const promptText = this.getAiEssayPrompt();

        if (this.dom.aiPromptLevelBadge) {
            this.dom.aiPromptLevelBadge.textContent = `PROMPT NIVEL ${spec.level}`;
        }
        if (this.dom.aiPromptWordTargetBadge) {
            this.dom.aiPromptWordTargetBadge.textContent = `Meta: ${spec.minWords}–${spec.maxWords} Palabras`;
        }
        if (this.dom.aiPromptVocabCount) {
            this.dom.aiPromptVocabCount.textContent = `${this.activeVocabulary.length} palabras`;
        }
        if (this.dom.aiPromptVocabChips) {
            this.dom.aiPromptVocabChips.innerHTML = this.activeVocabulary.map(v => {
                const word = v.displayWord || v.headword || '';
                const pos = v.pos || 'léx';
                return `
                  <div class="ai-mini-chip" title="${v.definition || word}">
                    <span class="ai-mini-pos pos-${pos.toLowerCase()}">${pos}</span>
                    <span>${word}</span>
                  </div>
                `;
            }).join('');
        }
        if (this.dom.aiPromptTextarea) {
            this.dom.aiPromptTextarea.value = promptText;
        }

        this.dom.aiPromptModalBackdrop.style.display = 'flex';
        void this.dom.aiPromptModalBackdrop.offsetWidth;
        this.dom.aiPromptModalBackdrop.classList.add('open');
    }

    closeAiPromptModal() {
        if (!this.dom.aiPromptModalBackdrop) return;
        this.dom.aiPromptModalBackdrop.classList.remove('open');
        setTimeout(() => {
            this.dom.aiPromptModalBackdrop.style.display = 'none';
        }, 250);
    }

    async handleModalCopyAiPrompt() {
        const promptText = this.dom.aiPromptTextarea ? this.dom.aiPromptTextarea.value : this.getAiEssayPrompt();
        const success = await this.copyTextToClipboard(promptText);
        if (success) {
            if (this.dom.modalCopyBtnText) this.dom.modalCopyBtnText.textContent = '✓ ¡Copiado!';
            if (this.dom.primaryCopyBtnLabel) this.dom.primaryCopyBtnLabel.textContent = '✓ ¡Prompt Copiado al Portapapeles!';
            setTimeout(() => {
                if (this.dom.modalCopyBtnText) this.dom.modalCopyBtnText.textContent = 'Copiar Prompt';
                if (this.dom.primaryCopyBtnLabel) this.dom.primaryCopyBtnLabel.textContent = 'Copiar Prompt al Portapapeles';
            }, 2600);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.app = new FluentEdgeApp();
});

