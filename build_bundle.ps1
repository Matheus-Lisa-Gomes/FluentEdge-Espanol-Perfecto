# Build script to regenerate js/bundle.js from modular source files (FluentEdge: Español Perfecto)

$vocabContent = [System.IO.File]::ReadAllText("$PSScriptRoot/js/data/vocabulary.js", [System.Text.Encoding]::UTF8)
$topicsContent = [System.IO.File]::ReadAllText("$PSScriptRoot/js/data/topics.js", [System.Text.Encoding]::UTF8)
$evaluatorContent = [System.IO.File]::ReadAllText("$PSScriptRoot/js/modules/evaluator.js", [System.Text.Encoding]::UTF8)
$speechContent = [System.IO.File]::ReadAllText("$PSScriptRoot/js/modules/speech.js", [System.Text.Encoding]::UTF8)
$appContent = [System.IO.File]::ReadAllText("$PSScriptRoot/js/app.js", [System.Text.Encoding]::UTF8)

function Clean-JsModule([string]$content) {
    $cleaned = $content -replace '(?m)^\s*import\s+[^;]+;\s*\r?\n', ''
    $cleaned = $cleaned -replace '(?m)^\s*export\s+const\s+', 'const '
    $cleaned = $cleaned -replace '(?m)^\s*export\s+let\s+', 'let '
    $cleaned = $cleaned -replace '(?m)^\s*export\s+function\s+', 'function '
    $cleaned = $cleaned -replace '(?m)^\s*export\s+class\s+', 'class '
    $cleaned = $cleaned -replace '(?m)^\s*export\s*\{[^}]+\};\s*\r?\n?', ''
    return $cleaned
}

$vocabClean = Clean-JsModule $vocabContent
$topicsClean = Clean-JsModule $topicsContent
$evaluatorClean = Clean-JsModule $evaluatorContent
$speechClean = Clean-JsModule $speechContent
$appClean = Clean-JsModule $appContent

$bundle = @"
/**
 * FluentEdge: Español Perfecto (A1–C2 MCER / DELE) - Standalone Unified Bundle
 * Works directly on file:// as well as localhost http://
 */

(function() {
  'use strict';

  // ==========================================
  // 1. VOCABULARY LEXICON (A1–C2 SPANISH WORDS)
  // ==========================================
$vocabClean

  // ==========================================
  // 2. TOPICS & MCER / DELE DATA
  // ==========================================
$topicsClean

  // ==========================================
  // 3. A1–C2 SPANISH EVALUATOR ENGINE
  // ==========================================
$evaluatorClean

  // ==========================================
  // 4. SPEECH & PRONUNCIATION ENGINE (ES-AR & ES-ES)
  // ==========================================
$speechClean

  // ==========================================
  // 5. MAIN APP CONTROLLER
  // ==========================================
$appClean
})();
"@

$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText("$PSScriptRoot/js/bundle.js", $bundle, $utf8NoBom)
Write-Host "js/bundle.js successfully built! Total size: $([System.IO.FileInfo]::new("$PSScriptRoot/js/bundle.js").Length) bytes." -ForegroundColor Green

