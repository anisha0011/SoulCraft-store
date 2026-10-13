import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import CustomOrder from './pages/CustomOrder';
import About from './pages/About';
import Contact from './pages/Contact';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import TrackOrder from './pages/TrackOrder';
import Account from './pages/Account';
import AdminDashboard from './pages/AdminDashboard';
import { ToastContainer } from './components/common/ToastContainer';
import CartSlideover from './components/common/CartSlideover';

function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar onCartClick={() => setIsCartOpen(true)} />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:slug" element={<ProductDetails />} />
            <Route path="/custom-orders" element={<CustomOrder />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-confirmation/:id" element={<OrderConfirmation />} />
            <Route path="/track-order" element={<TrackOrder />} />
            <Route path="/account" element={<Account />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </main>
        <Footer />
        <CartSlideover isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        <ToastContainer />
      </div>
    </Router>
  );
}

export default App;
