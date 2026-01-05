import React, { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export interface CartItem {
    id: string; // Database UUID
    name: string;
    price: number;
    image: string;
    quantity: number;
}

interface CartContextType {
    items: CartItem[];
    addItem: (item: Omit<CartItem, "quantity">) => void;
    removeItem: (id: string) => void;
    updateQuantity: (id: string, delta: number) => void;
    clearCart: () => void;
    cartTotal: number;
    itemCount: number;
    isCartOpen: boolean;
    setIsCartOpen: (open: boolean) => void;
    openCart: () => void;
    closeCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const { toast } = useToast();

    // Load from LocalStorage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem("cart");
        if (savedCart) {
            try {
                setItems(JSON.parse(savedCart));
            } catch (e) {
                console.error("Failed to parse cart", e);
            }
        }
    }, []);

    // Save to LocalStorage on change
    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(items));
    }, [items]);

    const addItem = (newItem: Omit<CartItem, "quantity">) => {
        setItems((prev) => {
            const existing = prev.find((i) => i.id === newItem.id);
            if (existing) {
                toast({
                    title: "Added to cart",
                    description: `Increased quantity of ${newItem.name}`,
                });
                return prev.map((i) =>
                    i.id === newItem.id ? { ...i, quantity: i.quantity + 1 } : i
                );
            }
            toast({
                title: "Added to cart",
                description: `${newItem.name} added to your cart`,
            });
            return [...prev, { ...newItem, quantity: 1 }];
        });
    };

    const removeItem = (id: string) => {
        setItems((prev) => prev.filter((i) => i.id !== id));
    };

    const updateQuantity = (id: string, delta: number) => {
        setItems((prev) =>
            prev.map((i) => {
                if (i.id === id) {
                    const newQty = Math.max(0, i.quantity + delta);
                    return { ...i, quantity: newQty };
                }
                return i;
            }).filter((i) => i.quantity > 0)
        );
    };

    const clearCart = () => {
        setItems([]);
    };

    const cartTotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
    const itemCount = items.reduce((count, item) => count + item.quantity, 0);

    const openCart = () => setIsCartOpen(true);
    const closeCart = () => setIsCartOpen(false);

    return (
        <CartContext.Provider
            value={{
                items,
                addItem,
                removeItem,
                updateQuantity,
                clearCart,
                cartTotal,
                itemCount,
                isCartOpen,
                setIsCartOpen,
                openCart,
                closeCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
};
