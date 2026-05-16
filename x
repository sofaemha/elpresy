#!/bin/bash

msys_pause() {
  if [ $pause = true ]; then
    read -p "Press any key to continue... (or CTRL+C to exit)" -n1 -s
  fi
}

msys_alert() {
  eval $clear
  if [ $alert = true ]; then
    echo "\nOS type lightweight shell and GNU utilities compiled for Windows (part of MinGW)"
    msys_pause
    echo -e '\033[2J\033[u'
  fi
}

msys_variable() {
  # System
  info="[\033[0;34mINFO\033[0m]"
  process="[\033[0;32mPROCESS\033[0m]"
  warning="[\033[0;33mWARNING\033[0m]"
  danger="[\033[0;31mDANGER\033[0m]"
  error="[\033[0;31mERROR\033[0m]"

  # Other
  alert="false"
  pause="true"
  gitbash="C:\Program Files\Git\git-bash.exe"
  localhost="http://localhost:3000/"
  if ! [ -x "$(command -v clear)" ]; then
    clear="cls"
  else
    clear="clear"
  fi
}

msys_helper() {
  eval $clear
  echo -e "\nShortcut custom command for project development.\n"
  echo -e "Usage: sh x [options] [?github:options]\n"
  echo -e "Options:\n"
  echo -e "   -h, --help \t\t Provides help information for Windows commands"
  echo -e "   -r, --run \t\t Running localhost in default browser"
  echo -e "   -b, --bash \t\t Running Git Bash in current directory"
  echo -e "   -gh, --github \t GitHub repository commands"
  echo -e "   [gh] | -r, --reset \t Reset gitHub repository HEAD origin"
  echo -e "   [gh] | -i, --init \t GitHub repository initialization"
  echo -e "   [gh] | -p, --push \t Update github repository with current local project"
  echo -e "\nThis custom command was tested using \033[0;32mGit Bash\033[0m"
  echo -e "For more details please see the [\033[0;33m\README.md\033[0m] file"
}

msys_gitbash() {
  echo -e "\n$process: Opening Git Bash in current directory"
  start "" "$gitbash"
}

msys_run() {
  echo -e "\n$process: Running \`$localhost\` in default browser"
  explorer $localhost
  echo -e "$info: Consider refreshing the page if no content appears"
  echo -e "$process: Executing \`npm run dev\`"
  npm run dev
}

msys_github_reset() {
  echo -e "\n$warning: This feature will change HEAD origin to the latest preferred branch"
  msys_pause
  echo -e "\n\nGitHub repository branch :"
  read branch
  echo -e "\n$danger: Are you sure you want to change HEAD into [\033[0;36m$branch\033[0m] branch?"
  msys_pause
  echo -e "\n\n$process: Executing \`git reset --hard origin/$branch\`"
  msys_pause
  git reset --hard origin/$branch
  echo -e "\n\n$info: Successfully reseting your HEAD origin to [\033[0;36m$branch\033[0m]"
}

msys_github_init() {
  echo -e "\n$info: This feature will initialize your project"
  echo -e "\nGitHub repository name :"
  read repo
  if [ -z "$repo" ]; then
    echo -e "\n$error: GitHub repository name cannot be empty"
  else
    echo -e "\nGitHub branch name :"
    read branch
    if [ -z "$branch" ]; then
      echo -e "\n$error: GitHub branch name cannot be empty"
    else
      echo -e "\n$process: Executing \`git init | branch -M | remote add origin\`"
      msys_pause
      git init
      echo -e "\n\n$info: Successfully initialized github repository"
      git branch -M "$branch"
      echo -e "$info: Successfully changed the main repository branch"
      git remote add origin "git@github.com:$repo/$branch.git"
      echo -e "$info: Successfully added remote origin for \`$repo/$branch\`"
    fi
  fi
}

msys_github_push() {
  echo -e "\n$warning: This feature will push your local project to github (not synced)"
  echo -e "\nGitHub commit message :"
  read message
  if [ -z "$message" ]; then
    echo -e "\n$error: GitHub commit message cannot be empty"
  else
    echo -e "\nGitHub branch name :"
    read branch
    if [ -z "$branch" ]; then
      echo -e "\n$error: GitHub branch name cannot be empty"
    else
      echo -e "\n$process: Executing \`git add | commit -m | branch -M | push -u origin\`"
      msys_pause
      git add *
      echo -e "\n\n$info: Successfully added new local files"
      git commit -m "$message"
      echo -e "$info: Successfully committed previously added files"
      git branch -M "$branch"
      echo -e "$info: Successfully changed the main repository branch"
      git push -u origin "$branch"
      echo -e "$info: Successfully pushed local project to github repository"
    fi
  fi
}

if [[ "$OSTYPE" == "linux-gnu" ]]; then
  echo "Currently not supported on Linux GNU"
elif [[ "$OSTYPE" == "darwin" ]]; then
  echo "Currently not supported on Mac OSX"
elif [[ "$OSTYPE" == "cygwin" ]]; then
  echo "Currently not supported on POSIX"
elif [[ "$OSTYPE" == "msys" ]]; then
  msys_variable
  while [ True ]; do
    if [ "$1" = "--help" -o "$1" = "-h" ]; then
      msys_helper
      break
    elif [ "$1" = "--bash" -o "$1" = "-b" ]; then
      msys_alert
      msys_gitbash
      break
    elif [ "$1" = "--run" -o "$1" = "-r" ]; then
      msys_alert
      msys_run
      break
    elif [ "$1" = "--github" -o "$1" = "-gh" ]; then
      msys_alert
      eval $clear
      if [ "$2" = "--reset" -o "$2" = "-r" ]; then
        msys_github_reset
      elif [ "$2" = "--init" -o "$2" = "-i" ]; then
        msys_github_init
      elif [ "$2" = "--push" -o "$2" = "-p" ]; then
        msys_github_push
      else
        echo -e "\n$error: Argument not found"
      fi
      break
    else
      echo -e "\n$error: Argument not found"
      break
    fi
  done
elif [[ "$OSTYPE" == "win32" ]]; then
  echo "I'm not sure this can happen... so currently not supported"
elif [[ "$OSTYPE" == "freebsd" ]]; then
  echo "Currently not supported on FreeBSD"
else
  echo "Does not recognize the Operating System"
fi