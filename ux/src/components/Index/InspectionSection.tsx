import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faCircleCheck, faLeaf } from '@fortawesome/free-solid-svg-icons';

        const InspectionSection = () => (
          <>
            <section className="w-full max-w-7xl mx-auto px-6 lg:px-10 py-20" id="inspection">
<div className="mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
<div>
<p className="text-graphite tracking-widest2 text-[0.6rem] uppercase font-sans mb-3">Transparency Module</p>
<h2 className="font-serif text-ink text-3xl md:text-4xl">The Inspection Certificate</h2>
</div>
<p className="text-graphite text-sm leading-relaxed max-w-xs font-light">Our grading language is designed to be precise, not optimistic. Every grade tells the truth.</p>
</div>
{/* Certificate Card */}
<div className="inspection-cert rounded-none p-10 lg:p-16">
{/* Header */}
<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12 pb-8 border-b border-stone">
<div>
<div className="flex items-center gap-2.5 mb-2">
<div className="w-5 h-5 rounded-full bg-ink flex items-center justify-center">
<FontAwesomeIcon icon={faLeaf} className="text-cream text-[8px]" />
</div>
<span className="font-serif text-ink text-lg">EcoTrade</span>
</div>
<p className="text-graphite text-[0.65rem] tracking-widest2 uppercase">Condition Grade Certificate · Protocol v4.7</p>
</div>
<div className="flex items-center gap-2">
<FontAwesomeIcon icon={faCircleCheck} className="text-graphite text-sm" />
<span className="text-graphite text-[0.65rem] tracking-widest2 uppercase">47-Point Verification</span>
</div>
</div>
{/* Grade Grid */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-stone">
{/* Mint */}
<div className="pb-8 md:pb-0 md:pr-10 lg:pr-16">
<div className="flex items-center gap-2.5 mb-4">
<span className="grade-dot bg-ink"></span>
<span className="font-serif text-ink text-xl">Mint</span>
<span className="ml-auto text-graphite text-[0.6rem] tracking-widest2 uppercase">Grade M</span>
</div>
<p className="text-graphite text-sm leading-relaxed font-light mb-5">
                        Box opened but product untouched. Seals may be broken; the item is factory-pristine. Original packaging, all accessories.
                    </p>
<ul className="space-y-2.5">
<li className="flex items-start gap-2.5 text-xs text-ink/80 font-light">
<FontAwesomeIcon icon={faCheck} className="text-ink text-[9px] mt-0.5" />
                            Zero usage marks under 10× magnification
                        </li>
<li className="flex items-start gap-2.5 text-xs text-ink/80 font-light">
<FontAwesomeIcon icon={faCheck} className="text-ink text-[9px] mt-0.5" />
                            Full original accessory suite
                        </li>
<li className="flex items-start gap-2.5 text-xs text-ink/80 font-light">
<FontAwesomeIcon icon={faCheck} className="text-ink text-[9px] mt-0.5" />
                            Battery health ≥ 98%
                        </li>
<li className="flex items-start gap-2.5 text-xs text-ink/80 font-light">
<FontAwesomeIcon icon={faCheck} className="text-ink text-[9px] mt-0.5" />
                            All ports and connectors tested
                        </li>
</ul>
<div className="mt-6 pt-5 border-t border-stone">
<p className="text-[0.6rem] tracking-widest2 uppercase text-graphite">Savings vs. Retail</p>
<p className="font-serif text-ink text-lg mt-1">10 — 20%</p>
</div>
</div>
{/* Excellent */}
<div className="py-8 md:py-0 md:px-10 lg:px-16">
<div className="flex items-center gap-2.5 mb-4">
<span className="grade-dot bg-graphite"></span>
<span className="font-serif text-ink text-xl">Excellent</span>
<span className="ml-auto text-graphite text-[0.6rem] tracking-widest2 uppercase">Grade E</span>
</div>
<p className="text-graphite text-sm leading-relaxed font-light mb-5">
                        Lightly handled. May show microscopic surface micro-abrasions visible only at extreme angles under direct light.
                    </p>
<ul className="space-y-2.5">
<li className="flex items-start gap-2.5 text-xs text-ink/80 font-light">
<FontAwesomeIcon icon={faCheck} className="text-graphite text-[9px] mt-0.5" />
                            Micro-abrasions ≤ 2mm; edges only
                        </li>
<li className="flex items-start gap-2.5 text-xs text-ink/80 font-light">
<FontAwesomeIcon icon={faCheck} className="text-graphite text-[9px] mt-0.5" />
                            Display: zero dead pixels, verified
                        </li>
<li className="flex items-start gap-2.5 text-xs text-ink/80 font-light">
<FontAwesomeIcon icon={faCheck} className="text-graphite text-[9px] mt-0.5" />
                            Battery health ≥ 90%
                        </li>
<li className="flex items-start gap-2.5 text-xs text-ink/80 font-light">
<FontAwesomeIcon icon={faCheck} className="text-graphite text-[9px] mt-0.5" />
                            Full function test — all features
                        </li>
</ul>
<div className="mt-6 pt-5 border-t border-stone">
<p className="text-[0.6rem] tracking-widest2 uppercase text-graphite">Savings vs. Retail</p>
<p className="font-serif text-ink text-lg mt-1">20 — 35%</p>
</div>
</div>
{/* Good */}
<div className="pt-8 md:pt-0 md:pl-10 lg:pl-16">
<div className="flex items-center gap-2.5 mb-4">
<span className="grade-dot bg-stone border border-graphite/30"></span>
<span className="font-serif text-ink text-xl">Good</span>
<span className="ml-auto text-graphite text-[0.6rem] tracking-widest2 uppercase">Grade G</span>
</div>
<p className="text-graphite text-sm leading-relaxed font-light mb-5">
                        Visible cosmetic wear with full functional integrity. A working instrument that has lived a life.
                    </p>
<ul className="space-y-2.5">
<li className="flex items-start gap-2.5 text-xs text-ink/80 font-light">
<FontAwesomeIcon icon={faCheck} className="text-stone text-[9px] mt-0.5" />
                            Visible scratches documented with photos
                        </li>
<li className="flex items-start gap-2.5 text-xs text-ink/80 font-light">
<FontAwesomeIcon icon={faCheck} className="text-stone text-[9px] mt-0.5" />
                            100% functional — zero hardware faults
                        </li>
<li className="flex items-start gap-2.5 text-xs text-ink/80 font-light">
<FontAwesomeIcon icon={faCheck} className="text-stone text-[9px] mt-0.5" />
                            Battery health ≥ 80%
                        </li>
<li className="flex items-start gap-2.5 text-xs text-ink/80 font-light">
<FontAwesomeIcon icon={faCheck} className="text-stone text-[9px] mt-0.5" />
                            Professional cleaning completed
                        </li>
</ul>
<div className="mt-6 pt-5 border-t border-stone">
<p className="text-[0.6rem] tracking-widest2 uppercase text-graphite">Savings vs. Retail</p>
<p className="font-serif text-ink text-lg mt-1">35 — 50%</p>
</div>
</div>
</div>
{/* Certificate Footer */}
<div className="mt-12 pt-8 border-t border-stone flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
<div className="flex items-center gap-6">
<div className="text-center">
<p className="text-graphite text-[0.55rem] tracking-widest2 uppercase mb-1">Protocol</p>
<p className="text-ink text-xs font-medium">v4.7 — 2024</p>
</div>
<div className="w-px h-6 bg-stone"></div>
<div className="text-center">
<p className="text-graphite text-[0.55rem] tracking-widest2 uppercase mb-1">Verified by</p>
<p className="text-ink text-xs font-medium">EcoTrade Lab</p>
</div>
<div className="w-px h-6 bg-stone"></div>
<div className="text-center">
<p className="text-graphite text-[0.55rem] tracking-widest2 uppercase mb-1">Fulfillment</p>
<p className="text-ink text-xs font-medium">Amazon FBA</p>
</div>
</div>
<a className="pill-btn pill-btn-outline text-graphite border-stone" href="#">Download Protocol PDF</a>
</div>
</div>
</section>
          </>
        );

        export default InspectionSection;
