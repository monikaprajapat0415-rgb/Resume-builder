"""subnet.py - answer the usual CIDR questions with Python's standard library."""
import ipaddress, sys

net = ipaddress.ip_network(sys.argv[1] if len(sys.argv) > 1 else "10.0.0.0/24")
print(f"Network:      {net.network_address}/{net.prefixlen}")
print(f"Netmask:      {net.netmask}")
print(f"Broadcast:    {net.broadcast_address}")
hosts = list(net.hosts())
print(f"Addresses:    {net.num_addresses}")
print(f"Usable hosts: {len(hosts)}  ({hosts[0]} to {hosts[-1]})" if hosts else "Usable hosts: 0")
print(f"Private:      {net.is_private}")

if net.prefixlen < 30:
    new_prefix = min(net.prefixlen + 2, 30)
    print(f"\nSplit into /{new_prefix} subnets:")
    for s in net.subnets(new_prefix=new_prefix):
        print(f"  {s}")
