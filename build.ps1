Write-Host "Begin building all site files..."

$sourceDirectory = "E:/GitHub/instance-id.github.io/project_builder"

# Build the project
& Set-Location $sourceDirectory
& node hugo.js
& Set-Location ..
& hugo -v

New-BurntToastNotification -Silent -Text "instance.id Build Update:",
'instance.id Site build complete...'