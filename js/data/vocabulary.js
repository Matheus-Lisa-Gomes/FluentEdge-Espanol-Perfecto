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

export const VOCABULARY_LEXICON = RAW_LEXICON.map(item => ({
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
export function getRandomVocabularySet(level = 'C1') {
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
export function getRandomSingleVocabularyWord(pos, currentHeadwords = [], level = 'C1') {
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

