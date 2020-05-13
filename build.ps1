$param1 = $args[0]
write-host $param1 
Write-Host "Begin building site files $param1..."

$sourceDirectory = "E:/GitHub/instance-id.github.io/project_builder"

# Build the project
& Set-Location $sourceDirectory
if($param1 -eq "settings"){
    & node toml.js replace -c .\searcher-settings.json
} elseif($param1 -eq "news"){
   & node toml.js replace -c .\searcher-news.json
} elseif($param1 -eq "changelog"){
   & node toml.js replace -c .\searcher-chglog.json
} elseif($param1 -eq "all") {
    & node toml.js replace -c .\searcher-settings.json
    & node toml.js replace -c .\searcher-news.json
    & node toml.js replace -c .\searcher-chglog.json
}

& Set-Location ..
& hugo -v

New-BurntToastNotification -Silent -Text "instance.id Build Update:",
'instance.id Site build complete...'