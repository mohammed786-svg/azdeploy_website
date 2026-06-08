export type CompilerThemeMode = "light" | "dark";

/** OneCompiler-inspired surface tokens */
export function compilerSurfaces(theme: CompilerThemeMode) {
  if (theme === "dark") {
    return {
      shell: "bg-[#1b1b1b] text-[#cccccc]",
      topbar: "bg-[#252526] border-[#3e3e42]",
      activity: "bg-[#252526] border-[#3e3e42]",
      explorer: "bg-[#252526] border-[#3e3e42]",
      tabBar: "bg-[#2d2d2d] border-[#3e3e42]",
      tabActive: "bg-[#1e1e1e] text-[#ffffff]",
      tabIdle: "bg-[#2d2d2d] text-[#969696] hover:text-[#cccccc]",
      editor: "bg-[#1e1e1e]",
      ioPanel: "bg-[#252526] border-[#3e3e42]",
      statusBar: "bg-[#007acc] text-white",
      statusBarAlt: "bg-[#252526] border-[#3e3e42] text-[#969696]",
      muted: "text-[#858585]",
      subtle: "text-[#969696]",
      border: "border-[#3e3e42]",
      hover: "hover:bg-[#2a2d2e]",
      input: "bg-[#1e1e1e] border-[#3e3e42] text-[#cccccc] placeholder:text-[#6a6a6a]",
      langBtn: "bg-[#0e639c] hover:bg-[#1177bb] text-white border-[#0e639c]",
      runBtn: "bg-[#c72e6f] hover:bg-[#d63b7d] text-white",
      savedDot: "bg-[#4ec9b0]",
      modal: "bg-[#252526] border-[#3e3e42]",
      modalTitle: "text-[#4fc1ff]",
      card: "bg-[#2d2d2d] border-[#3e3e42] hover:border-[#4fc1ff]/40 hover:bg-[#333333]",
      cardActive: "border-[#0e639c] bg-[#094771]/30",
      treeActive: "bg-[#37373d] text-white",
    };
  }
  return {
    shell: "bg-[#f3f3f3] text-[#333333]",
    topbar: "bg-[#ffffff] border-[#e5e5e5]",
    activity: "bg-[#f8f8f8] border-[#e5e5e5]",
    explorer: "bg-[#f8f8f8] border-[#e5e5e5]",
    tabBar: "bg-[#ececec] border-[#e5e5e5]",
    tabActive: "bg-[#ffffff] text-[#333333]",
    tabIdle: "bg-[#ececec] text-[#616161] hover:text-[#333333]",
    editor: "bg-[#ffffff]",
    ioPanel: "bg-[#f8f8f8] border-[#e5e5e5]",
    statusBar: "bg-[#007acc] text-white",
    statusBarAlt: "bg-[#f8f8f8] border-[#e5e5e5] text-[#616161]",
    muted: "text-[#6e6e6e]",
    subtle: "text-[#616161]",
    border: "border-[#e5e5e5]",
    hover: "hover:bg-[#ebebeb]",
    input: "bg-white border-[#d4d4d4] text-[#333333] placeholder:text-[#9e9e9e]",
    langBtn: "bg-[#0e639c] hover:bg-[#1177bb] text-white border-[#0e639c]",
    runBtn: "bg-[#c72e6f] hover:bg-[#d63b7d] text-white",
    savedDot: "bg-[#16825d]",
    modal: "bg-white border-[#e5e5e5]",
    modalTitle: "text-[#0e639c]",
    card: "bg-[#fafafa] border-[#e5e5e5] hover:border-[#0e639c]/40 hover:bg-white",
    cardActive: "border-[#0e639c] bg-[#e8f4fc]",
    treeActive: "bg-[#e4e6f1] text-[#333333]",
  };
}
