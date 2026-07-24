# @4k4m1m3/log-analyzer

Lightweight TypeScript log parser for security monitoring, infrastructure analysis and automation workflows.

log-analyzer provides a simple API to normalize different log formats into a common structure, making it easier to process and analyze security and system events.

## Features

- Written in TypeScript
- Zero runtime dependencies
- Simple and predictable API
- Automatic log format detection
- Normalized output structure
- Designed for security and infrastructure environments

## Supported Log Formats

Current version: 0.1.0

Supported:

- Linux Syslog
- Apache Access Log
- Nginx Access Log

More formats will be added in future releases.

## Installation

Install using npm:

npm install @4k4m1m3/log-analyzer

## Usage

Example:

import { analyze } from "@4k4m1m3/log-analyzer";

const log =
  "Jul 23 18:45:11 ubuntu sshd[1234]: Accepted password for root";

const result = analyze(log);

console.log(result);

Output:

{
  ok: true,
  entry: {
    source: "linux-syslog",
    timestamp: Date,
    severity: "info",
    message: "Accepted password for root",
    raw: "Jul 23 18:45:11 ubuntu sshd[1234]: Accepted password for root"
  }
}

## API

analyze(log: string)

Receives a raw log line and attempts to detect and parse the log format.

Returns:

Success:

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

Failure:

{
  ok: false,
  error: string,
  raw: string
}

## Examples

### Linux Syslog

Input:

Jul 23 18:45:11 ubuntu sshd[1234]: Accepted password for root

Output:

{
  source: "linux-syslog",
  severity: "info",
  message: "Accepted password for root"
}

---

### Apache / Nginx Access Log

Input:

127.0.0.1 - - [23/Jul/2026:18:45:11 +0000] "GET /admin HTTP/1.1" 404 512

Output:

{
  source: "http-access",
  severity: "warning",
  message: "GET /admin HTTP/1.1"
}

## Roadmap

Planned improvements:

- Additional log formats
- Improved format detection
- Custom parser plugins
- Structured metadata extraction
- Security-focused parsers
- Integration helpers for SIEM platforms

## Development

Clone repository:

git clone https://github.com/4k4m1m3-org/log-analyzer.git

Install dependencies:

npm install

Build:

npm run build

Run tests:

npm test

## Testing

The project uses Vitest for automated testing.

Current coverage includes:

- Linux Syslog parsing
- HTTP access log parsing
- Unsupported log handling
- Empty input handling

## License

MIT License

Copyright (c) 2026 Wuilmer Bolivar
