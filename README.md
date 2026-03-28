# quickclaude

Quickly launch Claude Code in your project directories.

```
$ quickclaude

┌  quickclaude
│
◆  프로젝트를 선택하세요
│  ● ~/Documents/projects/autogeek
│  ○ ~/Documents/projects/my-app
│  ○ ~/Documents/projects/website
└
```

## Install

```bash
npm install -g quickclaude
```

Or run without installing:

```bash
npx quickclaude
```

## How it works

1. Scans `~/.claude/projects/` for Claude Code project directories
2. Shows an interactive list to pick from
3. Launches `claude` in the selected directory

## Requirements

- [Claude Code](https://docs.anthropic.com/en/docs/claude-code) installed
- Node.js 18+

## License

MIT
