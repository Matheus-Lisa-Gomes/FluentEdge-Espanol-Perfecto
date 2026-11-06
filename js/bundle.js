/**
 * FluentEdge: EspaÃ±ol Perfecto (A1â€“C2 MCER / DELE) - Standalone Unified Bundle
 * Works directly on file:// as well as localhost http://
 */

(function() {
  'use strict';

  // ==========================================
  // 1. VOCABULARY LEXICON (A1â€“C2 SPANISH WORDS)
  // ==========================================
/**
 * FluentEdge Español Perfecto: A1–C2 MCER / DELE Lexicon Engine
 * Covers all 6 official Marco Común Europeo de Referencia (MCER) & Instituto Cervantes levels:
 * A1 (Acceso), A2 (Plataforma), B1 (Umbral), B2 (Avanzado), C1 (Dominio Operativo Eficaz), C2 (Maestría).
 *
 * Every entry includes:
 * - headword: Canonical Spanish lemma with proper orthography
 * - pos: 'verbo' | 'sustantivo' | 'adjetivo' | 'adverbio'
 * - cefr: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'
 * - ipa: Standard phonetic transcription
 * - definition: Clear pan-Hispanic definition (with beginner-friendly support at A1–A2)
 * - collocation: Natural usage example in authentic Rioplatense / Peninsular Spanish context
 * - stems: Morphological & inflectional forms for real-time essay detection
 */

function stripSpanishAccents(str) {
    return String(str || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
}

/**
 * Generates comprehensive Spanish morphological forms (conjugations, gender/number inflections,
 * enclitic pronoun attachments, and accent-free fallbacks) so learners get credit when
 * naturally conjugating verbs or agreeing nouns/adjectives in gender and number.
 */
function generateWordStems(headword, pos, customStems = []) {
    const hw = headword.toLowerCase().trim();
    const forms = new Set([hw, stripSpanishAccents(hw)]);

    for (const cs of customStems) {
        const clean = cs.toLowerCase().trim();
        if (clean) {
            forms.add(clean);
            forms.add(stripSpanishAccents(clean));
        }
    }

    if (pos === 'verbo') {
        // Handle reflexive verbs ending in -se
        const baseVerb = hw.endsWith('se') ? hw.slice(0, -2) : hw;
        forms.add(baseVerb);
        forms.add(stripSpanishAccents(baseVerb));

        const normalizedBase = stripSpanishAccents(baseVerb);
        if (normalizedBase.endsWith('ar') || normalizedBase.endsWith('er') || normalizedBase.endsWith('ir')) {
            const root = baseVerb.slice(0, -2);
            const rootNoAcc = stripSpanishAccents(root);
            const ending = normalizedBase.slice(-2);

            // Standard suffixes across Presente, Imperfecto, Indefinido, Futuro, Condicional, Subjuntivo, Gerundio, Participio
            const arEndings = [
                'o', 'as', 'a', 'amos', 'áis', 'ais', 'an', 'ás',
                'aba', 'abas', 'ábamos', 'abamos', 'abais', 'aban',
                'é', 'aste', 'ó', 'asteis', 'aron',
                'e', 'es', 'emos', 'éis', 'eis', 'en', 'és',
                'ara', 'aras', 'áramos', 'aramos', 'arais', 'aran',
                'ase', 'ases', 'ásemos', 'asemos', 'aseis', 'asen',
                'aré', 'arás', 'ará', 'aremos', 'aréis', 'arán',
                'aría', 'arías', 'aríamos', 'aríais', 'arían',
                'ando', 'ado', 'ada', 'ados', 'adas',
                'arme', 'arte', 'arse', 'arnos', 'arlo', 'arla', 'arlos', 'arlas', 'arle', 'arles'
            ];
            const erIrEndings = [
                'o', 'es', 'e', 'emos', 'éis', 'eis', 'imos', 'ís', 'en', 'és',
                'ía', 'ías', 'íamos', 'íais', 'ían',
                'í', 'iste', 'ió', 'imos', 'isteis', 'ieron', 'eron',
                'a', 'as', 'amos', 'áis', 'ais', 'an', 'ás',
                'iera', 'ieras', 'iéramos', 'ieramos', 'ierais', 'ieran',
                'iese', 'ieses', 'iésemos', 'iesemos', 'ieseis', 'iesen',
                'eré', 'erás', 'erá', 'eremos', 'eréis', 'erán',
                'iré', 'irás', 'irá', 'iremos', 'iréis', 'irán',
                'ería', 'erías', 'eríamos', 'eríais', 'erían',
                'iría', 'irías', 'iríamos', 'iríais', 'irían',
                'iendo', 'yendo', 'ido', 'ida', 'idos', 'idas',
                'erme', 'erte', 'erse', 'ernos', 'erlo', 'erla', 'erlos', 'erlas', 'erle', 'erles',
                'irme', 'irte', 'irse', 'irnos', 'irlo', 'irla', 'irlos', 'irlas', 'irle', 'irles'
            ];

            const targetEndings = ending === 'ar' ? arEndings : erIrEndings;
            for (const suf of targetEndings) {
                const f1 = root + suf;
                const f2 = rootNoAcc + stripSpanishAccents(suf);
                if (f1.length >= 3) forms.add(f1);
                if (f2.length >= 3) forms.add(f2);
            }

            // Orthographic alternations: -car -> -qu, -gar -> -gu, -zar -> -c, -cer/-cir -> -zc, -ger/-gir -> -j
            if (rootNoAcc.endsWith('c') && ending === 'ar') {
                const altRoot = root.slice(0, -1) + 'qu';
                ['e', 'é', 'es', 'emos', 'éis', 'en'].forEach(s => {
                    forms.add(altRoot + s);
                    forms.add(stripSpanishAccents(altRoot + s));
                });
            }
            if (rootNoAcc.endsWith('g') && ending === 'ar') {
                const altRoot = root.slice(0, -1) + 'gu';
                ['e', 'é', 'es', 'emos', 'éis', 'en'].forEach(s => {
                    forms.add(altRoot + s);
                    forms.add(stripSpanishAccents(altRoot + s));
                });
            }
            if (rootNoAcc.endsWith('z') && ending === 'ar') {
                const altRoot = root.slice(0, -1) + 'c';
                ['e', 'é', 'es', 'emos', 'éis', 'en'].forEach(s => {
                    forms.add(altRoot + s);
                    forms.add(stripSpanishAccents(altRoot + s));
                });
            }
            if (( normalizedBase.endsWith('cer') || normalizedBase.endsWith('cir') ) && root.length >= 2) {
                const altRoot = root.slice(0, -1) + 'zc';
                ['o', 'a', 'as', 'amos', 'áis', 'an'].forEach(s => {
                    forms.add(altRoot + s);
                    forms.add(stripSpanishAccents(altRoot + s));
                });
            }
            if (normalizedBase.endsWith('uir')) {
                const altRoot = root + 'y';
                ['o', 'es', 'e', 'en', 'ó', 'eron', 'a', 'as', 'amos', 'an', 'endo', 'era', 'ese'].forEach(s => {
                    forms.add(altRoot + s);
                    forms.add(stripSpanishAccents(altRoot + s));
                });
            }
        }
    } else if (pos === 'sustantivo' || pos === 'adjetivo') {
        const noAcc = stripSpanishAccents(hw);
        // Gender and plural variations
        if (hw.endsWith('o') || hw.endsWith('a')) {
            const stem = hw.slice(0, -1);
            forms.add(stem + 'o');
            forms.add(stem + 'a');
            forms.add(stem + 'os');
            forms.add(stem + 'as');
            forms.add(stripSpanishAccents(stem + 'os'));
            forms.add(stripSpanishAccents(stem + 'as'));
        } else if (hw.endsWith('z')) {
            const stem = hw.slice(0, -1);
            forms.add(stem + 'ces');
            forms.add(stripSpanishAccents(stem + 'ces'));
        } else if (noAcc.endsWith('ion') || noAcc.endsWith('or') || noAcc.endsWith('al') || noAcc.endsWith('ar') || noAcc.endsWith('el') || noAcc.endsWith('il') || noAcc.endsWith('ul') || noAcc.endsWith('ad') || noAcc.endsWith('ud') || noAcc.endsWith('en')) {
            forms.add(hw + 'es');
            forms.add(noAcc + 'es');
            forms.add(hw + 'a');
            forms.add(hw + 'as');
            forms.add(noAcc + 'a');
            forms.add(noAcc + 'as');
        } else {
            forms.add(hw + 's');
            forms.add(hw + 'es');
            forms.add(noAcc + 's');
            forms.add(noAcc + 'es');
        }
        // Superlative -ísimo / -ísima for adjectives
        if (pos === 'adjetivo' && hw.length > 3) {
            const adjStem = (hw.endsWith('o') || hw.endsWith('a') || hw.endsWith('e')) ? hw.slice(0, -1) : hw;
            forms.add(adjStem + 'ísimo');
            forms.add(adjStem + 'ísima');
            forms.add(stripSpanishAccents(adjStem + 'isimo'));
            forms.add(stripSpanishAccents(adjStem + 'isima'));
        }
    }

    return Array.from(forms).filter(f => f.length >= 2);
}

const RAW_LEXICON = [
    // =========================================================================
    // NIVEL A1 — ACCESO (Principiante)
    // =========================================================================
    // A1 Verbos (9)
    {
        headword: 'aprender',
        pos: 'verbo',
        cefr: 'A1',
        ipa: '/a.pɾen.ˈdeɾ/',
        definition: 'Adquirir el conocimiento de algo por medio del estudio o de la experiencia (to learn).',
        collocation: '"Quiero aprender español para viajar por Argentina y España."',
        customStems: ['aprendo', 'aprendes', 'aprende', 'aprendemos', 'aprenden', 'aprendí', 'aprendió']
    },
    {
        headword: 'compartir',
        pos: 'verbo',
        cefr: 'A1',
        ipa: '/kom.paɾ.ˈtiɾ/',
        definition: 'Repartir o disfrutar algo en común con otras personas (to share).',
        collocation: '"Nos gusta compartir una cena tranquila con los amigos del barrio."',
        customStems: ['comparto', 'compartes', 'comparte', 'compartimos', 'comparten', 'compartí']
    },
    {
        headword: 'necesitar',
        pos: 'verbo',
        cefr: 'A1',
        ipa: '/ne.se.si.ˈtaɾ/',
        definition: 'Tener falta o necesidad de alguien o algo para un fin cotidiano (to need).',
        collocation: '"Necesitamos más tiempo libre para descansar el fin de semana."',
        customStems: ['necesito', 'necesitas', 'necesita', 'necesitamos', 'necesitan']
    },
    {
        headword: 'preparar',
        pos: 'verbo',
        cefr: 'A1',
        ipa: '/pɾe.pa.ˈɾaɾ/',
        definition: 'Hacer las operaciones necesarias para tener algo listo, como una comida o un viaje (to prepare).',
        collocation: '"Mi abuela siempre prepara una comida deliciosa los domingos."',
        customStems: ['preparo', 'preparas', 'prepara', 'preparamos', 'preparan', 'preparé']
    },
    {
        headword: 'visitar',
        pos: 'verbo',
        cefr: 'A1',
        ipa: '/bi.si.ˈtaɾ/',
        definition: 'Ir a ver a una persona o conocer un lugar de interés (to visit).',
        collocation: '"En vacaciones vamos a visitar museos históricos en Madrid y Buenos Aires."',
        customStems: ['visito', 'visitas', 'visita', 'visitamos', 'visitan', 'visité']
    },
    {
        headword: 'conversar',
        pos: 'verbo',
        cefr: 'A1',
        ipa: '/kon.beɾ.ˈsaɾ/',
        definition: 'Hablar o dialogar amigablemente una o varias personas con otra u otras (to chat / converse).',
        collocation: '"Me encanta conversar con mi familia mientras tomamos café o mate."',
        customStems: ['converso', 'conversas', 'conversa', 'conversamos', 'conversan']
    },
    {
        headword: 'descansar',
        pos: 'verbo',
        cefr: 'A1',
        ipa: '/des.kan.ˈsaɾ/',
        definition: 'Cesar en el trabajo o actividad para recuperar fuerzas con reposo (to rest).',
        collocation: '"Después de estudiar toda la tarde, es importante descansar bien."',
        customStems: ['descanso', 'descansas', 'descansa', 'descansamos', 'descansan']
    },
    {
        headword: 'escuchar',
        pos: 'verbo',
        cefr: 'A1',
        ipa: '/es.ku.ˈtʃaɾ/',
        definition: 'Prestar atención a lo que se oye, como música, noticias o una conversación (to listen).',
        collocation: '"Todas las mañanas escucho música en español camino al trabajo."',
        customStems: ['escucho', 'escuchas', 'escucha', 'escuchamos', 'escuchan', 'escuché']
    },
    {
        headword: 'ayudar',
        pos: 'verbo',
        cefr: 'A1',
        ipa: '/a.ʝu.ˈðaɾ/',
        definition: 'Prestar cooperación o apoyo a otra persona en una tarea diaria (to help).',
        collocation: '"Mis compañeros siempre me ayudan cuando tengo una duda en clase."',
        customStems: ['ayudo', 'ayudas', 'ayuda', 'ayudamos', 'ayudan', 'ayudé']
    },

    // A1 Sustantivos (9)
    {
        headword: 'familia',
        pos: 'sustantivo',
        cefr: 'A1',
        ipa: '/fa.ˈmi.lja/',
        definition: 'Grupo de personas emparentadas entre sí que viven juntas o mantienen vínculos cercanos (family).',
        collocation: '"Para mí, pasar tiempo con la familia es lo más importante de la semana."',
        customStems: ['familias', 'familiar', 'familiares']
    },
    {
        headword: 'ciudad',
        pos: 'sustantivo',
        cefr: 'A1',
        ipa: '/sju.ˈðað/',
        definition: 'Conjunto de calles y edificios donde habita una población numerosa (city).',
        collocation: '"Vivo en una ciudad grande con muchos parques, teatros y cafeterías."',
        customStems: ['ciudades']
    },
    {
        headword: 'trabajo',
        pos: 'sustantivo',
        cefr: 'A1',
        ipa: '/tɾa.ˈβa.xo/',
        definition: 'Ocupación retribuida o actividad productiva que realiza una persona (work / job).',
        collocation: '"Mi nuevo trabajo empieza a las nueve de la mañana en el centro."',
        customStems: ['trabajos']
    },
    {
        headword: 'comida',
        pos: 'sustantivo',
        cefr: 'A1',
        ipa: '/ko.ˈmi.ða/',
        definition: 'Alimento que se prepara y consume diariamente para nutrirse (food / meal).',
        collocation: '"La comida casera es mucho más saludable y económica que la rápida."',
        customStems: ['comidas']
    },
    {
        headword: 'escuela',
        pos: 'sustantivo',
        cefr: 'A1',
        ipa: '/es.ˈkwe.la/',
        definition: 'Establecimiento o institución donde se da y se recibe enseñanza (school).',
        collocation: '"Los niños caminan juntos hacia la escuela del barrio cada mañana."',
        customStems: ['escuelas']
    },
    {
        headword: 'amigo',
        pos: 'sustantivo',
        cefr: 'A1',
        ipa: '/a.ˈmi.ɣo/',
        definition: 'Persona con quien se mantiene una relación de afecto y confianza recíproca (friend).',
        collocation: '"El sábado voy al cine con mi mejor amigo después del almuerzo."',
        customStems: ['amigos', 'amiga', 'amigas']
    },
    {
        headword: 'tiempo',
        pos: 'sustantivo',
        cefr: 'A1',
        ipa: '/ˈtjem.po/',
        definition: 'Duración de las cosas o estado atmosférico de un lugar (time / weather).',
        collocation: '"Cuando hace buen tiempo, me gusta caminar al aire libre."',
        customStems: ['tiempos']
    },
    {
        headword: 'barrio',
        pos: 'sustantivo',
        cefr: 'A1',
        ipa: '/ˈba.rjo/',
        definition: 'Cada una de las partes o zonas en que se divide una ciudad o pueblo (neighborhood).',
        collocation: '"Mi barrio tiene panaderías tradicionales, plazas verdes y vecinos amables."',
        customStems: ['barrios']
    },
    {
        headword: 'semana',
        pos: 'sustantivo',
        cefr: 'A1',
        ipa: '/se.ˈma.na/',
        definition: 'Período de siete días consecutivos, de lunes a domingo (week).',
        collocation: '"Durante la semana estudio idiomas y los sábados practico deporte."',
        customStems: ['semanas', 'semanal']
    },

    // A1 Adjetivos (6)
    {
        headword: 'importante',
        pos: 'adjetivo',
        cefr: 'A1',
        ipa: '/im.poɾ.ˈtan.te/',
        definition: 'Que tiene gran valor, interés o conveniencia (important).',
        collocation: '"El desayuno es una comida muy importante para tener energía."',
        customStems: ['importantes']
    },
    {
        headword: 'agradable',
        pos: 'adjetivo',
        cefr: 'A1',
        ipa: '/a.ɣɾa.ˈða.βle/',
        definition: 'Que produce complacencia, bienestar o simpatía en el trato o ambiente (pleasant / nice).',
        collocation: '"Pasamos una tarde muy agradable conversando en la terraza."',
        customStems: ['agradables']
    },
    {
        headword: 'tranquilo',
        pos: 'adjetivo',
        cefr: 'A1',
        ipa: '/tɾaŋ.ˈki.lo/',
        definition: 'Pacífico, sereno, sin ruido ni agitación excesiva (calm / quiet).',
        collocation: '"Prefiero leer en un lugar tranquilo donde no haya ruido."',
        customStems: ['tranquila', 'tranquilos', 'tranquilas']
    },
    {
        headword: 'saludable',
        pos: 'adjetivo',
        cefr: 'A1',
        ipa: '/sa.lu.ˈða.βle/',
        definition: 'Que sirve para conservar o restablecer la salud corporal y mental (healthy).',
        collocation: '"Llevar una vida saludable incluye dormir bien y comer frutas frescas."',
        customStems: ['saludables']
    },
    {
        headword: 'divertido',
        pos: 'adjetivo',
        cefr: 'A1',
        ipa: '/di.βeɾ.ˈti.ðo/',
        definition: 'Que entretiene, alegra y hace pasar un buen rato (fun / entertaining).',
        collocation: '"Aprender un idioma nuevo con juegos y música es muy divertido."',
        customStems: ['divertida', 'divertidos', 'divertidas']
    },
    {
        headword: 'cercano',
        pos: 'adjetivo',
        cefr: 'A1',
        ipa: '/seɾ.ˈka.no/',
        definition: 'Próximo en el espacio, en el tiempo o en el afecto personal (near / close).',
        collocation: '"Hay un supermercado cercano a solo dos cuadras de mi casa."',
        customStems: ['cercana', 'cercanos', 'cercanas']
    },

    // A1 Adverbios (6)
    {
        headword: 'siempre',
        pos: 'adverbio',
        cefr: 'A1',
        ipa: '/ˈsjem.pɾe/',
        definition: 'En todo o en cualquier tiempo, de manera habitual y constante (always).',
        collocation: '"Siempre saludo a mis vecinos cuando salgo por la mañana."',
        customStems: ['siempre']
    },
    {
        headword: 'también',
        pos: 'adverbio',
        cefr: 'A1',
        ipa: '/tam.ˈbjen/',
        definition: 'Adverbio que indica afirmación de igualdad o adición de una idea (also / too).',
        collocation: '"Estudio español y también me interesa mucho la historia latinoamericana."',
        customStems: ['tambien']
    },
    {
        headword: 'temprano',
        pos: 'adverbio',
        cefr: 'A1',
        ipa: '/tem.ˈpɾa.no/',
        definition: 'En las primeras horas del día o antes del tiempo habitual (early).',
        collocation: '"De lunes a viernes me levanto temprano para aprovechar el día."',
        customStems: ['temprano']
    },
    {
        headword: 'juntos',
        pos: 'adverbio',
        cefr: 'A1',
        ipa: '/ˈxun.tos/',
        definition: 'En compañía o unión con otra u otras personas (together).',
        collocation: '"Mis hermanos y yo cenamos juntos todas las noches en casa."',
        customStems: ['junto', 'junta', 'juntas']
    },
    {
        headword: 'cerca',
        pos: 'adverbio',
        cefr: 'A1',
        ipa: '/ˈseɾ.ka/',
        definition: 'A poca distancia en el espacio o en el tiempo (nearby / close).',
        collocation: '"Por suerte, la estación de tren está muy cerca de mi oficina."',
        customStems: ['cerca']
    },
    {
        headword: 'ahora',
        pos: 'adverbio',
        cefr: 'A1',
        ipa: '/a.ˈo.ɾa/',
        definition: 'En este momento o en el tiempo actual (now).',
        collocation: '"Ahora vivo en una ciudad grande, pero antes vivía en el campo."',
        customStems: ['ahora']
    },

    // =========================================================================
    // NIVEL A2 — PLATAFORMA (Elemental)
    // =========================================================================
    // A2 Verbos (9)
    {
        headword: 'organizar',
        pos: 'verbo',
        cefr: 'A2',
        ipa: '/oɾ.ɣa.ni.ˈsaɾ/',
        definition: 'Planificar o disponer ordenadamente las partes de una actividad o evento (to organize).',
        collocation: '"Debemos organizar bien los horarios de estudio antes de los exámenes."',
        customStems: ['organizo', 'organiza', 'organizamos', 'organicé', 'organizó']
    },
    {
        headword: 'descubrir',
        pos: 'verbo',
        cefr: 'A2',
        ipa: '/des.ku.ˈβɾiɾ/',
        definition: 'Hallar o conocer por primera vez un lugar, costumbre o información (to discover).',
        collocation: '"Viajar permite descubrir nuevas tradiciones y formas de pensar."',
        customStems: ['descubro', 'descubre', 'descubrimos', 'descubrí', 'descubrió', 'descubierto']
    },
    {
        headword: 'mejorar',
        pos: 'verbo',
        cefr: 'A2',
        ipa: '/me.xo.ˈɾaɾ/',
        definition: 'Hacer que algo pase a un estado mejor o progrese en calidad (to improve).',
        collocation: '"Practicar todos los días ayuda a mejorar la pronunciación rápidamente."',
        customStems: ['mejoro', 'mejora', 'mejoramos', 'mejoré', 'mejoró']
    },
    {
        headword: 'recomendar',
        pos: 'verbo',
        cefr: 'A2',
        ipa: '/re.ko.men.ˈdaɾ/',
        definition: 'Aconsejar a alguien sobre algo que resulta provechoso o interesante (to recommend).',
        collocation: '"El médico suele recomendar treinta minutos de caminata diaria."',
        customStems: ['recomiendo', 'recomiendas', 'recomienda', 'recomendamos', 'recomiendan', 'recomendé']
    },
    {
        headword: 'participar',
        pos: 'verbo',
        cefr: 'A2',
        ipa: '/paɾ.ti.si.ˈpaɾ/',
        definition: 'Tomar parte activa en una actividad colectiva, proyecto o conversación (to participate).',
        collocation: '"A los jóvenes les entusiasma participar en talleres culturales gratuitos."',
        customStems: ['participo', 'participa', 'participamos', 'participé', 'participó']
    },
    {
        headword: 'recordar',
        pos: 'verbo',
        cefr: 'A2',
        ipa: '/re.koɾ.ˈdaɾ/',
        definition: 'Traer a la memoria una experiencia pasada o tener presente un compromiso (to remember).',
        collocation: '"Todavía recuerdo con alegría mi primer viaje a la costa atlántica."',
        customStems: ['recuerdo', 'recuerdas', 'recuerda', 'recordamos', 'recuerdan', 'recordé']
    },
    {
        headword: 'elegir',
        pos: 'verbo',
        cefr: 'A2',
        ipa: '/e.le.ˈxiɾ/',
        definition: 'Escoger o preferir a alguien o algo para un fin determinado (to choose).',
        collocation: '"Hoy en día podemos elegir entre muchas opciones de transporte público."',
        customStems: ['elijo', 'eliges', 'elige', 'elegimos', 'eligen', 'elegí', 'eligió']
    },
    {
        headword: 'acostumbrar',
        pos: 'verbo',
        cefr: 'A2',
        ipa: '/a.kos.tum.ˈbɾaɾ/',
        definition: 'Adquirir el hábito o la costumbre de hacer algo con regularidad (to get used to / be accustomed).',
        collocation: '"En España y Argentina mucha gente se acostumbra a cenar bastante tarde."',
        customStems: ['acostumbro', 'acostumbra', 'acostumbramos', 'acostumbrado', 'acostumbrada']
    },
    {
        headword: 'ahorrar',
        pos: 'verbo',
        cefr: 'A2',
        ipa: '/a.o.ˈraɾ/',
        definition: 'Guardar una parte del dinero o evitar un gasto innecesario de recursos o tiempo (to save).',
        collocation: '"Cocinar en casa permite ahorrar dinero y cuidar mejor la salud."',
        customStems: ['ahorro', 'ahorras', 'ahorra', 'ahorramos', 'ahorran', 'ahorré']
    },

    // A2 Sustantivos (9)
    {
        headword: 'experiencia',
        pos: 'sustantivo',
        cefr: 'A2',
        ipa: '/eks.pe.ˈɾjen.sja/',
        definition: 'Conocimiento de la vida adquirido por las circunstancias o situaciones vividas (experience).',
        collocation: '"Estudiar en otro país fue una experiencia inolvidable para mi carrera."',
        customStems: ['experiencias']
    },
    {
        headword: 'costumbre',
        pos: 'sustantivo',
        cefr: 'A2',
        ipa: '/kos.ˈtum.bɾe/',
        definition: 'Modo habitual de obrar o tradición cultural establecida en una comunidad (custom / habit).',
        collocation: '"Compartir el mate o las tapas es una costumbre social muy arraigada."',
        customStems: ['costumbres']
    },
    {
        headword: 'naturaleza',
        pos: 'sustantivo',
        cefr: 'A2',
        ipa: '/na.tu.ɾa.ˈle.sa/',
        definition: 'Conjunto del mundo físico, paisajes, plantas y animales no modificados por el ser humano (nature).',
        collocation: '"Los fines de semana salimos al campo para estar en contacto con la naturaleza."',
        customStems: ['naturalezas']
    },
    {
        headword: 'transporte',
        pos: 'sustantivo',
        cefr: 'A2',
        ipa: '/tɾans.ˈpoɾ.te/',
        definition: 'Sistema de medios para trasladar personas o mercancías de un lugar a otro (transportation).',
        collocation: '"El uso del transporte público reduce el tráfico en el centro de la ciudad."',
        customStems: ['transportes']
    },
    {
        headword: 'vacaciones',
        pos: 'sustantivo',
        cefr: 'A2',
        ipa: '/ba.ka.ˈsjo.nes/',
        definition: 'Descanso temporal de una actividad habitual, principalmente del trabajo o de los estudios (vacation).',
        collocation: '"Durante las vacaciones de verano planeamos recorrer el sur en tren."',
        customStems: ['vacación', 'vacacion']
    },
    {
        headword: 'vecino',
        pos: 'sustantivo',
        cefr: 'A2',
        ipa: '/be.ˈsi.no/',
        definition: 'Persona que habita con otras en un mismo edificio, calle o barrio (neighbor).',
        collocation: '"Los vecinos organizaron una feria solidaria en la plaza principal."',
        customStems: ['vecina', 'vecinos', 'vecinas', 'vecindario']
    },
    {
        headword: 'horario',
        pos: 'sustantivo',
        cefr: 'A2',
        ipa: '/o.ˈɾa.ɾjo/',
        definition: 'Distribución de las horas en que se realiza una actividad o servicio (schedule / timetable).',
        collocation: '"Tener un horario flexible facilita combinar el estudio con el deporte."',
        customStems: ['horarios']
    },
    {
        headword: 'consejo',
        pos: 'sustantivo',
        cefr: 'A2',
        ipa: '/kon.ˈse.xo/',
        definition: 'Opinión o recomendación que se da o se pide sobre cómo actuar (advice / tip).',
        collocation: '"Mi profesor me dio un buen consejo para escribir textos más claros."',
        customStems: ['consejos']
    },
    {
        headword: 'recuerdo',
        pos: 'sustantivo',
        cefr: 'A2',
        ipa: '/re.ˈkweɾ.ðo/',
        definition: 'Imagen o memoria que se conserva de una persona, lugar o momento pasado (memory / souvenir).',
        collocation: '"Guardo muy buenos recuerdos de mis años en la escuela secundaria."',
        customStems: ['recuerdos']
    },

    // A2 Adjetivos (6)
    {
        headword: 'necesario',
        pos: 'adjetivo',
        cefr: 'A2',
        ipa: '/ne.se.ˈsa.ɾjo/',
        definition: 'Que hace falta indispensablemente para lograr un propósito (necessary).',
        collocation: '"Es necesario practicar la conversación para ganar confianza al hablar."',
        customStems: ['necesaria', 'necesarios', 'necesarias']
    },
    {
        headword: 'interesante',
        pos: 'adjetivo',
        cefr: 'A2',
        ipa: '/in.te.ɾe.ˈsan.te/',
        definition: 'Que atrae la atención o despierta la curiosidad intelectual (interesting).',
        collocation: '"Ayer leí un artículo muy interesante sobre la historia del tango y el flamenco."',
        customStems: ['interesantes']
    },
    {
        headword: 'cómodo',
        pos: 'adjetivo',
        cefr: 'A2',
        ipa: '/ˈko.mo.ðo/',
        definition: 'Que proporciona bienestar material y facilidad de uso sin esfuerzo (comfortable / convenient).',
        collocation: '"Viajar en tren de larga distancia resulta muy cómodo y seguro."',
        customStems: ['comodo', 'cómoda', 'comoda', 'cómodos', 'cómodas']
    },
    {
        headword: 'tradicional',
        pos: 'adjetivo',
        cefr: 'A2',
        ipa: '/tɾa.ði.sjo.ˈnal/',
        definition: 'Que sigue las costumbres, ideas o normas transmitidas de generación en generación (traditional).',
        collocation: '"En cada fiesta regional se prepara un plato tradicional con productos locales."',
        customStems: ['tradicionales']
    },
    {
        headword: 'económico',
        pos: 'adjetivo',
        cefr: 'A2',
        ipa: '/e.ko.ˈno.mi.ko/',
        definition: 'De bajo costo o relacionado con la administración prudente de los recursos (affordable / economic).',
        collocation: '"Ir al trabajo en bicicleta es un medio de transporte limpio y económico."',
        customStems: ['economico', 'económica', 'economica', 'económicos', 'económicas']
    },
    {
        headword: 'útil',
        pos: 'adjetivo',
        cefr: 'A2',
        ipa: '/ˈu.til/',
        definition: 'Que produce provecho, servicio o beneficio práctico para un fin (useful).',
        collocation: '"Las aplicaciones móviles son muy útiles para aprender vocabulario nuevo."',
        customStems: ['util', 'útiles', 'utiles']
    },

    // A2 Adverbios (6)
    {
        headword: 'frecuentemente',
        pos: 'adverbio',
        cefr: 'A2',
        ipa: '/fɾe.kwen.te.ˈmen.te/',
        definition: 'Con asiduidad, a menudo o muchas veces (frequently / often).',
        collocation: '"Los estudiantes usan frecuentemente la biblioteca digital de la universidad."',
        customStems: ['frecuentemente']
    },
    {
        headword: 'además',
        pos: 'adverbio',
        cefr: 'A2',
        ipa: '/a.ðe.ˈmas/',
        definition: 'Conector que añade una información nueva a lo dicho anteriormente (moreover / besides).',
        collocation: '"El deporte mejora el estado físico; además, ayuda a reducir el estrés."',
        customStems: ['ademas']
    },
    {
        headword: 'especialmente',
        pos: 'adverbio',
        cefr: 'A2',
        ipa: '/es.pe.sjal.ˈmen.te/',
        definition: 'De manera singular, particular o sobre todo en un caso concreto (especially).',
        collocation: '"Me gusta mucho el cine en español, especialmente las películas argentinas y españolas."',
        customStems: ['especialmente']
    },
    {
        headword: 'rápidamente',
        pos: 'adverbio',
        cefr: 'A2',
        ipa: '/ˈra.pi.ða.men.te/',
        definition: 'Con velocidad, prontitud o en poco tiempo (quickly / rapidly).',
        collocation: '"Gracias a la tecnología actual, las noticias viajan rápidamente por el mundo."',
        customStems: ['rapidamente']
    },
    {
        headword: 'bastante',
        pos: 'adverbio',
        cefr: 'A2',
        ipa: '/bas.ˈtan.te/',
        definition: 'En grado suficiente o en una proporción considerable (quite / enough).',
        collocation: '"El examen fue bastante exigente, pero logramos responder todas las preguntas."',
        customStems: ['bastantes']
    },
    {
        headword: 'todavía',
        pos: 'adverbio',
        cefr: 'A2',
        ipa: '/to.ða.ˈβi.a/',
        definition: 'Hasta el momento presente, indicando continuidad de una situación (still / yet).',
        collocation: '"En muchos pueblos pequeños todavía se conservan las fiestas patronales antiguas."',
        customStems: ['todavia']
    },

    // =========================================================================
    // NIVEL B1 — UMBRAL (Intermedio)
    // =========================================================================
    // B1 Verbos (9)
    {
        headword: 'desarrollar',
        pos: 'verbo',
        cefr: 'B1',
        ipa: '/de.sa.ro.ˈʎaɾ/',
        definition: 'Hacer crecer o progresar una capacidad, proyecto, idea o actividad económica.',
        collocation: '"La educación secundaria debe desarrollar el pensamiento crítico en los jóvenes."',
        customStems: ['desarrollo', 'desarrolla', 'desarrollamos', 'desarrollan', 'desarrollé', 'desarrolló']
    },
    {
        headword: 'fomentar',
        pos: 'verbo',
        cefr: 'B1',
        ipa: '/fo.men.ˈtaɾ/',
        definition: 'Impulsar, promover o favorecer el progreso de una actividad o hábito positivo.',
        collocation: '"Es fundamental fomentar el hábito de la lectura desde la infancia."',
        customStems: ['fomento', 'fomenta', 'fomentamos', 'fomentan', 'fomenté', 'fomentó']
    },
    {
        headword: 'adaptarse',
        pos: 'verbo',
        cefr: 'B1',
        ipa: '/a.ðap.ˈtaɾ.se/',
        definition: 'Acomodarse o ajustarse a nuevas condiciones laborales, sociales o culturales.',
        collocation: '"Los profesionales actuales necesitan adaptarse a los cambios tecnológicos constantes."',
        customStems: ['adapto', 'adapta', 'adaptamos', 'adaptan', 'adapté', 'adaptó', 'adaptado', 'adaptada']
    },
    {
        headword: 'influir',
        pos: 'verbo',
        cefr: 'B1',
        ipa: '/in.ˈflwiɾ/',
        definition: 'Producir un efecto o cambio importante sobre el comportamiento o las decisiones de otros.',
        collocation: '"Las redes sociales influyen de manera directa en las opiniones de los consumidores."',
        customStems: ['influyo', 'influyes', 'influye', 'influimos', 'influyen', 'influyó', 'influyan']
    },
    {
        headword: 'lograr',
        pos: 'verbo',
        cefr: 'B1',
        ipa: '/lo.ˈɣɾaɾ/',
        definition: 'Conseguir o alcanzar lo que se intenta o se desea tras un esfuerzo sostenido.',
        collocation: '"Con constancia y disciplina es posible lograr un excelente dominio del idioma."',
        customStems: ['logro', 'logra', 'logramos', 'logran', 'logré', 'logró', 'logre']
    },
    {
        headword: 'plantear',
        pos: 'verbo',
        cefr: 'B1',
        ipa: '/plan.te.ˈaɾ/',
        definition: 'Exponer o proponer un tema, duda, problema o reforma para su análisis y solución.',
        collocation: '"El teletrabajo plantea nuevos retos para separar la vida laboral y familiar."',
        customStems: ['planteo', 'plantea', 'planteamos', 'plantean', 'planteé', 'planteó', 'plantee']
    },
    {
        headword: 'reducir',
        pos: 'verbo',
        cefr: 'B1',
        ipa: '/re.ðu.ˈsiɾ/',
        definition: 'Disminuir la cantidad, el tamaño, la intensidad o el impacto negativo de algo.',
        collocation: '"Muchos municipios buscan reducir el consumo de plásticos de un solo uso."',
        customStems: ['reduzco', 'reduces', 'reduce', 'reducimos', 'reducen', 'reduje', 'redujo', 'redujeron', 'reduzca']
    },
    {
        headword: 'superar',
        pos: 'verbo',
        cefr: 'B1',
        ipa: '/su.pe.ˈɾaɾ/',
        definition: 'Vencer un obstáculo o dificultad, o pasar por encima de un límite establecido.',
        collocation: '"El trabajo en equipo nos permitió superar las dificultades iniciales del proyecto."',
        customStems: ['supero', 'supera', 'superamos', 'superan', 'superé', 'superó', 'supere']
    },
    {
        headword: 'valorar',
        pos: 'verbo',
        cefr: 'B1',
        ipa: '/ba.lo.ˈɾaɾ/',
        definition: 'Reconocer y estimar el mérito, la utilidad o la importancia de una persona o cosa.',
        collocation: '"Las empresas modernas empiezan a valorar más el bienestar emocional de sus empleados."',
        customStems: ['valoro', 'valora', 'valoramos', 'valoran', 'valoré', 'valoró', 'valore']
    },

    // B1 Sustantivos (9)
    {
        headword: 'sociedad',
        pos: 'sustantivo',
        cefr: 'B1',
        ipa: '/so.sje.ˈðað/',
        definition: 'Conjunto de personas que conviven bajo normas comunes y comparten una cultura.',
        collocation: '"Una sociedad justa garantiza el acceso igualitario a la salud y la educación."',
        customStems: ['sociedades']
    },
    {
        headword: 'desarrollo',
        pos: 'sustantivo',
        cefr: 'B1',
        ipa: '/de.sa.ˈro.ʎo/',
        definition: 'Evolución progresiva de una economía, comunidad o persona hacia mejores niveles de vida.',
        collocation: '"La inversión en ciencia e innovación impulsa el desarrollo económico del país."',
        customStems: ['desarrollos']
    },
    {
        headword: 'entorno',
        pos: 'sustantivo',
        cefr: 'B1',
        ipa: '/en.ˈtoɾ.no/',
        definition: 'Ambiente físico, social o laboral que rodea a alguien o algo e influye en su vida.',
        collocation: '"Estudiar en un entorno colaborativo aumenta la motivación de los alumnos."',
        customStems: ['entornos']
    },
    {
        headword: 'equilibrio',
        pos: 'sustantivo',
        cefr: 'B1',
        ipa: '/e.ki.ˈli.βɾjo/',
        definition: 'Armonía y proporción adecuada entre elementos diversos de la vida personal o social.',
        collocation: '"Encontrar un equilibrio entre las responsabilidades laborales y el descanso es vital."',
        customStems: ['equilibrios']
    },
    {
        headword: 'oportunidad',
        pos: 'sustantivo',
        cefr: 'B1',
        ipa: '/o.poɾ.tu.ni.ˈðað/',
        definition: 'Circunstancia favorable o momento oportuno para realizar o conseguir un objetivo.',
        collocation: '"Dominar una segunda lengua abre muchas oportunidades profesionales en el exterior."',
        customStems: ['oportunidades']
    },
    {
        headword: 'recurso',
        pos: 'sustantivo',
        cefr: 'B1',
        ipa: '/re.ˈkuɾ.so/',
        definition: 'Medio material, natural, técnico o económico disponible para resolver una necesidad.',
        collocation: '"Debemos proteger los recursos naturales como el agua potable y los bosques."',
        customStems: ['recursos']
    },
    {
        headword: 'ventaja',
        pos: 'sustantivo',
        cefr: 'B1',
        ipa: '/ben.ˈta.xa/',
        definition: 'Condición favorable o beneficio que tiene algo respecto de otra opción.',
        collocation: '"El aprendizaje en línea ofrece la gran ventaja de estudiar desde cualquier lugar."',
        customStems: ['ventajas', 'desventaja', 'desventajas']
    },
    {
        headword: 'desafío',
        pos: 'sustantivo',
        cefr: 'B1',
        ipa: '/de.sa.ˈfi.o/',
        definition: 'Reto o situación compleja que exige esfuerzo y creatividad para resolverse.',
        collocation: '"El cambio climático representa uno de los mayores desafíos de nuestra época."',
        customStems: ['desafio', 'desafíos', 'desafios']
    },
    {
        headword: 'ciudadano',
        pos: 'sustantivo',
        cefr: 'B1',
        ipa: '/sju.ða.ˈða.no/',
        definition: 'Miembro activo de una comunidad política que posee derechos y deberes cívicos.',
        collocation: '"La participación de cada ciudadano fortalece la convivencia democrática."',
        customStems: ['ciudadana', 'ciudadanos', 'ciudadanas', 'ciudadanía']
    },

    // B1 Adjetivos (6)
    {
        headword: 'fundamental',
        pos: 'adjetivo',
        cefr: 'B1',
        ipa: '/fun.da.men.ˈtal/',
        definition: 'Que sirve de base principal o resulta indispensable para el éxito de algo.',
        collocation: '"El respeto mutuo cumple un papel fundamental en cualquier debate público."',
        customStems: ['fundamentales']
    },
    {
        headword: 'sostenible',
        pos: 'adjetivo',
        cefr: 'B1',
        ipa: '/sos.te.ˈni.βle/',
        definition: 'Que puede mantenerse en el tiempo sin agotar los recursos ni dañar el medio ambiente.',
        collocation: '"Las ciudades modernas apuestan por un modelo de turismo más sostenible."',
        customStems: ['sostenibles']
    },
    {
        headword: 'adecuado',
        pos: 'adjetivo',
        cefr: 'B1',
        ipa: '/a.ðe.ˈkwa.ðo/',
        definition: 'Apropiado o conveniente para las condiciones o el propósito que se persigue.',
        collocation: '"Es preciso contar con la formación adecuada antes de asumir ese puesto."',
        customStems: ['adecuada', 'adecuados', 'adecuadas']
    },
    {
        headword: 'consciente',
        pos: 'adjetivo',
        cefr: 'B1',
        ipa: '/kons.ˈsjen.te/',
        definition: 'Que tiene pleno conocimiento y responsabilidad sobre las consecuencias de sus actos.',
        collocation: '"La población joven es cada vez más consciente de la importancia del reciclaje."',
        customStems: ['conscientes']
    },
    {
        headword: 'cotidiano',
        pos: 'adjetivo',
        cefr: 'B1',
        ipa: '/ko.ti.ˈðja.no/',
        definition: 'Que ocurre o se realiza todos los días como parte de la vida habitual.',
        collocation: '"La inteligencia artificial ya forma parte de nuestras tareas cotidianas."',
        customStems: ['cotidiana', 'cotidianos', 'cotidianas']
    },
    {
        headword: 'eficaz',
        pos: 'adjetivo',
        cefr: 'B1',
        ipa: '/e.fi.ˈkas/',
        definition: 'Que logra producir el efecto o resultado esperado de manera práctica.',
        collocation: '"El diálogo abierto demostró ser el método más eficaz para resolver el conflicto."',
        customStems: ['eficaces']
    },

    // B1 Adverbios (6)
    {
        headword: 'actualmente',
        pos: 'adverbio',
        cefr: 'B1',
        ipa: '/ak.twal.ˈmen.te/',
        definition: 'En el tiempo presente o en la coyuntura contemporánea.',
        collocation: '"Actualmente, millones de profesionales trabajan de forma remota desde sus hogares."',
        customStems: ['actualmente']
    },
    {
        headword: 'realmente',
        pos: 'adverbio',
        cefr: 'B1',
        ipa: '/re.al.ˈmen.te/',
        definition: 'Efectivamente, en verdad o de manera auténtica.',
        collocation: '"Debemos preguntarnos qué medidas son realmente útiles para mejorar la educación."',
        customStems: ['realmente']
    },
    {
        headword: 'generalmente',
        pos: 'adverbio',
        cefr: 'B1',
        ipa: '/xe.ne.ɾal.ˈmen.te/',
        definition: 'En la mayoría de los casos o de modo habitual.',
        collocation: '"Quienes leen con frecuencia generalmente poseen mayor riqueza de vocabulario."',
        customStems: ['generalmente']
    },
    {
        headword: 'lamentablemente',
        pos: 'adverbio',
        cefr: 'B1',
        ipa: '/la.men.ta.βle.ˈmen.te/',
        definition: 'De manera desafortunada o digna de sentirse con pesar.',
        collocation: '"Lamentablemente, todavía existen grandes desigualdades en el acceso a internet."',
        customStems: ['lamentablemente']
    },
    {
        headword: 'afortunadamente',
        pos: 'adverbio',
        cefr: 'B1',
        ipa: '/a.foɾ.tu.na.ða.ˈmen.te/',
        definition: 'Por buena suerte o con un desenlace favorable.',
        collocation: '"Afortunadamente, las energías limpias son hoy mucho más accesibles que hace diez años."',
        customStems: ['afortunadamente']
    },
    {
        headword: 'gradualmente',
        pos: 'adverbio',
        cefr: 'B1',
        ipa: '/ɡɾa.ðwal.ˈmen.te/',
        definition: 'De forma progresiva, paso a paso y sin cambios bruscos.',
        collocation: '"Los hábitos saludables deben incorporarse gradualmente en la rutina diaria."',
        customStems: ['gradualmente']
    },

    // =========================================================================
    // NIVEL B2 — AVANZADO (Intermedio Alto)
    // =========================================================================
    // B2 Verbos (9)
    {
        headword: 'abordar',
        pos: 'verbo',
        cefr: 'B2',
        ipa: '/a.βoɾ.ˈðaɾ/',
        definition: 'Emprender el análisis o tratamiento de un asunto complejo o espinoso.',
        collocation: '"Resulta urgente abordar el problema de la vivienda juvenil desde una perspectiva integral."',
        customStems: ['abordo', 'aborda', 'abordamos', 'abordan', 'abordé', 'abordó', 'aborde']
    },
    {
        headword: 'garantizar',
        pos: 'verbo',
        cefr: 'B2',
        ipa: '/ɡa.ɾan.ti.ˈsaɾ/',
        definition: 'Dar seguridad o certeza de que un derecho, servicio o resultado se cumplirá.',
        collocation: '"Las instituciones públicas deben garantizar la igualdad de oportunidades educativas."',
        customStems: ['garantizo', 'garantiza', 'garantizamos', 'garantizan', 'garanticé', 'garantizó', 'garantice']
    },
    {
        headword: 'cuestionar',
        pos: 'verbo',
        cefr: 'B2',
        ipa: '/kwes.tjo.ˈnaɾ/',
        definition: 'Poner en duda o someter a examen crítico una idea o práctica establecida.',
        collocation: '"Numerosos especialistas cuestionan el uso excesivo de pantallas en las aulas infantiles."',
        customStems: ['cuestiono', 'cuestiona', 'cuestionamos', 'cuestionan', 'cuestioné', 'cuestionó', 'cuestione']
    },
    {
        headword: 'repercutir',
        pos: 'verbo',
        cefr: 'B2',
        ipa: '/re.peɾ.ku.ˈtiɾ/',
        definition: 'Tener una decisión o fenómeno consecuencias indirectas pero notables en otro ámbito.',
        collocation: '"La inflación repercute directamente en el poder adquisitivo de las familias trabajadoras."',
        customStems: ['repercute', 'repercuten', 'repercutió', 'repercutirá', 'repercuta']
    },
    {
        headword: 'promover',
        pos: 'verbo',
        cefr: 'B2',
        ipa: '/pɾo.mo.ˈβeɾ/',
        definition: 'Impulsar una iniciativa o política procurando su logro y difusión social.',
        collocation: '"El programa busca promover la integración cultural a través del deporte comunitario."',
        customStems: ['promuevo', 'promueves', 'promueve', 'promovemos', 'promueven', 'promovió', 'promueva']
    },
    {
        headword: 'incrementar',
        pos: 'verbo',
        cefr: 'B2',
        ipa: '/iŋ.kɾe.men.ˈtaɾ/',
        definition: 'Aumentar de manera mensurable la magnitud, el volumen o el rendimiento de algo.',
        collocation: '"La automatización ha permitido incrementar la productividad industrial en toda la región."',
        customStems: ['incremento', 'incrementa', 'incrementamos', 'incrementan', 'incrementó', 'incremente']
    },
    {
        headword: 'conciliar',
        pos: 'verbo',
        cefr: 'B2',
        ipa: '/kon.si.ˈljaɾ/',
        definition: 'Hacer compatibles dos exigencias o posturas que parecen opuestas, como trabajo y familia.',
        collocation: '"Las jornadas híbridas ayudan a conciliar las obligaciones profesionales con la crianza."',
        customStems: ['concilio', 'concilia', 'conciliamos', 'concilian', 'concilió', 'concilie']
    },
    {
        headword: 'predominar',
        pos: 'verbo',
        cefr: 'B2',
        ipa: '/pɾe.ðo.mi.ˈnaɾ/',
        definition: 'Prevalecer o tener mayor peso, presencia o influencia que otras tendencias.',
        collocation: '"En el debate actual predomina la preocupación por la privacidad de los datos personales."',
        customStems: ['predomina', 'predominan', 'predominó', 'predomine']
    },
    {
        headword: 'consolidar',
        pos: 'verbo',
        cefr: 'B2',
        ipa: '/kon.so.li.ˈðaɾ/',
        definition: 'Dar firmeza, solidez y estabilidad duradera a un logro, institución o aprendizaje.',
        collocation: '"Este acuerdo comercial permitirá consolidar la cooperación entre ambos países."',
        customStems: ['consolido', 'consolida', 'consolidamos', 'consolidan', 'consolidó', 'consolide']
    },

    // B2 Sustantivos (9)
    {
        headword: 'perspectiva',
        pos: 'sustantivo',
        cefr: 'B2',
        ipa: '/peɾs.pek.ˈti.βa/',
        definition: 'Punto de vista desde el cual se analiza un asunto o expectativa de evolución futura.',
        collocation: '"Analizar el problema desde una perspectiva histórica ayuda a evitar errores pasados."',
        customStems: ['perspectivas']
    },
    {
        headword: 'bienestar',
        pos: 'sustantivo',
        cefr: 'B2',
        ipa: '/bje.nes.ˈtaɾ/',
        definition: 'Estado integral de satisfacción física, psicológica y social de los individuos.',
        collocation: '"El crecimiento económico carece de sentido si no se traduce en bienestar social."',
        customStems: ['bienestar']
    },
    {
        headword: 'impacto',
        pos: 'sustantivo',
        cefr: 'B2',
        ipa: '/im.ˈpak.to/',
        definition: 'Huella o conjunto de consecuencias profundas que deja una medida o acontecimiento.',
        collocation: '"Es imprescindible evaluar el impacto ambiental antes de autorizar nuevas obras."',
        customStems: ['impactos']
    },
    {
        headword: 'tendencia',
        pos: 'sustantivo',
        cefr: 'B2',
        ipa: '/ten.ˈden.sja/',
        definition: 'Corriente o inclinación colectiva que se orienta en una determinada dirección.',
        collocation: '"Se observa una clara tendencia hacia el consumo responsable de alimentos orgánicos."',
        customStems: ['tendencias']
    },
    {
        headword: 'ámbito',
        pos: 'sustantivo',
        cefr: 'B2',
        ipa: '/ˈam.bi.to/',
        definition: 'Espacio ideal, campo profesional o esfera de actividad en que se desarrolla algo.',
        collocation: '"La transformación digital ha generado profundos cambios en el ámbito académico."',
        customStems: ['ambito', 'ámbitos', 'ambitos']
    },
    {
        headword: 'compromiso',
        pos: 'sustantivo',
        cefr: 'B2',
        ipa: '/kom.pɾo.ˈmi.so/',
        definition: 'Obligación contraída voluntariamente o implicación ética con una causa colectiva.',
        collocation: '"La lucha contra la contaminación exige un firme compromiso por parte de todos."',
        customStems: ['compromisos']
    },
    {
        headword: 'fenómeno',
        pos: 'sustantivo',
        cefr: 'B2',
        ipa: '/fe.ˈno.me.no/',
        definition: 'Manifestación social, natural o económica perceptible y digna de estudio.',
        collocation: '"El envejecimiento demográfico es un fenómeno complejo que requiere políticas previsoras."',
        customStems: ['fenomeno', 'fenómenos', 'fenomenos']
    },
    {
        headword: 'criterio',
        pos: 'sustantivo',
        cefr: 'B2',
        ipa: '/kɾi.ˈte.ɾjo/',
        definition: 'Norma, principio o discernimiento racional para juzgar o tomar una decisión fundada.',
        collocation: '"Los estudiantes deben formar un criterio propio frente a la sobreinformación digital."',
        customStems: ['criterios']
    },
    {
        headword: 'vínculo',
        pos: 'sustantivo',
        cefr: 'B2',
        ipa: '/ˈbiŋ.ku.lo/',
        definition: 'Lazo o unión afectiva, cultural o institucional que relaciona estrechamente a personas o pueblos.',
        collocation: '"El idioma compartido estrecha los vínculos culturales entre España e Hispanoamérica."',
        customStems: ['vinculo', 'vínculos', 'vinculos']
    },

    // B2 Adjetivos (6)
    {
        headword: 'imprescindible',
        pos: 'adjetivo',
        cefr: 'B2',
        ipa: '/im.pɾes.sin.ˈdi.βle/',
        definition: 'De tal grado de necesidad que no se puede prescindir de ello ni dejarlo de lado.',
        collocation: '"El dominio de herramientas digitales resulta hoy imprescindible en el mercado laboral."',
        customStems: ['imprescindibles']
    },
    {
        headword: 'significativo',
        pos: 'adjetivo',
        cefr: 'B2',
        ipa: '/siɣ.ni.fi.ka.ˈti.βo/',
        definition: 'Que tiene gran relevancia, valor demostrativo o importancia estadística.',
        collocation: '"El nuevo plan de reciclaje logró una reducción significativa de los residuos urbanos."',
        customStems: ['significativa', 'significativos', 'significativas']
    },
    {
        headword: 'complejo',
        pos: 'adjetivo',
        cefr: 'B2',
        ipa: '/kom.ˈple.xo/',
        definition: 'Compuesto de múltiples factores interrelacionados que impiden soluciones simplistas.',
        collocation: '"La migración internacional es un proceso complejo que obedece a causas diversas."',
        customStems: ['compleja', 'complejos', 'complejas']
    },
    {
        headword: 'viable',
        pos: 'adjetivo',
        cefr: 'B2',
        ipa: '/ˈbja.βle/',
        definition: 'Que, por sus circunstancias técnicas y económicas, tiene probabilidades reales de llevarse a cabo.',
        collocation: '"Es necesario diseñar alternativas energéticas que sean económicamente viables."',
        customStems: ['viables', 'viabilidad']
    },
    {
        headword: 'prioritario',
        pos: 'adjetivo',
        cefr: 'B2',
        ipa: '/pɾjo.ɾi.ˈta.ɾjo/',
        definition: 'Que tiene preferencia o precedencia temporal y estratégica sobre otras cuestiones.',
        collocation: '"La atención primaria de la salud debe ser un objetivo prioritario del presupuesto."',
        customStems: ['prioritaria', 'prioritarios', 'prioritarias']
    },
    {
        headword: 'controvertido',
        pos: 'adjetivo',
        cefr: 'B2',
        ipa: '/kon.tɾo.βeɾ.ˈti.ðo/',
        definition: 'Que suscita opiniones contrapuestas y debates intensos en la opinión pública.',
        collocation: '"La regulación de los algoritmos es un tema controvertido entre juristas y tecnólogos."',
        customStems: ['controvertida', 'controvertidos', 'controvertidas']
    },

    // B2 Adverbios (6)
    {
        headword: 'indudablemente',
        pos: 'adverbio',
        cefr: 'B2',
        ipa: '/in.du.ða.βle.ˈmen.te/',
        definition: 'De modo evidente, sin que quepa albergar duda razonable.',
        collocation: '"La medicina preventiva ha mejorado indudablemente la esperanza de vida."',
        customStems: ['indudablemente']
    },
    {
        headword: 'asimismo',
        pos: 'adverbio',
        cefr: 'B2',
        ipa: '/a.si.ˈmis.mo/',
        definition: 'Conector aditivo formal equivalente a "también" o "de igual manera".',
        collocation: '"El informe destaca el ahorro energético; asimismo, subraya la creación de empleo verde."',
        customStems: ['asimismo']
    },
    {
        headword: 'notablemente',
        pos: 'adverbio',
        cefr: 'B2',
        ipa: '/no.ta.βle.ˈmen.te/',
        definition: 'En grado digno de nota, de manera muy perceptible y destacada.',
        collocation: '"La calidad del aire mejoró notablemente tras la peatonalización del casco histórico."',
        customStems: ['notablemente']
    },
    {
        headword: 'simultáneamente',
        pos: 'adverbio',
        cefr: 'B2',
        ipa: '/si.mul.ˈta.ne.a.men.te/',
        definition: 'Que ocurre o se desarrolla al mismo tiempo que otro proceso.',
        collocation: '"Muchos universitarios trabajan y cursan sus estudios simultáneamente."',
        customStems: ['simultaneamente']
    },
    {
        headword: 'progresivamente',
        pos: 'adverbio',
        cefr: 'B2',
        ipa: '/pɾo.ɣɾe.si.βa.ˈmen.te/',
        definition: 'Con avance continuo y escalonado a lo largo del tiempo.',
        collocation: '"Las bibliotecas tradicionales se han transformado progresivamente en centros multimedia."',
        customStems: ['progresivamente']
    },
    {
        headword: 'sustancialmente',
        pos: 'adverbio',
        cefr: 'B2',
        ipa: '/sus.tan.sjal.ˈmen.te/',
        definition: 'En lo esencial o en una proporción muy considerable y profunda.',
        collocation: '"El comercio electrónico ha modificado sustancialmente los hábitos de consumo urbanos."',
        customStems: ['sustancialmente']
    },

    // =========================================================================
    // NIVEL C1 — DOMINIO OPERATIVO EFICAZ (Superior)
    // =========================================================================
    // C1 Verbos (9)
    {
        headword: 'propiciar',
        pos: 'verbo',
        cefr: 'C1',
        ipa: '/pɾo.pi.ˈsjaɾ/',
        definition: 'Favorecer o crear las condiciones idóneas para que algo positivo suceda o se desarrolle.',
        collocation: '"El diálogo intercultural propicia un clima de entendimiento y cohesión institucional."',
        customStems: ['propicio', 'propicia', 'propiciamos', 'propician', 'propició', 'propicie']
    },
    {
        headword: 'menoscabar',
        pos: 'verbo',
        cefr: 'C1',
        ipa: '/me.nos.ka.ˈβaɾ/',
        definition: 'Disminuir, deteriorar o restar prestigio, vigor o alcance a un derecho o principio.',
        collocation: '"La búsqueda de rentabilidad inmediata no debe menoscabar los derechos laborales."',
        customStems: ['menoscabo', 'menoscaba', 'menoscaban', 'menoscabó', 'menoscabe']
    },
    {
        headword: 'suscitar',
        pos: 'verbo',
        cefr: 'C1',
        ipa: '/sus.si.ˈtaɾ/',
        definition: 'Despertar o promover en el debate público una reacción intelectual, polémica o interés.',
        collocation: '"La reforma educativa ha suscitado un intenso debate entre los claustros académicos."',
        customStems: ['suscito', 'suscita', 'suscitan', 'suscitó', 'suscite']
    },
    {
        headword: 'paliar',
        pos: 'verbo',
        cefr: 'C1',
        ipa: '/pa.ˈljaɾ/',
        definition: 'Mitigar, suavizar o atenuar los efectos adversos de una crisis o problema estructural.',
        collocation: '"Se aprobaron subsidios temporales para paliar el impacto de la sequía en el agro."',
        customStems: ['palio', 'palío', 'palia', 'palía', 'paliaron', 'palió', 'palie', 'palíe']
    },
    {
        headword: 'entrañar',
        pos: 'verbo',
        cefr: 'C1',
        ipa: '/en.tɾa.ˈɲaɾ/',
        definition: 'Llevar implícito o contener en su propia naturaleza un riesgo, consecuencia o significado profundo.',
        collocation: '"La dependencia tecnológica extrema entraña serios riesgos para la autonomía cognitiva."',
        customStems: ['entraña', 'entranan', 'entrañan', 'entrañó', 'entrañe']
    },
    {
        headword: 'articular',
        pos: 'verbo',
        cefr: 'C1',
        ipa: '/aɾ.ti.ku.ˈlaɾ/',
        definition: 'Estructurar y coordinar coherentemente distintos elementos para formar un sistema eficaz.',
        collocation: '"Urge articular políticas públicas que integren la transición ecológica y el empleo."',
        customStems: ['articulo', 'articula', 'articulamos', 'articulan', 'articuló', 'articule']
    },
    {
        headword: 'prescindir',
        pos: 'verbo',
        cefr: 'C1',
        ipa: '/pɾes.sin.ˈdiɾ/',
        definition: 'Abstenerse de algo, dejarlo al margen o pasar sin ello deliberadamente.',
        collocation: '"Ninguna democracia moderna puede prescindir de una prensa libre y rigurosa."',
        customStems: ['prescindo', 'prescinde', 'prescindimos', 'prescinden', 'prescindió', 'prescinda']
    },
    {
        headword: 'ostentar',
        pos: 'verbo',
        cefr: 'C1',
        ipa: '/os.ten.ˈtaɾ/',
        definition: 'Poseer y ejercer un cargo, liderazgo o primacía, o mostrar algo de forma patente.',
        collocation: '"Aquellas metrópolis que ostentan altos índices de innovación invierten en educación pública."',
        customStems: ['ostento', 'ostenta', 'ostentan', 'ostentó', 'ostente']
    },
    {
        headword: 'erradicar',
        pos: 'verbo',
        cefr: 'C1',
        ipa: '/e.ra.ði.ˈkaɾ/',
        definition: 'Arrancar de raíz o suprimir por completo un mal social, práctica nociva o enfermedad.',
        collocation: '"Erradicar el analfabetismo digital exige programas continuos de capacitación ciudadana."',
        customStems: ['erradico', 'erradica', 'erradican', 'erradicó', 'erradique']
    },

    // C1 Sustantivos (9)
    {
        headword: 'paradigma',
        pos: 'sustantivo',
        cefr: 'C1',
        ipa: '/pa.ɾa.ˈðiɣ.ma/',
        definition: 'Modelo teórico o marco de referencia que rige el pensamiento de una época o disciplina.',
        collocation: '"La inteligencia artificial generativa supone un cambio de paradigma en la gestión del conocimiento."',
        customStems: ['paradigmas', 'paradigmático']
    },
    {
        headword: 'cohesión',
        pos: 'sustantivo',
        cefr: 'C1',
        ipa: '/ko.e.ˈsjon/',
        definition: 'Grado de integración, solidaridad y articulación armónica entre los miembros de una comunidad.',
        collocation: '"El deterioro de los servicios públicos debilita gravemente la cohesión social."',
        customStems: ['cohesion', 'cohesiones']
    },
    {
        headword: 'envergadura',
        pos: 'sustantivo',
        cefr: 'C1',
        ipa: '/em.beɾ.ɣa.ˈðu.ɾa/',
        definition: 'Importancia, amplitud, alcance o trascendencia extraordinaria de un proyecto o problema.',
        collocation: '"Una reforma estructural de tal envergadura requiere un amplio consenso parlamentario."',
        customStems: ['envergaduras']
    },
    {
        headword: 'incertidumbre',
        pos: 'sustantivo',
        cefr: 'C1',
        ipa: '/in.seɾ.ti.ˈðum.bɾe/',
        definition: 'Falta de certezas predecibles que genera inquietud respecto del porvenir económico o social.',
        collocation: '"Los mercados financieros reaccionan con cautela ante el actual clima de incertidumbre."',
        customStems: ['incertidumbres']
    },
    {
        headword: 'coyuntura',
        pos: 'sustantivo',
        cefr: 'C1',
        ipa: '/ko.ʝun.ˈtu.ɾa/',
        definition: 'Combinación de factores y circunstancias que caracterizan un momento histórico determinado.',
        collocation: '"En la actual coyuntura geopolítica, la cooperación regional resulta más valiosa que nunca."',
        customStems: ['coyunturas', 'coyuntural']
    },
    {
        headword: 'auge',
        pos: 'sustantivo',
        cefr: 'C1',
        ipa: '/ˈaw.xe/',
        definition: 'Período de máximo esplendor, expansión o dinamismo de una actividad o tendencia.',
        collocation: '"El auge de las plataformas de aprendizaje autónomo ha democratizado la formación continua."',
        customStems: ['auges']
    },
    {
        headword: 'brecha',
        pos: 'sustantivo',
        cefr: 'C1',
        ipa: '/ˈbɾe.tʃa/',
        definition: 'Distancia o desigualdad profunda que separa a dos sectores sociales o generacionales.',
        collocation: '"Reducir la brecha salarial y tecnológica es una condición indispensable para el progreso."',
        customStems: ['brechas']
    },
    {
        headword: 'prerrogativa',
        pos: 'sustantivo',
        cefr: 'C1',
        ipa: '/pɾe.ro.ɣa.ˈti.βa/',
        definition: 'Facultad, atribución o derecho exclusivo inherente a una dignidad, función o colectivo.',
        collocation: '"El acceso a la cultura no debe ser la prerrogativa de una minoría privilegiada."',
        customStems: ['prerrogativas']
    },
    {
        headword: 'detrimento',
        pos: 'sustantivo',
        cefr: 'C1',
        ipa: '/de.tɾi.ˈmen.to/',
        definition: 'Quebranto, perjuicio o daño moral o material que sufre un ámbito a costa de otro.',
        collocation: '"No cabe priorizar la inmediatez informativa en detrimento de la veracidad periodística."',
        customStems: ['detrimentos']
    },

    // C1 Adjetivos (6)
    {
        headword: 'inherente',
        pos: 'adjetivo',
        cefr: 'C1',
        ipa: '/i.ne.ˈɾen.te/',
        definition: 'Que por su propia naturaleza está inseparablemente unido a un ser, derecho o fenómeno.',
        collocation: '"La dignidad humana es un valor inherente a toda persona, sin distinción alguna."',
        customStems: ['inherentes']
    },
    {
        headword: 'fehaciente',
        pos: 'adjetivo',
        cefr: 'C1',
        ipa: '/fe.a.ˈsjen.te/',
        definition: 'Que da testimonio irrefutable o demuestra con rigor la certeza de un hecho.',
        collocation: '"Las políticas sanitarias deben sustentarse en pruebas científicas fehacientes."',
        customStems: ['fehacientes']
    },
    {
        headword: 'acuciante',
        pos: 'adjetivo',
        cefr: 'C1',
        ipa: '/a.ku.ˈsjan.te/',
        definition: 'Sumamente urgente, apremiante o que exige atención impostergable.',
        collocation: '"La escasez hídrica se ha convertido en el problema más acuciante de las zonas áridas."',
        customStems: ['acuciantes']
    },
    {
        headword: 'factible',
        pos: 'adjetivo',
        cefr: 'C1',
        ipa: '/fak.ˈti.βle/',
        definition: 'Posible de ser ejecutado o materializado con los medios disponibles.',
        collocation: '"Descarbonizar el transporte urbano es plenamente factible mediante incentivos adecuados."',
        customStems: ['factibles']
    },
    {
        headword: 'plausible',
        pos: 'adjetivo',
        cefr: 'C1',
        ipa: '/plaw.ˈsi.βle/',
        definition: 'Atendible, admisible, razonable o digno de reconocimiento intelectual.',
        collocation: '"Los investigadores formularon una hipótesis plausible para explicar aquel fenómeno social."',
        customStems: ['plausibles']
    },
    {
        headword: 'contundente',
        pos: 'adjetivo',
        cefr: 'C1',
        ipa: '/kon.tun.ˈden.te/',
        definition: 'De tal fuerza argumentativa o probatoria que no deja lugar a discusión.',
        collocation: '"Los datos estadísticos ofrecen una respuesta contundente frente al escepticismo inicial."',
        customStems: ['contundentes']
    },

    // C1 Adverbios (6)
    {
        headword: 'paulatinamente',
        pos: 'adverbio',
        cefr: 'C1',
        ipa: '/paw.la.ti.na.ˈmen.te/',
        definition: 'De manera lenta, gradual, mesurada y sostenida a lo largo del tiempo.',
        collocation: '"Las energías renovables han ido desplazando paulatinamente a los combustibles fósiles."',
        customStems: ['paulatinamente']
    },
    {
        headword: 'inexorablemente',
        pos: 'adverbio',
        cefr: 'C1',
        ipa: '/i.nek.so.ɾa.βle.ˈmen.te/',
        definition: 'De modo inevitable, sin que pueda detenerse ni eludirse el curso de los hechos.',
        collocation: '"El avance demográfico conduce inexorablemente a repensar el diseño de las metrópolis."',
        customStems: ['inexorablemente']
    },
    {
        headword: 'deliberadamente',
        pos: 'adverbio',
        cefr: 'C1',
        ipa: '/de.li.βe.ɾa.ða.ˈmen.te/',
        definition: 'Con plena intención, premeditación y propósito consciente.',
        collocation: '"Ciertos discursos polarizantes omiten deliberadamente los matices del problema."',
        customStems: ['deliberadamente']
    },
    {
        headword: 'paradójicamente',
        pos: 'adverbio',
        cefr: 'C1',
        ipa: '/pa.ɾa.ˈðo.xi.ka.men.te/',
        definition: 'De forma contradictoria en apariencia, aunque verdadera en el fondo.',
        collocation: '"Paradójicamente, en la era de la hiperconectividad digital ha crecido la soledad urbana."',
        customStems: ['paradojicamente']
    },
    {
        headword: 'sistemáticamente',
        pos: 'adverbio',
        cefr: 'C1',
        ipa: '/sis.te.ˈma.ti.ka.men.te/',
        definition: 'Con arreglo a un sistema metódico o de manera reiterada y constante.',
        collocation: '"Las auditorías evalúan sistemáticamente la transparencia de los fondos públicos."',
        customStems: ['sistematicamente']
    },
    {
        headword: 'inequívocamente',
        pos: 'adverbio',
        cefr: 'C1',
        ipa: '/i.ne.ˈki.βo.ka.men.te/',
        definition: 'Sin ambigüedad alguna, de modo claro y exento de equívocos.',
        collocation: '"La evidencia empírica apunta inequívocamente hacia la eficacia de la prevención temprana."',
        customStems: ['inequivocamente']
    },

    // =========================================================================
    // NIVEL C2 — MAESTRÍA (Perfección)
    // =========================================================================
    // C2 Verbos (9)
    {
        headword: 'esclarecer',
        pos: 'verbo',
        cefr: 'C2',
        ipa: '/es.kla.ɾe.ˈseɾ/',
        definition: 'Dilucidar, iluminar intelectualmente o poner en claro la verdad de un asunto intrincado.',
        collocation: '"El propósito primordial de este ensayo consiste en esclarecer las raíces éticas del dilema."',
        customStems: ['esclarezco', 'esclarece', 'esclarecemos', 'esclarecen', 'esclareció', 'esclarezca']
    },
    {
        headword: 'socavar',
        pos: 'verbo',
        cefr: 'C2',
        ipa: '/so.ka.ˈβaɾ/',
        definition: 'Debilitar o minar por sus cimientos la estabilidad moral, política o institucional de algo.',
        collocation: '"La desinformación deliberada amenaza con socavar la confianza en las instituciones democráticas."',
        customStems: ['socavo', 'socava', 'socavamos', 'socavan', 'socavó', 'socave']
    },
    {
        headword: 'discernir',
        pos: 'verbo',
        cefr: 'C2',
        ipa: '/dis.seɾ.ˈniɾ/',
        definition: 'Distinguir con agudeza intelectual una cosa de otra, señalando sus diferencias sutiles.',
        collocation: '"La alfabetización mediática permite discernir entre el rigor analítico y la mera propaganda."',
        customStems: ['discierno', 'disciernes', 'discierne', 'discernimos', 'disciernen', 'discernió', 'discierna']
    },
    {
        headword: 'subyacer',
        pos: 'verbo',
        cefr: 'C2',
        ipa: '/suβ.ʝa.ˈseɾ/',
        definition: 'Estar oculto o latente en el fondo de un fenómeno social, discurso o conflicto.',
        collocation: '"Detrás de aquella controversia técnica subyacen profundas discrepancias filosóficas."',
        customStems: ['subyace', 'subyacen', 'subyació', 'subyazca', 'subyaciendo', 'subyacente']
    },
    {
        headword: 'converger',
        pos: 'verbo',
        cefr: 'C2',
        ipa: '/kom.beɾ.ˈxeɾ/',
        definition: 'Confluir diversas disciplinas, posturas o procesos históricos hacia un mismo fin o conclusión.',
        collocation: '"Tanto la economía como la ecología convergen hoy en la urgencia de preservar la biodiversidad."',
        customStems: ['converjo', 'converge', 'convergemos', 'convergen', 'convergió', 'converja']
    },
    {
        headword: 'aquilatar',
        pos: 'verbo',
        cefr: 'C2',
        ipa: '/a.ki.la.ˈtaɾ/',
        definition: 'Examinar y apreciar con suma precisión el mérito, la verdad o el valor intrínseco de algo.',
        collocation: '"Solo la perspectiva histórica permitirá aquilatar la trascendencia de esta revolución científica."',
        customStems: ['aquilato', 'aquilata', 'aquilatamos', 'aquilatan', 'aquilató', 'aquilate']
    },
    {
        headword: 'soslayar',
        pos: 'verbo',
        cefr: 'C2',
        ipa: '/sos.la.ˈʝaɾ/',
        definition: 'Pasar por alto o eludir artificiosamente una dificultad o cuestión ética fundamental.',
        collocation: '"Resultaría intelectualmente deshonesto soslayar las asimetrías que genera dicho modelo."',
        customStems: ['soslayo', 'soslaya', 'soslayamos', 'soslayan', 'soslayó', 'soslaye']
    },
    {
        headword: 'coadyuvar',
        pos: 'verbo',
        cefr: 'C2',
        ipa: '/ko.að.ʝu.ˈβaɾ/',
        definition: 'Contribuir o asistir de manera sinérgica y decisiva a la consecución de un propósito.',
        collocation: '"La inversión en infraestructura cultural coadyuva al fortalecimiento del tejido cívico."',
        customStems: ['coadyuvo', 'coadyuva', 'coadyuvamos', 'coadyuvan', 'coadyuvó', 'coadyuve']
    },
    {
        headword: 'vislumbrar',
        pos: 'verbo',
        cefr: 'C2',
        ipa: '/bis.lum.ˈbɾaɾ/',
        definition: 'Entrever o conjeturar por indicios sutiles la evolución futura de un proceso complejo.',
        collocation: '"Los avances en biotecnología permiten vislumbrar terapias personalizadas sin precedentes."',
        customStems: ['vislumbro', 'vislumbra', 'vislumbramos', 'vislumbran', 'vislumbró', 'vislumbre']
    },

    // C2 Sustantivos (9)
    {
        headword: 'dicotomía',
        pos: 'sustantivo',
        cefr: 'C2',
        ipa: '/di.ko.to.ˈmi.a/',
        definition: 'División conceptual en dos extremos opuestos que a menudo simplifica una realidad matizada.',
        collocation: '"Conviene superar la falsa dicotomía entre preservación ecológica y dinamismo industrial."',
        customStems: ['dicotomia', 'dicotomías', 'dicotomias']
    },
    {
        headword: 'hegemonía',
        pos: 'sustantivo',
        cefr: 'C2',
        ipa: '/e.xe.mo.ˈni.a/',
        definition: 'Supremacía o preeminencia cultural, económica o tecnológica que ejerce una entidad sobre otras.',
        collocation: '"La hegemonía de unos pocos conglomerados digitales plantea desafíos inéditos a la soberanía."',
        customStems: ['hegemonia', 'hegemonías', 'hegemónico']
    },
    {
        headword: 'idiosincrasia',
        pos: 'sustantivo',
        cefr: 'C2',
        ipa: '/i.ðjo.siŋ.ˈkɾa.sja/',
        definition: 'Rasgos, temperamento y carácter distintivos propios de una colectividad o cultura.',
        collocation: '"Cualquier reforma urbana exitosa debe respetar la idiosincrasia histórica de cada comunidad."',
        customStems: ['idiosincrasias']
    },
    {
        headword: 'vicisitud',
        pos: 'sustantivo',
        cefr: 'C2',
        ipa: '/bi.si.si.ˈtuð/',
        definition: 'Inconstancia o alternativa de sucesos prósperos y adversos en el devenir histórico.',
        collocation: '"Pese a las vicisitudes económicas del siglo pasado, el acervo cultural mantuvo su vitalidad."',
        customStems: ['vicisitudes']
    },
    {
        headword: 'acervo',
        pos: 'sustantivo',
        cefr: 'C2',
        ipa: '/a.ˈseɾ.βo/',
        definition: 'Patrimonio moral, intelectual, artístico o lingüístico acumulado por una comunidad.',
        collocation: '"La literatura rioplatense e ibérica constituye un pilar invaluable de nuestro acervo común."',
        customStems: ['acervos']
    },
    {
        headword: 'asimetría',
        pos: 'sustantivo',
        cefr: 'C2',
        ipa: '/a.si.me.ˈtɾi.a/',
        definition: 'Desproporción o falta de correspondencia equitativa en las relaciones de poder o recursos.',
        collocation: '"El tratado procura corregir las profundas asimetrías estructurales entre ambas regiones."',
        customStems: ['asimetria', 'asimetrías', 'asimetrias', 'asimétrico']
    },
    {
        headword: 'quimeras',
        pos: 'sustantivo',
        cefr: 'C2',
        ipa: '/ki.ˈme.ɾas/',
        definition: 'Ilusiones o proyectos seductores que se proponen a la imaginación como posibles sin serlo.',
        collocation: '"Lejos de perseguir quimeras tecnocráticas, la política educativa requiere rigor pedagógico."',
        customStems: ['quimera', 'quimeras', 'quimérico']
    },
    {
        headword: 'Catalizador',
        pos: 'sustantivo',
        cefr: 'C2',
        ipa: '/ka.ta.li.sa.ˈðoɾ/',
        definition: 'Factor o estímulo decisivo que acelera y desencadena una transformación profunda.',
        collocation: '"La digitalización actuó como un potente catalizador en la modernización administrativa."',
        customStems: ['catalizador', 'catalizadores', 'catalizadora']
    },
    {
        headword: 'entramado',
        pos: 'sustantivo',
        cefr: 'C2',
        ipa: '/en.tɾa.ˈma.ðo/',
        definition: 'Conjunto complejo e interdependiente de relaciones sociales, jurídicas o económicas.',
        collocation: '"Fortalecer el entramado productivo local exige articular la universidad con la industria."',
        customStems: ['entramados']
    },

    // C2 Adjetivos (6)
    {
        headword: 'insoslayable',
        pos: 'adjetivo',
        cefr: 'C2',
        ipa: '/in.sos.la.ˈʝa.βle/',
        definition: 'Que no puede ser esquivado ni pasado por alto bajo ningún pretexto ético o racional.',
        collocation: '"La transición hacia matrices energéticas limpias constituye un imperativo insoslayable."',
        customStems: ['insoslayables']
    },
    {
        headword: 'perentorio',
        pos: 'adjetivo',
        cefr: 'C2',
        ipa: '/pe.ɾen.ˈto.ɾjo/',
        definition: 'Concluyente, apremiante, que no admite dilación ni aplazamiento alguno.',
        collocation: '"Atender la salud mental de los adolescentes es una necesidad perentoria de nuestro tiempo."',
        customStems: ['perentoria', 'perentorios', 'perentorias']
    },
    {
        headword: 'subyacente',
        pos: 'adjetivo',
        cefr: 'C2',
        ipa: '/suβ.ʝa.ˈsen.te/',
        definition: 'Que permanece implícito o por debajo de las manifestaciones superficiales de un problema.',
        collocation: '"Para resolver el conflicto es preciso examinar las causas estructurales subyacentes."',
        customStems: ['subyacentes']
    },
    {
        headword: 'omnipresente',
        pos: 'adjetivo',
        cefr: 'C2',
        ipa: '/om.ni.pɾe.ˈsen.te/',
        definition: 'Que está presente en todas partes simultáneamente e impregna la totalidad del entorno.',
        collocation: '"La mediación algorítmica se ha vuelto omnipresente en el consumo cultural contemporáneo."',
        customStems: ['omnipresentes']
    },
    {
        headword: 'verosímil',
        pos: 'adjetivo',
        cefr: 'C2',
        ipa: '/be.ɾo.ˈsi.mil/',
        definition: 'Que tiene apariencia de verdadero y resulta creíble conforme a la lógica de los hechos.',
        collocation: '"Las proyecciones demográficas trazan un escenario verosímil para las próximas tres décadas."',
        customStems: ['verosimil', 'verosímiles', 'verosimiles']
    },
    {
        headword: 'diáfano',
        pos: 'adjetivo',
        cefr: 'C2',
        ipa: '/ˈdja.fa.no/',
        definition: 'Sumamente claro, nítido y transparente en su formulación intelectual o expositiva.',
        collocation: '"La legislación tributaria debería redactarse en un lenguaje diáfano para el ciudadano."',
        customStems: ['diafano', 'diáfana', 'diafana', 'diáfanos', 'diáfanas']
    },

    // C2 Adverbios (6)
    {
        headword: 'indefectiblemente',
        pos: 'adverbio',
        cefr: 'C2',
        ipa: '/in.de.fek.ti.βle.ˈmen.te/',
        definition: 'Sin que pueda faltar o dejar de ocurrir bajo ninguna circunstancia.',
        collocation: '"La precarización educativa repercute indefectiblemente en la competitividad futura del país."',
        customStems: ['indefectiblemente']
    },
    {
        headword: 'intrínsecamente',
        pos: 'adverbio',
        cefr: 'C2',
        ipa: '/in.ˈtɾin.se.ka.men.te/',
        definition: 'De manera esencial, íntima y por razón de su propia naturaleza constitutiva.',
        collocation: '"La libertad de expresión está intrínsecamente ligada a la pluralidad informativa."',
        customStems: ['intrinsecamente']
    },
    {
        headword: 'ostensiblemente',
        pos: 'adverbio',
        cefr: 'C2',
        ipa: '/os.ten.si.βle.ˈmen.te/',
        definition: 'De forma manifiesta, patente y claramente perceptible para cualquier observador.',
        collocation: '"La inversión en transporte ferroviario ha mejorado ostensiblemente la conectividad regional."',
        customStems: ['ostensiblemente']
    },
    {
        headword: 'diametralmente',
        pos: 'adverbio',
        cefr: 'C2',
        ipa: '/dja.me.tɾal.ˈmen.te/',
        definition: 'De extremo a extremo; por completo opuesto o divergente.',
        collocation: '"Ambos autores sostienen posturas diametralmente opuestas acerca de la intervención estatal."',
        customStems: ['diametralmente']
    },
    {
        headword: 'inexcusablemente',
        pos: 'adverbio',
        cefr: 'C2',
        ipa: '/i.neks.ku.sa.βle.ˈmen.te/',
        definition: 'De modo imperioso e ineludible, sin que admita excusa ni evasiva.',
        collocation: '"El progreso tecnológico debe ir inexcusablemente acompañado de una reflexión bioética."',
        customStems: ['inexcusablemente']
    },
    {
        headword: 'preponderantemente',
        pos: 'adverbio',
        cefr: 'C2',
        ipa: '/pɾe.pon.de.ɾan.te.ˈmen.te/',
        definition: 'Con predominio, peso superior o influencia mayoritaria sobre otros factores.',
        collocation: '"El crecimiento del sector servicios responde preponderantemente al dinamismo del talento joven."',
        customStems: ['preponderantemente']
    }
];
const VOCABULARY_LEXICON = RAW_LEXICON.map(item => ({
    headword: item.headword.toLowerCase(),
    displayWord: item.headword,
    pos: item.pos,
    cefr: item.cefr,
    ipa: item.ipa,
    definition: item.definition,
    collocation: item.collocation,
    stems: generateWordStems(item.headword, item.pos, item.customStems || [])
}));

function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

/**
 * Selects 10 balanced target words (3 Verbos, 3 Sustantivos, 2 Adjetivos, 2 Adverbios)
 * calibrated to the active MCER/CEFR level (A1, A2, B1, B2, C1, or C2).
 */
function getRandomVocabularySet(level = 'C1') {
    const normalizedLevel = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].includes(String(level).toUpperCase())
        ? String(level).toUpperCase()
        : 'C1';

    const levelPool = VOCABULARY_LEXICON.filter(w => w.cefr === normalizedLevel);
    const pool = levelPool.length >= 10 ? levelPool : VOCABULARY_LEXICON;

    const verbs = shuffle(pool.filter(w => w.pos === 'verbo')).slice(0, 3);
    const nouns = shuffle(pool.filter(w => w.pos === 'sustantivo')).slice(0, 3);
    const adjs = shuffle(pool.filter(w => w.pos === 'adjetivo')).slice(0, 2);
    const advs = shuffle(pool.filter(w => w.pos === 'adverbio')).slice(0, 2);

    return [...verbs, ...nouns, ...adjs, ...advs];
}

/**
 * Selects a single replacement word of the same POS and MCER level not currently in the active 10-word list.
 */
function getRandomSingleVocabularyWord(pos, currentHeadwords = [], level = 'C1') {
    const normalizedLevel = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].includes(String(level).toUpperCase())
        ? String(level).toUpperCase()
        : 'C1';

    const excludeSet = new Set(currentHeadwords.map(h => String(h).toLowerCase()));
    let candidates = VOCABULARY_LEXICON.filter(
        w => w.pos === pos && w.cefr === normalizedLevel && !excludeSet.has(w.headword.toLowerCase())
    );

    if (candidates.length === 0) {
        candidates = VOCABULARY_LEXICON.filter(
            w => w.pos === pos && !excludeSet.has(w.headword.toLowerCase())
        );
    }
    if (candidates.length === 0) {
        candidates = VOCABULARY_LEXICON.filter(w => w.pos === pos);
    }

    return shuffle(candidates)[0];
}



  // ==========================================
  // 2. TOPICS & MCER / DELE DATA
  // ==========================================
/**
 * FluentEdge Español Perfecto: Combinatorial Tree Topic Engine (A1–C2 MCER / DELE)
 * Architecture:
 * [Sujeto Principal] + [Subtema 1] + [Subtema 2] + [Tensión / Alcance / Nivel MCER]
 * Also includes Tech & Workplace Spanish Topics (Español Profesional y Tecnológico).
 */
const DIFFICULTY_PROFILES = {
    all: {
        id: 'all',
        label: 'Todos los Niveles',
        badge: 'Espectro Completo',
        description: 'Combina temas cotidianos, sociales, culturales y filosóficos de todas las dificultades.'
    },
    easy: {
        id: 'easy',
        label: 'Fácil (Cotidiano)',
        badge: 'Nivel 1 · Accesible',
        description: 'Temas cercanos a la vida diaria, costumbres, viajes, salud, familia y aprendizaje.'
    },
    medium: {
        id: 'medium',
        label: 'Medio (Social y Laboral)',
        badge: 'Nivel 2 · Analítico',
        description: 'Debates actuales sobre educación, trabajo híbrido, medio ambiente, cultura y tecnología.'
    },
    hard: {
        id: 'hard',
        label: 'Difícil (Abstracto y Crítico)',
        badge: 'Nivel 3 · Académico',
        description: 'Dilemas éticos, geopolítica, epistemología, regulación algorítmica y macroeconomía.'
    }
};
const CEFR_DESCRIPTORS = {
    A1: {
        badge: 'MCER A1 · Acceso (Principiante)',
        scaleScore: 'DELE A1 · Escala Inicial',
        targetLength: '50–80 palabras (1–2 párrafos)',
        register: 'Claro, cotidiano y descriptivo',
        focus: 'Describir hábitos diarios, gustos personales, entorno cercano y experiencias sencillas con oraciones claras.'
    },
    A2: {
        badge: 'MCER A2 · Plataforma (Elemental)',
        scaleScore: 'DELE A2 · Escala Elemental',
        targetLength: '90–130 palabras (2–3 párrafos)',
        register: 'Personal, narrativo y funcional',
        focus: 'Relatar experiencias pasadas, planes futuros, comparaciones y opiniones sencillas sobre la vida cotidiana.'
    },
    B1: {
        badge: 'MCER B1 · Umbral (Intermedio)',
        scaleScore: 'DELE B1 · Escala Intermedia',
        targetLength: '140–180 palabras (3 párrafos)',
        register: 'Estructurado, explicativo y coherente',
        focus: 'Exponer ventajas y desventajas, justificar opiniones personales y conectar ideas con fluidez.'
    },
    B2: {
        badge: 'MCER B2 · Avanzado (Intermedio Alto)',
        scaleScore: 'DELE B2 · Escala Avanzada',
        targetLength: '180–220 palabras (3–4 párrafos)',
        register: 'Argumentativo, formal y matizado',
        focus: 'Defender un punto de vista con argumentos sólidos, causas, consecuencias y contraargumentos.'
    },
    C1: {
        badge: 'MCER C1 · Dominio Operativo Eficaz',
        scaleScore: 'DELE C1 · Escala Superior',
        targetLength: '220–260 palabras (3–4 párrafos)',
        register: 'Académico, analítico y preciso',
        focus: 'Desarrollar un ensayo discursivo complejo integrando múltiples perspectivas, subjuntivo avanzado y cohesión léxica.'
    },
    C2: {
        badge: 'MCER C2 · Maestría (Perfección)',
        scaleScore: 'DELE C2 · Escala Maestría',
        targetLength: '280–320 palabras (4–5 párrafos)',
        register: 'Culto, estilísticamente elevado y dialéctico',
        focus: 'Sintetizar tensiones estructurales con precisión terminológica, subordinación compleja y rigor retórico panhispánico.'
    }
};
const MAIN_SUBJECTS = [
    // TIER 1: EASY (Cotidiano / Accesible — Ideal para A1–B1 y práctica general)
    {
        id: 'vida_cotidiana_familia',
        name: 'Vida Cotidiana, Familia y Costumbres',
        icon: '🏡',
        category: 'Sociedad y Costumbres',
        difficulty: 'easy',
        keywords: ['familia', 'casa', 'hogar', 'costumbre', 'rutina', 'barrio', 'amigos', 'vida', 'tiempo', 'compartir', 'vecinos', 'tradición', 'convivencia']
    },
    {
        id: 'gastronomia_alimentacion',
        name: 'Gastronomía, Alimentación y Salud Diaria',
        icon: '🥘',
        category: 'Salud y Estilo de Vida',
        difficulty: 'easy',
        keywords: ['comida', 'alimentación', 'salud', 'saludable', 'cocina', 'dieta', 'restaurante', 'plato', 'mercado', 'frutas', 'verduras', 'hábito', 'nutrición']
    },
    {
        id: 'viajes_turismo_cultura',
        name: 'Viajes, Turismo e Intercambio Cultural',
        icon: '✈️',
        category: 'Cultura y Movilidad',
        difficulty: 'easy',
        keywords: ['viaje', 'viajar', 'turismo', 'turista', 'ciudad', 'país', 'vacaciones', 'cultura', 'museo', 'transporte', 'hotel', 'idioma', 'descubrir']
    },
    {
        id: 'deporte_tiempo_libre',
        name: 'Deporte, Ocio y Bienestar Personal',
        icon: '⚽',
        category: 'Bienestar y Ocio',
        difficulty: 'easy',
        keywords: ['deporte', 'ejercicio', 'ocio', 'descanso', 'música', 'lectura', 'parque', 'bienestar', 'equipo', 'salud', 'actividad', 'energía']
    },

    // TIER 2: MEDIUM (Social, Educativo, Laboral y Ambiental — Ideal para B1–C1)
    {
        id: 'educacion_aprendizaje',
        name: 'Educación, Universidad y Aprendizaje Continuo',
        icon: '🎓',
        category: 'Educación y Conocimiento',
        difficulty: 'medium',
        keywords: ['educación', 'escuela', 'universidad', 'estudiante', 'profesor', 'aprendizaje', 'enseñanza', 'aula', 'formación', 'conocimiento', 'estudio', 'habilidades']
    },
    {
        id: 'trabajo_economia_digital',
        name: 'Futuro del Trabajo, Teletrabajo y Conciliación',
        icon: '💼',
        category: 'Economía y Empleo',
        difficulty: 'medium',
        keywords: ['trabajo', 'empleo', 'empresa', 'oficina', 'teletrabajo', 'horario', 'profesional', 'productividad', 'salario', 'carrera', 'conciliación', 'laboral']
    },
    {
        id: 'medio_ambiente_ciudades',
        name: 'Sostenibilidad, Ecología y Ciudades Verdes',
        icon: '🌿',
        category: 'Ecología y Urbanismo',
        difficulty: 'medium',
        keywords: ['ambiente', 'naturaleza', 'clima', 'energía', 'reciclaje', 'contaminación', 'sostenible', 'ciudad', 'agua', 'transporte', 'ecológico', 'planeta']
    },
    {
        id: 'medios_redes_comunicacion',
        name: 'Redes Sociales, Periodismo y Comunicación',
        icon: '📱',
        category: 'Comunicación y Sociedad',
        difficulty: 'medium',
        keywords: ['redes', 'internet', 'información', 'noticias', 'medios', 'digital', 'pantalla', 'comunicación', 'opinión', 'jóvenes', 'privacidad', 'prensa']
    },

    // TIER 3: HARD (Académico, Filosófico y Estructural — Ideal para C1–C2)
    {
        id: 'inteligencia_artificial_etica',
        name: 'Inteligencia Artificial, Gobernanza y Bioética',
        icon: '🤖',
        category: 'Tecnología y Ética',
        difficulty: 'hard',
        keywords: ['inteligencia', 'algoritmo', 'automatización', 'ética', 'tecnología', 'datos', 'autonomía', 'innovación', 'cognitivo', 'regulación', 'ciencia', 'humanidad']
    },
    {
        id: 'geopolitica_soberania',
        name: 'Globalización, Soberanía e Integración Regional',
        icon: '🌐',
        category: 'Geopolítica e Instituciones',
        difficulty: 'hard',
        keywords: ['estado', 'democracia', 'soberanía', 'globalización', 'instituciones', 'cooperación', 'tratado', 'derechos', 'ciudadanía', 'política', 'internacional', 'justicia']
    },
    {
        id: 'patrimonio_identidad_lengua',
        name: 'Patrimonio Cultural, Identidad Panhispánica y Arte',
        icon: '🏛️',
        category: 'Humanidades y Cultura',
        difficulty: 'hard',
        keywords: ['identidad', 'patrimonio', 'lengua', 'literatura', 'arte', 'memoria', 'historia', 'diversidad', 'cultura', 'acervo', 'tradición', 'creatividad']
    },
    {
        id: 'macroeconomia_desigualdad',
        name: 'Modelos Económicos, Cohesión Social y Demografía',
        icon: '📈',
        category: 'Economía Política',
        difficulty: 'hard',
        keywords: ['economía', 'mercado', 'desigualdad', 'riqueza', 'inversión', 'desarrollo', 'demografía', 'pensiones', 'productividad', 'bienestar', 'fiscal', 'brecha']
    }
];
const SUB_THEMES = {
    vida_cotidiana_familia: [
        { id: 'habitos_diarios', name: 'Rutinas Diarias y Organización del Tiempo', keywords: ['rutina', 'horario', 'mañana', 'tarde', 'organizar', 'tiempo'] },
        { id: 'convivencia_familiar', name: 'Convivencia Intergeneracional y Apoyo Familiar', keywords: ['familia', 'abuelos', 'padres', 'hijos', 'apoyo', 'compartir'] },
        { id: 'vida_barrio_comunidad', name: 'Vida de Barrio, Comercio Local y Vecindad', keywords: ['barrio', 'vecino', 'plaza', 'comercio', 'comunidad', 'cercano'] },
        { id: 'celebraciones_tradiciones', name: 'Fiestas Tradicionales y Encuentros Sociales', keywords: ['fiesta', 'costumbre', 'reunión', 'amigos', 'celebrar', 'tradicional'] },
        { id: 'vivienda_hogar', name: 'El Espacio Doméstico: Ciudad frente a Naturaleza', keywords: ['casa', 'apartamento', 'ciudad', 'campo', 'tranquilo', 'vivir'] }
    ],
    gastronomia_alimentacion: [
        { id: 'comida_casera_vs_rapida', name: 'Cocina Casera frente a Comida Rápida', keywords: ['cocinar', 'casero', 'rápido', 'saludable', 'tiempo', 'ingredientes'] },
        { id: 'dieta_mediterranea_atlantica', name: 'Tradición Culinaria en España y Argentina', keywords: ['plato', 'cultura', 'sabor', 'receta', 'mesa', 'compartir'] },
        { id: 'consumo_productos_locales', name: 'Mercados de Proximidad y Alimentos Frescos', keywords: ['mercado', 'fresco', 'fruta', 'verdura', 'productor', 'económico'] },
        { id: 'educacion_nutricional', name: 'Educación Nutricional desde la Infancia', keywords: ['escuela', 'niños', 'hábito', 'salud', 'aprender', 'alimentación'] },
        { id: 'gastronomia_identidad', name: 'La Gastronomía como Punto de Encuentro Social', keywords: ['reunión', 'familia', 'sobremesa', 'conversar', 'costumbre', 'hospitalidad'] }
    ],
    viajes_turismo_cultura: [
        { id: 'turismo_responsable', name: 'Turismo Cultural y Respeto al Entorno Local', keywords: ['turista', 'respeto', 'ciudad', 'museo', 'histórico', 'cuidar'] },
        { id: 'aprender_idiomas_viajando', name: 'El Aprendizaje de Idiomas a través de los Viajes', keywords: ['idioma', 'español', 'hablar', 'practicar', 'cultura', 'gente'] },
        { id: 'transporte_movilidad', name: 'Medios de Transporte: Tren, Avión y Movilidad Urbana', keywords: ['tren', 'avión', 'transporte', 'viajar', 'cómodo', 'estación'] },
        { id: 'intercambio_estudiantil', name: 'Experiencias de Estudio y Residencia en el Extranjero', keywords: ['experiencia', 'país', 'estudiante', 'adaptarse', 'amigos', 'aprender'] },
        { id: 'turismo_masivo_vivienda', name: 'Impacto del Turismo Masivo en los Barrios Históricos', keywords: ['alquiler', 'vecinos', 'precios', 'centro', 'sostenible', 'convivencia'] }
    ],
    deporte_tiempo_libre: [
        { id: 'ejercicio_salud_mental', name: 'Actividad Física y Reducción del Estrés Cotidiano', keywords: ['deporte', 'salud', 'estrés', 'caminar', 'correr', 'descansar'] },
        { id: 'deportes_equipo_valores', name: 'Deportes Colectivos, Compañerismo y Disciplina', keywords: ['equipo', 'fútbol', 'compañero', 'esfuerzo', 'respeto', 'jugar'] },
        { id: 'lectura_artes_ocio', name: 'Lectura, Cine y Teatro en el Tiempo Libre', keywords: ['libro', 'leer', 'cine', 'música', 'teatro', 'cultura'] },
        { id: 'espacios_verdes_urbanos', name: 'Parques Públicos y Espacios para el Deporte Urbano', keywords: ['parque', 'aire', 'ciudad', 'bicicleta', 'naturaleza', 'público'] },
        { id: 'desconexion_digital', name: 'El Derecho al Descanso y la Desconexión de Pantallas', keywords: ['descanso', 'teléfono', 'pantalla', 'tranquilo', 'tiempo', 'sueño'] }
    ],
    educacion_aprendizaje: [
        { id: 'pensamiento_critico', name: 'Fomento del Pensamiento Crítico frente a la Memorización', keywords: ['crítico', 'pensar', 'comprender', 'debate', 'criterio', 'aula'] },
        { id: 'herramientas_digitales_aula', name: 'Integración de Tecnología e IA en la Enseñanza', keywords: ['digital', 'tecnología', 'plataforma', 'docente', 'alumno', 'aprendizaje'] },
        { id: 'igualdad_oportunidades', name: 'Becas, Educación Pública y Movilidad Social', keywords: ['público', 'igualdad', 'oportunidad', 'acceso', 'universidad', 'futuro'] },
        { id: 'humanidades_vs_ciencias', name: 'Equilibrio entre Humanidades, Arte y Formación Científica', keywords: ['ciencia', 'humanidades', 'filosofía', 'técnica', 'integral', 'cultura'] },
        { id: 'formacion_continua', name: 'Recapacitación Profesional a lo Largo de Toda la Vida', keywords: ['adultos', 'profesional', 'actualizar', 'habilidades', 'curso', 'empleo'] }
    ],
    trabajo_economia_digital: [
        { id: 'teletrabajo_hibrido', name: 'Modelos Híbridos y Autonomía del Trabajador', keywords: ['remoto', 'híbrido', 'oficina', 'hogar', 'flexibilidad', 'productividad'] },
        { id: 'conciliacion_vida_personal', name: 'Conciliación Familiar y Reducción de la Jornada Laboral', keywords: ['jornada', 'descanso', 'familia', 'equilibrio', 'horario', 'bienestar'] },
        { id: 'automatizacion_empleo', name: 'Automatización y Transformación de los Perfiles Profesionales', keywords: ['máquina', 'algoritmo', 'empleo', 'adaptarse', 'talento', 'innovación'] },
        { id: 'emprendimiento_joven', name: 'Inserción Laboral Juvenil y Emprendimiento Local', keywords: ['jóvenes', 'primer', 'proyecto', 'estabilidad', 'contrato', 'oportunidad'] },
        { id: 'liderazgo_salud_laboral', name: 'Clima Organizacional y Prevención del Agotamiento', keywords: ['equipo', 'motivación', 'estrés', 'salud', 'empresa', 'liderazgo'] }
    ],
    medio_ambiente_ciudades: [
        { id: 'transicion_energetica', name: 'Energías Renovables y Descarbonización Industrial', keywords: ['solar', 'eólica', 'renovable', 'emisiones', 'transición', 'limpio'] },
        { id: 'movilidad_urbana_limpia', name: 'Peatonalización, Transporte Ferroviario y Ciclovías', keywords: ['tren', 'bicicleta', 'peatón', 'tráfico', 'emisiones', 'público'] },
        { id: 'economia_circular', name: 'Economía Circular, Reciclaje y Reducción de Residuos', keywords: ['reciclar', 'plástico', 'reutilizar', 'residuos', 'consumo', 'responsable'] },
        { id: 'recursos_hidricos', name: 'Gestión del Agua y Adaptación a las Sequías', keywords: ['agua', 'sequía', 'río', 'agricultura', 'cuidar', 'recurso'] },
        { id: 'biodiversidad_conservacion', name: 'Protección de Ecosistemas frente a la Expansión Urbana', keywords: ['bosque', 'especies', 'biodiversidad', 'proteger', 'naturaleza', 'equilibrio'] }
    ],
    medios_redes_comunicacion: [
        { id: 'desinformacion_veracidad', name: 'Verificación de Datos frente a las Noticias Falsas', keywords: ['verdad', 'fuente', 'periodismo', 'rigor', 'engaño', 'verificar'] },
        { id: 'algoritmos_polarizacion', name: 'Cámaras de Eco Algorítmicas y Polarización Social', keywords: ['algoritmo', 'debate', 'extremos', 'diálogo', 'atención', 'redes'] },
        { id: 'privacidad_datos', name: 'Protección de Datos Personales y Vigilancia Comercial', keywords: ['privacidad', 'datos', 'consentimiento', 'seguridad', 'derecho', 'usuario'] },
        { id: 'impacto_atencion_jovenes', name: 'Salud Mental Adolescente e Hiperconectividad', keywords: ['adolescentes', 'ansiedad', 'imagen', 'tiempo', 'concentración', 'autoestima'] },
        { id: 'periodismo_independiente', name: 'Sostenibilidad del Periodismo de Investigación', keywords: ['prensa', 'democracia', 'investigación', 'lectores', 'calidad', 'independencia'] }
    ],
    inteligencia_artificial_etica: [
        { id: 'soberania_cognitiva', name: 'Autonomía Intelectual frente a la Delegación Algorítmica', keywords: ['juicio', 'cognitivo', 'pensamiento', 'asistente', 'dependencia', 'criterio'] },
        { id: 'sesgos_algoritmicos', name: 'Transparencia, Auditoría y Sesgos en Decisiones Automatizadas', keywords: ['sesgo', 'justicia', 'transparencia', 'auditoría', 'responsabilidad', 'ética'] },
        { id: 'propiedad_intelectual_ia', name: 'Autoría Artística y Derechos de Propiedad Intelectual', keywords: ['autor', 'creación', 'arte', 'originalidad', 'derechos', 'cultura'] },
        { id: 'biotecnologia_longevidad', name: 'Edición Genética, Medicina Predictiva y Límites Bioéticos', keywords: ['medicina', 'genética', 'bioética', 'salud', 'dignidad', 'equidad'] },
        { id: 'regulacion_internacional_ia', name: 'Marcos Regulatorios Globales frente a la Innovación Abierta', keywords: ['normativa', 'ley', 'innovación', 'seguridad', 'riesgo', 'gobernanza'] }
    ],
    geopolitica_soberania: [
        { id: 'multilateralismo_cooperacion', name: 'Organismos Multilaterales ante Crisis Transnacionales', keywords: ['acuerdo', 'cooperación', 'diplomacia', 'global', 'consenso', 'paz'] },
        { id: 'soberania_tecnologica', name: 'Soberanía Digital e Infraestructuras Estratégicas', keywords: ['soberanía', 'datos', 'infraestructura', 'autonomía', 'estratégico', 'estado'] },
        { id: 'migracion_derechos_humanos', name: 'Flujos Migratorios, Integración y Derechos Fundamentales', keywords: ['migración', 'integración', 'acogida', 'derechos', 'diversidad', 'demografía'] },
        { id: 'calidad_institucional', name: 'Transparencia Pública, Rendición de Cuentas y Confianza Cívica', keywords: ['instituciones', 'confianza', 'transparencia', 'democracia', 'ciudadanía', 'ley'] },
        { id: 'integracion_iberoamericana', name: 'Alianzas Culturales y Económicas entre Europa y América Latina', keywords: ['atlántico', 'cooperación', 'comercio', 'cultura', 'región', 'vínculo'] }
    ],
    patrimonio_identidad_lengua: [
        { id: 'unidad_diversidad_espanol', name: 'Unidad y Riqueza Policéntrica de la Lengua Española', keywords: ['español', 'acento', 'vocabulario', 'diversidad', 'comprensión', 'común'] },
        { id: 'preservacion_patrimonio', name: 'Conservación del Patrimonio Histórico frente a la Especulación', keywords: ['monumento', 'historia', 'arquitectura', 'memoria', 'conservar', 'identidad'] },
        { id: 'mecenazgo_cultura_publica', name: 'Financiación Pública de las Artes y Acceso Democrático', keywords: ['cultura', 'teatro', 'museo', 'presupuesto', 'acceso', 'creación'] },
        { id: 'literatura_pensamiento', name: 'LaVigencia de la Literatura en la Era de la Inmediatez', keywords: ['literatura', 'novela', 'ensayo', 'lectura', 'reflexión', 'lenguaje'] },
        { id: 'homogeneizacion_cultural', name: 'Identidades Locales frente a la Homogeneización Global', keywords: ['local', 'global', 'raíces', 'idiosincrasia', 'singularidad', 'tradición'] }
    ],
    macroeconomia_desigualdad: [
        { id: 'estado_bienestar_sostenibilidad', name: 'Sostenibilidad del Estado de Bienestar y Envejecimiento', keywords: ['pensiones', 'sanidad', 'demografía', 'solidaridad', 'presupuesto', 'futuro'] },
        { id: 'progresividad_fiscal', name: 'Política Fiscal, Redistribución y Cohesión Social', keywords: ['impuestos', 'equidad', 'redistribución', 'inversión', 'servicios', 'brecha'] },
        { id: 'acceso_vivienda', name: 'Crisis Habitacional, Coste de Vida y Emancipación Juvenil', keywords: ['vivienda', 'alquiler', 'jóvenes', 'salario', 'ciudad', 'derecho'] },
        { id: 'industrializacion_conocimiento', name: 'Economía del Conocimiento e Inversión en I+D+i', keywords: ['ciencia', 'investigación', 'valor', 'industria', 'universidad', 'desarrollo'] },
        { id: 'inflacion_poder_adquisitivo', name: 'Estabilidad Monetaria y Protección del Poder Adquisitivo', keywords: ['precios', 'inflación', 'consumo', 'ahorro', 'salarios', 'estabilidad'] }
    ]
};
const TENSIONS = [
    { id: 'libertad_vs_regulacion', name: 'la iniciativa individual frente a la regulación colectiva' },
    { id: 'tradicion_vs_modernidad', name: 'la preservación de las costumbres frente a la modernización acelerada' },
    { id: 'eficiencia_vs_bienestar', name: 'la eficiencia económica inmediata frente al bienestar humano a largo plazo' },
    { id: 'local_vs_global', name: 'las necesidades de la comunidad local frente a las exigencias globales' },
    { id: 'acceso_vs_calidad', name: 'la democratización del acceso frente al mantenimiento de la excelencia' }
];
const SCOPES = [
    { id: 'ambito_cotidiano', name: 'en la vida cotidiana de las familias y los barrios actuales' },
    { id: 'ambito_panhispanico', name: 'en el contexto social y cultural de Argentina, España e Iberoamérica' },
    { id: 'ambito_educativo_laboral', name: 'en los entornos educativos y profesionales contemporáneos' },
    { id: 'ambito_urbano', name: 'en las grandes ciudades y comunidades en transformación' }
];
const STAKEHOLDERS = [
    { id: 'ciudadanos_familias', name: 'los ciudadanos, las familias y los jóvenes estudiantes' },
    { id: 'instituciones_empresas', name: 'las instituciones públicas, las empresas y la comunidad educativa' },
    { id: 'profesionales_expertos', name: 'los trabajadores, los educadores y los especialistas del sector' }
];
const PROMPT_TYPES = [
    { id: 'descriptivo_personal', name: 'Exposición Personal y Cotidiana', levels: ['A1', 'A2'] },
    { id: 'opinion_estructurada', name: 'Artículo de Opinión y Experiencias', levels: ['B1', 'B2'] },
    { id: 'ensayo_analitico', name: 'Ensayo Discursivo y Dialéctico DELE', levels: ['C1', 'C2'] }
];

// ============================================================================
// TECH & WORKPLACE SPANISH TOPICS (Español para Ingeniería, Producto y Gestión)
// ============================================================================
const TECH_MAIN_SUBJECTS = [
    {
        id: 'arquitectura_software_ia',
        name: 'Ingeniería de Software, IA y Calidad de Código',
        icon: '💻',
        category: 'Tecnología y Producto',
        difficulty: 'medium',
        keywords: ['código', 'software', 'sistema', 'aplicación', 'equipo', 'datos', 'seguridad', 'pruebas', 'arquitectura', 'mantenimiento', 'desarrollo', 'tecnología']
    },
    {
        id: 'liderazgo_equipos_remotos',
        name: 'Gestión de Equipos Ágiles y Comunicación Asíncrona',
        icon: '🤝',
        category: 'Liderazgo y Cultura Técnica',
        difficulty: 'easy',
        keywords: ['equipo', 'reunión', 'proyecto', 'comunicación', 'remoto', 'objetivo', 'colaboración', 'tiempo', 'cliente', 'organizar', 'prioridad', 'trabajo']
    },
    {
        id: 'ciberseguridad_infraestructura',
        name: 'Ciberseguridad, Nube y Resiliencia Operativa',
        icon: '🛡️',
        category: 'Infraestructura Crítica',
        difficulty: 'hard',
        keywords: ['seguridad', 'nube', 'servidor', 'privacidad', 'incidente', 'resiliencia', 'datos', 'disponibilidad', 'riesgo', 'auditoría', 'red', 'sistema']
    }
];
const TECH_SUB_THEMES = {
    arquitectura_software_ia: [
        { id: 'velocidad_vs_deuda_tecnica', name: 'Rapidez de Entrega frente a la Deuda Técnica y Estabilidad', keywords: ['entrega', 'calidad', 'mantenimiento', 'errores', 'largo plazo'] },
        { id: 'asistentes_ia_programacion', name: 'Asistentes de Código con IA y Revisión Humana Rigurosa', keywords: ['inteligencia', 'revisión', 'aprender', 'productividad', 'criterio'] },
        { id: 'accesibilidad_experiencia_usuario', name: 'Diseño Accesible y Simplicidad para el Usuario Final', keywords: ['usuario', 'interfaz', 'accesible', 'sencillo', 'útil'] }
    ],
    liderazgo_equipos_remotos: [
        { id: 'reuniones_vs_trabajo_profundo', name: 'Exceso de Reuniones frente al Tiempo de Concentración', keywords: ['reunión', 'concentración', 'documentación', 'horario', 'eficaz'] },
        { id: 'mentorias_desarrollo_talento', name: 'Mentoría de Perfiles Junior y Aprendizaje en el Equipo', keywords: ['aprender', 'ayudar', 'compañero', 'experiencia', 'crecer'] },
        { id: 'cultura_sin_culpas', name: 'Aprendizaje Constructivo ante Errores en Producción', keywords: ['error', 'mejorar', 'confianza', 'solución', 'equipo'] }
    ],
    ciberseguridad_infraestructura: [
        { id: 'privacidad_por_diseno', name: 'Privacidad por Diseño frente a la Recolección Masiva de Datos', keywords: ['privacidad', 'datos', 'usuario', 'confianza', 'normativa'] },
        { id: 'dependencia_proveedores_nube', name: 'Soberanía de Infraestructura frente a la Dependencia de un Proveedor', keywords: ['nube', 'costo', 'migración', 'control', 'servicio'] },
        { id: 'automatizacion_despliegues', name: 'Automatización Continua y Prevención de Fallos Críticos', keywords: ['automatizar', 'pruebas', 'despliegue', 'estable', 'calidad'] }
    ]
};

function randomChoice(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Builds a level-appropriate Spanish writing directive so A1/A2 learners get clear,
 * approachable tasks while B1/B2 and C1/C2 learners receive DELE-calibrated analytical prompts.
 */
function buildLevelDirective(subject, theme1, theme2, tension, scope, stakeholder, level = 'C1') {
    const normLevel = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].includes(String(level).toUpperCase())
        ? String(level).toUpperCase()
        : 'C1';

    if (normLevel === 'A1') {
        return `Escribe un texto breve y claro (50–80 palabras) sobre «${subject.name}». Describe cómo se relacionan «${theme1.name}» y «${theme2.name}» en tu vida diaria o en tu ciudad, explicando qué haces habitualmente y por qué es importante para ti y tu familia.`;
    }
    if (normLevel === 'A2') {
        return `Redacta un texto personal y bien organizado (90–130 palabras) acerca de «${subject.name}». Compara tu experiencia con «${theme1.name}» y «${theme2.name}» ${scope.name}, y explica qué costumbres o cambios te parecen más positivos para ${stakeholder.name}.`;
    }
    if (normLevel === 'B1') {
        return `Escribe un texto de opinión estructurado (140–180 palabras) que relacione «${theme1.name}» con «${theme2.name}» dentro del tema de «${subject.name}». Expón las principales ventajas y dificultades ${scope.name}, y propón qué medidas pueden ayudar a ${stakeholder.name}.`;
    }
    if (normLevel === 'B2') {
        return `Redacta un ensayo argumentativo (180–220 palabras) analizando el vínculo entre «${theme1.name}» y «${theme2.name}» en el marco de «${subject.name}». Evalúa ${tension.name} ${scope.name}, defendiendo una postura clara con ejemplos concretos.`;
    }
    if (normLevel === 'C1') {
        return `Desarrolle un ensayo analítico riguroso (220–260 palabras) que examine la interdependencia entre «${theme1.name}» y «${theme2.name}» en el ámbito de «${subject.name}». Analice críticamente ${tension.name} ${scope.name}, valorando sus implicaciones para ${stakeholder.name}.`;
    }
    // C2
    return `Elabore un ensayo discursivo de alta precisión conceptual (280–320 palabras) que sintetice la tensión dialéctica entre «${theme1.name}» y «${theme2.name}» dentro de «${subject.name}». Dilucide cómo repercute ${tension.name} ${scope.name}, formulando una tesis matizada sobre la responsabilidad de ${stakeholder.name}.`;
}
function generateTopicFromTree(subjectId, theme1Id, theme2Id, level = 'C1', difficulty = 'all', options = {}) {
    const subject = MAIN_SUBJECTS.find(s => s.id === subjectId) || MAIN_SUBJECTS[0];
    const themes = SUB_THEMES[subject.id] || [];
    const theme1 = themes.find(t => t.id === theme1Id) || themes[0];
    const theme2 = themes.find(t => t.id === theme2Id && t.id !== theme1.id) || themes[1] || themes[0];

    const tension = options.tension || (options.deterministic ? TENSIONS[1] : randomChoice(TENSIONS));
    const scope = options.scope || (options.deterministic ? SCOPES[0] : randomChoice(SCOPES));
    const stakeholder = options.stakeholder || (options.deterministic ? STAKEHOLDERS[0] : randomChoice(STAKEHOLDERS));
    const normLevel = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].includes(String(level).toUpperCase())
        ? String(level).toUpperCase()
        : 'C1';

    const directive = buildLevelDirective(subject, theme1, theme2, tension, scope, stakeholder, normLevel);
    const subjectKeywords = Array.isArray(subject.keywords) ? subject.keywords : [];
    const theme1Keywords = Array.isArray(theme1.keywords) ? theme1.keywords : [];
    const theme2Keywords = Array.isArray(theme2.keywords) ? theme2.keywords : [];
    const combinedKeywords = Array.from(new Set([
        ...subjectKeywords,
        ...theme1Keywords,
        ...theme2Keywords
    ]));

    return {
        subjectId: subject.id,
        subjectName: subject.name,
        subjectIcon: subject.icon,
        category: subject.category,
        difficulty: subject.difficulty || difficulty || 'medium',
        theme1Id: theme1.id,
        theme1Name: theme1.name,
        theme2Id: theme2.id,
        theme2Name: theme2.name,
        tension,
        scope,
        stakeholder,
        tensionName: tension.name,
        scopeName: scope.name,
        stakeholderName: stakeholder.name,
        level: normLevel,
        title: `${subject.name}: ${theme1.name} y ${theme2.name}`,
        directive,
        subjectKeywords,
        theme1Keywords,
        theme2Keywords,
        keywords: combinedKeywords,
        isTechTopic: false
    };
}
function generateRandomTreeTopic(level = 'C1', difficulty = 'all', excludeSubjectId = null) {
    const normDiff = String(difficulty || 'all').toLowerCase();
    let pool = MAIN_SUBJECTS;
    if (normDiff === 'easy' || normDiff === 'medium' || normDiff === 'hard') {
        const filtered = MAIN_SUBJECTS.filter(s => s.difficulty === normDiff);
        if (filtered.length > 0) pool = filtered;
    }
    if (excludeSubjectId && pool.length > 1) {
        const withoutCurrent = pool.filter(s => s.id !== excludeSubjectId);
        if (withoutCurrent.length > 0) pool = withoutCurrent;
    }

    const subject = randomChoice(pool);
    const themes = SUB_THEMES[subject.id] || [];
    const theme1 = randomChoice(themes);
    const remaining = themes.filter(t => t.id !== theme1.id);
    const theme2 = remaining.length > 0 ? randomChoice(remaining) : theme1;

    return generateTopicFromTree(subject.id, theme1.id, theme2.id, level, subject.difficulty);
}

