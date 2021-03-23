# Host discovery Tool Beta version

Host discovery tool is capable of detecting any new entry on your network and also capable of detecting ARP Spoofing attacks, it works as a daemon

### Features

-Host discovery:
  -Passive scan with details(hostname, ip, mac addr, mac vendor, ports, OS fingerprint)
    -ARP, DHCP, NBNS
  -Active scan(ICMP)
-ARP poisoning detection

## Usage

`sudo python3 host_discovery.py <network interface>`