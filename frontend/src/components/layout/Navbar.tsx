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
        <div className="bg-[#3A2930] text-white py-2 text-center text-xs font-medium tracking-widest">
          ✨ FREE SHIPPING on orders above ₹999 &nbsp;|&nbsp; Handmade with Love 🌸
        </div>

        {/* Main Navbar */}
        <div 
          className={cn(
            "bg-white/90 backdrop-blur-md border-b transition-all duration-300",
            isScrolled ? "border-[#F0DDE4] shadow-sm py-3" : "border-transparent py-4"
          )}
        >
          <div className="container mx-auto px-4 md:px-8 flex items-center justify-between gap-4">
            
            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-[#3A2930] p-1"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Menu"
            >
              <Menu className="h-6 w-6" />
            </button>

            {/* Logo */}
            <Link to="/" className="text-2xl md:text-3xl font-serif font-bold text-[#3A2930] flex items-center shrink-0">
              Soul Craft
              <span className="text-[#E8A0B8] ml-1">.</span>
            </Link>

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

            {/* Icons */}
            <div className="flex items-center space-x-3 md:space-x-5">
              <button
                className="text-[#3A2930] hover:text-[#E8A0B8] transition-colors p-1"
                onClick={() => setIsSearchOpen(true)}
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </button>
              <Link to="/wishlist" className="text-[#3A2930] hover:text-[#E8A0B8] transition-colors relative p-1 hidden sm:block" aria-label="Wishlist">
                <Heart className="h-5 w-5" />
                {wishlistItemsCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-[#D9536F] text-white text-[9px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                    {wishlistItemsCount}
                  </span>
                )}
              </Link>
              <Link to="/account" className="text-[#3A2930] hover:text-[#E8A0B8] transition-colors p-1 hidden sm:block" aria-label="Account">
                <User className="h-5 w-5" />
              </Link>
              <button
                onClick={onCartClick}
                className="text-[#3A2930] hover:text-[#E8A0B8] transition-colors relative flex items-center p-1"
                aria-label={`Cart (${cartItemsCount} items)`}
              >
                <ShoppingBag className="h-5 w-5" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-[#E8A0B8] text-white text-[9px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
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
        <div className="fixed inset-0 z-[80] bg-[#3A2930]/40 backdrop-blur-sm flex items-start justify-center pt-[10vh] px-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden">
            <form onSubmit={handleSearch} className="flex items-center gap-4 px-6 py-4">
              <Search className="w-5 h-5 text-[#806B73] shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search for handmade gifts, macrame, candles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 text-lg text-[#3A2930] placeholder:text-[#C4A8B3] outline-none bg-transparent"
              />
              <button
                type="button"
                onClick={() => setIsSearchOpen(false)}
                className="p-2 text-[#806B73] hover:text-[#3A2930] rounded-full hover:bg-[#FFF5F8] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </form>
            <div className="border-t border-[#F0DDE4] px-6 py-4">
              <p className="text-xs text-[#806B73] mb-3 font-medium">POPULAR SEARCHES</p>
              <div className="flex flex-wrap gap-2">
                {['Gift boxes', 'Resin keychains', 'Macrame', 'Candles', 'Personalized frames', 'Ceramic mugs'].map(tag => (
                  <button
                    key={tag}
                    onClick={() => { navigate(`/shop?search=${encodeURIComponent(tag)}`); setIsSearchOpen(false); }}
                    className="text-sm bg-[#FFF5F8] text-[#E8A0B8] px-3 py-1.5 rounded-full hover:bg-[#FCE7EF] transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[75] bg-white md:hidden flex flex-col">
          <div className="flex items-center justify-between px-6 py-5 border-b border-[#F0DDE4]">
            <Link to="/" className="text-2xl font-serif font-bold text-[#3A2930]" onClick={() => setIsMobileMenuOpen(false)}>
              Soul Craft<span className="text-[#E8A0B8]">.</span>
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 text-[#806B73] hover:text-[#3A2930]"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <nav className="flex flex-col px-6 py-8 space-y-6 flex-1">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.path}
                className={cn(
                  "text-2xl font-serif font-medium transition-colors",
                  location.pathname === link.path ? "text-[#E8A0B8]" : "text-[#3A2930]"
                )}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="px-6 pb-12 space-y-4 border-t border-[#F0DDE4] pt-6">
            <Link to="/account" className="flex items-center gap-4 text-lg text-[#3A2930]" onClick={() => setIsMobileMenuOpen(false)}>
              <User className="h-5 w-5 text-[#E8A0B8]" /> My Account
            </Link>
            <Link to="/wishlist" className="flex items-center gap-4 text-lg text-[#3A2930]" onClick={() => setIsMobileMenuOpen(false)}>
              <Heart className="h-5 w-5 text-[#E8A0B8]" /> Wishlist ({wishlistItemsCount})
            </Link>
            <button
              onClick={() => { setIsMobileMenuOpen(false); onCartClick(); }}
              className="flex items-center gap-4 text-lg text-[#3A2930] w-full"
            >
              <ShoppingBag className="h-5 w-5 text-[#E8A0B8]" /> Cart ({cartItemsCount})
            </button>
          </div>
        </div>
      )}
    </>
  );
}