/**
 * Always returns the exact same fixed starting General Topic (Nuevo Tema) when the page is loaded for the first time,
 * regardless of the active level (A1–C2).
 */
function getDefaultStartingTopic(level = 'C1') {
    const normLevel = String(level || 'C1').toUpperCase();
    return generateTopicFromTree(
        'vida_cotidiana_familia',
        'habitos_diarios',
        'convivencia_familiar',
        normLevel,
        'easy',
        { deterministic: true }
    );
}
function generateTechTopicFromTree(subjectId, theme1Id, theme2Id, level = 'C1', difficulty = 'all', options = {}) {
    const subject = TECH_MAIN_SUBJECTS.find(s => s.id === subjectId) || TECH_MAIN_SUBJECTS[0];
    const themes = TECH_SUB_THEMES[subject.id] || [];
    const theme1 = themes.find(t => t.id === theme1Id) || themes[0];
    const theme2 = themes.find(t => t.id === theme2Id && t.id !== theme1.id) || themes[1] || themes[0];

    const tension = options.tension || (options.deterministic ? TENSIONS[2] : randomChoice(TENSIONS));
    const scope = options.scope || { id: 'ambito_tech', name: 'en los equipos de desarrollo de software y tecnología actuales' };
    const stakeholder = options.stakeholder || { id: 'ingenieros_usuarios', name: 'los ingenieros, los líderes técnicos y los usuarios finales' };
    const normLevel = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].includes(String(level).toUpperCase())
        ? String(level).toUpperCase()
        : 'C1';

    const directive = buildLevelDirective(subject, theme1, theme2, tension, scope, stakeholder, normLevel);
    const subjectKeywords = Array.isArray(subject.keywords) ? subject.keywords : [];
    const theme1Keywords = Array.isArray(theme1.keywords) ? theme1.keywords : [];
    const theme2Keywords = Array.isArray(theme2.keywords) ? theme2.keywords : [];
    const combinedKeywords = Array.from(new Set([
        ...subjectKeywords,
        ...theme1Keywords,
        ...theme2Keywords
    ]));

    return {
        subjectId: subject.id,
        subjectName: subject.name,
        subjectIcon: subject.icon,
        category: subject.category,
        difficulty: subject.difficulty || difficulty || 'medium',
        theme1Id: theme1.id,
        theme1Name: theme1.name,
        theme2Id: theme2.id,
        theme2Name: theme2.name,
        tension,
        scope,
        stakeholder,
        tensionName: tension.name,
        scopeName: scope.name,
        stakeholderName: stakeholder.name,
        level: normLevel,
        title: `[Tech] ${subject.name}: ${theme1.name} y ${theme2.name}`,
        directive,
        subjectKeywords,
        theme1Keywords,
        theme2Keywords,
        keywords: combinedKeywords,
        isTechTopic: true
    };
}

