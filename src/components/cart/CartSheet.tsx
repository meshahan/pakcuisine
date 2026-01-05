import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Plus, Minus, Trash2 } from "lucide-react";
import { DialogTitle } from "@/components/ui/dialog"; // Import DialogTitle for accessibility if SheetTitle renders it
import { useCart } from "@/context/CartContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export function CartSheet() {
    const {
        items,
        removeItem,
        updateQuantity,
        cartTotal,
        itemCount,
        isCartOpen,
        setIsCartOpen
    } = useCart();
    const navigate = useNavigate();

    const handleCheckout = () => {
        setIsCartOpen(false);
        navigate("/checkout");
    };

    return (
        <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
            <SheetContent
                className="w-full sm:w-[400px] flex flex-col h-full"
                aria-describedby={undefined}
            >
                <SheetHeader>
                    <SheetTitle className="font-display text-2xl">Your Order</SheetTitle>
                </SheetHeader>

                <div className="flex-1 overflow-hidden flex flex-col mt-8">
                    {items.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
                            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                                <ShoppingCart className="w-8 h-8 text-muted-foreground" />
                            </div>
                            <h3 className="font-semibold text-lg mb-2">Your cart is empty</h3>
                            <p className="text-muted-foreground text-sm">
                                Looks like you haven't added anything yet.
                                <br />
                                Start browsing our delicious menu!
                            </p>
                            <Button
                                variant="outline"
                                className="mt-6"
                                onClick={() => setIsCartOpen(false)}
                            >
                                Continue Browsing
                            </Button>
                        </div>
                    ) : (
                        <>
                            <ScrollArea className="flex-1 -mr-4 pr-4">
                                <div className="space-y-4">
                                    {items.map((item) => (
                                        <div key={item.id} className="flex gap-4">
                                            {/* Image */}
                                            <div className="h-20 w-20 rounded-lg overflow-hidden shrink-0 border border-border">
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="h-full w-full object-cover"
                                                />
                                            </div>

                                            {/* Info */}
                                            <div className="flex-1 flex flex-col justify-between">
                                                <div>
                                                    <div className="flex justify-between items-start">
                                                        <h4 className="font-medium line-clamp-2 text-sm">{item.name}</h4>
                                                        <button
                                                            onClick={() => removeItem(item.id)}
                                                            className="text-muted-foreground hover:text-destructive transition-colors"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                    <p className="text-primary font-bold text-sm mt-1">
                                                        ${(item.price * item.quantity).toFixed(2)}
                                                    </p>
                                                </div>

                                                {/* Controls */}
                                                <div className="flex items-center gap-3">
                                                    <div className="flex items-center gap-1 bg-muted rounded-md border border-border">
                                                        <button
                                                            onClick={() => updateQuantity(item.id, -1)}
                                                            className="p-1 hover:bg-background rounded-l-md transition-colors w-8 h-8 flex items-center justify-center"
                                                        >
                                                            <Minus className="w-3 h-3" />
                                                        </button>
                                                        <span className="w-8 text-center text-xs font-semibold">{item.quantity}</span>
                                                        <button
                                                            onClick={() => updateQuantity(item.id, 1)}
                                                            className="p-1 hover:bg-background rounded-r-md transition-colors w-8 h-8 flex items-center justify-center"
                                                        >
                                                            <Plus className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>

                            <div className="mt-auto pt-6 space-y-4">
                                <Separator />
                                <div className="space-y-1.5">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Subtotal</span>
                                        <span>${cartTotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Delivery Fee</span>
                                        <span>$0.00</span>
                                    </div>
                                    <div className="flex justify-between font-bold text-lg pt-2">
                                        <span>Total</span>
                                        <span className="text-primary">${cartTotal.toFixed(2)}</span>
                                    </div>
                                </div>

                                <Button
                                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12 text-lg font-semibold shadow-lg shadow-primary/25"
                                    onClick={handleCheckout}
                                >
                                    Checkout (${cartTotal.toFixed(2)})
                                </Button>
                            </div>
                        </>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    );
}
