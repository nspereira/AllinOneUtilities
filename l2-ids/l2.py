import socket
import struct

s = socket.socket(socket.AF_PACKET, socket.SOCK_RAW, socket.htons(0x0003))

s.bind(('wlanmon1',0x0003))


def addr(s):
	return "{}{}:{}{}:{}{}:{}{}:{}{}:{}{}".format(*s.upper())

ap_list = []

while True:
	pkt = s.recvfrom(2048)[0]

	if pkt[2:4]=='$\x00':
		len_of_header = struct.unpack('h', pkt[2:4])[0]
		radio_tap_header_frame = pkt[:len_of_header].encode('hex')
		beacon_frame = pkt[len_of_header:len_of_header+24].encode('hex')
		f_type = beacon_frame[:2]
		addr1  = beacon_frame[8:20]
		addr2  = beacon_frame[20:32]
		addr3  = beacon_frame[32:44]

		try:
			len_of_ssid = ord(pkt[73])
			ssid   = pkt[74:74+len_of_ssid]
		except (IOError):
			ssid = "Unknown"

		if addr2 not in ap_list and f_type=='80':

			ap_list.append(addr2)

			print ("""\
        ++++++++++ [ Beacon Frame ] ++++++++++++++++++++\
        Frame Type	:	{}\
        SSID		:	{}\
        Receiver	:	{}\
        Transmitter	:	{}\
        Source		:	{}\
              """.format(f_type,
				ssid ,	
				addr(addr1),
				addr(addr2), 
				addr(addr3)
				))