import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSmoothScroll } from './SmoothScrollProvider';

interface NavItem {
  label: string;
  path: string;
  target: string;
}

const navItems: NavItem[] = [
  { label: 'Home', path: '/', target: '#hero' },
  { label: 'Work', path: '/work', target: '#work' },
  { label: 'About', path: '/about', target: '#about' },
  { label: 'Contact', path: '/contact', target: '#contact' },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const { pathname, hash } = useLocation();
  const navigate = useNavigate();
  const { scrollTo } = useSmoothScroll();

  useEffect(() => setOpen(false), [pathname, hash]);

  const handleNav = (e: React.MouseEvent<HTMLAnchorElement>, item: NavItem) => {
    e.preventDefault();
    setOpen(false);
    if (pathname === '/') {
      scrollTo(item.target);
    } else {
      navigate(`/${item.target}`);
    }
  };

  const handleCta = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setOpen(false);
    if (pathname === '/') {
      scrollTo('#contact');
    } else {
      navigate('/#contact');
    }
  };

  const handleBrand = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setOpen(false);
    if (pathname === '/') {
      scrollTo(0);
    } else {
      navigate('/');
    }
  };

  return (
    <header className="site-header">
      <a className="brand" href="/" onClick={handleBrand} aria-label="ae® — Amanuel Eyob home">
        ae<span>®</span>
      </a>
      <nav aria-label="Main navigation" className={open ? 'main-nav open' : 'main-nav'} id="main-navigation">
        {navItems.map((item) => {
          const isActive =
            pathname === item.path ||
            (pathname === '/' && hash === item.target) ||
            (item.target === '#hero' && pathname === '/' && !hash);
          return (
            <a
              href={item.path}
              key={item.label}
              className={isActive ? 'active' : ''}
              onClick={(e) => handleNav(e, item)}
            >
              {item.label}
              <span className="nav-dot" />
            </a>
          );
        })}
      </nav>
      <a className="nav-cta" href="/#contact" onClick={handleCta}>
        Let’s talk <span>↗</span>
      </a>
      <button
        className="menu-toggle"
        aria-label={open ? 'Close − navigation' : 'Menu + open navigation'}
        aria-expanded={open}
        aria-controls="main-navigation"
        onClick={() => setOpen(!open)}
      >
        {open ? 'Close −' : 'Menu +'}
      </button>
    </header>
  );
}
