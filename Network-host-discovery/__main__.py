import daemon
from host_detector import host_discovery

if __name__ == "__main__":
  with daemon.DaemonContext():
    host_discovery()