# Cursor Scratchpad RFC

A live prototype exploring private, per-chat scratchpads in Cursor.

## Live Demo

https://cursor-scratchpad-rfc.vercel.app/

![Cursor scratchpad prototype demo](./demo.gif)

## Why

When working with an AI chat, I often want a place to keep my own notes: reminders, links, todos, decisions, or follow-ups. Today those notes either live outside the chat or get mixed into prompts.

This prototype explores a lightweight alternative: a scratchpad attached to each chat, kept visually and behaviorally separate from the AI conversation.

- Each chat has its own scratchpad.
- Notes are private/local to the user.
- Notes are not sent to the AI.
- The scratchpad feels like a quiet utility, not another chat message or prompt input.

## What It Shows

The mock recreates a Cursor-like chat surface and adds a small scratchpad icon in the bottom status area next to the context usage indicator. Clicking it opens a tray from the bottom of the chat window.

The tray supports:

- `Escape` to close
- `[ ]` or `[]` to create a todo
- `[x]` to create a checked todo
- clicking a todo marker to toggle it
- a footer that reinforces `Private to this chat` and `Saved locally`

## Design Decisions

The scratchpad intentionally lives in the status/tooling area rather than beside the prompt composer. That keeps the mental model separate:

- Composer: what I want to send to the AI
- Scratchpad: what I want to remember for myself

The tray covers the lower chat area while open, so it feels attached to the current chat without competing with chat messages. The interaction is deliberately small: no side panel, no modal header, no AI affordance, and no persistence/API plumbing in this mock.

Motion is intentionally restrained: transform-only, `450ms`, `cubic-bezier(0.22, 1, 0.36, 1)`, no opacity fade, no bounce.

## Stack

Vite, React, TypeScript, Tailwind CSS, and shadcn/ui primitives. Mock data only.

## Run Locally

```bash
npm install
npm run dev
```

Then open the local Vite URL printed in the terminal.

```bash
npm run dev
npm run build
npm run lint
```