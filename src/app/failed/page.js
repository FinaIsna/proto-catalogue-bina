'use client'

import React from 'react'
import { useRouter } from 'next/navigation'

export default function FailedPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      {/* Card Container */}
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm h-137.5 relative overflow-hidden flex flex-col">
        
        {/* Background Confetti Pattern */}
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
          <span className="absolute top-[10%] left-[10%] text-red-500 font-bold text-xl opacity-60">x</span>
          <span className="absolute top-[15%] right-[20%] text-gray-400 font-bold text-lg opacity-50">o</span>
          <span className="absolute top-[30%] left-[25%] text-red-500 font-bold text-xl opacity-40">△</span>
          <span className="absolute top-[40%] right-[10%] text-red-500 font-bold text-2xl opacity-60">x</span>
          <span className="absolute bottom-[35%] left-[15%] text-gray-400 font-bold text-lg opacity-50">x</span>
          <span className="absolute bottom-[25%] right-[25%] text-red-500 font-bold text-xl opacity-60">o</span>
          <span className="absolute bottom-[10%] right-[15%] text-gray-400 font-bold text-xl opacity-40">△</span>
          <span className="absolute bottom-[45%] left-[5%] text-red-500 font-bold text-xl opacity-50">o</span>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col items-center justify-center p-8 z-10 mt-10">
          <h1 className="text-2xl font-bold text-gray-800 mb-14">Payment Failed</h1>
          
          {/* Ikon Gagal dengan Efek Halo */}
          <div className="relative flex items-center justify-center mb-16">
            <div className="absolute w-36 h-36 bg-red-50 rounded-full"></div>
            <div className="absolute w-28 h-28 bg-red-100 rounded-full"></div>
            <div className="relative w-20 h-20 bg-[#ff4757] rounded-full flex items-center justify-center shadow-lg shadow-red-200">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </div>
          </div>

          <p className="text-center text-gray-400 text-sm px-4">
            Payment failed to process.<br/>The next time you must be lucky.
          </p>
        </div>

        {/* Action Button */}
        <div className="p-5 z-10 w-full">
          <button 
            onClick={() => router.push('/checkout')}
            className="w-full bg-[#ff4757] text-white font-bold text-sm tracking-wide py-4 rounded-xl hover:bg-red-500 transition-colors shadow-lg shadow-red-100"
          >
            TRY AGAIN
          </button>
        </div>
        
      </div>
    </div>
  )
}