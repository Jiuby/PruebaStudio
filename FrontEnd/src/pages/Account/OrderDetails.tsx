import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useShop } from '../../context/ShopContext';
import { useAuth } from '../../context/AuthContext';
import { ArrowLeft, MapPin, Package, CheckCircle, Clock, Truck, FileText, ShoppingBag, X, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import jsPDF from 'jspdf';
import api from '../../services/api';
import { Order } from '../../types';

export const OrderDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addToCart, toggleCart, isCartOpen, orders, products } = useShop();
  const [fetchedOrder, setFetchedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Try to find order in context first, then use fetched order
  const order = orders.find(o => String(o.id) === String(id)) || fetchedOrder;

  useEffect(() => {
    // Redirect to home if not authenticated
    if (!isAuthenticated) {
      navigate('/');
      return;
    }

    window.scrollTo(0, 120);

    // If order not in context, try to fetch it from backend
    if (!orders.find(o => String(o.id) === String(id)) && id) {
      setLoading(true);
      api.get(`/orders/${id}/`)
        .then(response => {
          setFetchedOrder(response.data);
          setLoading(false);
        })
        .catch(err => {
          console.error('Failed to fetch order:', err);
          if (err.response && err.response.status === 401) {
            // Token is invalid, clear it and redirect to home
            localStorage.removeItem('authToken');
            setError('Your session has expired. Redirecting to home...');
            setTimeout(() => navigate('/'), 2000);
          } else {
            setError('Failed to load order details');
          }
          setLoading(false);
        });
    }
  }, [id, orders, isAuthenticated, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-black flex items-center justify-center text-white">
        <p>Cargando detalles del pedido...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-brand-black flex items-center justify-center text-white">
        <div className="text-center">
          <h2 className="text-4xl font-black uppercase mb-4">Pedido No Encontrado</h2>
          <p className="text-neutral-500 mb-4">{error || 'Este pedido no existe o no tienes permiso para verlo.'}</p>
          <Link to="/account" className="text-brand-bone underline uppercase tracking-widest text-sm">Volver al Panel</Link>
        </div>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  const downloadInvoice = () => {
    const doc = new jsPDF();

    // Calculate totals
    const itemsSubtotal = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shippingCost = order.total - itemsSubtotal;

    // Company Header
    doc.setFillColor(26, 26, 26);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(216, 212, 197);
    doc.setFontSize(28);
    doc.setFont('helvetica', 'bold');
    doc.text('GOUSTTY', 20, 25);

    // Invoice Title
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.text('FACTURA', 150, 25);

    // Order Info
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Pedido #${order.id}`, 20, 55);
    doc.text(`Fecha: ${order.date}`, 20, 62);
    doc.text(`Estado: ${order.status}`, 20, 69);

    // Customer Info
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('FACTURAR A:', 20, 85);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(order.customerName, 20, 93);
    if (order.shippingDetails) {
      doc.text(order.shippingDetails.address || '', 20, 100);
      doc.text(`${order.shippingDetails.city || ''} ${order.shippingDetails.zip || ''}`, 20, 107);
      if (order.shippingDetails.phone) {
        doc.text(order.shippingDetails.phone, 20, 114);
      }
    }

    // Items Table Header
    let yPos = 135;
    doc.setFillColor(216, 212, 197);
    doc.rect(20, yPos - 7, 170, 10, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('ARTÍCULO', 25, yPos);
    doc.text('CANT', 110, yPos);
    doc.text('PRECIO', 135, yPos);
    doc.text('TOTAL', 165, yPos);

    // Items
    yPos += 10;
    doc.setFont('helvetica', 'normal');
    order.items.forEach((item) => {
      doc.text(item.name.substring(0, 30), 25, yPos);
      doc.text(`${item.quantity}`, 110, yPos);
      doc.text(formatPrice(item.price), 135, yPos);
      doc.text(formatPrice(item.price * item.quantity), 165, yPos);
      yPos += 8;
    });

    // Totals
    yPos += 10;
    doc.setDrawColor(200, 200, 200);
    doc.line(120, yPos, 190, yPos);
    yPos += 8;
    doc.text('Subtotal:', 120, yPos);
    doc.text(formatPrice(itemsSubtotal), 165, yPos);
    yPos += 7;
    doc.text('Envío:', 120, yPos);
    doc.text(shippingCost === 0 ? 'GRATIS' : formatPrice(shippingCost), 165, yPos);
    yPos += 7;
    doc.text('Impuestos:', 120, yPos);
    doc.text('Incluido', 165, yPos);

    // Grand Total
    yPos += 10;
    doc.setFillColor(26, 26, 26);
    doc.rect(120, yPos - 7, 70, 12, 'F');
    doc.setTextColor(216, 212, 197);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('TOTAL:', 125, yPos);
    doc.text(formatPrice(order.total), 165, yPos);

    // Footer
    doc.setTextColor(128, 128, 128);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('¡Gracias por tu compra!', 105, 280, { align: 'center' });
    doc.text('GOUSTTY - Premium Streetwear', 105, 285, { align: 'center' });

    // Save
    doc.save(`GOUSTTY-Invoice-${order.id}.pdf`);
  };

  const handleBuyAgain = () => {
    console.log('Buy Again clicked');
    console.log('Order items:', order.items);

    order.items.forEach(item => {
      // Reconstruct product object from order item data
      // We have all the info we need from the order item itself
      const productForCart = {
        id: item.productId,
        name: item.name,
        price: Number(item.price),
        image: item.image,
        // We need these fields for addToCart to work, but they're not critical
        category: '',
        description: '',
        inStock: true,
        colors: item.color ? [item.color] : [],
        sizes: [item.size],
        availableSizes: [item.size]
      };

      console.log(`Adding ${item.quantity}x ${item.name} (size: ${item.size}, color: ${item.color})`);

      // Add the specific quantity ordered with size and color
      for (let i = 0; i < item.quantity; i++) {
        addToCart(productForCart, item.size, item.color);
      }
    });
  };

  // Helper to calculate mock dates relative to order creation
  const getStepDate = (baseDateStr: string, daysToAdd: number) => {
    const date = new Date(baseDateStr);
    date.setDate(date.getDate() + daysToAdd);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Timeline Logic
  const steps = order.status === 'Cancelled' ? [
    {
      label: 'Pedido Realizado',
      icon: Clock,
      completed: true,
      date: order.date,
      info: 'Pedido recibido.'
    },
    {
      label: 'Cancelado',
      icon: X,
      completed: true,
      date: order.date,
      info: 'El pedido ha sido cancelado.'
    }
  ] : [
    {
      label: 'Pedido Realizado',
      icon: Clock,
      completed: true,
      date: order.date,
      info: 'Pedido recibido y confirmado.'
    },
    {
      label: 'Procesando',
      icon: Package,
      completed: true,
      date: getStepDate(order.date, 1),
      info: 'Tus artículos están siendo empacados.'
    },
    {
      label: 'Enviado',
      icon: Truck,
      completed: ['Shipped', 'Delivered'].includes(order.status),
      date: getStepDate(order.date, 3),
      info: 'Entregado al socio logístico.'
    },
    {
      label: 'Entregado',
      icon: CheckCircle,
      completed: order.status === 'Delivered',
      date: getStepDate(order.date, 6),
      info: 'Paquete entregado exitosamente.'
    },
  ];

  return (
    <div className="min-h-screen bg-brand-black pt-24 pb-20 px-4 md:px-8">

      {/* Breadcrumb / Back */}
      <div className="container mx-auto mb-8">
        <button onClick={() => navigate('/account')} className="flex items-center text-neutral-500 hover:text-white transition-colors text-xs uppercase tracking-widest gap-2 mb-6">
          <ArrowLeft size={16} /> Volver a Pedidos
        </button>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-brand-dark pb-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-white uppercase italic tracking-tighter leading-none mb-2">
              Pedido #{order.id}
            </h1>
            <p className="text-neutral-500 uppercase tracking-widest text-xs">
              Estado Actual: <span className="text-brand-bone font-bold">{order.status}</span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={downloadInvoice}
              className="border border-brand-bone text-brand-bone px-6 py-2 text-xs font-bold uppercase tracking-widest hover:bg-brand-bone hover:text-black transition-colors flex items-center gap-2"
            >
              <FileText size={14} /> Descargar Factura
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto mb-8">
        <div className="bg-brand-dark/20 border border-brand-dark p-6 flex items-start gap-4">
          <div className="p-2 bg-brand-dark rounded-full text-brand-bone">
            <CheckCircle size={20} />
          </div>
          <div className="space-y-2">
            <p className="text-sm text-white font-bold uppercase">Instrucciones de Pago</p>
            <p className="text-xs text-neutral-400 uppercase leading-relaxed">
              Tiene que hacer un pago al nequi al numero de <span className="text-brand-bone font-bold">3053111031</span> y que tiene que enviar el comprobante al whatsapp con el mismo numero, y que si en 24 horas no se encuentra el comprobante se le cancela manualmente la orden.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">

        {/* Left Column: Timeline & Items */}
        <div className="lg:col-span-2 space-y-12">

          {/* Status Timeline */}
          <section className="bg-brand-dark/20 border border-brand-dark p-8">
            <h3 className="text-white font-bold uppercase tracking-widest text-sm mb-8">Línea de Tiempo del Pedido</h3>
            <div className="relative">
              {/* Timeline Items */}
              <div className="flex flex-col md:flex-row justify-between relative gap-8 md:gap-0">

                {/* Connecting Line (Desktop) */}
                <div className="hidden md:block absolute top-5 left-0 w-full h-0.5 bg-brand-dark -z-10"></div>

                {steps.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <div key={index} className="flex md:flex-col items-start md:items-center gap-4 md:gap-4 flex-1">

                      {/* Icon Circle */}
                      <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${step.completed
                        ? 'bg-brand-black border-brand-bone text-brand-bone shadow-[0_0_15px_rgba(216,212,197,0.3)]'
                        : 'bg-brand-black border-neutral-800 text-neutral-800'
                        }`}>
                        <Icon size={18} />
                      </div>

                      {/* Info Text */}
                      <div className={`md:text-center transition-all duration-500 ${step.completed ? 'opacity-100' : 'opacity-40'}`}>
                        <h4 className={`text-xs font-bold uppercase tracking-widest mb-1 ${step.completed ? 'text-white' : 'text-neutral-600'}`}>
                          {step.label}
                        </h4>

                        {/* Show Info ONLY if step is completed */}
                        {step.completed && (
                          <motion.div
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex flex-col"
                          >
                            <span className="text-[10px] text-brand-bone font-bold uppercase">{step.date}</span>
                            <span className="text-[10px] text-neutral-500 mt-1 max-w-[120px] mx-auto hidden md:block">{step.info}</span>
                            <span className="text-[10px] text-neutral-500 mt-1 md:hidden">{step.info}</span>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Items List */}
          <section>
            <h3 className="text-white font-bold uppercase tracking-widest text-sm mb-6 pb-2 border-b border-brand-dark">
              Artículos Pedidos ({order.items.length})
            </h3>
            <div className="space-y-6">
              {order.items.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex gap-6 items-start"
                >
                  <Link to={`/product/${item.productId}`} className="w-24 h-32 bg-brand-dark flex-shrink-0 overflow-hidden group">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  </Link>
                  <div className="flex-1 flex flex-col md:flex-row justify-between">
                    <div>
                      <h4 className="text-white text-lg font-black uppercase italic tracking-tighter mb-2">
                        <Link to={`/product/${item.productId}`} className="hover:text-brand-bone transition-colors">
                          {item.name}
                        </Link>
                      </h4>
                      <div className="space-y-1 text-xs text-neutral-400 uppercase tracking-wide">
                        {item.color && <p>Color: <span className="text-white">{item.color}</span></p>}
                        <p>Talla: <span className="text-white">{item.size}</span></p>
                        <p>Cant: <span className="text-white">{item.quantity}</span></p>
                      </div>
                    </div>
                    <div className="mt-4 md:mt-0 text-right">
                      <p className="text-white font-bold text-lg">{formatPrice(item.price)}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column: Summary */}
        <div className="lg:col-span-1">
          <div className="bg-brand-dark/20 border border-brand-dark p-6 sticky top-32 space-y-8">

            {/* Shipping Info */}
            <div>
              <h3 className="flex items-center gap-2 text-brand-bone font-bold uppercase tracking-widest text-xs mb-4">
                <MapPin size={14} /> Dirección de Envío
              </h3>
              <div className="text-sm text-neutral-400 leading-relaxed">
                <p className="text-white font-bold uppercase">{order.customerName}</p>
                {order.shippingDetails && (
                  <>
                    <p>{order.shippingDetails.address}</p>
                    <p>{order.shippingDetails.city}</p>
                    {order.shippingDetails.zip && <p>{order.shippingDetails.zip}</p>}
                    {order.shippingDetails.phone && <p className="mt-2">{order.shippingDetails.phone}</p>}
                  </>
                )}
              </div>
            </div>

            <div className="h-px bg-brand-dark"></div>

            {/* Cost Breakdown */}
            <div className="space-y-3">
              {(() => {
                // Calculate actual subtotal from items
                const itemsSubtotal = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                const shippingCost = order.total - itemsSubtotal;

                return (
                  <>
                    <div className="flex justify-between text-sm text-neutral-400">
                      <span>Subtotal</span>
                      <span>{formatPrice(itemsSubtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-neutral-400">
                      <span>Envío</span>
                      <span>{shippingCost === 0 ? 'Gratis' : formatPrice(shippingCost)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-neutral-400">
                      <span>Impuestos</span>
                      <span>Incluido</span>
                    </div>
                    <div className="border-t border-brand-dark pt-3 mt-3 flex justify-between items-center">
                      <span className="text-white font-black uppercase italic text-lg">Total</span>
                      <span className="text-brand-bone font-bold text-xl">{formatPrice(order.total)}</span>
                    </div>
                  </>
                );
              })()}
            </div>

            <button
              onClick={handleBuyAgain}
              className="w-full bg-white text-black py-4 font-bold uppercase tracking-widest hover:bg-brand-bone transition-colors flex items-center justify-center gap-2"
            >
              <ShoppingBag size={16} /> Comprar de Nuevo
            </button>

          </div>
        </div>

      </div>
    </div>
  );
};