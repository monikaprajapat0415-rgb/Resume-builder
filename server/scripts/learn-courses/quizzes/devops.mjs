import { more } from './data/devops-more.mjs';
const Q = (q, options, answer = 0, explain = '') => ({ q, options, answer, explain });
export const course = 'devops-cloud-engineering-course';
const base = {
  'what-is-devops-and-why-companies-use-it': [
    Q('Which best describes DevOps?', ['A set of practices and tools that help people build, test, release and run software together in small safe steps', 'A single tool that deploys websites', 'A job title that only operations staff hold'], 0),
    Q('In the DevOps lifecycle, what happens after Monitor?', ['What you learn feeds back into the next Plan', 'The project ends', 'The code is deleted'], 0),
    Q('What does a blameless review ask?', ['What in the system allowed the mistake', 'Which person should be punished', 'Whether the team should be smaller'], 0),
  ],
  'ci-cd-devsecops-gitops-and-sre-explained': [
    Q('What is the difference between continuous delivery and continuous deployment?', ['Delivery leaves the final release to a person; deployment sends passing changes live automatically', 'There is no difference', 'Delivery means testing only and deployment means coding only'], 0),
    Q('What does shift left mean in DevSecOps?', ['Moving security checks earlier in the process', 'Moving servers to another country', 'Writing code from the left side of the screen'], 0),
    Q('In GitOps, how do you change production?', ['Open a pull request, get it reviewed and merge it, and a tool applies it', 'Log in to a server and edit files by hand', 'Email the operations team'], 0),
  ],
  'devops-tools-architecture-and-engineer-roles': [
    Q('Which tool group is Terraform part of?', ['Infrastructure as Code', 'Monitoring', 'Version control'], 0),
    Q('What is the best project for learning DevOps across the whole course?', ['One real application improved step by step: Git, pipeline, container, cloud, Terraform, monitoring', 'Ten unrelated tutorials', 'Reading tool names only'], 0),
    Q('Why is it fine to learn one CI tool first?', ['The ideas such as triggers, jobs, steps and secrets carry over to other CI tools', 'All CI tools are identical in every detail', 'Employers only use one CI tool'], 0),
  ],
  'linux-basics-distributions-terminal-and-commands': [
    Q('What is the kernel?', ['The core part of the system that talks to hardware, memory and processes', 'A text editor', 'A web browser'], 0),
    Q('Which command follows new lines added to a log file?', ['tail -f', 'head -n 1', 'mkdir'], 0),
    Q('Where do configuration files normally live on Linux?', ['/etc', '/tmp', '/home/logs'], 0),
  ],
  'linux-permissions-users-and-groups': [
    Q('What does a permission of 644 mean?', ['Owner can read and write; group and others can only read', 'Everyone can do everything', 'Only the owner can read'], 0),
    Q('Why is chmod 777 a poor fix for Permission denied?', ['It gives everyone full control instead of fixing who needs which right', 'It deletes the file', 'It only works on folders'], 0),
    Q('Why use usermod -aG instead of usermod -G to add a group?', ['The -a keeps the user’s other groups', 'It makes the user an administrator', 'It deletes the user’s files'], 0),
  ],
  'linux-processes-packages-disks-memory-and-monitoring': [
    Q('Which command shows how full each disk is?', ['df -h', 'ps aux', 'kill -9'], 0),
    Q('Which column of free -m is the better number to watch?', ['available', 'free', 'shared'], 0),
    Q('What does a script exit code other than 0 tell tools such as a pipeline?', ['Something went wrong', 'The script succeeded', 'The disk is empty'], 0),
  ],
  'linux-services-systemd-ssh-cron-and-logs': [
    Q('What is the difference between systemctl start and systemctl enable?', ['Start runs the service now; enable makes it start at every boot', 'They are the same', 'Start installs it and enable removes it'], 0),
    Q('Which cron schedule runs a job every five minutes?', ['*/5 * * * *', '5 * * * *', '0 5 * * *'], 0),
    Q('Which SSH key must never be shared?', ['The private key', 'The public key', 'Neither can be shared'], 0),
  ],
  'bash-scripting-for-devops': [
    Q('What does set -e do in a Bash script?', ['Stops the script when a command fails', 'Prints every command', 'Deletes temporary files'], 0),
    Q('Why should you quote variables, as in "$NAME"?', ['So file names with spaces do not break the script', 'To make the script faster', 'Quotes are required for numbers'], 0),
    Q('Why check that a backup can be restored?', ['A backup that has never been restored is only a hope', 'Restoring deletes the backup', 'It makes the file smaller'], 0),
  ],
  'networking-basics-osi-tcp-ip-and-ip-addresses': [
    Q('Which OSI layer do routers work at?', ['Network (layer 3)', 'Physical (layer 1)', 'Application (layer 7)'], 0),
    Q('Which address range is private?', ['192.168.0.0 to 192.168.255.255', '8.8.8.0 to 8.8.8.255', 'Any address that starts with 203'], 0),
    Q('A browser shows a certificate warning. Which step of opening a page failed?', ['The TLS step', 'The DNS step', 'The user typed too fast'], 0),
  ],
  'subnetting-and-cidr-made-simple': [
    Q('How many addresses does a /24 network have?', ['256', '24', '65,536'], 0),
    Q('A /24 is split into four equal subnets. What size is each?', ['/26', '/25', '/28'], 0),
    Q('Why are usable hosts two fewer than the total in a normal network?', ['The first is the network address and the last is the broadcast address', 'Two are always broken', 'The router uses two'], 0),
  ],
  'dns-dhcp-http-tcp-udp-and-ports': [
    Q('What does a 502 status code usually point to?', ['A problem behind the proxy or load balancer', 'The page was not found', 'The user is not logged in'], 0),
    Q('Why can a DNS change take time to be seen everywhere?', ['Old answers stay cached until the TTL runs out', 'DNS only updates on Sundays', 'Browsers do not use DNS'], 0),
    Q('Which port is HTTPS by default?', ['443', '22', '3306'], 0),
  ],
  'firewalls-nat-vpn-load-balancers-tls-and-troubleshooting': [
    Q('What is the safest default firewall approach?', ['Block everything and open only what is needed', 'Open everything and block what is dangerous', 'Turn the firewall off'], 0),
    Q('What does NAT let many private machines do?', ['Share one public address to reach the internet', 'Skip DNS', 'Avoid using ports'], 0),
    Q('In which order should you troubleshoot a connection problem?', ['Name, reachability, port, listening service, firewalls, application', 'Application logs first, then guess', 'Reboot everything first'], 0),
  ],
  'git-workflows-for-devops-teams': [
    Q('Which command safely undoes a commit that is already shared?', ['git revert', 'git reset --hard', 'git stash'], 0),
    Q('What is the golden rule of rebase?', ['Never rebase commits that others have already pulled', 'Always rebase main', 'Rebase only on Fridays'], 0),
    Q('What is a Git tag commonly used for?', ['Marking a release such as v1.4.0', 'Deleting a branch', 'Storing passwords'], 0),
  ],
  'github-actions-ci-pipeline-for-beginners': [
    Q('Where are GitHub Actions workflow files stored?', ['.github/workflows/', 'src/actions/', '/etc/workflows/'], 0),
    Q('Why use npm ci in a pipeline?', ['It installs exactly what the lock file says, so builds are repeatable', 'It is the only way to run tests', 'It skips installing packages'], 0),
    Q('How do you make a pipeline check a real gate for merging?', ['Add a branch protection rule that requires the check to pass', 'Rename the workflow', 'Remove the tests'], 0),
  ],
  'cloud-computing-fundamentals-iaas-paas-saas': [
    Q('Which model gives you virtual machines that you manage from the operating system up?', ['IaaS', 'SaaS', 'PaaS'], 0),
    Q('What is hybrid cloud?', ['A mix of private systems and public cloud, joined together', 'Using only two public providers', 'A cloud with no servers'], 0),
    Q('How is a container different from a virtual machine?', ['Containers share the host kernel; a VM has its own operating system', 'Containers are always slower', 'A VM shares the host kernel'], 0),
  ],
  'cloud-reliability-regions-pricing-and-shared-responsibility': [
    Q('What is an availability zone?', ['One or more separate data centres inside a region', 'A country', 'A type of virtual machine'], 0),
    Q('What does RPO mean?', ['How much data you can afford to lose, measured as time', 'How long you can be down', 'How many regions you use'], 0),
    Q('Who is responsible for making sure your storage bucket is not public?', ['You, the customer', 'Only the provider', 'Nobody'], 0),
  ],
};
export const quizzes = Object.fromEntries(Object.entries(base).map(([k, v]) => [k, [...v, ...(more[k] || [])]]));
