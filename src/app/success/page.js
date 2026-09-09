'use client'

import React from 'react'
import { useRouter } from 'next/navigation'

export default function SuccessPage() {
    const router = useRouter();
    const handleBackToNativeHome = () => {
    const payload = JSON.stringify({
        action: 'BACK_TO_HOME'
    });
    // 1. JS Bridge untuk iOS WKWebView
    if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.BankInaBridge) {
        window.webkit.messageHandlers.BankInaBridge.postMessage(payload);
    } 
    // 2. Fallback: URL Intercept
    else {
        window.location.href = `bankina://home`;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      {/* Card Container */}
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm h-[550px] relative overflow-hidden flex flex-col">
        
        {/* Background Confetti Pattern */}
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
          <span className="absolute top-[10%] left-[10%] text-green-500 font-bold text-xl opacity-60">x</span>
          <span className="absolute top-[15%] right-[20%] text-gray-400 font-bold text-lg opacity-50">o</span>
          <span className="absolute top-[30%] left-[25%] text-green-500 font-bold text-xl opacity-40">△</span>
          <span className="absolute top-[40%] right-[10%] text-green-500 font-bold text-2xl opacity-60">x</span>
          <span className="absolute bottom-[35%] left-[15%] text-gray-400 font-bold text-lg opacity-50">x</span>
          <span className="absolute bottom-[25%] right-[25%] text-green-500 font-bold text-xl opacity-60">o</span>
          <span className="absolute bottom-[10%] right-[15%] text-gray-400 font-bold text-xl opacity-40">△</span>
          <span className="absolute bottom-[45%] left-[5%] text-green-500 font-bold text-xl opacity-50">o</span>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col items-center justify-center p-8 z-10 mt-10">
          <h1 className="text-2xl font-bold text-gray-800 mb-14">Congratulations!</h1>
          
          {/* Ikon Sukses dengan Efek Halo */}
          <div className="relative flex items-center justify-center mb-16">
            <div className="absolute w-36 h-36 bg-green-50 rounded-full"></div>
            <div className="absolute w-28 h-28 bg-green-100 rounded-full"></div>
            <div className="relative w-20 h-20 bg-[#2ecc71] rounded-full flex items-center justify-center shadow-lg shadow-green-200">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
          </div>

          <p className="text-center text-gray-400 text-sm px-4">
            Payment has been successfully processed.<br/>Thank you for your purchase!
          </p>
        </div>

        {/* Action Button */}
        <div className="p-5 z-10 w-full">
          <button 
            onClick={handleBackToNativeHome}
            className="w-full bg-[#2ecc71] text-white font-bold text-sm tracking-wide py-4 rounded-xl hover:bg-green-500 transition-colors shadow-lg shadow-green-100"
          >
            BACK TO HOME
          </button>
        </div>
        
      </div>
    </div>
  )
}