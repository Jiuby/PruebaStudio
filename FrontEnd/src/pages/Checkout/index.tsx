
import React, { useState, useEffect } from 'react';
import { useShop } from '../../context/ShopContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Lock, CreditCard, Truck } from 'lucide-react';
import { Order, OrderItem } from '../../types';

export const Checkout: React.FC = () => {
  const { cart, cartTotal, clearCart, createOrder } = useShop();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  // Add a flag to track if the order was just completed successfully
  const [orderComplete, setOrderComplete] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    zip: '',
    phone: '',
    cardNumber: '',
    expiry: '',
    cvc: ''
  });

  // Pre-fill user data
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        email: user.email,
        firstName: user.name.split(' ')[0] || '',
        lastName: user.name.split(' ').slice(1).join(' ') || '',
        address: user.address || '',
        city: user.city || '',
        zip: user.zip || '',
        phone: user.phone || ''
      }));
    }
  }, [user]);

  // Redirect if cart is empty, BUT only if order is NOT complete.
  // This prevents the user from being kicked back to /shop when clearCart() runs during checkout.
  useEffect(() => {
    if (cart.length === 0 && !orderComplete) {
      navigate('/shop');
    }
  }, [cart, navigate, orderComplete]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // 1. Create new order object
    const newOrderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const orderDate = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    const orderItems: OrderItem[] = cart.map(item => ({
      productId: item.id,
      name: item.name,
      image: item.image,
      price: item.price,
      quantity: item.quantity,
      size: item.size
    }));

    const newOrder: Order = {
      id: newOrderId,
      date: orderDate,
      status: 'Processing',
      total: cartTotal,
      items: orderItems,
      customerName: `${formData.firstName} ${formData.lastName}`,
      customerEmail: formData.email,
      shippingDetails: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        address: formData.address,
        city: formData.city,
        zip: formData.zip,
        phone: formData.phone
      }
    };

    // 2. Simulate Payment Processing (2 seconds)
    setTimeout(() => {
      // CRITICAL: Set this flag to true BEFORE clearing the cart to prevent the useEffect redirect
      setOrderComplete(true);

      createOrder(newOrder); // Save to global context
      clearCart();           // Empty the cart
      setLoading(false);

      // 3. REDIRECT to Order Success Page
      navigate('/order-success', {
        state: {
          orderId: newOrderId,
          email: formData.email
        }
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-brand-black pt-24 pb-20 px-4 md:px-8">
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">

          {/* Left Column: Forms */}
          <div className="flex-1">
            <h1 className="text-4xl font-black uppercase italic text-white mb-8">Checkout</h1>

            <form onSubmit={handleSubmit} className="space-y-12">

              {/* Contact Info */}
              <section>
                <h2 className="text-white font-bold uppercase tracking-widest text-sm border-b border-brand-dark pb-4 mb-6">
                  01. Contact Information
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs uppercase text-neutral-500 mb-2">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full bg-brand-dark/20 border border-brand-dark py-3 px-4 text-white font-medium focus:outline-none focus:border-brand-bone transition-colors"
                      placeholder="YOU@EXAMPLE.COM"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase text-neutral-500 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full bg-brand-dark/20 border border-brand-dark py-3 px-4 text-white font-medium focus:outline-none focus:border-brand-bone transition-colors"
                      placeholder="+57..."
                    />
                  </div>
                </div>
              </section>

              {/* Shipping Address */}
              <section>
                <h2 className="text-white font-bold uppercase tracking-widest text-sm border-b border-brand-dark pb-4 mb-6">
                  02. Shipping Details
                </h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase text-neutral-500 mb-2">First Name</label>
                      <input
                        type="text"
                        name="firstName"
                        required
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full bg-brand-dark/20 border border-brand-dark py-3 px-4 text-white font-medium focus:outline-none focus:border-brand-bone transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase text-neutral-500 mb-2">Last Name</label>
                      <input
                        type="text"
                        name="lastName"
                        required
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full bg-brand-dark/20 border border-brand-dark py-3 px-4 text-white font-medium focus:outline-none focus:border-brand-bone transition-colors"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs uppercase text-neutral-500 mb-2">Address</label>
                    <input
                      type="text"
                      name="address"
                      required
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full bg-brand-dark/20 border border-brand-dark py-3 px-4 text-white font-medium focus:outline-none focus:border-brand-bone transition-colors"
                      placeholder="STREET, APARTMENT, ETC."
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase text-neutral-500 mb-2">City</label>
                      <input
                        type="text"
                        name="city"
                        required
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full bg-brand-dark/20 border border-brand-dark py-3 px-4 text-white font-medium focus:outline-none focus:border-brand-bone transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase text-neutral-500 mb-2">Zip Code</label>
                      <input
                        type="text"
                        name="zip"
                        required
                        value={formData.zip}
                        onChange={handleInputChange}
                        className="w-full bg-brand-dark/20 border border-brand-dark py-3 px-4 text-white font-medium focus:outline-none focus:border-brand-bone transition-colors"
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* Payment */}
              <section>
                <h2 className="text-white font-bold uppercase tracking-widest text-sm border-b border-brand-dark pb-4 mb-6">
                  03. Payment Method
                </h2>

                <div className="bg-brand-dark/20 border border-brand-dark p-6 mb-6 flex items-center gap-4">
                  <Lock size={16} className="text-brand-bone" />
                  <p className="text-xs text-neutral-400 uppercase">All transactions are secure and encrypted.</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs uppercase text-neutral-500 mb-2">Card Number</label>
                    <div className="relative">
                      <input
                        type="text"
                        name="cardNumber"
                        required
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        className="w-full bg-brand-dark/20 border border-brand-dark py-3 px-4 text-white font-medium focus:outline-none focus:border-brand-bone transition-colors pl-12"
                        placeholder="0000 0000 0000 0000"
                      />
                      <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase text-neutral-500 mb-2">Expiry Date</label>
                      <input
                        type="text"
                        name="expiry"
                        required
                        value={formData.expiry}
                        onChange={handleInputChange}
                        className="w-full bg-brand-dark/20 border border-brand-dark py-3 px-4 text-white font-medium focus:outline-none focus:border-brand-bone transition-colors"
                        placeholder="MM / YY"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase text-neutral-500 mb-2">CVC</label>
                      <input
                        type="text"
                        name="cvc"
                        required
                        value={formData.cvc}
                        onChange={handleInputChange}
                        className="w-full bg-brand-dark/20 border border-brand-dark py-3 px-4 text-white font-medium focus:outline-none focus:border-brand-bone transition-colors"
                        placeholder="123"
                      />
                    </div>
                  </div>
                </div>
              </section>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-white text-black h-14 font-black uppercase tracking-[0.2em] hover:bg-brand-bone transition-all mt-8 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing...' : `Pay ${formatPrice(cartTotal)}`}
              </button>

            </form>
          </div>

          {/* Right Column: Summary */}
          <div className="w-full lg:w-96 flex-shrink-0">
            <div className="sticky top-32 bg-brand-dark/10 border border-brand-dark p-6">
              <h3 className="text-white font-bold uppercase tracking-widest text-sm mb-6">Order Summary</h3>

              <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {cart.map((item) => (
                  <div key={`${item.id}-${item.size}`} className="flex gap-4">
                    <div className="w-16 h-20 bg-brand-dark flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white text-xs font-bold uppercase leading-tight mb-1">{item.name}</h4>
                      <p className="text-[10px] text-neutral-500 uppercase">Size: {item.size}</p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-[10px] text-neutral-400">Qty: {item.quantity}</span>
                        <span className="text-xs text-brand-bone font-bold">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="h-px bg-brand-dark my-4"></div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-neutral-400">
                  <span>Subtotal</span>
                  <span>{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>Shipping</span>
                  <span>Calculated</span>
                </div>
                <div className="flex justify-between text-white font-bold pt-4 border-t border-brand-dark mt-4">
                  <span className="uppercase">Total</span>
                  <span className="text-xl">{formatPrice(cartTotal)}</span>
                </div>
              </div>

              <div className="mt-6 flex items-start gap-2 text-[10px] text-neutral-500 uppercase leading-tight">
                <Truck size={14} className="flex-shrink-0" />
                <p>Orders are processed within 24-48 hours. Shipping times vary by location.</p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
