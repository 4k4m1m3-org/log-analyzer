# @4k4m1m3/log-analyzer

[![npm version](https://img.shields.io/npm/v/@4k4m1m3/log-analyzer)](https://www.npmjs.com/package/@4k4m1m3/log-analyzer)

[![npm downloads](https://img.shields.io/npm/dm/@4k4m1m3/log-analyzer)](https://www.npmjs.com/package/@4k4m1m3/log-analyzer)

[![GitHub stars](https://img.shields.io/github/stars/4k4m1m3-org/log-analyzer?style=social)](https://github.com/4k4m1m3-org/log-analyzer)

![Tests](https://github.com/4k4m1m3-org/log-analyzer/actions/workflows/test.yml/badge.svg)

🔎 Lightweight TypeScript log parser for security monitoring, infrastructure analysis and automation workflows.


## 📌 About the project

`@4k4m1m3/log-analyzer` is a lightweight TypeScript library designed to normalize different log formats into a common structure.

The goal is to simplify log processing, automation workflows and security event analysis by providing a simple and predictable API.

This project was created to explore log normalization concepts used in:

- Security monitoring platforms
- SIEM pipelines
- SOC automation workflows
- Infrastructure observability


This package is part of the 4k4m1m3 security learning ecosystem and is connected with the Homelab SOC project:

🌐 https://4k4m1m3.com/homelab-soc/


## 🚀 Features

- Written in TypeScript
- Zero runtime dependencies
- Simple and predictable API
- Automatic log format detection
- Normalized event structure
- Strong TypeScript support
- Designed for security and infrastructure environments
- Easy integration with monitoring and SIEM workflows


## 📦 Installation

Install using npm:

```bash
npm install @4k4m1m3/log-analyzer
````

## ⚡ Quick Start

```typescript
import { analyze } from "@4k4m1m3/log-analyzer";

const log =
  "Jul 23 18:45:11 ubuntu sshd[1234]: Accepted password for root";

const result = analyze(log);

console.log(result);
```

Output:

```json
{
  "ok": true,
  "entry": {
    "source": "linux-syslog",
    "timestamp": "2026-07-23T23:45:11.000Z",
    "severity": "info",
    "message": "Accepted password for root",
    "raw": "Jul 23 18:45:11 ubuntu sshd[1234]: Accepted password for root"
  }
}
```

## 📚 Supported Log Formats

Current version: `0.1.0`

Supported:

✅ Linux Syslog

✅ HTTP Access Logs (Apache/Nginx compatible)

Future releases will introduce more dedicated parsers and additional log sources.

## 🔍 API Reference

### analyze(log: string)

Receives a raw log line and attempts to automatically detect and parse the format.

Successful response:

```typescript
{
  ok: true,
  entry: {
    source: string,
    timestamp: Date,
    severity: string,
    message: string,
    raw: string
  }
}
```

Failed response:

```typescript
{
  ok: false,
  error: string,
  raw: string
}
```

## 🧪 Examples

### 🐧 Linux Syslog

Input:

```text
Jul 23 18:45:11 ubuntu sshd[1234]: Accepted password for root
```

Output:

```json
{
  "source": "linux-syslog",
  "severity": "info",
  "message": "Accepted password for root"
}
```

---

### 🌐 HTTP Access Log

Input:

```text
127.0.0.1 - - [23/Jul/2026:18:45:11 +0000] "GET /admin HTTP/1.1" 404 512
```

Output:

```json
{
  "source": "http-access",
  "severity": "warning",
  "message": "GET /admin HTTP/1.1"
}
```

## 🗺️ Roadmap

The project is under active development.

### Version 0.2.0

Planned:

* Dedicated Apache Access Log parser
* Dedicated Nginx Access Log parser
* Improved parser accuracy
* Expanded automated test coverage

### Version 0.3.0

Planned:

* Additional infrastructure log formats
* Improved metadata extraction
* More structured security fields
* Better event classification

### Future ideas

Exploration areas:

* 🔌 Custom parser plugins
* 🌎 Community parser ecosystem
* 🛡️ Security event enrichment
* 📊 SIEM integration helpers
* 🎯 MITRE ATT&CK metadata mapping
* 🤖 SOC automation workflows

## 🛠️ Development

Clone repository:

```bash
git clone https://github.com/4k4m1m3-org/log-analyzer.git
```

Install dependencies:

```bash
npm install
```

Build:

```bash
npm run build
```

Run tests:

```bash
npm test
```

## 🧪 Testing

The project uses Vitest for automated testing.

Current test coverage includes:

✅ Linux Syslog parsing

✅ HTTP Access Log parsing

✅ Successful log analysis

✅ Unsupported log handling

✅ Empty input handling

## 🤝 Contributing

Contributions, ideas and feature requests are welcome.

If you are interested in:

* Adding new parsers
* Improving detection logic
* Extending security capabilities
* Integrating with monitoring platforms

Feel free to open an issue or submit a pull request.

## 🔗 Related Projects

🏠 Homelab SOC

[https://4k4m1m3.com/homelab-soc/](https://4k4m1m3.com/homelab-soc/)

## 📄 License

MIT License

Copyright (c) 2026 Wuilmer Bolivar

