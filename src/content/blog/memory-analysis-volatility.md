---
title: "Memory Analysis with Volatility 3: Recovering Artifacts from a Compromised Host"
description: "Practical guide to memory forensics using Volatility 3 plugins to identify process injection, credential artifacts, and attacker tooling in RAM dumps."
author: "Sivabalan Chandra Sekaran"
pubDate: 2025-08-12
coverImage: "images/covers/volatility.svg"
tags: ["volatility", "memory-forensics", "dfir", "incident-response"]
categories: ["Memory Forensics", "Digital Forensics", "Incident Response"]
references:
  - title: "Volatility 3 Documentation"
    url: "https://volatility3.readthedocs.io/"
  - title: "The Art of Memory Forensics"
    url: "https://www.wiley.com/en-us/The+Art+of+Memory+Forensics"
---

## Scenario

During an incident response engagement, we acquired a full memory dump from a domain controller exhibiting suspicious authentication patterns. This post walks through the Volatility 3 analysis workflow used to identify Cobalt Strike beacon injection.

## Acquisition

Memory was captured using WinPMEM before containment actions altered runtime state:

```cmd title="winpmem_capture.bat"
winpmem.exe -o dc01-memory.raw --format raw
```

**Critical:** Capture memory before rebooting or terminating suspicious processes.

## Initial Triage

```bash title="volatility_basics.sh"
# Identify profile automatically (Volatility 3)
vol -f dc01-memory.raw windows.info

# List processes
vol -f dc01-memory.raw windows.pslist

# Check for hidden processes
vol -f dc01-memory.raw windows.psscan
```

Compare `pslist` vs `psscan` output — discrepancies indicate DKOM or process hiding.

## Detecting Process Injection

```bash title="injection_detection.sh"
vol -f dc01-memory.raw windows.malfind --dump
vol -f dc01-memory.raw windows.vadinfo --pid 4892
```

The `malfind` plugin identified RWX memory regions in `svchost.exe` (PID 4892) — a strong indicator of reflective DLL injection.

```python title="malfind_output.py"
# Suspicious VAD entry
Process: svchost.exe Pid: 4892
VAD Tag: VadS Protection: PAGE_EXECUTE_READWRITE
File: N/A
```

## Credential Artifacts

```bash title="credential_hunt.sh"
vol -f dc01-memory.raw windows.lsadump
vol -f dc01-memory.raw windows.hashdump
vol -f dc01-memory.raw windows.cachedump
```

> **Warning:** Handle credential output according to your organization's evidence handling procedures.

## Network Connections

```bash title="network_artifacts.sh"
vol -f dc01-memory.raw windows.netscan
```

Recovered connection to `185.x.x.x:443` from the injected `svchost.exe` process — correlating with firewall logs.

## Timeline Reconstruction

```bash title="timeline.sh"
vol -f dc01-memory.raw timeliner.Timeline
```

Combined with disk forensics, the timeline established:

1. **T+0:** Initial access via VPN credential compromise
2. **T+4h:** Cobalt Strike beacon injected into `svchost.exe`
3. **T+6h:** LSASS credential access via handle duplication

## Lessons Learned

Memory forensics provided the only evidence of in-memory-only tooling that left minimal disk artifacts. Always prioritize memory acquisition in IR engagements involving suspected APT activity.

[^1]: Volatility 3 uses symbol tables rather than profile files, simplifying analysis across Windows 10/11 builds.

[^1]: See the Volatility Foundation for updated plugin documentation and community contributions.
