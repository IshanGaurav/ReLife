import React from "react";

        const AboutSection = () => (
          <>
            <section className="w-full border-t border-stone py-20 bg-cream" id="about">
<div className="max-w-7xl mx-auto px-6 lg:px-10">
<div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
{/* Image */}
<div className="relative">
<div className="overflow-hidden">
<img alt="professional quality inspector examining laptop hinge with loupe magnifier in clean minimal workshop" className="w-full h-[420px] object-cover" src="https://storage.googleapis.com/uxpilot-auth.appspot.com/gen_92e2ff2313_b95e2afbe55c4f16.png"/>
</div>
{/* Floating stat */}
<div className="absolute bottom-6 right-6 bg-cream card-border-graphite px-6 py-4">
<p className="text-graphite text-[0.6rem] tracking-widest2 uppercase mb-1">Items Certified</p>
<p className="font-serif text-ink text-3xl">48,291</p>
<p className="text-graphite text-[0.6rem] mt-1">and counting</p>
</div>
</div>
{/* Copy */}
<div>
<p className="text-graphite tracking-widest2 text-[0.6rem] uppercase font-sans mb-4">Our Process</p>
<h2 className="font-serif text-ink text-3xl md:text-4xl leading-snug mb-6">
                        The lab between<br/><em>you and the unknown.</em>
</h2>
<p className="text-graphite text-sm leading-relaxed font-light mb-8 max-w-md">
                        We built EcoTrade because the word "open-box" deserved a better definition. Every item passes through our facility in Boulder, Colorado, where trained technicians apply our 47-point protocol before anything is listed.
                    </p>
{/* Steps */}
<div className="space-y-6">
<div className="flex items-start gap-5">
<div className="w-8 h-8 rounded-full border border-graphite flex items-center justify-center flex-shrink-0 mt-0.5">
<span className="text-graphite text-[0.65rem] font-medium">01</span>
</div>
<div>
<h4 className="text-ink text-sm font-medium mb-1 tracking-wide uppercase text-[0.7rem]">Receipt &amp; Audit</h4>
<p className="text-graphite text-xs font-light leading-relaxed">Every unit is received, logged, and assigned a unique certification ID traceable through your order.</p>
</div>
</div>
<div className="flex items-start gap-5">
<div className="w-8 h-8 rounded-full border border-graphite flex items-center justify-center flex-shrink-0 mt-0.5">
<span className="text-graphite text-[0.65rem] font-medium">02</span>
</div>
<div>
<h4 className="text-ink text-sm font-medium mb-1 tracking-wide uppercase text-[0.7rem]">47-Point Inspection</h4>
<p className="text-graphite text-xs font-light leading-relaxed">Hardware, software, cosmetics, and packaging are each reviewed against our published protocol document.</p>
</div>
</div>
<div className="flex items-start gap-5">
<div className="w-8 h-8 rounded-full border border-graphite flex items-center justify-center flex-shrink-0 mt-0.5">
<span className="text-graphite text-[0.65rem] font-medium">03</span>
</div>
<div>
<h4 className="text-ink text-sm font-medium mb-1 tracking-wide uppercase text-[0.7rem]">Grade &amp; List</h4>
<p className="text-graphite text-xs font-light leading-relaxed">Honest grading, honest pricing. Then fulfilled by Amazon for the logistics experience you trust.</p>
</div>
</div>
</div>
<div className="mt-10">
<a className="pill-btn pill-btn-dark inline-block" href="#">Our Full Story</a>
</div>
</div>
</div>
</div>
</section>
          </>
        );

        export default AboutSection;
