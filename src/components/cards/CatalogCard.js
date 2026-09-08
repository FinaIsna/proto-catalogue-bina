'use client'

import Image from 'next/image'
import React from 'react'

export const CatalogCard = ({ items, quantity, onIncrease, onDecrease }) => {
  
  // Handlers to prevent card click events from firing when hitting + or -
  const handleIncrease = (e) => {
    e.stopPropagation()
    onIncrease()
  }

  const handleDecrease = (e) => {
    e.stopPropagation()
    onDecrease()
  }

  return (
    <div className="flex flex-col gap-2.5 w-full bg-gray-50 rounded-lg transition-shadow duration-300 hover:shadow-xl cursor-pointer">
        <div className="w-full aspect-square relative">
            <Image 
                src={items.image} 
                alt={items.title} 
                fill
                className="w-full h-full object-cover rounded-t-lg" 
            />
        </div>

        <div className="flex flex-col gap-0.5 px-2.5 pb-3">
            <p className="text-base font-medium text-black line-clamp-2">
                {items.title}
            </p>
            <p className="text-base font-bold text-red-500">
                Rp {items.price.toLocaleString('id-ID')}
            </p>
            
            <div className="flex flex-row items-center justify-between gap-1.5 mt-1">
                <div className="flex flex-row py-0.5 px-1 bg-yellow-100 border border-yellow-500 rounded-sm">
                    <span className="text-xs font-bold text-yellow-500">★</span>
                    <span className="text-xs font-bold text-yellow-800 ml-0.5">
                        {items.rating}
                    </span>
                </div>
                <p className="text-xs font-normal text-gray-500">
                    {items.sold} terjual
                </p>
            </div>

            {/* QUANTITY COMPONENT (Now controlled by Parent Props) */}
            <div className="mt-3 w-full">
                {quantity === 0 ? (
                    <button 
                        onClick={handleIncrease}
                        className="w-full py-1.5 text-sm font-semibold text-red-500 border border-red-500 rounded-md hover:bg-red-50 transition-colors"
                    >
                        + Keranjang
                    </button>
                ) : (
                    <div className="flex items-center justify-between w-full border border-gray-300 rounded-md overflow-hidden h-8">
                        <button 
                            onClick={handleDecrease}
                            className="w-8 h-full flex items-center justify-center bg-white text-red-500 hover:bg-red-50 transition-colors font-bold text-lg"
                        >
                            -
                        </button>
                        <span className="flex-1 text-center text-sm font-semibold text-black border-x border-gray-300 bg-gray-50 h-full flex items-center justify-center">
                            {quantity}
                        </span>
                        <button 
                            onClick={handleIncrease}
                            className="w-8 h-full flex items-center justify-center bg-white text-red-500 hover:bg-red-50 transition-colors font-bold text-lg"
                        >
                            +
                        </button>
                    </div>
                )}
            </div>
            
        </div>
    </div>
  )
}