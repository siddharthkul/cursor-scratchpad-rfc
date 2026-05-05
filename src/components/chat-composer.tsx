import { ChevronDown, Cpu, Mic, Monitor, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { chatMock } from "@/lib/mock-data"

export function ChatComposer() {
  return (
    <div className="absolute inset-x-[26px] bottom-[18px]">
      <Button
        className="mb-[10px] h-[46px] rounded-full border border-white/10 bg-[#242526]/92 px-[17px] text-[18px] font-semibold text-[#c9c9ca] shadow-[inset_0_1px_0_rgb(255_255_255/0.06)] hover:bg-[#2b2c2d] hover:text-[#e0e0e1]"
        variant="ghost"
      >
        {chatMock.branchAction}
        <ChevronDown className="ml-2 size-[17px] text-[#9a9b9d]" />
      </Button>

      <div className="rounded-[28px] border border-white/8 bg-[#232425]/92 shadow-[inset_0_1px_0_rgb(255_255_255/0.06),0_10px_28px_rgb(0_0_0/0.22)]">
        <div className="flex h-[58px] items-center gap-[11px] px-[14px]">
          <Button
            aria-label="Add context"
            className="size-[42px] rounded-full border border-white/8 bg-white/4 text-[#9a9a9b] shadow-[inset_0_1px_0_rgb(255_255_255/0.05)] hover:bg-white/[0.07] hover:text-[#cfcfd1]"
            size="icon"
            variant="ghost"
          >
            <Plus className="size-[25px] stroke-[1.7]" />
          </Button>

          <Textarea
            aria-label="Chat input"
            className="min-h-0 flex-1 resize-none border-0 bg-transparent px-0 py-0 text-[19px] font-medium leading-none text-[#f5f5f4] shadow-none outline-none placeholder:text-[#777879] focus-visible:border-0 focus-visible:ring-0 md:text-[19px] dark:bg-transparent"
            placeholder={chatMock.composerPlaceholder}
            rows={1}
          />

          <div className="hidden items-center gap-1.5 whitespace-nowrap text-[18px] font-semibold text-[#c4c4c5] sm:flex">
            <span>{chatMock.model}</span>
            <Cpu className="size-[17px] text-[#9c9c9e]" />
            <span>{chatMock.effort}</span>
            <ChevronDown className="size-[17px] text-[#9a9a9c]" />
          </div>

          <Button
            aria-label="Start voice input"
            className="size-[42px] rounded-full bg-[#ededed] text-[#151515] shadow-[inset_0_-1px_0_rgb(0_0_0/0.12)] hover:bg-white"
            size="icon"
          >
            <Mic className="size-[25px] stroke-[2.1]" />
          </Button>
        </div>
      </div>

      <div className="mt-[13px] flex items-center justify-between px-3 text-[17px] font-medium text-[#9b9c9d]">
        <div className="flex items-center gap-[11px]">
          <Monitor className="size-[21px] stroke-[1.75]" />
          <span>{chatMock.location}</span>
          <span>{chatMock.branch}</span>
        </div>
        <div className="size-[22px] rounded-full border-4 border-white/12 border-t-[#777879]" />
      </div>
    </div>
  )
}
