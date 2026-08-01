export default function ContactSection() {
  return (
    <section id="contact-section" className="max-w-7xl mx-auto px-6 md:px-12 py-20 text-left">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        <div className="lg:col-span-6 space-y-6">
          <span className="text-xs text-[#dfab54] tracking-[0.3em] uppercase font-bold font-mono">
            Get In Touch
          </span>
          <h2 className="section-title font-sans font-extrabold tracking-tighter leading-none text-white uppercase">
            Let's <br />
            <span className="font-serif italic font-light text-white/70 normal-case">
              Connect.
            </span>
          </h2>
          <p className="text-white/60 text-sm sm:text-base font-light leading-relaxed max-w-md">
            Reach out regarding computational scripts, geophysics datasets, CCS monitoring initiatives, or research collaborations.
          </p>
        </div>

        <div className="lg:col-span-6 space-y-4 font-mono text-sm w-full">
          <div className="pb-4">
            <a
              href="mailto:arsyrahmatullah@gmail.com"
              className="flex justify-between items-center py-2 text-white hover:text-[#dfab54] transition-colors"
            >
              <span className="flex items-center gap-3">
                <span className="text-white/30 text-xs">01 / EMAIL</span>
                <span className="font-bold">arsyrahmatullah@gmail.com</span>
              </span>
              <span>→</span>
            </a>
          </div>

          <div className="pb-4">
            <a
              href="https://linkedin.com/in/arsy-nuur-rahmatullah"
              target="_blank"
              rel="noreferrer"
              className="flex justify-between items-center py-2 text-white hover:text-[#dfab54] transition-colors"
            >
              <span className="flex items-center gap-3">
                <span className="text-white/30 text-xs">02 / LINKEDIN</span>
                <span className="font-bold">/in/arsy-nuur-rahmatullah</span>
              </span>
              <span>→</span>
            </a>
          </div>

          <div className="pb-4">
            <a
              href="https://github.com/Arsyrahmatullah"
              target="_blank"
              rel="noreferrer"
              className="flex justify-between items-center py-2 text-white hover:text-[#dfab54] transition-colors"
            >
              <span className="flex items-center gap-3">
                <span className="text-white/30 text-xs">03 / GITHUB</span>
                <span className="font-bold">@Arsyrahmatullah</span>
              </span>
              <span>→</span>
            </a>
          </div>

          <div className="pb-4">
            <a
              href="tel:+6282121213899"
              className="flex justify-between items-center py-2 text-white hover:text-[#dfab54] transition-colors"
            >
              <span className="flex items-center gap-3">
                <span className="text-white/30 text-xs">04 / PHONE</span>
                <span className="font-bold">+62 821-2121-3899</span>
              </span>
              <span>→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