/**
 * Always returns the exact same fixed starting Tech Topic (Tema Tech) the first time Tech Mode is selected.
 */
function getDefaultTechStartingTopic(level = 'C1') {
    const normLevel = String(level || 'C1').toUpperCase();
    return generateTechTopicFromTree(
        'liderazgo_equipos_remotos',
        'reuniones_vs_trabajo_profundo',
        'mentorias_desarrollo_talento',
        normLevel,
        'easy',
        { deterministic: true }
    );
}
function generateRandomTechTreeTopic(level = 'C1', difficulty = 'all', excludeSubjectId = null) {
    const normDiff = String(difficulty || 'all').toLowerCase();
    let pool = TECH_MAIN_SUBJECTS;
    if (normDiff === 'easy' || normDiff === 'medium' || normDiff === 'hard') {
        const filtered = TECH_MAIN_SUBJECTS.filter(s => s.difficulty === normDiff);
        if (filtered.length > 0) pool = filtered;
    }
    if (excludeSubjectId && pool.length > 1) {
        const withoutCurrent = pool.filter(s => s.id !== excludeSubjectId);
        if (withoutCurrent.length > 0) pool = withoutCurrent;
    }

    const subject = randomChoice(pool);
    const themes = TECH_SUB_THEMES[subject.id] || [];
    const theme1 = randomChoice(themes);
    const remaining = themes.filter(t => t.id !== theme1.id);
    const theme2 = remaining.length > 0 ? randomChoice(remaining) : theme1;

    return generateTechTopicFromTree(subject.id, theme1.id, theme2.id, level, subject.difficulty);
}

