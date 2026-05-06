import { X } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import type {
  ChangeEvent,
  KeyboardEvent as ReactKeyboardEvent,
  MouseEvent as ReactMouseEvent,
} from "react"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { chatMock } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

const TODO_MARKER_HIT_WIDTH = 22

function formatTodoShortcuts(value: string) {
  return value
    .replace(/^(\s*)\[(?: )?\](?=\s|$)/gm, "$1☐")
    .replace(/^(\s*)\[x\](?=\s|$)/gim, "$1☑")
}

function getTodoMarkerPosition(value: string, cursorPosition: number) {
  const lineStart = value.lastIndexOf("\n", cursorPosition - 1) + 1
  const lineEnd = value.indexOf("\n", cursorPosition)
  const currentLine = value.slice(
    lineStart,
    lineEnd === -1 ? value.length : lineEnd,
  )
  const todoMatch = currentLine.match(/^(\s*)([☐☑])\s/)

  if (!todoMatch) {
    return null
  }

  return lineStart + todoMatch[1].length
}

function getTodoMarkerPositionFromPoint(
  textarea: HTMLTextAreaElement,
  value: string,
  clientX: number,
  clientY: number,
) {
  const styles = window.getComputedStyle(textarea)
  const rect = textarea.getBoundingClientRect()
  const fontSize = Number.parseFloat(styles.fontSize)
  const lineHeight =
    Number.parseFloat(styles.lineHeight) || Math.round(fontSize * 1.6)
  const paddingTop = Number.parseFloat(styles.paddingTop)
  const paddingLeft = Number.parseFloat(styles.paddingLeft)
  const relativeY = clientY - rect.top - paddingTop + textarea.scrollTop
  const lineIndex = Math.floor(relativeY / lineHeight)

  if (lineIndex < 0) {
    return null
  }

  const lines = value.split("\n")
  const currentLine = lines[lineIndex]

  if (currentLine === undefined) {
    return null
  }

  const todoMatch = currentLine.match(/^(\s*)([☐☑])\s/)

  if (!todoMatch) {
    return null
  }

  const markerOffset = todoMatch[1].length
  const estimatedCharacterWidth = fontSize * 0.52
  const markerX = rect.left + paddingLeft + markerOffset * estimatedCharacterWidth

  if (
    clientX < markerX - 6 ||
    clientX > markerX + TODO_MARKER_HIT_WIDTH
  ) {
    return null
  }

  return (
    lines.slice(0, lineIndex).reduce((position, line) => {
      return position + line.length + 1
    }, 0) + markerOffset
  )
}

