import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Heart, User, ShoppingBag, Menu, X } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { useWishlistStore } from '../../store/useWishlistStore';
import { cn } from '../../utils/utils';

interface NavbarProps {
  onCartClick: () => void;
}

export default function Navbar({ onCartClick }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  
  const cartItemsCount = useCartStore(state => state.items.reduce((acc, item) => acc + item.quantity, 0));
  const wishlistItemsCount = useWishlistStore(state => state.items.length);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [isSearchOpen]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'Custom Orders', path: '/custom-orders' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 w-full flex flex-col">
        {/* Announcement Bar */}
        <div className="bg-[#3A2930] text-white py-1.5 sm:py-2 text-center text-[11px] sm:text-xs font-medium tracking-wide sm:tracking-widest px-2 truncate">
          ✨ FREE SHIPPING on orders above ₹999 &nbsp;|&nbsp; Handmade with Love 🌸
        </div>

        {/* Main Navbar */}
        <div 
          className={cn(
            "bg-white/95 backdrop-blur-md border-b transition-all duration-300",
            isScrolled ? "border-[#F0DDE4] shadow-sm py-2.5 sm:py-3" : "border-[#F0DDE4]/50 py-3 sm:py-4"
          )}
        >
          <div className="container mx-auto px-4 md:px-8 flex items-center justify-between gap-2 sm:gap-4">
            
            {/* Left: Mobile Menu Button & Brand */}
            <div className="flex items-center gap-2 sm:gap-4">
              <button 
                className="md:hidden text-[#3A2930] p-1.5 -ml-1 rounded-lg hover:bg-[#FFF5F8] transition-colors"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Menu"
              >
                <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>

              <Link to="/" className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-[#3A2930] flex items-center shrink-0">
                Soul Craft
                <span className="text-[#E8A0B8] ml-0.5">.</span>
              </Link>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center space-x-7">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  to={link.path}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-[#E8A0B8]",
                    location.pathname === link.path ? "text-[#E8A0B8]" : "text-[#3A2930]"
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Right: Action Icons */}
            <div className="flex items-center space-x-1 sm:space-x-4">
              <button
                className="text-[#3A2930] hover:text-[#E8A0B8] transition-colors p-2 rounded-full hover:bg-[#FFF5F8]"
                onClick={() => setIsSearchOpen(true)}
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </button>

              <Link 
                to="/wishlist" 
                className="text-[#3A2930] hover:text-[#E8A0B8] transition-colors relative p-2 rounded-full hover:bg-[#FFF5F8]" 
                aria-label="Wishlist"
              >
                <Heart className="h-5 w-5" />
                {wishlistItemsCount > 0 && (
                  <span className="absolute top-1 right-1 bg-[#D9536F] text-white text-[9px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                    {wishlistItemsCount}
                  </span>
                )}
              </Link>

              <Link 
                to="/account" 
                className="text-[#3A2930] hover:text-[#E8A0B8] transition-colors p-2 rounded-full hover:bg-[#FFF5F8] hidden sm:block" 
                aria-label="Account"
              >
                <User className="h-5 w-5" />
              </Link>

              <button
                onClick={onCartClick}
                className="text-[#3A2930] hover:text-[#E8A0B8] transition-colors relative flex items-center p-2 rounded-full hover:bg-[#FFF5F8]"
                aria-label={`Cart (${cartItemsCount} items)`}
              >
                <ShoppingBag className="h-5 w-5" />
                {cartItemsCount > 0 && (
                  <span className="absolute top-1 right-1 bg-[#E8A0B8] text-white text-[9px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Search Overlay */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-[80] bg-[#3A2930]/40 backdrop-blur-sm flex items-start justify-center pt-16 sm:pt-[10vh] px-4" onClick={() => setIsSearchOpen(false)}>
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <form onSubmit={handleSearch} className="flex items-center gap-3 px-4 sm:px-6 py-3.5 sm:py-4">
              <Search className="w-5 h-5 text-[#806B73] shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search for handmade gifts, frames..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 text-base sm:text-lg text-[#3A2930] placeholder:text-[#C4A8B3] outline-none bg-transparent"
              />
              <button
                type="button"
                onClick={() => setIsSearchOpen(false)}
                className="p-1.5 text-[#806B73] hover:text-[#3A2930] rounded-full hover:bg-[#FFF5F8] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </form>
            <div className="border-t border-[#F0DDE4] px-4 sm:px-6 py-3.5 sm:py-4 bg-[#FFF9FB]">
              <p className="text-[11px] text-[#806B73] mb-2 font-semibold tracking-wider">POPULAR SEARCHES</p>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {['Gift boxes', 'Resin keychains', 'Macrame', 'Candles', 'Personalized frames'].map(tag => (
                  <button
                    key={tag}
                    onClick={() => { navigate(`/shop?search=${encodeURIComponent(tag)}`); setIsSearchOpen(false); }}
                    className="text-xs sm:text-sm bg-white border border-[#F0DDE4] text-[#E8A0B8] px-3 py-1 rounded-full hover:bg-[#FCE7EF] transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[75] bg-[#3A2930]/40 backdrop-blur-sm md:hidden" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="absolute left-0 top-0 bottom-0 w-4/5 max-w-sm bg-white shadow-2xl flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#F0DDE4]">
              <Link to="/" className="text-xl font-serif font-bold text-[#3A2930]" onClick={() => setIsMobileMenuOpen(false)}>
                Soul Craft<span className="text-[#E8A0B8]">.</span>
              </Link>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1.5 text-[#806B73] hover:text-[#3A2930] rounded-full hover:bg-[#FFF5F8]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <nav className="flex flex-col px-6 py-6 space-y-4 flex-1 overflow-y-auto">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  to={link.path}
                  className={cn(
                    "text-xl font-serif font-medium transition-colors py-1",
                    location.pathname === link.path ? "text-[#E8A0B8]" : "text-[#3A2930]"
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            <div className="px-6 pb-8 space-y-3 border-t border-[#F0DDE4] pt-5 bg-[#FFF9FB]">
              <Link to="/account" className="flex items-center gap-3 text-base text-[#3A2930] py-1" onClick={() => setIsMobileMenuOpen(false)}>
                <User className="h-4 w-4 text-[#E8A0B8]" /> My Account
              </Link>
              <Link to="/wishlist" className="flex items-center gap-3 text-base text-[#3A2930] py-1" onClick={() => setIsMobileMenuOpen(false)}>
                <Heart className="h-4 w-4 text-[#E8A0B8]" /> Wishlist ({wishlistItemsCount})
              </Link>
              <Link to="/track-order" className="flex items-center gap-3 text-base text-[#3A2930] py-1" onClick={() => setIsMobileMenuOpen(false)}>
                <ShoppingBag className="h-4 w-4 text-[#E8A0B8]" /> Track Order
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
