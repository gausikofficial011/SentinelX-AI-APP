<#
.SYNOPSIS
Generates a Release Keystore for the SentinelX Android application.

.DESCRIPTION
This script uses the Java keytool utility to generate a cryptographically secure 
JKS keystore required for signing the production release APK. 

.NOTES
Keep the generated 'release.keystore' file secure. Never commit it to version control!
Store the passwords in GitHub Secrets or a secure vault.
#>

$KeystoreName = "release.keystore"
$Alias = "sentinelx-key"
$KeyAlg = "RSA"
$Keysize = 2048
$Validity = 10000

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host " SentinelX Release Keystore Generator" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "This will generate a new keystore: $KeystoreName"
Write-Host "You will be prompted to enter a keystore password and organization details."
Write-Host ""

# Check if keytool is available
try {
    Get-Command keytool -ErrorAction Stop | Out-Null
} catch {
    Write-Host "ERROR: 'keytool' is not found in your PATH." -ForegroundColor Red
    Write-Host "Please ensure the Java JDK is installed and added to your environment variables." -ForegroundColor Yellow
    exit 1
}

if (Test-Path $KeystoreName) {
    Write-Host "WARNING: $KeystoreName already exists in this directory." -ForegroundColor Yellow
    $response = Read-Host "Do you want to overwrite it? (Y/N)"
    if ($response -notmatch "^[Yy]$") {
        Write-Host "Aborted."
        exit 0
    }
    Remove-Item $KeystoreName
}

# Run keytool
Write-Host "Running keytool..." -ForegroundColor Green
keytool -genkey -v -keystore $KeystoreName -alias $Alias -keyalg $KeyAlg -keysize $Keysize -validity $Validity

if ($LASTEXITCODE -eq 0) {
    Write-Host "`nSuccessfully created $KeystoreName!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next Steps for CI/CD:" -ForegroundColor Yellow
    Write-Host "1. Encode this file in Base64:"
    Write-Host "   certutil -encode $KeystoreName tmp.b64"
    Write-Host "2. Save the Base64 string to GitHub Secrets as RELEASE_KEYSTORE_BASE64"
    Write-Host "3. Save your passwords to GitHub Secrets as RELEASE_KEYSTORE_PASSWORD and RELEASE_KEY_PASSWORD"
} else {
    Write-Host "`nFailed to generate keystore." -ForegroundColor Red
}
