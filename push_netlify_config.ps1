$git = "$env:USERPROFILE\scoop\shims\git.exe"
& $git add netlify.toml
& $git commit -m "Add Netlify config to auto-fix build settings"
& $git -c credential.helper= push
