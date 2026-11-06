# FluentEdge: Español Perfecto (A1–C2 MCER / DELE) 🇦🇷 🇪🇸

**FluentEdge: Español Perfecto** is an interactive, zero-dependency web application for mastering written and spoken Spanish across all six official levels of the **Marco Común Europeo de Referencia para las Lenguas (MCER)** and the **Diplomas de Español como Lengua Extranjera (DELE — Instituto Cervantes)**:

| Nivel | Denominación Oficial (MCER / DELE) | Rango de Palabras | Párrafos | Estructuras Sintácticas |
| :---: | :--- | :---: | :---: | :---: |
| **A1** | **Acceso** *(Principiante)* | 50 – 80 | 1 – 2 | 2+ patrones base |
| **A2** | **Plataforma** *(Elemental)* | 80 – 120 | 2 – 3 | 2+ patrones elementales |
| **B1** | **Umbral** *(Intermedio)* | 130 – 180 | 3 – 4 | 3+ patrones intermedios |
| **B2** | **Avanzado** *(Intermedio Alto)* | 180 – 250 | 3 – 5 | 4+ patrones avanzados |
| **C1** | **Dominio Operativo Eficaz** *(Superior)* | 220 – 300 | 4 – 5 | 5+ patrones superiores |
| **C2** | **Maestría** *(Bilingüe Académico)* | 260 – 350 | 4 – 6 | 6+ patrones de maestría |

---

## 🎨 Paleta Cromática Armonizada: Argentina 🇦🇷 & España 🇪🇸

El diseño visual fusiona los colores emblemáticos de las banderas de **Argentina** y **España** sobre un fondo nocturno de pizarra celeste profunda (`#070d19` / `#0c172b`), utilizando el **Oro del Sol de Mayo y la Gualda Real (`#F4B942`)** como puente armónico para que nunca choquen visualmente:

- **🇦🇷 Celeste Argentino (`#74ACDF`) y Blanco Albiceleste (`#F8FAFC`)**: Define la identidad de los niveles iniciales e intermedios (`A1`, `A2`, `B1`), los controles de navegación, el radar sintáctico y las tarjetas de voz rioplatense.
- **☀️ Sol de Mayo & Oro Gualda (`#F4B942` / `#E8B84B`)**: Actúa como nexo cromático compartido entre ambas banderas, iluminando el nivel `B2`, las insignias de maestría y los estados de éxito.
- **🇪🇸 Rojo Carmesí Español (`#C60B1E` / `#E11D48`)**: Distingue los niveles superiores (`C1` y `C2`), las tarjetas de voz peninsular y los acentos de alta exigencia académica.

---

## 🎙️ Modelos de Voz Regionales (Argentina `es-AR` y España `es-ES`)

En la barra superior puedes alternar en cualquier momento entre **4 perfiles de voz hispana**:
- **🇦🇷 Español Rioplatense (`es-AR`)**:
  - **Elena** *(Femenina · Buenos Aires)*
  - **Mateo** *(Masculina · Buenos Aires)*
- **🇪🇸 Español Peninsular (`es-ES`)**:
  - **Lucía** *(Femenina · Madrid)*
  - **Álvaro** *(Masculina · Madrid)*

---

## 🚀 Cómo Iniciar la Aplicación

### Opción 1: Lanzador Rápido con Servidor Local (Recomendado)
Haz doble clic en **`Start_FluentEdge.bat`** o ejecuta en PowerShell:
```powershell
powershell -ExecutionPolicy Bypass -File .\server.ps1
```
Luego abre **`http://localhost:8080`** en Google Chrome o Microsoft Edge.

### Opción 2: Apertura Directa (`file://`)
Gracias al paquete unificado `js/bundle.js`, también puedes abrir directamente **`index.html`** con doble clic en tu navegador sin necesidad de servidor.

> Si modificas los archivos modulares dentro de `js/data/` o `js/modules/`, ejecuta `build_bundle.ps1` para regenerar `js/bundle.js`:
> ```powershell
> powershell -ExecutionPolicy Bypass -File .\build_bundle.ps1
> ```

---

## 🏛️ Arquitectura de 3 Fases

1. **Fase 1 · Directrices MCER / DELE (`A1`–`C2`)**:
   - Selector dinámico de los 6 niveles oficiales (`A1`, `A2`, `B1`, `B2`, `C1`, `C2`).
   - Tarjetas dinámicas de requisitos de extensión, estructura de párrafos, precisión léxica y criterios de evaluación del Instituto Cervantes.
   - Tabla comparativa completa de progresión desde **A1 (Acceso)** hasta **C2 (Maestría)**.
2. **Fase 2 · Estudio de Redacción y Evaluación Analítica**:
   - **Motor Combinatorio de Temas en Árbol**: Filtra por dificultad (*Fácil / Cotidiano*, *Medio / Social*, *Difícil / Académico* o *Entorno Tecnológico*) o personaliza cada rama del árbol temático.
   - **10 Palabras Obligatorias por Nivel**: Léxico calibrado para cada nivel (`A1`–`C2`) con reconocimiento morfológico de conjugaciones verbales, género, número y superlativos (`-ísimo`), audio al instante y reemplazo individual.
   - **Barra de Caracteres Especiales del Español**: Inserción con un clic de `á é í ó ú ü ñ Ñ ¿ ¡ « »`.
   - **Radar Sintáctico en Tiempo Real**: Detecta 14 patrones gramaticales del español (desde conectores básicos y pretéritos en `A1–A2` hasta subjuntivo imperfecto/pluscuamperfecto, condicionales irreales `Si hubiera... habría...` y concesivas en `C1–C2`).
   - **Evaluación Analítica DELE (0–20 puntos)** y **Generador de Prompts para IA** (ChatGPT, Claude, Gemini) adaptado al nivel activo.
3. **Fase 3 · Estudio de Oratoria, Teleprompter y Fonética RAE**:
   - **Teleprompter Interactivo** con seguimiento palabra por palabra mediante reconocimiento de voz (`es-AR` / `es-ES`).
   - **Visualizador de Onda de Audio a 60fps** con degradado Celeste → Oro → Carmesí.
   - **Analizador Silábico y Prosódico (RAE)**: División silábica automática e identificación de la sílaba tónica (*Aguda*, *Llana / Grave* o *Esdrújula*).
   - **Práctica Fonética Individual ("Repite Después de Mí")**: Evalúa tu pronunciación palabra por palabra con retroalimentación inmediata.

