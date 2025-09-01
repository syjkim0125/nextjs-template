// Floating Elements Component
// Ocean-themed floating bubbles with animations

export function FloatingElements() {
  return (
    <>
      {/* Floating elements inspired by ocean theme */}
      <div className="absolute top-20 left-10 w-4 h-4 bg-white/30 rounded-full animate-pulse"></div>
      <div className="absolute top-40 right-20 w-6 h-6 bg-white/20 rounded-full animate-bounce delay-1000"></div>
      <div className="absolute bottom-40 left-20 w-3 h-3 bg-white/40 rounded-full animate-pulse delay-500"></div>
    </>
  );
}