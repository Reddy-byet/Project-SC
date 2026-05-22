import React, { useState, useEffect } from "react";
import { Sparkles, Sliders, Play, Volume2, VolumeX, Eye, ArrowRight, Heart, ShoppingBag, Plus, Sparkle, Clock, ShieldCheck, Mail, Info, RefreshCw, Layers, X } from "lucide-react";
import { CartItem, CmsData, Product } from "./types";
import Header from "./components/Header";
import AiStylist from "./components/AiStylist";
import CmsStudio from "./components/CmsStudio";

// Initial state skeleton to prevent loading crashes
const emptyCmsData: CmsData = {
  hero: {
    heading: "SUMMER DROP",
    subheading: "VOL. IV",
    bannerImage: "https://picsum.photos/seed/streto/1920/1080",
    ctaText: "DISCOVER",
    overlayOpacity: 45,
    fullscreen: true,
    accentColor: "#DF2D2D",
  },
  dropDate: "2026-07-10T18:00:00.000Z",
  marqueeTexts: ["FREE YOUR MIND", "STRETO CULTURE"],
  brandStory: {
    quote: "Don’t tell me how to dress.",
    description: "Streto Culture was established to challenge standard dress paradigms.",
    timeline: []
  },
  products: [],
  lookbooks: []
};

