/**
 * FluentEdge Español Perfecto: Combinatorial Tree Topic Engine (A1–C2 MCER / DELE)
 * Architecture:
 * [Sujeto Principal] + [Subtema 1] + [Subtema 2] + [Tensión / Alcance / Nivel MCER]
 * Also includes Tech & Workplace Spanish Topics (Español Profesional y Tecnológico).
 */

export const DIFFICULTY_PROFILES = {
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

export const CEFR_DESCRIPTORS = {
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

export const MAIN_SUBJECTS = [
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

export const SUB_THEMES = {
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

export const TENSIONS = [
    { id: 'libertad_vs_regulacion', name: 'la iniciativa individual frente a la regulación colectiva' },
    { id: 'tradicion_vs_modernidad', name: 'la preservación de las costumbres frente a la modernización acelerada' },
    { id: 'eficiencia_vs_bienestar', name: 'la eficiencia económica inmediata frente al bienestar humano a largo plazo' },
    { id: 'local_vs_global', name: 'las necesidades de la comunidad local frente a las exigencias globales' },
    { id: 'acceso_vs_calidad', name: 'la democratización del acceso frente al mantenimiento de la excelencia' }
];

export const SCOPES = [
    { id: 'ambito_cotidiano', name: 'en la vida cotidiana de las familias y los barrios actuales' },
    { id: 'ambito_panhispanico', name: 'en el contexto social y cultural de Argentina, España e Iberoamérica' },
    { id: 'ambito_educativo_laboral', name: 'en los entornos educativos y profesionales contemporáneos' },
    { id: 'ambito_urbano', name: 'en las grandes ciudades y comunidades en transformación' }
];

export const STAKEHOLDERS = [
    { id: 'ciudadanos_familias', name: 'los ciudadanos, las familias y los jóvenes estudiantes' },
    { id: 'instituciones_empresas', name: 'las instituciones públicas, las empresas y la comunidad educativa' },
    { id: 'profesionales_expertos', name: 'los trabajadores, los educadores y los especialistas del sector' }
];

export const PROMPT_TYPES = [
    { id: 'descriptivo_personal', name: 'Exposición Personal y Cotidiana', levels: ['A1', 'A2'] },
    { id: 'opinion_estructurada', name: 'Artículo de Opinión y Experiencias', levels: ['B1', 'B2'] },
    { id: 'ensayo_analitico', name: 'Ensayo Discursivo y Dialéctico DELE', levels: ['C1', 'C2'] }
];

// ============================================================================
// TECH & WORKPLACE SPANISH TOPICS (Español para Ingeniería, Producto y Gestión)
// ============================================================================
export const TECH_MAIN_SUBJECTS = [
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

export const TECH_SUB_THEMES = {
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

export function generateTopicFromTree(subjectId, theme1Id, theme2Id, level = 'C1', difficulty = 'all', options = {}) {
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

export function generateRandomTreeTopic(level = 'C1', difficulty = 'all', excludeSubjectId = null) {
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
export function getDefaultStartingTopic(level = 'C1') {
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

export function generateTechTopicFromTree(subjectId, theme1Id, theme2Id, level = 'C1', difficulty = 'all', options = {}) {
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
export function getDefaultTechStartingTopic(level = 'C1') {
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

export function generateRandomTechTreeTopic(level = 'C1', difficulty = 'all', excludeSubjectId = null) {
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
export function checkTopicAdherence(essayText, topic) {
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