/**
 * Checks whether the learner's Spanish essay addresses the active Tree Topic
 * and each of its 3 nodes (Main Subject, Sub-theme 1, Sub-theme 2) individually.
 */
function checkTopicAdherence(essayText, topic) {
    const trimmed = String(essayText || '').trim();
    if (!topic || !trimmed) {
        return {
            isOnTopic: false,
            passes: false,
            subjectOk: false,
            theme1Ok: false,
            theme2Ok: false,
            subjectFound: [],
            theme1Found: [],
            theme2Found: [],
            matchedCount: 0,
            matchedWords: [],
            coverageRatio: 0
        };
    }

    const normalize = (s) => String(s || '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');

    const cleanEssay = normalize(trimmed);
    const stopFilter = (w) => w.length >= 4 && !['para', 'como', 'entre', 'frente', 'sobre', 'desde', 'hasta', 'ante', 'bajo'].includes(w);

    const buildGroupCandidates = (kwList, titleStr) => {
        const titleWords = normalize(titleStr || '')
            .split(/[^a-z0-9ñ]+/)
            .filter(stopFilter);
        return Array.from(new Set([...(kwList || []).map(normalize), ...titleWords])).filter(w => w.length >= 3);
    };

    const matchGroup = (candidates) => {
        const found = [];
        for (const kw of candidates) {
            const stem = kw.length >= 6 ? kw.slice(0, -1) : kw;
            const regex = new RegExp(`\\b${stem}[a-zñ]*\\b`, 'i');
            if (regex.test(cleanEssay)) {
                found.push(kw);
            }
        }
        return found;
    };

    const subjectCandidates = buildGroupCandidates(topic.subjectKeywords, topic.subjectName);
    const theme1Candidates = buildGroupCandidates(topic.theme1Keywords, topic.theme1Name);
    const theme2Candidates = buildGroupCandidates(topic.theme2Keywords, topic.theme2Name);

    const subjectFound = matchGroup(subjectCandidates);
    const theme1Found = matchGroup(theme1Candidates);
    const theme2Found = matchGroup(theme2Candidates);

    const subjectOk = subjectFound.length >= 1;
    const theme1Ok = theme1Found.length >= 1;
    const theme2Ok = theme2Found.length >= 1;

    const allMatched = Array.from(new Set([...subjectFound, ...theme1Found, ...theme2Found]));
    const nodesMet = (subjectOk ? 1 : 0) + (theme1Ok ? 1 : 0) + (theme2Ok ? 1 : 0);
    const minRequiredNodes = (topic.level === 'A1' || topic.level === 'A2') ? 2 : 3;
    const isOnTopic = nodesMet >= minRequiredNodes || (nodesMet >= 2 && allMatched.length >= 3);

    const totalCandidates = subjectCandidates.length + theme1Candidates.length + theme2Candidates.length;
    return {
        isOnTopic,
        passes: isOnTopic,
        subjectOk,
        theme1Ok,
        theme2Ok,
        subjectFound,
        theme1Found,
        theme2Found,
        matchedCount: allMatched.length,
        matchedWords: allMatched.slice(0, 10),
        coverageRatio: totalCandidates > 0 ? allMatched.length / totalCandidates : 0
    };
}



  // ==========================================
  // 3. A1â€“C2 SPANISH EVALUATOR ENGINE
  // ==========================================
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
const LEVEL_SPECS = {
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
function getLevelSpec(level = 'C1') {
    const key = String(level || 'C1').toUpperCase();
    return LEVEL_SPECS[key] || LEVEL_SPECS.C1;
}

/**
 * Multi-Level Spanish Syntactic & Grammatical Patterns
 * - Foundational patterns (A1/A2/B1) support beginner & intermediate milestones.
 * - Intermediate/Advanced/Mastery patterns (B1–C2) operate across all levels and form the core requirement for B2, C1, and C2.
 */
const SYNTACTIC_PATTERNS = {
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
function checkTargetWordUsage(vocabItem, text) {
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
function analyzeQuickMetrics(text, targetVocabulary = [], targetLevel = 'C1') {
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
function evaluateEssay(text, currentTopic, targetLevel = 'C1', activeVocabulary = null) {
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
function generateAiEssayPrompt(topic, targetVocabulary = [], targetLevel = 'C1') {
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



  // ==========================================
  // 4. SPEECH & PRONUNCIATION ENGINE (ES-AR & ES-ES)
  // ==========================================
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
const VOICE_PROFILES = {
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
const SPEAKING_CADENCE_BY_LEVEL = {
    A1: { min: 90, max: 120, optimal: 105 },
    A2: { min: 100, max: 130, optimal: 115 },
    B1: { min: 115, max: 145, optimal: 130 },
    B2: { min: 125, max: 155, optimal: 140 },
    C1: { min: 130, max: 160, optimal: 145 },
    C2: { min: 135, max: 165, optimal: 150 }
};
class SpeechEngine {
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
function calculateWordSimilarity(s1, s2) {
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
function levenshteinDistance(a, b) {
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
function getWordSyllableAndStress(rawWord) {
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


  // ==========================================
  // 5. MAIN APP CONTROLLER
  // ==========================================
/**
 * FluentEdge: Español Perfecto (A1–C2 MCER / DELE) - Main Application Controller
 */
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
        this.hasDrawnTechTopic = false;
        this.currentTopic = getDefaultStartingTopic(this.targetLevel);

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

        // Update current topic directive for the newly chosen level while preserving the exact same theme, sub-themes, tension, scope, and stakeholder
        if (this.currentTopic) {
            const preservedOptions = {
                tension: this.currentTopic.tension,
                scope: this.currentTopic.scope,
                stakeholder: this.currentTopic.stakeholder,
                deterministic: true
            };
            if (this.currentTopic.isTechTopic) {
                this.currentTopic = generateTechTopicFromTree(
                    this.currentTopic.subjectId,
                    this.currentTopic.theme1Id,
                    this.currentTopic.theme2Id,
                    normLevel,
                    this.currentTopic.difficulty,
                    preservedOptions
                );
            } else {
                this.currentTopic = generateTopicFromTree(
                    this.currentTopic.subjectId,
                    this.currentTopic.theme1Id,
                    this.currentTopic.theme2Id,
                    normLevel,
                    this.currentTopic.difficulty,
                    preservedOptions
                );
            }
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
            if (this.currentTopic?.isTechTopic) {
                this.rerollTechTopic(true);
            } else {
                this.rerollTopic(true);
            }
        }
    }

    rerollTopic(forceRandom = false) {
        let newTopic;
        if (!forceRandom && this.currentTopic?.isTechTopic && !this.hasDrawnTopic) {
            newTopic = getDefaultStartingTopic(this.targetLevel);
        } else {
            this.hasDrawnTopic = true;
            const excludeId = !this.currentTopic?.isTechTopic ? this.currentTopic?.subjectId : null;
            newTopic = generateRandomTreeTopic(this.targetLevel, this.topicDifficulty, excludeId);
        }
        this.currentTopic = newTopic;
        if (this.dom.essayInput) this.dom.essayInput.value = '';
        this.loadTopic(newTopic);
    }

    rerollTechTopic(forceRandom = false) {
        let newTopic;
        if (!forceRandom && !this.hasDrawnTechTopic) {
            this.hasDrawnTechTopic = true;
            newTopic = getDefaultTechStartingTopic(this.targetLevel);
        } else {
            this.hasDrawnTechTopic = true;
            const excludeId = this.currentTopic?.isTechTopic ? this.currentTopic?.subjectId : null;
            newTopic = generateRandomTechTreeTopic(this.targetLevel, this.topicDifficulty, excludeId);
        }
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


})();