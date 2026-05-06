import { NotebookPen, X } from "lucide-react"
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

function formatTodoShortcuts(value: string) {
  return value
    .replace(/^(\s*)\[ \](?=\s|$)/gm, "$1☐")
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

export function Scratchpad() {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [note, setNote] = useState(
    "Mention that notes stay attached to this chat and never become prompt context.",
  )

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

    return true
  }

  function handleNoteClick(event: ReactMouseEvent<HTMLTextAreaElement>) {
    toggleTodoAtCursor(event.currentTarget)
  }

  return (
    <>
      <Button
        aria-expanded={isOpen}
        aria-label="Open scratchpad"
        className={cn(
          "absolute right-[34px] bottom-[124px] z-50 size-[48px] cursor-pointer rounded-full border border-white/10 bg-[#242526]/95 text-[#d7d7d8] shadow-[0_14px_36px_rgb(0_0_0/0.38),inset_0_1px_0_rgb(255_255_255/0.08)] backdrop-blur transition-all hover:bg-[#2d2e30] hover:text-white",
          isOpen && "pointer-events-none translate-y-1 scale-95 opacity-0",
        )}
        onClick={() => setIsOpen(true)}
        size="icon"
        type="button"
        variant="ghost"
      >
        <NotebookPen className="size-[23px] stroke-[1.8]" />
      </Button>

      <section
        aria-label={chatMock.scratchpad.title}
        className={cn(
          "absolute inset-x-[26px] bottom-0 top-[340px] z-40 flex flex-col overflow-hidden rounded-t-[26px] border-t border-white/8 bg-[#18191b]/97 text-[#f0f0f0] shadow-[0_-18px_46px_rgb(0_0_0/0.28),inset_0_1px_0_rgb(255_255_255/0.06)] backdrop-blur-xl transition-all duration-300 ease-out",
          isOpen
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-full opacity-0",
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
          className="min-h-0 flex-1 resize-none rounded-none border-0 bg-transparent px-6 py-5 pr-16 text-[15px] leading-6 text-[#eeeeef] shadow-none placeholder:text-[#737477] focus-visible:border-0 focus-visible:ring-0 md:text-[15px] dark:bg-transparent"
          onClick={handleNoteClick}
          onChange={handleNoteChange}
          onKeyDown={handleNoteKeyDown}
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
