# Claude Code Configuration

This directory contains configuration for Claude Code.

## Structure

- `commands/` - Custom slash commands that can be invoked with `/command-name`
- `settings.json` - Claude Code settings (optional)

## Custom Commands

Create markdown files in the `commands/` directory to define custom slash commands.

Example: `.claude/commands/test.md`
```markdown
Run the test suite and report any failures
```

This can be invoked with `/test` in Claude Code.

For more information, visit: https://docs.claude.com/en/docs/claude-code
