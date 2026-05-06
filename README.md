# Cursor Scratchpad RFC

A small live prototype exploring per-chat scratchpads in Cursor.

This repo is a design-engineering mock intended to make the idea concrete enough to discuss in the Coinbase <> Cursor shared Slack channel. It recreates a Cursor-like chat surface with mock data, then adds a private scratchpad tray attached to the current chat.

## Live Demo

https://cursor-scratchpad-rfc.vercel.app/

![Cursor scratchpad prototype demo](./demo.gif)

## Idea

When working with an AI chat, I often want a place to keep my own notes: reminders, links, todos, decisions, or follow-ups. Today those notes either live outside the chat or get mixed into prompts.

This prototype explores a lightweight alternative:

- Each chat has its own scratchpad.
- Scratchpad notes are private/local to the user.
- Scratchpad notes are not sent to the AI.
- The scratchpad feels like a quiet utility, not another chat message or prompt input.

## Prototype

The mock keeps the core Cursor chat layout intact and adds a small scratchpad icon in the bottom status area next to the context usage indicator. Clicking it opens a tray from the bottom of the chat window.

The tray supports:

- `Escape` to close
- `[ ]` or `[]` to create a todo
- `[x]` to create a checked todo
- clicking a todo marker to toggle it
- a subtle footer that reinforces `Private to this chat` and `Saved locally`

## Design Notes

The scratchpad intentionally lives in the status/tooling area rather than beside the prompt composer. That keeps the mental model separate:

- Composer: what I want to send to the AI
- Scratchpad: what I want to remember for myself

The tray covers the lower chat area while open, which makes it feel attached to the current chat without competing with chat messages. The interaction is deliberately small: no side panel, no modal header, no AI affordance, and no persistence/API plumbing in this mock.

Motion spec:

- Tray animates with `transform` only.
- Duration: `450ms`.
- Easing: `cubic-bezier(0.22, 1, 0.36, 1)`.
- Closed state: fully translated below the chat window.
- Open state: slides up from the bottom with no opacity fade or bounce.

## Demo Script

For a short video:

1. Show the Cursor-like chat baseline.
2. Click the scratchpad icon in the bottom status row.
3. Type a quick note.
4. Type `[ ] follow up on migration plan` to show todo conversion.
5. Click the todo marker to check it.
6. Press `Escape` to close the tray.
7. Call out that these notes are private and not sent to the AI.

## Tech Stack

- Vite
- React
- TypeScript
- Tailwind CSS
- shadcn/ui primitives
- Mock data only

## Run Locally

```bash
npm install
npm run dev
```

Then open the local Vite URL printed in the terminal.

## Scripts

```bash
npm run dev
npm run build
npm run lint
```