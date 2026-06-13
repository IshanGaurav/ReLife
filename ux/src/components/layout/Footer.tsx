import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLeaf, faShieldHalved, faRotateLeft } from '@fortawesome/free-solid-svg-icons';
import { faInstagram, faXTwitter, faLinkedinIn, faAmazon } from '@fortawesome/free-brands-svg-icons';

export default function Footer() {
  return (
    <footer className="w-full bg-cream border-t border-stone py-16" id="footer">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-7 h-7 rounded-full bg-ink flex items-center justify-center">
                <FontAwesomeIcon icon={faLeaf} className="text-cream text-xs" />
              </div>
              <NavLink to="/" className="font-serif text-xl text-ink">
                EcoTrade
              </NavLink>
            </div>
            <p className="text-graphite text-xs font-light leading-relaxed mb-5 max-w-xs">
              Certified open-box electronics, inspected under our 47-point protocol and fulfilled by Amazon.
            </p>
            <div className="flex items-center gap-3">
              <a
                className="w-7 h-7 rounded-full border border-stone flex items-center justify-center text-graphite hover:border-graphite transition-colors"
                href="#"
              >
                <FontAwesomeIcon icon={faInstagram} className="text-xs" />
              </a>
              <a
                className="w-7 h-7 rounded-full border border-stone flex items-center justify-center text-graphite hover:border-graphite transition-colors"
                href="#"
              >
                <FontAwesomeIcon icon={faXTwitter} className="text-xs" />
              </a>
              <a
                className="w-7 h-7 rounded-full border border-stone flex items-center justify-center text-graphite hover:border-graphite transition-colors"
                href="#"
              >
                <FontAwesomeIcon icon={faLinkedinIn} className="text-xs" />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <p className="text-ink text-[0.65rem] tracking-widest2 uppercase font-sans mb-5">Shop</p>
            <ul className="space-y-3">
              <li>
                <a className="text-graphite text-xs font-light hover:text-ink transition-colors" href="#">
                  MacBooks &amp; Laptops
                </a>
              </li>
              <li>
                <a className="text-graphite text-xs font-light hover:text-ink transition-colors" href="#">
                  iPhones &amp; Smartphones
                </a>
              </li>
              <li>
                <a className="text-graphite text-xs font-light hover:text-ink transition-colors" href="#">
                  Tablets &amp; iPads
                </a>
              </li>
              <li>
                <a className="text-graphite text-xs font-light hover:text-ink transition-colors" href="#">
                  Cameras &amp; Lenses
                </a>
              </li>
              <li>
                <a className="text-graphite text-xs font-light hover:text-ink transition-colors" href="#">
                  Audio &amp; Headphones
                </a>
              </li>
              <li>
                <a className="text-graphite text-xs font-light hover:text-ink transition-colors" href="#">
                  Wearables
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <p className="text-ink text-[0.65rem] tracking-widest2 uppercase font-sans mb-5">Company</p>
            <ul className="space-y-3">
              <li>
                <a className="text-graphite text-xs font-light hover:text-ink transition-colors" href="#about">
                  Our Process
                </a>
              </li>
              <li>
                <a className="text-graphite text-xs font-light hover:text-ink transition-colors" href="#inspection">
                  Grading System
                </a>
              </li>
              <li>
                <a className="text-graphite text-xs font-light hover:text-ink transition-colors" href="#">
                  Sell to EcoTrade
                </a>
              </li>
              <li>
                <a className="text-graphite text-xs font-light hover:text-ink transition-colors" href="#">
                  Press
                </a>
              </li>
              <li>
                <a className="text-graphite text-xs font-light hover:text-ink transition-colors" href="#">
                  Careers
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <p className="text-ink text-[0.65rem] tracking-widest2 uppercase font-sans mb-5">Support</p>
            <ul className="space-y-3">
              <li>
                <a className="text-graphite text-xs font-light hover:text-ink transition-colors" href="#">
                  Returns &amp; Warranty
                </a>
              </li>
              <li>
                <a className="text-graphite text-xs font-light hover:text-ink transition-colors" href="#">
                  Shipping Info
                </a>
              </li>
              <li>
                <a className="text-graphite text-xs font-light hover:text-ink transition-colors" href="#">
                  Track Order
                </a>
              </li>
              <li>
                <a className="text-graphite text-xs font-light hover:text-ink transition-colors" href="#">
                  FAQ
                </a>
              </li>
              <li>
                <a className="text-graphite text-xs font-light hover:text-ink transition-colors" href="#">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-stone pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-graphite text-[0.65rem] font-light">© 2024 EcoTrade. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a className="text-graphite text-[0.65rem] hover:text-ink transition-colors" href="#">
              Privacy Policy
            </a>
            <a className="text-graphite text-[0.65rem] hover:text-ink transition-colors" href="#">
              Terms of Use
            </a>
            <a className="text-graphite text-[0.65rem] hover:text-ink transition-colors" href="#">
              Cookie Settings
            </a>
          </div>
        </div>

        {/* Amazon Trust Bar */}
        <div className="amazon-bar mt-8 pt-6 border-t border-stone flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-graphite">
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faAmazon} className="text-graphite" />
            <span>Fulfilled by Amazon · FBA Certified</span>
          </div>
          <div className="hidden sm:block w-px h-4 bg-stone"></div>
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faShieldHalved} className="text-graphite text-xs" />
            <span>A-to-Z Purchase Protection</span>
          </div>
          <div className="hidden sm:block w-px h-4 bg-stone"></div>
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faRotateLeft} className="text-graphite text-xs" />
            <span>30-Day Free Returns</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
