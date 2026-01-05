import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { cn } from "@/lib/utils";

interface CartButtonProps {
    className?: string;
}

export function CartButton({ className }: CartButtonProps) {
    const { itemCount, openCart } = useCart();

    return (
        <Button
            variant="ghost"
            size="icon"
            className={cn("relative hover:bg-transparent", className)}
            onClick={openCart}
        >
            <ShoppingCart className="h-6 w-6" />
            {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground animate-in zoom-in">
                    {itemCount}
                </span>
            )}
        </Button>
    );
}
