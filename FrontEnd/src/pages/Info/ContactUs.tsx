
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageSquare, Instagram, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ContactUs: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setFormState({ name: '', email: '', subject: '', message: '' });
    }, 1500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  return (
    <div className="bg-brand-black min-h-screen pt-24 pb-20 px-4 md:px-8">

      {/* Header */}
      <div className="container mx-auto mb-16 text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-brand-bone uppercase tracking-[0.3em] text-xs font-bold mb-4"
        >
          Soporte y Consultas
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter"
        >
          Contáctanos
        </motion.h1>
      </div>

      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-white font-bold uppercase tracking-widest text-lg border-b border-brand-dark pb-4 mb-8">
              Enviar un Mensaje
            </h2>

            {submitted ? (
              <div className="bg-brand-dark/20 border border-brand-bone p-8 text-center">
                <div className="w-16 h-16 bg-brand-bone rounded-full flex items-center justify-center mx-auto mb-6 text-brand-black">
                  <MessageSquare size={24} />
                </div>
                <h3 className="text-2xl font-black text-white uppercase italic mb-2">Mensaje Enviado</h3>
                <p className="text-neutral-400 text-sm mb-6">
                  Gracias por contactarnos. Nuestro equipo te responderá en 24-48 horas.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="text-xs font-bold uppercase tracking-widest text-brand-bone hover:text-white border-b border-brand-bone pb-1"
                >
                  Enviar Otro Mensaje
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs uppercase font-bold text-neutral-500 mb-2">Nombre</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formState.name}
                      onChange={handleChange}
                      className="w-full bg-brand-dark/20 border border-brand-dark p-4 text-white focus:outline-none focus:border-brand-bone transition-colors"
                      placeholder="TU NOMBRE"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase font-bold text-neutral-500 mb-2">Correo Electrónico</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formState.email}
                      onChange={handleChange}
                      className="w-full bg-brand-dark/20 border border-brand-dark p-4 text-white focus:outline-none focus:border-brand-bone transition-colors"
                      placeholder="TU@EJEMPLO.COM"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase font-bold text-neutral-500 mb-2">Asunto</label>
                  <input
                    type="text"
                    name="subject"
                    required
                    value={formState.subject}
                    onChange={handleChange}
                    className="w-full bg-brand-dark/20 border border-brand-dark p-4 text-white focus:outline-none focus:border-brand-bone transition-colors"
                    placeholder="PEDIDO #, COLABORACIÓN, ETC."
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-bold text-neutral-500 mb-2">Mensaje</label>
                  <textarea
                    name="message"
                    required
                    rows={6}
                    value={formState.message}
                    onChange={handleChange}
                    className="w-full bg-brand-dark/20 border border-brand-dark p-4 text-white focus:outline-none focus:border-brand-bone transition-colors resize-none"
                    placeholder="¿CÓMO PODEMOS AYUDARTE?"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-white text-black py-4 font-black uppercase tracking-[0.2em] hover:bg-brand-bone transition-colors flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {isSubmitting ? 'Enviando...' : 'Enviar Mensaje'} <ArrowRight size={16} />
                </button>
              </form>
            )}
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-12"
          >
            <div>
              <h2 className="text-white font-bold uppercase tracking-widest text-lg border-b border-brand-dark pb-4 mb-8">
                Contacto Directo
              </h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-brand-dark/40 flex items-center justify-center text-brand-bone">
                    <Mail size={20} />
                  </div>
                  <div>
                    <h3 className="text-white font-bold uppercase text-sm mb-1">Envíanos un Correo</h3>
                    <p className="text-neutral-500 text-sm mb-1">Para consultas de pedidos y soporte:</p>
                    <a href="mailto:support@goustty.com" className="text-brand-bone hover:text-white transition-colors font-medium">
                      support@goustty.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-brand-dark/40 flex items-center justify-center text-brand-bone">
                    <Instagram size={20} />
                  </div>
                  <div>
                    <h3 className="text-white font-bold uppercase text-sm mb-1">Síguenos</h3>
                    <p className="text-neutral-500 text-sm mb-1">Para lanzamientos diarios y actualizaciones:</p>
                    <a href="#" className="text-brand-bone hover:text-white transition-colors font-medium">
                      @goustty.co
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-brand-dark/40 flex items-center justify-center text-brand-bone">
                    <Clock size={20} />
                  </div>
                  <div>
                    <h3 className="text-white font-bold uppercase text-sm mb-1">Horario</h3>
                    <p className="text-neutral-500 text-sm">
                      Lun - Vie: 9:00 AM - 6:00 PM EST<br />
                      Sáb: 10:00 AM - 4:00 PM EST
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-brand-bone text-brand-black p-8">
              <h3 className="text-xl font-black uppercase italic mb-4">Preguntas Frecuentes</h3>
              <p className="font-medium text-sm mb-6">
                ¿Tienes una pregunta rápida sobre tiempos de envío, devoluciones o tallas? Revisa nuestras preguntas frecuentes primero.
              </p>
              <Link
                to="/faq"
                className="inline-block border-2 border-brand-black px-6 py-3 font-bold uppercase tracking-widest text-xs hover:bg-brand-black hover:text-brand-bone transition-colors"
              >
                Ver Página de Preguntas Frecuentes
              </Link>
            </div>

          </motion.div>

        </div>
      </div>
    </div>
  );
};
