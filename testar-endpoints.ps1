# Execute no PowerShell com a API Flask ativa em http://127.0.0.1:5000.
$ErrorActionPreference = "Stop"
$base = "http://127.0.0.1:5000"

foreach ($recurso in @("nadadores", "funcionarios", "toalhas", "movimentacoes")) {
    $lista = Invoke-RestMethod -Uri "$base/$recurso" -Method Get
    Write-Host "GET /$recurso OK - $(@($lista).Count) registro(s)."
}

Write-Host "Verificação básica dos endpoints concluída."
Write-Host "Para testar POST/PATCH/DELETE, utilize as telas do frontend conforme o README."
