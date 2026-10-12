# One-time setup for GitHub Actions deploy

## 1. Make a deploy key (on your Mac)
    ssh-keygen -t ed25519 -f ~/deploy_key -N "" -C "github-actions-deploy"

## 2. Allow it on the VPS (as the user that owns /var/www/Resume-builder)
    cat ~/deploy_key.pub   # copy this line
    # on the VPS:
    echo "PASTE_PUBLIC_KEY_LINE" >> ~/.ssh/authorized_keys

Test: ssh -i ~/deploy_key USER@VPS_IP "echo ok"

## 3. Add GitHub secrets
Repo -> Settings -> Environments -> New environment "production" -> add secrets
(or Settings -> Secrets and variables -> Actions):
  VPS_HOST   your server IP or hostname
  VPS_USER   the SSH user
  VPS_PORT   (optional) only if not 22
  VPS_SSH_KEY  the full contents of ~/deploy_key (the PRIVATE key)
Then delete ~/deploy_key from the Mac or keep it somewhere safe.

## 4. On the VPS
- pm2, node and git must be on the PATH for a non-interactive SSH login:
    ssh USER@VPS 'which pm2 node git'
  If pm2 is missing, add the PATH export to ~/.bashrc ABOVE the "if not interactive, return" line.
- The VPS clone must be able to `git pull` without a password (it already does).
- client/.env and server/.env live on the VPS. If they are tracked in git, `git pull` can fail
  when they differ. Fix once: add them to .gitignore and run `git rm --cached client/.env server/.env`,
  commit, and keep the VPS copies.

## 5. Optional but recommended
Settings -> Environments -> production -> "Required reviewers" adds a manual approve button before deploy.
