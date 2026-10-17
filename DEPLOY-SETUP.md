# Prime Resume AI: GitHub Actions deploy setup (one time)

Only two values are yours to fill in: VPS_IP and VPS_USER (the user you SSH in with today).

## 1. Create the deploy key (on your Mac, any folder)
    ssh-keygen -t ed25519 -f ~/.ssh/primeresumeai_deploy -N "" -C "primeresumeai-github-actions"

This makes two files:
  ~/.ssh/primeresumeai_deploy       private key -> goes into the GitHub secret
  ~/.ssh/primeresumeai_deploy.pub   public key  -> goes on the VPS

## 2. Put the public key on the VPS
    ssh-copy-id -i ~/.ssh/primeresumeai_deploy.pub VPS_USER@VPS_IP
    ssh -i ~/.ssh/primeresumeai_deploy VPS_USER@VPS_IP "echo connected"

## 3. Check the VPS tools work over a non-interactive SSH login
    ssh -i ~/.ssh/primeresumeai_deploy VPS_USER@VPS_IP 'cd /var/www/Resume-builder && which git node npm pm2 && pm2 list'
You should see project-backend in the list. If "pm2: command not found", add your node PATH
export line to the TOP of ~/.bashrc on the VPS, above the "if not interactive, return" line.

## 4. Add the GitHub secrets
GitHub repo -> Settings -> Environments -> New environment "production" -> Add secret:
  VPS_HOST     VPS_IP (or api.primeresumeai.com if it points to the same server over SSH)
  VPS_USER     VPS_USER
  VPS_SSH_KEY  output of:  cat ~/.ssh/primeresumeai_deploy   (the whole file, BEGIN to END lines)
  VPS_PORT     only if SSH is not on port 22

macOS shortcut to copy the private key:  pbcopy < ~/.ssh/primeresumeai_deploy

## 5. Stop tracking the .env files (needed so git pull on the VPS never fails)
On your Mac, in the repo root:
    printf "\nclient/.env\nserver/.env\n" >> .gitignore
    git rm --cached client/.env server/.env
    git commit -m "Stop tracking .env files"
Do this BEFORE the first deploy and keep the .env files that already exist on the VPS.
Then rotate the keys that were ever committed (Gemini, SendGrid, ImageKit, JWT, DB).

## 6. First deploy
Commit .github/workflows/deploy.yml, push to main, and watch GitHub -> Actions.
Paths used by the workflow: /var/www/Resume-builder, pm2 app "project-backend", port 3000.

## 7. Optional safety
Settings -> Environments -> production -> Required reviewers adds an Approve button before each deploy.
