export function Background() {
  return (
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
          backgroundSize: "4rem 4rem",
        }}
      />
  )
}

export function Ambient() {
  return (
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-gold rounded-full blur-[200px] animate-pulse-gold pointer-events-none" />
  )
}