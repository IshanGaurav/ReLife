import { useEffect, useRef } from 'react';import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

interface HeroSectionProps {
  heroLoaded?: boolean;
}

export default function HeroSection({ heroLoaded }: HeroSectionProps) {
  const heroImageWrapRef = useRef<HTMLDivElement>(null);
  const savingsBarRef = useRef<HTMLDivElement>(null);
  const ecoMarkerRef = useRef<HTMLDivElement>(null);
  const savingsPercentRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const loadTimeout = setTimeout(() => {
      if (heroImageWrapRef.current) {
        heroImageWrapRef.current.classList.add('loaded');
      }
    }, 400);

    const meterTimeout = setTimeout(() => {
      if (savingsBarRef.current) savingsBarRef.current.style.width = '69.4%';
      if (ecoMarkerRef.current) ecoMarkerRef.current.style.left = '69.4%';
      if (savingsPercentRef.current) {
        let count = 0;
        const target = 31;
        const interval = setInterval(() => {
          count++;
          if (savingsPercentRef.current) {
            savingsPercentRef.current.textContent = count + '%';
          }
          if (count >= target) clearInterval(interval);
        }, 35);
      }
    }, 800);

    return () => {
      clearTimeout(loadTimeout);
      clearTimeout(meterTimeout);
    };
  }, []);

  return (
    <section className="w-full max-w-7xl mx-auto px-6 lg:px-10 pt-16 pb-20" id="hero">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 min-h-[580px]">
        {/* Left: Macro Product Image */}
        <div
          className={`hero-image-wrap relative overflow-hidden${heroLoaded ? ' loaded' : ''}`}
          id="heroImageWrap"
          ref={heroImageWrapRef}
        >
          <img
            alt="extreme macro photography of titanium laptop hinge and aluminum edge detail, razor sharp focus, warm"
            className="w-full h-[420px] lg:h-full object-cover"
            src="https://storage.googleapis.com/uxpilot-auth.appspot.com/gen_adae23f6c0_52251a1d17748248.png"
          />
          {/* Overlay label */}
          <div className="absolute bottom-8 left-8">
            <span className="pill-btn pill-btn-outline bg-cream/80 backdrop-blur-sm text-ink border-stone">
              <FontAwesomeIcon icon={faMagnifyingGlass} className="mr-1.5 text-[9px]" /> Macro Inspection View
            </span>
          </div>
          {/* Certification stamp */}
          <div className="absolute top-8 right-8 w-16 h-16 rounded-full border border-graphite bg-cream/90 flex flex-col items-center justify-center">
            <span className="font-serif text-[9px] text-graphite leading-tight text-center">Cert.</span>
            <span className="font-serif text-lg text-ink leading-none">A</span>
            <span className="font-serif text-[8px] text-graphite leading-tight">Grade</span>
          </div>
        </div>

        {/* Right: Savings Meter + Copy */}
        <div className="bg-ink flex flex-col justify-center px-10 lg:px-14 py-16 lg:py-0">
          {/* Eyebrow */}
          <p className="text-stone/60 tracking-widest2 text-[0.6rem] uppercase font-sans mb-6">Open-Box Intelligence</p>
          {/* Headline */}
          <h1 className="font-serif text-cream text-4xl xl:text-5xl leading-tight mb-5">
            The same thing,<br />
            <em>inspected twice.</em>
          </h1>
          <p className="text-stone/70 text-sm leading-relaxed font-light max-w-sm mb-10">
            Every item is graded under our 47-point certification protocol before it reaches you. Not a discount. A discernment.
          </p>

          {/* Savings Meter */}
          <div className="mb-10">
            <div className="flex justify-between items-baseline mb-3">
              <span className="text-stone/60 tracking-widest2 text-[0.6rem] uppercase">Savings Potential</span>
              <span className="font-serif text-cream text-2xl" ref={savingsPercentRef} id="savingsPercent">0%</span>
            </div>
            {/* Meter Track */}
            <div className="w-full h-px bg-stone/20 relative mb-4">
              <div
                className="absolute left-0 top-0 h-px bg-stone savings-bar-fill"
                ref={savingsBarRef}
                id="savingsBar"
                style={{ width: '0%', transition: 'width 0.8s ease' }}
              ></div>
              {/* Marker: New Price */}
              <div className="absolute right-0 -top-1 flex flex-col items-center">
                <div className="w-px h-3 bg-graphite"></div>
              </div>
              {/* Marker: EcoTrade Price */}
              <div
                className="absolute -top-1 flex flex-col items-center"
                ref={ecoMarkerRef}
                id="ecoMarker"
                style={{ left: '0%', transition: 'left 0.8s ease' }}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-cream"></div>
              </div>
            </div>
            {/* Price Labels */}
            <div className="flex justify-between items-start">
              <div>
                <p className="text-stone/50 text-[0.65rem] tracking-widest2 uppercase mb-0.5">EcoTrade</p>
                <p className="text-cream font-serif text-xl">$1,249</p>
              </div>
              <div className="text-right">
                <p className="text-stone/50 text-[0.65rem] tracking-widest2 uppercase mb-0.5">Retail New</p>
                <p className="text-stone/50 font-serif text-xl line-through decoration-graphite">$1,799</p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <a className="pill-btn bg-cream text-ink hover:bg-stone transition-colors" href="#products">Browse Collection</a>
            <a className="pill-btn pill-btn-outline border-stone/40 text-stone hover:bg-stone/10" href="#inspection">View Grading</a>
          </div>
        </div>
      </div>
    </section>
  );
}