type ScratchpadProps = {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

export function Scratchpad({ isOpen, setIsOpen }: ScratchpadProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [isHoveringTodoMarker, setIsHoveringTodoMarker] = useState(false)
  const [note, setNote] = useState(`Feature idea
Each Cursor chat gets a private scratchpad for notes, todos, links, and follow-ups.

Design decisions
- Keep notes visually separate from chat messages and the prompt composer.
- Place the entry point in the bottom status/tooling row next to context usage.
- Open as a bottom tray so it feels attached to the current chat.
- Notes are private to this chat and are not sent to the AI.

Interaction spec
- Click the scratchpad icon to open the tray.
- Press Escape to close.
- Type [ ] or [] to create a todo.
- Type [x] to create a checked todo.
- Click a todo marker to toggle it.

☐ Decide if scratchpads should persist locally or sync across machines.
☐ Explore whether notes should be searchable across chats.
☑ Keep the first prototype intentionally lightweight.`)

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const frame = window.requestAnimationFrame(() => {
      textareaRef.current?.focus({ preventScroll: true })
    })

    return () => window.cancelAnimationFrame(frame)
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) {
      return
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false)
      }
    }

    document.addEventListener("keydown", closeOnEscape)
    return () => document.removeEventListener("keydown", closeOnEscape)
  }, [isOpen])

  function handleNoteChange(event: ChangeEvent<HTMLTextAreaElement>) {
    const rawNote = event.currentTarget.value
    const formattedNote = formatTodoShortcuts(rawNote)
    const cursorPosition = event.currentTarget.selectionStart

    setNote(formattedNote)

    if (formattedNote !== rawNote) {
      window.requestAnimationFrame(() => {
        const nextCursorPosition = Math.max(
          0,
          cursorPosition + formattedNote.length - rawNote.length,
        )
        textareaRef.current?.setSelectionRange(
          nextCursorPosition,
          nextCursorPosition,
        )
      })
    }
  }

  function handleNoteKeyDown(event: ReactKeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === " " && toggleTodoAtCursor(event.currentTarget)) {
      event.preventDefault()
      return
    }

    if (event.key !== "Enter") {
      return
    }

    const textarea = event.currentTarget
    const lineStart = note.lastIndexOf("\n", textarea.selectionStart - 1) + 1
    const currentLine = note.slice(lineStart, textarea.selectionStart)
    const todoMatch = currentLine.match(/^(\s*)[☐☑]\s/)

    if (!todoMatch) {
      return
    }

    event.preventDefault()

    const insertion = `\n${todoMatch[1]}☐ `
    const nextNote =
      note.slice(0, textarea.selectionStart) +
      insertion +
      note.slice(textarea.selectionEnd)
    const nextCursorPosition = textarea.selectionStart + insertion.length

    setNote(nextNote)

    window.requestAnimationFrame(() => {
      textareaRef.current?.setSelectionRange(
        nextCursorPosition,
        nextCursorPosition,
      )
    })
  }

  function toggleTodoAtCursor(textarea: HTMLTextAreaElement) {
    const markerPosition = getTodoMarkerPosition(note, textarea.selectionStart)

    if (
      markerPosition === null ||
      textarea.selectionStart > markerPosition + 1
    ) {
      return false
    }

    toggleTodoAtPosition(markerPosition)

    return true
  }

  function toggleTodoAtPosition(markerPosition: number) {
    const nextNote =
      note.slice(0, markerPosition) +
      (note[markerPosition] === "☐" ? "☑" : "☐") +
      note.slice(markerPosition + 1)

    setNote(nextNote)

    window.requestAnimationFrame(() => {
      textareaRef.current?.setSelectionRange(
        markerPosition + 1,
        markerPosition + 1,
      )
    })
  }

  function handleNoteClick(event: ReactMouseEvent<HTMLTextAreaElement>) {
    const markerPosition = getTodoMarkerPositionFromPoint(
      event.currentTarget,
      note,
      event.clientX,
      event.clientY,
    )

    if (markerPosition === null) {
      return
    }

    event.preventDefault()
    toggleTodoAtPosition(markerPosition)
  }

  function handleNoteMouseMove(event: ReactMouseEvent<HTMLTextAreaElement>) {
    setIsHoveringTodoMarker(
      getTodoMarkerPositionFromPoint(
        event.currentTarget,
        note,
        event.clientX,
        event.clientY,
      ) !== null,
    )
  }

  return (
    <>
      <section
        aria-label={chatMock.scratchpad.title}
        className={cn(
          "absolute inset-x-[26px] bottom-0 top-[340px] z-40 flex flex-col overflow-hidden rounded-t-[26px] border-t border-white/8 bg-[#18191b]/97 text-[#f0f0f0] shadow-[0_-18px_46px_rgb(0_0_0/0.28),inset_0_1px_0_rgb(255_255_255/0.06)] backdrop-blur-xl transition-transform duration-450 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform",
          isOpen
            ? "translate-y-0"
            : "pointer-events-none translate-y-full",
        )}
      >
        <Button
          aria-label="Close scratchpad"
          className="absolute right-4 top-4 z-10 size-[36px] cursor-pointer rounded-full border border-white/8 bg-white/6 text-[#c4c5c6] shadow-[inset_0_1px_0_rgb(255_255_255/0.04)] hover:bg-white/10 hover:text-white"
          onClick={() => setIsOpen(false)}
          size="icon"
          type="button"
          variant="ghost"
        >
          <X className="size-[19px] stroke-2" />
        </Button>

        <Textarea
          aria-label="Scratchpad notes"
          className={cn(
            "min-h-0 flex-1 resize-none rounded-none border-0 bg-transparent px-6 py-5 pr-16 text-[15px] leading-6 text-[#eeeeef] shadow-none placeholder:text-[#737477] focus-visible:border-0 focus-visible:ring-0 md:text-[15px] dark:bg-transparent",
            isHoveringTodoMarker ? "cursor-pointer" : "cursor-text",
          )}
          onClick={handleNoteClick}
          onChange={handleNoteChange}
          onKeyDown={handleNoteKeyDown}
          onMouseLeave={() => setIsHoveringTodoMarker(false)}
          onMouseMove={handleNoteMouseMove}
          placeholder={chatMock.scratchpad.placeholder}
          ref={textareaRef}
          value={note}
        />

        <div className="flex items-center justify-between border-t border-white/5 px-6 py-3 text-[12px] font-medium text-[#8f9092]">
          <span>{chatMock.scratchpad.privacyStatus}</span>
          <span>{chatMock.scratchpad.savedStatus}</span>
        </div>
      </section>
    </>
  )
}
