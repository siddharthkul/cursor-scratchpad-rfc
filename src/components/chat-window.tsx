import {
  Columns2,
  Ellipsis,
  PanelLeft,
  Plus,
  Search,
  Share,
  Square,
} from "lucide-react"
import type { ReactNode } from "react"

import { ChatComposer } from "@/components/chat-composer"
import { chatMock } from "@/lib/mock-data"

const trafficLights = [
  { label: "Close", className: "bg-[#ff5f57]" },
  { label: "Minimize", className: "bg-[#febc2e]" },
  { label: "Zoom", className: "bg-[#28c840]" },
]

function ToolbarIcon({
  children,
  label,
}: {
  children: ReactNode
  label: string
}) {
  return (
    <button
      aria-label={label}
      className="grid size-[24px] place-items-center border-0 bg-transparent p-0 text-[#a3a4a6] outline-none transition-colors hover:text-[#d5d5d6]"
      type="button"
    >
      {children}
    </button>
  )
}

export function ChatWindow() {
  return (
    <section
      aria-label="Cursor chat mock"
      className="relative h-[min(80vh,806px)] w-[min(89vw,914px)] overflow-hidden rounded-[26px] border border-black/70 bg-[linear-gradient(180deg,#11191a_0%,#101515_30%,#141011_100%)] shadow-[0_35px_90px_rgb(0_0_0/0.62),0_8px_18px_rgb(0_0_0/0.5),inset_0_1px_0_rgb(255_255_255/0.08)] ring-1 ring-white/10"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_20%,rgb(25_48_48/0.2),transparent_26%),radial-gradient(circle_at_77%_69%,rgb(54_31_35/0.23),transparent_33%)]" />

      <div className="relative flex h-[68px] items-center justify-between px-[22px]">
        <div className="flex min-w-0 items-center gap-[16px]">
          <div className="flex items-center gap-[9px]">
            {trafficLights.map((light) => (
              <span
                aria-label={light.label}
                className={`size-[14px] rounded-full shadow-[inset_0_-1px_1px_rgb(0_0_0/0.25)] ${light.className}`}
                key={light.label}
                role="img"
              />
            ))}
          </div>

          <div className="flex items-center gap-[11px] pl-[10px]">
            <ToolbarIcon label="Toggle sidebar">
              <PanelLeft className="size-[20px] stroke-[1.9]" />
            </ToolbarIcon>
            <ToolbarIcon label="Search">
              <Search className="size-[20px] stroke-[1.9]" />
            </ToolbarIcon>
            <ToolbarIcon label="New chat">
              <Plus className="size-[22px] stroke-[1.8]" />
            </ToolbarIcon>
          </div>

          <div className="flex min-w-0 items-center gap-3 pl-[8px] text-[#b9bbbd]">
            <h1 className="truncate text-[20px] font-semibold tracking-[-0.02em]">
              {chatMock.title}
            </h1>
            <Square className="size-[18px] rotate-180 text-[#a6a7a8]" />
          </div>
        </div>

        <div className="flex items-center gap-[15px] text-[#a8a9aa]">
          <ToolbarIcon label="More actions">
            <Ellipsis className="size-[21px]" />
          </ToolbarIcon>
          <ToolbarIcon label="Share">
            <Share className="size-[20px] stroke-[1.9]" />
          </ToolbarIcon>
          <ToolbarIcon label="Toggle layout">
            <Columns2 className="size-[20px] stroke-[1.9]" />
          </ToolbarIcon>
        </div>
      </div>

      <div className="relative px-[28px] pt-0 sm:px-[28px]">
        <div className="flex h-[62px] items-center rounded-[20px] border border-white/7.5 bg-[#232323]/83 px-[20px] text-[21px] font-medium tracking-[-0.02em] text-[#ededed] shadow-[inset_0_1px_0_rgb(255_255_255/0.035)]">
          {chatMock.prompt}
        </div>

        <p className="mt-[26px] px-[12px] text-[22px] font-semibold tracking-[-0.02em] text-[#eeeeef]">
          {chatMock.assistantReply}
        </p>
      </div>

      <ChatComposer />
    </section>
  )
}
