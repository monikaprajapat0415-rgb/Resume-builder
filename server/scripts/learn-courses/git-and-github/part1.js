import { P, H, L, O, N, C, task, check, faq, n, A, les } from '../kit.js';
import { out } from './files.js';

const S1 = 'Git Basics';

export const lessons = [
  // ---------------------------------------------------------------- 1
  les(S1, 'what-is-git-and-github-install-and-setup', 'What Are Git and GitHub? Install and Set Up Git', 'What Are Git and GitHub? Install and Setup',
    'Understand what version control is, the difference between Git and GitHub, install Git on Windows, macOS or Linux, and set your name, email and default branch.', [
    P("Imagine writing an important document and saving copies named `report_final.docx`, `report_final2.docx` and `report_really_final.docx`. Sooner or later you lose track of which one is the right one, and you cannot see what changed between them. Now imagine a team of five people editing the same set of files. Without a system, they overwrite each other's work. **Version control** solves both problems. It records every change, who made it and why, and lets you go back to any earlier state. **Git** is the most widely used version control tool in the world, and almost every software job expects you to know the basics."),
    H("Git and GitHub are not the same thing"),
    L("**Git** is a program that runs on your own computer. It keeps the history of your project in a hidden folder called `.git`. It works without the internet.", "**GitHub** is a website that stores Git projects online. It lets you back them up, share them, collaborate and show your work. Other services, such as GitLab and Bitbucket, do a similar job. The Git commands you learn work with all of them.", "A simple way to remember it: Git is the tool, GitHub is one place to keep what the tool makes, like a camera and a photo-sharing site."),
    H("Why it matters for your career"),
    P("In software, data and testing jobs, teams use Git every day, and employers often look at a candidate's GitHub page. Even outside software, anyone who works with text files, such as writing, configuration or data, can benefit from a history of changes. No tool can promise a job, but being comfortable with Git removes a barrier that stops many beginners, and a tidy GitHub profile can show your projects to employers."),
    H("Install Git"),
    L("**Windows:** download **Git for Windows** from git-scm.com and run the installer. The default answers are fine. It includes **Git Bash**, a terminal where Git commands work the same as on Mac and Linux. You can also use PowerShell.", "**macOS:** open Terminal and type `git --version`. If Git is missing, macOS offers to install the developer tools. Accept. You can also install a newer Git from git-scm.com.", "**Linux:** use your package manager, for example `sudo apt install git` on Ubuntu or Debian."),
    P("Check that it works. Open a new terminal window and type the command below. The version number on your computer will be different, and that is fine."),
    C('bash', `git --version`),
    C('text', `git version 2.43.0`),
    H("A very short terminal refresher"),
    P("Git is used from the terminal, so you need a few commands. `pwd` shows the folder you are in. `ls` (or `dir` in the Windows command prompt) lists files. `cd folder` moves into a folder, and `cd ..` goes up one level. `mkdir name` makes a folder. You do not need more than this for the whole course. If a command does something you did not expect, check which folder you are in first. Most beginner problems are caused by running a command in the wrong folder."),
    H("Tell Git who you are"),
    P("Every change that Git records has an author. Set your name and email once on your computer. Use the same email you plan to use for GitHub, so that your commits are linked to your account. Be aware that this information becomes part of the history, and is visible if you share the project publicly. GitHub offers a private no-reply email address in its settings if you prefer not to show your real one."),
    C('bash', `git config --global user.name "Asha Verma"
git config --global user.email "asha@example.com"
git config --global init.defaultBranch main`),
    L("`--global` means: use these settings for every project on this computer.", "The third line makes the first branch of every new project be called `main`, which is the name GitHub uses today.", "Replace the sample name and email with your own.", "Check your settings at any time with `git config --list`."),
    N("The sample names, emails and folders in this course are made up. The terminal output you see in the lessons was recorded from real Git runs, but hash codes (the short letters and numbers beside each commit) and dates are different on every computer. That is normal."),
    H("What you will learn"),
    P("This course has ten short lessons. First the Git basics on your own computer: the first repository, saving changes, undoing mistakes, branches and merge conflicts. Then GitHub and teamwork: putting your project online, pull requests and good habits. Last come handy tools and how to use GitHub in your job search. To keep it safe and repeatable, we practise with small invented projects. You can follow along with exactly the same commands."),
    ...task("Install Git and check `git --version`.", "Set your name, email and default branch with `git config --global`.", "Run `git config --list` and find your name and email in the output.", "Make a folder called `git-practice` for the course and open a terminal in it."),
    ...check("`git --version` prints a version number.", "`git config --global user.name` prints your name.", "You can explain in one sentence the difference between Git and GitHub."),
  ], A('Git and GitHub', [
    n('you', 'You', 'edit files', 0, 0, 'user'), n('git', 'Git on your PC', 'keeps the history', 1, 0, 'tool'),
    n('hub', 'GitHub', 'online copy', 2, 0, 'data'), n('team', 'Team', 'share and review', 3, 0, 'app'),
  ], [
    { say: 'You work on files on your own computer.', on: ['you'] },
    { say: 'Git records the history of those changes on your computer. It works without the internet.', flow: ['you>git:save changes'] },
    { say: 'GitHub is a website where you can store a copy of that history online, as a backup and to share.', flow: ['git>hub:push'] },
    { say: 'Teammates can get the project, add their own changes and send them back for review.', flow: ['hub>team:collaborate'] },
  ]), [
    faq('Is Git the same as GitHub?', 'No. Git is the version control tool on your computer. GitHub is a website that hosts Git projects online. GitLab and Bitbucket are similar sites.'),
    faq('Do I need to know programming to learn Git?', 'No. Git works with any files, though it works best with text. Basic comfort with the terminal helps, and the first lesson gives you a short refresher.'),
  ]),

  // ---------------------------------------------------------------- 2
  les(S1, 'your-first-git-repository-init-add-commit', 'Your First Git Repository: init, add, commit and log', 'Your First Git Repository: add and commit',
    'Create a repository, learn the working folder, staging area and history, save changes with add and commit, read status and diff, and use .gitignore.', [
    P("A **repository** (repo) is a project folder that Git is tracking. In this lesson you create one, make your first commits and learn the three places where your changes live. These three places are the key to understanding Git, so we go slowly. Everything below is a real session recorded from Git, and you can type the same commands in an empty folder."),
    H("The three areas"),
    O("**Working folder:** the files you see and edit, as normal.", "**Staging area (the index):** a waiting room. You choose which changes go into the next snapshot with `git add`.", "**Repository (history):** the saved snapshots, called **commits**. `git commit` takes what is in the staging area and stores it permanently."),
    P("Why the middle step? It lets you save a neat, focused commit even if you changed many things. You might fix a typo and add a feature in the same hour, and then commit them separately, so the history is easy to read."),
    H("Create a repository and the first commit"),
    P("Make a folder called `recipes`, go into it, and follow along. We use `git status` very often, because it tells you what is happening and often what to do next."),
    C('text', out('s1')),
    H("What happened, step by step"),
    L("`git init` created the hidden `.git` folder. The folder is now a repository on the branch `main`, with no commits yet.", "After we created `README.md`, `git status` listed it as **untracked**: Git sees the file but is not tracking it.", "`git add README.md` moved it into the staging area. `git status -s` (short form) shows `A` for added.", "`git commit -m \"Add README\"` saved the snapshot with a message. Git printed a short commit code (the hash, such as `8205bb9`), which is different on your computer.", "`git log --oneline` shows the history with one line for each commit, newest first.", "After we edited the file, `git diff` showed exactly what changed: lines starting with `+` were added. The short status shows ` M`, which means modified but not staged.", "`git add -A` stages every change, and the second commit stored it. Use `git add .` for the same effect inside the current folder."),
    N("The commit message in quotes after `-m` is not optional in practice. A good message says what changed and why, in a short line. Lesson 8 is about writing them well."),
    H("Ignoring files with .gitignore"),
    P("Some files should not be in the history: temporary files, logs, passwords and large folders created by tools. List them in a file called `.gitignore`, one pattern per line. In the session, we ignored all `*.log` files and a folder called `notes_private/`. After that, `git status -s` stopped showing `debug.log`. Only `.gitignore` itself appeared as new, and we committed it, so the rule is shared with everyone who clones the project."),
    L("`*.log` matches every file that ends with `.log`.", "`node_modules/` ignores a whole folder (a trailing slash means folder).", "`.env` is a common line for files with secrets. Lesson 8 explains why this matters.", "`.gitignore` only affects files that are **not yet tracked**. If you already committed a file, ignoring it later does not remove it from the history.", "Many examples exist for each language and tool. Search for a ready-made `.gitignore` for the tools you use."),
    H("Reading git status"),
    P("`git status` is your compass. It tells you the branch, which files are untracked, which are changed and which are staged, and it usually suggests the next command. When you are unsure what state your project is in, run it. It changes nothing, and it is always safe."),
    H("Habits that make Git easy"),
    L("**Commit small and often.** Each commit should be one logical change that you can describe in a short sentence.", "**Run `git status` before and after** each command until it feels natural.", "**Check `git diff`** before you add, so you know what you are saving.", "**Do not commit generated files or secrets.**"),
    ...task("Make a folder `recipes`, run `git init`, and create `README.md` with two lines.", "Run `git status`, `git add README.md`, and `git commit -m \"Add README\"`.", "Edit the README, run `git diff` to see the change, then add and commit again.", "Create a `.gitignore` that ignores `*.log`, create a file `debug.log`, and check that `git status -s` does not show it.", "Run `git log --oneline` and count your commits."),
    ...check("`git log --oneline` shows at least three commits, newest first.", "`git status` says `nothing to commit, working tree clean` after your last commit.", "`debug.log` never shows up in `git status`."),
  ], A('Three areas of Git', [
    n('work', 'Working folder', 'you edit files', 0, 0, 'user'), n('stage', 'Staging area', 'git add', 1, 0, 'check'),
    n('repo', 'Repository', 'git commit', 2, 0, 'data'), n('log', 'History', 'git log', 3, 0, 'out'),
  ], [
    { say: 'You edit files in your working folder, as you always do.', on: ['work'] },
    { say: 'git add moves the changes you choose into the staging area, a waiting room for the next snapshot.', flow: ['work>stage:git add'] },
    { say: 'git commit stores the staged changes as a permanent snapshot, with a message, in the repository.', flow: ['stage>repo:git commit'] },
    { say: 'git log shows the history of snapshots, newest first.', flow: ['repo>log:git log'] },
  ]), [
    faq('What is the staging area for?', 'It lets you choose exactly which changes go into the next commit, so each commit can be small and focused even if you changed many things.'),
    faq('Why is my file not showing up in git status after I added it to .gitignore?', 'That is the purpose of .gitignore. The file is hidden from Git. If it still appears, it was already tracked before, and you must remove it from tracking with git rm --cached.'),
  ]),

  // ---------------------------------------------------------------- 3
  les(S1, 'undo-mistakes-restore-amend-revert', 'Undo Mistakes in Git: restore, amend and revert', 'Undo Mistakes in Git: restore and revert',
    'Learn safe ways to undo in Git: discard changes with restore, unstage files, fix the last commit with amend and undo shared commits with revert.', [
    P("Everyone makes mistakes: a wrong edit, a file added by accident, a typo in a commit message. The comfort of Git is that you can undo most mistakes, as long as you know which tool fits which situation. This lesson covers the common cases, from the safest to the most careful. You will practise each in a small project, and the session below is a real one."),
    C('text', out('s2')),
    H("1. Discard changes you have not staged: git restore"),
    P("We added `soup` to `menu.txt` but changed our mind. `git restore menu.txt` replaced the file with the version from the last commit, and `cat menu.txt` shows only `tea` and `coffee` again. **Warning:** this throws away your edit for good, because Git never saved it. Use it only when you are sure."),
    H("2. Unstage a file: git restore --staged"),
    P("We staged the file with `git add` and then realised it should not be in this commit. `git restore --staged menu.txt` moves it out of the staging area, but keeps your edit in the working folder. The status goes back from staged to ` M` (modified). Nothing is lost."),
    H("3. Fix the last commit: git commit --amend"),
    P("We committed with the message `Add jus` and noticed the typo. `git commit --amend -m \"Add juice\"` replaced the last commit with a corrected one. You can also use `--amend` to add a forgotten file: stage it, then run `git commit --amend`. Notice that the commit code changed from `0b5d67b` to `19ae32e`. Amend creates a **new** commit that replaces the old one."),
    N("Only amend a commit that you have **not pushed** to a shared place such as GitHub. Changing a commit that others already have causes confusion and trouble for the team."),
    H("4. Undo a commit safely: git revert"),
    P("Suppose the `juice` commit was a mistake, and it is already shared. `git revert HEAD` makes a **new** commit that does the opposite of the last one. Look at the log: the old commit is still there, followed by `Revert \"Add juice\"`, and the menu no longer has juice. The history stays honest, and nobody's copy breaks. Revert is the safe choice for anything that is already published. `HEAD` means the latest commit. You can also revert an older commit by giving its code, such as `git revert 682019c`."),
    H("The dangerous commands"),
    L("**`git reset --hard`** moves your branch and throws away all uncommitted changes. It can destroy work. Never use it unless you understand exactly what it will remove.", "**`git push --force`** overwrites the history on the remote. It can delete other people's work. Avoid it on shared branches. If you must use it on your own branch, prefer `--force-with-lease`, which stops if somebody else pushed meanwhile.", "**`git clean -fd`** deletes untracked files. They are not in Git, so they cannot be recovered.", "Before you try something risky, make a safety copy of your work, or create a new branch (lesson 4) so you can return to it."),
    H("A safety net: the reflog"),
    P("Even after a bad reset, Git keeps a private log of where your branch was, called the **reflog**. `git reflog` lists recent positions, each with a code that you can go back to. It is a lifesaver for commits, but it cannot bring back uncommitted changes, and it is only kept for a limited time. Do not rely on it, but know that it exists."),
    H("Choosing the right tool"),
    L("Edited a file and want the old version back: `git restore file`.", "Staged something by mistake: `git restore --staged file`.", "Wrong message or forgot a file in the last commit, not pushed yet: `git commit --amend`.", "A bad commit that others may have: `git revert <commit>`.", "Not sure: run `git status` and read what Git suggests."),
    P("A note on the lines you see in the output: Git also prints a `Date:` line for `--amend` and `revert`. We left it out to keep the session short."),
    ...task("Create a project with a file and one commit. Edit the file, then use `git restore` to throw the edit away.", "Edit again, stage with `git add`, and then unstage with `git restore --staged`.", "Make a commit with a typo in the message, and fix it with `git commit --amend -m`.", "Make a commit, then undo it with `git revert HEAD`. Look at `git log --oneline`."),
    ...check("After restore, the file has its old content.", "After `git revert`, your log shows both the original commit and the revert commit.", "You can say why revert is safer than reset for shared work."),
  ], A('Choosing an undo', [
    n('edit', 'Edit not staged', 'git restore', 0, 0, 'user'), n('staged', 'Staged', 'git restore --staged', 1, 0, 'check'),
    n('last', 'Last commit', 'git commit --amend', 2, 0, 'tool'), n('old', 'Shared commit', 'git revert', 3, 0, 'app'),
  ], [
    { say: 'Different mistakes need different tools. For an edit you have not staged, git restore brings back the committed version.', on: ['edit'] },
    { say: 'If you staged something by mistake, git restore --staged takes it out of the staging area and keeps your edit.', flow: ['edit>staged:next stage'] },
    { say: 'If the last commit has a typo or misses a file, git commit --amend replaces it, as long as it is not pushed.', flow: ['staged>last:next stage'] },
    { say: 'For a commit that is already shared, git revert adds a new commit that undoes it, and it keeps the history honest.', flow: ['last>old:next stage'] },
  ]), [
    faq('What is the difference between git revert and git reset?', 'Revert adds a new commit that undoes an earlier one, which is safe for shared history. Reset moves the branch back and can discard work, so it is risky on shared branches.'),
    faq('Can I recover a commit after a bad reset?', 'Often yes, with git reflog, which lists recent positions of your branch. It cannot recover changes that were never committed.'),
  ]),

  // ---------------------------------------------------------------- 4
  les(S1, 'git-branches-and-merging', 'Git Branches and Merging: Work on Ideas Safely', 'Git Branches and Merging for Beginners',
    'Learn what a branch is, create and switch branches, merge your work back with fast-forward and merge commits, read the graph and delete finished branches.', [
    P("A **branch** is a separate line of work. You make one when you want to try a new feature or fix a bug without touching the stable version. If the idea works, you **merge** it back. If it does not, you throw the branch away, and nothing else is harmed. Branches are cheap in Git: creating one takes a moment, so professionals use them for almost everything. This lesson uses a tiny website project and a real recorded session."),
    C('text', out('s3')),
    H("Understanding branches"),
    P("A branch is just a movable label that points to a commit. The branch you are on is the one that moves forward when you commit. A special pointer called `HEAD` shows which branch you are currently on. When you switch branches, Git changes the files in your folder to match that branch, so `contact.txt` was missing on `main` before the merge and appeared after it."),
    H("The commands"),
    L("`git branch` lists branches, and the `*` marks the current one.", "`git switch -c contact-page` creates the branch `contact-page` and moves to it. Older tutorials use `git checkout -b`, which does the same job.", "`git switch main` moves back to `main`.", "`git merge contact-page` brings the work of that branch into the one you are on. Always switch to the branch that should **receive** the changes first.", "`git branch -d contact-page` deletes a branch that is already merged. Git refuses if it is not merged, to protect your work."),
    H("Two kinds of merge"),
    P("In the first merge, `main` had not changed since we created `contact-page`, so Git simply moved the `main` label forward. The output says **Fast-forward**. There is no extra commit, and the history stays a straight line."),
    P("In the second case, both `main` and `about-page` had new commits. Git combined them with a new **merge commit**, and said `Merge made by the 'ort' strategy`. The graph makes this visible."),
    C('text', `*   8c59a4f Merge branch 'about-page'
|\\  
| * 38e1b3d Add about page
* | f1b5255 Add welcome line
|/  
* c102ae8 Add contact page
* ec7feed Add home page`),
    P("Read the graph from the bottom up. Two lines run in parallel, and then join at the merge commit on top. `git log --oneline --graph --all` gives you this picture, and it is a great way to understand where you are."),
    H("A good branch workflow"),
    O("Start from an up-to-date `main`.", "Create a branch with a clear name, such as `fix-login-typo` or `add-contact-page`.", "Commit your work on the branch in small steps.", "Switch back to `main` and merge the branch, or open a pull request on GitHub (lesson 7).", "Delete the branch when it is merged."),
    H("Before you switch branches"),
    P("If you have uncommitted changes, Git may refuse to switch, or it may carry them along. The cleanest habit is to commit, or to put the work aside with `git stash` (lesson 9), before switching. Run `git status` first. It takes two seconds and avoids a lot of confusion."),
    H("Naming branches"),
    L("Use lowercase words with hyphens: `add-search-box`.", "Describe the purpose, and not yourself: `fix-footer-link` is better than `asha-work`.", "Many teams add a prefix such as `feature/` or `fix/`. Follow your team's rule.", "Keep `main` for stable work that others can rely on."),
    N("Merging can cause conflicts when both branches changed the same lines. That is not an error. It is Git asking you to decide. The next lesson shows how."),
    ...task("Create a practice repo with a file and one commit. Create a branch `feature-one`, add a file and commit it.", "Switch back to `main` and check that the new file is not there. Merge the branch. Is it a fast-forward?", "Create a second branch, commit on it. Then switch to `main`, make a different commit, and merge the second branch to see a merge commit.", "Run `git log --oneline --graph --all` and draw the result on paper."),
    ...check("The new file is missing on `main` before the merge and present after it.", "Your graph shows two lines joining in a merge commit for the second branch.", "`git branch` lists only `main` after you delete the merged branches."),
  ], A('A branch and a merge', [
    n('main', 'main', 'stable line', 0, 0, 'data'), n('branch', 'feature branch', 'try an idea', 1, 0, 'tool'),
    n('commits', 'Commits on branch', 'small steps', 2, 0, 'app'), n('merge', 'Merge to main', 'bring it back', 3, 0, 'out'),
  ], [
    { say: 'The main branch holds the stable version of the project.', on: ['main'] },
    { say: 'You create a new branch to try an idea without touching main.', flow: ['main>branch:git switch -c'] },
    { say: 'You commit your work on the branch in small steps. Main stays unchanged.', flow: ['branch>commits:commit'] },
    { say: 'When the idea works, you merge the branch into main. If it fails, you simply delete the branch.', flow: ['commits>merge:git merge'] },
  ]), [
    faq('What is a fast-forward merge?', 'When the target branch has no new commits, Git just moves its label forward to the other branch. No extra merge commit is made.'),
    faq('Is it safe to delete a branch after merging?', 'Yes. The commits are now part of the target branch. Git also refuses to delete an unmerged branch with -d, so you cannot lose work by accident.'),
  ]),

  // ---------------------------------------------------------------- 5
  les(S1, 'resolve-git-merge-conflicts', 'Resolve Git Merge Conflicts Step by Step', 'Resolve Git Merge Conflicts Step by Step',
    'Learn why merge conflicts happen, read the conflict markers, decide what to keep, finish the merge and avoid conflicts. A calm real session.', [
    P("Almost every beginner is afraid of the first **merge conflict**. It is not a disaster. It simply means: two people (or two branches) changed the same lines in different ways, and Git cannot know which version you want. It stops and asks you to decide. Once you have done it two or three times, it becomes a routine job. This lesson walks through one calmly."),
    H("The situation"),
    P("A price file says `Tea: 20`. On the branch `update-tea`, someone changed it to 25. Meanwhile on `main`, someone changed it to 22. Both changes are on the same line, so Git cannot combine them automatically. Here is the real session."),
    C('text', out('s4')),
    H("Reading what Git tells you"),
    L("`CONFLICT (content): Merge conflict in price.txt` names the file with the problem. Other files merged fine.", "`git status -s` shows `UU` for the file: unmerged on both sides.", "Git changed the file itself and added **markers**: the lines between `<<<<<<< HEAD` and `=======` are your current branch's version (main: 22). The lines between `=======` and `>>>>>>> update-tea` are the other branch's version (25).", "The line `Coffee: 30` was not marked, because both sides agree about it."),
    H("How to resolve it"),
    O("**Open the file** in your editor and find the markers.", "**Decide** what the final text should be. You can keep one side, the other, or write something new. We agreed on a price of 24.", "**Delete all three marker lines** (`<<<<<<<`, `=======`, `>>>>>>>`) and leave only the final text. The file must look like normal text again.", "**Save**, then `git add price.txt` to tell Git the file is resolved.", "**Finish** with `git commit --no-edit`, which uses the default merge message. In the log graph, you can see the two lines joining at the merge commit."),
    N("Never commit a file that still contains conflict markers. Search the project for `<<<<<<<` before you commit. Many editors, such as VS Code, show the conflict with buttons such as Accept Current, Accept Incoming and Accept Both, and these are simply doing the editing for you."),
    H("Changed your mind? Abort"),
    P("If you start a merge and feel lost, run `git merge --abort`. Git puts everything back as it was before the merge. There is no shame in a fresh start, and it is much better than guessing."),
    H("How to have fewer conflicts"),
    L("Pull the latest changes often, so your branch does not drift far from `main`.", "Keep branches short-lived. A branch that lives for weeks collects conflicts.", "Make small commits and small pull requests.", "Talk to your team: two people changing the same file at the same moment is a signal to coordinate.", "Do not reformat whole files, for example by changing indentation everywhere, because the diff touches every line and creates conflicts for others."),
    H("Conflicts are about people, not only code"),
    P("The tool shows the clash, but the answer is often a decision. Which price is right? Which wording should stay? If you are not sure, ask the person who made the other change. Do not simply pick one side to make the conflict go away, because you could lose someone's work."),
    ...task("Create a project with `price.txt` containing `Tea: 20`. Make two branches that change that line differently and commit on each.", "Merge one into the other and see the conflict. Run `git status` and open the file.", "Resolve it by writing a final value, remove the markers, add and commit.", "Repeat, but this time run `git merge --abort` and check that everything returned to its state before the merge."),
    ...check("The final file has no `<<<<<<<`, `=======` or `>>>>>>>` lines.", "`git status` says the working tree is clean after the merge commit.", "After `git merge --abort`, the file contents are what they were before the merge."),
  ], A('A merge conflict', [
    n('a', 'main: Tea 22', 'one change', 1, 0, 'data'), n('b', 'update-tea: 25', 'another change', 1, 1, 'data'),
    n('git', 'git merge', 'cannot choose', 2, 0, 'check'), n('you', 'You decide', 'edit, add, commit', 3, 0, 'user'),
  ], [
    { say: 'Two branches changed the same line in different ways: one made the price 22, the other 25.', on: ['a', 'b'] },
    { say: 'When you merge, Git cannot decide which one is right.', flow: ['b>git:merge'] },
    { say: 'Git stops and marks the file with conflict markers that show both versions.', flow: ['a>git:merge'] },
    { say: 'You choose the final text, remove the markers, run git add, and commit to complete the merge.', flow: ['git>you:resolve'] },
  ]), [
    faq('Why do merge conflicts happen?', 'Two branches changed the same lines in different ways, or one deleted what the other changed. Git cannot decide which to keep, so it asks you.'),
    faq('How do I cancel a merge in the middle of a conflict?', 'Run git merge --abort. Git returns your files to the state they had before you started the merge.'),
  ]),
];
