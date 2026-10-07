$git = "$env:USERPROFILE\scoop\shims\git.exe"
& $git init
& $git checkout -b main
& $git config --local user.name 'Deep Sleep'
& $git config --local user.email 'deepsleep@example.com'
& $git add .
& $git commit -m 'Initial commit'
