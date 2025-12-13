import React, { useState } from 'react';
import { Plus, X, MessageSquare, GripVertical, Package, User, MapPin, Phone, Mail, Copy, Check } from 'lucide-react';
import { useShop } from '../../../context/ShopContext';
import { Order } from '../../../types';
import { motion, AnimatePresence } from 'framer-motion';

export const AgileBoardTab: React.FC = () => {
    const {
        orders,
        kanbanColumns,
        addKanbanColumn,
        deleteKanbanColumn,
        reorderKanbanColumns,
        moveOrderToStage,
        addOrderNote
    } = useShop();

    const [newColumnName, setNewColumnName] = useState('');
    const [draggedOrder, setDraggedOrder] = useState<string | null>(null);
    const [draggedColumn, setDraggedColumn] = useState<string | null>(null);
    const [activeCommentOrder, setActiveCommentOrder] = useState<Order | null>(null);
    const [newNoteText, setNewNoteText] = useState('');
    const [copiedAddress, setCopiedAddress] = useState(false);

    // Fixed columns that cannot be deleted
    const FIXED_COLUMNS = ['PROCESANDO', 'EN TRÁNSITO', 'COMPLETADO'];

    // Order Drag Handlers
    const handleDragStart = (e: React.DragEvent, orderId: string) => {
        setDraggedOrder(orderId);
        e.dataTransfer.effectAllowed = 'move';
        e.stopPropagation();
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e: React.DragEvent, stage: string) => {
        e.preventDefault();
        if (draggedOrder) {
            moveOrderToStage(draggedOrder, stage);
            setDraggedOrder(null);
        }
    };

    // Column Drag Handlers
    const handleColumnDragStart = (e: React.DragEvent, columnName: string) => {
        setDraggedColumn(columnName);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleColumnDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleColumnDrop = (e: React.DragEvent, targetColumn: string) => {
        e.preventDefault();
        e.stopPropagation();

        if (draggedColumn && draggedColumn !== targetColumn) {
            const currentIndex = kanbanColumns.indexOf(draggedColumn);
            const targetIndex = kanbanColumns.indexOf(targetColumn);

            if (currentIndex !== -1 && targetIndex !== -1) {
                const newColumns = [...kanbanColumns];
                newColumns.splice(currentIndex, 1);
                newColumns.splice(targetIndex, 0, draggedColumn);
                reorderKanbanColumns(newColumns);
            }
        }
        setDraggedColumn(null);
    };

    const handleAddColumn = (e: React.FormEvent) => {
        e.preventDefault();
        if (newColumnName.trim()) {
            addKanbanColumn(newColumnName.trim());
            setNewColumnName('');
        }
    };

    const handleAddNote = (e: React.FormEvent) => {
        e.preventDefault();
        if (activeCommentOrder && newNoteText.trim()) {
            addOrderNote(activeCommentOrder.id, newNoteText.trim());
            setNewNoteText('');
            const updatedOrder = orders.find(o => o.id === activeCommentOrder.id);
            if (updatedOrder) setActiveCommentOrder(updatedOrder);
        }
    };

    const handleCopyAddress = () => {
        if (activeCommentOrder && activeCommentOrder.shippingDetails) {
            const { address, city, zip, phone } = activeCommentOrder.shippingDetails;
            const fullAddress = `${address}\n${city}, ${zip}\nTel: ${phone}`;
            navigator.clipboard.writeText(fullAddress);
            setCopiedAddress(true);
            setTimeout(() => setCopiedAddress(false), 2000);
        }
    };

    React.useEffect(() => {
        if (activeCommentOrder) {
            const updated = orders.find(o => o.id === activeCommentOrder.id);
            if (updated) setActiveCommentOrder(updated);
        }
    }, [orders, activeCommentOrder]);

    return (
        <div className="space-y-6 animate-fade-in h-[calc(100vh-100px)] flex flex-col">
            <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4 flex-shrink-0">
                <div>
                    <h2 className="text-3xl font-black uppercase italic text-white mb-2">Tablero de Gestión Ágil</h2>
                    <p className="text-neutral-500 text-xs uppercase tracking-widest">
                        Production & Fulfillment Pipeline ({orders.length} Active Orders)
                    </p>
                </div>

                {/* Add Column Form */}
                <form onSubmit={handleAddColumn} className="flex gap-2 bg-brand-dark/20 p-2 border border-brand-dark">
                    <input
                        type="text"
                        value={newColumnName}
                        onChange={(e) => setNewColumnName(e.target.value)}
                        placeholder="NUEVA CATEGORÍA"
                        className="bg-brand-dark/50 border border-brand-dark p-2 text-white text-xs font-bold uppercase focus:outline-none focus:border-brand-bone w-48"
                    />
                    <button
                        type="submit"
                        disabled={!newColumnName.trim()}
                        className="bg-brand-bone text-brand-black px-4 py-2 font-bold uppercase text-xs hover:bg-white disabled:opacity-50"
                    >
                        <Plus size={16} />
                    </button>
                </form>
            </div>

            {/* Board Container */}
            <div className="flex-1 overflow-x-auto pb-4 custom-scrollbar">
                <div className="flex gap-6 h-full min-w-max">

                    {kanbanColumns.map((column) => {
                        const columnOrders = orders.filter(o =>
                            (o.stage === column) || (!o.stage && column === kanbanColumns[0])
                        );
                        const isFixedColumn = FIXED_COLUMNS.includes(column);

                        return (
                            <div
                                key={column}
                                draggable
                                onDragStart={(e) => handleColumnDragStart(e, column)}
                                onDragOver={handleColumnDragOver}
                                onDrop={(e) => {
                                    handleColumnDrop(e, column);
                                    handleDrop(e, column); // Also handle order drops
                                }}
                                className={`w-80 bg-brand-dark/10 border-2 flex flex-col h-full flex-shrink-0 transition-all ${draggedColumn === column ? 'opacity-50 border-brand-bone' : 'border-brand-dark'
                                    }`}
                            >
                                {/* Column Header */}
                                <div className="p-4 border-b border-brand-dark bg-brand-dark/20 flex justify-between items-center group cursor-move">
                                    <div className="flex items-center gap-2">
                                        <GripVertical size={14} className="text-neutral-600" />
                                        <span className="w-2 h-2 rounded-full bg-brand-bone"></span>
                                        <h3 className="text-white font-bold uppercase text-xs tracking-widest">{column}</h3>
                                        <span className="bg-brand-dark text-neutral-400 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                                            {columnOrders.length}
                                        </span>
                                    </div>
                                    {/* Only show delete button for custom columns */}
                                    {!isFixedColumn && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (confirm(`¿Eliminar columna "${column}"? Los pedidos se moverán a PROCESANDO.`)) {
                                                    deleteKanbanColumn(column);
                                                }
                                            }}
                                            className="text-neutral-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X size={14} />
                                        </button>
                                    )}
                                </div>

                                {/* Drop Zone / List */}
                                <div className="flex-1 p-3 overflow-y-auto space-y-3 custom-scrollbar bg-brand-black/20">
                                    {columnOrders.map(order => (
                                        <div
                                            key={order.id}
                                            draggable
                                            onDragStart={(e) => handleDragStart(e, order.id)}
                                            onClick={() => setActiveCommentOrder(order)}
                                            className="bg-brand-black border border-brand-dark p-4 group hover:border-brand-bone/50 transition-colors cursor-pointer relative hover:shadow-lg transform hover:-translate-y-1 duration-200"
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="text-brand-bone font-bold text-xs">#{order.id}</span>
                                                <div className="text-neutral-500 cursor-move" onMouseDown={e => e.stopPropagation()}>
                                                    <GripVertical size={14} />
                                                </div>
                                            </div>

                                            <div className="mb-3">
                                                <p className="text-white text-xs font-bold uppercase truncate">{order.customerName || order.customerEmail}</p>
                                                <p className="text-[10px] text-neutral-500">{order.items.length} Items • {(new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(order.total))}</p>
                                            </div>

                                            {/* Notes Preview */}
                                            {order.internalNotes && order.internalNotes.length > 0 && (
                                                <div className="mb-3 bg-brand-dark/30 p-2 border-l-2 border-brand-bone/50">
                                                    <p className="text-[10px] text-neutral-400 italic truncate">
                                                        "{order.internalNotes[order.internalNotes.length - 1].text}"
                                                    </p>
                                                </div>
                                            )}

                                            <div className="flex justify-between items-center border-t border-brand-dark pt-3 mt-2">
                                                <div className="text-[10px] uppercase text-neutral-600 font-bold">{order.date}</div>
                                                <div className={`text-xs flex items-center gap-1 ${(order.internalNotes?.length || 0) > 0 ? 'text-brand-bone' : 'text-neutral-600'
                                                    }`}>
                                                    <MessageSquare size={12} /> {(order.internalNotes?.length || 0)}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {columnOrders.length === 0 && (
                                        <div className="h-24 border-2 border-dashed border-brand-dark/30 flex items-center justify-center text-neutral-700 text-[10px] uppercase font-bold">
                                            Empty Stage
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Comments & Details Modal */}
            <AnimatePresence>
                {activeCommentOrder && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-brand-black border border-brand-dark w-full max-w-5xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
                        >
                            <div className="flex justify-between items-center p-6 border-b border-brand-dark bg-brand-dark/10">
                                <div>
                                    <h3 className="text-white font-bold uppercase italic text-xl">Order #{activeCommentOrder.id}</h3>
                                    <div className="flex gap-4 mt-1">
                                        <p className="text-xs text-brand-bone font-bold uppercase tracking-widest">
                                            Stage: {activeCommentOrder.stage || kanbanColumns[0]}
                                        </p>
                                        <p className="text-xs text-neutral-500 uppercase">
                                            Status: {activeCommentOrder.status}
                                        </p>
                                    </div>
                                </div>
                                <button onClick={() => setActiveCommentOrder(null)} className="text-neutral-500 hover:text-white transition-colors">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="flex-1 flex flex-col md:flex-row overflow-hidden">

                                {/* LEFT: Product Information & Customer Details */}
                                <div className="w-full md:w-3/5 overflow-y-auto border-b md:border-b-0 md:border-r border-brand-dark custom-scrollbar bg-brand-black flex flex-col">

                                    {/* 1. Customer Details Section */}
                                    <div className="p-6 bg-brand-dark/10 border-b border-brand-dark">
                                        <div className="flex justify-between items-center mb-4">
                                            <h4 className="text-white font-bold uppercase text-xs tracking-widest flex items-center gap-2">
                                                <User size={14} className="text-brand-bone" /> Customer Profile
                                            </h4>
                                            <span className="bg-brand-bone text-brand-black px-2 py-0.5 text-[10px] font-bold uppercase">
                                                Verified
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {/* Contact Card */}
                                            <div className="space-y-3 text-xs">
                                                <div className="flex items-center gap-2 text-neutral-400">
                                                    <User size={12} />
                                                    <span className="text-white font-bold uppercase">{activeCommentOrder.customerName || 'Guest Checkout'}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-neutral-400">
                                                    <Mail size={12} />
                                                    <span className="text-white truncate max-w-[150px]">{activeCommentOrder.customerEmail}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-neutral-400">
                                                    <Phone size={12} />
                                                    <span className="text-white">{activeCommentOrder.shippingDetails?.phone || 'N/A'}</span>
                                                </div>
                                            </div>

                                            {/* Shipping Label */}
                                            <div className="relative bg-brand-bone/10 border border-brand-bone/30 p-3 rounded-sm group">
                                                <button
                                                    onClick={handleCopyAddress}
                                                    className="absolute top-2 right-2 text-neutral-400 hover:text-white transition-colors"
                                                    title="Copy Address"
                                                >
                                                    {copiedAddress ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                                                </button>
                                                <p className="text-[10px] text-brand-bone font-bold uppercase mb-2 flex items-center gap-1">
                                                    <MapPin size={10} /> Shipping Address
                                                </p>
                                                <div className="text-xs text-neutral-300 font-mono leading-relaxed">
                                                    {activeCommentOrder.shippingDetails?.address || 'N/A'}<br />
                                                    {activeCommentOrder.shippingDetails?.city || ''}, {activeCommentOrder.shippingDetails?.zip || ''}<br />
                                                    Colombia
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* 2. Product List */}
                                    <div className="p-6">
                                        <h4 className="text-white font-bold uppercase text-xs tracking-widest mb-6 flex items-center gap-2 border-b border-brand-dark pb-2">
                                            <Package size={14} className="text-brand-bone" /> Order Items ({activeCommentOrder.items.length})
                                        </h4>
                                        <div className="space-y-4">
                                            {activeCommentOrder.items.map((item, idx) => (
                                                <div key={idx} className="flex gap-4 bg-brand-dark/10 border border-brand-dark p-4 group hover:border-brand-dark/50 transition-colors">
                                                    <div className="w-16 h-20 bg-brand-dark flex-shrink-0 border border-brand-dark">
                                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h4 className="text-white text-sm font-bold uppercase leading-tight mb-2">{item.name}</h4>
                                                        <div className="flex gap-4">
                                                            <div className="bg-brand-dark px-2 py-1">
                                                                <span className="text-[10px] text-neutral-500 uppercase block">Size</span>
                                                                <span className="text-brand-bone font-bold text-xs uppercase">{item.size}</span>
                                                            </div>
                                                            <div className="bg-brand-dark px-2 py-1">
                                                                <span className="text-[10px] text-neutral-500 uppercase block">Qty</span>
                                                                <span className="text-white font-bold text-xs uppercase">{item.quantity}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* RIGHT: Notes Feed */}
                                <div className="w-full md:w-2/5 p-6 flex flex-col bg-brand-dark/5">
                                    <h4 className="text-white font-bold uppercase text-xs tracking-widest mb-4 flex items-center gap-2">
                                        <MessageSquare size={14} className="text-brand-bone" /> Internal Comms
                                    </h4>

                                    <div className="flex-1 overflow-y-auto space-y-3 mb-4 custom-scrollbar pr-2 min-h-[200px]">
                                        {(activeCommentOrder.internalNotes || []).length === 0 ? (
                                            <div className="h-full flex flex-col items-center justify-center text-center text-neutral-600 border-2 border-dashed border-brand-dark/30 rounded-lg p-6">
                                                <p className="text-xs italic mb-1">No activity recorded.</p>
                                                <p className="text-[10px]">Use this space for production notes or shipping updates.</p>
                                            </div>
                                        ) : (
                                            activeCommentOrder.internalNotes?.map((note) => (
                                                <div key={note.id} className="bg-brand-black border border-brand-dark p-3 shadow-sm relative">
                                                    <p className="text-white text-xs mb-3 leading-relaxed pl-2 border-l-2 border-brand-bone">{note.text}</p>
                                                    <div className="flex justify-between items-center text-[10px] text-neutral-500 uppercase border-t border-brand-dark/50 pt-2">
                                                        <span className="font-bold text-brand-bone">{note.author}</span>
                                                        <span>{note.date}</span>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>

                                    <form onSubmit={handleAddNote} className="mt-auto">
                                        <textarea
                                            value={newNoteText}
                                            onChange={(e) => setNewNoteText(e.target.value)}
                                            placeholder="Type a specification or internal note..."
                                            className="w-full bg-brand-black border border-brand-dark p-3 text-white text-xs focus:outline-none focus:border-brand-bone mb-2 resize-none h-24"
                                        />
                                        <button
                                            type="submit"
                                            disabled={!newNoteText.trim()}
                                            className="w-full bg-brand-bone text-brand-black py-3 font-bold uppercase text-xs hover:bg-white disabled:opacity-50 transition-colors"
                                        >
                                            Add Note
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};
