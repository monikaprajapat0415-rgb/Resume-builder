// DevOps interview questions, module 1: DevOps fundamentals. 20 beginner, 20 intermediate, 20 advanced.
import { mk, withLearn } from './lib.mjs';
const A = mk('devops');
const B = 'DevOps basics', C = 'CI/CD and delivery', S = 'DevSecOps, GitOps and SRE', T = 'DevOps scenarios and production issues';
const row = (cat, lvl, list) => list.map(([q, a, tips]) => A(cat, lvl, q, a, tips || []));

const fresher = [
  ...row(B, 'fresher', [
    ['What is DevOps?', 'DevOps is a way of working where development and operations teams share responsibility for building, releasing and running software. It uses automation and fast feedback so changes reach users safely and often.'],
    ['Why was DevOps introduced?', 'Developers wanted to ship changes quickly while operations wanted stability, so releases were slow and teams blamed each other. DevOps joins the two so both own the result.'],
    ['What problems does DevOps solve?', 'Slow, risky releases, manual steps that cause mistakes, and late discovery of bugs. Automation, small changes and monitoring reduce each of these.'],
    ['What does a DevOps engineer do?', 'Builds and improves the path from code to a running service: pipelines, infrastructure as code, deployments and monitoring. They also help teams share ownership of reliability.'],
    ['Is DevOps a tool, a role or a culture?', 'Mainly a culture and set of practices. Tools help, and some companies use DevOps engineer as a job title, but buying a tool does not make a team DevOps.'],
    ['Name the stages of the DevOps lifecycle.', 'Plan, code, build, test, release, deploy, operate and monitor, then back to plan with what you learned.'],
    ['What is a feedback loop?', 'Information from tests, monitoring and users that flows back to the team so the next change is better.'],
    ['What is the difference between Agile and DevOps?', 'Agile is about how teams plan and build in small steps. DevOps extends that flow through release and running the software.'],
    ['What is automation, and why does it matter?', 'Letting a tool do repeatable work such as tests and deployments. It is faster, consistent and less error-prone than doing the steps by hand.'],
  ]),
  ...row(C, 'fresher', [
    ['What is continuous integration?', 'Developers merge small changes often and an automatic pipeline builds and tests each one, so problems show up early.'],
    ['What is continuous delivery?', 'Every change that passes the checks is ready to release, and a person chooses when to push the button.'],
    ['What is continuous deployment?', 'Changes that pass all checks go live automatically with no manual approval.'],
    ['What is a pipeline?', 'An automatic series of steps such as build, test and deploy that runs when code changes.'],
    ['Why do we use version control in DevOps?', 'It records every change, lets teams work in parallel and makes rollbacks possible. Pipelines start from it.'],
  ]),
  ...row(S, 'fresher', [
    ['What is DevSecOps?', 'Building security into every stage of delivery instead of checking at the end.'],
    ['What is Infrastructure as Code?', 'Describing servers and networks in files that tools apply, so environments are repeatable and reviewable.'],
    ['What is GitOps?', 'Keeping the desired state of a system in Git and letting a tool make the live system match it.'],
    ['What does SRE stand for?', 'Site Reliability Engineering: running services reliably using software engineering and measurable targets.'],
    ['What is monitoring?', 'Collecting and watching data such as errors and response times to know whether a service is healthy.'],
    ['Name five common DevOps tools and their jobs.', 'Git for versioning, GitHub Actions or Jenkins for pipelines, Docker for containers, Terraform for infrastructure and Prometheus for monitoring.'],
  ]),
];

const both = [
  ...row(B, 'both', [
    ['How would you explain the CALMS framework?', 'Culture, Automation, Lean, Measurement and Sharing. It is a checklist for judging how well a team practises DevOps.'],
    ['What is a blameless post-incident review?', 'A review that asks what in the system allowed a failure, not who to blame. It produces fixes and keeps people honest about problems.'],
    ['What are the DORA metrics?', 'Deployment frequency, lead time for changes, change failure rate and time to restore service. They measure delivery speed and stability together.'],
    ['What is shift left?', 'Moving checks such as tests and security scans earlier in the process, where problems are cheaper to fix.'],
    ['What is toil in operations work?', 'Manual, repetitive work that grows with the service and could be automated. Reducing toil is a core SRE goal.'],
    ['Why do small releases reduce risk?', 'Each change is easy to review, test and roll back, and when something breaks the cause is easy to find.'],
  ]),
  ...row(C, 'both', [
    ['Describe the stages of a typical CI/CD pipeline.', 'Checkout, install dependencies, lint, unit tests, build, security scan, publish an artifact, deploy to staging, run smoke tests, then promote to production.'],
    ['What is an artifact, and why store it?', 'A built output such as a container image or package. Storing it means the same tested build is what you deploy to every environment.'],
    ['What is the difference between a build and a deploy?', 'Building produces the artifact once. Deploying places that artifact into an environment and can happen many times.'],
    ['What is a rollback and how do you make it easy?', 'Returning to the previous working version. Keep old artifacts, use versioned deployments and keep database changes backward compatible.'],
    ['What is trunk-based development?', 'Everyone merges small changes into the main branch often, using feature flags for unfinished work. It suits continuous integration.'],
    ['What is a feature flag?', 'A switch that turns a feature on or off without redeploying, so code can be released before the feature is shown.'],
  ]),
  ...row(S, 'both', [
    ['How does a pipeline support DevSecOps?', 'It runs dependency scans, static analysis, secret detection and container image scans on every change, and blocks the merge on serious findings.'],
    ['What are SLI, SLO and SLA?', 'An SLI is a measurement such as the share of successful requests. An SLO is the target for it. An SLA is a contract that may include penalties.'],
    ['What is an error budget?', 'The amount of failure the SLO allows. While budget remains you can ship; when it is spent the team focuses on reliability.'],
    ['Why store deployment config in Git?', 'Changes are reviewed, versioned and auditable, and rollback is a revert.'],
    ['Pull-based vs push-based deployment?', 'Push: the pipeline sends changes to the cluster. Pull: an agent inside the cluster, as in GitOps, fetches the desired state from Git. Pull keeps cluster credentials out of the pipeline.'],
    ['What is a runbook?', 'Written steps for handling a known problem so anyone on call can follow them under pressure.'],
    ['What does observability add to monitoring?', 'Monitoring answers known questions with dashboards and alerts. Observability, with metrics, logs and traces, lets you investigate new unknown problems.'],
  ]),
  ...row(T, 'both', [
    ['Scenario: a deployment broke production five minutes ago. What are the first three actions?', 'Tell the team and start an incident channel, restore service by rolling back or turning off the change, then investigate the cause once users are safe.'],
  ]),
];

