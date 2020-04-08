Write-Host "Deploying updates to GitHub..."

$dir = "E:/GitHub/instanceid-hugo"
$sourceDirectory = "E:/GitHub/instanceid-hugo/public/*"
$destinationDirectory = "E:/GitHub/instance-id.github.io"

# Build the project
#hugo
& hugo -v
$msg = "rebuilding site $(Get-Date)"

Write-Host "Committing local repo"
& git add -A
& git commit -m $msg
& git push origin master

Write-Host "Copying $sourceDirectory to $destinationDirectory"
Copy-item -Force -Recurse -Verbose -Path $sourceDirectory -Destination $destinationDirectory
Set-Location $destinationDirectory


& git add -A
& git commit -m $msg
& git push origin master

Set-Location $dir