export default function App() {
  const [cmsData, setCmsData] = useState<CmsData>(emptyCmsData);
  const [loadingCms, setLoadingCms] = useState(true);
  
  // App variables
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  
  // Page selectors
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>("");

  // Sidebar controls
  const [isStylistOpen, setIsStylistOpen] = useState(false);
  const [isCmsOpen, setIsCmsOpen] = useState(false);

  // Video playback
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [isVideoMuted, setIsVideoMuted] = useState(true);

  // Countdown timer calculations
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, active: true });

  // Newsletter registration
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSigned, setNewsletterSigned] = useState(false);

  // Pull CMS state on mount
  const fetchCmsData = async () => {
    try {
      const response = await fetch("/api/cms-data");
      const result = await response.json();
      if (result.status === "success" && result.data) {
        setCmsData(result.data);
      }
    } catch (err) {
      console.error("Failed to load schema from API: ", err);
    } finally {
      setLoadingCms(false);
    }
  };

  useEffect(() => {
    fetchCmsData();
  }, []);

  // Update backend states
  const handleUpdateCMS = async (updated: CmsData) => {
    const response = await fetch("/api/cms-data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });
    const result = await response.json();
    if (result.status === "success") {
      setCmsData(result.data);
    } else {
      throw new Error(result.message);
    }
  };

  const handleResetCMS = async () => {
    const response = await fetch("/api/cms-data/reset", {
      method: "POST",
    });
    const result = await response.json();
    if (result.status === "success") {
      setCmsData(result.data);
    }
  };

  // Set local persistence for cart/wishlist
  useEffect(() => {
    const cachedCart = localStorage.getItem("streto-bag-store");
    const cachedWishList = localStorage.getItem("streto-wish-store");
    if (cachedCart) setCart(JSON.parse(cachedCart));
    if (cachedWishList) setWishlist(JSON.parse(cachedWishList));
  }, []);

  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem("streto-bag-store", JSON.stringify(cart));
    } else {
      localStorage.removeItem("streto-bag-store");
    }
  }, [cart]);

  useEffect(() => {
    if (wishlist.length > 0) {
      localStorage.setItem("streto-wish-store", JSON.stringify(wishlist));
    } else {
      localStorage.removeItem("streto-wish-store");
    }
  }, [wishlist]);

  // Compute countdown relative to cmsData.dropDate
  useEffect(() => {
    const calculateTime = () => {
      const targetTime = new Date(cmsData.dropDate).getTime();
      const now = new Date().getTime();
      const difference = targetTime - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, active: false });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, active: true });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [cmsData.dropDate]);

  // Toggle wishlist state
  const handleToggleWishlist = (prod: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    if (wishlist.some((item) => item.id === prod.id)) {
      setWishlist(wishlist.filter((item) => item.id !== prod.id));
    } else {
      setWishlist([...wishlist, prod]);
    }
  };

  // Add Item to cart validation
  const handleAddToCart = (prod: Product, quantity = 1) => {
    if (!selectedSize && prod.sizes.length > 1 && prod.sizes[0] !== "O/S") {
      alert("A size preference is required before booking silhouettes.");
      return;
    }
    const targetSize = prod.sizes.length === 1 ? prod.sizes[0] : selectedSize;

    const existingIndex = cart.findIndex(
      (item) => item.product.id === prod.id && item.size === targetSize
    );

    if (existingIndex > -1) {
      const updated = [...cart];
      updated[existingIndex].quantity += quantity;
      setCart(updated);
    } else {
      setCart([...cart, { product: prod, size: targetSize, quantity }]);
    }

    // Reset details
    setSelectedSize("");
    setSelectedProduct(null);
  };

  const handleQuickAdd = (p: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    // Default to first size if single value
    if (p.sizes.length === 1 || p.sizes[0] === "O/S") {
      handleAddToCart(p, 1);
    } else {
      // Prompt selector
      setSelectedProduct(p);
      setSelectedSize(p.sizes[0]);
    }
  };

  const activeProducts = selectedCategory === "all"
    ? cmsData.products
    : cmsData.products.filter((p) => p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-[#050505] text-[#FAFAFA] flex flex-col selection:bg-[#DF2D2D]/35 selection:text-white">
      
      {/* GLOBAL BRAND HEADER */}
      <Header
        cart={cart}
        setCart={setCart}
        wishlist={wishlist}
        setWishlist={setWishlist}
        onOpenStylist={() => setIsStylistOpen(true)}
        onOpenCMS={() => setIsCmsOpen(true)}
        products={cmsData.products}
        onSelectProduct={(prod) => setSelectedProduct(prod)}
        accentColor={cmsData.hero.accentColor}
      />

      {/* CORE HERO CAMPAIGN SECTION */}
      <section className="relative w-full h-[82vh] md:h-screen flex items-end justify-start overflow-hidden bg-black select-none">
        
        {/* Editorial ambient video loop proxy */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-neutral-950/20 mix-blend-multiply"></div>
          
          {isVideoPlaying ? (
            <video
              autoPlay
              loop
              muted={isVideoMuted}
              playsInline
              className="w-full h-full object-cover opacity-60 transition-opacity duration-1000 scale-105"
            >
              <source src="https://assets.mixkit.co/videos/preview/mixkit-fashion-model-walking-on-city-streets-39899-large.mp4" type="video/mp4" />
              {/* Fallback image */}
              <img
                src={cmsData.hero.bannerImage}
                alt="Streto Campaign Background"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover scale-105"
              />
            </video>
          ) : (
            <img
              src={cmsData.hero.bannerImage}
              alt="Streto Campaign Static"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover scale-102 transition-transform duration-700"
            />
          )}

          {/* Color filter overlays */}
          <div
            className="absolute inset-0 bg-black transition-opacity duration-500"
            style={{ opacity: cmsData.hero.overlayOpacity / 100 }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent"></div>
        </div>

        {/* Hero Copy Info */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-8 pb-16 md:pb-24 grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
          <div className="space-y-4 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: cmsData.hero.accentColor }}></span>
              <span className="text-[10px] sm:text-xs font-mono tracking-[0.25em] text-gray-400 font-bold uppercase">
                {cmsData.hero.subheading}
              </span>
            </div>
            
            <h1 className="font-display font-medium text-4xl sm:text-5xl md:text-7xl lg:text-8xl tracking-tight text-white leading-[0.9] uppercase">
              {cmsData.hero.heading}
            </h1>
            
            <p className="text-xs sm:text-sm font-mono text-gray-400 tracking-wide uppercase">
              LIMITED MICRO-BATCH DIRECTIVE. RE-FORMULATED ATHLETIC FORMS & TEXTURES.
            </p>

            <div className="flex items-center gap-4 pt-3">
              <a
                href="#products-grid"
                className="inline-flex items-center justify-center gap-2 bg-white text-black py-3 px-6 text-xs font-bold tracking-[0.2em] rounded uppercase hover:bg-gray-200 transition-colors cursor-pointer"
              >
                <span>{cmsData.hero.ctaText}</span>
                <ArrowRight className="w-4 h-4 text-black" />
              </a>

              <a
                href="#countdown"
                className="inline-flex items-center gap-2 text-xs font-mono tracking-widest text-gray-300 hover:text-white transition"
              >
                <Clock className="w-3.5 h-3.5" />
                <span>CHRONO_STATUS</span>
              </a>
            </div>
          </div>

          {/* Minimal Audio / Play Toggle overlay controls in hero corner */}
          <div className="hidden md:flex justify-end gap-3 text-gray-500">
            <button
              onClick={() => setIsVideoPlaying(!isVideoPlaying)}
              className="p-3 bg-black/40 hover:bg-black/80 hover:text-white border border-[#222] rounded-full text-xs transition flex items-center justify-center cursor-pointer"
              title={isVideoPlaying ? "Freeze playback" : "Resume motion Loop"}
            >
              <span className="text-[10px] font-mono tracking-widest mr-2">{isVideoPlaying ? "LOOP_ACTIVE" : "STILL_MODE"}</span>
              <Play className="w-3.5 h-3.5 fill-current" />
            </button>
            
            {isVideoPlaying && (
              <button
                onClick={() => setIsVideoMuted(!isVideoMuted)}
                className="p-3 bg-black/40 hover:bg-black/80 hover:text-white border border-[#222] rounded-full text-xs transition cursor-pointer"
                title={isVideoMuted ? "Unmute campaign atmosphere" : "Mute audio"}
              >
                {isVideoMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 animate-bounce" />}
              </button>
            )}
          </div>
        </div>
      </section>

      {/* CHRONOMETER DROP COUNTDOWN TIMER */}
      <section id="countdown" className="py-12 bg-black border-y border-[#151515] select-none">
        <div className="max-w-7xl mx-auto px-6 md:px-8 flex flex-col md:flex-row items-center justify-between gap-8">
          
          <div className="space-y-1.5 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full animate-ping" style={{ backgroundColor: cmsData.hero.accentColor }}></span>
              <span className="text-[10px] font-mono tracking-widest text-[#DF2D2D] uppercase font-bold">NEXT ARCHIVAL SHIPMENT DROPPING</span>
            </div>
            <h3 className="font-display font-medium text-lg text-white uppercase tracking-wider">
              LIMITED RELEASE CHRONOMETER
            </h3>
            <p className="text-[11px] font-mono text-gray-500 uppercase">
              RELEASES WORLDWIDE ON: {new Date(cmsData.dropDate).toLocaleString()}
            </p>
          </div>

          {/* Numerical count layout */}
          <div className="flex items-center gap-3 sm:gap-6 font-mono text-center">
            
            <div className="bg-[#0A0A0A] border border-[#222] min-w-[70px] sm:min-w-[85px] py-3.5 px-2 rounded">
              <div className="text-xl sm:text-3xl font-bold text-white tracking-widest">
                {String(timeLeft.days).padStart(2, "0")}
              </div>
              <div className="text-[9px] text-gray-500 uppercase tracking-widest mt-1">days</div>
            </div>

            <span className="text-xl text-neutral-800">:</span>

            <div className="bg-[#0A0A0A] border border-[#222] min-w-[70px] sm:min-w-[85px] py-3.5 px-2 rounded">
              <div className="text-xl sm:text-3xl font-bold text-white tracking-widest">
                {String(timeLeft.hours).padStart(2, "0")}
              </div>
              <div className="text-[9px] text-gray-500 uppercase tracking-widest mt-1">hrs</div>
            </div>

            <span className="text-xl text-neutral-800">:</span>

            <div className="bg-[#0A0A0A] border border-[#222] min-w-[70px] sm:min-w-[85px] py-3.5 px-2 rounded">
              <div className="text-xl sm:text-3xl font-bold text-white tracking-widest">
                {String(timeLeft.minutes).padStart(2, "0")}
              </div>
              <div className="text-[9px] text-gray-500 uppercase tracking-widest mt-1">mins</div>
            </div>

            <span className="text-xl text-neutral-800">:</span>

            <div className="bg-[#0A0A0A] border border-[#222] min-w-[70px] sm:min-w-[85px] py-3.5 px-2 rounded">
              <div className="text-xl sm:text-3xl font-bold text-[#DF2D2D] tracking-widest animate-pulse">
                {String(timeLeft.seconds).padStart(2, "0")}
              </div>
              <div className="text-[9px] text-gray-500 uppercase tracking-widest mt-1">secs</div>
            </div>

          </div>

          <div className="space-y-2">
            <button
              onClick={() => {
                alert(`STRETO SMS BULLETIN: Standard mobile notification alerts secured. You will be alerted 15 minutes before Drop Launch.`);
              }}
              className="text-xs font-mono font-bold tracking-widest border border-white hover:bg-white hover:text-black py-2.5 px-4 rounded text-center transition block w-full uppercase cursor-pointer"
            >
              ALERTVIA_SMS_NOTIFY
            </button>
          </div>

        </div>
      </section>

      {/* FEATURED PRODUCT GRID SECTION */}
      <section id="products-grid" className="py-20 max-w-7xl mx-auto w-full px-6 md:px-8">
        
        {/* Title Content */}
        <div className="flex flex-col md:flex-row items-baseline justify-between border-b border-gray-900 pb-6 mb-10 gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-mono tracking-[0.3em] text-[#DF2D2D] uppercase font-semibold">[CATALOG RECON]</span>
            <h2 className="font-display font-bold text-2xl sm:text-3xl md:text-4xl text-white uppercase tracking-wider">
              ARCHIVAL APPAREL DISPATCH
            </h2>
          </div>

          {/* Filtering system tabs */}
          <div className="flex gap-2.5 font-mono overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            {["all", "hoodies", "tees", "denim", "accessories"].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`py-1.5 px-4 text-xs tracking-widest rounded border transition cursor-pointer shrink-0 uppercase ${
                  selectedCategory === cat
                    ? "border-white bg-[#FAFAFA] text-black"
                    : "border-neutral-900 bg-neutral-950 text-gray-500 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid Lists */}
        {loadingCms ? (
          <div className="py-24 text-center text-gray-500 font-mono text-sm uppercase">
            REARRANGING COLLECTIONS MATRIX...
          </div>
        ) : activeProducts.length === 0 ? (
          <div className="py-24 text-center text-gray-500 font-mono text-sm max-w-xs mx-auto border border-dashed border-gray-900 p-8 rounded uppercase">
            NO SILHOUETTES ATTACHED INDOOR CATEGORY.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
            {activeProducts.map((p) => {
              const inWishlist = wishlist.some((item) => item.id === p.id);
              const hasSale = p.salePrice !== null;
              
              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedProduct(p)}
                  className="group flex flex-col justify-between h-full bg-[#080808]/40 border border-[#111] hover:border-gray-800 rounded-lg p-3 transition duration-500 cursor-pointer relative"
                >
                  {/* Status Badge overlay */}
                  {p.badge && (
                    <div className="absolute top-5 left-5 z-20">
                      <span className="bg-black/95 text-[9px] font-mono tracking-widest text-[#DF2D2D] font-bold border border-neutral-900 px-2 py-1 rounded">
                        {p.badge.toUpperCase()}
                      </span>
                    </div>
                  )}

                  {/* Actions shortcut toggles */}
                  <div className="absolute top-5 right-5 z-20 flex flex-col gap-2">
                    <button
                      onClick={(e) => handleToggleWishlist(p, e)}
                      className="p-2 bg-black/80 hover:bg-black rounded-full border border-neutral-950 text-gray-400 hover:text-white transition cursor-pointer"
                      title={inWishlist ? "Unsave items" : "Heart garments"}
                    >
                      <Heart className={`w-3.5 h-3.5 ${inWishlist ? "fill-[#DF2D2D] text-[#DF2D2D]" : ""}`} />
                    </button>
                    
                    <button
                      onClick={(e) => handleQuickAdd(p, e)}
                      className="p-2 bg-black/80 hover:bg-black rounded-full border border-neutral-950 text-gray-400 hover:text-white transition cursor-pointer"
                      title="Quick allocate bag"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Image Swapper Container */}
                  <div className="w-full aspect-[3/4] bg-neutral-950 rounded-md overflow-hidden relative border border-gray-950">
                    <img
                      src={p.primaryImage}
                      alt={p.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 group-hover:opacity-0 position absolute inset-0"
                    />
                    <img
                      src={p.hoverImage}
                      alt={`${p.name} detail view`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover scale-102 opacity-0 transition-all duration-700 ease-out group-hover:opacity-100 group-hover:scale-100 position absolute inset-0 bg-neutral-900"
                    />
                  </div>

                  {/* Item Description Info */}
                  <div className="mt-4 space-y-2 flex-grow flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-mono tracking-widest text-gray-500 uppercase">
                          {p.category}
                        </span>
                        
                        <span className="text-[9px] font-mono text-[#DF2D2D] font-bold">
                          {p.stockCount <= 10 && p.stockCount > 0 ? `REST_LOW: ${p.stockCount}` : p.stockCount === 0 ? "OUT_OF_STOCK" : `RUN_BATCH: ${p.limitedRunCount}`}
                        </span>
                      </div>
                      
                      <h3 className="font-display font-medium text-xs sm:text-sm text-[#FAFAFA] tracking-widest uppercase transition-colors group-hover:text-gray-300 mt-1">
                        {p.name}
                      </h3>
                    </div>

                    <div className="flex items-baseline justify-between pt-2 border-t border-gray-900/45">
                      <div className="flex gap-2 items-baseline font-mono">
                        {hasSale ? (
                          <>
                            <span className="text-sm font-semibold text-[#DF2D2D]">${p.salePrice}</span>
                            <span className="text-[10px] line-through text-gray-500">${p.price}</span>
                          </>
                        ) : (
                          <span className="text-sm font-semibold text-white">${p.price}</span>
                        )}
                      </div>
                      
                      <span className="text-[9px] font-mono text-gray-400 group-hover:text-[#FAFAFA] border-b border-transparent group-hover:border-[#FAFAFA] pb-0.5 transition uppercase tracking-widest">
                        ALLOCATE
                      </span>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* TWO COLUMN LOOKBOOK SECTION EDITORIAL */}
      <section id="lookbook" className="bg-[#080808] border-y border-[#121212] py-20 select-none">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 align-middle items-center">
            
            {/* Column A: Poetry Narrative */}
            <div className="space-y-6 lg:col-span-5">
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-[#DF2D2D] tracking-widest uppercase">
                  [VOLUME FOUR DIALOGUE]
                </span>
                <h2 className="font-display font-bold text-3xl md:text-5xl tracking-tight text-white uppercase leading-[0.95]">
                  {cmsData.lookbooks[0]?.title || "BRUTALIST SOLITUDE"}
                </h2>
                <p className="text-xs font-mono text-gray-500 mt-2 uppercase">
                  {cmsData.lookbooks[0]?.credits || "PHOTOGRAPHY soren vance"}
                </p>
              </div>

              <div className="border-t border-neutral-900 pt-6">
                <p className="font-sans text-sm text-gray-400 leading-relaxed">
                  {cmsData.lookbooks[0]?.overview || "Shot on the raw geometric lines of brutalist structures, contrasting fabric folds with architectural symmetry."}
                </p>
              </div>

              <div className="p-5 border-l border-[#DF2D2D] bg-[#0c0c0c] text-xs font-mono text-gray-400 leading-relaxed italic">
                “{cmsData.lookbooks[0]?.notes || "Every clothing element serves as a personal fortress—heavy textures configured for structural survival."}”
              </div>

              <div className="pt-3 flex flex-wrap gap-2">
                <span className="text-[10px] font-mono bg-[#1E1E1E] text-gray-400 py-1.5 px-3 rounded uppercase border border-neutral-900 font-bold">120MM FILM</span>
                <span className="text-[10px] font-mono bg-[#1E1E1E] text-gray-400 py-1.5 px-3 rounded uppercase border border-neutral-900 font-bold">BARBICAN ESTATE</span>
                <span className="text-[10px] font-mono bg-[#1E1E1E] text-gray-400 py-1.5 px-3 rounded uppercase border border-neutral-900 font-bold">NATURAL CONTRAST</span>
              </div>
            </div>

            {/* Column B Layout collage */}
            <div className="lg:col-span-7 grid grid-cols-12 gap-4">
              <div className="col-span-7 aspect-[3/4] bg-neutral-950 rounded-lg overflow-hidden border border-neutral-900 shadow-xl relative group">
                <img
                  src="/src/assets/images/streto_lookbook_1_1779468097328.png"
                  alt="Editorial styling 1"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-sm border border-neutral-900 px-3 py-1.5 rounded">
                  <span className="text-[10px] text-white font-mono uppercase tracking-widest">LOOK_01 // COAT STACK FORMS</span>
                </div>
              </div>

              <div className="col-span-5 flex flex-col justify-between gap-4">
                <div className="aspect-[1/1] bg-neutral-950 rounded-lg overflow-hidden border border-neutral-900 shadow-lg relative group">
                  <img
                    src="/src/assets/images/streto_lookbook_2_1779468118793.png"
                    alt="Editorial styling 2"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                  <div className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-sm border border-neutral-900 px-2 py-1 rounded">
                    <span className="text-[9px] text-white font-mono uppercase">LOOK_02 // SLATE PANTS</span>
                  </div>
                </div>

                <div className="p-6 bg-neutral-950 border border-neutral-900 rounded-lg h-full flex flex-col justify-between select-none">
                  <div>
                    <h4 className="text-xs font-mono text-gray-500 tracking-widest uppercase">DISPATCH_MATRIX</h4>
                    <p className="text-[11px] font-mono text-gray-400 uppercase mt-2 leading-relaxed">
                      EACH CAPSULE PIECE CARRIES COMPATIBLE RFID BRANDING PLATES INSIDE COUTURE SLEEVES.
                    </p>
                  </div>
                  <a
                    href="#products-grid"
                    className="inline-flex items-center gap-1.5 text-xs text-[#DF2D2D] font-mono font-medium hover:underline tracking-widest uppercase mt-4"
                  >
                    <span>BROWSE ARTIFACTS</span>
                    <ArrowRight className="w-3 h-3" />
                  </a>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* CONTINUOUS ROTATING MARQUEE */}
      <section className="bg-white text-black py-4 select-none uppercase overflow-hidden font-display font-black text-2xl sm:text-3.5xl border-y border-gray-200">
        <div className="flex whitespace-nowrap overflow-hidden">
          <div className="animate-marquee flex items-center space-x-12 shrink-0">
            {Array(5).fill(cmsData.marqueeTexts).flat().map((word, i) => (
              <span key={i} className="flex items-center gap-10">
                <span className="hover:text-[#DF2D2D] transition-colors tracking-widest">{word}</span>
                <Sparkle className="w-5 h-5 fill-current text-[#DF2D2D] shrink-0" />
              </span>
            ))}
          </div>
          <div className="animate-marquee flex items-center space-x-12 shrink-0 select-none">
            {Array(5).fill(cmsData.marqueeTexts).flat().map((word, i) => (
              <span key={`dup-${i}`} className="flex items-center gap-10">
                <span className="hover:text-[#DF2D2D] transition-colors tracking-widest">{word}</span>
                <Sparkle className="w-5 h-5 fill-current text-[#DF2D2D] shrink-0" />
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CORE BRAND STORY AND PHILOSOPHY */}
      <section id="brand-philosophy" className="py-24 max-w-4xl mx-auto w-full px-6 md:px-8 text-center select-none">
        
        <div className="space-y-8">
          
          <div className="inline-block p-2 bg-[#DF2D2D]/10 rounded-full border border-[#DF2D2D]/35 shadow-[0_0_12px_rgba(223,45,45,0.06)]">
            <Layers className="w-5 h-5 text-[#DF2D2D]" />
          </div>

          <p className="font-display text-2xl sm:text-3xl md:text-4xl text-white font-medium uppercase tracking-tight leading-snug quote italic max-w-2xl mx-auto">
            “{cmsData.brandStory.quote}”
          </p>

          <p className="font-sans text-sm md:text-base text-gray-500 max-w-xl mx-auto leading-relaxed uppercase tracking-wider text-[11px]">
            {cmsData.brandStory.description}
          </p>

          {/* Historical timeline logs */}
          <div className="pt-10 border-t border-neutral-900 grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
            {cmsData.brandStory.timeline?.map((step, i) => (
              <div key={i} className="p-4 bg-neutral-950/20 border border-neutral-900/55 rounded space-y-1">
                <span className="text-xl font-display font-medium text-white tracking-wider block border-b border-neutral-900 pb-1.5">{step.year}</span>
                <p className="text-[10px] font-mono text-gray-400 uppercase tracking-wide leading-relaxed pt-1.5">
                  {step.event}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* PRODUCT DETAIL MODAL DRAWER OVERLAY */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="w-full max-w-4xl bg-[#090909] border border-neutral-900 rounded-lg overflow-hidden flex flex-col md:flex-row shadow-[0_0_60px_rgba(0,0,0,0.95)]">
            
            {/* Modal Col 1 Detail image */}
            <div className="w-full md:w-1/2 aspect-[3/4] md:aspect-auto md:h-[65vh] bg-[#050505] relative overflow-hidden flex-shrink-0">
              <img
                src={selectedProduct.primaryImage}
                alt={selectedProduct.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              {selectedProduct.badge && (
                <div className="absolute top-4 left-4 bg-black/90 border border-neutral-900 text-xs text-[#DF2D2D] font-mono tracking-widest px-3 py-1 rounded">
                  {selectedProduct.badge.toUpperCase()}
                </div>
              )}
            </div>

            {/* Modal Col 2 Description & sizes */}
            <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between overflow-y-auto max-h-[85vh] md:max-h-[65vh] text-[#FAFAFA]">
              
              <div>
                
                {/* Header detail */}
                <div className="flex items-center justify-between border-b border-[#1A1A1A] pb-3 mb-4">
                  <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">[GARMENT BRIEF]</span>
                  <button
                    onClick={() => {
                      setSelectedProduct(null);
                      setSelectedSize("");
                    }}
                    className="p-1 hover:bg-neutral-900 text-gray-400 hover:text-white rounded transition cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <span className="text-[9px] font-mono bg-[#1E1E1E] text-gray-400 py-0.5 px-2 rounded uppercase border border-neutral-900">
                  {selectedProduct.category}
                </span>

                <h3 className="font-display font-medium text-lg sm:text-xl md:text-2xl text-white tracking-widest uppercase mt-3 hover:opacity-90">
                  {selectedProduct.name}
                </h3>

                {/* Price block */}
                <div className="flex items-baseline gap-2.5 mt-3 select-none">
                  {selectedProduct.salePrice !== null ? (
                    <>
                      <span className="text-xl font-bold font-mono text-[#DF2D2D]">${selectedProduct.salePrice}</span>
                      <span className="text-xs line-through text-gray-500 font-mono">${selectedProduct.price}</span>
                    </>
                  ) : (
                    <span className="text-xl font-bold font-mono text-white">${selectedProduct.price}</span>
                  )}
                </div>

                {/* Fabric specifications */}
                <div className="mt-5 space-y-3 font-mono text-[11px] text-gray-400 leading-relaxed border-t border-[#111] pt-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-[#DF2D2D]">&#x25AA;</span>
                    <span><strong className="text-white uppercase">Materials:</strong> {selectedProduct.materials}</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-[#DF2D2D]">&#x25AA;</span>
                    <span><strong className="text-white uppercase">Fit Directive:</strong> {selectedProduct.fit}</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-[#DF2D2D]">&#x25AA;</span>
                    <span><strong className="text-white uppercase">Availability:</strong> Limited archival run of {selectedProduct.limitedRunCount} copies.</span>
                  </div>
                </div>

                {/* Sizes Selector */}
                <div className="mt-5 space-y-2.5">
                  <div className="flex items-center justify-between text-[11px] font-mono uppercase text-gray-400">
                    <span>SELECT SIZE DIRECTION</span>
                    <button
                      onClick={() => alert(`STRETO SIZE GUIDE MATRIX:\nHoodies are designed oversized crop fit.\nRecommended standard sizing: Take your usual size for standard streetwear proportions.`)}
                      className="text-[10px] text-[#DF2D2D] hover:underline"
                    >
                      FIT_SIZE_GUIDE
                    </button>
                  </div>

                  <div className="flex gap-2">
                    {selectedProduct.sizes.map((sz) => (
                      <button
                        key={sz}
                        onClick={() => setSelectedSize(sz)}
                        className={`w-11 h-11 border text-xs font-mono rounded transition flex items-center justify-center cursor-pointer ${
                          selectedSize === sz
                            ? "border-white bg-[#FAFAFA] text-black"
                            : "border-neutral-900 bg-neutral-950 text-gray-400 hover:border-neutral-800"
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              {/* Add actions footer */}
              <div className="mt-8 pt-4 border-t border-[#151515] space-y-3">
                <button
                  onClick={() => handleAddToCart(selectedProduct)}
                  className="w-full bg-[#DF2D2D] hover:bg-[#C92222] text-white py-3 px-4 rounded text-xs font-bold tracking-[0.2em] transition uppercase flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>ALLOCATE_TO_BAG</span>
                </button>
                
                <p className="text-[10px] font-mono text-gray-500 text-center uppercase tracking-wider">
                  🔐 SECURE DECENTRALISED ENCRYPTION INTEGRATIONS
                </p>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* FOOTER NEWSLETTER & NOTICES */}
      <footer className="bg-black border-t border-[#121212] py-16 text-gray-500 font-mono text-xs select-none">
        
        <div className="max-w-7xl mx-auto px-6 md:px-8 grid grid-cols-1 md:grid-cols-12 gap-10 pb-10 border-b border-neutral-900">
          
          {/* Col 1 Brand Slogan */}
          <div className="col-span-1 md:col-span-4 space-y-4">
            <h4 className="font-display font-medium text-white tracking-[0.3em] uppercase">STRETO_STUDIO</h4>
            <p className="text-[11px] text-gray-400 leading-relaxed uppercase">
              ARCHIVAL HIGH FASHION DIGITAL ASSEMBLAGE. RESPONDING TO MECHANICAL OVERPROTECTOR PARAMETERS.
            </p>
            <div className="flex items-center gap-2.5 text-[10px] text-gray-600">
              <ShieldCheck className="w-4 h-4 text-[#DF2D2D]" />
              <span>COMPLIANT DECENTRALIZED DATA APPARATUS</span>
            </div>
          </div>

          {/* Col 2 CMS Details */}
          <div className="col-span-1 md:col-span-4 space-y-3">
            <h4 className="text-[10px] tracking-widest uppercase text-white font-bold">SCHEMATIC DIRECTIONS</h4>
            <p className="text-[10px] leading-relaxed uppercase">
              The platform interfaces with our custom server-side state engine proxying live updates instantly back to Vercel/Sanity content channels.
            </p>
            <button
              onClick={() => setIsCmsOpen(true)}
              className="text-[10px] text-[#DF2D2D] hover:underline uppercase flex items-center gap-1.5"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>LAUNCH_CMS_STUDIO_TUNER</span>
            </button>
          </div>

          {/* Col 3 Newsletter Subscribe */}
          <div className="col-span-1 md:col-span-4 space-y-3">
            <h4 className="text-[10px] tracking-widest uppercase text-white font-bold">MANIFEST_MAILS</h4>
            
            {newsletterSigned ? (
              <div className="p-3 bg-neutral-950 border border-neutral-900 text-green-400 rounded text-[11px] uppercase">
                ✅ TRANSMISSION ARCHIVED. Welcome to Streto Culture registry.
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <p className="text-[10px] uppercase text-gray-600 leading-relaxed">
                  Join our newsletter list for direct micro-drop calendars.
                </p>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="ENTER_ENCRYPTED_EMAIL"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className="w-full bg-[#070707] border border-neutral-900 focus:border-gray-600 text-white p-2.5 rounded text-xs outline-none uppercase"
                  />
                  <button
                    onClick={() => {
                      if (newsletterEmail) setNewsletterSigned(true);
                    }}
                    className="absolute right-2 top-2 p-1 text-gray-400 hover:text-[#DF2D2D] cursor-pointer"
                  >
                    <Mail className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Brand Copyright legal info */}
        <div className="max-w-7xl mx-auto px-6 md:px-8 pt-8 flex flex-col sm:flex-row justify-between items-center text-[10px] text-gray-600 tracking-wider font-mono gap-4">
          <p className="uppercase">©2026 STRETO CULTURE ARCHIVE. STRICTLY LIMITED EDITION DISPATCHES.</p>
          <p className="uppercase">ALL DESIGNS ENGINEERED BY DXSTRA CREATIVE GROUP. HEADLESS INFRASTRUCTURES CORES.</p>
        </div>

      </footer>

      {/* MODAL COUTURÉ STYLIST SIDEBAR OVERLAY */}
      <AiStylist
        isOpen={isStylistOpen}
        onClose={() => setIsStylistOpen(false)}
        products={cmsData.products}
        accentColor={cmsData.hero.accentColor}
      />

      {/* SIMULATED SANITY CMS BLUEPRINT CONSOLE PANEL */}
      <CmsStudio
        isOpen={isCmsOpen}
        onClose={() => setIsCmsOpen(false)}
        cmsData={cmsData}
        onUpdateCMS={handleUpdateCMS}
        onResetCMS={handleResetCMS}
      />

    </div>
  );
}
