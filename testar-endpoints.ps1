# Execute no terminal PowerShell, com o JSON Server ativo em outra janela.
# Os registros de teste serao criados, alterados e excluidos.
$ErrorActionPreference = "Stop"
$base = "http://localhost:3000"

foreach ($recurso in @("nadadores", "funcionarios", "toalhas", "movimentacoes")) {
    $lista = Invoke-RestMethod -Uri "$base/$recurso" -Method Get
    Write-Host "GET /$recurso OK - $(@($lista).Count) registro(s)."
}

function Testar-Crud {
    param([string]$Recurso, [string]$Cpf, [string]$Nome)
    $criado = $null
    try {
        $dados = @{
            nome = $Nome
            cpf = $Cpf
            telefone = "(84) 90000-0099"
            email = "teste-api@exemplo.com"
        } | ConvertTo-Json -Compress

        $criado = Invoke-RestMethod -Uri "$base/$Recurso" -Method Post -ContentType "application/json; charset=utf-8" -Body $dados
        if (-not $criado.id) { throw "POST nao retornou um id." }
        Write-Host "POST /$Recurso OK - id: $($criado.id)"

        $id = [uri]::EscapeDataString([string]$criado.id)
        $uri = "$base/$Recurso/$id"
        $lido = Invoke-RestMethod -Uri $uri -Method Get
        if ([string]$lido.id -ne [string]$criado.id) { throw "GET nao encontrou o id correto." }
        Write-Host "GET /$Recurso/:id OK"

        $alteracao = @{ telefone = "(84) 90000-0088" } | ConvertTo-Json -Compress
        $atualizado = Invoke-RestMethod -Uri $uri -Method Patch -ContentType "application/json; charset=utf-8" -Body $alteracao
        if ($atualizado.telefone -ne "(84) 90000-0088") { throw "PATCH nao persistiu o telefone." }
        Write-Host "PATCH /$Recurso/:id OK"

        Invoke-RestMethod -Uri $uri -Method Delete | Out-Null
        $criado = $null
        Write-Host "DELETE /$Recurso/:id OK"
    }
    finally {
        # Limpa registros temporarios caso algo falhe depois do POST.
        if ($null -ne $criado -and $criado.id) {
            $id = [uri]::EscapeDataString([string]$criado.id)
            try { Invoke-RestMethod -Uri "$base/$Recurso/$id" -Method Delete | Out-Null }
            catch { Write-Warning "Nao consegui remover registro de teste id=$id" }
        }
    }
}

Testar-Crud -Recurso "nadadores" -Cpf "444.444.444-44" -Nome "Teste Nadador"
Testar-Crud -Recurso "funcionarios" -Cpf "555.555.555-55" -Nome "Teste Funcionario"
Write-Host "Todos os testes de endpoint terminaram."
