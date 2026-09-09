'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export const CheckoutPage = () => {
  // State Keranjang
  const [cartItems, setCartItems] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const router = useRouter();

  // State untuk Fitur Alamat
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [savedAddress, setSavedAddress] = useState(null);
  const [addressForm, setAddressForm] = useState({
    receiver: '',
    phone: '',
    addressDetail: ''
  });

  // State Baru: Metode Pembayaran & Kode Promo
  const [paymentMethod, setPaymentMethod] = useState('tabungan'); // default terpilih
  const [promoCode, setPromoCode] = useState('');

  // Load Data
  useEffect(() => {
    const timer = setTimeout(() => {
      const storedCart = localStorage.getItem('checkoutItems');
      if (storedCart) {
        setCartItems(JSON.parse(storedCart));
      }
      
      const storedAddress = localStorage.getItem('savedAddress');
      if (storedAddress) {
        const parsedAddress = JSON.parse(storedAddress);
        setSavedAddress(parsedAddress);
        setAddressForm(parsedAddress);
      }
      setIsLoaded(true);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  const updateQuantity = (id, change) => {
    setCartItems(prevItems => 
      prevItems.map(item => {
        if (item.id === id) {
          const newQty = Math.max(1, item.quantity + change);
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  };

  const deliveryChargePerItem = 15000;
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalDeliveryCharge = cartItems.reduce((sum, item) => sum + (deliveryChargePerItem * item.quantity), 0);
  const total = subtotal + totalDeliveryCharge;

  const formatPrice = (price) => {
    return 'Rp ' + price.toLocaleString('id-ID');
  };

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('checkoutItems', JSON.stringify(cartItems));
    }
  }, [cartItems, isLoaded]);

  // FUNGSI JEMBATAN KE NATIVE MOBILE (SWIFT)
  const handlePay = () => {
    const payload = JSON.stringify({
        action: 'OPEN_PAYMENT_NATIVE',
        totalAmount: total,
        paymentMethod: paymentMethod, // tabungan atau loan
        promoCode: promoCode
    });

    // 1. JS Bridge untuk Native iOS (Swift WKWebView)
    if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.BankInaBridge) {
        window.webkit.messageHandlers.BankInaBridge.postMessage(payload);
    } 
    // 2. JS Bridge alternatif / Fallback Intercept Custom URL
    else {
        window.location.href = `bankina://payment?data=${encodeURIComponent(payload)}`;
    }
  };

  if (!isLoaded) return <div className="min-h-screen flex items-center justify-center font-semibold text-gray-500">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 md:px-8 relative">
      <h1 className="text-3xl font-bold text-center mb-10 text-gray-900">Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="text-center text-gray-500 py-20 flex flex-col items-center">
          <p className="text-lg">Keranjang belanja Anda kosong.</p>
          <button 
            onClick={() => router.push('/')}
            className="mt-6 px-6 py-2 bg-red-600 text-white font-semibold rounded-full hover:bg-red-700 transition-colors shadow-md"
          >
            Kembali Belanja
          </button>
        </div>
      ) : (
        <div className="w-full">
          
          {/* --- SECTION ALAMAT --- */}
          {!savedAddress ? (
            <button 
              onClick={() => setShowAddressModal(true)}
              className="w-full py-3 mb-10 rounded-md font-semibold text-center text-base text-red-600 bg-red-50 transition-all duration-300 hover:bg-red-100 cursor-pointer border border-dashed border-red-200"
            >
              + Add Address
            </button>
          ) : (
            <div className="w-full mb-10 p-5 border border-gray-200 rounded-lg bg-white shadow-sm flex flex-col items-start gap-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded">SHIPPING ADDRESS</span>
              </div>
              <h3 className="font-semibold text-gray-900 text-lg">{savedAddress.receiver}</h3>
              <p className="text-gray-600 text-sm font-medium">{savedAddress.phone}</p>
              <p className="text-gray-600 text-sm mt-1">{savedAddress.addressDetail}</p>
              <button 
                onClick={() => setShowAddressModal(true)} 
                className="text-red-600 hover:text-red-700 text-sm font-semibold mt-3 underline underline-offset-2"
              >
                Change Address
              </button>
            </div>
          )}
          {/* ----------------------- */}

          {/* Table Header Cart */}
          <div className="hidden md:grid grid-cols-12 gap-4 pb-4 border-b border-gray-100 text-gray-400 text-sm mb-4 mt-2">
            <div className="col-span-5">Product</div>
            <div className="col-span-3 text-center">Delivery Charge</div>
            <div className="col-span-2 text-center">Quantity</div>
            <div className="col-span-2 text-right">Total</div>
          </div>

          {/* List Item Cart */}
          <div className="flex flex-col gap-6">
            {cartItems.map((item) => (
              <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center border-b border-gray-50 pb-6">
                <div className="col-span-1 md:col-span-5 flex items-center gap-4">
                  <div className="w-24 h-24 relative rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                    {item.image && (
                      <Image src={item.image} alt={item.title} fill className="object-cover" sizes="96px" />
                    )}
                  </div>
                  <div className="flex flex-col gap-1">
                    <h3 className="font-semibold text-gray-900 text-base">{item.title}</h3>
                    <p className="text-sm text-gray-400">Electronics</p>
                    <p className="text-red-600 font-semibold text-sm md:hidden mt-1">{formatPrice(item.price)}</p>
                    <p className="text-red-600 font-semibold text-sm hidden md:block mt-1">{formatPrice(item.price)}</p>
                  </div>
                </div>

                <div className="col-span-1 md:col-span-3 flex justify-between md:justify-center items-center">
                  <span className="md:hidden text-gray-400 text-sm font-medium">Delivery:</span>
                  <span className="font-semibold text-gray-800">{formatPrice(deliveryChargePerItem)}</span>
                </div>

                <div className="col-span-1 md:col-span-2 flex justify-between md:justify-center items-center">
                   <span className="md:hidden text-gray-400 text-sm font-medium">Qty:</span>
                   <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white">
                      <button onClick={() => updateQuantity(item.id, -1)} className="px-3 py-1.5 hover:bg-gray-50 text-gray-400 hover:text-gray-800 transition-colors">—</button>
                      <span className="px-4 py-1 border-x border-gray-200 text-sm font-bold w-12 text-center text-gray-800">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)} className="px-3 py-1.5 hover:bg-gray-50 text-gray-400 hover:text-gray-800 transition-colors">+</button>
                   </div>
                </div>

                <div className="col-span-1 md:col-span-2 flex justify-between md:justify-end items-center">
                   <span className="md:hidden text-gray-400 text-sm font-medium">Total:</span>
                   <span className="font-bold text-red-600 text-lg">{formatPrice(item.price * item.quantity)}</span>
                </div>
              </div>
            ))}
          </div>

          {/* --- SECTION PAYMENT METHOD & PROMO CODE BARU --- */}
          <div className="mt-10 flex flex-col gap-6">
            
            {/* Payment Method */}
            <div className="flex flex-col gap-3">
              <h3 className="text-lg font-bold text-gray-900 ml-1">Payment Method</h3>
              
              {/* Tabungan Bina */}
              <div 
                onClick={() => setPaymentMethod('tabungan')}
                className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${paymentMethod === 'tabungan' ? 'border-red-600 bg-white shadow-sm' : 'border-transparent bg-gray-50 hover:bg-gray-100'}`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-600">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="10" width="18" height="10" rx="2" ry="2"></rect><path d="M12 22V10"></path><path d="M7 22V10"></path><path d="M17 22V10"></path><path d="M2 10h20"></path><path d="M12 2L2 7h20L12 2z"></path></svg>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-gray-900 text-base">Tabungan Bina</span>
                    <span className="text-sm text-gray-400">Saldo: Rp 500.000.000</span>
                  </div>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${paymentMethod === 'tabungan' ? 'border-red-600' : 'border-gray-300'}`}>
                  {paymentMethod === 'tabungan' && <div className="w-3 h-3 rounded-full bg-red-600" />}
                </div>
              </div>

              {/* Loan (Pinjaman) */}
              <div 
                onClick={() => setPaymentMethod('loan')}
                className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${paymentMethod === 'loan' ? 'border-red-600 bg-white shadow-sm' : 'border-transparent bg-gray-50 hover:bg-gray-100'}`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-600">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"></rect><circle cx="12" cy="12" r="2"></circle><path d="M6 12h.01M18 12h.01"></path></svg>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-gray-900 text-base">Loan (Pinjaman)</span>
                    <span className="text-sm text-gray-400">Limit: Rp 50.000.000</span>
                  </div>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${paymentMethod === 'loan' ? 'border-red-600' : 'border-gray-300'}`}>
                  {paymentMethod === 'loan' && <div className="w-3 h-3 rounded-full bg-red-600" />}
                </div>
              </div>
            </div>

            {/* Promo Code Input Box */}
            <div className="w-full bg-red-50 p-2 rounded-2xl border border-red-100 flex items-center mt-2">
              <div className="pl-3 pr-2 text-red-500">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"></path><path d="M13 5v2"></path><path d="M13 17v2"></path><path d="M13 11v2"></path></svg>
              </div>
              <input 
                type="text" 
                placeholder="Promo Code" 
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="flex-1 bg-transparent border-none focus:outline-none text-red-600 placeholder-red-400 font-semibold text-base px-2 w-full"
              />
              <button className="px-6 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors shadow-sm">
                Apply
              </button>
            </div>
            
          </div>
          {/* ------------------------------------------------ */}

          {/* Bagian Summary */}
          <div className="mt-8 bg-gray-50 rounded-2xl p-6 md:p-8 flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400 font-medium">Transfer Amount</span>
              <span className="font-bold text-gray-900">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400 font-medium">Additional Cost</span>
              <span className="font-bold text-gray-900">{formatPrice(totalDeliveryCharge)}</span>
            </div>
            <hr className="border-gray-200 border-dashed my-2" />
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-gray-900">Total</span>
              <span className="text-2xl font-bold text-gray-900">{formatPrice(total)}</span>
            </div>
          </div>

          {/* Tombol Pay Utama */}
          <div className="mt-8 flex justify-center">
            <button 
              onClick={handlePay}
              className="w-full md:w-1/2 px-8 py-4 rounded-2xl bg-red-600 text-white text-lg font-bold hover:bg-red-700 shadow-lg shadow-red-200 transition-all flex items-center justify-center"
            >
              Pay
            </button>
          </div>
          
        </div>
      )}

      {/* --- POP-UP MODAL ALAMAT TETAP ADA --- */}
      {showAddressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md flex flex-col gap-5 shadow-2xl">
            <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-3">Add Shipping Address</h2>
            
            {/* Input Receiver */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-700">Receiver Name</label>
              <input 
                type="text" placeholder="e.g. John Doe" value={addressForm.receiver}
                onChange={(e) => setAddressForm({ ...addressForm, receiver: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
              />
            </div>
            
            {/* Input Phone */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-700">Phone Number</label>
              <input 
                type="text" placeholder="e.g. 081234567890" value={addressForm.phone}
                onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
              />
            </div>
            
            {/* Input Address Detail */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-700">Full Address</label>
              <textarea 
                placeholder="Street name, building, house number..." rows="3" value={addressForm.addressDetail}
                onChange={(e) => setAddressForm({ ...addressForm, addressDetail: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 resize-none"
              />
            </div>

            <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-100">
              <button onClick={() => setShowAddressModal(false)} className="px-6 py-2.5 text-gray-600 font-semibold hover:bg-gray-50 rounded-lg">Cancel</button>
              <button 
                onClick={() => {
                  setSavedAddress(addressForm);
                  localStorage.setItem('savedAddress', JSON.stringify(addressForm));
                  setShowAddressModal(false);
                }}
                disabled={!addressForm.receiver || !addressForm.phone || !addressForm.addressDetail}
                className="px-6 py-2.5 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50"
              >
                Save Address
              </button>
            </div>
          </div>
        </div>
      )}
      {/* --------------------------- */}

    </div>
  )
}