const exp = [
  ...row(B, 'experienced', [
    ['How would you introduce DevOps in a company where teams work in silos?', 'Start with one shared service and a small cross-team group, agree on a measurable goal such as release frequency, automate the slowest manual step first and share results. Culture changes through visible wins, not mandates.'],
    ['How do you measure whether DevOps changes are working?', 'Track the DORA metrics before and after, plus incident counts and developer wait time. Compare trends rather than single numbers and avoid using them to rank people.'],
    ['What are the risks of a separate DevOps team that does everything?', 'It can become a new silo and a bottleneck. A platform team that provides self-service tools while product teams own their services scales better.'],
    ['How do you balance speed with stability?', 'Use small changes, automated tests, progressive delivery and error budgets. When reliability is poor, slow feature work; when it is good, ship faster.'],
  ]),
  ...row(C, 'experienced', [
    ['Design a pipeline for a service that must deploy several times a day with no downtime.', 'Build once, run unit and integration tests in parallel, scan the image, deploy to staging with smoke tests, then roll out with rolling or canary releases guarded by health checks and automatic rollback.'],
    ['How do you keep pipelines fast as the codebase grows?', 'Cache dependencies, run jobs in parallel, test only what changed, use faster runners and split slow end-to-end tests into a later stage.'],
    ['How do you handle database changes in continuous deployment?', 'Use backward-compatible migrations in small steps: add, deploy code that works with both, backfill, then remove old structures later. This allows rollback of the code.'],
    ['Explain blue-green, canary and rolling deployments and when to use each.', 'Blue-green switches traffic between two full environments for instant rollback at higher cost. Canary sends a small share of traffic to the new version first. Rolling replaces instances gradually with less spare capacity.'],
    ['How do you secure a CI/CD pipeline itself?', 'Least-privilege tokens, short-lived credentials, protected branches, pinned action versions, secrets only where needed, signed artifacts and audit logs of who changed the pipeline.'],
    ['How do you stop a flaky test from hurting delivery?', 'Quarantine it with a ticket, fix or remove it quickly and track flaky rates. Ignoring flakiness teaches people to ignore failures.'],
  ]),
  ...row(S, 'experienced', [
    ['How do you choose an SLO for a new service?', 'Start from what users need, measure current performance, set a target slightly below what you reliably achieve and review it with the business. Avoid 100 percent, which is costly and blocks change.'],
    ['What happens when the error budget is exhausted?', 'The team pauses risky feature releases and spends effort on reliability until the budget recovers. This is agreed in advance so it is not a dispute.'],
    ['How does GitOps handle drift and secrets?', 'The agent compares live state with Git and corrects drift or alerts. Secrets are not stored in plain text; use sealed or external secret stores referenced from Git.'],
    ['How would you reduce mean time to restore?', 'Better alerting, runbooks, easy rollback, feature flags, clear ownership and practice with incident drills. Detect and decide quickly, then fix properly afterwards.'],
    ['What is platform engineering and how does it relate to DevOps?', 'A platform team builds an internal self-service platform so product teams can deploy and operate safely without reinventing tooling. It is one way to scale DevOps practices.'],
  ]),
  ...row(T, 'experienced', [
    ['Scenario: a release passed all tests but users report errors. What do you do first?', 'Check monitoring for the start of the errors and what changed, roll back or disable the feature flag to restore service, then investigate and write a blameless review.'],
    ['Production issue: the pipeline is red because of a failing test unrelated to your change. What should you do?', 'Do not bypass the check. Rerun to see if it is flaky, tell the owner, and fix or quarantine the test with a ticket.'],
    ['Troubleshooting: deployments succeed but the new version never receives traffic. Where do you look?', 'Health checks, readiness, routing or load balancer targets, image tag used, configuration differences and logs of the new instances.'],
    ['Scenario: two teams keep blaming each other for slow releases. How do you act?', 'Map the delivery flow and measure waiting time at each step, share the data and agree one joint goal. Fix the biggest queue together.'],
    ['Production issue: an expired certificate took down a service. How do you stop a repeat?', 'Automate renewal, alert well before expiry, inventory all certificates and add the check to monitoring and the review.'],
  ]),
];

const lessons = {
  [B]: 'what-is-devops-and-why-companies-use-it',
  [C]: 'ci-cd-devsecops-gitops-and-sre-explained',
  [S]: 'ci-cd-devsecops-gitops-and-sre-explained',
  [T]: 'devops-tools-architecture-and-engineer-roles',
};
export const devops1 = withLearn([...fresher, ...both, ...exp], 'devops-cloud-engineering-course', lessons);
