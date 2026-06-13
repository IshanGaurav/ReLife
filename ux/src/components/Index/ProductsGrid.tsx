import { useState, useEffect, useRef } from 'react';import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAmazon as faAmazonBrands } from '@fortawesome/free-brands-svg-icons';

interface ProductsGridProps {
  savingsBarWidth?: string;
  ecoMarkerLeft?: string;
  savingsPercent?: number;
}

const products = [
  {
    id: 'product-1',
    image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/gen_cb57fc5c51_b02258a5a5302abb.png',
    imageAlt: 'Apple MacBook Pro M3 silver laptop flat lay on warm neutral linen fabric, product photography, edito',
    badge: 'Mint · M',
    badgeClass: 'bg-ink text-cream',
    brand: 'Apple · MacBook Pro',
    name: 'MacBook Pro 14" M3 Pro',
    specs: '18GB RAM · 512GB SSD · Space Black',
    retail: '$1,999 retail',
    price: '$1,649',
    lowStock: false,
  },
  {
    id: 'product-2',
    image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/gen_bb129784cd_98411eabec6e394d.png',
    imageAlt: 'Sony WH-1000XM5 headphones minimal product shot on warm cream surface, soft studio lighting, luxury',
    badge: 'Excellent · E',
    badgeClass: 'bg-graphite text-cream',
    brand: 'Sony · Audio',
    name: 'WH-1000XM5 Wireless',
    specs: 'ANC · 30hr Battery · Midnight Black',
    retail: '$399 retail',
    price: '$289',
    lowStock: false,
  },
  {
    id: 'product-3',
    image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/gen_12496b8c5d_73b3ba81fd0c680a.png',
    imageAlt: 'Sony Alpha a7 IV mirrorless camera on minimal warm grey backdrop, product photography editorial styl',
    badge: 'Mint · M',
    badgeClass: 'bg-ink text-cream',
    brand: 'Sony · Camera',
    name: 'Alpha A7 IV Body',
    specs: '33MP Full-Frame · 4K · 0 Shutter Count',
    retail: '$2,499 retail',
    price: '$2,049',
    lowStock: true,
  },
  {
    id: 'product-4',
    image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/gen_353ce6c60f_59cce4df91079dcf.png',
    imageAlt: 'iPad Pro M4 tablet with Apple Pencil on warm beige stone surface, minimal product photography, edito',
    badge: 'Excellent · E',
    badgeClass: 'bg-graphite text-cream',
    brand: 'Apple · Tablet',
    name: 'iPad Pro 13" M4',
    specs: '256GB · WiFi + Cellular · Silver',
    retail: '$1,299 retail',
    price: '$979',
    lowStock: false,
  },
  {
    id: 'product-5',
    image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/gen_795805ff7b_6214805bc2b8499a.png',
    imageAlt: 'iPhone 15 Pro titanium natural finish on warm cream linen close up detail product shot editorial',
    badge: 'Mint · M',
    badgeClass: 'bg-ink text-cream',
    brand: 'Apple · iPhone',
    name: 'iPhone 15 Pro Max',
    specs: '256GB · Natural Titanium · Unlocked',
    retail: '$1,199 retail',
    price: '$989',
    lowStock: false,
  },
  {
    id: 'product-6',
    image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/gen_0e66b6b1f3_909af79a332c07c8.png',
    imageAlt: 'Bose QuietComfort Ultra Earbuds in charging case warm neutral surface macro product photography edit',
    badge: 'Good · G',
    badgeClass: 'bg-stone/80 text-ink border border-graphite/30',
    brand: 'Bose · Audio',
    name: 'QuietComfort Ultra Earbuds',
    specs: 'ANC · 6hr + 24hr Case · White Smoke',
    retail: '$299 retail',
    price: '$179',
    lowStock: false,
  },
  {
    id: 'product-7',
    image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/gen_2037ade2f5_bf7f9f1cfe288eef.png',
    imageAlt: 'Dell XPS 15 laptop open thin bezel on warm stone surface minimal editorial product photography',
    badge: 'Excellent · E',
    badgeClass: 'bg-graphite text-cream',
    brand: 'Dell · Laptop',
    name: 'XPS 15 9530',
    specs: 'Intel i9 · 32GB · 1TB · OLED Touch',
    retail: '$2,299 retail',
    price: '$1,699',
    lowStock: false,
  },
  {
    id: 'product-8',
    image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/gen_3de3e1da72_aca2e197f728d1e6.png',
    imageAlt: 'Apple Watch Ultra 2 titanium on warm grey stone surface macro detail product photography editorial l',
    badge: 'Mint · M',
    badgeClass: 'bg-ink text-cream',
    brand: 'Apple · Wearable',
    name: 'Watch Ultra 2',
    specs: '49mm · Natural Titanium · Trail Band',
    retail: '$799 retail',
    price: '$659',
    lowStock: false,
  },
];

