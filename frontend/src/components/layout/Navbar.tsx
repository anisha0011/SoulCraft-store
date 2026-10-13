import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Heart, User, ShoppingBag, Menu, X } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { useWishlistStore } from '../../store/useWishlistStore';
import { cn } from '../../utils/utils';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  const cartItemsCount = useCartStore(state => state.items.reduce((acc, item) => acc + item.quantity, 0));
  const wishlistItemsCount = useWishlistStore(state => state.items.length);

  // Handle scroll effect for sticky header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'Custom Orders', path: '/custom-orders' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full flex flex-col">
      {/* Announcement Bar */}
      <div className="bg-[#FFF5F8] text-[#3A2930] py-2 text-center text-sm font-medium tracking-wide">
        ✨ Handmade with Love • Free Shipping on Orders Above ₹999
      </div>

      {/* Main Navbar */}
      <div 
        className={cn(
          "bg-white/80 backdrop-blur-md border-b transition-all duration-300",
          isScrolled ? "border-[#F0DDE4] shadow-sm py-3" : "border-transparent py-5"
        )}
      >
        <div className="container mx-auto px-4 md:px-8 flex items-center justify-between">
          
          {/* Mobile Menu Button (Left on Mobile) */}
          <button 
            className="md:hidden text-[#3A2930]"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu className="h-6 w-6" />
          </button>

          {/* Logo */}
          <Link to="/" className="text-2xl md:text-3xl font-serif font-bold text-[#3A2930] flex items-center">
            Soul Craft
            <span className="text-[#E8A0B8] ml-1">.</span>
          </Link>

          {/* Desktop Navigation (Center) */}
          <nav className="hidden md:flex items-center space-x-8">
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

          {/* Icons (Right) */}
          <div className="flex items-center space-x-4 md:space-x-6">
            <button className="text-[#3A2930] hover:text-[#E8A0B8] transition-colors hidden sm:block">
              <Search className="h-5 w-5" />
            </button>
            <Link to="/wishlist" className="text-[#3A2930] hover:text-[#E8A0B8] transition-colors relative hidden sm:block">
              <Heart className="h-5 w-5" />
              {wishlistItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#D9536F] text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                  {wishlistItemsCount}
                </span>
              )}
            </Link>
            <Link to="/account" className="text-[#3A2930] hover:text-[#E8A0B8] transition-colors hidden sm:block">
              <User className="h-5 w-5" />
            </Link>
            <Link to="/cart" className="text-[#3A2930] hover:text-[#E8A0B8] transition-colors relative flex items-center">
              <ShoppingBag className="h-5 w-5" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#E8A0B8] text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </Link>
          </div>

        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-white md:hidden pt-24 px-6 flex flex-col h-screen overflow-y-auto">
          <button 
            className="absolute top-16 left-4 text-[#3A2930]"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X className="h-8 w-8" />
          </button>
          
          <nav className="flex flex-col space-y-6 mt-8">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.path}
                className={cn(
                  "text-2xl font-serif font-medium",
                  location.pathname === link.path ? "text-[#E8A0B8]" : "text-[#3A2930]"
                )}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="mt-auto pb-12 flex flex-col space-y-6 border-t border-[#F0DDE4] pt-8">
            <Link to="/account" className="flex items-center text-lg text-[#3A2930]">
              <User className="h-6 w-6 mr-4" /> My Account
            </Link>
            <Link to="/wishlist" className="flex items-center text-lg text-[#3A2930]">
              <Heart className="h-6 w-6 mr-4" /> Wishlist ({wishlistItemsCount})
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
