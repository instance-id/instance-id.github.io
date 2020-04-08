Write-Host "Deploying updates to GitHub..."

$tmp = "E:/GitHub/tmp"
$dir = "E:/GitHub/instanceid-hugo"
$sourceDirectory = "E:/GitHub/instanceid-hugo/public/*"
$destinationDirectory = "E:/GitHub/instance-id.github.io"

# Build the project
& hugo -v
$msg = "rebuilding site $(Get-Date)"

Write-Host "Committing local repo"
& git add -A
& git commit -m $msg
& git push origin site_files

Write-Host "Copying $sourceDirectory to $destinationDirectory"
Copy-item -Force -Recurse -Verbose -Path $destinationDirectory -Destination $tmp
git checkout master
Copy-item -Force -Recurse -Verbose -Path $tmp -Destination $destinationDirectory

& git add -A
& git commit -m $msg
& git push origin master

git checkout -b "site_files"

New-BurntToastNotification -Silent -Text "Status Update:",
'Site deployment complete'