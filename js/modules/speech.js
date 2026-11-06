/**
 * FluentEdge Español Perfecto: Speaking & Pronunciation Evaluation Engine (A1–C2)
 * - Supports 🇦🇷 Español Rioplatense (es-AR: Elena & Mateo) and 🇪🇸 Español Peninsular (es-ES: Lucía & Álvaro)
 * - Web Speech Recognition (es-AR / es-ES) with real-time teleprompter alignment
 * - Native Spanish SpeechSynthesis with regional & gender voice matching + tactile click feedback
 * - 60fps Web Audio API waveform visualizer (Harmonized Celeste + Oro + Carmesí gradient)
 * - RAE-compliant Spanish syllabification & prosodic stress analyzer (Agudas, Llanas, Esdrújulas)
 * - Interactive Single-Word Repeat-After-Me Pronunciation Drill
 */

function stripSpanishAccents(str) {
    return String(str || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
}

function cleanSpanishToken(str) {
    return stripSpanishAccents(String(str || '').toLowerCase())
        .replace(/[^a-z0-9ñ]/g, '');
}

const SPANISH_STOP_WORDS = new Set([
    'el', 'la', 'los', 'las', 'un', 'una', 'unos', 'unas', 'de', 'del', 'al', 'a', 'en',
    'con', 'por', 'para', 'sin', 'sobre', 'y', 'e', 'o', 'u', 'ni', 'que', 'se', 'su',
    'sus', 'mi', 'tu', 'es', 'son', 'no', 'si', 'lo', 'le', 'les', 'me', 'te', 'nos'
]);

const isStopWord = (w) => SPANISH_STOP_WORDS.has(w) || (w && w.length <= 2);

export const VOICE_PROFILES = {
    ar_elena: {
        id: 'ar_elena',
        name: 'Elena (Rioplatense · Femenina)',
        shortName: 'Elena (🇦🇷)',
        accent: 'ar',
        gender: 'female',
        lang: 'es-AR',
        regionLabel: 'Español Rioplatense (Argentina)'
    },
    ar_mateo: {
        id: 'ar_mateo',
        name: 'Mateo (Barítono Porteño · Masculino)',
        shortName: 'Mateo (🇦🇷)',
        accent: 'ar',
        gender: 'male',
        lang: 'es-AR',
        regionLabel: 'Español Rioplatense (Argentina)'
    },
    es_lucia: {
        id: 'es_lucia',
        name: 'Lucía (Castellana · Femenina)',
        shortName: 'Lucía (🇪🇸)',
        accent: 'es',
        gender: 'female',
        lang: 'es-ES',
        regionLabel: 'Español Peninsular (España)'
    },
    es_alvaro: {
        id: 'es_alvaro',
        name: 'Álvaro (Barítono Ibérico · Masculino)',
        shortName: 'Álvaro (🇪🇸)',
        accent: 'es',
        gender: 'male',
        lang: 'es-ES',
        regionLabel: 'Español Peninsular (España)'
    }
};

export const SPEAKING_CADENCE_BY_LEVEL = {
    A1: { min: 90, max: 120, optimal: 105 },
    A2: { min: 100, max: 130, optimal: 115 },
    B1: { min: 115, max: 145, optimal: 130 },
    B2: { min: 125, max: 155, optimal: 140 },
    C1: { min: 130, max: 160, optimal: 145 },
    C2: { min: 135, max: 165, optimal: 150 }
};

export class SpeechEngine {
    constructor() {
        this.recognition = null;
        this.synth = (typeof window !== 'undefined' && window.speechSynthesis) ? window.speechSynthesis : null;
        this.audioContext = null;
        this.analyser = null;
        this.mediaStream = null;
        this.visualizerAnimationId = null;

        this.isListening = false;
        this.isSpeakingModel = false;
        this.startTime = null;
        this.elapsedSeconds = 0;
        this.durationInterval = null;

        this.targetTokens = [];
        this.spokenTranscripts = [];
        this.currentWordIndex = 0;
        this.confirmedWordIndex = 0;
        this.beaconIndex = 0;
        this.confirmedBeaconIndex = 0;
        this._smoothedWpm = 0;

        this.currentVoiceId = 'ar_elena';
        this.currentAccent = 'ar';     // 'ar' (Argentina) | 'es' (Spain)
        this.currentGender = 'female'; // 'female' | 'male'
        this.targetLevel = 'C1';

        this.effectsAudioContext = null;
        this._clickBuffer = null;

        // Callbacks
        this.onWordUpdate = null;
        this.onStateChange = null;
        this.onMetricsUpdate = null;
        this.onError = null;
        this.onVoiceChange = null;
        this.onComplete = null;
        this._autoStopTimer = null;
        this.singleWordRecognition = null;

        if (this.synth && typeof this.synth.onvoiceschanged !== 'undefined') {
            this.synth.onvoiceschanged = () => {
                try { this.synth.getVoices(); } catch (_) {}
            };
        }

        this.initRecognition();
    }

    isSpeechSupported() {
        return typeof window !== 'undefined' && !!(window.SpeechRecognition || window.webkitSpeechRecognition);
    }

    getVoiceInfo() {
        return VOICE_PROFILES[this.currentVoiceId] || VOICE_PROFILES.ar_elena;
    }

    setTargetLevel(level = 'C1') {
        this.targetLevel = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].includes(String(level).toUpperCase())
            ? String(level).toUpperCase()
            : 'C1';
    }

    initRecognition() {
        if (typeof window === 'undefined') return;
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            return;
        }

        this.recognition = new SpeechRecognition();
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.maxAlternatives = 1;
        this.recognition.lang = this.currentAccent === 'ar' ? 'es-AR' : 'es-ES';

        this._restartAttempts = 0;

        this.recognition.onstart = () => {
            this.isListening = true;
            this._restartAttempts = 0;
            this.startTime = Date.now();
            this.startDurationTracker();
            if (this.onStateChange) this.onStateChange({ status: 'recording' });
        };

        this.recognition.onresult = (event) => {
            let finalChunk = '';
            let interimChunk = '';

            for (let i = event.resultIndex; i < event.results.length; ++i) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    finalChunk += transcript + ' ';
                } else {
                    interimChunk += transcript;
                }
            }

            if (finalChunk.trim()) {
                this.processSpokenSpeech(finalChunk.trim(), true);
            }
            if (interimChunk.trim()) {
                this.processSpokenSpeech(interimChunk.trim(), false);
            }
        };

        this.recognition.onerror = (event) => {
            if (event.error === 'no-speech') {
                return;
            }
            if (event.error === 'not-allowed') {
                if (this.onError) this.onError('Permiso de micrófono denegado. Habilita el micrófono en la configuración del navegador.');
                this.stopListening();
            } else if (event.error === 'network') {
                if (this.onError) this.onError('Error de red en el reconocimiento de voz. Usa Google Chrome o Microsoft Edge.');
                this.stopListening();
            } else if (event.error === 'audio-capture') {
                if (this.onError) this.onError('No se pudo capturar el micrófono. Verifica que esté conectado.');
                this.stopListening();
            }
        };

        this.recognition.onend = () => {
            if (this.isListening) {
                this._restartAttempts = (this._restartAttempts || 0) + 1;
                if (this._restartAttempts <= 5) {
                    const restartDelay = Math.min(80 + (this._restartAttempts - 1) * 60, 400);
                    setTimeout(() => {
                        if (!this.isListening) return;
                        try {
                            this.recognition.start();
                        } catch (e) {
                            if (e.name === 'InvalidStateError') {
                                setTimeout(() => {
                                    if (!this.isListening) return;
                                    try { this.recognition.start(); } catch (_) {}
                                }, 200);
                            }
                        }
                    }, restartDelay);
                    return;
                } else {
                    this._restartAttempts = 0;
                    try {
                        this.initRecognition();
                        setTimeout(() => {
                            if (!this.isListening) return;
                            try { this.recognition.start(); } catch (_) {}
                        }, 150);
                    } catch (_) {}
                    return;
                }
            }

            this.isListening = false;
            this.stopDurationTracker();
            this.stopAudioVisualizer();
            if (this.onStateChange) this.onStateChange({ status: 'idle' });
        };
    }

    async ensureMediaStream() {
        if (this.mediaStream && this.mediaStream.active) {
            this.mediaStream.getAudioTracks().forEach(track => {
                track.enabled = true;
            });
            return this.mediaStream;
        }
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            this.mediaStream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true
                }
            });
            return this.mediaStream;
        }
        throw new Error('getUserMedia no disponible');
    }

    playTactileClick() {
        try {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (!AudioCtx) return;
            if (!this.effectsAudioContext || this.effectsAudioContext.state === 'closed') {
                this.effectsAudioContext = new AudioCtx();
            }
            const ctx = this.effectsAudioContext;
            if (ctx.state === 'suspended') {
                ctx.resume().catch(() => {});
            }

            if (!this._clickBuffer) {
                const sampleRate = ctx.sampleRate;
                const frames = Math.floor(sampleRate * 0.012);
                const buf = ctx.createBuffer(1, frames, sampleRate);
                const data = buf.getChannelData(0);
                for (let i = 0; i < frames; i++) {
                    const env = Math.exp(-i / (frames * 0.22));
                    data[i] = (Math.random() * 2 - 1) * env * 0.22;
                }
                this._clickBuffer = buf;
            }

            const src = ctx.createBufferSource();
            src.buffer = this._clickBuffer;
            const hp = ctx.createBiquadFilter();
            hp.type = 'highpass';
            hp.frequency.value = 800;
            const gain = ctx.createGain();
            gain.gain.value = 0.5;
            src.connect(hp);
            hp.connect(gain);
            gain.connect(ctx.destination);
            src.start();
        } catch (_) {}
    }

    async speakVocabWord(word, speed = 0.88, onStart = null, onEnd = null) {
        if (!word) return;
        this.playTactileClick();
        this.speakTextBrowserFallback(word.trim(), speed, onEnd, onStart);
    }

    async speakText(text, rate = 0.94, onEndCallback = null, onStartCallback = null) {
        this.stopSpeakingModel();
        if (!text || !text.trim()) return;
        this.speakTextBrowserFallback(text, rate, onEndCallback, onStartCallback);
    }

    /**
     * Selects the best regional Spanish voice (🇦🇷 es-AR Rioplatense or 🇪🇸 es-ES Peninsular)
     * and applies gender-appropriate pitch & cadence shaping.
     */
    speakTextBrowserFallback(text, rate = 0.94, onEndCallback = null, onStartCallback = null) {
        if (!this.synth) {
            if (this.onError) this.onError('La síntesis de voz no está disponible en este navegador.');
            return;
        }

        this.stopSpeakingModel();

        const utterance = new SpeechSynthesisUtterance(text);
        const isAR = this.currentAccent === 'ar';
        const isMale = this.currentGender === 'male';
        utterance.lang = isAR ? 'es-AR' : 'es-ES';

        const voices = this.synth.getVoices() || [];
        const spanishVoices = voices.filter(v => v.lang && /^es([-_]|$)/i.test(v.lang));

        let selectedVoice = null;

        if (isAR) {
            const arPool = spanishVoices.filter(v => /es[-_](AR|UY|419|MX|US|CL|CO)/i.test(v.lang));
            const primaryAr = spanishVoices.filter(v => /es[-_](AR|UY)/i.test(v.lang));
            const searchPool = primaryAr.length > 0 ? primaryAr : (arPool.length > 0 ? arPool : spanishVoices);

            if (isMale) {
                selectedVoice = searchPool.find(v => /tomas|tomás|mateo|raul|raúl|jorge|diego|carlos|alonso|male|hombre/i.test(v.name))
                    || searchPool[1] || searchPool[0];
            } else {
                selectedVoice = searchPool.find(v => /elena|sabina|paulina|paloma|sofia|sofía|dalia|female|mujer/i.test(v.name))
                    || searchPool[0];
            }
        } else {
            const esPool = spanishVoices.filter(v => /es[-_]ES/i.test(v.lang));
            const searchPool = esPool.length > 0 ? esPool : spanishVoices;

            if (isMale) {
                selectedVoice = searchPool.find(v => /alvaro|álvaro|pablo|jorge|dario|darío|arnau|male|hombre/i.test(v.name))
                    || searchPool[1] || searchPool[0];
            } else {
                selectedVoice = searchPool.find(v => /elvira|lucia|lucía|helena|laura|monica|mónica|estrella|female|mujer/i.test(v.name))
                    || searchPool[0];
            }
        }

        if (selectedVoice) {
            utterance.voice = selectedVoice;
        }

        if (isMale) {
            utterance.pitch = 0.88;
            utterance.rate = rate * 0.95;
        } else {
            utterance.pitch = 1.06;
            utterance.rate = rate * 0.97;
        }

        utterance.onstart = () => {
            this.isSpeakingModel = true;
            if (onStartCallback) onStartCallback();
            if (this.onStateChange) this.onStateChange({ status: 'model_speaking' });
        };

        utterance.onend = () => {
            this.isSpeakingModel = false;
            if (onEndCallback) onEndCallback();
            if (this.onStateChange) this.onStateChange({ status: 'idle' });
        };

        utterance.onerror = () => {
            this.isSpeakingModel = false;
            if (onEndCallback) onEndCallback();
            if (this.onStateChange) this.onStateChange({ status: 'idle' });
        };

        this.synth.speak(utterance);
    }

    stopSpeakingModel() {
        if (this.synth && (this.synth.speaking || this.synth.pending)) {
            try {
                this.synth.cancel();
            } catch (_) {}
        }
        this.isSpeakingModel = false;
    }

    setTargetText(text) {
        const rawWords = String(text || '').trim().split(/\s+/);
        this.targetTokens = rawWords.map((word, idx) => ({
            index: idx,
            text: word,
            clean: cleanSpanishToken(word),
            status: 'pending'
        })).filter(w => w.clean.length > 0);

        this.currentWordIndex = 0;
        this.confirmedWordIndex = 0;
        this.beaconIndex = 0;
        this.confirmedBeaconIndex = 0;
        this._smoothedWpm = 0;
        this.spokenTranscripts = [];
        this.elapsedSeconds = 0;

        if (this._autoStopTimer) {
            clearTimeout(this._autoStopTimer);
            this._autoStopTimer = null;
        }
    }

    processSpokenSpeech(spokenText, isFinal = false) {
        const spokenWords = stripSpanishAccents(String(spokenText || '').toLowerCase())
            .replace(/[^a-z0-9ñ\s]/g, '')
            .trim()
            .split(/\s+/)
            .filter(Boolean);

        if (!spokenWords.length) return;

        if (!isFinal) {
            for (let i = this.confirmedWordIndex; i < this.targetTokens.length; i++) {
                if (this.targetTokens[i].status !== 'pending') {
                    this.targetTokens[i].status = 'pending';
                }
            }
        }

        let targetIdx = this.confirmedWordIndex;

        for (let sIdx = 0; sIdx < spokenWords.length; sIdx++) {
            if (targetIdx >= this.targetTokens.length) break;

            const spokenWord = spokenWords[sIdx];
            const targetWord = this.targetTokens[targetIdx];
            const similarity = calculateWordSimilarity(spokenWord, targetWord.clean);

            const isDirectMatch = similarity >= 0.78;
            const isPrefixMatch = (spokenWord.length >= 3 && targetWord.clean.startsWith(spokenWord)) ||
                (targetWord.clean.length >= 4 && spokenWord.startsWith(targetWord.clean.slice(0, 3)));

            if (isDirectMatch || isPrefixMatch) {
                targetWord.status = 'matched';
                targetIdx++;
            } else {
                let foundAhead = false;
                const baseHorizon = isFinal ? 6 : 3;
                const allowedHorizon = isStopWord(spokenWord) ? 1 : baseHorizon;
                const maxLookahead = Math.min(allowedHorizon, this.targetTokens.length - targetIdx - 1);

                for (let lookahead = 1; lookahead <= maxLookahead; lookahead++) {
                    const aheadWord = this.targetTokens[targetIdx + lookahead];
                    const aheadSim = calculateWordSimilarity(spokenWord, aheadWord.clean);
                    const isAheadPrefix = spokenWord.length >= 3 && aheadWord.clean.startsWith(spokenWord);
                    const threshold = lookahead === 1 ? 0.76 : 0.80;

                    if (aheadSim >= threshold || isAheadPrefix) {
                        aheadWord.status = 'matched';
                        targetIdx = targetIdx + lookahead + 1;
                        foundAhead = true;
                        break;
                    }
                }

                if (!foundAhead && targetIdx > 0) {
                    const prevToken = this.targetTokens[targetIdx - 1];
                    if (calculateWordSimilarity(spokenWord, prevToken.clean) >= 0.78) {
                        continue;
                    }
                }
            }
        }

        this.currentWordIndex = Math.min(targetIdx, this.targetTokens.length);
        if (isFinal) {
            this.confirmedWordIndex = this.currentWordIndex;
        }

        this.beaconIndex = Math.max(this.beaconIndex || 0, this.currentWordIndex);
        if (isFinal) {
            this.confirmedBeaconIndex = Math.max(this.confirmedBeaconIndex || 0, this.currentWordIndex);
        }

        const matchedCount = this.targetTokens.filter(t => t.status === 'matched').length;
        const deviationCount = this.targetTokens.filter(t => t.status === 'deviation').length;
        const capturedCount = matchedCount + deviationCount;
        const accuracy = capturedCount > 0
            ? Math.min(100, Math.round(((matchedCount + (deviationCount * 0.7)) / capturedCount) * 100))
            : 100;

        const minutes = Math.max(0.1, this.elapsedSeconds / 60);
        const discourseWords = Math.max(this.confirmedBeaconIndex || 0, matchedCount + deviationCount);
        const rawWpm = Math.round(discourseWords / minutes);
        this._smoothedWpm = this._smoothedWpm
            ? Math.round(0.7 * this._smoothedWpm + 0.3 * rawWpm)
            : rawWpm;
        const wpm = this.elapsedSeconds >= 5 ? this._smoothedWpm : 0;

        if (this.onWordUpdate) {
            this.onWordUpdate({
                tokens: this.targetTokens,
                currentIndex: this.currentWordIndex,
                matchedCount,
                deviationCount,
                accuracy,
                wpm,
                elapsedSeconds: this.elapsedSeconds
            });
        }

        const isCompleted = this.targetTokens.length > 0 && this.currentWordIndex >= this.targetTokens.length;
        if (this.isListening && isCompleted) {
            if (!this._autoStopTimer) {
                const delay = (isFinal && this.confirmedWordIndex >= this.targetTokens.length) ? 400 : 550;
                this._autoStopTimer = setTimeout(() => {
                    this._autoStopTimer = null;
                    if (this.isListening && this.currentWordIndex >= this.targetTokens.length) {
                        if (this.onComplete) this.onComplete();
                    }
                }, delay);
            }
        } else if (this._autoStopTimer && this.currentWordIndex < this.targetTokens.length) {
            clearTimeout(this._autoStopTimer);
            this._autoStopTimer = null;
        }
    }

    async startListening(canvasElement) {
        if (this._autoStopTimer) {
            clearTimeout(this._autoStopTimer);
            this._autoStopTimer = null;
        }

        if (!this.isSpeechSupported()) {
            if (this.onError) this.onError('Tu navegador no admite reconocimiento de voz. Usa Google Chrome o Microsoft Edge.');
            return;
        }

        if (this.isListening) return;

        try {
            if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                this.ensureMediaStream().catch(() => {});
            }
            if (!this.recognition) {
                this.initRecognition();
            }
            this.recognition.lang = this.currentAccent === 'ar' ? 'es-AR' : 'es-ES';
            this.recognition.start();

            if (canvasElement) {
                setTimeout(() => {
                    if (this.isListening) {
                        this.startAudioVisualizer(canvasElement).catch(() => {});
                    }
                }, 60);
            }
        } catch (err) {
            if (err.name !== 'InvalidStateError') {
                if (this.onError) this.onError('No se pudo iniciar el micrófono: ' + err.message);
            }
        }
    }

    async stopListening() {
        if (this._autoStopTimer) {
            clearTimeout(this._autoStopTimer);
            this._autoStopTimer = null;
        }
        if (this.recognition && this.isListening) {
            try {
                this.recognition.stop();
            } catch (_) {}
        }
        this.isListening = false;
        this.stopDurationTracker();
        this.stopAudioVisualizer();
        if (this.onStateChange) this.onStateChange({ status: 'idle' });
    }

    startDurationTracker() {
        this.stopDurationTracker();
        this.durationInterval = setInterval(() => {
            this.elapsedSeconds++;
            if (this.onMetricsUpdate) {
                const minutes = Math.max(0.1, this.elapsedSeconds / 60);
                const matchedCount = this.targetTokens.filter(t => t.status === 'matched').length;
                const deviationCount = this.targetTokens.filter(t => t.status === 'deviation').length;
                const discourseWords = Math.max(this.confirmedBeaconIndex || 0, matchedCount + deviationCount);
                const rawWpm = Math.round(discourseWords / minutes);
                this._smoothedWpm = this._smoothedWpm
                    ? Math.round(0.7 * this._smoothedWpm + 0.3 * rawWpm)
                    : rawWpm;
                const wpm = this.elapsedSeconds >= 5 ? this._smoothedWpm : 0;
                this.onMetricsUpdate({ elapsedSeconds: this.elapsedSeconds, wpm });
            }
        }, 1000);
    }

    stopDurationTracker() {
        if (this.durationInterval) {
            clearInterval(this.durationInterval);
            this.durationInterval = null;
        }
    }

    /**
     * Generates the final MCER / DELE Speaking Assessment Report calibrated to A1–C2
     */
    getFinalSpeakingAssessment() {
        const totalWords = this.targetTokens.length;
        const matchedCount = this.targetTokens.filter(t => t.status === 'matched').length;
        const deviationCount = this.targetTokens.filter(t => t.status === 'deviation').length;
        const capturedWords = matchedCount + deviationCount;
        const omittedCount = 0;

        const readRatio = totalWords > 0
            ? (Math.max(capturedWords, (this.confirmedBeaconIndex || 0)) / totalWords)
            : 0;

        const minutes = Math.max(0.1, this.elapsedSeconds / 60);
        const discourseWords = Math.max(this.confirmedBeaconIndex || 0, capturedWords);
        const wpm = this._smoothedWpm > 0 ? this._smoothedWpm : Math.round(discourseWords / minutes);

        const pronunciationAccuracy = capturedWords > 0
            ? Math.min(100, Math.round(((matchedCount + (deviationCount * 0.70)) / capturedWords) * 100))
            : 100;

        const cadenceSpec = SPEAKING_CADENCE_BY_LEVEL[this.targetLevel] || SPEAKING_CADENCE_BY_LEVEL.C1;

        // 1. Pronunciación y Claridad Fonética
        let pronunciationScore = 5.0;
        const pronunciationFeedback = [];
        if (pronunciationAccuracy >= 90) {
            pronunciationScore = 5.0;
            pronunciationFeedback.push('Claridad vocálica sobresaliente y acentuación tónica precisa en el léxico español.');
        } else if (pronunciationAccuracy >= 78) {
            pronunciationScore = 4.2;
            pronunciationFeedback.push('Buena inteligibilidad y entonación natural. Las pequeñas variaciones no afectan la comprensión.');
        } else if (pronunciationAccuracy >= 65) {
            pronunciationScore = 3.2;
            pronunciationFeedback.push('Se perciben vacilaciones en palabras polisílabas. Practica la sílaba tónica de cada término.');
        } else {
            pronunciationScore = 2.2;
            pronunciationFeedback.push('Conviene reforzar la articulación vocálica abierta y firme propia del español.');
        }

        // 2. Fluidez y Cadencia (PPM / WPM)
        let fluencyScore = 5.0;
        const fluencyFeedback = [];
        if (wpm >= cadenceSpec.min && wpm <= cadenceSpec.max) {
            fluencyScore = 5.0;
            fluencyFeedback.push(`Ritmo óptimo de ${wpm} PPM, dentro del rango ideal del nivel ${this.targetLevel} (${cadenceSpec.min}–${cadenceSpec.max} PPM).`);
        } else if (wpm >= cadenceSpec.min - 20 && wpm <= cadenceSpec.max + 20) {
            fluencyScore = 4.0;
            fluencyFeedback.push(`Cadencia adecuada (${wpm} PPM). Apunta al intervalo de ${cadenceSpec.min}–${cadenceSpec.max} PPM con pausas naturales.`);
        } else if (wpm < cadenceSpec.min - 20) {
            fluencyScore = 3.0;
            fluencyFeedback.push(`Ritmo pausado (${wpm} PPM). Enlaza las palabras mediante sinalefa para ganar fluidez.`);
        } else {
            fluencyScore = 3.5;
            fluencyFeedback.push(`Ritmo acelerado (${wpm} PPM). Modera la velocidad para vocalizar cada sílaba con nitidez.`);
        }

        // 3. Cobertura y Dominio Discursivo
        let discourseScore = 5.0;
        const discourseFeedback = [];
        if (readRatio >= 0.90) {
            discourseScore = 5.0;
            discourseFeedback.push('Lectura completa del texto con excelente control respiratorio y entonación sostenida.');
        } else if (readRatio >= 0.70) {
            discourseScore = 3.8;
            discourseFeedback.push(`Completaste el ${Math.round(readRatio * 100)}% del texto. Procura llegar hasta el cierre final.`);
        } else {
            discourseScore = 2.5;
            discourseFeedback.push(`Intervención parcial (${Math.round(readRatio * 100)}% completado).`);
        }

        const overallSpeakingTotal = (pronunciationScore + fluencyScore + discourseScore) / 3;
        const overallPercentage = Math.round((overallSpeakingTotal / 5) * 100);

        let speakingBand = `Banda 4 · Nivel ${this.targetLevel}`;
        let meetsC1Speaking = false;

        if (overallPercentage >= 85 && pronunciationAccuracy >= 82) {
            speakingBand = `Banda 5 · Dominio Excelente (${this.targetLevel})`;
            meetsC1Speaking = true;
        } else if (overallPercentage >= 70 && pronunciationAccuracy >= 72) {
            speakingBand = `Banda 4 · Apto MCER ${this.targetLevel}`;
            meetsC1Speaking = true;
        } else if (overallPercentage >= 50) {
            speakingBand = `Banda 3 · En Progreso (${this.targetLevel})`;
            meetsC1Speaking = false;
        } else {
            speakingBand = `Banda 2 · Requiere Práctica Fonética`;
            meetsC1Speaking = false;
        }

        const deviatedTokens = this.targetTokens.filter(t => t.status === 'deviation');
        const matchedTokens = this.targetTokens.filter(t => t.status === 'matched');
        const pendingPolysyllabic = this.targetTokens.filter(t => t.status === 'pending' && t.clean.length >= 6);

        const deviatedWords = Array.from(new Set([
            ...deviatedTokens.map(t => t.text.replace(/[.,;:!?«»"()]/g, '').trim()),
            ...pendingPolysyllabic.slice(0, 6).map(t => t.text.replace(/[.,;:!?«»"()]/g, '').trim())
        ])).filter(Boolean).slice(0, 12);

        const matchedPolysyllabic = Array.from(new Set(
            matchedTokens
                .filter(t => t.clean.length >= 6)
                .map(t => t.text.replace(/[.,;:!?«»"()]/g, '').trim())
        )).filter(Boolean).slice(0, 10);

        return {
            pronunciationAccuracy,
            wpm,
            elapsedSeconds: this.elapsedSeconds,
            matchedCount,
            deviationCount,
            omittedCount,
            totalWords,
            readRatio: Math.round(readRatio * 100),
            speakingBand,
            overallPercentage,
            meetsC1Speaking,
            scores: {
                pronunciation: { score: Number(pronunciationScore.toFixed(1)), max: 5, feedback: pronunciationFeedback },
                fluency: { score: Number(fluencyScore.toFixed(1)), max: 5, feedback: fluencyFeedback },
                discourse: { score: Number(discourseScore.toFixed(1)), max: 5, feedback: discourseFeedback }
            },
            deviatedWords,
            omittedWords: [],
            matchedPolysyllabic
        };
    }

    setVoice(voiceId) {
        if (!voiceId) return;
        if (!VOICE_PROFILES[voiceId]) {
            voiceId = 'ar_elena';
        }
        const profile = VOICE_PROFILES[voiceId];
        this.currentVoiceId = profile.id;
        this.currentAccent = profile.accent;
        this.currentGender = profile.gender;

        if (this.recognition) {
            this.recognition.lang = profile.lang;
        }

        if (this.onVoiceChange) {
            this.onVoiceChange({
                voiceId: this.currentVoiceId,
                accent: this.currentAccent,
                gender: this.currentGender,
                profile
            });
        }
    }

    async initKokoro() {
        return Promise.resolve();
    }

    /**
     * Real-Time 60fps Audio Waveform Visualizer
     * Uses Harmonized Argentine Celeste -> Solar/Gualda Gold -> Spanish Crimson gradient
     */
    async startAudioVisualizer(canvas) {
        try {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (!AudioCtx) return;

            if (!this.audioContext || this.audioContext.state === 'closed') {
                this.audioContext = new AudioCtx();
            } else if (this.audioContext.state === 'suspended') {
                await this.audioContext.resume();
            }

            const stream = await this.ensureMediaStream();
            if (!this.analyser) {
                const source = this.audioContext.createMediaStreamSource(stream);
                this.analyser = this.audioContext.createAnalyser();
                this.analyser.fftSize = 256;
                source.connect(this.analyser);
            }

            const ctx = canvas.getContext('2d');
            const bufferLength = this.analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);

            if (this.visualizerAnimationId) {
                cancelAnimationFrame(this.visualizerAnimationId);
            }

            const draw = () => {
                if (!this.isListening) return;

                this.visualizerAnimationId = requestAnimationFrame(draw);
                this.analyser.getByteFrequencyData(dataArray);

                ctx.clearRect(0, 0, canvas.width, canvas.height);

                const barWidth = (canvas.width / bufferLength) * 2.5;
                let barHeight;
                let x = 0;

                for (let i = 0; i < bufferLength; i++) {
                    barHeight = (dataArray[i] / 255) * (canvas.height * 0.85);

                    const gradient = ctx.createLinearGradient(0, canvas.height, 0, 0);
                    gradient.addColorStop(0, 'rgba(198, 11, 30, 0.35)');   // Spanish Crimson base
                    gradient.addColorStop(0.55, 'rgba(244, 185, 66, 0.85)'); // Shared Sol / Gualda Gold middle
                    gradient.addColorStop(1, 'rgba(116, 172, 223, 1)');     // Argentine Celeste crest

                    ctx.fillStyle = gradient;
                    ctx.beginPath();
                    if (ctx.roundRect) {
                        ctx.roundRect(x, canvas.height - barHeight, barWidth - 1, barHeight, [3, 3, 0, 0]);
                    } else {
                        ctx.rect(x, canvas.height - barHeight, barWidth - 1, barHeight);
                    }
                    ctx.fill();

                    x += barWidth + 1;
                }
            };

            draw();
        } catch (err) {
            console.warn('Visualizer audio context note:', err);
        }
    }

    stopAudioVisualizer() {
        if (this.visualizerAnimationId) {
            cancelAnimationFrame(this.visualizerAnimationId);
            this.visualizerAnimationId = null;
        }
        if (this.mediaStream && this.mediaStream.active) {
            this.mediaStream.getAudioTracks().forEach(track => {
                track.enabled = false;
            });
        }
        if (this.audioContext && this.audioContext.state === 'running') {
            try {
                this.audioContext.suspend();
            } catch (_) {}
        }
    }

    /**
     * Single-Word Repeat-After-Me Pronunciation Drill in Spanish (es-AR / es-ES)
     */
    evaluateSingleWordPronunciation(targetWord, options = {}) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            if (options.onError) {
                options.onError('El reconocimiento de voz no está disponible en este navegador. Usa Google Chrome o Microsoft Edge.');
            }
            return null;
        }

        const displayTarget = String(targetWord || '').trim().replace(/[.,;:!?«»"()]/g, '');
        const cleanTarget = cleanSpanishToken(displayTarget);
        if (!cleanTarget) {
            if (options.onError) options.onError('Palabra no válida para la práctica fonética.');
            return null;
        }

        if (this.isListening) {
            this.stopListening();
        }
        this.stopSingleWordPronunciation();

        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            this.ensureMediaStream().catch(() => {});
        }

        const recognition = new SpeechRecognition();
        this.singleWordRecognition = recognition;
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.maxAlternatives = 5;
        recognition.lang = this.currentAccent === 'ar' ? 'es-AR' : 'es-ES';

        let hasReceivedResult = false;
        let safetyTimeout = null;

        const cleanup = () => {
            if (safetyTimeout) {
                clearTimeout(safetyTimeout);
                safetyTimeout = null;
            }
            if (this.singleWordRecognition === recognition) {
                this.singleWordRecognition = null;
            }
            if (this.mediaStream && this.mediaStream.active) {
                this.mediaStream.getAudioTracks().forEach(track => { track.enabled = false; });
            }
        };

        recognition.onstart = () => {
            if (this.mediaStream && this.mediaStream.active) {
                this.mediaStream.getAudioTracks().forEach(track => { track.enabled = true; });
            }
            if (options.onListening) options.onListening();
            safetyTimeout = setTimeout(() => {
                try { recognition.stop(); } catch (_) {}
            }, 7500);
        };

        recognition.onresult = (event) => {
            let bestSimilarity = 0;
            let bestSpokenWord = '';
            const allHypotheses = [];

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const res = event.results[i];
                for (let alt = 0; alt < res.length; alt++) {
                    const hypText = (res[alt].transcript || '').trim();
                    if (!hypText) continue;
                    allHypotheses.push(hypText);

                    const cleanHyp = cleanSpanishToken(hypText);
                    const simDirect = calculateWordSimilarity(cleanTarget, cleanHyp);
                    if (simDirect > bestSimilarity) {
                        bestSimilarity = simDirect;
                        bestSpokenWord = hypText.toLowerCase().trim();
                    }

                    const tokens = hypText.toLowerCase().split(/\s+/).filter(Boolean);
                    for (const token of tokens) {
                        const tokenSim = calculateWordSimilarity(cleanTarget, cleanSpanishToken(token));
                        if (tokenSim > bestSimilarity) {
                            bestSimilarity = tokenSim;
                            bestSpokenWord = token;
                        }
                    }
                }
            }

            if (event.results[0] && event.results[0].isFinal) {
                hasReceivedResult = true;
                const similarityPct = Math.round(bestSimilarity * 100);
                const isMastered = similarityPct >= 82;

                const phonetics = getWordSyllableAndStress(displayTarget);
                const stressedSyl = phonetics.syllables[phonetics.stressedIdx] || displayTarget;
                const regionName = this.currentAccent === 'ar' ? 'Rioplatense (🇦🇷)' : 'Peninsular (🇪🇸)';

                let status = 'deviated';
                let feedback = '';

                if (similarityPct >= 95) {
                    status = 'mastered';
                    feedback = `¡Articulación impecable en modelo ${regionName}! Vocales nítidas y acento tónico exacto en «${stressedSyl.toUpperCase()}».`;
                } else if (isMastered) {
                    status = 'mastered';
                    feedback = `¡Objetivo superado (${similarityPct}% de coincidencia)! La fuerza tónica en «${stressedSyl.toUpperCase()}» es clara y natural.`;
                } else if (similarityPct >= 60) {
                    status = 'close';
                    feedback = `Intento cercano (${similarityPct}%). Apoya con mayor firmeza la sílaba tónica «${stressedSyl.toUpperCase()}» y mantén abiertas todas las vocales.`;
                } else {
                    status = 'deviated';
                    feedback = `Divergencia fonética detectada (se reconoció: «${bestSpokenWord || 'poco claro'}»). Escucha la voz modelo y repite marcando cada sílaba.`;
                }

                if (options.onResult) {
                    options.onResult({
                        targetWord: displayTarget,
                        spokenWord: bestSpokenWord || (allHypotheses[0] || ''),
                        similarity: bestSimilarity,
                        similarityPct,
                        isMastered,
                        status,
                        feedback,
                        allHypotheses,
                        phonetics
                    });
                }
            } else if (options.onInterim) {
                options.onInterim(allHypotheses[0] || '');
            }
        };

        recognition.onerror = (event) => {
            cleanup();
            if (event.error === 'no-speech') {
                if (!hasReceivedResult && options.onError) {
                    options.onError('No se detectó voz. Pulsa el micrófono y pronuncia la palabra con claridad.');
                }
            } else if (event.error === 'not-allowed') {
                if (options.onError) {
                    options.onError('Permiso de micrófono denegado. Habilita el acceso al micrófono en tu navegador.');
                }
            } else if (event.error !== 'aborted' && options.onError) {
                options.onError(`Aviso de audio (${event.error}). Inténtalo de nuevo.`);
            }
        };

        recognition.onend = () => {
            cleanup();
            if (options.onEnd) options.onEnd();
        };

        try {
            recognition.start();
        } catch (_) {
            cleanup();
            if (options.onError) options.onError('No se pudo inicializar el micrófono. Inténtalo de nuevo.');
        }

        return {
            stop: () => {
                try { recognition.stop(); } catch (_) {}
                cleanup();
            },
            abort: () => {
                try { recognition.abort(); } catch (_) {}
                cleanup();
            }
        };
    }

    stopSingleWordPronunciation() {
        if (this.singleWordRecognition) {
            try {
                this.singleWordRecognition.abort();
            } catch (_) {}
            this.singleWordRecognition = null;
        }
    }

    getWordSyllableAndStress(word) {
        return getWordSyllableAndStress(word);
    }
}

export function calculateWordSimilarity(s1, s2) {
    const a = cleanSpanishToken(s1);
    const b = cleanSpanishToken(s2);
    if (a === b) return 1.0;
    if (!a || !b) return 0.0;

    if (a.startsWith(b) || b.startsWith(a)) {
        const diff = Math.abs(a.length - b.length);
        if (diff <= 2) return 0.90;
        if (diff <= 4 && Math.min(a.length, b.length) >= 4) return 0.83;
    }

    const distance = levenshteinDistance(a, b);
    const maxLength = Math.max(a.length, b.length);
    return 1 - (distance / maxLength);
}

export function levenshteinDistance(a, b) {
    const matrix = [];
    for (let i = 0; i <= b.length; i++) matrix[i] = [i];
    for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

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

/**
 * RAE-Compliant Spanish Syllabifier & Tonic Stress Detector
 * Applies exact Spanish phonological rules:
 * 1. Written accent mark (á, é, í, ó, ú) always determines primary tonic stress.
 * 2. Words without written tilde ending in vowel (a, e, i, o, u), 'n', or 's' are LLANAS (penultimate syllable).
 * 3. Words without written tilde ending in any other consonant (r, l, d, z, etc.) are AGUDAS (final syllable).
 */
export function getWordSyllableAndStress(rawWord) {
    if (!rawWord || typeof rawWord !== 'string') {
        return { word: '', syllables: [], stressedIdx: 0, formattedText: '', formattedHtml: '' };
    }

    const clean = rawWord.toLowerCase().trim().replace(/[^a-záéíóúüñ]/g, '');
    if (!clean) {
        return { word: rawWord, syllables: [rawWord], stressedIdx: 0, formattedText: rawWord, formattedHtml: rawWord };
    }

    const syllables = syllabifySpanish(clean);
    const stressedIdx = determineSpanishStressIndex(clean, syllables);

    const textPieces = syllables.map((s, idx) => idx === stressedIdx ? s.toUpperCase() : s);
    const htmlPieces = syllables.map((s, idx) =>
        idx === stressedIdx
            ? `<span class="syllable-stressed" title="Sílaba Tónica Principal">${s.toUpperCase()}</span>`
            : `<span class="syllable-unstressed">${s}</span>`
    );

    return {
        word: clean,
        syllables,
        stressedIdx,
        formattedText: textPieces.join(' · '),
        formattedHtml: htmlPieces.join(' · ')
    };
}

function syllabifySpanish(word) {
    if (word.length <= 2) return [word];

    const isVowel = (c) => /[aeiouáéíóúü]/i.test(c);
    const isStrongVowel = (c) => /[aeoáéóíú]/i.test(c); // Accented weak vowels í/ú act as strong (hiatus)
    const inseparablePairs = new Set([
        'bl', 'br', 'cl', 'cr', 'dr', 'fl', 'fr', 'gl', 'gr', 'pl', 'pr', 'tr', 'ch', 'll', 'rr', 'qu', 'gu', 'gü'
    ]);

    // Group vowel nuclei (handling diphthongs vs hiatus)
    const nuclei = [];
    let i = 0;
    while (i < word.length) {
        if (isVowel(word[i])) {
            let start = i;
            i++;
            while (i < word.length && isVowel(word[i])) {
                const prev = word[i - 1];
                const curr = word[i];
                // Two strong vowels form a hiatus (separate syllables)
                if (isStrongVowel(prev) && isStrongVowel(curr)) {
                    break;
                }
                i++;
            }
            nuclei.push({ start, end: i - 1 });
        } else {
            i++;
        }
    }

    if (nuclei.length <= 1) return [word];

    const cuts = [];
    for (let n = 0; n < nuclei.length - 1; n++) {
        const n1 = nuclei[n];
        const n2 = nuclei[n + 1];
        const consStart = n1.end + 1;
        const consEnd = n2.start - 1;
        const consLen = consEnd - consStart + 1;

        if (consLen <= 0) {
            cuts.push(n2.start);
        } else if (consLen === 1) {
            cuts.push(consStart);
        } else if (consLen === 2) {
            const pair = word.slice(consStart, consEnd + 1);
            if (inseparablePairs.has(pair)) {
                cuts.push(consStart);
            } else {
                cuts.push(consStart + 1);
            }
        } else {
            const lastTwo = word.slice(consEnd - 1, consEnd + 1);
            if (inseparablePairs.has(lastTwo)) {
                cuts.push(consEnd - 1);
            } else {
                cuts.push(consEnd);
            }
        }
    }

    const syllables = [];
    let prevCut = 0;
    for (const cut of cuts) {
        if (cut > prevCut && cut < word.length) {
            syllables.push(word.slice(prevCut, cut));
            prevCut = cut;
        }
    }
    if (prevCut < word.length) {
        syllables.push(word.slice(prevCut));
    }

    return syllables.length > 0 ? syllables : [word];
}

function determineSpanishStressIndex(word, syllables) {
    const len = syllables.length;
    if (len <= 1) return 0;

    // 1. Explicit written accent mark (tilde: á, é, í, ó, ú)
    for (let i = 0; i < len; i++) {
        if (/[áéíóú]/i.test(syllables[i])) {
            return i;
        }
    }

    // 2. Adverb in -mente: preserve stress of the base adjective (first part)
    if (word.endsWith('mente') && len > 2) {
        return Math.max(0, len - 3);
    }

    // 3. RAE default rule: ends in vowel, 'n', or 's' -> llana (penultimate); otherwise -> aguda (last)
    const lastChar = word[word.length - 1];
    if (/[aeiouns]/i.test(lastChar)) {
        return len - 2;
    }
    return len - 1;
}
