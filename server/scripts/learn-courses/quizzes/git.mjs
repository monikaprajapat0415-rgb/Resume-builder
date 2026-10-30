const Q = (q, options, answer, explain = '') => ({ q, options, answer, explain });
export const course = 'git-and-github-course';
export const quizzes = {
  'what-is-git-and-github-install-and-setup': [
    Q('What is the difference between Git and GitHub?', ['Git is a tool on your computer; GitHub is a website that stores Git projects online', 'They are the same thing', 'GitHub is a tool on your computer; Git is a website'], 0),
    Q('Why does Git ask for your name and email?', ['Every recorded change has an author', 'To log in to GitHub', 'To install updates'], 0),
    Q('Which command checks that Git is installed?', ['git --version', 'git install', 'git start'], 0),
  ],
  'your-first-git-repository-init-add-commit': [
    Q('What does git add do?', ['Moves changes into the staging area for the next commit', 'Saves the snapshot to history', 'Uploads to GitHub'], 0),
    Q('What does git commit do?', ['Saves what is in the staging area as a snapshot in history', 'Deletes the working folder', 'Shows the status'], 0),
    Q('Which command tells you what is happening and often what to do next?', ['git status', 'git init', 'git log'], 0),
  ],
  'undo-mistakes-restore-amend-revert': [
    Q('git restore menu.txt (with a file you have not staged) will…', ['Throw away your unsaved edit for good', 'Stage the file', 'Make a backup'], 0, 'Git never saved the edit, so it cannot bring it back.'),
    Q('Which command undoes a commit that is already shared, without changing history?', ['git revert', 'git reset --hard', 'git push --force'], 0, 'revert adds a new commit that does the opposite.'),
    Q('When should you only use git commit --amend?', ['On a commit you have not pushed to a shared place', 'Only on pushed commits', 'Never'], 0),
  ],
  'git-branches-and-merging': [
    Q('What is a branch?', ['A movable label that points to a commit', 'A copy of the whole computer', 'A GitHub account'], 0),
    Q('Which command creates a branch and moves to it?', ['git switch -c contact-page', 'git merge contact-page', 'git branch -d contact-page'], 0),
    Q('What does a Fast-forward merge mean?', ['main had not changed, so Git just moved the label forward with no merge commit', 'Git found a conflict', 'The merge failed'], 0),
  ],
  'resolve-git-merge-conflicts': [
    Q('What is a merge conflict?', ['Two branches changed the same lines differently and Git cannot choose', 'A broken computer', 'A missing branch'], 0),
    Q('Before committing a resolved file, what must you remove?', ['The marker lines <<<<<<<, ======= and >>>>>>>', 'All the text', 'The file name'], 0, 'Never commit a file that still contains conflict markers.'),
    Q('You feel lost in the middle of a merge. What is the safe way out?', ['git merge --abort', 'Delete the repository', 'git push --force'], 0),
  ],
  'github-remotes-push-pull-and-clone': [
    Q('What is a remote?', ['Another copy of your repository somewhere else, usually on GitHub', 'A kind of branch', 'A type of commit'], 0),
    Q('What does git clone do?', ['Makes a full copy of a repository, with its history, in a new folder', 'Deletes the repository', 'Only downloads one file'], 0),
    Q('What does the -u in git push -u origin main do?', ['Links your local main to origin/main so later push and pull know where to go', 'Uploads faster', 'Undoes the push'], 0),
  ],
  'pull-requests-forks-and-code-review': [
    Q('What is a pull request?', ['A request for others to review your branch and, if good, merge it', 'A command to download files', 'A kind of backup'], 0),
    Q('What makes a pull request easier to review?', ['Small size and a clear description', 'Changing many unrelated things at once', 'No description'], 0),
    Q('How should you take review comments?', ['As help with the code, not criticism of you', 'As attacks', 'You should ignore them'], 0),
  ],
  'good-commits-gitignore-and-keeping-secrets-safe': [
    Q('Which commit message is most helpful?', ['Add search box to the header', 'stuff', 'fix'], 0),
    Q('What does one commit = one idea mean?', ['A typo fix and a new feature belong in two commits', 'Commit once a month', 'Use only one commit per project'], 0),
    Q('What goes in a .gitignore file?', ['Files and folders Git should not track, such as secrets and build output', 'Your commit messages', 'Your password list'], 0),
  ],
  'stash-tags-and-exploring-history': [
    Q('What does git stash do?', ['Puts uncommitted changes aside so you can get a clean folder', 'Uploads your changes to GitHub', 'Deletes the repository'], 0),
    Q('Is a stash pushed to GitHub?', ['No, it lives on your computer only', 'Yes, always', 'Only on Mondays'], 0, 'So do not use it as a backup.'),
    Q('What is a tag used for?', ['A permanent label on a commit, such as a release v1.0', 'A temporary branch', 'A type of merge'], 0),
  ],
  'git-and-github-for-your-job-search-and-cheat-sheet': [
    Q('Which is better on your GitHub profile?', ['Three or four finished projects with a clear README', 'Thirty empty repositories', 'Only forks of other people\'s work'], 0),
    Q('What must never go in a public repository?', ['Secrets, personal data or an employer\'s confidential code', 'A README', 'A screenshot of your own project'], 0),
    Q('Which kind of site can GitHub Pages host for free, according to the lesson?', ['A static site made of HTML, CSS and JavaScript files', 'A database server', 'A mobile app store listing'], 0),
  ],
};
