'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export const CheckoutPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [savedAddress, setSavedAddress] = useState(null);
  const [addressForm, setAddressForm] = useState({
    receiver: '',
    phone: '',
    addressDetail: ''
  });
  const router = useRouter();

  // Mengambil data dari LocalStorage saat halaman dimuat
   useEffect(() => {
    // Menggunakan setTimeout(..., 0) untuk menjalankan state update 
    // sebagai antrean (asynchronous callback) setelah render pertama selesai.
    // Ini akan menghilangkan error linter tersebut.
    const timer = setTimeout(() => {
      const storedCart = localStorage.getItem('checkoutItems');
      if (storedCart) {
        setCartItems(JSON.parse(storedCart));
      }

      const storedAddress = localStorage.getItem('savedAddress');
      if (storedAddress) {
        const parsedAddress = JSON.parse(storedAddress);
        setSavedAddress(parsedAddress);
        setAddressForm(parsedAddress); // Mengisi form dengan data lama agar siap jika di-edit
      }

      setIsLoaded(true);
    }, 0);
    // Bersihkan timer jika komponen di-unmount
    return () => clearTimeout(timer);
  }, []);

  // Fungsi untuk menambah/mengurangi kuantitas item di keranjang
  const updateQuantity = (id, change) => {
    setCartItems(prevItems => 
      prevItems.map(item => {
        if (item.id === id) {
          const newQty = Math.max(1, item.quantity + change); // Mencegah kuantitas di bawah 1
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  };

  // Kalkulasi Harga
  const deliveryChargePerItem = 15000; // Contoh ongkir statis Rp 15.000
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalDeliveryCharge = cartItems.reduce((sum, item) => sum + (deliveryChargePerItem * item.quantity), 0);
  const total = subtotal + totalDeliveryCharge;

  // Format ke Rupiah
  const formatPrice = (price) => {
    return 'Rp ' + price.toLocaleString('id-ID');
  };

  // Simpan kembali ke localStorage jika user mengubah kuantitas di halaman ini
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('checkoutItems', JSON.stringify(cartItems));
    }
  }, [cartItems, isLoaded]);

  // Loading state (mencegah Hydration Error di Next.js)
  if (!isLoaded) return <div className="min-h-screen flex items-center justify-center font-semibold text-gray-500">Loading...</div>;

  const handleContinueToPayment = () => {
    // Mengumpulkan seluruh data keranjang, alamat, dan total untuk dikirim ke Swift
    const checkoutData = {
        items: cartItems,
        address: savedAddress,
        subtotal: subtotal,
        deliveryCharge: totalDeliveryCharge,
        totalAmount: total
    };
    const payload = JSON.stringify({
        action: 'OPEN_PAYMENT_NATIVE',
        data: JSON.stringify(checkoutData) 
    });
    // 1. JS Bridge untuk Native iOS (Swift WKWebView)
    if (typeof window !== 'undefined' && window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.BankInaBridge) {
        window.webkit.messageHandlers.BankInaBridge.postMessage(payload);
    } 
    // 2. Fallback: Intercept Custom URL
    else {
        // Ganti "window.location.href =" dengan "window.location.assign(...)"
        window.location.assign(`bankina://payment?data=${encodeURIComponent(payload)}`);
    }
  };

  return (
    <>
    <div className="max-w-5xl mx-auto py-10 px-4 md:px-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-900">Shopping Cart</h1>

      {!savedAddress ? (
        <button 
          onClick={() => setShowAddressModal(true)} // Aksi untuk membuka modal
          className="w-full py-3 mb-8 rounded-md font-semibold text-center text-base text-red-600 bg-red-50 transition-all duration-300 hover:bg-red-100 cursor-pointer">
          + Add Address
        </button>
      ) : (
        <div className="w-full mb-10 p-4 border border-gray-200 rounded-md bg-white">
          {/* Menampilkan alamat yang sudah disimpan */}
          <h3 className="font-semibold text-gray-900">{savedAddress.receiver}</h3>
          <p className="text-gray-600 text-sm">{savedAddress.phone}</p>
          <p className="text-gray-600 text-sm mt-2">{savedAddress.addressDetail}</p>
          {/* Opsional: Tombol edit untuk mengubah alamat */}
          <button onClick={() => setShowAddressModal(true)} className="text-red-500 text-sm mt-3 font-medium">
            Edit Address
          </button>
        </div>
      )}

      {cartItems.length === 0 ? (
        <div className="text-center text-gray-500 py-20 flex flex-col items-center">
          <p className="text-lg">Keranjang belanja Anda kosong.</p>
          <button 
            onClick={() => router.push('/')}
            className="mt-6 px-6 py-2 bg-red-600 text-white font-semibold rounded-full hover:bg-red-700 transition-colors"
          >
            Kembali Belanja
          </button>
        </div>
      ) : (
        <div className="w-full">
          {/* Table Header (Disembunyikan di Mobile, Muncul di Desktop) */}
          <div className="hidden md:grid grid-cols-12 gap-4 pb-4 border-b border-black text-black text-base mb-4">
            <div className="col-span-5">Product</div>
            <div className="col-span-3 text-center">Delivery Charge</div>
            <div className="col-span-2 text-center">Quantity</div>
            <div className="col-span-2 text-right">Total</div>
          </div>

          {/* List Item Cart */}
          <div className="flex flex-col gap-6">
            {cartItems.map((item) => (
              <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center border-b border-black pb-5">
                
                {/* Kolom Product Info */}
                <div className="col-span-1 md:col-span-5 flex items-center gap-4">
                  <div className="w-24 h-24 relative rounded-lg overflow-hidden bg-gray-100 shrink-0">
                    {item.image && (
                      <Image 
                        src={item.image} 
                        alt={item.title} 
                        fill 
                        className="object-cover" 
                        sizes="96px"
                      />
                    )}
                  </div>
                  <div className="flex flex-col gap-1">
                    <h3 className="font-semibold text-gray-900 text-base">{item.title}</h3>
                    <p className="text-sm text-gray-400">Electronics</p> {/* Hardcode kategori sementara */}
                    <p className="text-red-600 font-semibold text-sm md:hidden mt-1">{formatPrice(item.price)}</p>
                    <p className="text-red-600 font-semibold text-sm hidden md:block mt-1">{formatPrice(item.price)}</p>
                  </div>
                </div>

                {/* Kolom Delivery Charge */}
                <div className="col-span-1 md:col-span-3 flex justify-between md:justify-center items-center">
                  <span className="md:hidden text-gray-400 text-sm font-medium">Delivery:</span>
                  <span className="font-semibold text-gray-800">{formatPrice(deliveryChargePerItem)}</span>
                </div>

                {/* Kolom Quantity (+ / -) */}
                <div className="col-span-1 md:col-span-2 flex justify-between md:justify-center items-center">
                   <span className="md:hidden text-gray-400 text-sm font-medium">Qty:</span>
                   <div className="flex items-center border border-black rounded-md overflow-hidden bg-white">
                      <button 
                        onClick={() => updateQuantity(item.id, -1)}
                        className="px-3 py-1.5 hover:bg-gray-50 text-gray-400 hover:text-gray-800 transition-colors"
                      >
                        —
                      </button>
                      <span className="px-4 py-1 border-x border-black text-sm font-bold w-12 text-center text-gray-800">
                        {item.quantity}
                      </span>
                      <button 
                        onClick={() => updateQuantity(item.id, 1)}
                        className="px-3 py-1.5 hover:bg-gray-50 text-gray-400 hover:text-gray-800 transition-colors"
                      >
                        +
                      </button>
                   </div>
                </div>

                {/* Kolom Total Per Item */}
                <div className="col-span-1 md:col-span-2 flex justify-between md:justify-end items-center">
                   <span className="md:hidden text-gray-400 text-sm font-medium">Total:</span>
                   <span className="font-bold text-red-600 text-lg">{formatPrice(item.price * item.quantity)}</span>
                </div>

              </div>
            ))}
          </div>

          {/* Bagian Summary (Subtotal & Total) */}
          <div className="mt-8 bg-gray-50 rounded-lg p-6 md:p-8 flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400 font-medium">Subtotal</span>
              <span className="font-bold text-gray-800">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400 font-medium">Delivery Charge</span>
              <span className="font-bold text-gray-800">{formatPrice(totalDeliveryCharge)}</span>
            </div>
            <hr className="border-black my-2" />
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-gray-900">Total</span>
              <span className="text-2xl font-bold text-red-600">{formatPrice(total)}</span>
            </div>
          </div>

          {/* Bagian Tombol Aksi */}
          <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
            <button className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-red-50 text-red-600 font-semibold hover:bg-red-100 transition-colors flex items-center justify-center gap-2 cursor-pointer">
              Add Coupon Code 
              <span className="text-xl leading-none">›</span>
            </button>
            <button 
            onClick={handleContinueToPayment}
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-red-600 text-white font-semibold hover:bg-red-700 transition-all flex items-center justify-center gap-2 cursor-pointer">
              Continue to Payment
              <span className="text-xl leading-none">›</span>
            </button>
          </div>
          
        </div>
      )}
    </div>
    {showAddressModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className="bg-white rounded-xl p-6 w-full max-w-md flex flex-col gap-4">
          <h2 className="text-xl font-bold text-gray-900">Add Shipping Address</h2>
          
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Receiver Name</label>
            <input 
              type="text" 
              placeholder="e.g. John Doe" 
              value={addressForm.receiver}
              onChange={(e) => setAddressForm({ ...addressForm, receiver: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
            />
          </div>
          
          {/* Input Phone */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Phone Number</label>
            <input 
              type="text" 
              placeholder="e.g. 081234567890" 
              value={addressForm.phone}
              onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
            />
          </div>
          
          {/* Input Address Detail */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Full Address</label>
            <textarea 
              placeholder="Street name, building, house number..." 
              rows="3"
              value={addressForm.addressDetail}
              onChange={(e) => setAddressForm({ ...addressForm, addressDetail: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 resize-none"
            />
          </div>

          {/* Tombol Aksi */}
          <div className="flex justify-end gap-3 mt-4">
            <button onClick={() => setShowAddressModal(false)}>Cancel</button>
            <button 
              onClick={() => {
                setSavedAddress(addressForm); // Simpan data!
                localStorage.setItem('savedAddress', JSON.stringify(addressForm));
                setShowAddressModal(false);   // Tutup Modal!
              }}
              disabled={!addressForm.receiver || !addressForm.phone || !addressForm.addressDetail}
              className="px-6 py-2 bg-red-600 text-white rounded-md font-semibold hover:bg-red-700">
              Save
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  )
}