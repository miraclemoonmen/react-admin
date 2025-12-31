export default function Index() {
  return (
    <div className="text-[#1A1D2E] font-sans selection:bg-blue-100 overflow-hidden relative">
      {/* 氛围层：神迹微光 */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100/30 blur-[120px] rounded-full animate-[pulse_6s_infinite]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-100/30 blur-[120px] rounded-full animate-[pulse_8s_infinite]" />
      </div>

      <main className="relative max-w-7xl mx-auto px-12 pt-[28vh]">
        {/* 主标题：苹果风格的平滑升起动画 */}
        <div className="animate-[slideUp_1.5s_cubic-bezier(0.16,1,0.3,1)_forwards] opacity-0">
          <h1 className="text-[110px] font-black tracking-[-0.05em] leading-[0.9] text-[#1A1D2E]">
            神说，要有光。
            <span className="inline-block animate-[bounce_4s_ease-in-out_infinite]">
              ☀️
            </span>
          </h1>
        </div>

        <div className="flex items-center gap-6 mt-12 animate-[fadeIn_1.2s_ease-out_1s_forwards] opacity-0">
          <div className="h-px w-20 bg-[#1A1D2E]/20" />
          <p className="text-2xl text-[#9095A9] font-medium tracking-tight italic">
            于是，代码开始流转，万物有了秩序。
          </p>
        </div>
      </main>
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(50px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
      `}</style>
    </div>
  );
}
