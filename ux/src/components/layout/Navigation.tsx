import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBagShopping, faBars, faLeaf } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-regular-svg-icons';

const Navigation = () => {
  return (
    <header className="w-full bg-cream border-b border-stone sticky top-0 z-50" id="header">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 flex items-center justify-between h-16">
        {/* Logo */}
        <NavLink className="flex items-center gap-2.5" to="/">
          <div className="w-7 h-7 rounded-full bg-ink flex items-center justify-center">
            <FontAwesomeIcon icon={faLeaf} className="text-cream text-xs" />
          </div>
          <span className="font-serif text-xl text-ink tracking-tight">EcoTrade</span>
        </NavLink>

        {/* Nav Links */}
        <nav className="hidden md:flex items-center gap-8">
          <a className="nav-link" href="#products">Shop</a>
          <a className="nav-link" href="#inspection">Grading</a>
          <a className="nav-link" href="#about">About</a>
          <a className="nav-link" href="#sell">Sell</a>
        </nav>

        {/* CTA */}
        <div className="flex items-center gap-4">
          <a className="hidden sm:flex items-center gap-1.5 nav-link" href="#account">
            <FontAwesomeIcon icon={faUser} className="text-xs" /> Account
          </a>
          <a className="relative" href="#cart">
            <FontAwesomeIcon icon={faBagShopping} className="text-graphite text-sm" />
            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-ink text-cream text-[9px] rounded-full flex items-center justify-center font-sans font-medium">2</span>
          </a>
          <button className="md:hidden text-graphite">
            <FontAwesomeIcon icon={faBars} className="text-sm" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navigation;
