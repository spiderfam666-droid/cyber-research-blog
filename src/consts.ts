export const SITE = {
  title: 'Sivabalan Chandra Sekaran — Security Research',
  description:
    'Independent cybersecurity research on Windows internals, Active Directory, malware analysis, and offensive security techniques.',
  author: 'Sivabalan Chandra Sekaran',
  role: 'Cybersecurity Researcher',
  email: 'alex.chen@example.com',
  github: 'https://github.com/yourusername',
  linkedin: 'https://linkedin.com/in/yourusername',
  twitter: 'https://twitter.com/yourusername',
  url: 'https://yourusername.github.io/cybersec-research-blog',
  ogImage: 'images/og-default.svg',
  language: 'en',
} as const;

export const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/research/', label: 'Research' },
  { href: '/blog/', label: 'Blog' },
  { href: '/projects/', label: 'Projects' },
  { href: '/categories/', label: 'Categories' },
  { href: '/about/', label: 'About' },
  { href: '/contact/', label: 'Contact' },
] as const;

export const RESEARCH_CATEGORIES = [
  {
    slug: 'windows-internals',
    name: 'Windows Internals',
    description: 'Kernel structures, process internals, and Windows security architecture.',
    icon: 'windows',
  },
  {
    slug: 'active-directory',
    name: 'Active Directory',
    description: 'Identity attacks, Kerberos, LDAP, and enterprise lateral movement.',
    icon: 'directory',
  },
  {
    slug: 'reverse-engineering',
    name: 'Reverse Engineering',
    description: 'Static and dynamic analysis of binaries and firmware.',
    icon: 'binary',
  },
  {
    slug: 'malware-analysis',
    name: 'Malware Analysis',
    description: 'Dissecting malicious code, C2 protocols, and evasion techniques.',
    icon: 'malware',
  },
  {
    slug: 'cloud-security',
    name: 'Cloud Security',
    description: 'AWS, Azure, GCP misconfigurations and cloud-native threats.',
    icon: 'cloud',
  },
  {
    slug: 'linux',
    name: 'Linux',
    description: 'Privilege escalation, container escape, and Linux forensics.',
    icon: 'linux',
  },
  {
    slug: 'web-security',
    name: 'Web Security',
    description: 'Application security, HTTP smuggling, and modern web attacks.',
    icon: 'web',
  },
  {
    slug: 'cryptography',
    name: 'Cryptography',
    description: 'Cryptographic protocols, implementation flaws, and key management.',
    icon: 'crypto',
  },
  {
    slug: 'memory-forensics',
    name: 'Memory Forensics',
    description: 'RAM analysis, Volatility, and artifact recovery from live memory.',
    icon: 'memory',
  },
  {
    slug: 'digital-forensics',
    name: 'Digital Forensics',
    description: 'Disk imaging, timeline analysis, and evidence preservation.',
    icon: 'forensics',
  },
  {
    slug: 'threat-hunting',
    name: 'Threat Hunting',
    description: 'Hypothesis-driven hunting and adversary behavior mapping.',
    icon: 'hunt',
  },
  {
    slug: 'detection-engineering',
    name: 'Detection Engineering',
    description: 'Sigma rules, YARA, and building high-fidelity detections.',
    icon: 'detection',
  },
  {
    slug: 'purple-team',
    name: 'Purple Team',
    description: 'Collaborative offense-defense exercises and control validation.',
    icon: 'purple',
  },
  {
    slug: 'incident-response',
    name: 'Incident Response',
    description: 'Containment, eradication, and post-incident analysis.',
    icon: 'ir',
  },
] as const;

export type CategorySlug = (typeof RESEARCH_CATEGORIES)[number]['slug'];

export function getCategoryBySlug(slug: string) {
  return RESEARCH_CATEGORIES.find((c) => c.slug === slug);
}

export function categoryToSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}
