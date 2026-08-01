export default function Footer() {
  return (
    <footer className="border-t border-white/10 py-12 text-[10px] uppercase text-white/40 font-mono tracking-widest">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col sm:flex-row justify-between items-center gap-4 pb-16">
        <div>© {new Date().getFullYear()} Arsy Nuur Rahmatullah. All rights reserved.</div>
        <div className="flex items-center gap-2 text-white/70">
          <span>📍 Bandung, West Java, Indonesia</span>
        </div>
      </div>
    </footer>
  );
}
