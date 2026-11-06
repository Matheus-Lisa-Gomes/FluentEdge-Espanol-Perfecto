/**
 * FluentEdge Español Perfecto: A1–C2 MCER / DELE Writing Assessment Engine
 * Evaluates Spanish essays across the 4 official MCER / Instituto Cervantes DELE scales:
 * 1. Contenido y Cumplimiento de la Tarea (0–5)
 * 2. Adecuación Comunicativa y Registro (0–5)
 * 3. Cohesión y Organización Discursiva (0–5)
 * 4. Riqueza Léxica y Corrección Gramatical (0–5)
 */

function stripAccents(str) {
    return String(str || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
}

export const LEVEL_SPECS = {
    A1: {
        level: 'A1',
        name: 'MCER A1 · Acceso (Principiante)',
        shortName: 'A1 Acceso',
        minWords: 50,
        maxWords: 80,
        leniency: 5, // 45–85 words
        minParagraphs: 1,
        maxParagraphs: 2,
        minStructures: 2,
        minTargetWords: 6,
        passScorePct: 60,
        minMarkers: 2,
        scaleBadge: 'DELE A1 · Nivel Acceso'
    },
    A2: {
        level: 'A2',
        name: 'MCER A2 · Plataforma (Elemental)',
        shortName: 'A2 Plataforma',
        minWords: 90,
        maxWords: 130,
        leniency: 5, // 85–135 words
        minParagraphs: 2,
        maxParagraphs: 3,
        minStructures: 2,
        minTargetWords: 6,
        passScorePct: 65,
        minMarkers: 2,
        scaleBadge: 'DELE A2 · Nivel Plataforma'
    },
    B1: {
        level: 'B1',
        name: 'MCER B1 · Umbral (Intermedio)',
        shortName: 'B1 Umbral',
        minWords: 140,
        maxWords: 180,
        leniency: 5, // 135–185 words
        minParagraphs: 3,
        maxParagraphs: 3,
        minStructures: 3,
        minTargetWords: 7,
        passScorePct: 70,
        minMarkers: 3,
        scaleBadge: 'DELE B1 · Nivel Umbral'
    },
    B2: {
        level: 'B2',
        name: 'MCER B2 · Avanzado (Intermedio Alto)',
        shortName: 'B2 Avanzado',
        minWords: 180,
        maxWords: 220,
        leniency: 5, // 175–225 words
        minParagraphs: 3,
        maxParagraphs: 4,
        minStructures: 3,
        minTargetWords: 7,
        passScorePct: 72,
        minMarkers: 3,
        scaleBadge: 'DELE B2 · Nivel Avanzado'
    },
    C1: {
        level: 'C1',
        name: 'MCER C1 · Dominio Operativo Eficaz',
        shortName: 'C1 Dominio',
        minWords: 220,
        maxWords: 260,
        leniency: 5, // 215–265 words
        minParagraphs: 3,
        maxParagraphs: 4,
        minStructures: 4,
        minTargetWords: 8,
        passScorePct: 75,
        minMarkers: 4,
        scaleBadge: 'DELE C1 · Dominio Operativo Eficaz'
    },
    C2: {
        level: 'C2',
        name: 'MCER C2 · Maestría (Perfección)',
        shortName: 'C2 Maestría',
        minWords: 280,
        maxWords: 320,
        leniency: 5, // 275–325 words
        minParagraphs: 4,
        maxParagraphs: 5,
        minStructures: 6,
        minTargetWords: 8,
        passScorePct: 85,
        minMarkers: 5,
        scaleBadge: 'DELE C2 · Maestría Panhispánica'
    }
};

export function getLevelSpec(level = 'C1') {
    const key = String(level || 'C1').toUpperCase();
    return LEVEL_SPECS[key] || LEVEL_SPECS.C1;
}

/**
 * Multi-Level Spanish Syntactic & Grammatical Patterns
 * - Foundational patterns (A1/A2/B1) support beginner & intermediate milestones.
 * - Intermediate/Advanced/Mastery patterns (B1–C2) operate across all levels and form the core requirement for B2, C1, and C2.
 */
export const SYNTACTIC_PATTERNS = {
    // Foundational Patterns (Active for A1, A2, and B1)
    conectoresBasicos: {
        name: 'Conectores Causales y Aditivos',
        description: 'Uso de nexos lógicos fundamentales («porque», «por eso», «además», «también», «pero», «cuando»).',
        levels: ['A1', 'A2'],
        weight: 0.4,
        regex: /\b(porque|por eso|adem[aá]s|tambi[eé]n|sin embargo|por tanto|cuando|mientras)\b/i
    },
    contrasteSerEstarHaber: {
        name: 'Expresión de Existencia y Estado (Ser/Estar/Haber)',
        description: 'Construcciones descriptivas con «hay», «es/son» y «está/están» para situar y describir.',
        levels: ['A1', 'A2'],
        weight: 0.4,
        regex: /\b(hay\s+\w+|es\s+(?:muy|un|una|importante|necesario|agradable)|est[aá](?:n)?\s+(?:en|muy|cerca|lejos|bien))\b/i
    },
    perifrasisVerbales: {
        name: 'Perífrasis Verbales y Expresión de Gustos',
        description: 'Estructuras como «ir a + infinitivo», «tener que + infinitivo», «poder + infinitivo» o «me gusta».',
        levels: ['A1', 'A2', 'B1'],
        weight: 0.5,
        regex: /\b((?:voy|vas|va|vamos|van)\s+a\s+[a-záéíóúñ]+(?:ar|er|ir)|(?:tengo|tienes|tiene|tenemos|tienen|hay)\s+que\s+[a-záéíóúñ]+(?:ar|er|ir)|(?:puedo|puede|podemos|pueden|quiero|quiere|queremos)\s+[a-záéíóúñ]+(?:ar|er|ir)|(?:me|nos|les)\s+(?:gusta|gustan|encanta|encantan|interesa))\b/i
    },
    comparativosYTemporales: {
        name: 'Comparativos y Marcadores Temporales',
        description: 'Comparaciones («más... que», «mejor que», «tan... como») y marcos temporales («antes de», «después de», «desde hace»).',
        levels: ['A1', 'A2', 'B1'],
        weight: 0.5,
        regex: /\b(m[aá]s\s+[a-záéíóúñ]+\s+que|menos\s+[a-záéíóúñ]+\s+que|tan\s+[a-záéíóúñ]+\s+como|mejor(?:es)?\s+que|antes\s+de|despu[eé]s\s+de|desde\s+hace|todos\s+los\s+d[ií]as)\b/i
    },

    // Core Intermediate to Mastery Patterns (Active across ALL levels A1–C2)
    subjuntivoPresente: {
        name: 'Subjuntivo de Valoración o Finalidad',
        description: 'Subordinadas sustantivas o finales con subjuntivo («es fundamental que...», «para que...», «sin que...»).',
        levels: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'],
        weight: 0.7,
        regex: /\b(es\s+(?:importante|necesario|fundamental|imprescindible|preciso|urgente|conveniente|vital|posible|probable)\s+que|para\s+que|a\s+fin\s+de\s+que|sin\s+que|con\s+el\s+objetivo\s+de\s+que|antes\s+de\s+que)\b/i
    },
    conectoresContraargumentativos: {
        name: 'Conectores Contraargumentativos y Concesivos',
        description: 'Articulación dialéctica mediante «sin embargo», «no obstante», «a pesar de», «si bien» o «por el contrario».',
        levels: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'],
        weight: 0.7,
        regex: /\b(sin\s+embargo|no\s+obstante|a\s+pesar\s+de|pese\s+a|por\s+el\s+contrario|en\s+cambio|si\s+bien|mientras\s+que|ahora\s+bien|con\s+todo)\b/i
    },
    pasivaReflejaImpersonal: {
        name: 'Pasiva Refleja e Impersonalidad con «Se»',
        description: 'Objetivación del discurso con «se observa», «se considera», «se requiere», «se trata de» o «se ha demostrado».',
        levels: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'],
        weight: 0.7,
        regex: /\b(se\s+(?:observa|observan|considera|consideran|sostiene|requiere|requieren|necesita|necesitan|trata\s+de|puede|pueden|debe|deben|ha\s+\w+ado|ha\s+\w+ido|han\s+\w+ado|han\s+\w+ido|percibe|advierte|estima))\b/i
    },
    oracionesCondicionales: {
        name: 'Cláusulas Condicionales y Potenciales',
        description: 'Hipótesis y matización potencial («siempre y cuando», «en caso de que», «podría», «debería», «habría»).',
        levels: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'],
        weight: 0.7,
        regex: /\b(siempre\s+y\s+cuando|en\s+caso\s+de\s+que|a\s+condici[oó]n\s+de\s+que|salvo\s+que|a\s+menos\s+que|de\s+lo\s+contrario|[a-záéíóúñ]+(?:r[ií]a|r[ií]an|r[ií]amos))\b/i
    },
    subjuntivoImperfectoPluscuamperfecto: {
        name: 'Subjuntivo Imperfecto / Pluscuamperfecto (-ra / -se)',
        description: 'Dominio del subjuntivo en «-ra» o «-se» («fuera/fuese», «hubiera/hubiese», «pudiera», «permitiera»).',
        levels: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'],
        weight: 0.9,
        regex: /\b(fuera|fuese|fueran|fuesen|hubiera|hubiese|hubieran|hubiesen|pudiera|pudiese|pudieran|tuviera|tuviese|hiciera|hiciese|[a-záéíóúñ]{3,}(?:ara|ase|iera|iese|aran|asen|ieran|iesen))\b/i
    },
    impersonalidadAcademica: {
        name: 'Fórmulas de Distanciamiento Académico',
        description: 'Estructuras cultas de encuadre («cabe destacar», «conviene subrayar», «resulta innegable», «no cabe duda»).',
        levels: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'],
        weight: 0.9,
        regex: /\b(cabe\s+(?:destacar|se[ñn]alar|mencionar|preguntarse|resaltar|recordar)|conviene\s+(?:subrayar|recordar|destacar|se[ñn]alar|analizar)|resulta\s+(?:imprescindible|innegable|evidente|imperativo|parad[oó]jico|acuciante|perentorio|insoslayable|fundamental|urgente)|no\s+cabe\s+duda|urge\s+[a-záéíóúñ]+(?:ar|er|ir))\b/i
    },
    estructurasHendidasEnfaticas: {
        name: 'Estructuras Hendidas y Correlación Enfática',
        description: 'Focalización sintáctica («no solo... sino también», «lo que resulta... es», «es precisamente... lo que»).',
        levels: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'],
        weight: 0.85,
        regex: /\b(no\s+s[oó]lo\s+[^.!?]+sino\s+(?:tambi[eé]n|que)|lo\s+que\s+(?:resulta|verdaderamente|realmente|hoy|m[aá]s)\s+[^.!?]+\s+es\b|es\s+precisamente\b|son\s+precisamente\b)/i
    },
    relativosComplejosFormales: {
        name: 'Relativos Formales y Preposicionales (Cuyo / El cual)',
        description: 'Subordinación adjetiva culta mediante «cuyo/a/os/as», «el/la cual», «los/las cuales», «lo cual» o «en virtud de».',
        levels: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'],
        weight: 0.9,
        regex: /\b(cuyo|cuya|cuyos|cuyas|el\s+cual|la\s+cual|los\s+cuales|las\s+cuales|lo\s+cual|en\s+virtud\s+de|a\s+trav[eé]s\s+del\s+cual|mediante\s+el\s+cual)\b/i
    },
    clausulasAbsolutasConcesivas: {
        name: 'Cláusulas Absolutas y Marcadores Causales Cultos',
        description: 'Construcciones como «habida cuenta de», «dado que», «puesto que», «toda vez que», «dicho esto» o «así las cosas».',
        levels: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'],
        weight: 0.85,
        regex: /\b(habida\s+cuenta\s+de|dado\s+que|puesto\s+que|toda\s+vez\s+que|visto\s+que|dicho\s+esto|as[ií]\s+las\s+cosas|una\s+vez\s+[a-záéíóúñ]+(?:ado|ada|ados|adas|ido|ida|idos|idas)|en\s+tanto\s+que)\b/i
    },
    comparativasCorrelativas: {
        name: 'Estructuras Proporcionales y Correlativas',
        description: 'Correlación sintáctica con «a medida que», «cuanto más... más/tanto», «en la medida en que» o «tanto... como».',
        levels: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'],
        weight: 0.85,
        regex: /\b(a\s+medida\s+que|cuanto\s+(?:m[aá]s|menos|mayor|menor)\b|en\s+la\s+medida\s+en\s+que|tanto\s+[^.!?]{2,40}\s+como\b|ya\s+sea\s+[^.!?]+\s+o\b)/i
    }
};

const SPANISH_DISCOURSE_MARKERS = [
    'además', 'asimismo', 'sin embargo', 'no obstante', 'por lo tanto', 'por consiguiente',
    'en consecuencia', 'por un lado', 'por otro lado', 'en primer lugar', 'en segundo lugar',
    'finalmente', 'en conclusión', 'en definitiva', 'por ejemplo', 'es decir', 'en cambio',
    'por el contrario', 'a pesar de', 'pese a', 'dado que', 'puesto que', 'debido a',
    'gracias a', 'mientras que', 'si bien', 'de hecho', 'en efecto', 'cabe destacar',
    'conviene señalar', 'por eso', 'también', 'actualmente', 'indudablemente', 'paulatinamente'
];

// Informalisms penalized at B2, C1, and C2 (allowed at A1/A2)
const INFORMAL_PATTERNS = [
    /\bpues\s+nada\b/i,
    /\bo\s+sea\b/i,
    /\bsúper\s+\w+/i,
    /\bre\s+lindo\b/i,
    /\bguay\b/i,
    /\bchaval(?:es)?\b/i,
    /\bpibe(?:s)?\b/i,
    /\bquilombo\b/i,
    /\bmogollón\b/i,
    /\bun\s+montón\s+de\b/i
];

/**
 * Checks if a target Spanish vocabulary item (or any of its conjugated/inflected stems)
 * appears in the essay text. Supports exact accented forms and accent-free fallback.
 */
export function checkTargetWordUsage(vocabItem, text) {
    if (!vocabItem || !text) {
        return { used: false, matchedStem: null };
    }

    const headword = String(vocabItem.headword || vocabItem.word || '').toLowerCase().trim();
    const stems = Array.isArray(vocabItem.stems) && vocabItem.stems.length > 0
        ? vocabItem.stems
        : [headword, stripAccents(headword)];

    const lowerText = text.toLowerCase();
    const strippedText = stripAccents(lowerText);

    // Tokenize words in text (preserving Spanish letters & ñ)
    const tokens = lowerText.split(/[^a-záéíóúüñ]+/).filter(Boolean);
    const strippedTokens = strippedText.split(/[^a-zñ]+/).filter(Boolean);
    const tokenSet = new Set(tokens);
    const strippedTokenSet = new Set(strippedTokens);

    for (const stem of stems) {
        const cleanStem = String(stem).toLowerCase().trim();
        if (!cleanStem) continue;
        if (cleanStem.includes(' ')) {
            if (lowerText.includes(cleanStem) || strippedText.includes(stripAccents(cleanStem))) {
                return { used: true, matchedStem: cleanStem };
            }
        } else {
            if (tokenSet.has(cleanStem) || strippedTokenSet.has(stripAccents(cleanStem))) {
                return { used: true, matchedStem: cleanStem };
            }
        }
    }

    // Prefix stem fallback for longer Spanish verbs/nouns (>= 6 chars)
    const baseNoAcc = stripAccents(headword.endsWith('se') ? headword.slice(0, -2) : headword);
    if (baseNoAcc.length >= 6) {
        const rootPrefix = baseNoAcc.slice(0, baseNoAcc.length - 2);
        if (rootPrefix.length >= 4) {
            const match = strippedTokens.find(t => t.startsWith(rootPrefix) && t.length <= baseNoAcc.length + 5);
            if (match) {
                return { used: true, matchedStem: match };
            }
        }
    }

    return { used: false, matchedStem: null };
}

function getActivePatternsForLevel(targetLevel = 'C1') {
    const normLevel = String(targetLevel || 'C1').toUpperCase();
    const entries = Object.entries(SYNTACTIC_PATTERNS).filter(([, struct]) => {
        return !struct.levels || struct.levels.includes(normLevel);
    });
    return entries;
}

/**
 * Live real-time metrics analyzer called on every keystroke in Stage 2.
 */
export function analyzeQuickMetrics(text, targetVocabulary = [], targetLevel = 'C1') {
    const spec = getLevelSpec(targetLevel);
    const words = text.trim() ? text.trim().split(/\s+/) : [];
    const wordCount = words.length;

    const paragraphs = text
        .split(/\n\s*\n/)
        .map(p => p.trim())
        .filter(p => p.length > 0);

    const vocabStatus = (targetVocabulary || []).map(v => {
        const res = checkTargetWordUsage(v, text);
        const word = v.headword || v.word;
        return {
            word,
            headword: word,
            pos: v.pos || '',
            cefr: v.cefr || spec.level,
            used: res.used,
            matchedStem: res.matchedStem,
            collocation: v.collocation || '',
            ipa: v.ipa || ''
        };
    });

    const targetWordsUsed = vocabStatus.filter(v => v.used).length;
    const targetWordsTotal = targetVocabulary.length;

    // Syntactic structure detection for active level
    const detectedGrammar = [];
    const activePatterns = getActivePatternsForLevel(spec.level);
    for (const [key, struct] of activePatterns) {
        if (struct.regex.test(text)) {
            detectedGrammar.push({
                id: key,
                name: struct.name,
                description: struct.description
            });
        }
    }

    // Informal checks (only relevant for B2/C1/C2)
    const informalFindings = [];
    if (['B2', 'C1', 'C2'].includes(spec.level)) {
        INFORMAL_PATTERNS.forEach(pattern => {
            const match = text.match(pattern);
            if (match) informalFindings.push(match[0]);
        });
    }

    const allowedMinWords = spec.minWords - spec.leniency;
    const allowedMaxWords = spec.maxWords + spec.leniency;
    const minParagraphs = spec.minParagraphs;
    const maxParagraphs = spec.maxParagraphs;
    const minRequiredStructures = spec.minStructures;

    const structuresMet = detectedGrammar.length >= minRequiredStructures;
    const wordsMet = wordCount >= allowedMinWords && wordCount <= allowedMaxWords;
    const paragraphsMet = paragraphs.length >= minParagraphs && paragraphs.length <= maxParagraphs;

    return {
        wordCount,
        paragraphCount: paragraphs.length,
        targetWordsUsed,
        targetWordsTotal,
        vocabStatus,
        detectedGrammar,
        informalFindings,
        targetLevel: spec.level,
        targetMin: spec.minWords,
        targetMax: spec.maxWords,
        allowedMinWords,
        allowedMaxWords,
        minParagraphs,
        maxParagraphs,
        wordsMet,
        paragraphsMet,
        minRequiredStructures,
        structuresMet
    };
}

/**
 * Full 4-Scale (20-Point) MCER / DELE Spanish Essay Evaluation
 */
export function evaluateEssay(text, currentTopic, targetLevel = 'C1', activeVocabulary = null) {
    const spec = getLevelSpec(targetLevel);
    const words = text.trim() ? text.trim().split(/\s+/) : [];
    const wordCount = words.length;

    const paragraphs = text
        .split(/\n\s*\n/)
        .map(p => p.trim())
        .filter(p => p.length > 0);

    const sentences = text
        .split(/[.!?]+/)
        .map(s => s.trim())
        .filter(s => s.length > 0);

    // 1. Target Vocabulary Analysis
    const targetVocabulary = (activeVocabulary && activeVocabulary.length > 0)
        ? activeVocabulary
        : ((currentTopic && currentTopic.targetVocabulary) || []);

    const targetUsageResults = targetVocabulary.map(v => {
        const usage = checkTargetWordUsage(v, text);
        return {
            ...v,
            used: usage.used,
            matchedStem: usage.matchedStem
        };
    });
    const usedTargetCount = targetUsageResults.filter(v => v.used).length;

    // 2. Discourse Markers & Lexical Diversity
    let discourseMarkerCount = 0;
    const lowerText = text.toLowerCase();
    SPANISH_DISCOURSE_MARKERS.forEach(marker => {
        const regex = new RegExp(`\\b${marker}\\b`, 'gi');
        const matches = lowerText.match(regex);
        if (matches) discourseMarkerCount += matches.length;
    });

    const uniqueWords = new Set(words.map(w => stripAccents(w.toLowerCase()).replace(/[^a-zñ]/g, ''))).size;
    const typeTokenRatio = wordCount > 0 ? (uniqueWords / wordCount) : 0;
    const avgSentenceLength = sentences.length > 0 ? (wordCount / sentences.length) : 0;

    // 3. Syntactic Structures Detection
    const identifiedStructures = [];
    const activePatterns = getActivePatternsForLevel(spec.level);
    for (const [key, struct] of activePatterns) {
        const match = text.match(struct.regex);
        if (match) {
            identifiedStructures.push({
                id: key,
                name: struct.name,
                snippet: match[0],
                description: struct.description
            });
        }
    }

    // 4. Informalisms Check
    const informalMatches = [];
    if (['B2', 'C1', 'C2'].includes(spec.level)) {
        INFORMAL_PATTERNS.forEach(pat => {
            const found = text.match(new RegExp(pat.source, 'gi'));
            if (found) informalMatches.push(...found);
        });
    }

    // =========================================================================
    // 4-SCALE MCER / DELE SCORING (0–5 each, Total 20 points)
    // =========================================================================
    const allowedMinWords = spec.minWords - spec.leniency;
    const allowedMaxWords = spec.maxWords + spec.leniency;
    const minParagraphs = spec.minParagraphs;
    const maxParagraphs = spec.maxParagraphs;

    const wordsGateMet = wordCount >= allowedMinWords && wordCount <= allowedMaxWords;
    const paragraphsGateMet = paragraphs.length >= minParagraphs && paragraphs.length <= maxParagraphs;

    // ESCALA 1: CONTENIDO Y CUMPLIMIENTO DE LA TAREA
    let contentScore = 5.0;
    const feedbackContent = [];

    if (wordCount < allowedMinWords) {
        contentScore -= 1.8;
        feedbackContent.push(`La extensión del texto (${wordCount} palabras) es inferior al rango obligatorio del nivel ${spec.level} (${allowedMinWords}–${allowedMaxWords} palabras, objetivo ${spec.minWords}–${spec.maxWords} ±5). Desarrolla más tus ideas.`);
    } else if (wordCount > allowedMaxWords) {
        contentScore -= 1.4;
        feedbackContent.push(`La extensión del texto (${wordCount} palabras) supera el límite máximo del nivel ${spec.level} (${allowedMaxWords} palabras). El examen DELE valora la capacidad de síntesis y concisión.`);
    } else {
        feedbackContent.push(`Extensión óptima (${wordCount} palabras), cumpliendo con precisión el estándar del nivel ${spec.level} (${allowedMinWords}–${allowedMaxWords} palabras).`);
    }

    if (paragraphs.length < minParagraphs) {
        contentScore -= 1.2;
        feedbackContent.push(`El texto cuenta con ${paragraphs.length} párrafo(s). El nivel ${spec.level} requiere entre ${minParagraphs} y ${maxParagraphs} párrafos bien diferenciados.`);
    } else if (paragraphs.length > maxParagraphs) {
        contentScore -= 1.0;
        feedbackContent.push(`El texto se divide en ${paragraphs.length} párrafos, superando el máximo de ${maxParagraphs} para el nivel ${spec.level}. Agrupa tus ideas con mayor cohesión.`);
    } else {
        feedbackContent.push(`Estructura discursiva excelente con ${paragraphs.length} párrafo(s) equilibrados conforme al nivel ${spec.level}.`);
    }
    contentScore = Math.max(1, Math.min(5, contentScore));

    // ESCALA 2: ADECUACIÓN COMUNICATIVA Y REGISTRO
    let commScore = 4.2;
    const feedbackComm = [];

    if (informalMatches.length > 0) {
        const penalty = Math.min(2.2, informalMatches.length * 0.6);
        commScore -= penalty;
        feedbackComm.push(`Se detectaron expresiones coloquiales («${informalMatches.slice(0, 3).join(', ')}»). En el nivel ${spec.level} conviene mantener un registro culto y objetivo.`);
    } else {
        commScore += 0.5;
        feedbackComm.push(`Registro comunicativo plenamente adecuado a las exigencias del nivel ${spec.name}.`);
    }

    if (identifiedStructures.some(s => s.id === 'impersonalidadAcademica' || s.id === 'pasivaReflejaImpersonal' || s.id === 'subjuntivoPresente')) {
        commScore += 0.3;
        feedbackComm.push(`Buen empleo de mecanismos de matización y enfoque apropiados para el destinatario.`);
    }
    commScore = Math.max(1, Math.min(5, commScore));

    // ESCALA 3: COHESIÓN Y ORGANIZACIÓN DISCURSIVA
    let orgScore = 3.6;
    const feedbackOrg = [];
    if (paragraphsGateMet) orgScore += 0.5;

    if (discourseMarkerCount >= spec.minMarkers) {
        orgScore += 0.9;
        feedbackOrg.push(`Sobresaliente articulación mediante conectores y marcadores del discurso (${discourseMarkerCount} detectados).`);
    } else if (discourseMarkerCount >= 1) {
        orgScore += 0.3;
        feedbackOrg.push(`Uso aceptable de conectores (${discourseMarkerCount}), aunque para el nivel ${spec.level} se recomienda integrar al menos ${spec.minMarkers} marcadores discursivos variados.`);
    } else {
        orgScore -= 0.8;
        feedbackOrg.push(`Faltan conectores lógicos que enlacen las oraciones y los párrafos con fluidez.`);
    }
    orgScore = Math.max(1, Math.min(5, orgScore));

    // ESCALA 4: RIQUEZA LÉXICA Y CORRECCIÓN GRAMATICAL
    let langScore = 2.6;
    const feedbackLang = [];

    if (targetVocabulary.length === 0 || usedTargetCount >= spec.minTargetWords) {
        langScore += 1.4;
        feedbackLang.push(`Excelente integración del léxico obligatorio del nivel ${spec.level} (${usedTargetCount}/${targetVocabulary.length} palabras incorporadas con naturalidad).`);
    } else if (usedTargetCount >= Math.ceil(spec.minTargetWords * 0.6)) {
        langScore += 0.7;
        feedbackLang.push(`Buen uso del vocabulario meta (${usedTargetCount}/${targetVocabulary.length}), aunque se recomienda alcanzar las 10 palabras para dominar el nivel ${spec.level}.`);
    } else {
        langScore -= 0.5;
        feedbackLang.push(`Uso insuficiente del léxico propuesto (${usedTargetCount}/${targetVocabulary.length} palabras utilizadas).`);
    }

    const structsGateMet = identifiedStructures.length >= spec.minStructures;
    if (structsGateMet) {
        langScore += 1.0;
        feedbackLang.push(`Riqueza sintáctica demostrada: ${identifiedStructures.length} estructuras gramaticales detectadas (${identifiedStructures.map(s => s.name).join(', ')}), superando el mínimo de ${spec.minStructures} para ${spec.level}.`);
    } else if (identifiedStructures.length >= 1) {
        langScore += 0.3;
        feedbackLang.push(`Variedad sintáctica parcial (${identifiedStructures.length}/${spec.minStructures} estructuras: ${identifiedStructures.map(s => s.name).join(', ')}). El nivel ${spec.level} exige al menos ${spec.minStructures}.`);
    } else {
        langScore -= 0.6;
        feedbackLang.push(`Sintaxis demasiado elemental (${identifiedStructures.length}/${spec.minStructures} estructuras detectadas). Incorpora construcciones propias del nivel ${spec.level}.`);
    }

    if (typeTokenRatio > 0.52) {
        langScore += 0.2;
    }
    langScore = Math.max(1, Math.min(5, langScore));

    const rawTotal = contentScore + commScore + orgScore + langScore;
    const normalizedPercentage = Math.round((rawTotal / 20) * 100);

    const targetGateMet = targetVocabulary.length > 0
        ? (usedTargetCount >= spec.minTargetWords)
        : true;

    const meetsThreshold = normalizedPercentage >= spec.passScorePct
        && structsGateMet
        && wordsGateMet
        && paragraphsGateMet
        && targetGateMet;

    return {
        rawTotal: Number(rawTotal.toFixed(1)),
        percentage: normalizedPercentage,
        cefr: {
            level: spec.level,
            badge: spec.scaleBadge,
            name: spec.name,
            minScore: spec.passScorePct
        },
        targetLevel: spec.level,
        meetsThreshold,
        meetsC1: normalizedPercentage >= 75,
        meetsC2: normalizedPercentage >= 85,
        scales: {
            content: { score: Number(contentScore.toFixed(1)), max: 5, feedback: feedbackContent },
            communicative: { score: Number(commScore.toFixed(1)), max: 5, feedback: feedbackComm },
            organisation: { score: Number(orgScore.toFixed(1)), max: 5, feedback: feedbackOrg },
            language: { score: Number(langScore.toFixed(1)), max: 5, feedback: feedbackLang }
        },
        metrics: {
            wordCount,
            paragraphsCount: paragraphs.length,
            sentencesCount: sentences.length,
            avgSentenceLength: Math.round(avgSentenceLength),
            typeTokenRatio: Math.round(typeTokenRatio * 100),
            usedTargetCount,
            totalTargetCount: targetVocabulary.length,
            targetUsageResults,
            identifiedStructures,
            informalMatches,
            wordsGateMet,
            paragraphsGateMet,
            allowedMinWords,
            allowedMaxWords,
            minParagraphs,
            maxParagraphs
        }
    };
}

/**
 * Generates an optimized Spanish prompt for external AI assistants (ChatGPT, Claude, Gemini)
 * strictly calibrated to the active MCER / DELE level (A1 through C2), Tree Topic, and 10 Target Words.
 */
export function generateAiEssayPrompt(topic, targetVocabulary = [], targetLevel = 'C1') {
    const spec = getLevelSpec(targetLevel);
    const allowedMin = spec.minWords - spec.leniency;
    const allowedMax = spec.maxWords + spec.leniency;

    const topicTitle = topic ? topic.title : 'Sociedad, Cultura y Progreso en el Mundo Hispano';
    const rootSubjectName = topic?.subjectName || 'Tema Principal';
    const subTheme1Name = topic?.theme1Name || 'Subtema 1';
    const subTheme2Name = topic?.theme2Name || 'Subtema 2';
    const topicDirective = topic?.directive || 'Redacte un texto en español acorde al nivel seleccionado.';
    const keywordsList = (topic?.keywords && topic.keywords.length > 0)
        ? topic.keywords.slice(0, 10).join(', ')
        : 'cultura, sociedad, desarrollo, comunidad';

    const vocabItems = targetVocabulary.map((v, i) => {
        const word = v.displayWord || v.headword || v.word || '';
        const pos = v.pos ? `[${v.pos}]` : '';
        const def = v.definition ? ` — ${v.definition}` : '';
        const colloc = v.collocation ? ` (ejemplo: ${v.collocation})` : '';
        return `${i + 1}. ${word} ${pos}${def}${colloc}`;
    }).join('\n');

    const activePatterns = getActivePatternsForLevel(spec.level);
    const patternListText = activePatterns.map(([, p]) => `   - ${p.name}: ${p.description}`).join('\n');

    return `Actúa como un examinador y redactor experto del Instituto Cervantes (DELE) y redacta un texto modelo en español para el nivel oficial ${spec.name} que responda exactamente al siguiente tema:

ARQUITECTURA DEL TEMA:
- Título: «${topicTitle}»
- Sujeto Principal (Raíz): ${rootSubjectName}
- Subtema 1: ${subTheme1Name}
- Subtema 2: ${subTheme2Name}
- Consigna / Directiva: «${topicDirective}»
- Conceptos temáticos que debes incluir para validar la coherencia temática: ${keywordsList}

REQUISITOS OBLIGATORIOS E INNEGOCIABLES DEL VALIDADOR:

1. EXTENSIÓN ESTRICTA (${spec.minWords} A ${spec.maxWords} PALABRAS):
   - El texto DEBE tener estrictamente entre ${spec.minWords} y ${spec.maxWords} palabras (margen máximo permitido de ±5 palabras: de ${allowedMin} a ${allowedMax} palabras en total).
   - No escribas menos de ${allowedMin} palabras ni superes las ${allowedMax} palabras. Cuenta cada palabra con precisión antes de entregar el resultado.

2. ARQUITECTURA DE PÁRRAFOS (${spec.minParagraphs} A ${spec.maxParagraphs} PÁRRAFOS):
   - Divide el texto exactamente en ${spec.minParagraphs === spec.maxParagraphs ? `${spec.minParagraphs} párrafos` : `entre ${spec.minParagraphs} y ${spec.maxParagraphs} párrafos`} separados por una línea en blanco.

3. LÉXICO OBLIGATORIO (10/10 PALABRAS REQUERIDAS — SIN OMISIONES):
   - Incorpora de forma natural LAS 10 palabras de vocabulario siguientes (puedes usar su forma base o conjugaciones/plurales legítimos en español):
${vocabItems}

4. RADAR GRAMATICAL Y SINTÁCTICO (MÍNIMO ${spec.minStructures} ESTRUCTURAS DISTINTAS):
   - Incluye al menos ${spec.minStructures} estructuras gramaticales distintas de la siguiente lista oficial del nivel ${spec.level} para activar el radar sintáctico automático:
${patternListText}

5. REGISTRO Y ESTILO PANHISPÁNICO CULTO:
   - Utiliza una ortografía impecable en español (incluyendo todas las tildes: á, é, í, ó, ú y la letra ñ).
   - Adecúa el tono exactamente al nivel ${spec.name}.

INSTRUCCIÓN DE SALIDA:
Entrega ÚNICAMENTE el texto del ensayo en español, sin títulos adicionales, sin encabezados, sin notas de recuento de palabras y sin comentarios previos ni posteriores. Comienza directamente con la primera oración del primer párrafo.`;
}

