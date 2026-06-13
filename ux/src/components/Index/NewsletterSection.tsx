import { useState } from 'react';export default function NewsletterSection() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <section className="w-full border-t border-stone bg-ink py-16" id="newsletter">
      <div className="max-w-4xl mx-auto px-6 lg:px-10 text-center">
        <p className="text-stone/60 tracking-widest2 text-[0.6rem] uppercase font-sans mb-4">Intelligence, Curated</p>
        <h2 className="font-serif text-cream text-3xl md:text-4xl mb-3">The EcoTrade Edit</h2>
        <p className="text-stone/60 text-sm font-light mb-8 max-w-sm mx-auto">Receive curated drops of certified items — before they're listed publicly. No noise.</p>
        <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={handleSubmit}>
          <input
            className="flex-1 bg-transparent border border-stone/30 text-cream placeholder-stone/40 px-5 py-3 rounded-full text-sm font-light focus:outline-none focus:border-stone/70 transition-colors"
            placeholder="your@address.com"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button className="pill-btn bg-cream text-ink hover:bg-stone transition-colors whitespace-nowrap">Join the Edit</button>
        </form>
        <p className="text-stone/30 text-[0.6rem] tracking-wide mt-4">No spam. Unsubscribe at any time. We respect your inbox.</p>
      </div>
    </section>
  );
}
