import { ChatWindow } from "@/components/chat-window"

function App() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0d5fb7] text-foreground">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_11%_82%,#f04cbd_0%,#f04cbd_10%,transparent_31%),radial-gradient(circle_at_97%_64%,#ffb168_0%,#ffb168_14%,transparent_29%),radial-gradient(circle_at_79%_9%,#11b68b_0%,#12bf92_15%,transparent_38%),linear-gradient(135deg,#0b59b1_0%,#116ec9_34%,#0aa979_62%,#0d7fbc_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-[38%] bg-[radial-gradient(ellipse_at_50%_100%,rgb(175_163_222/0.86),transparent_60%)]" />
      <div className="absolute inset-0 backdrop-blur-[1.5px]" />

      <div className="relative flex min-h-screen items-center justify-center px-6 py-10">
        <ChatWindow />
      </div>
    </main>
  )
}

export default App
