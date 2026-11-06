# FluentEdge: Español Perfecto (A1–C2 MCER / DELE) - Lightweight Local Server
$port = 8080
$url = "http://localhost:$port/"
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add($url)

try {
    $listener.Start()
    Write-Host "FluentEdge: Español Perfecto running at $url" -ForegroundColor Cyan
    Write-Host "Press Ctrl+C to stop the server." -ForegroundColor Gray

    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        try {
            $localPath = $request.Url.LocalPath.TrimStart('/')
            if ([string]::IsNullOrEmpty($localPath) -or $localPath -eq '/') {
                $localPath = "index.html"
            }

            $filePath = Join-Path (Get-Location) $localPath

            if (Test-Path $filePath -PathType Leaf) {
                $extension = [System.IO.Path]::GetExtension($filePath).ToLower()
                $contentType = switch ($extension) {
                    ".html" { "text/html; charset=utf-8" }
                    ".css"  { "text/css; charset=utf-8" }
                    ".js"   { "application/javascript; charset=utf-8" }
                    ".json" { "application/json; charset=utf-8" }
                    ".svg"  { "image/svg+xml" }
                    ".png"  { "image/png" }
                    ".jpg"  { "image/jpeg" }
                    ".webm" { "audio/webm" }
                    ".opus" { "audio/ogg; codecs=opus" }
                    ".wav"  { "audio/wav" }
                    ".mp3"  { "audio/mpeg" }
                    ".csv"  { "text/csv; charset=utf-8" }
                    default { "application/octet-stream" }
                }

                $bytes = [System.IO.File]::ReadAllBytes($filePath)
                $response.ContentType = $contentType
                $response.ContentLength64 = $bytes.Length
                if ($request.HttpMethod -ne "HEAD") {
                    $response.OutputStream.Write($bytes, 0, $bytes.Length)
                }
            } else {
                $response.StatusCode = 404
                $msg = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
                $response.ContentLength64 = $msg.Length
                if ($request.HttpMethod -ne "HEAD") {
                    $response.OutputStream.Write($msg, 0, $msg.Length)
                }
            }
        } catch {
            # Ignore client disconnects
        } finally {
            try { $response.Close() } catch {}
        }
    }
} finally {
    try { $listener.Stop() } catch {}
}

