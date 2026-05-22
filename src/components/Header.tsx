import React, { useState } from "react";
import { Search, ShoppingBag, Heart, X, Sparkles, Sliders, Trash2, ArrowRight } from "lucide-react";
import { CartItem, Product } from "../types";

interface HeaderProps {
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  wishlist: Product[];
  setWishlist: React.Dispatch<React.SetStateAction<Product[]>>;
  onOpenStylist: () => void;
  onOpenCMS: () => void;
  products: Product[];
  onSelectProduct: (product: Product) => void;
  accentColor: string;
}

export default function Header({
  cart,
  setCart,
  wishlist,
  setWishlist,
  onOpenStylist,
  onOpenCMS,
  products,
  onSelectProduct,
  accentColor,
}: HeaderProps) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const cartTotal = cart.reduce((sum, item) => {
    const currentPrice = item.product.salePrice ?? item.product.price;
    return sum + currentPrice * item.quantity;
  }, 0);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const updateQuantity = (index: number, delta: number) => {
    const newCart = [...cart];
    newCart[index].quantity += delta;
    if (newCart[index].quantity <= 0) {
      newCart.splice(index, 1);
    }
    setCart(newCart);
  };

  const removeFromCart = (index: number) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Top Banner Alert */}
      <div className="w-full bg-[#0A0A0A] text-[10px] sm:text-xs font-mono py-2 px-4 border-b border-[#222] tracking-wider text-center text-gray-400 select-none flex items-center justify-center gap-2">
        <span className="inline-block w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: accentColor }}></span>
        LIMITED RELEASE Drops: FREE WORLDWIDE AIR DISPATCH ON ALL ARCHIVAL CAP_VOL. IV ORDERS
      </div>

      <header className="sticky top-0 z-40 bg-[#050505]/95 backdrop-blur-md border-b border-[#1A1A1A] px-4 md:px-8 py-4 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Logo Name */}
          <div className="flex items-center gap-3">
            <a href="#" className="font-display font-bold text-lg sm:text-xl md:text-2xl tracking-[0.3em] hover:opacity-80 transition text-[#FAFAFA]">
              STRETO
              <span className="font-sans font-light italic text-xs tracking-normal ml-2 opacity-50">CULTURE</span>
            </a>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8 text-[11px] font-mono tracking-[0.2em] text-gray-400">
            <a href="#countdown" className="hover:text-white transition">RELEASE_DEV</a>
            <a href="#products-grid" className="hover:text-white transition">SHOP_CAPSULE</a>
            <a href="#lookbook" className="hover:text-white transition">EDITORIAL_STORY</a>
            <a href="#brand-philosophy" className="hover:text-white transition">ESSENCE_LAB</a>
          </nav>

          {/* Utility Buttons */}
          <div className="flex items-center gap-2 sm:gap-4 font-mono">
            {/* Search Toggle */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 text-gray-400 hover:text-white transition relative"
              aria-label="Search Catalog"
            >
              <Search className="w-4.5 h-4.5" />
            </button>

            {/* AI Stylist Activation Button */}
            <button
              onClick={onOpenStylist}
              className="flex items-center gap-1.5 text-[10px] sm:text-xs font-mono py-1 px-2.5 rounded-full border border-[#DF2D2D]/35 bg-[#DF2D2D]/10 text-white hover:bg-[#DF2D2D]/20 transition shadow-[0_0_12px_rgba(223,45,45,0.1)] group cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#DF2D2D] group-hover:rotate-12 transition-transform" />
              <span className="hidden sm:inline">AI_STYLIST</span>
            </button>

            {/* Content Studio Control Toggle */}
            <button
              onClick={onOpenCMS}
              className="flex items-center gap-1.5 text-[10px] sm:text-xs font-mono py-1 px-2.5 rounded-full border border-[#333] bg-[#111] text-gray-400 hover:text-white hover:border-gray-500 transition cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">CMS_STUDIO</span>
            </button>

            {/* Wishlist Link */}
            <button
              onClick={() => setIsWishlistOpen(true)}
              className="p-2 text-gray-400 hover:text-white transition relative cursor-pointer"
            >
              <Heart className={`w-4.5 h-4.5 ${wishlist.length > 0 ? "fill-[#DF2D2D] text-[#DF2D2D]" : ""}`} />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#DF2D2D]"></span>
              )}
            </button>

            {/* Cart Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="p-2 text-gray-400 hover:text-white transition relative cursor-pointer flex items-center gap-1 sm:gap-2 border border-[#222] rounded-md px-3 bg-[#0A0A0A]/50 hover:bg-[#111]"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="text-xs font-mono font-medium text-white">{totalItems}</span>
            </button>
          </div>

        </div>
      </header>

      {/* SEARCH OVERLAY SCREEN */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col pt-12 px-6">
          <div className="max-w-3xl mx-auto w-full">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3 mb-6">
              <span className="text-[11px] font-mono tracking-widest text-[#DF2D2D]">ARCHIVAL ARCHIVES PORTAL</span>
              <button
                onClick={() => {
                  setIsSearchOpen(false);
                  setSearchQuery("");
                }}
                className="p-2 hover:bg-gray-900 rounded-full text-gray-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative">
              <input
                autoFocus
                type="text"
                placeholder="TYPE TO UNCOVER PIECES (e.g. Fleece, Hoodie, Cargo)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#0F0F0F] text-white border-b border-gray-800 focus:border-[#DF2D2D] py-4 px-3 text-lg md:text-xl font-display font-medium uppercase tracking-wider outline-none transition"
              />
            </div>

            {/* Search Results */}
            <div className="mt-8 max-h-[60vh] overflow-y-auto space-y-4 pr-2">
              {searchQuery ? (
                filteredProducts.length > 0 ? (
                  filteredProducts.map((prod) => (
                    <div
                      key={prod.id}
                      onClick={() => {
                        onSelectProduct(prod);
                        setIsSearchOpen(false);
                        setSearchQuery("");
                      }}
                      className="flex gap-4 p-3 bg-[#111]/40 border border-gray-900 hover:border-gray-700 rounded-md cursor-pointer transition align-middle items-center"
                    >
                      <img
                        src={prod.primaryImage}
                        alt={prod.name}
                        referrerPolicy="no-referrer"
                        className="w-12 h-16 object-cover bg-neutral-900 rounded"
                      />
                      <div className="flex-1">
                        <div className="text-xs font-mono text-gray-400 uppercase">{prod.category}</div>
                        <div className="text-sm font-display font-bold text-white tracking-wide uppercase">{prod.name}</div>
                      </div>
                      <div className="text-sm font-mono text-[#FAFAFA]">
                        ${prod.salePrice ?? prod.price}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center font-mono py-12 text-sm text-gray-500">
                    NO RECORD FOUND MATCHING "{searchQuery.toUpperCase()}"
                  </div>
                )
              ) : (
                <div className="space-y-4">
                  <div className="text-xs font-mono uppercase tracking-widest text-gray-500">QUICK SEARCH GUIDES</div>
                  <div className="flex flex-wrap gap-2">
                    {["Fleece", "Cargo", "Crewneck", "Balaclava"].map((term) => (
                      <button
                        key={term}
                        onClick={() => setSearchQuery(term)}
                        className="px-3 py-1.5 bg-gray-900 text-xs font-mono rounded hover:bg-gray-800 text-gray-300 border border-gray-800 cursor-pointer"
                      >
                        {term.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* WISHLIST SIDEBAR OVERLAY */}
      {isWishlistOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex justify-end">
          <div className="w-full max-w-md bg-[#080808] border-l border-gray-900 p-6 flex flex-col">
            <div className="flex items-center justify-between border-b border-gray-900 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-[#DF2D2D] fill-[#DF2D2D]" />
                <span className="text-sm font-mono tracking-widest text-[#FAFAFA]">WISHLIST_INDEX ({wishlist.length})</span>
              </div>
              <button
                onClick={() => setIsWishlistOpen(false)}
                className="p-1.5 hover:bg-gray-900 rounded text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4">
              {wishlist.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 text-gray-500 font-mono">
                  <div className="mb-2 uppercase text-xs tracking-wider">YOUR RETRIEVAL ARCHIVE IS VACANT</div>
                  <p className="text-[11px] text-gray-600 max-w-xs">Heart garments to stack stylistic references here.</p>
                </div>
              ) : (
                wishlist.map((prod) => (
                  <div
                    key={prod.id}
                    className="flex gap-4 p-3 bg-gray-950 border border-gray-900 rounded items-center"
                  >
                    <img
                      src={prod.primaryImage}
                      alt={prod.name}
                      referrerPolicy="no-referrer"
                      className="w-14 h-18 object-cover bg-neutral-900 rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-[10px] font-mono text-gray-400 capitalize">{prod.category}</div>
                      <h4 className="text-xs font-display font-bold uppercase tracking-wide text-white truncate">{prod.name}</h4>
                      <p className="text-xs font-mono text-gray-300 mt-1">${prod.salePrice ?? prod.price}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => onSelectProduct(prod)}
                        className="p-1.5 bg-white text-black text-[10px] rounded hover:bg-gray-200 font-mono cursor-pointer"
                      >
                        VIEW
                      </button>
                      <button
                        onClick={() => setWishlist(wishlist.filter((w) => w.id !== prod.id))}
                        className="p-1 text-gray-500 hover:text-[#DF2D2D] text-xs font-mono cursor-pointer"
                      >
                        REMOVE
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* SHOPPING CART INTEGRATION DRAWER */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex justify-end">
          <div className="w-full max-w-md bg-[#080808] border-l border-[#1A1A1A] p-6 flex flex-col h-full shadow-[0_0_50px_rgba(0,0,0,0.8)]">
            
            <div className="flex items-center justify-between border-b border-[#1A1A1A] pb-4 mb-4">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-[#DF2D2D]" />
                <h3 className="text-sm font-mono tracking-[0.2em] uppercase text-[#FAFAFA]">SHOPPING_BAG ({totalItems})</h3>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-1.5 hover:bg-gray-900 rounded text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Product List */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 text-gray-500 font-mono select-none">
                  <div className="w-12 h-12 rounded-full border border-dashed border-gray-800 flex items-center justify-center mb-4">
                    <ShoppingBag className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="mb-2 uppercase text-xs tracking-wider">YOUR BAG IS CURRENTLY EMPTY</div>
                  <p className="text-[11px] text-gray-600 max-w-[240px]">Inquire selected volumes inside our design store collection.</p>
                </div>
              ) : (
                cart.map((item, index) => {
                  const p = item.product;
                  const itemPrice = p.salePrice ?? p.price;
                  return (
                    <div
                      key={`${p.id}-${item.size}`}
                      className="flex gap-4 p-4 bg-[#0D0D0D] border border-[#111] rounded-lg items-center relative group"
                    >
                      <img
                        src={p.primaryImage}
                        alt={p.name}
                        referrerPolicy="no-referrer"
                        className="w-16 h-20 object-cover bg-neutral-900 rounded border border-gray-900"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-mono bg-[#1A1A1A] text-gray-400 px-1.5 py-0.5 rounded capitalize">
                            {p.category}
                          </span>
                          <span className="text-[10px] font-mono text-[#DF2D2D] font-bold">
                            SIZE: {item.size}
                          </span>
                        </div>
                        <h4 className="text-xs font-display font-bold uppercase tracking-wide text-white truncate mt-1">
                          {p.name}
                        </h4>
                        
                        <div className="flex items-center justify-between mt-3">
                          {/* Stepper counter */}
                          <div className="flex items-center border border-[#222] rounded bg-black">
                            <button
                              onClick={() => updateQuantity(index, -1)}
                              className="px-2 py-0.5 text-gray-500 hover:text-white font-mono text-xs cursor-pointer"
                            >
                              -
                            </button>
                            <span className="px-2 text-xs font-mono text-white select-none">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(index, 1)}
                              className="px-2 py-0.5 text-gray-500 hover:text-white font-mono text-xs cursor-pointer"
                            >
                              +
                            </button>
                          </div>
                          
                          <p className="text-xs font-mono font-medium text-white">${itemPrice * item.quantity}</p>
                        </div>
                      </div>

                      {/* Remove item absolute button */}
                      <button
                        onClick={() => removeFromCart(index)}
                        className="absolute top-2 right-2 text-gray-600 hover:text-[#DF2D2D] transition p-1 opacity-0 group-hover:opacity-100 cursor-pointer"
                        title="Remove garment"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            {/* Total pricing section */}
            {cart.length > 0 && (
              <div className="border-t border-[#1A1A1A] pt-4 mt-4 space-y-3 font-mono">
                <div className="flex justify-between items-center text-xs text-gray-400">
                  <span>WORLDWIDE EXPRESS DISPATCH</span>
                  <span className="text-[#DF2D2D] text-[10px] font-bold">COMPLEMENTARY</span>
                </div>
                <div className="flex justify-between items-center text-sm font-semibold">
                  <span className="tracking-widest">BAG_SUBTOTAL</span>
                  <span className="text-base text-white tracking-widest font-mono">${cartTotal}</span>
                </div>

                <button
                  onClick={() => {
                    alert(`DEMO STRETO GATEWAY: Checkout simulation of $${cartTotal} accepted in sandboxed development mode.`);
                    setCart([]);
                    setIsCartOpen(false);
                  }}
                  className="w-full bg-[#DF2D2D] hover:bg-[#C92222] text-white py-3 px-4 rounded text-xs font-bold tracking-[0.2em] transition flex items-center justify-center gap-2 mt-2 uppercase cursor-pointer"
                >
                  <span>SECURE_ENCRYPTED_GATEWAY</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                
                <p className="text-[9px] text-gray-600 text-center uppercase tracking-wide">
                  COMPLIANT TRANSACTION SYSTEMS SECURED via HEADLESS API
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
