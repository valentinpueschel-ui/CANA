# Cana Website Kit

Everything Claude Code needs to build the Cana pre-order website in VS Code — following the "build beautiful websites with Claude Code" workflow (design skills → brand brief → iterate → deploy to GitHub + Vercel).

## What's in here

```
Cana Website Kit/
├── README.md              ← you are here
├── CLAUDE.md              ← project brief Claude Code reads automatically
├── BUILD.md               ← step-by-step build + deploy guide
├── .claude/
│   └── skills/
│       ├── cana-brand/SKILL.md        ← the Cana design system (colors, type, components)
│       └── frontend-design/SKILL.md   ← how to build a beautiful, premium frontend
└── content/
    ├── products.md        ← the 4 products: verses, prices, copy
    └── site-copy.md       ← all section copy in the brand voice
```

## Setup (5 minutes)

1. **Create the project folder** on your computer, e.g. `cana-site`.
2. **Copy the contents of this kit into it** — keep the `.claude/` folder and `CLAUDE.md` at the project root. (The `.claude` folder is hidden; in VS Code you'll see it fine. On Mac Finder press `Cmd+Shift+.` to show hidden files.)
3. **Open the folder in VS Code** and start Claude Code in the terminal (`claude`).
4. Claude Code automatically reads `CLAUDE.md` and discovers the two skills in `.claude/skills/`.
5. Follow **BUILD.md** — it walks you from empty folder to a deployed site.

## The idea

- `CLAUDE.md` tells Claude *what* we're building and the rules.
- The **cana-brand skill** makes everything look like Cana (exact colors, fonts, components).
- The **frontend-design skill** makes it look genuinely premium, not generic-AI.
- `content/` holds the real words and products so nothing is placeholder.

You drive; Claude builds. Review each section, give feedback, iterate.
