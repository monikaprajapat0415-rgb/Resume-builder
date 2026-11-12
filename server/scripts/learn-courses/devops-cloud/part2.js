import { P, H, L, O, N, C, task, check, faq, n, A, les } from '../kit.js';
import { code, out, RAN, NOTRUN } from './files.js';

const S2 = 'Linux Fundamentals';

export const lessons = [
  // ---------------------------------------------------------------- 4
  les(S2, 'linux-basics-distributions-terminal-and-commands', 'Linux Basics: Distributions, the Terminal and Core Commands', 'Linux Basics: Terminal and Core Commands',
    'Learn what Linux is, how it is built, which distribution to choose, how to try it safely, and the terminal commands to move around and manage files.', [
    P("Almost every server you will meet in DevOps runs Linux. Cloud virtual machines, containers, build servers and most websites sit on it. That is why this course starts with Linux before any cloud or container tool: if you are comfortable in a Linux terminal, everything later is easier. You do not have to love it. You only need to be able to move around, read files, change things carefully and understand error messages."),
    H("What Linux is"),
    P("Linux is an operating system kernel. The kernel is the core part that talks to the hardware: it decides which program gets the processor, manages memory, reads disks and handles the network. Around the kernel sit tools, libraries and programs. A bundle of the kernel plus those tools is called a distribution, or distro. Linux is free and open source, which means anyone can read, change and share the code, and that is a big reason it spread so widely."),
    H("The layers, simply"),
    L("**Hardware:** the processor, memory, disks and network card.", "**Kernel:** controls the hardware and gives programs a safe way to use it.", "**Shell:** a program that reads the commands you type, for example Bash.", "**Programs and services:** everything else, from a text editor to a web server."),
    H("Which distribution"),
    L("**Ubuntu and Debian:** very common on servers and in tutorials. They use the `apt` package tool. Ubuntu Server is a good first choice.", "**RHEL, Rocky Linux, AlmaLinux and CentOS Stream:** the Red Hat family, common in large companies. They use `dnf` (older ones use `yum`).", "**Amazon Linux:** the default on many AWS machines, in the Red Hat style."),
    P("The commands in this course work on all of them unless the lesson says otherwise. The biggest difference you will notice is the package tool and the exact location of a few files."),
    H("Ways to try Linux safely"),
    O("**WSL on Windows:** Windows Subsystem for Linux gives you an Ubuntu terminal inside Windows. It is the quickest start for many learners.", "**A virtual machine:** install VirtualBox or similar and run Ubuntu in a window. Mistakes cost nothing, because you can delete the machine.", "**A cloud server:** a small virtual machine from a provider. It is real, but remember to switch it off, and set a billing alert.", "**macOS:** the terminal is similar to Linux for many commands, though a few tools differ."),
    N("Do not practise destructive commands on your main computer or a company server. Use a practice machine. A single wrong `rm -rf` in the wrong folder can delete real work, and there is no recycle bin."),
    H("The terminal and the shell"),
    P("The terminal is the window. The shell is the program inside it that understands your commands. You type a command, press Enter, and the shell runs it and prints the result. A command has a name, then options that start with a dash, then arguments such as file names. For example, in `ls -l /var/log`, `ls` is the command, `-l` is an option and `/var/log` is the argument."),
    H("Commands you will use every day"),
    L("`pwd` shows where you are. `cd folder` moves into a folder, `cd ..` goes up one level, and `cd ~` goes to your home folder.", "`ls` lists files. `ls -la` shows details and hidden files (names that start with a dot).", "`mkdir name` makes a folder and `mkdir -p a/b/c` makes a whole path.", "`cp from to` copies and `mv from to` moves or renames. `cp -r` copies a folder.", "`rm file` deletes a file. `rm -r folder` deletes a folder and everything in it. There is no undo.", "`cat file` prints a file. `less file` lets you scroll through it, and `q` quits.", "`head -n 5 file` and `tail -n 5 file` show the first and last lines. `tail -f file` keeps following new lines, which is perfect for logs.", "`grep word file` finds lines that contain a word. `grep -r word folder` searches a whole folder.", "`find /path -name \"*.log\"` finds files by name.", "`man command` opens the manual for a command, and `command --help` gives a short summary."),
    H("Paths and the folder map"),
    P("Linux has one big tree that starts at `/`, called root. A path that starts with `/` is absolute, and works from anywhere. A path that does not is relative to where you are. A few folders matter for DevOps: `/etc` holds configuration, `/var/log` holds logs, `/home` holds users’ files, `/tmp` is for temporary files, `/usr/bin` holds programs and `/opt` is often used for extra software. When something breaks, the answer is very often in a file under `/etc` or `/var/log`."),
    H("Work with files, step by step"),
    C('bash', `mkdir -p ~/practice/logs
cd ~/practice
echo "hello devops" > notes.txt
cat notes.txt
cp notes.txt logs/notes-copy.txt
ls -l logs
mv logs/notes-copy.txt logs/old-notes.txt
grep devops logs/old-notes.txt`),
    P("The `>` sign sends the output of a command into a file instead of the screen, and replaces what was there. `>>` adds to the end instead. The pipe `|` sends the output of one command into another, and you will use it constantly, for example `ls -l | grep log`."),
    H("Two habits that save you"),
    L("**Use Tab.** Press Tab to complete file names and commands. It saves typing and catches spelling mistakes.", "**Read before you run.** If you paste a command from the internet, read what it does first, especially if it contains `sudo`, `rm` or a pipe into `sh`."),
    ...task("Set up a practice Linux machine (WSL, a virtual machine or a cloud server).", "Run the practice commands above and check each result with `ls` and `cat`.", "Use `man ls` to find the option that sorts files by size, and try it.", "Use `find` to list all `.conf` files under `/etc`, then use `grep -r` to find which one mentions `localhost`."),
    ...check("`pwd` shows the folder you expect after each `cd`.", "You can create, copy, move, read and delete a file without looking up the commands.", "You can say what `/etc` and `/var/log` are for."),
  ], A('Layers of Linux', [
    n('you', 'You', 'type a command', 0, 0, 'user'), n('shell', 'Shell (Bash)', 'reads the command', 1, 0, 'tool'),
    n('kern', 'Kernel', 'controls hardware', 2, 0, 'app'), n('hw', 'Hardware', 'disk, memory, network', 3, 0, 'data'),
  ], [
    { say: 'You type a command in the terminal.', on: ['you'] },
    { say: 'The shell reads it and starts the right program.', flow: ['you>shell:ls -l'] },
    { say: 'The program asks the kernel for what it needs, such as reading a folder.', flow: ['shell>kern:ask'] },
    { say: 'The kernel talks to the disk and returns the answer, which the shell prints.', flow: ['kern>hw:read'] },
  ]), [
    faq('Do I need to install Linux as my main system to learn DevOps?', 'No. WSL on Windows, a virtual machine or a small cloud server is enough. Many people learn this way and keep their normal system.'),
    faq('What is the difference between a distribution and Linux?', 'Linux is the kernel. A distribution such as Ubuntu bundles the kernel with tools, a package manager and defaults, so you can install and use it.'),
    faq('Is there an undo for rm?', 'No. The shell does not use a recycle bin. Take care with rm, and for important folders keep backups or use a version control system.'),
  ]),

  // ---------------------------------------------------------------- 5
  les(S2, 'linux-permissions-users-and-groups', 'Linux File Permissions, Users and Groups', 'Linux Permissions, Users and Groups',
    'Understand who owns files in Linux, read rwx permissions and the numbers like 644 and 755, use chmod and chown, and manage users, groups and sudo safely.', [
    P("Linux was built for many people to share one machine, so every file has an owner and a set of rules about who may read, change or run it. These rules are the first line of defence on a server. They also cause a large share of the beginner errors you will see, such as Permission denied. If you understand them once, you will fix those errors in seconds, and you will stop reaching for the dangerous shortcut of giving every file full access."),
    H("Owner, group and others"),
    P("Every file has three kinds of people attached to it. The **owner** is usually the user who created it. The **group** is a named set of users. **Others** is everyone else on the system. For each of these three, there are three possible rights."),
    L("**r (read):** see the contents of a file, or list the names in a folder.", "**w (write):** change a file, or add and remove files inside a folder.", "**x (execute):** run a file as a program, or enter a folder with `cd`."),
    P("Run `ls -l` and you will see a line like `-rwxr-xr-- 1 asha devs 120 Mar 1 notes.sh`. The first character is the type: a dash for a file, `d` for a folder. The next nine characters are three groups of three: owner `rwx`, group `r-x`, others `r--`. Then come the owner name, the group name, the size, the date and the file name."),
    H("The numbers: 644, 755, 600"),
    P("Each right has a value: read is 4, write is 2 and execute is 1. Add them for each group. So `rwx` is 4 + 2 + 1 = 7, `r-x` is 4 + 1 = 5, `r--` is 4, and `rw-` is 6. A permission of 755 means owner 7, group 5, others 5. You will meet a few numbers again and again."),
    L("**644** (rw-r--r--): normal files. The owner can edit, everyone can read.", "**755** (rwxr-xr-x): programs and scripts, and many folders. Everyone can run, only the owner can edit.", "**600** (rw-------): private files such as SSH keys. Only the owner can use them.", "**770** (rwxrwx---): a shared folder for a group, with nothing for others."),
    H("A real run"),
    P("This small script creates a few files in a temporary folder, sets different permissions, and prints the result with `stat`. It was run in the course lab. " + RAN),
    C('bash', code('perm-demo.sh')),
    C('text', out('perm-demo')),
    H("Changing permissions and owners"),
    C('bash', `chmod 644 notes.txt        # numbers
chmod u+x script.sh        # add execute for the user (owner)
chmod go-w shared.txt      # remove write for group and others
chmod -R 755 site/         # apply to a folder and all inside it
sudo chown asha:devs report.txt   # change owner and group
sudo chown -R www-data:www-data /var/www/site`),
    P("Letters work too: `u` is the user (owner), `g` the group, `o` others and `a` all. A plus adds a right and a minus removes it. A common beginner mistake is `chmod 777`, which gives everyone full control. It makes the error go away, and leaves the door open. Work out which user needs which right instead. For example, a web server that must read your site files needs read access, not write access."),
    H("Users and groups"),
    L("`whoami` shows your user, `id` shows your user number and groups.", "`sudo adduser maya` creates a user on Debian and Ubuntu (`useradd` is the lower-level command).", "`sudo usermod -aG docker maya` adds Maya to the group called docker. The `-a` is important: without it you replace her other groups.", "`sudo passwd maya` sets a password.", "`groups maya` lists her groups, and `getent group docker` lists the members of a group.", "`sudo deluser maya` removes a user."),
    P("Users and groups are stored in `/etc/passwd` and `/etc/group`. Passwords are not in these files but in `/etc/shadow`, which only the administrator can read."),
    H("sudo and the root user"),
    P("The root user can do anything, including destroy the system. Instead of logging in as root, administrators use `sudo`, which runs one command with root power after checking that you are allowed. Permission to use sudo is set in `/etc/sudoers`, which you edit only with the `visudo` command, because it checks your syntax before saving. If it is wrong, you could lock yourself out. Follow the rule of least privilege: give people the smallest rights that let them do their job."),
    N("The demo above runs as a normal shell session. If you run permission experiments as root, you will not see Permission denied, because root ignores the rules. Try them as a normal user to see the errors."),
    ...task("Run the permission demo script and match each number to its letters.", "Create a file and use `chmod` to make it readable only by you. Check with `ls -l`.", "Create a second user on your practice machine, then try to read your private file as that user and note the error.", "Make a folder shared by a group: create the group, add two users, set the folder group and use mode 770."),
    ...check("You can turn 750 into letters and back without looking it up.", "You can explain why chmod 777 is a bad fix.", "You can add a user to a group without removing their other groups."),
  ], A('Who can do what', [
    n('own', 'Owner', 'rwx = 7', 0, 0, 'user'), n('grp', 'Group', 'r-x = 5', 1, 0, 'user'),
    n('oth', 'Others', 'r-x = 5', 2, 0, 'user'), n('file', 'File mode 755', 'rwxr-xr-x', 3, 0, 'data'),
  ], [
    { say: 'The owner of a file has the first set of rights. With mode 755 the owner gets 7: read, write and execute.', on: ['own'] },
    { say: 'The group gets the middle number. Here it is 5: read and execute, but no write.', flow: ['own>grp:next number'] },
    { say: 'Everyone else gets the last number, also 5 here.', flow: ['grp>oth:last number'] },
    { say: 'Together the three numbers give the mode of the file: 755.', flow: ['oth>file:combined'] },
  ]), [
    faq('What does Permission denied mean?', 'The user running the command does not have the needed right (read, write or execute) on that file or folder, or on a folder in its path. Check with ls -l and id.'),
    faq('Why does a folder need the x permission?', 'For a folder, x means you may enter it and reach the files inside. Without x on a folder you cannot cd into it, even if you can list its name.'),
    faq('Should I run everything with sudo?', 'No. Use sudo only for the commands that need it. Running programs as root makes mistakes and attacks much more damaging.'),
  ]),

  // ---------------------------------------------------------------- 6
  les(S2, 'linux-processes-packages-disks-memory-and-monitoring', 'Processes, Packages, Disk, Memory and Monitoring in Linux', 'Linux Processes, Packages, Disk and Memory',
    'Manage running programs, install software with apt, dnf or yum, check disk and memory, and write a small system report script that warns when the disk is full.', [
    P("When a server is slow or a site is down, the first questions are always the same. What is running? Is the disk full? Is memory used up? Is something using all the processor? This lesson teaches the commands that answer those questions, and then puts them together into a short script you can reuse. You will also learn how to install and update software with the package manager, which is how almost everything gets onto a Linux server."),
    H("Processes"),
    P("A process is a running program. Every process has a number called a PID. Linux starts a first process when it boots, and every other process is started by another one, so they form a family tree. These are the commands to know."),
    L("`ps aux` lists all processes with their owner, CPU use, memory use and command.", "`ps aux | grep node` finds the processes whose line contains the word node.", "`top` shows a live list sorted by CPU use. Press `q` to quit. Many people install `htop`, which is easier to read.", "`kill 1234` asks process 1234 to stop politely (it sends the TERM signal). `kill -9 1234` forces it to stop. Use the force version only if the polite one fails, because the program gets no chance to save its work.", "`command &` runs a command in the background, `jobs` lists them, and `Ctrl+C` stops the one in front."),
    H("Packages"),
    P("A package manager downloads, installs, updates and removes software, and takes care of the other packages that software needs. Which one you use depends on the distribution."),
    C('bash', `# Debian and Ubuntu
sudo apt update              # refresh the list of available packages
sudo apt install nginx       # install
sudo apt upgrade             # update everything installed
sudo apt remove nginx        # remove it

# Red Hat family (Amazon Linux, Rocky, Alma, newer CentOS and RHEL)
sudo dnf install nginx
sudo dnf update
# older systems used: sudo yum install nginx`),
    P("Always run `apt update` before `apt install` on Debian and Ubuntu, so the list is fresh. Only install software from the official repositories or from a vendor you trust, and read the instructions before adding a new repository or running a script from the internet."),
    H("Disk"),
    L("`df -h` shows how full each disk is, in readable sizes. Look at the Use% column.", "`du -sh folder` shows how big a folder is. `du -sh * | sort -h` lists the items in the current folder from small to large, which finds the space hogs quickly.", "`lsblk` lists disks and partitions.", "`mount` and `/etc/fstab` control where disks are attached. Edit `fstab` with great care: a wrong line can stop the machine from booting."),
    P("A full disk is one of the most common causes of strange failures: databases stop, logs cannot be written and uploads fail. Many teams set an alert at about 80 percent. That figure is a habit, not a rule. Choose what suits your system."),
    H("Memory"),
    P("`free -m` shows memory in megabytes. Do not be alarmed if the free number is small. Linux uses spare memory to cache files, which makes things faster, and gives it back when programs need it. The column called available is the better number to watch. If the machine starts using swap (disk used as slow memory) heavily, it will feel very slow."),
    H("A small system report script"),
    P("Here is a script that prints the host, uptime, memory and disk use, and exits with an error when the disk is fuller than a limit that you give. An exit code other than zero is how scripts tell other tools, such as a scheduler or a pipeline, that something is wrong. " + RAN),
    C('bash', code('sysinfo.sh')),
    C('text', '$ ./sysinfo.sh 80\n' + out('sysinfo-80')),
    C('text', '$ ./sysinfo.sh 1\n' + out('sysinfo-1')),
    N("The first run used a limit of 80 percent and exited with 0. The second used a limit of 1 percent, which is lower than the real use, so the script printed a warning and exited with 1."),
    H("System monitoring in one minute"),
    L("`uptime` shows how long the machine has been up and the load averages for the last 1, 5 and 15 minutes. A load near the number of CPU cores means the machine is busy.", "`top` or `htop` for processes, `free -m` for memory, `df -h` for disk.", "`journalctl -xe` and the files in `/var/log` for messages about what went wrong. You will use them in the next lesson."),
    ...task("Run `ps aux`, `top` and `free -m` on your practice machine and write down what is using the most memory.", "Install `htop` with your package manager, run it and quit with `q`.", "Copy the script, run it with different limits, and check its exit code with `echo $?`.", "Use `du -sh * | sort -h` in your home folder to find the biggest item."),
    ...check("You can find the process ID of a program and stop it.", "You can install and remove a package on your system.", "You can explain what the available column of free -m tells you."),
  ], A('Where to look first', [
    n('slow', 'Server is slow', 'what is wrong?', 0, 0, 'user'), n('cpu', 'CPU: top', 'who is busy?', 1, 0, 'tool'),
    n('mem', 'Memory: free -m', 'is available low?', 2, 0, 'tool'), n('disk', 'Disk: df -h', 'is it full?', 3, 0, 'data'),
  ], [
    { say: 'A server is slow or failing. Start with a short checklist instead of guessing.', on: ['slow'] },
    { say: 'Check the processor and processes with top or htop. Is one program using it all?', flow: ['slow>cpu:look'] },
    { say: 'Check memory with free -m, and look at the available column.', flow: ['cpu>mem:next'] },
    { say: 'Check disk space with df -h. A full disk causes many odd failures.', flow: ['mem>disk:next'] },
  ]), [
    faq('What is the difference between apt and apt-get?', 'apt-get is the older tool and apt is the newer, friendlier front end for the same package system. Both work on Debian and Ubuntu. Use apt in a terminal and apt-get in scripts if you like stable behaviour.'),
    faq('Why is my memory almost full but the server is fine?', 'Linux uses spare memory as a file cache. Look at the available figure instead of free. If available is low and swap is heavily used, you have a real shortage.'),
    faq('Is kill -9 safe?', 'It stops the process at once, without letting it save or clean up. Try a normal kill first and use -9 only when the program does not respond.'),
  ]),

  // ---------------------------------------------------------------- 7
  les(S2, 'linux-services-systemd-ssh-cron-and-logs', 'Linux Services, systemd, SSH, Cron Jobs and Logs', 'Linux Services, systemd, SSH, Cron and Logs',
    'Run programs as services with systemd and systemctl, log in with SSH keys, schedule work with cron, and read logs with journalctl and /var/log.', [
    P("A web server, a database or your Node application should start by itself when the machine boots, restart if it crashes, and run without anyone logged in. On modern Linux, a program called systemd looks after that. In this lesson you will learn how to control services, how to log in to a remote server safely with SSH keys, how to schedule repeating jobs with cron, and where to read the logs when something goes wrong. These four skills are what turn a Linux machine into a server you can trust."),
    N(NOTRUN),
    H("Services and systemd"),
    P("systemd is the first process on most modern distributions, and it starts and watches all the services. You control it with the `systemctl` command."),
    C('bash', `systemctl status nginx          # is it running? recent log lines
sudo systemctl start nginx       # start now
sudo systemctl stop nginx        # stop now
sudo systemctl restart nginx     # stop then start
sudo systemctl reload nginx      # re-read config without dropping connections (if supported)
sudo systemctl enable nginx      # start at every boot
sudo systemctl disable nginx     # do not start at boot
systemctl is-active nginx        # prints active or inactive`),
    P("Two ideas are separate: start means run it now, and enable means run it at boot. Beginners often do one and forget the other. `enable --now` does both together."),
    H("Writing your own service"),
    P("To run your own program as a service, you describe it in a unit file. Here is a unit for a Node application. It runs as a normal user, restarts if it crashes, and reads settings from a file that only the owner can see."),
    C('ini', `# /etc/systemd/system/jobtracker.service
[Unit]
Description=Job Tracker API
After=network.target

[Service]
Type=simple
User=deploy
WorkingDirectory=/opt/jobtracker
EnvironmentFile=/etc/jobtracker.env
ExecStart=/usr/bin/node server.js
Restart=on-failure
RestartSec=3

[Install]
WantedBy=multi-user.target`),
    C('bash', `sudo systemctl daemon-reload            # tell systemd about the new file
sudo systemctl enable --now jobtracker
systemctl status jobtracker
journalctl -u jobtracker -f              # follow its logs`),
    P("Keep passwords and keys in the `EnvironmentFile`, not in the unit file, and set that file to mode 600 so only its owner can read it."),
    H("SSH: logging in to a remote server"),
    P("SSH gives you a secure terminal on another machine. Passwords can be guessed, so servers should use key pairs. A key pair has a private key, which stays on your computer and is never shared, and a public key, which you place on the server. The server can then check that you hold the private key without it ever travelling over the network."),
    C('bash', `ssh-keygen -t ed25519 -C "asha laptop"      # creates ~/.ssh/id_ed25519 and .pub
ssh-copy-id deploy@203.0.113.10              # puts the public key on the server
ssh deploy@203.0.113.10                      # log in with the key
chmod 600 ~/.ssh/id_ed25519                  # the private key must be private`),
    P("The address 203.0.113.10 is a documentation example, not a real server. A short file called `~/.ssh/config` saves typing, for example a block with `Host jobs`, `HostName 203.0.113.10`, `User deploy` and `IdentityFile ~/.ssh/id_ed25519`, after which `ssh jobs` is enough. On the server, hardening usually means turning off password login (`PasswordAuthentication no`) and root login (`PermitRootLogin no`) in `/etc/ssh/sshd_config`, then reloading the `ssh` service. Before you close your current session, open a second one and check that you can still log in, so that a typing mistake does not lock you out."),
    H("Cron jobs"),
    P("Cron runs commands on a schedule. You edit your list of jobs with `crontab -e`. Each line has five time fields, then the command: minute, hour, day of month, month, day of week."),
    C('text', `# m  h  dom mon dow  command
30 2  *   *   *    /opt/scripts/backup.sh /var/www /backups 7 >> /var/log/backup.log 2>&1
0  *  *   *   *    /opt/scripts/sysinfo.sh 85 || echo "disk warning" | logger -t sysinfo
*/5 * *   *   *    /opt/scripts/healthcheck.sh 127.0.0.1 3000 /health`),
    L("The first line runs at 02:30 every day. The second runs at the start of every hour. The third runs every five minutes.", "Use full paths in cron. Cron has a very small environment, so a command that works in your terminal can fail there.", "Send output to a log file with `>> file 2>&1`, otherwise errors vanish.", "Check the schedule with a site such as crontab.guru, and make jobs safe to run twice."),
    H("Logs"),
    L("`journalctl -u servicename` shows a service’s logs. Add `-f` to follow, `--since \"1 hour ago\"` to limit the time, and `-p err` to show only errors.", "`/var/log/syslog` (Debian and Ubuntu) or `/var/log/messages` (Red Hat family) hold general messages.", "`/var/log/auth.log` or `/var/log/secure` show who logged in and who failed.", "`/var/log/nginx/error.log` and `access.log` for a web server.", "`tail -f` follows a file, and `grep ERROR file` filters it."),
    P("Logs grow, and a full disk stops servers. The `logrotate` tool is set up on most systems to compress and delete old logs. Check that your own application’s log file is covered."),
    ...task("Install nginx on a practice machine and practise start, stop, enable and status.", "Write a unit file for a tiny script or Node app, load it and read its logs with `journalctl -u`.", "Create an SSH key pair, put the public key on a practice server and log in without a password.", "Add a cron job that appends the date to a file every minute, check it, then remove it."),
    ...check("`systemctl status` shows your service as active (running).", "You can log in with your key and not your password.", "Your cron job leaves lines in its log file."),
  ], A('A service that stays up', [
    n('boot', 'Machine boots', 'systemd starts', 0, 0, 'tool'), n('svc', 'Your service', 'unit file', 1, 0, 'app'),
    n('crash', 'It crashes', 'out of memory, bug', 2, 0, 'user'), n('log', 'journalctl', 'shows what happened', 3, 0, 'data'),
  ], [
    { say: 'When the machine boots, systemd starts every enabled service.', on: ['boot'] },
    { say: 'Your service starts from its unit file, running as the user you chose.', flow: ['boot>svc:enable'] },
    { say: 'If it crashes, systemd restarts it after the delay set by Restart and RestartSec.', flow: ['svc>crash:fails'] },
    { say: 'Every start and every message is recorded. journalctl -u shows the story.', flow: ['crash>log:read'] },
  ]), [
    faq('What is the difference between start and enable?', 'Start runs the service now. Enable makes it start automatically at every boot. You usually want both, and enable --now does both in one command.'),
    faq('Why is my cron job not running?', 'Common causes are a wrong time field, a relative path, a missing environment, or no permission to run the script. Use full paths, send the output to a log file and check the cron log.'),
    faq('Is it safe to share my SSH public key?', 'Yes. The public key is meant to be shared. Never share the private key (the file without .pub).'),
  ]),

  // ---------------------------------------------------------------- 8
  les(S2, 'bash-scripting-for-devops', 'Bash Scripting for DevOps: Variables, Loops, Backups and Log Checks', 'Bash Scripting for DevOps Beginners',
    'Write safe Bash scripts with variables, arguments, if tests, loops and exit codes, and build a backup script and a log summary script that were really run.', [
    P("A script is a text file of commands. When you notice that you are typing the same five commands every day, that is a script waiting to be written. Scripts are the glue of DevOps: they back up folders, check that services are alive, prepare servers and run inside pipelines. Bash is the shell on almost every Linux server, so a small amount of Bash goes a long way. This lesson teaches the pieces you need and gives you three working scripts."),
    H("The first line and the safety line"),
    C('bash', `#!/usr/bin/env bash
set -euo pipefail`),
    L("`#!/usr/bin/env bash` tells the system which program should run the file.", "`set -e` stops the script when a command fails, instead of carrying on and doing damage.", "`set -u` treats an unset variable as an error, which catches typos.", "`set -o pipefail` makes a pipeline fail if any part of it fails."),
    P("Save the file, for example as `hello.sh`, make it executable with `chmod +x hello.sh` and run it with `./hello.sh`."),
    H("Variables, arguments and quotes"),
    C('bash', `NAME="devops"
echo "Hello, $NAME"
SRC="\${1:?give a source folder}"      # first argument, or stop with this message
KEEP="\${3:-7}"                         # third argument, default 7
TODAY=$(date +%F)                      # capture the output of a command
echo "Backup for $TODAY"`),
    P("There must be no spaces around the equals sign when you set a variable. Put variables inside double quotes, as in `\"$NAME\"`, so that file names with spaces do not break your script. `$1`, `$2` are the arguments and `$#` is how many there are. `$?` is the exit code of the last command: 0 means success and anything else means failure."),
    H("Tests and loops"),
    C('bash', `if [ -d "$SRC" ]; then
  echo "folder exists"
elif [ -f "$SRC" ]; then
  echo "it is a file"
else
  echo "not found" >&2      # send the message to the error stream
  exit 2
fi

for f in *.log; do
  echo "checking $f"
done

while read -r line; do
  echo "line: $line"
done < sample.log`),
    L("`-d` tests for a folder, `-f` for a file, `-r` for readable, `-z` for an empty text, and `-eq`, `-lt` and `-ge` compare numbers.", "Use `&&` to run the next command only if the first succeeded, and `||` to run it only if it failed.", "A function groups steps: `backup() { ... }`, then call it by name."),
    H("Script 1: a backup with a retention rule"),
    P("This script packs a folder into a dated `.tar.gz` and deletes the oldest backups beyond a number you choose. It was run in the course lab with four backups in a row and a limit of two, and it created four files and removed the two oldest. " + RAN),
    C('bash', code('backup.sh')),
    C('text', `$ ./backup.sh /srv/site /srv/backups 2
created site-20261112-022321.tar.gz
created site-20261112-022322.tar.gz
created site-20261112-022323.tar.gz
removed site-20261112-022321.tar.gz
created site-20261112-022324.tar.gz
removed site-20261112-022322.tar.gz`),
    N("A backup you have never restored is only a hope. After you make one, unpack it somewhere else with `tar -xzf` and check the files. Also copy backups to another machine or storage service, because a backup on the same disk does not help if the disk fails."),
    H("Script 2: summarise a log"),
    P("This script counts log lines by level, shows which service has the most errors and prints the most common error messages, using `awk`, `grep`, `sort` and `uniq`. Here it runs on a small sample file. The log lines are made up."),
    C('bash', code('logwatch.sh')),
    C('text', out('logwatch')),
    H("Script 3: a health check you can reuse"),
    P("This script checks that a TCP port accepts connections and that a web address answers with code 200. It exits with 0 when healthy and 1 when not, so a scheduler or pipeline can act on the result. In the lab it was tested against a small local web server: it printed OK for the home page, FAIL with 404 for a missing page, and FAIL when the server was stopped."),
    C('bash', code('healthcheck.sh')),
    C('text', `$ ./healthcheck.sh 127.0.0.1 8765 /
OK: 127.0.0.1:8765/ answered 200
$ ./healthcheck.sh 127.0.0.1 8765 /missing
FAIL: 127.0.0.1:8765/missing answered 404
$ ./healthcheck.sh 127.0.0.1 8765        # server stopped
FAIL: 127.0.0.1:8765 is not accepting connections`),
    H("Good habits"),
    L("Test scripts on copies of data, not on the real thing. Run `bash -n script.sh` to check the syntax without running it, and `bash -x script.sh` to see each command as it runs.", "Never put passwords in a script. Read them from the environment or a protected file.", "Make scripts safe to run twice (idempotent), because schedulers and people run things again.", "Write a usage line at the top, and print clear messages. Future you will not remember."),
    ...task("Type the backup script, run it on a folder of test files, and check that old backups are removed.", "Run the log script on your own application log, then change it to also show the most active hour.", "Use the health check against your own site or a local server, and print its exit code with `echo $?`.", "Write a script of your own that automates something you do by hand every day."),
    ...check("Your scripts stop with a clear message when an argument is missing.", "`bash -n` reports no syntax errors for each script.", "You restored a backup into a different folder and the files match."),
  ], A('A script in a pipeline', [
    n('cron', 'Scheduler', 'cron or a pipeline', 0, 0, 'tool'), n('scr', 'Your script', 'checks and acts', 1, 0, 'app'),
    n('code', 'Exit code', '0 good, other bad', 2, 0, 'data'), n('act', 'Next action', 'alert or continue', 3, 0, 'user'),
  ], [
    { say: 'A scheduler such as cron, or a pipeline step, starts the script.', on: ['cron'] },
    { say: 'The script does its work: a backup, a log check or a health check.', flow: ['cron>scr:run'] },
    { say: 'It finishes with an exit code. Zero means success and anything else means failure.', flow: ['scr>code:finish'] },
    { say: 'Tools read the code. A pipeline stops on failure, and an alert can be sent.', flow: ['code>act:decide'] },
  ]), [
    faq('Should I learn Bash or Python for DevOps?', 'Learn both over time. Bash is best for short glue tasks on Linux. Python suits longer logic, data handling and working with cloud APIs. This course uses Bash first and Python where it helps.'),
    faq('What does set -euo pipefail do?', 'It makes the script stop on the first failing command, on an unset variable and on a failed part of a pipe. It turns silent mistakes into clear errors.'),
    faq('Why do my scripts fail in cron but work in my terminal?', 'Cron runs with a minimal environment and a short PATH. Use full paths to commands and files and redirect output to a log file to see the error.'),
  ]),
];
