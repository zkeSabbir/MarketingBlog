$git = "$env:USERPROFILE\scoop\shims\git.exe"
& $git reset --soft origin/main
& $git rm --cached *.ps1
& $git add .
& $git commit -m "Fix UI and add Netlify config"
& $git -c credential.helper= push -f
