import { Link } from 'react-router-dom';
import { Heart, Share2, MessageCircle, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#FFF9FB] pt-16 pb-8 border-t border-[#F0DDE4]">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand Column */}
          <div>
            <Link to="/" className="text-2xl font-serif font-bold text-[#3A2930] flex items-center mb-4">
              Soul Craft
              <span className="text-[#E8A0B8] ml-1">.</span>
            </Link>
            <p className="text-[#806B73] text-sm leading-relaxed mb-6 max-w-xs">
              Handcrafted with love, made especially for you. Every piece tells a story of creativity, craftsmanship, and care.
            </p>
            <div className="flex space-x-4 text-[#3A2930]">
              <a href="#" aria-label="Instagram" className="hover:text-[#E8A0B8] transition-colors"><Share2 className="h-5 w-5" /></a>
              <a href="#" aria-label="Pinterest" className="hover:text-[#E8A0B8] transition-colors"><MessageCircle className="h-5 w-5" /></a>
              <a href="mailto:hello@soulcraft.in" aria-label="Email" className="hover:text-[#E8A0B8] transition-colors"><Mail className="h-5 w-5" /></a>
            </div>
          </div>

          {/* Shop Column */}
          <div>
            <h4 className="font-serif font-semibold text-[#3A2930] mb-4 text-lg">Shop</h4>
            <ul className="space-y-3 text-sm text-[#806B73]">
              <li><Link to="/shop" className="hover:text-[#E8A0B8] transition-colors">All Products</Link></li>
              <li><Link to="/shop?sort=newest" className="hover:text-[#E8A0B8] transition-colors">New Arrivals</Link></li>
              <li><Link to="/shop?sort=popular" className="hover:text-[#E8A0B8] transition-colors">Bestsellers</Link></li>
              <li><Link to="/offers" className="hover:text-[#E8A0B8] transition-colors">Offers</Link></li>
            </ul>
          </div>

          {/* Customer Care Column */}
          <div>
            <h4 className="font-serif font-semibold text-[#3A2930] mb-4 text-lg">Customer Care</h4>
            <ul className="space-y-3 text-sm text-[#806B73]">
              <li><Link to="/contact" className="hover:text-[#E8A0B8] transition-colors">Contact Us</Link></li>
              <li><Link to="/faq" className="hover:text-[#E8A0B8] transition-colors">FAQ</Link></li>
              <li><Link to="/shipping" className="hover:text-[#E8A0B8] transition-colors">Shipping Policy</Link></li>
              <li><Link to="/returns" className="hover:text-[#E8A0B8] transition-colors">Returns & Refunds</Link></li>
              <li><Link to="/track-order" className="hover:text-[#E8A0B8] transition-colors">Track Order</Link></li>
            </ul>
          </div>

          {/* About Column */}
          <div>
            <h4 className="font-serif font-semibold text-[#3A2930] mb-4 text-lg">About</h4>
            <ul className="space-y-3 text-sm text-[#806B73]">
              <li><Link to="/about" className="hover:text-[#E8A0B8] transition-colors">Our Story</Link></li>
              <li><Link to="/custom-orders" className="hover:text-[#E8A0B8] transition-colors">Custom Orders</Link></li>
              <li><Link to="/about#craftsmanship" className="hover:text-[#E8A0B8] transition-colors">Craftsmanship</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#F0DDE4] pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-[#806B73]">
          <div className="flex items-center mb-4 md:mb-0">
            <span className="mr-1">© {new Date().getFullYear()} Soul Craft. Made with</span>
            <Heart className="h-3 w-3 mx-1 text-[#E8A0B8] fill-[#E8A0B8]" />
            <span>in India.</span>
          </div>
          <div className="flex space-x-6">
            <Link to="/privacy" className="hover:text-[#E8A0B8] transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-[#E8A0B8] transition-colors">Terms & Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
