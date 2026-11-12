import { P, H, L, O, N, C, task, check, faq, n, A, les } from '../kit.js';
import { code, RAN } from './files.js';

const S4 = 'Git, GitHub and First Pipeline';

export const lessons = [
  // ---------------------------------------------------------------- 13
  les(S4, 'git-workflows-for-devops-teams', 'Git for DevOps Teams: Branches, Rebase, Stash, Tags and Pull Requests', 'Git for DevOps: Branching and Reviews',
    'Use Git the way DevOps teams do: branching strategies, merge or rebase, stash, reset and revert, cherry-pick, tags for releases, pull requests and code reviews.', [
    P("If you already know the basic Git commands, this lesson shows how teams use them to ship software safely. If you are new to Git, first read the free [Git and GitHub course](/learn/git-and-github-course) on this site, then come back, because this lesson assumes you can commit, branch and push. In DevOps, Git is not just where code lives. Pipelines start from it, releases are marked in it, and in GitOps even the live system is described in it. A few habits make that smooth."),
    H("Branching strategies"),
    P("A branching strategy is the team’s agreement about which branches exist and how work flows between them. Three are common."),
    L("**Trunk-based development:** everyone works in very short branches (a day or two) and merges into `main` often. It relies on good automatic tests and, often, feature flags to hide unfinished work. It suits teams that deploy many times a day.", "**GitHub flow:** `main` is always deployable. For every change you create a branch, open a pull request, get a review and tests, merge, and deploy. Simple and very popular.", "**Git flow:** long-lived `develop` and `main` branches plus feature, release and hotfix branches. It fits software with scheduled releases and several supported versions, but it has more overhead."),
    P("There is no single best choice. For a small team with a web application, GitHub flow is a good start. Whatever you choose, keep branches short-lived: the longer a branch lives, the harder the merge."),
    H("Merge or rebase"),
    P("Both combine work from two branches. A merge adds a new commit that joins the two histories, and keeps everything as it happened. A rebase replays your commits on top of the latest `main`, which gives a straight line of history that is easier to read. The golden rule of rebase: never rebase commits that other people have already pulled, because you rewrite history and cause trouble for them. A safe pattern is to rebase your own private branch on `main` before you open the pull request, and to merge (or squash) when the pull request is accepted."),
    C('bash', `git switch -c feature/health-endpoint    # start a branch
git add . && git commit -m "Add /health endpoint"
git fetch origin
git rebase origin/main                     # replay my work on the newest main
git push --force-with-lease -u origin feature/health-endpoint`),
    P("`--force-with-lease` is a safer force push: it refuses if someone else pushed to your branch in the meantime. You need a force push after a rebase, because history changed."),
    H("Stash, reset and revert"),
    L("`git stash` puts your unfinished changes on a shelf so you can switch branches with a clean folder. `git stash pop` brings them back, and `git stash list` shows the shelf.", "`git restore file` throws away changes to a file that you have not committed. `git reset --soft HEAD~1` undoes the last commit but keeps the changes ready to commit again. `git reset --hard` destroys uncommitted work, so think before you use it.", "`git revert <commit>` makes a new commit that undoes an old one. Use revert, not reset, to undo something that is already shared, because it keeps the history honest."),
    H("A quick refresher on the everyday commands"),
    L("`git init` starts a repository and `git clone <url>` copies an existing one.", "`git add` stages changes, `git commit -m \"message\"` records them.", "`git fetch` downloads new work without changing your files. `git pull` is fetch plus merge. `git push` uploads your commits.", "`git status`, `git log --oneline` and `git diff` show where you are."),
    H("Merge conflicts"),
    P("A conflict happens when two branches changed the same lines. Git cannot choose, so it stops and marks the file. You will see markers like these:"),
    C('text', `<<<<<<< HEAD
timeout = 30
=======
timeout = 60
>>>>>>> feature/slow-api`),
    O("Open the file and decide what the final text should be: one side, the other, or a mix.", "Delete the three marker lines so only the final text remains.", "Run `git add <file>`, then `git commit` (or `git rebase --continue` during a rebase).", "Run the tests before you push. A conflict that is fixed wrongly still compiles."),
    P("`git merge --abort` or `git rebase --abort` takes you safely back to before you started. Small, short-lived branches are the best cure, because they conflict less."),
    H("Cherry-pick"),
    P("`git cherry-pick <commit>` copies one commit onto the branch you are on. DevOps teams use it when a fix made on `main` must also go onto a release branch, without taking all the other changes. Prefer small, focused commits, because cherry-picking a commit that mixes five things is painful."),
    H("Tags and releases"),
    P("A tag is a fixed name for one commit, normally used to mark a release such as `v1.4.0`. Pipelines can start a release build when a tag is pushed, and rolling back means deploying the previous tag. A common numbering scheme is semantic versioning: MAJOR.MINOR.PATCH, where a patch fixes bugs, a minor adds features without breaking things, and a major may break things."),
    C('bash', `git tag -a v1.4.0 -m "Release 1.4.0"
git push origin v1.4.0
git tag --list "v1.*"`),
    H("Pull requests and code review"),
    P("A pull request (PR) asks for your branch to be merged and gives others the chance to look first. Good PRs are small, have a clear title and description (what changed and why, and how you tested it) and link to the ticket. Good reviews are kind, specific and quick. Reviewers look for bugs, clarity, security and tests, and they separate must-fix from nice-to-have. Automation helps: the pipeline runs tests on every PR, and branch protection rules on `main` can require a passing pipeline and at least one approval before merging. That is how a review step becomes a safe gate in DevSecOps, not a suggestion."),
    N("Never commit passwords, API keys or private keys. Once pushed, a secret is in the history even if you delete the file later, and you must treat it as leaked and replace it. Use a `.gitignore` for files like `.env`, and consider a secret scanner in your pipeline."),
    ...task("Create a practice repository, make a feature branch, commit twice and rebase it on a newer `main`.", "Use `git stash` to switch branches in the middle of a change and come back.", "Make a commit with a mistake, push it to a branch and fix it with `git revert`.", "Create a tag `v0.1.0` and write one sentence on how you would roll back to it."),
    ...check("`git log --oneline --graph` shows the history you expect after the rebase.", "You can explain when to use revert and when to use reset.", "You can name the strategy your own team or project uses, and why."),
  ], A('A change in GitHub flow', [
    n('br', 'Feature branch', 'small change', 0, 0, 'tool'), n('pr', 'Pull request', 'review and tests', 1, 0, 'user'),
    n('main', 'main branch', 'always deployable', 2, 0, 'data'), n('tag', 'Tag v1.4.0', 'marks a release', 3, 0, 'app'),
  ], [
    { say: 'You do the work on a short-lived branch.', on: ['br'] },
    { say: 'You open a pull request. Tests run and a teammate reviews it.', flow: ['br>pr:open PR'] },
    { say: 'After approval, it merges into main, which stays deployable.', flow: ['pr>main:merge'] },
    { say: 'A tag marks the release commit, so you can deploy it, and roll back to an earlier tag.', flow: ['main>tag:release'] },
  ]), [
    faq('Should I use merge or rebase?', 'Use rebase to keep your own private branch up to date, and merge or squash-merge when the pull request is accepted. Never rebase commits that others have already pulled.'),
    faq('What is the difference between git revert and git reset?', 'Revert adds a new commit that undoes an earlier one and is safe on shared branches. Reset moves the branch pointer back and can erase history, so use it only on your own unshared work.'),
    faq('What should I do if I committed a secret?', 'Treat it as leaked: revoke or rotate the secret straight away, then remove it from the code. Deleting the file in a later commit does not remove it from history.'),
  ]),

  // ---------------------------------------------------------------- 14
  les(S4, 'github-actions-ci-pipeline-for-beginners', 'GitHub Actions: Your First CI Pipeline', 'GitHub Actions: Your First CI Pipeline',
    'Build a CI pipeline with GitHub Actions that tests and builds a Node project on every push and pull request, using a matrix, caching and artifacts.', [
    P("GitHub Actions is the automation service built into GitHub. When something happens in your repository, for example a push or a pull request, it starts a virtual machine, checks out your code and runs the steps you describe in a YAML file. It is a very good first CI tool, because it needs no server of your own, and the ideas you learn here (triggers, jobs, steps, secrets, artifacts) carry over to Jenkins, GitLab CI and the others. In this lesson you build a pipeline for a small Node project."),
    H("The vocabulary"),
    L("**Workflow:** one YAML file in `.github/workflows/`. A repository can have many.", "**Trigger (`on`):** the event that starts it, such as `push`, `pull_request`, a schedule or a manual button.", "**Job:** a group of steps that runs on one fresh machine (a runner). Jobs run in parallel unless you say one `needs` another.", "**Step:** one command (`run`) or one reusable action (`uses`).", "**Action:** a ready-made step from the marketplace, for example `actions/checkout`.", "**Runner:** the virtual machine, such as `ubuntu-latest`."),
    H("The sample project"),
    P("The project is tiny on purpose: one function, two tests that use Node’s own test runner, and a build script. It was run in the course lab with Node 22: `npm ci` installed with zero packages, `npm test` passed both tests, and `npm run build` printed build finished. The lock file `package-lock.json` is part of the project, because `npm ci` needs it for repeatable installs."),
    C('json', code('ci-app/package.json')),
    C('javascript', code('ci-app/sum.js')),
    C('javascript', code('ci-app/test/sum.test.js')),
    C('javascript', code('ci-app/build.js')),
    H("The workflow file"),
    P("Save this as `.github/workflows/ci.yml`. The file was checked by parsing the YAML and reading back its triggers, matrix and steps. It was not executed on GitHub for this course, because that needs a real repository, so the first run on your own repository is your final test."),
    C('yaml', code('ci.yml')),
    H("Reading it line by line"),
    L("`on` starts the workflow for pushes to `main` and for pull requests that target `main`.", "`strategy.matrix.node` runs the job twice, once with Node 20 and once with Node 22. A matrix is how you test against several versions without copying the job.", "`actions/checkout@v4` downloads your code onto the runner. Without it the machine is empty.", "`actions/setup-node@v4` installs Node and, with `cache: npm`, keeps downloaded packages between runs to save time.", "`npm ci` installs exactly what the lock file says. It is faster and stricter than `npm install`, and it is what CI should use.", "`npm test` and `npm run build` are your checks. If any step exits with a failure code, the job stops and turns red.", "`upload-artifact` saves the build output so you can download it or use it in a later job. The `if` limits it to one matrix run."),
    N("Pin actions to a version, as in `@v4`, and review third-party actions before you use them. An action runs with access to your repository, so only use ones from sources you trust. For higher safety, teams pin to a full commit hash."),
    H("Make the pipeline matter"),
    O("Push the project and the workflow to a GitHub repository, and open the Actions tab to watch the first run.", "Break a test on purpose in a branch, open a pull request and watch the check fail.", "In the repository settings, add a branch protection rule on `main` that requires this check to pass before merging. Now the pipeline is a real gate.", "Fix the test and see the check turn green."),
    H("Secrets"),
    P("Pipelines often need passwords or tokens, for example to deploy. Store them in the repository settings under Secrets, and read them in the workflow as `${{ secrets.NAME }}`. GitHub hides their values in logs. Never write them into the YAML file, and give each secret only the access it needs. For deployments to a cloud, a better practice you will meet later is OpenID Connect, which lets the workflow get short-lived access without a stored long-lived key."),
    H("Next steps"),
    P("Later lessons add more to this pipeline: building a Docker image, scanning it for vulnerabilities, deploying to a server or Kubernetes, and sending notifications. The pattern stays the same, only more steps. Start small and add one thing at a time, running it after each addition."),
    ...task("Create a repository with the sample project and the workflow, and get a green run.", "Add a failing test on a branch, open a pull request and confirm the check blocks it, with branch protection on.", "Add a third Node version to the matrix.", "Add a step that prints `node --version` and find it in the log."),
    ...check("The Actions tab shows a green check for both matrix jobs.", "A pull request with a failing test cannot be merged when branch protection is on.", "You can say what `npm ci` does differently from `npm install`."),
  ], A('What happens on a push', [
    n('push', 'git push', 'or a pull request', 0, 0, 'user'), n('run', 'Runner starts', 'fresh virtual machine', 1, 0, 'tool'),
    n('steps', 'Steps run', 'checkout, install, test', 2, 0, 'tool'), n('res', 'Result', 'green or red check', 3, 0, 'data'),
  ], [
    { say: 'A push or a pull request matches the on section of the workflow.', on: ['push'] },
    { say: 'GitHub starts a fresh virtual machine, called a runner, for each job in the matrix.', flow: ['push>run:trigger'] },
    { say: 'The steps run in order: checkout, setup Node, npm ci, test, build. A failing step stops the job.', flow: ['run>steps:run steps'] },
    { say: 'The result shows as a check on the commit or pull request. Branch protection can require it to be green.', flow: ['steps>res:report'] },
  ]), [
    faq('Is GitHub Actions free?', 'GitHub offers a free allowance of minutes for many accounts, with different limits for public and private repositories, and the terms change. Check the current pricing page before you rely on it.'),
    faq('Why use npm ci instead of npm install in CI?', 'npm ci installs exactly the versions in the lock file and fails if the lock file and package.json disagree. This makes builds repeatable.'),
    faq('Can I run a workflow by hand?', 'Yes. Add workflow_dispatch to the on section and a Run workflow button appears in the Actions tab.'),
  ]),
];