export default function ProductsGrid({ savingsBarWidth, ecoMarkerLeft, savingsPercent }: ProductsGridProps) {
  const [activeFilter, setActiveFilter] = useState('All');
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    if ('IntersectionObserver' in window) {
      cardRefs.current.forEach((card) => {
        if (!card) return;
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                entry.target.classList.add('focused');
              }
            });
          },
          { threshold: 0.3 }
        );
        observer.observe(card);
        observers.push(observer);
      });
    }
    return () => {
      observers.forEach((obs) => obs.disconnect());
    };
  }, []);

  const filters = ['All', 'Laptops', 'Phones', 'Audio', 'Cameras'];

  return (
    <section className="w-full bg-stone/10 border-t border-stone py-20" id="products">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div>
            <p className="text-graphite tracking-widest2 text-[0.6rem] uppercase font-sans mb-3">Curated Selection</p>
            <h2 className="font-serif text-ink text-3xl md:text-4xl">Current Collection</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={filter === activeFilter ? 'pill-btn pill-btn-dark' : 'pill-btn pill-btn-outline text-graphite'}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <div
              key={product.id}
              id={product.id}
              ref={(el) => { cardRefs.current[index] = el; }}
              className="focus-transition bg-cream card-border group cursor-pointer"
            >
              <div className="relative overflow-hidden h-56">
                <img
                  alt={product.imageAlt}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  src={product.image}
                />
                <div className="absolute top-4 left-4">
                  <span className={`${product.badgeClass} text-[0.55rem] tracking-widest2 uppercase px-2.5 py-1 rounded-full`}>
                    {product.badge}
                  </span>
                </div>
                {product.lowStock && (
                  <div className="absolute top-4 right-4">
                    <span className="bg-cream/90 text-ink text-[0.55rem] tracking-widest2 uppercase px-2.5 py-1 rounded-full border border-stone">
                      Low Stock
                    </span>
                  </div>
                )}
              </div>
              <div className="p-5 border-t border-stone">
                <p className="text-graphite text-[0.6rem] tracking-widest2 uppercase mb-1.5">{product.brand}</p>
                <h3 className="font-serif text-ink text-lg leading-snug mb-1">{product.name}</h3>
                <p className="text-graphite text-xs font-light mb-4">{product.specs}</p>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="strike-retail">{product.retail}</p>
                    <p className="font-serif text-ink text-2xl mt-0.5">{product.price}</p>
                  </div>
                  <button className="pill-btn pill-btn-dark text-[0.58rem] px-4 py-2.5">Add to Cart</button>
                </div>
                <div className="mt-4 pt-3 border-t border-stone flex items-center gap-1.5">
                  <FontAwesomeIcon icon={faAmazonBrands} className="text-graphite text-xs" />
                  <span className="text-graphite text-[0.58rem] tracking-wide uppercase">Ships from Amazon</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <a className="pill-btn pill-btn-outline text-graphite inline-block" href="#">View Full Collection</a>
        </div>
      </div>
    </section>
  );
}
