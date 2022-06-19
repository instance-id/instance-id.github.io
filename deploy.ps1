#!/usr/bin/env pwsh

Param (
    [Parameter()]
    [string]$Build
)
$argument = $args[0]

if ($Build) {
    Write-Host "Building $argument..."
    & .\build $Build
} else {
    & hugo -v
}

Write-Host 'Deploying updates to GitHub...'

if ($IsWindows) {
    $basePath = 'E:'
} else {
    $basePath = '/mnt/x'
}

$sourceDirectory = "${$basePath}/GitHub/instance-id/instance.github.io/public/*"
$destinationDirectory = "${$basePath}/GitHub/instance-id/instance.github.io"
$tmpSource = "${$basePath}/GitHub/tmp/*"
$tmpDestination = "${$basePath}/GitHub/tmp"

$msg = "rebuilding site $(Get-Date)"

Write-Host 'Committing local repo'
& git add -A
& git commit -m $msg
& git push origin site_files

Write-Host "Copying $sourceDirectory to $destinationDirectory"
Copy-item -Force -Recurse -Verbose -Path $sourceDirectory -Destination $tmpDestination
git checkout master
if ($argument -eq 'clean') {
    Write-Host 'Cleaning destination directory'
    & hugo --cleanDestinationDir
}
Copy-item -Force -Recurse -Verbose -Path $tmpSource -Destination $destinationDirectory

& git add -A
& git commit -m $msg
& git push origin master

git checkout 'site_files'
Remove-Item $tmpSource -Recurse -Force
# New-BurntToastNotification -Silent -Text "Status Update:",
'Site deployment complete'