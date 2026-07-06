---
title: "Windows Token Abuse: SeImpersonatePrivilege and Potato Variants"
description: "Analyzing how Windows access tokens enable local privilege escalation through SeImpersonatePrivilege abuse and modern Potato-family exploits."
author: "Sivabalan Chandra Sekaran"
pubDate: 2025-09-20
coverImage: "images/covers/token-abuse.svg"
tags: ["windows", "privilege-escalation", "tokens", "potato"]
categories: ["Windows Internals", "Purple Team"]
references:
  - title: "Rotten Potato — Stephen Breen"
    url: "https://foxglovesecurity.com/2016/09/26/rotten-potato-privilege-escalation-from-service-accounts-to-system/"
  - title: "PrintSpoofer — itm4n"
    url: "https://github.com/itm4n/PrintSpoofer"
---

## Background

Windows access tokens represent a security context for a logged-on user. When a service account holds `SeImpersonatePrivilege`, it can impersonate tokens of clients connecting to it — a primitive that has powered an entire class of local privilege escalation exploits.

## Token Internals

Each process maintains a primary token and may create impersonation tokens. The `SeImpersonatePrivilege` allows impersonation at `SecurityImpersonation` level, sufficient to execute code as the impersonated user.

```c title="token_structures.c"
// Simplified view of relevant structures
typedef struct _TOKEN {
    TOKEN_SOURCE TokenSource;
    LUID TokenId;
    LUID AuthenticationId;
    LUID ModifiedId;
    // ...
    PTOKEN_USER User;
    PSID_AND_ATTRIBUTES Groups;
} TOKEN, *PTOKEN;
```

## The Potato Family

| Exploit | Mechanism | Requirements |
|---------|-----------|--------------|
| Juicy Potato | COM activation | SeImpersonate, Windows ≤ Server 2016 |
| Rogue Potato | RPC redirection | SeImpersonate |
| PrintSpoofer | Spooler service | SeImpersonate |
| GodPotato | DCOM | SeImpersonate |

## PrintSpoofer in Practice

When `Spooler` runs as SYSTEM and accepts connections from impersonation-capable accounts:

```powershell title="printspoofer.ps1"
# Verify privilege
whoami /priv
# Look for SeImpersonatePrivilege

# Execute PrintSpoofer
.\PrintSpoofer.exe -i -c cmd
```

The exploit triggers RPC authentication, captures the SYSTEM token via `RpcImpersonateClient`, and spawns a process with duplicated primary token.

## Detection

```yaml title="sigma_seimpersonate.yml"
title: SeImpersonate Privilege Assignment
logsource:
    product: windows
detection:
    selection:
        EventID: 4672
        PrivilegeList|contains: 'SeImpersonatePrivilege'
    condition: selection
```

Monitor for:

- `CreateProcess` events where parent is a service with `SeImpersonatePrivilege`
- Unexpected `NT AUTHORITY\SYSTEM` token creation from non-system parents
- Spooler/RPC activity from web service accounts

## Mitigation

1. Remove `SeImpersonatePrivilege` from service accounts where not required
2. Run services as **Virtual Accounts** or **gMSA** with minimal privileges
3. Apply Microsoft patches addressing specific COM/RPC abuse paths
4. Use **Windows Defender Application Control** to block known exploit binaries

[^1]: James Forshaw's research on token manipulation forms the foundation for understanding these abuse primitives.

[^1]: See [Windows Token Manipulation](https://googleprojectzero.blogspot.com/) for additional context from Project Zero.
