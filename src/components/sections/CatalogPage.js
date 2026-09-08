'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CatalogCard } from "../cards/CatalogCard";

export default function CatalogPage() {
    const dmyCatalog = [
        {id: 0, title: "Earbuds Wireless X", price: 199000, rating: 4.8, image:"/dummy_earbuds.jpg", sold: 100},
        {id: 1, title: "Gaming Mouse Razor", price: 599000, rating: 4.7, image:"/dummy_gaming_mouse.jpg", sold: 50},
        {id: 2, title: "Mechanical Keyboard", price: 899000, rating: 4.9, image:"/dummy_keyboard.jpeg", sold: 25},
        {id: 3, title: "iPhone 13 Pro", price: 7500000, rating: 4.9, image:"/dummy_iphone.jpg", sold: 10},
        {id: 4, title: "Notebook Pro Laptop", price: 8000000, rating: 4.8, image:"/dummy_laptop.jpg", sold: 15},
        {id: 5, title: "Smart Watch Series 5", price: 1990000, rating: 4.7, image:"/dummy_smartwatch.jpg", sold: 30},
        {id: 6, title: "Mechanical Keyboard", price: 899000, rating: 4.9, image:"/dummy_keyboard.jpeg", sold: 25},
        {id: 7, title: "Earbuds Wireless X", price: 199000, rating: 4.8, image:"/dummy_earbuds.jpg", sold: 100},
        {id: 8, title: "iPhone 13 Pro", price: 7500000, rating: 4.9, image:"/dummy_iphone.jpg", sold: 10},
        {id: 9, title: "Gaming Mouse Razor", price: 599000, rating: 4.7, image:"/dummy_gaming_mouse.jpg", sold: 50},
        {id: 10, title: "Smart Watch Series 5", price: 1990000, rating: 4.7, image:"/dummy_smartwatch.jpg", sold: 30},
        {id: 11, title: "Notebook Pro Laptop", price: 8000000, rating: 4.8, image:"/dummy_laptop.jpg", sold: 15},
    ]

    // State to store item quantities { itemId: quantity }
    const [cart, setCart] = useState({});
    const router = useRouter();

    const handleCheckout = () => {
        // 1. Gabungkan data kuantitas dengan detail produk dari dmyCatalog
        const checkoutItems = Object.entries(cart)
            .filter(([id, qty]) => qty > 0) // Pastikan hanya membawa yang kuantitasnya > 0
            .map(([id, qty]) => {
                const item = dmyCatalog.find(i => i.id === parseInt(id));
                return { ...item, quantity: qty };
            });
        // 2. Simpan ke LocalStorage
        localStorage.setItem('checkoutItems', JSON.stringify(checkoutItems));
        
        // 3. Pindah Halaman
        router.push('/checkout');
    };

    // Update quantity for a specific item
    const handleUpdateCart = (id, newQuantity) => {
        setCart(prev => ({
            ...prev,
            [id]: newQuantity
        }));
    };

    // Calculate total items and total price dynamically
    const totalItems = Object.values(cart).reduce((sum, qty) => sum + qty, 0);
    const totalPrice = Object.entries(cart).reduce((sum, [id, qty]) => {
        const item = dmyCatalog.find(i => i.id === parseInt(id));
        return sum + (item ? item.price * qty : 0);
    }, 0);

    return (
      // Added pb-32 (padding-bottom) so the grid doesn't hide behind the floating nav
      <div className="w-full flex flex-col items-center justify-between relative pb-16">
        <div className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {dmyCatalog?.map((item) => (
            <CatalogCard 
              key={item.id} 
              items={item} 
              quantity={cart[item.id] || 0}
              onIncrease={() => handleUpdateCart(item.id, (cart[item.id] || 0) + 1)}
              onDecrease={() => handleUpdateCart(item.id, Math.max(0, (cart[item.id] || 0) - 1))}
            />
          ))}
        </div>

        {/* Floating Cart Navigation Bar */}
        {/* totalItems > 0 &&  */ (
            <div className={`fixed bottom-5 w-[80%] py-2.5 px-6 flex flex-row items-center justify-between rounded-2xl shadow-2xl z-50 backdrop-blur-md transition-all duration-500
                ${totalItems > 0 ? 'bg-red-500' : 'bg-red-200 '}`}>
                <div className="flex flex-col">
                    <p className="text-white/90 font-medium text-xs md:text-sm">Total Belanja</p>
                    <p className="text-white font-bold text-base md:text-xl">
                        Rp {totalPrice.toLocaleString('id-ID')}
                    </p>
                </div>
                
                <div className="flex items-center gap-3">
                    <div className="hidden md:flex flex-col items-end mr-2">
                        <span className={`text-white font-bold text-sm px-3 py-1 rounded-full transition-all duration-500 ${totalItems > 0 ? 'bg-red-700' : 'bg-red-300'}`}>
                            {totalItems} Item
                        </span>
                    </div>
                    <button onClick={() => {totalItems > 0 && handleCheckout()}}
                        className="bg-white text-red-500 font-bold px-5 py-2 rounded-full shadow-md transition-all duration-500 cursor-pointer hover:text-red-800 text-sm md:text-base">
                        Checkout
                    </button>
                </div>
            </div>
        )}
      </div>
    );
}