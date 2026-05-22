import { useState } from "react";
import { X, Sliders, Save, RotateCcw, Check, Sparkles } from "lucide-react";
import { CmsData } from "../types";

interface CmsStudioProps {
  isOpen: boolean;
  onClose: () => void;
  cmsData: CmsData;
  onUpdateCMS: (updated: CmsData) => Promise<void>;
  onResetCMS: () => Promise<void>;
}

export default function CmsStudio({
  isOpen,
  onClose,
  cmsData,
  onUpdateCMS,
  onResetCMS,
}: CmsStudioProps) {
  // Temporary edit states
  const [heroHeading, setHeroHeading] = useState(cmsData.hero.heading);
  const [heroSubheading, setHeroSubheading] = useState(cmsData.hero.subheading);
  const [heroCta, setHeroCta] = useState(cmsData.hero.ctaText);
  const [overlayOpacity, setOverlayOpacity] = useState(cmsData.hero.overlayOpacity);
  const [accentColor, setAccentColor] = useState(cmsData.hero.accentColor);
  const [dropDate, setDropDate] = useState(cmsData.dropDate);
  const [marqueeTextsText, setMarqueeTextsText] = useState(cmsData.marqueeTexts.join(", "));
  
  // Products prices
  const [productsState, setProductsState] = useState(cmsData.products);

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleProductPriceChange = (id: string, value: number) => {
    setProductsState(
      productsState.map((p) => (p.id === id ? { ...p, price: value } : p))
    );
  };

  const handleProductSalePriceChange = (id: string, value: string) => {
    const saleNum = value === "" ? null : Number(value);
    setProductsState(
      productsState.map((p) => (p.id === id ? { ...p, salePrice: saleNum } : p))
    );
  };

  const handleProductBadgeChange = (id: string, value: string) => {
    setProductsState(
      productsState.map((p) => (p.id === id ? { ...p, badge: value } : p))
    );
  };

  const handleSave = async () => {
    setSaving(true);
    setSuccess(false);
    
    // Package editing values
    const updated: CmsData = {
      ...cmsData,
      hero: {
        ...cmsData.hero,
        heading: heroHeading,
        subheading: heroSubheading,
        ctaText: heroCta,
        overlayOpacity,
        accentColor,
      },
      dropDate,
      marqueeTexts: marqueeTextsText.split(",").map((s) => s.trim()).filter((s) => s.length > 0),
      products: productsState,
    };

    try {
      await onUpdateCMS(updated);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      alert("Error saving CMS schemas: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (confirm("Restore archival original Streto defaults? This will revert all draft modifications.")) {
      try {
        await onResetCMS();
        // Reset local variables
        setHeroHeading(cmsData.hero.heading);
        setHeroSubheading(cmsData.hero.subheading);
        setHeroCta(cmsData.hero.ctaText);
        setOverlayOpacity(cmsData.hero.overlayOpacity);
        setAccentColor(cmsData.hero.accentColor);
        setDropDate(cmsData.dropDate);
        setMarqueeTextsText(cmsData.marqueeTexts.join(", "));
        setProductsState(cmsData.products);
        
        onClose();
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex justify-start">
      <div className="w-full max-w-2xl bg-[#090909] border-r border-[#151515] flex flex-col h-full shadow-[0_0_60px_rgba(0,0,0,0.9)] text-[#FAFAFA]">
        
        {/* Panel Header */}
        <div className="p-6 border-b border-[#1A1A1A] flex items-center justify-between bg-[#0C0C0C]">
          <div className="flex items-center gap-2.5">
            <Sliders className="w-5 h-5 text-[#DF2D2D]" />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xs font-mono font-bold uppercase tracking-[0.25em] text-white">S A N I T Y _ C M S _ B L U E P R I N T </h2>
                <span className="text-[8px] bg-green-500/10 text-green-400 px-1.5 py-0.5 rounded font-mono border border-green-500/25">SCHEMA_LIVE</span>
              </div>
              <p className="text-[9px] font-mono text-gray-500 uppercase tracking-widest mt-0.5">HEADLESS CONTENT LAKE FOR STRETO CULTURE</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-900 rounded-md text-gray-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* CMS Editor Workspace */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          
          <div className="p-4 bg-yellow-500/5 border border-yellow-500/10 rounded font-mono text-[10px] text-yellow-300/80 leading-relaxed uppercase">
            ⚠️ Headless simulation: Altering these fields modifies in-memory states on our Express database. Watch the main brand front-end refresh and adopt these changes instantly upon saving.
          </div>

          {/* Section A: Hero Campaign */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-mono text-[#DF2D2D] tracking-widest uppercase border-b border-gray-900 pb-2">[SCHEMA] HERO_BANNER_SECTION</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[9px] font-mono text-gray-500 uppercase">Heading Title</label>
                <input
                  type="text"
                  value={heroHeading}
                  onChange={(e) => setHeroHeading(e.target.value)}
                  className="w-full bg-[#050505] border border-gray-950 p-2.5 rounded text-xs text-white font-mono outline-none focus:border-neutral-800"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-mono text-gray-500 uppercase">Subheading Vol.</label>
                <input
                  type="text"
                  value={heroSubheading}
                  onChange={(e) => setHeroSubheading(e.target.value)}
                  className="w-full bg-[#050505] border border-gray-950 p-2.5 rounded text-xs text-white font-mono outline-none focus:border-neutral-800"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-mono text-gray-500 uppercase">CTA Button Text</label>
                <input
                  type="text"
                  value={heroCta}
                  onChange={(e) => setHeroCta(e.target.value)}
                  className="w-full bg-[#050505] border border-gray-950 p-2.5 rounded text-xs text-white font-mono outline-none focus:border-neutral-800"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-mono text-gray-500 uppercase">Drop Accent Color Hex</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="w-10 h-8 bg-transparent border border-gray-950 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="flex-1 bg-[#050505] border border-gray-950 p-1.5 rounded text-xs text-white font-mono outline-none text-center"
                  />
                </div>
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-[9px] font-mono text-gray-500 uppercase">Banner Overlay Opacity ({overlayOpacity}%)</label>
                <input
                  type="range"
                  min="10"
                  max="90"
                  value={overlayOpacity}
                  onChange={(e) => setOverlayOpacity(Number(e.target.value))}
                  className="w-full accent-[#DF2D2D] bg-[#050505] p-2"
                />
              </div>
            </div>
          </div>

          {/* Section B: Drop Chronometer Date */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-mono text-[#DF2D2D] tracking-widest uppercase border-b border-gray-900 pb-2">[SCHEMA] DROP_COUNTDOWN_RELEASE</h3>
            <div className="space-y-1">
              <label className="text-[9px] font-mono text-gray-500 uppercase">Target Release Date & Hour (ISO 8601 Format)</label>
              <input
                type="text"
                value={dropDate}
                onChange={(e) => setDropDate(e.target.value)}
                placeholder="2026-07-10T18:00:00.000Z"
                className="w-full bg-[#050505] border border-gray-950 p-2.5 rounded text-xs text-white font-mono outline-none focus:border-neutral-800"
              />
              <span className="text-[8px] text-gray-600 font-mono tracking-wide uppercase">
                Must map to standard date alignments. Current setting triggers real-time countdown updates in-store.
              </span>
            </div>
          </div>

          {/* Section C: Rotating Slogan Marquees */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-mono text-[#DF2D2D] tracking-widest uppercase border-b border-gray-900 pb-2">[SCHEMA] DYNAMIC_MARQUEE_DATA</h3>
            <div className="space-y-1">
              <label className="text-[9px] font-mono text-gray-500 uppercase">Ticker Phrases (Comma Separated)</label>
              <textarea
                value={marqueeTextsText}
                onChange={(e) => setMarqueeTextsText(e.target.value)}
                rows={2}
                className="w-full bg-[#050505] border border-gray-950 p-2.5 rounded text-xs text-white font-mono outline-none focus:border-neutral-800 resize-none uppercase"
              />
            </div>
          </div>

          {/* Section D: Direct Pricing CMS Control */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-mono text-[#DF2D2D] tracking-widest uppercase border-b border-gray-900 pb-2">[SCHEMA] GARMENT_CATALOG_SCHEMAS</h3>
            
            <div className="space-y-4">
              {productsState.map((prod) => (
                <div key={prod.id} className="p-3 bg-neutral-950 rounded border border-neutral-900 grid grid-cols-1 sm:grid-cols-4 gap-3 align-middle items-center">
                  <div className="col-span-1 sm:col-span-2 flex items-center gap-2.5">
                    <img src={prod.primaryImage} alt="" className="w-8 h-10 object-cover rounded bg-neutral-900 flex-shrink-0" />
                    <div>
                      <span className="text-[8px] text-gray-500 font-mono block uppercase">{prod.id}</span>
                      <h4 className="text-[11px] font-display font-medium text-white truncate w-40">{prod.name}</h4>
                    </div>
                  </div>
                  
                  <div className="space-y-0.5">
                    <label className="text-[8px] font-mono text-gray-600 uppercase">Base Price</label>
                    <input
                      type="number"
                      value={prod.price}
                      onChange={(e) => handleProductPriceChange(prod.id, Number(e.target.value))}
                      className="w-full bg-[#050505] p-1 border border-neutral-900 rounded text-xs text-white font-mono"
                    />
                  </div>

                  <div className="space-y-0.5">
                    <label className="text-[8px] font-mono text-gray-600 uppercase">Sale (Optional)</label>
                    <input
                      type="text"
                      value={prod.salePrice ?? ""}
                      onChange={(e) => handleProductSalePriceChange(prod.id, e.target.value)}
                      placeholder="No Sale"
                      className="w-full bg-[#050505] p-1 border border-neutral-900 rounded text-xs text-white font-mono"
                    />
                  </div>
                  
                  <div className="col-span-1 sm:col-span-4 space-y-0.5">
                    <label className="text-[8px] font-mono text-gray-600 uppercase">Status Badge text</label>
                    <input
                      type="text"
                      value={prod.badge ?? ""}
                      onChange={(e) => handleProductBadgeChange(prod.id, e.target.value)}
                      placeholder="e.g. LIMITED DROP"
                      className="w-full bg-[#050505] p-1.5 border border-neutral-900 rounded text-xs text-white font-mono uppercase"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Actions panel */}
        <div className="p-6 border-t border-neutral-900 bg-[#0C0C0C] flex gap-3">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs font-mono text-gray-400 hover:text-white px-4 border border-neutral-800 rounded bg-[#111] hover:bg-[#151515] transition shrink-0 cursor-pointer"
            title="Reset to core blueprint values"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>RESET</span>
          </button>

          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 bg-white hover:bg-neutral-200 text-black font-mono font-medium py-3 rounded text-xs tracking-widest uppercase transition flex items-center justify-center gap-2 cursor-pointer"
          >
            {saving ? (
              <span className="animate-spin h-3.5 w-3.5 border-2 border-black border-t-transparent rounded-full" />
            ) : success ? (
              <>
                <Check className="w-4 h-4 text-green-600" />
                <span className="text-green-600 font-bold">SCHEMAS_PUBLISHED</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4 text-[#DF2D2D]" />
                <span>PUBLISH_SCHEMAS</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
