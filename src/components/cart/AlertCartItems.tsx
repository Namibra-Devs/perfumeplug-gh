import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { motion } from "framer-motion"
import { Minus, Plus, Trash2, XCircle } from "lucide-react";

type AlertCartItemsProps = {
    onClose: () => void;
}

export const AlertCartItems = ({onClose}: AlertCartItemsProps) => {
    const { items, updateQuantity, removeFromCart, getTotalItems, getTotalPrice, clearCart } = useCart();

    return(
        <div className="fixed w-full z-50 bottom-0 flex flex-col items-center justify-center">
            <div className="w-full">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-black/20 backdrop-blur-lg border border-yellow-600/20 rounded-t-2xl shadow-sm"
                >
                    {/* Cart Header */}
                    <div className="border-b border-yellow-600/20 p-3">
                        <div className="flex justify-between items-center">
                        <h2 className="text-lg font-semibold text-yellow-400">Cart Items <span className="ml-2 text-sm px-3 bg-blue-500/30 border border-blue-400 rounded-full">{getTotalItems()}</span></h2>
                            <div className="flex items-center gap-2">
                                <button
                                title='Clear cart'
                                onClick={clearCart}
                                className="text-red-500 hover:text-red-700 text-sm font-medium"
                            >
                                Clear Cart
                                </button>
                                <button onClick={() => onClose()} title="Close"><XCircle size={16} className="text-white"/></button>
                            </div>
                        </div>
                    </div>

                    {/* Cart Items List */}
                    <div className="divide-y divide-yellow-600/20 border-b border-yellow-600/20">
                        {items.map((item, index) => (
                        <motion.div
                            key={`${item.product.id}-${index}`}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="p-3"
                        >
                            <div className="flex space-x-4">
                            {/* Product Image */}
                            <div className="flex-shrink-0">
                                <img
                                src={item.product.images[0]}
                                alt={item.product.name}
                                className="w-10 h-10 object-cover rounded-lg"
                                />
                            </div>

                            {/* Product Details */}
                            <div className="flex-1 min-w-0">
                                <Link
                                to={`/product/${item.product.id}`}
                                className="text-sm font-semibold text-gray-300 hover:text-blue-600 transition-colors"
                                >
                                {item.product.name.length > 10
                                ? `${item.product.name.substring(0, 10)}...`
                                : item.product.name}
                                </Link>
                                <div className="flex items-start gap-2">
                                    <p className="text-xs text-gray-300">{item.product.brand}</p>
                                    <span className="text-xs font-semibold text-yellow-400">
                                        ₵{(item.product.price * item.quantity).toFixed(2)}
                                    </span>
                                </div>
                            </div>

                            {/* Quantity Controls and Remove */}
                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-2">
                                    <button
                                        title="Reduce"
                                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                        disabled={item.quantity <= 1}
                                        className="w-7 h-7 bg-black/20 backdrop-blur-lg border border-yellow-600/20 text-yellow-400 rounded-lg flex items-center justify-center hover:bg-yellow-700/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                        <Minus className="h-3 w-3" />
                                    </button>
                                    <span className="p-2 text-center font-semibold text-yellow-400">{item.quantity}</span>
                                    <button
                                        title="Increase"
                                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                        className="w-7 h-7 bg-black/20 backdrop-blur-lg border border-yellow-600/20 text-yellow-400 rounded-lg flex items-center justify-center hover:bg-yellow-700/20"
                                        >
                                        <Plus className="h-3 w-3" />
                                    </button>
                                </div>

                                <button
                                    onClick={() => removeFromCart(item.product.id)}
                                    className="w-7 h-7 flex items-center justify-center bg-black/20 backdrop-blur-lg border border-yellow-400/20 text-red-600 hover:text-red-700 rounded-lg transition-colors"
                                    title="Remove item"
                                    >
                                    <Trash2 className="h-3 w-3" />
                                </button>
                            </div>
                            </div>
                        </motion.div>
                        ))}
                    </div>
                    <div className="flex items-center justify-center gap-5 text-sm py-4 ">
                        <div className="flex items-center text-white gap-2">
                            Total Price:<span className="text-yellow-400 font-bold">₵{getTotalPrice()}</span>
                        </div>
                        <Link to="/cart" className="text-blue-500 hover:text-blue-400 underline">Show All Items</Link>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}