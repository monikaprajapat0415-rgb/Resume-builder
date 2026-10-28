import { P, H, L, O, N, C, task, check, faq, n, A, les } from '../kit.js';
import { out } from './files.js';

const S2 = 'GitHub and Teamwork';
const S3 = 'Tools and Next Steps';

export const lessons = [
  // ---------------------------------------------------------------- 6
  les(S2, 'github-remotes-push-pull-and-clone', 'Put Your Project on GitHub: Remotes, push, pull and clone', 'Git Remotes: push, pull and clone to GitHub',
    'Create a GitHub account and repository, connect it with git remote, push, clone and pull, sign in safely with SSH or a token, and fix a rejected push.', [
    P("Until now, your history lived only on your computer. If the laptop is lost, the work is lost, and nobody else can see or use it. A **remote** is another copy of your repository that lives somewhere else, usually on GitHub. You send your commits to it with `git push`, and you fetch other people's commits with `git pull`. In this lesson you connect your project to GitHub and learn the daily rhythm of pull, work, commit and push."),
    H("Create your GitHub account and a repository"),
    O("Go to github.com and sign up for a free account. Choose a sensible username, because it appears in your profile address, and it can be seen by employers. Turn on two-step login in your security settings.", "Click the button to create a **new repository**. Give it a name, such as `recipes`, and choose **Public** (anyone can see it) or **Private** (only people you invite).", "If you already have a project on your computer, do **not** tick the options to add a README, a `.gitignore` or a licence. An empty remote is easiest to connect to an existing project. If you do add them, you must first pull them (see the end of this lesson).", "GitHub then shows a page with the address of the repository, which is called the **remote URL**, and a few commands to copy."),
    N("Menus and button names on GitHub change from time to time. The ideas, a repository, a remote URL and a push, stay the same. If a screen looks different from our description, look for the same idea, or open GitHub's own help pages."),
    H("Connect and push"),
    P("In your project folder, add the remote and push. The name `origin` is the usual nickname for the main remote. Replace the address with the one GitHub shows you. It looks like `https://github.com/yourname/recipes.git`."),
    C('bash', `git remote add origin https://github.com/yourname/recipes.git
git push -u origin main`),
    P("The `-u` option links your local `main` with `origin/main`, so from then on a plain `git push` and `git pull` know where to go. After this, refresh the GitHub page, and your files and commits are there. In the next session, we used a folder on the same computer as the \"remote\", in place of the website, because the commands are exactly the same. The only difference is the address."),
    C('text', out('s5')),
    H("What happened"),
    L("`git remote -v` lists your remotes. `push -u` sent the commits and set up tracking, and `git status` now says the branch is up to date with `origin/main`.", "`git clone` makes a full copy of a repository, with its whole history, into a new folder. It also sets `origin` for you. Use it when you join a project that already exists.", "A friend pushed a change first. When we ran `git push`, Git **rejected** it: the remote has work that we do not have. This is very common in teams, and it is not an error to fear. Git protects the other person's work.", "The fix is `git pull`, which fetches the new commits and merges them into your branch. Here the changes did not clash, so Git merged them automatically. Then `git push` worked.", "The graph shows the two lines of work joined by a merge commit."),
    H("fetch and pull"),
    P("`git pull` is really two steps in one: `git fetch` downloads the new commits and updates the `origin/main` label, and then a merge brings them into your branch. If you want to look first before changing your own files, run `git fetch` and then `git log origin/main` or `git diff main origin/main`. Many people also set `git config --global pull.rebase false` so that pull always merges, or learn rebase later when they are comfortable."),
    H("Signing in safely"),
    P("When you push to GitHub, it must know that you are allowed to. GitHub does not accept your account password for Git commands over HTTPS. You have these options. Check GitHub's current help pages for the exact steps, because they change."),
    L("**Git Credential Manager** (included with Git for Windows and available for macOS and Linux): when you first push, a browser window opens, you sign in, and it remembers you. This is the easiest option on a personal computer.", "**A personal access token:** a long generated text that you use in place of a password. Give it the smallest permissions and an expiry date, and treat it like a password.", "**SSH keys:** you create a pair of keys with `ssh-keygen -t ed25519 -C \"your email\"`, add the **public** key (the file that ends with `.pub`) to your GitHub settings, and use the SSH address of the repository, which starts with `git@github.com:`. Never share the private key file.", "**GitHub CLI** (`gh auth login`) is a separate tool that handles sign-in and many GitHub tasks from the terminal."),
    N("Never put a token or password into a file in your project, and never paste one into a chat or a public post. If you do, delete the token on GitHub straight away and create a new one."),
    H("A healthy daily rhythm"),
    O("Start the day with `git pull`, so you have everyone's latest work.", "Create a branch for your task (lesson 4).", "Commit small steps.", "Before you push, `git pull` again if others may have pushed.", "Push your branch, and open a pull request (lesson 7)."),
    H("If GitHub already has files that you do not have"),
    P("Suppose you created the repository on GitHub **with** a README and then tried to push an existing project. Git rejects the push, because the two histories have nothing in common. Run `git pull origin main --allow-unrelated-histories`, resolve any conflicts and push. You can avoid the problem by creating an empty repository, or by cloning the one with the README and adding your files to it."),
    ...task("Create a free GitHub account, with two-step login, and a new empty repository.", "Connect your `recipes` project with `git remote add origin` and push with `git push -u origin main`. Refresh the page and see your files.", "Clone your repository to a second folder, change a file there and push. Then pull in the first folder.", "Run `git remote -v`, `git status` and `git log --oneline --graph` and explain each line."),
    ...check("Your files and commits appear on the GitHub page.", "A change pushed from the second folder appears in the first after `git pull`.", "You can explain why a push can be rejected and how you fix it."),
  ], A('Local and remote', [
    n('local', 'Your repository', 'on your computer', 0, 0, 'user'), n('push', 'git push', 'send commits', 1, 0, 'tool'),
    n('remote', 'GitHub (origin)', 'shared copy', 2, 0, 'data'), n('pull', 'git pull', 'get new commits', 3, 0, 'app'),
  ], [
    { say: 'Your repository lives on your computer with all your commits.', on: ['local'] },
    { say: 'git push sends your new commits to the remote, which is usually named origin.', flow: ['local>push:commits'] },
    { say: 'The remote on GitHub now holds a shared copy that teammates and tools can reach.', flow: ['push>remote:upload'] },
    { say: 'When someone else pushes, you run git pull to download and merge their commits into your copy.', flow: ['remote>pull:download'] },
  ]), [
    faq('Why was my push rejected?', 'The remote has commits that you do not have locally, usually from someone else. Run git pull to bring them in, resolve any conflicts, then push again.'),
    faq('What is the difference between clone and pull?', 'Clone makes a new full copy of a repository. Pull updates a copy you already have with the newest commits from the remote.'),
  ]),

  // ---------------------------------------------------------------- 7
  les(S2, 'pull-requests-forks-and-code-review', 'Pull Requests, Forks and Code Review on GitHub', 'GitHub Pull Requests, Forks and Code Review',
    'Learn the pull request workflow used by teams and open source: branch, push, open a pull request, review, merge, fork a project and keep your fork up to date.', [
    P("A **pull request** (PR) is a way to say to your team: *I have finished some work on a branch. Please look at it, and if it is good, merge it into the main branch.* It is the central habit of working on GitHub. A pull request is a conversation around a set of changes, where people can comment on single lines, ask for changes and approve. Even if you work alone, the practice builds good habits. In a team, it is how mistakes are caught before they reach everyone."),
    H("The basic flow inside one repository"),
    O("Update your `main`: `git switch main`, then `git pull`.", "Create a branch for one task: `git switch -c fix-footer-link`.", "Make small commits on the branch.", "Push the branch: `git push -u origin fix-footer-link`. The first push prints a link to open a pull request, or GitHub shows a banner with a button when you open the repository page.", "On GitHub, open the pull request. Choose `main` as the base and your branch as the one to compare. Write a clear title and description.", "Teammates review the changes, comment and request improvements. You push more commits to the same branch, and the pull request updates itself.", "When it is approved, someone merges it on GitHub. Then you delete the branch, switch to `main` and `git pull` to get the merged work."),
    H("Write a good pull request"),
    L("**A short title** that says what changed: `Fix broken footer link on the contact page`.", "**A description** that explains what and why: the problem, how you solved it, how to check it, and a screenshot if it is visual.", "**Small size.** A pull request with 50 lines gets a careful review. A pull request with 2,000 lines gets a quick glance and a thumbs-up. Split big work.", "**Link the issue** it solves. Writing `Closes #12` in the description closes issue 12 when the pull request is merged.", "**Check your own work first.** Read the diff on the pull request page as if you were the reviewer."),
    H("Being reviewed and reviewing"),
    L("Read comments as help with the code, and not as criticism of you. Reply politely. If you agree, fix it. If you disagree, explain your reason.", "As a reviewer, be specific and kind. Say what you suggest and why. Praise good parts too.", "Look for: does it work, is it clear, are there tests, could it break something, are there secrets or private data in it?", "Mark questions as questions and suggestions as suggestions, so the author knows what is required.", "Do not approve what you did not read."),
    H("The three ways to merge"),
    P("GitHub offers different buttons to merge a pull request, and a repository owner can choose which ones are allowed. A **merge commit** keeps all your commits and adds a merge commit. **Squash and merge** combines all the commits of the branch into a single one, which keeps the main history short. **Rebase and merge** replays your commits on top of main in a straight line. A beginner can use whatever the team chooses. Squash is popular for keeping a tidy history."),
    H("Forks: contributing to someone else's project"),
    P("You usually cannot push to a project that belongs to someone else. Instead, you make your own copy on GitHub, a **fork**, and work there. Then you send a pull request from your fork back to the original project. The steps are these."),
    O("Click **Fork** on the project's page. GitHub creates a copy under your account.", "Clone **your fork**: `git clone https://github.com/yourname/project.git`.", "Add the original project as a second remote called `upstream`: `git remote add upstream https://github.com/original-owner/project.git`.", "Create a branch, make your change and push it to **your fork**: `git push -u origin my-change`.", "On GitHub, open a pull request from your branch to the original project, and follow its contribution rules, which are usually in a file called `CONTRIBUTING.md`."),
    H("Keep your fork up to date"),
    C('bash', `git fetch upstream
git switch main
git merge upstream/main
git push origin main`),
    P("Those four commands bring the original project's newest work into your fork's main branch. Do this before you start a new branch, so that you work from the current version."),
    H("Issues and other team tools"),
    L("**Issues** are tasks, bugs and ideas, with a discussion for each. Write a clear title and describe how to reproduce a bug.", "**Labels** such as `bug` or `good first issue` organise them. Many projects use `good first issue` for tasks suitable for newcomers.", "**Checks:** many projects run automatic tests when you open a pull request, and show a green tick or a red cross. Read the log of a red check, fix the problem and push again.", "**Branch protection:** owners can require reviews and passing checks before anything is merged into `main`. This protects the stable branch."),
    N("Pull requests are a social tool as much as a technical one. Be patient with replies, thank the reviewers and keep the conversation friendly. Maintainers of free projects are often volunteers."),
    ...task("Make a practice repository on GitHub. Create a branch, change a file, push the branch and open a pull request into `main`.", "Read the \"Files changed\" tab of your own pull request and leave one comment on a line, as a reviewer would.", "Merge the pull request with the button, delete the branch, then update your local `main` with `git pull`.", "Find a small open source project that you like, and read its `CONTRIBUTING.md` and the issues with the label `good first issue`. You do not have to contribute yet."),
    ...check("Your pull request shows the changes of your branch and can be merged.", "After merging, `git pull` on `main` brings in your change.", "You can explain what a fork is and when you need one."),
  ], A('A pull request', [
    n('branch', 'Branch', 'your small change', 0, 0, 'user'), n('pr', 'Pull request', 'describe and compare', 1, 0, 'data'),
    n('review', 'Review', 'comments, approval', 2, 0, 'check'), n('main', 'main branch', 'merged work', 3, 0, 'out'),
  ], [
    { say: 'You do your work on a separate branch and push it to GitHub.', on: ['branch'] },
    { say: 'You open a pull request that asks to merge the branch into main, with a clear description.', flow: ['branch>pr:open'] },
    { say: 'Teammates review the changes, comment on lines and ask for improvements. You push more commits if needed.', flow: ['pr>review:discuss'] },
    { say: 'When it is approved and the checks pass, it is merged into main and the branch can be deleted.', flow: ['review>main:merge'] },
  ]), [
    faq('What is the difference between a fork and a branch?', 'A branch is a line of work inside one repository. A fork is a whole copy of someone else repository under your own account, which you use when you cannot push to the original.'),
    faq('How big should a pull request be?', 'Small and focused on one change. Small pull requests get better reviews and are easier to undo.'),
  ]),

  // ---------------------------------------------------------------- 8
  les(S2, 'good-commits-gitignore-and-keeping-secrets-safe', 'Good Commits, Clean Repositories and Keeping Secrets Safe', 'Good Commits and Keeping Secrets Safe',
    'Write commit messages that help, keep commits small, use a README and a .gitignore, and learn what to do when a password or API key is committed by mistake.', [
    P("Git remembers everything, which is wonderful and also dangerous. A history full of messages like `fix` and `stuff` is hard to use. A history that contains a password is a security problem that stays until you deal with it. This lesson is about the habits that keep a repository useful and safe, and they matter a lot when employers or teammates read your work."),
    H("Commit messages that help"),
    P("The message is a note to your future self and to your team. A good one says what changed and, when it is not obvious, why. Many teams follow this shape."),
    L("A **first line** of about 50 characters, in the imperative, as if giving an order: `Add search box to the header`, `Fix crash when the list is empty`. It should finish the sentence: *If applied, this commit will...*", "A **blank line**, then, if needed, a longer explanation of the reason and any side effects.", "No full stop is needed at the end of the first line.", "Avoid `fix`, `update`, `changes`, `asdf`. Six months later, nobody knows what they mean.", "If your team uses a style such as Conventional Commits (`feat:`, `fix:`, `docs:`), follow it."),
    C('bash', `git commit -m "Fix crash when the task list is empty" -m "The list page read the first item without checking the length.
It now shows a friendly message instead."`),
    P("Using `-m` twice makes the second text a separate paragraph. Without `-m`, `git commit` opens your editor, which is easier for longer messages. If you end up in an editor you do not know, such as Vim, press `Esc`, type `:q!` and press Enter to leave without saving, then set another editor with `git config --global core.editor`."),
    H("Small, focused commits"),
    L("One commit = one idea. Fixing a typo and adding a feature belong in two commits.", "Use `git add -p` to choose parts of a file for a commit. Git shows each changed block and asks yes or no. This is how you split a messy afternoon into clean commits.", "Do not commit work that is broken, if you can avoid it. A commit should leave the project in a working state.", "Commit often. Small commits are easy to understand, easy to revert and easy to review."),
    H("A README is the front door"),
    P("The `README.md` file is shown on the front page of your repository on GitHub. For any project that you share, it should say what the project is, how to install and run it, how to use it, and what to do about problems. For a portfolio, add a screenshot and the main technologies. Lesson 10 returns to this. A repository without a README looks unfinished."),
    H("What does not belong in a repository"),
    L("**Secrets:** passwords, API keys, tokens, private keys, database addresses with passwords, `.env` files with real values.", "**Personal data:** other people's names, phone numbers, ID numbers, customer lists.", "**Generated or downloaded files:** `node_modules/`, build folders, caches, virtual environments, compiled files. They can be rebuilt, and they make the repository heavy.", "**Large binary files:** big videos and datasets. Git is built for text. Hosts also have size limits.", "**Editor and system files:** `.DS_Store`, `Thumbs.db`, `.idea/`. Put these in your `.gitignore`."),
    H("Keep secrets out: the .env pattern"),
    P("Programs often need secrets. The standard way is to keep them in a file named `.env` that is **in `.gitignore`**, and to read them from the environment in your code. Commit a sample file named `.env.example` with fake values, so others know which settings are needed. Services and hosts also let you store secrets in their own settings, and GitHub has a feature for secrets used by automatic workflows."),
    C('text', `# .gitignore
.env

# .env.example  (this one is committed; the values are fake)
DATABASE_URL=put-your-address-here
API_KEY=put-your-key-here`),
    H("What if I committed a secret?"),
    P("Act in this order. The first step is the most important."),
    O("**Treat the secret as stolen.** Go to the service that issued it, and **revoke or rotate it at once**: delete the key and create a new one. Automated bots scan public repositories within minutes, so assume that a public secret has been seen.", "Put the file in `.gitignore` and remove it from tracking: `git rm --cached .env`, then commit.", "Understand that the old commits still contain the secret. Deleting the file in a new commit does not remove it from the history.", "If it matters, and especially for a repository that others have copied, rewrite the history with a tool such as `git filter-repo` or the BFG Repo-Cleaner, and then force-push. This is advanced, and it disturbs everyone who has a copy, so read the documentation first and ask for help.", "Check the service's logs for use you did not make."),
    N("Rotating the secret is what really protects you. Cleaning the history is a second step, and it is not a replacement for it. GitHub can also warn you about some kinds of secrets that it recognises, but you should never rely on that alone."),
    H("Licences"),
    P("If you put code on GitHub publicly, and you want others to be able to reuse it, add a licence file. Without one, by default others do not have the right to copy and use your work, even though they can see it. Popular simple choices include MIT and Apache 2.0. GitHub can add a licence file for you when you create a repository, and sites such as choosealicense.com explain the differences. For a legal question about your own work or an employer's code, ask a qualified person."),
    ...task("Rewrite three bad commit messages you can imagine (for example `fix`, `update`, `changes`) as clear, imperative ones.", "In a practice repo, change two unrelated things in one file and use `git add -p` to commit them separately.", "Create `.env` with a fake secret and `.gitignore` containing `.env`. Check that `git status` does not list it. Add a `.env.example`.", "Write a README with: what it is, how to run it, and one example."),
    ...check("`git log --oneline` shows messages that you could understand in six months.", "`git status` never shows your `.env` file.", "You can list the first two things to do if a key is committed by mistake."),
  ], A('Keep secrets out of Git', [
    n('secret', 'Secret in .env', 'real values', 0, 0, 'data'), n('ign', '.gitignore', 'lists .env', 1, 0, 'check'),
    n('repo', 'Repository', 'no secrets inside', 2, 0, 'tool'), n('hub', 'GitHub', 'safe to share', 3, 0, 'out'),
  ], [
    { say: 'Passwords and keys live in a local .env file, and the code reads them from the environment.', on: ['secret'] },
    { say: 'The .gitignore file lists .env, so Git never tracks or commits it.', flow: ['secret>ign:ignored'] },
    { say: 'The repository holds only code and a .env.example file with fake values.', flow: ['ign>repo:clean'] },
    { say: 'Pushing to GitHub is safe, because no real secret is in the history. If one ever is, rotate it first.', flow: ['repo>hub:push'] },
  ]), [
    faq('What should I do if I accidentally commit a password or API key?', 'Revoke or rotate it immediately at the service that issued it, because it may already have been copied. Then remove it from tracking, and consider rewriting history with a tool like git filter-repo.'),
    faq('What makes a good commit message?', 'A short imperative first line that says what changed, such as Fix crash when the list is empty, and, when needed, a longer explanation of why.'),
  ]),

  // ---------------------------------------------------------------- 9
  les(S3, 'stash-tags-and-exploring-history', 'Stash, Tags and Exploring History: log, show and blame', 'Git Stash, Tags, log, show and blame',
    'Put unfinished work aside with stash, mark releases with tags, explore history with log, show and blame, and learn what cherry-pick and rebase are for.', [
    P("As your projects grow, you will want to answer questions such as: *What did I change last week? Who changed this line, and why? How do I put my half-finished work aside and fix a quick bug?* Git has tools for all of these. This lesson shows the most useful ones, with a real session, and gives careful guidance about the two commands that can cause trouble, `cherry-pick` and `rebase`."),
    C('text', out('s6')),
    H("Stash: put work aside"),
    P("In the session, we had a half-done idea in `notes.txt`, and needed a clean folder, for example to switch branches or pull. `git stash` saved the uncommitted changes in a hidden shelf and returned the files to the last commit. `git status -s` printed nothing, so the folder was clean. `git stash list` shows what is on the shelf, and `git stash pop` puts the work back and removes it from the shelf. If you stash several times, the newest is `stash@{0}`."),
    L("Stash only keeps changes to files that Git tracks. Add `-u` to include new untracked files.", "Give a stash a name so you can find it later: `git stash push -m \"half-done idea\"`.", "A stash lives on your computer only. It is not pushed to GitHub, so do not use it as a backup. For a lasting save, commit on a branch.", "`git stash drop` deletes a stash, so use it carefully."),
    H("Tags: name an important moment"),
    P("A **tag** is a permanent label on a commit, typically used for releases such as `v1.0`. `git tag -a v1.0 -m \"First release\"` created an annotated tag, which stores a message, the date and your name. `git tag` lists tags, and `git log --oneline --decorate` shows them next to the commits. Tags are not pushed automatically. Send one with `git push origin v1.0`, or all of them with `git push --tags`."),
    H("Exploring history"),
    L("`git log --oneline` is the short list. Add `--graph --all` to see branches. `git log -5` shows only the last five commits.", "`git log -- notes.txt` lists only the commits that changed that file. `git log -p` also shows the changes.", "`git log --author=\"Asha\"` and `git log --since=\"2 weeks ago\"` filter by person and time.", "`git show HEAD` shows the latest commit with its changes. `git show --stat HEAD` adds a summary of the files, as in the session. You can also show an older commit by its code.", "`git diff main feature-branch` compares two branches. `git diff HEAD~1` compares your folder to the commit before the last one.", "`git blame notes.txt` shows who changed each line, in which commit and when. The name sounds harsh, but it is meant to help you find the commit that explains a line, and then to read its message. It is not for blaming people."),
    H("Searching"),
    P("`git log -S\"password\"` finds commits that added or removed that text, which is useful for tracking down when something appeared. `git grep \"TODO\"` searches the current files of the project quickly. When a bug has appeared and you do not know which commit caused it, `git bisect` helps you find it by binary search. You mark one good commit and one bad one, and Git checks out the middle commits for you to test. It is advanced, but it is worth knowing that it exists."),
    H("cherry-pick: take one commit"),
    P("`git cherry-pick <commit>` copies a single commit from another branch onto your current branch. It is useful for taking one bug fix to a release branch without merging everything else. The copy gets a new commit code. If you use it often, ask whether a merge would be simpler. We do not show a session for it here because the idea is small: one commit, copied."),
    H("rebase: handle with care"),
    P("`git rebase main`, when you are on your feature branch, moves your commits so that they start from the newest `main`, as if you had begun your work just now. It gives a straight, tidy history. But rebase **rewrites commits**, which means that they get new codes. The rule is simple: **never rebase commits that you have already pushed and that others may use.** Rebase your own local, unshared branch if you want, and until you are comfortable, a normal merge is perfectly fine. Many professional teams use merges only."),
    H("Tips to feel at home"),
    L("Run `git status` and `git log --oneline --graph --all` often. They show you where you are.", "A graphical tool, such as the Git panel in VS Code, GitHub Desktop or the history view on GitHub itself, helps you see the same things as pictures.", "`git help <command>` and `git <command> --help` open the manual, which is clear once you know the words.", "If you are afraid to try a command, copy the whole project folder first, and experiment on the copy."),
    N("The hash codes, dates and times in the session are from the recorded run and are different in yours. The commands and the shape of the output are the same."),
    ...task("In a practice repository, make an uncommitted change, stash it, check that the folder is clean, and pop it back.", "Create a tag `v1.0`, list tags and look at `git log --oneline --decorate`.", "Use `git log -- file`, `git show --stat HEAD` and `git blame file` on your own repo, and explain each output.", "Write in your own words when you should *not* use rebase."),
    ...check("After `git stash`, `git status` shows a clean folder, and after `pop` your change is back.", "`git log --oneline --decorate` shows the tag next to the right commit.", "You can explain why rewriting pushed history causes problems for others."),
  ], A('Put work aside and look back', [
    n('wip', 'Unfinished work', 'not ready to commit', 0, 0, 'user'), n('stash', 'git stash', 'put it on the shelf', 1, 0, 'tool'),
    n('clean', 'Clean folder', 'switch, pull, fix', 2, 0, 'check'), n('pop', 'git stash pop', 'get it back', 3, 0, 'out'),
  ], [
    { say: 'You have unfinished work that is not ready for a commit, but you need to do something else.', on: ['wip'] },
    { say: 'git stash puts those changes on a hidden shelf.', flow: ['wip>stash:stash'] },
    { say: 'Your folder is clean again, so you can switch branches, pull or fix a quick bug.', flow: ['stash>clean:clean'] },
    { say: 'git stash pop brings your unfinished work back and removes it from the shelf.', flow: ['clean>pop:pop'] },
  ]), [
    faq('Is git stash safe as a backup?', 'No. A stash stays only on your computer and is easy to drop by mistake. For a lasting save, commit your work on a branch and push it.'),
    faq('What does git blame do?', 'It shows who last changed each line of a file, and in which commit. Use it to find the commit message that explains why a line is there.'),
  ]),

  // ---------------------------------------------------------------- 10
  les(S3, 'git-and-github-for-your-job-search-and-cheat-sheet', 'Using GitHub in Your Job Search, and a Git Cheat Sheet', 'GitHub for Your Job Search + Cheat Sheet',
    'Turn GitHub into a portfolio: good READMEs, pinned repositories, a profile README, GitHub Pages and honest contributions. Ends with a one-page Git cheat sheet.', [
    P("For many technical jobs, your GitHub page is a second CV. Recruiters and hiring managers often look at it to see whether you can write clear code, finish projects and work with others. A tidy profile with a few honest, well-explained projects usually says more than a long list of skills. This lesson shows how to prepare yours, and ends with a cheat sheet of the commands you have learned. No profile can promise an interview, but a clear one helps people understand what you can do."),
    H("Start with your profile"),
    L("**Username and photo:** professional and recognisable. Employers will see them.", "**Bio:** one line about what you do or are learning, for example `Learning back-end development with Node.js and Python`.", "**Location and links:** add your city or country if you are comfortable, and a link to your LinkedIn page or your resume.", "**Email privacy:** if you do not want your real email visible in commits, use the private no-reply address that GitHub provides in its email settings, and set it with `git config`.", "**Profile README:** if you create a repository with exactly the same name as your username, its README is shown on top of your profile. Use it for a short introduction: who you are, what you are learning, your best projects and how to contact you."),
    H("Choose and pin your best projects"),
    P("Quality beats quantity. Three or four finished projects with a clear README are better than thirty empty repositories. GitHub lets you **pin** up to six on your profile. Choose the ones that show different skills. Ideas for projects are the ones you built in these courses: the Python expense tracker, the SQL queries on a shop database, and the Node task API. Make each of them your own, with a real purpose, and do not simply copy a tutorial without adding something."),
    H("A README that sells your project"),
    O("**Title and one sentence:** what it is and who it is for.", "**A screenshot or a short demo** for anything visual.", "**Features:** three to five bullet points.", "**Technologies used.**", "**How to install and run it:** exact commands that work on a fresh computer. Test them yourself.", "**What you learned or what is next:** shows that you can reflect on your work.", "**Licence and contact**, if you like."),
    N("Never put secrets, personal data or an employer's confidential code in a public repository. If a project comes from a previous job, check that you are allowed to show it, and when in doubt, leave it out."),
    H("Show your project live: GitHub Pages"),
    P("For a static website, made of HTML, CSS and JavaScript files only, GitHub can host it for free with a feature called **GitHub Pages**, which you switch on in the repository settings. Your portfolio or a small project then has a public web address that you can put on your resume. Back-end projects that need a database or a server cannot run on Pages. For them, use a hosting service, or record a short video and describe the setup in the README. Check GitHub's own help pages for the current steps and limits."),
    H("Contribute to other projects"),
    L("Start small. Fix a typo in documentation, improve an example, or translate a sentence. These are real contributions and good practice for the pull request flow in lesson 7.", "Look for the label `good first issue` in projects that you use.", "Read `CONTRIBUTING.md` and the code of conduct first, and follow them.", "Be patient and polite. Not every pull request is accepted, and every one teaches you something.", "Do not open pull requests only to collect activity. Maintainers notice, and it wastes their time."),
    H("Be honest about your history"),
    L("Do not fake activity. Employers who read your commits can see when and how you worked, and genuine, regular small commits look better than a rush of meaningless ones.", "Do not claim other people's code as yours. Credit sources in your README.", "It is fine to have beginner code in old repositories. You can make them private or archive them, and pin your current best."),
    H("On your resume"),
    P("Put your GitHub link in the contact line at the top, and name two or three projects with one line each: what it does, the tools used and a result that you can honestly state. Our [resume templates](/templates) are built to stay readable by applicant tracking systems, and the [ATS checker](/features/ats-checker) can show you how a resume reads. Look at the [career roadmaps](/roadmaps) to see which skills match the role you want, and use our other courses on [Python](/learn/python-for-beginners-course) and [Node.js and Express](/learn/nodejs-express-course) to build projects worth pinning."),
    H("One-page Git cheat sheet"),
    C('text', `SET UP (once)
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
git config --global init.defaultBranch main

START
git init                          new repository in this folder
git clone <url>                   copy a repository from GitHub

EVERY DAY
git status                        what is going on? (safe, run it often)
git diff                          see unstaged changes
git add <file>   |  git add -A    stage changes
git commit -m "Clear message"     save a snapshot
git log --oneline --graph --all   see the history

UNDO
git restore <file>                discard edits in the folder
git restore --staged <file>       unstage
git commit --amend -m "New text"  fix the last commit (not pushed)
git revert <commit>               undo a commit safely (shared work)

BRANCHES
git branch                        list branches
git switch -c <name>              create and move to a branch
git switch <name>                 move to a branch
git merge <name>                  bring a branch into the current one
git merge --abort                 cancel a merge in trouble
git branch -d <name>              delete a merged branch

REMOTE
git remote add origin <url>       connect to GitHub
git push -u origin <branch>       first push of a branch
git push  |  git pull             send / receive changes
git fetch                         download without merging

EXTRAS
git stash  |  git stash pop       put work aside / get it back
git tag -a v1.0 -m "Release"      mark a release
git show <commit>                 see one commit
git blame <file>                  who changed each line

AVOID unless you are sure:  reset --hard,  push --force,  clean -fd,
rebase on shared branches.`),
    P("Print it, or keep it open while you practise. After a few weeks of daily use, you will not need it for the first two sections."),
    ...task("Make or tidy your GitHub profile: photo, short bio, links.", "Pick one project, write a README with the seven parts above, and pin it.", "Create a profile README repository with your username, and write four lines about yourself.", "Add your GitHub link to your resume, with one line for each of two projects."),
    ...check("A stranger can understand what your pinned project does in under a minute.", "The install commands in your README work on a fresh clone.", "No secrets or private data are in any of your public repositories."),
  ], A('From projects to profile', [
    n('proj', 'Real projects', 'built and finished', 0, 0, 'app'), n('read', 'Clear README', 'what, how, why', 1, 0, 'tool'),
    n('pin', 'Pinned profile', 'best three or four', 2, 0, 'data'), n('cv', 'Resume link', 'show your work', 3, 0, 'out'),
  ], [
    { say: 'Build real, finished projects, such as the ones in these courses, and make them your own.', on: ['proj'] },
    { say: 'Write a clear README with what it is, how to run it and what you learned.', flow: ['proj>read:document'] },
    { say: 'Pin your best three or four projects and add a short profile README.', flow: ['read>pin:choose'] },
    { say: 'Add your GitHub link and one honest line per project to your resume.', flow: ['pin>cv:share'] },
  ]), [
    faq('Do employers really look at GitHub profiles?', 'For many technical roles, some do. A tidy profile with a few clear, honest projects helps them see what you can do. It does not replace a good resume or interview preparation, and it cannot promise a job.'),
    faq('Can I host a website on GitHub?', 'Yes, static sites made of HTML, CSS and JavaScript can be hosted for free with GitHub Pages. Projects that need a server or database need another host.'),
  ]),
];
