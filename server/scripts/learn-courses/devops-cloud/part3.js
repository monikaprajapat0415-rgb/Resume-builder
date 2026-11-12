import { P, H, L, O, N, C, task, check, faq, n, A, les } from '../kit.js';
import { code, out, RAN } from './files.js';

const S3 = 'Networking Fundamentals';

export const lessons = [
  // ---------------------------------------------------------------- 9
  les(S3, 'networking-basics-osi-tcp-ip-and-ip-addresses', 'Networking Basics: OSI, TCP/IP and IP Addresses', 'Networking Basics: OSI, TCP/IP, IPs',
    'Understand how computers talk over a network: the OSI and TCP/IP models, IPv4 and IPv6, public and private IPs, and how a browser reaches a server.', [
    P("Every cloud service, container and website you will work with depends on a network. When a deployment fails with connection refused or timed out, you need to know where to look. Networking looks like a wall of strange letters at first, but the ideas are simple, and you can learn the useful part in a few lessons. This first one gives you the map: how data travels, what the layer models mean and what an IP address is."),
    H("What a network is"),
    P("A network is a group of devices that can send data to each other. Your phone and laptop on home Wi-Fi are on a small network. The internet is a huge number of networks joined together. Data is cut into small pieces called packets. Each packet carries the address it is going to, the address it came from and a piece of the message. The network delivers packets, often by different routes, and the receiving device puts them back in order."),
    H("The OSI model: seven layers"),
    P("To keep this manageable, network engineers describe the work in layers. Each layer does one job and relies on the layer below. The OSI model has seven layers. You do not need to memorise it for daily work, but interviewers like it, and it helps you to say where a problem is."),
    O("**Physical:** cables, radio signals, the bits on the wire.", "**Data link:** moves data between devices on the same local network, using MAC addresses (the fixed hardware address of a network card). Switches work here.", "**Network:** moves packets between networks using IP addresses. Routers work here.", "**Transport:** manages the conversation between two programs: TCP (reliable) or UDP (fast). Ports live here.", "**Session:** keeps a conversation open.", "**Presentation:** formats and encrypts the data, for example TLS.", "**Application:** the protocols programs speak: HTTP, DNS, SSH, SMTP."),
    P("A useful way to remember the order is the phrase from the bottom: Please Do Not Throw Sausage Pizza Away. People like silly phrases, and any phrase that helps you is fine."),
    H("The TCP/IP model: four layers"),
    P("The internet itself uses a simpler model with four layers. It is the one you will see in real life."),
    L("**Link:** the local network (Wi-Fi, Ethernet).", "**Internet:** IP addresses and routing.", "**Transport:** TCP and UDP, with ports.", "**Application:** HTTP, HTTPS, DNS, SSH and so on."),
    P("OSI layers 5, 6 and 7 are all one Application layer in TCP/IP. In practice, when someone says layer 4 they mean transport, TCP and ports. When they say layer 7 they mean the application, for example HTTP. You will hear these terms when load balancers are described: a layer 4 load balancer looks only at addresses and ports, and a layer 7 load balancer can read the web request."),
    H("IP addresses"),
    P("An IP address identifies a device on a network, like a house number in a street. There are two versions."),
    L("**IPv4** has four numbers from 0 to 255 separated by dots, for example `192.168.1.25`. It has about 4.3 billion possible addresses, which are no longer enough for all devices.", "**IPv6** has much longer addresses written in hexadecimal with colons, for example `2001:db8::1`. It has a gigantic number of addresses. Many networks run both at once."),
    H("Public and private IP addresses"),
    P("A public IP address can be reached from the whole internet and is unique. Private addresses are for use inside a home, office or cloud network only. Many networks can reuse the same private addresses, because those addresses are never routed over the open internet. Three ranges are reserved for private use in IPv4."),
    L("`10.0.0.0` to `10.255.255.255` (written 10.0.0.0/8)", "`172.16.0.0` to `172.31.255.255` (written 172.16.0.0/12)", "`192.168.0.0` to `192.168.255.255` (written 192.168.0.0/16)"),
    P("Your laptop probably has a private address such as 192.168.1.25. Your router has one public address, and translates between the two, using a technique called NAT that you will meet in a later lesson. Cloud networks use private ranges too, which is why you will choose ranges like 10.0.0.0/16 when you build a network in AWS."),
    N("The addresses in these lessons, such as 192.168.1.25 and 203.0.113.10, are examples. Addresses beginning 203.0.113, 198.51.100 and 192.0.2 are reserved for documentation, so they are safe to use in examples."),
    H("What happens when you open a web page"),
    O("Your browser asks DNS for the IP address of the site name.", "It opens a TCP connection to that address on port 443 (HTTPS).", "TLS starts: the browser and the server agree on keys, and the browser checks the server’s certificate.", "The browser sends an HTTP request: GET this page.", "The server sends back the page, and the browser shows it."),
    P("Each of these steps can fail, and each failure looks different. A wrong name gives a DNS error. A closed port or a firewall gives connection refused or a timeout. A bad certificate gives a security warning. A broken application gives an error code such as 500. When you troubleshoot, work through the steps in order, and you will find the broken one."),
    ...task("Find your computer’s private IP (`hostname -I` on Linux, `ipconfig` on Windows) and decide which private range it belongs to.", "Search for \"what is my IP\" in a browser and compare the public address with your private one.", "Write the five steps of opening a web page from memory, and name the layer of each."),
    ...check("You can explain the difference between a public and a private IP.", "You can name what each of the four TCP/IP layers does.", "You can say which step failed if a page shows a certificate warning."),
  ], A('A web request, step by step', [
    n('br', 'Browser', 'wants a page', 0, 0, 'user'), n('dns', 'DNS', 'name to IP', 1, 0, 'data'),
    n('tcp', 'TCP and TLS', 'connect on 443', 2, 0, 'tool'), n('srv', 'Web server', 'sends the page', 3, 0, 'app'),
  ], [
    { say: 'You type a site name in the browser.', on: ['br'] },
    { say: 'The browser asks DNS for the IP address behind that name.', flow: ['br>dns:who is it?'] },
    { say: 'It opens a TCP connection to that address and starts TLS to make it secure.', flow: ['dns>tcp:IP found'] },
    { say: 'The server receives the HTTP request and sends back the page.', flow: ['tcp>srv:GET /'] },
  ]), [
    faq('Do I need to memorise the OSI model?', 'Not for daily work, but you should know the main layers and where common tools sit: switches at layer 2, routers at layer 3, TCP and UDP at layer 4, HTTP and DNS at layer 7. Interviews often ask.'),
    faq('Why are private IP addresses needed?', 'There are not enough IPv4 addresses for every device. Private ranges can be reused inside many separate networks, and NAT lets those devices reach the internet through a public address.'),
    faq('Is IPv6 replacing IPv4?', 'IPv6 adoption keeps growing, and many networks use both. IPv4 is still widespread, so you must understand it, and you should learn IPv6 basics too.'),
  ]),

  // ---------------------------------------------------------------- 10
  les(S3, 'subnetting-and-cidr-made-simple', 'Subnetting and CIDR Notation Made Simple', 'Subnetting and CIDR Made Simple',
    'Learn what a subnet mask is, read CIDR notation like /24 and /16, count usable addresses, split a network into subnets and check it with Python.', [
    P("When you build a cloud network, the first thing it asks is a range such as 10.0.0.0/16, and then a range for each subnet inside it. People find subnetting scary because of the binary maths in old textbooks. You can do the practical part with one idea and one small table, and you can check every answer with a short Python script. By the end of this lesson you will be able to read /24, size a network and split it into parts."),
    H("What a subnet is"),
    P("A subnet is a smaller network cut from a bigger one. Splitting a network has real benefits. Traffic stays inside its own part, you can apply different security rules to each part (for example one subnet for public web servers and another for private databases), and addresses are organised. In AWS, Azure and Google Cloud, this is exactly how you separate public and private resources."),
    H("The subnet mask and CIDR"),
    P("An IPv4 address has 32 bits. Part of it identifies the network and the rest identifies the device inside that network. The subnet mask tells you where the split is. You will see it written two ways."),
    L("As a dotted mask: `255.255.255.0`.", "As CIDR notation (Classless Inter-Domain Routing): a slash and a number, `/24`. The number is how many bits belong to the network."),
    P("So `192.168.1.0/24` means: the first 24 bits (the first three numbers) are the network, and the last 8 bits are for devices. 8 bits give 2 to the power of 8 = 256 addresses. The more bits for the network, the fewer for devices, so a bigger slash number means a smaller network."),
    H("The one table you need"),
    L("**/16** = 65,536 addresses. Mask 255.255.0.0. A common size for a whole cloud network.", "**/24** = 256 addresses. Mask 255.255.255.0. A common size for a subnet.", "**/25** = 128 addresses.", "**/26** = 64 addresses.", "**/27** = 32 addresses.", "**/28** = 16 addresses.", "**/30** = 4 addresses, used for links between two devices.", "**/32** = 1 address, a single host."),
    P("The pattern: each time the slash number goes up by one, the number of addresses halves. The size is always 2 to the power of (32 minus the slash number)."),
    H("Usable hosts"),
    P("In a normal network, the first address is the network address (the name of the network itself) and the last is the broadcast address (to talk to everyone). Neither can be given to a device. So usable hosts equal total addresses minus 2. A /24 gives 254 usable addresses. Cloud providers reserve a few more in each subnet for their own use, which means a /24 subnet in AWS gives fewer than 254. Always check your provider’s documentation before you size a subnet tightly."),
    H("Check it with Python"),
    P("Python has the `ipaddress` module in its standard library, which does the maths for you. This small script prints the details of any network and splits it into smaller ones. " + RAN),
    C('python', code('subnet.py')),
    C('text', '$ python3 subnet.py 10.0.0.0/24\n' + out('subnet-24')),
    C('text', '$ python3 subnet.py 192.168.1.0/26\n' + out('subnet-26')),
    H("Splitting a network on paper"),
    P("Say you have 10.0.0.0/24 and need four equal subnets. Four is 2 squared, so you add two bits to the network part: /24 becomes /26. Each /26 has 64 addresses, so the subnets start at 0, 64, 128 and 192: 10.0.0.0/26, 10.0.0.64/26, 10.0.0.128/26 and 10.0.0.192/26. That matches the output above. To check that an address belongs to a subnet, see whether it lies between the first and last address of the range."),
    H("Planning a cloud network"),
    O("Choose a private range for the whole network that does not overlap other networks you may join later, for example 10.0.0.0/16. Overlaps make it impossible to connect two networks.", "Split it into subnets by role: public, private application, and private database. Make one set in each availability zone.", "Give each subnet enough room to grow, but do not waste the whole range. A /24 or /20 is a common choice for a subnet.", "Write the plan in a table before you create anything."),
    N("Subnetting tests in interviews are often about simple cases like these. Practise by splitting a /24 into /26 and /27 subnets by hand, then check with the script."),
    ...task("Run the script on three networks of your choice (for example 172.16.0.0/20 and 10.1.0.0/22) and write down the number of usable hosts.", "Plan a network: 10.0.0.0/16 with a public and a private subnet in two availability zones, using /24 subnets. List the four ranges.", "Predict, then check, how many addresses a /27 has."),
    ...check("You can say how many addresses a /26 has without a calculator.", "You can explain why usable hosts are two fewer than the total.", "Your four subnet ranges do not overlap."),
  ], A('Cutting a network', [
    n('big', '10.0.0.0/24', '256 addresses', 0, 0, 'data'), n('s1', 'Subnet A /26', '64 addresses', 1, 0, 'tool'),
    n('s2', 'Subnet B /26', '64 addresses', 2, 0, 'tool'), n('s3', 'Two more /26', '128 addresses', 3, 0, 'tool'),
  ], [
    { say: 'You start with one network: 10.0.0.0/24 holds 256 addresses.', on: ['big'] },
    { say: 'Adding two bits to the network part makes it /26. The first subnet holds 64 addresses, from 10.0.0.0.', flow: ['big>s1:split'] },
    { say: 'The next subnet starts 64 higher, at 10.0.0.64.', flow: ['s1>s2:next'] },
    { say: 'The last two start at 10.0.0.128 and 10.0.0.192. Together the four use the whole /24.', flow: ['s2>s3:rest'] },
  ]), [
    faq('What does /24 mean?', 'The first 24 of the 32 bits of the address identify the network. The remaining 8 bits are for devices, which gives 256 addresses.'),
    faq('Why do cloud subnets have fewer usable addresses?', 'Providers reserve a few addresses in every subnet for their own services such as the router and DNS. The exact number depends on the provider, so check its documentation.'),
    faq('Do I need to do subnetting in binary?', 'Understanding binary helps, but for daily DevOps work the table of sizes and a tool such as Python’s ipaddress module are enough.'),
  ]),

  // ---------------------------------------------------------------- 11
  les(S3, 'dns-dhcp-http-tcp-udp-and-ports', 'DNS, DHCP, HTTP and HTTPS, TCP and UDP, and Ports', 'DNS, DHCP, HTTP, TCP, UDP and Ports',
    'Learn what DNS and DHCP do, how HTTP and HTTPS requests and status codes work, TCP versus UDP, and the common ports a DevOps engineer should know.', [
    P("In the last two lessons you learned addresses and networks. Now come the services that make a network usable for people: DNS turns names into addresses, DHCP hands out addresses automatically, HTTP and HTTPS carry web pages, and TCP, UDP and ports decide which program on a machine receives which data. Each one shows up in daily DevOps work, especially when something fails and you must find out why."),
    H("DNS: the phone book of the internet"),
    P("People remember names such as example.com. Computers use IP addresses. DNS (Domain Name System) translates one into the other. When you ask for a name, your computer asks a resolver, usually run by your internet provider or a public service. The resolver asks the system of servers that hold the answer, and keeps the reply for a time (the TTL, time to live) so it does not have to ask again. The records you will meet most often are these."),
    L("**A:** a name to an IPv4 address. **AAAA:** a name to an IPv6 address.", "**CNAME:** a name that is an alias of another name.", "**MX:** which servers receive email for the domain.", "**TXT:** free text, used for domain verification and email security settings.", "**NS:** which servers are in charge of the domain."),
    P("When you change a DNS record, old answers stay in caches until the TTL runs out, so changes can take minutes or hours to be seen everywhere. That is called propagation, and it is a common reason for the answer: I changed it, but I still see the old site. Before a planned move, lower the TTL a day ahead. Tools such as `dig example.com` and `nslookup example.com` show what DNS answers. They are not installed in every container image, so you may need to install them."),
    H("DHCP: addresses on request"),
    P("When your phone joins Wi-Fi, nobody types an address in. DHCP (Dynamic Host Configuration Protocol) on the router gives the device an address, the subnet mask, the gateway (the way out to other networks) and the DNS server, for a limited time called a lease. Servers usually need a fixed address instead, so they get a static address or a reservation, and cloud providers handle this for you. If a device shows an address starting with 169.254, it did not get an answer from a DHCP server."),
    H("HTTP and HTTPS"),
    P("HTTP is the language of the web. The client sends a request with a method, a path and headers, and the server sends back a status code, headers and a body. HTTPS is the same conversation inside TLS, which encrypts it and proves the server’s identity with a certificate."),
    L("**Methods:** `GET` reads, `POST` creates, `PUT` or `PATCH` changes, `DELETE` removes.", "**2xx** success: `200 OK`, `201 Created`.", "**3xx** redirect: `301` moved for good, `302` moved for now.", "**4xx** the client did something wrong: `400` bad request, `401` not logged in, `403` not allowed, `404` not found, `429` too many requests.", "**5xx** the server failed: `500` internal error, `502` bad gateway, `503` unavailable, `504` gateway timeout."),
    P("In DevOps you will see 502, 503 and 504 often. They usually mean a proxy or load balancer could not get a good answer from the application behind it: the app is down, overloaded or slow. Try `curl -I https://example.com` to see the status line and headers, and `curl -v` for the full conversation."),
    H("TCP and UDP"),
    L("**TCP** sets up a connection first (the three-way handshake), numbers every piece of data, resends lost pieces and delivers in order. It is reliable and a little slower. Web, email, SSH and databases use it.", "**UDP** just sends. There is no connection and no resend. It is fast and light, and fine when old data is useless anyway: video calls, games, DNS lookups."),
    H("Ports"),
    P("An IP address finds the machine. A port number finds the program on that machine, so one server can run a web server and a database at the same time. Ports go from 0 to 65535. A program listens on a port, and a client connects to it. These are the ones worth knowing by heart."),
    L("**22** SSH", "**25 / 587** email sending (SMTP)", "**53** DNS", "**80** HTTP and **443** HTTPS", "**3306** MySQL, **5432** PostgreSQL, **27017** MongoDB, **6379** Redis", "**3000, 5000, 8080** common for development web apps"),
    P("To see what is listening on a Linux machine, use `ss -tlnp` (or `netstat -tlnp` on older systems), which shows the open TCP ports and the program for each. If your app says address already in use, another program holds the port. To test whether you can reach a port from another machine, use `curl` for web services, or the check in the health script of the Linux course."),
    N("A service that listens on 127.0.0.1 can only be reached from the same machine. To accept connections from outside, it must listen on 0.0.0.0 (all addresses) or a specific address, and the firewall must allow the port. Mixing these up is the cause of many connection refused problems when a deployment is first set up."),
    ...task("Use `curl -I` on three sites and write down each status code and the `server` header, if shown.", "Run `curl -v https://example.com` and find the steps of the TLS handshake and the request in the output.", "Install `dnsutils` (Debian and Ubuntu) or `bind-utils` (Red Hat family), run `dig` on a domain and read the A record and TTL.", "Start a small local web server, find its port with `ss -tlnp` and connect to it with `curl`."),
    ...check("You can explain what a 502 and a 404 mean and who is at fault in each case.", "You can say why a DNS change is not seen at once.", "You can match each of the ports above to its service."),
  ], A('From name to page', [
    n('c', 'Client', 'curl or browser', 0, 0, 'user'), n('d', 'DNS resolver', 'A record and TTL', 1, 0, 'data'),
    n('p', 'Port 443', 'TCP and TLS', 2, 0, 'tool'), n('s', 'Web app', 'HTTP status code', 3, 0, 'app'),
  ], [
    { say: 'A client wants example.com. It does not know the IP address yet.', on: ['c'] },
    { say: 'DNS answers with an A record, and the answer is cached for the TTL.', flow: ['c>d:resolve'] },
    { say: 'The client connects to the web port, 443, over TCP, and TLS secures the connection.', flow: ['d>p:connect'] },
    { say: 'The application answers with a status code. 200 is success, 5xx means the server failed.', flow: ['p>s:HTTP'] },
  ]), [
    faq('Why do I still see the old site after I changed DNS?', 'DNS answers are cached until their TTL expires, on resolvers and sometimes on your own computer or browser. Wait for the TTL, or lower the TTL before the change next time.'),
    faq('What is the difference between 502 and 504?', 'A 502 means the proxy got a bad answer from the application behind it. A 504 means the proxy waited and got no answer in time. Both point to a problem behind the proxy.'),
    faq('Why is DNS usually UDP and not TCP?', 'DNS questions and answers are small, so a fast UDP message is enough. DNS falls back to TCP for large answers.'),
  ]),

  // ---------------------------------------------------------------- 12
  les(S3, 'firewalls-nat-vpn-load-balancers-tls-and-troubleshooting', 'Firewalls, NAT, VPN, Load Balancers, TLS and Network Troubleshooting', 'Firewalls, NAT, VPN, Load Balancers, TLS',
    'Understand firewalls and ufw, NAT, VPNs, load balancers, reverse proxies, TLS certificates and CDNs, then follow a simple network troubleshooting method.', [
    P("This lesson joins the pieces that sit between a visitor and your application: the firewall that decides what may pass, NAT that lets private machines reach the internet, VPNs that connect networks safely, load balancers and reverse proxies that share the work, TLS that encrypts it, and the CDN that puts copies near the visitor. Then it ends with a simple method for finding network problems. Every cloud lesson later uses these ideas under different names."),
    H("Firewalls"),
    P("A firewall allows or blocks traffic using rules. A rule usually names a direction (in or out), a protocol, a port and a source or destination address. The safest approach is to block everything by default and open only what you need. On Ubuntu, the simple tool is `ufw`."),
    C('bash', `sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp        # SSH: allow this BEFORE you enable the firewall
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
sudo ufw status verbose`),
    P("The Red Hat family uses `firewalld` with `firewall-cmd`, and underneath both are built on the kernel feature called nftables or iptables. Cloud providers add their own firewalls at the network edge, called security groups and network ACLs in AWS. A request must pass every firewall on its path, so if a port is open in `ufw` but blocked in the cloud security group, it is still blocked. Always check both. This commands block was not run for this course. Be very careful with remote servers: if you enable a firewall without allowing SSH first, you lock yourself out."),
    H("NAT"),
    P("NAT (Network Address Translation) lets many devices with private addresses share one public address. When a private machine opens a connection to the internet, the NAT device swaps the private source address for its own public one, remembers the conversation, and swaps back when the answer returns. Outside machines cannot start a connection to the private machine, which is a handy side effect. In the cloud, a NAT gateway gives private servers a way out (for updates, for example) without giving them a public address."),
    H("VPN"),
    P("A VPN (Virtual Private Network) creates an encrypted tunnel across the internet. A site-to-site VPN joins two networks, for example an office and a cloud network, so they behave like one network. A remote-access VPN lets one person connect to a private network from home. Tools you will meet include WireGuard and OpenVPN, and every big cloud has managed VPN services. A VPN protects the traffic in the tunnel. It does not make a weak server safe."),
    H("Load balancers and reverse proxies"),
    L("A **reverse proxy** sits in front of one or more servers and forwards requests to them. Nginx is the common example. It can serve static files, terminate TLS, compress, cache and hide the real servers.", "A **load balancer** spreads requests over several copies of an application, and stops sending to a copy that fails its health check. Common ways to pick a server are round robin (take turns) and least connections.", "**Layer 4** balancers work with addresses and ports only. **Layer 7** balancers read the HTTP request and can route by path or host name, for example /api to one group and /blog to another."),
    P("A load balancer is what makes a web service both scalable (add more copies) and available (a failed copy is skipped). It needs a health check endpoint in your app, such as /health, that answers 200 only when the app is truly working. The health check script from the Bash lesson is a tiny version of what a load balancer does every few seconds."),
    H("TLS and certificates"),
    P("TLS encrypts the connection and proves who the server is. A certificate says: this public key belongs to this domain, signed by an authority your browser trusts. Certificates expire, and an expired one gives every visitor a scary warning, so renewal must be automatic. Let’s Encrypt is a free authority that issues certificates through the ACME protocol, and tools like Certbot automate it. Cloud providers offer managed certificates that renew by themselves. You can look at a server’s certificate with `openssl s_client -connect example.com:443` or with `curl -vI https://example.com`, and the expiry date is in the output."),
    H("Routing, switching and CDN"),
    L("A **switch** connects devices inside one network. A **router** connects different networks and decides the next hop for each packet using a routing table. The default route (0.0.0.0/0) means: for anything I do not know, send it this way, normally to the internet gateway.", "A **CDN** (content delivery network) keeps copies of your files on servers in many places, so visitors get them from a nearby server. This makes pages load faster, takes load off your server and can absorb some attacks. It works best for images, scripts and pages that do not change per user."),
    H("Network configuration on Linux"),
    P("Before you can troubleshoot, you need to see how a Linux machine is set up. These commands only read information, so they are safe to try. They were not run for this course on a real server, and the output differs on every machine."),
    C('bash', `ip addr                    # interfaces and their IP addresses (older systems: ifconfig)
ip route                   # the routing table, including the default gateway
hostname -I                # just the addresses
cat /etc/resolv.conf       # which DNS servers this machine asks
cat /etc/hosts             # fixed name-to-address entries, checked before DNS
hostnamectl                # the machine name`),
    P("To make a static address permanent you edit the network configuration of your distribution: Ubuntu uses Netplan files in `/etc/netplan/`, Red Hat style systems use NetworkManager (`nmcli`). In the cloud you almost never edit this by hand, because the provider\u2019s DHCP gives the machine its address, so change addresses in the cloud console or in code instead. A wrong network change on a remote server can cut your own connection, so keep a second way in, such as the provider\u2019s console."),
    H("A troubleshooting method"),
    P("When something cannot connect, do not guess. Go from the bottom up and from near to far, and change only one thing at a time."),
    O("**Is the name right?** Check DNS with `dig` or `nslookup`.", "**Can I reach the machine?** Try `ping` (some networks block it, so a failed ping is not proof).", "**Is the port open?** Test from the client with the health script, `curl` or `nc -vz host port`.", "**Is the service listening?** On the server, `ss -tlnp` shows what listens and on which address.", "**Is a firewall in the way?** Check the local firewall, the cloud security group and any network ACL.", "**Does the application answer?** Use `curl -v` and read the status code. Then read the application logs."),
    P("This small script is the port and URL test from the Bash lesson. It tells you at once whether the failure is at the port (nothing is listening or a firewall drops it) or in the application (a status code other than 200). It was run in the course lab against a local test server. " + RAN),
    C('bash', code('healthcheck.sh')),
    C('text', `$ ./healthcheck.sh 127.0.0.1 8765 /
OK: 127.0.0.1:8765/ answered 200
$ ./healthcheck.sh 127.0.0.1 8765 /missing
FAIL: 127.0.0.1:8765/missing answered 404
$ ./healthcheck.sh 127.0.0.1 8765
FAIL: 127.0.0.1:8765 is not accepting connections`),
    ...task("On a practice machine, start a simple web server (for example `python3 -m http.server 8000`) and test it with the health script, then stop it and test again.", "Draw the path of a request from a visitor to a private application server through a CDN, a load balancer and a firewall.", "Look at the certificate of a site you use and find its expiry date.", "Write the six troubleshooting steps on a card and use them the next time something does not connect."),
    ...check("You can explain what NAT does and why a private server cannot be reached from the internet directly.", "You can say the difference between a reverse proxy and a load balancer.", "Your health check shows the three different results when you test OK, 404 and a stopped server."),
  ], A('Between visitor and app', [
    n('v', 'Visitor', 'browser', 0, 0, 'user'), n('cdn', 'CDN and firewall', 'cache and filter', 1, 0, 'tool'),
    n('lb', 'Load balancer', 'health checks', 2, 0, 'tool'), n('app', 'App servers', 'private network', 3, 0, 'app'),
  ], [
    { say: 'A visitor requests your site over HTTPS.', on: ['v'] },
    { say: 'A CDN may answer from a nearby copy. Firewall rules decide what traffic is allowed through.', flow: ['v>cdn:HTTPS'] },
    { say: 'The load balancer picks a healthy copy of the application, and skips any that fail the health check.', flow: ['cdn>lb:forward'] },
    { say: 'The application servers live in a private network and answer through the load balancer.', flow: ['lb>app:one copy'] },
  ]), [
    faq('What is the difference between a firewall and a security group?', 'A security group is a firewall that the cloud provider applies to your virtual machines. The idea is the same: rules about allowed traffic. In AWS, security groups remember connections, while network ACLs do not.'),
    faq('Can a failed ping prove a server is down?', 'No. Many networks and servers block ping on purpose. Test the real service on its real port instead.'),
    faq('How do I stop certificates from expiring?', 'Use automatic renewal: Certbot or another ACME client, or a managed certificate from your cloud provider. Add a monitoring alert for the expiry date as a second safety net.'),
  ]),
];
