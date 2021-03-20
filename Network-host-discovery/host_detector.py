import sys
import os
#from notifypy import Notify
import scapy.all as scapy 

n_interface = sys.argv[1] or ''  
broadcast = "ff:ff:ff:ff:ff:ff"

if os.geteuid() != 0:
    exit("You need to have root privileges to run this script.\nPlease try again, this time using 'sudo'\n...Exiting")

if not n_interface:
    print('...No NIC detected')
    print('Usage: sudo python')

op_sys = {
        0: 'Linux',
        1: 'Darwin',
        2: 'Windows'
}

def check_os():
    if sys.platform == op_sys.keys(0):
        print('Its linux')
    elif sys.platform == op_sys.keys(1):
        print('its MacOs')
    elif sys.platform == op_sys.keys(2):
        print('its windows')


def get_mac(ipadd):
    arp_request = scapy.ARP(pdst=ipadd) 
    br = scapy.Ether(dst=broadcast) 
    arp_req_br = br / arp_request 
    list_1 = scapy.srp(arp_req_br, timeout=5, 
                       verbose=False)[0] 
    return list_1[0][1].hwsrc 
  

def detect_hosts(packet):
    if scapy.TCP in packet and packet[scapy.TCP].flags & 2:
        src = packet.sprintf('{IP:%IP.src%}{IPv6:%IPv6.src%}')
        print(src)
        alert_notifications('{IP:%IP.src%}')

    '''if packet.haslayer(scapy.TCP) and packet[scapy.TCP].op == 2: 
        originalmac = get_mac(packet[scapy.ARP].psrc) 
        responsemac = packet[scapy.ARP].hwsrc 
        alert_notifications()'''


def alert_notifications(ip_src):
    notification = Notify('teste')
    notification.title = "TCP Alert"
    notification.message = "Detected TCP Syn from {ip_src}"
    notification.send()



def host_discovery(n_interface):
    scapy.sniff(iface=n_interface, store=False,  
                prn=detect_hosts) 


host_discovery(n_interface)