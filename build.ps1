$param1 = $args[0]
write-host $param1 
Write-Host "Begin building all site files..."

$sourceDirectory = "E:/GitHub/instance-id.github.io/project_builder"

# Build the project
& Set-Location $sourceDirectory
& node hugo.js $param1
& Set-Location ..
& hugo -v

New-BurntToastNotification -Silent -Text "instance.id Build Update:",
'instance.id Site build complete...'