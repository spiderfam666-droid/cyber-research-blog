---
title: "ADPathfinder — Active Directory Attack Path Visualizer"
description: "Maps Active Directory attack paths from BloodHound data with risk scoring and remediation prioritization for enterprise security teams."
github: "https://github.com/yourusername/adpathfinder"
demo: "https://adpathfinder-demo.example.com"
technologies: ["TypeScript", "Neo4j", "D3.js", "BloodHound"]
coverImage: "images/covers/kerberoasting.svg"
screenshots:
  - "images/covers/kerberoasting.svg"
featured: false
pubDate: 2025-03-01
---

## Overview

ADPathfinder ingests BloodHound collection data and produces prioritized attack path visualizations with business-context risk scoring — helping defenders focus on paths that matter most.

## Key Features

- **Risk-weighted paths** based on target sensitivity and exploitability
- **Interactive graph** with D3.js force-directed layout
- **Remediation suggestions** mapped to MITRE ATT&CK techniques
- **Export** to PDF for executive reporting and ticket creation

## Integration

```bash
# Import BloodHound JSON export
adpathfinder import --bloodhound /path/to/export/ --neo4j bolt://localhost:7687
adpathfinder analyze --target "DOMAIN ADMINS"
```

Designed for purple team engagements and continuous AD security assessment programs.
