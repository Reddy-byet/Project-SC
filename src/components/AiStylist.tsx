import { useState } from "react";
import { Sparkles, X, CornerDownRight, RefreshCw, Send, Check } from "lucide-react";
import { Product, StylingSuggestion } from "../types";

interface AiStylistProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  accentColor: string;
}

export default function AiStylist({ isOpen, onClose, products, accentColor }: AiStylistProps) {
  const [selectedItems, setSelectedItems] = useState<Product[]>([]);
  const [vibe, setVibe] = useState("Brutalist Solitude (Heavy, Layered, Monochromatic)");
  const [customQuery, setCustomQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<StylingSuggestion | null>({
    conceptName: "BRUTALIST ARCHITECTURAL LAYERING",
    editorialVibeDescription: "A cold-ambient architectural formulation focusing on raw fleece textures stacked atop geometric structural nylon lines. Engineered to resist environmental distractions.",
    layeringDirectives: [
      "Layer the Boxy Hoody under a heavy industrial longcoat, allowing cuffs to compress at the wrist.",
      "Balance the heavy 450GSM upper-body structure with tapered Slate Tactical Cargo trousers to establish fluid vertical proportion.",
      "Conclude with the tension matte premium silver balaclava and heavy boots to secure structural closure."
    ],
    accessoriesMatching: "Metallic structured chunky necklaces, raw titanium clasps, and polished charcoal boots.",
    designerQuote: "Don’t tell me how to dress, tell them not to judge. True comfort is built on proportional alignment."
  });
  const [errorString, setErrorString] = useState("");

  const vibeOptions = [
    "Brutalist Solitude (Heavy, Layered, Monochromatic)",
    "Cyberpunk Off-Grid (Tactical, Breathable, Dark Arc-tech)",
    "High-End Minimalist Runway (Elevated Drapes, Off-white Contrast)",
    "Distorted Nostalgia (Distressed elements, 90s vintage structure)",
  ];

  const handleSelectItem = (prod: Product) => {
    if (selectedItems.some((item) => item.id === prod.id)) {
      setSelectedItems(selectedItems.filter((item) => item.id !== prod.id));
    } else {
      setSelectedItems([...selectedItems, prod]);
    }
  };

  const selectAll = () => {
    setSelectedItems(products);
  };

  const deselectAll = () => {
    setSelectedItems([]);
  };

  const getStylingAdvice = async () => {
    setLoading(true);
    setErrorString("");
    setSuggestion(null);

    try {
      const response = await fetch("/api/gemini/style", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: selectedItems,
          vibe,
          customQuery,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setSuggestion(data);
      } else {
        setErrorString(data.message || "Failed to contact Gemini Stylist. Verify credentials.");
      }
    } catch (err: any) {
      setErrorString("Network connection interrupted. Confirm development server status.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex justify-end">
      <div className="w-full max-w-2xl bg-[#080808] border-l border-neutral-900 flex flex-col h-full shadow-[0_0_60px_rgba(0,0,0,0.9)] text-[#FAFAFA]">
        
        {/* Sidebar Header */}
        <div className="p-6 border-b border-neutral-900 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#DF2D2D]/10 flex items-center justify-center border border-[#DF2D2D]/30 shadow-[0_0_12px_rgba(223,45,45,0.15)]">
              <Sparkles className="w-4 h-4 text-[#DF2D2D]" />
            </div>
            <div>
              <h2 className="text-sm font-display font-medium uppercase tracking-[0.2em] text-white">STRETO_LAB_STYLIST</h2>
              <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mt-0.5">HEADLESS AI WARDROBE ADVISOR</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-900 rounded-md text-gray-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Workspace Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          
          {/* Step 1: Select items to combine */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-mono tracking-widest text-[#DF2D2D] uppercase">[01] SELECT TARGET SILHOUETTES</label>
              <div className="flex gap-2">
                <button
                  onClick={selectAll}
                  className="text-[9px] font-mono text-gray-400 hover:text-white"
                >
                  SELECT_ALL
                </button>
                <span className="text-gray-700 font-mono text-[9px]">|</span>
                <button
                  onClick={deselectAll}
                  className="text-[9px] font-mono text-gray-400 hover:text-white"
                >
                  CLEAR
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {products.map((p) => {
                const isSelected = selectedItems.some((item) => item.id === p.id);
                return (
                  <div
                    key={p.id}
                    onClick={() => handleSelectItem(p)}
                    className={`p-3 rounded border text-left cursor-pointer transition select-none flex gap-3 items-center ${
                      isSelected
                        ? "border-[#DF2D2D] bg-[#DF2D2D]/5"
                        : "border-neutral-900 bg-neutral-950 hover:border-neutral-800"
                    }`}
                  >
                    <div className="w-8 h-10 object-cover bg-neutral-900 rounded overflow-hidden flex-shrink-0">
                      <img src={p.primaryImage} alt={p.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[9px] font-mono text-gray-500 block uppercase">{p.category}</span>
                      <h4 className="text-[11px] font-display font-medium text-white tracking-wide truncate">{p.name}</h4>
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 text-[#DF2D2D] flex-shrink-0" />}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step 2: Vibe Profile Select */}
          <div className="space-y-3">
            <label className="text-[10px] font-mono tracking-widest text-[#DF2D2D] uppercase">[02] ESTABLISH VIBE PROFILE</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {vibeOptions.map((opt) => (
                <button
                  key={opt}
                  onClick={() => setVibe(opt)}
                  className={`p-3 text-left border text-xs font-mono rounded transition cursor-pointer ${
                    vibe === opt
                      ? "border-white bg-[#111] text-white"
                      : "border-neutral-900 bg-neutral-950 text-gray-400 hover:border-neutral-800"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Step 3: Query Overrides */}
          <div className="space-y-3">
            <label className="text-[10px] font-mono tracking-widest text-[#DF2D2D] uppercase">[03] SYSTEM PARAMETER CONSTRICTOR (OPTIONAL)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="E.g., style for cold Tokyo weather, recommend chunky combat boots..."
                value={customQuery}
                onChange={(e) => setCustomQuery(e.target.value)}
                className="w-full bg-[#0F0F0F] border border-neutral-900 focus:border-gray-700 text-white rounded p-3 text-xs font-mono pr-12 outline-none uppercase tracking-wide"
              />
              <button
                onClick={getStylingAdvice}
                disabled={loading}
                className="absolute right-2 top-2 p-1.5 bg-[#DF2D2D] hover:bg-[#C92222] rounded text-white transition disabled:bg-neutral-800 cursor-pointer"
                title="Send instruction"
              >
                {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Advice Output Panel */}
          <div className="pt-4 border-t border-neutral-900">
            {loading ? (
              <div className="py-12 flex flex-col items-center justify-center text-center font-mono">
                <RefreshCw className="w-8 h-8 text-[#DF2D2D] animate-spin mb-4" />
                <span className="text-[11px] text-gray-400 tracking-[0.25em] animate-pulse uppercase">
                  RECONCILING SILHOUETTE ALIGNMENTS...
                </span>
                <span className="text-[8px] text-gray-600 uppercase mt-2">
                  Querying Gemini model server-side
                </span>
              </div>
            ) : errorString ? (
              <div className="p-4 bg-red-950/20 border border-red-900 rounded text-red-400 font-mono text-[11px] space-y-2">
                <p className="font-bold uppercase">STYLING_ENGINE_ALERT</p>
                <p>{errorString}</p>
                <div className="pt-2">
                  <button
                    onClick={getStylingAdvice}
                    className="px-3 py-1 bg-[#222] hover:bg-[#333] border border-red-900 rounded text-[9px] text-white cursor-pointer"
                  >
                    RETRY_CONNECTION
                  </button>
                </div>
              </div>
            ) : suggestion ? (
              <div className="space-y-6">
                
                {/* Concept Title banner */}
                <div className="p-4 bg-neutral-950 border border-neutral-900 rounded-lg relative overflow-hidden select-none">
                  <div className="absolute right-0 top-0 text-[50px] font-display font-black text-white/[0.02] tracking-wider translate-x-4 -translate-y-4">
                    STRETO
                  </div>
                  <span className="text-[9px] font-mono text-[#DF2D2D] bg-[#DF2D2D]/10 px-1.5 py-0.5 rounded tracking-widest uppercase">
                    EDITORIAL RECOMMENDATION
                  </span>
                  <h3 className="font-display font-medium text-lg text-white tracking-widest uppercase mt-3">
                    {suggestion.conceptName}
                  </h3>
                  <p className="text-[11px] text-gray-400 italic font-mono mt-2 leading-relaxed">
                    “{suggestion.editorialVibeDescription}”
                  </p>
                </div>

                {/* Layering instructions */}
                <div className="space-y-3.5">
                  <h4 className="text-[10px] font-mono text-gray-400 tracking-wider uppercase">LAYERING & STRUCTURAL DIRECTIVES</h4>
                  <div className="space-y-2.5">
                    {suggestion.layeringDirectives.map((cmd, i) => (
                      <div key={i} className="flex gap-3 text-xs bg-neutral-950/40 p-3 rounded border border-neutral-900/60 leading-relaxed text-gray-300">
                        <CornerDownRight className="w-4 h-4 text-[#DF2D2D] shrink-0 mt-0.5" />
                        <span>{cmd}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footwear & silver wear suggestions */}
                <div className="p-4 bg-neutral-950 border border-neutral-900 rounded-md">
                  <h4 className="text-[10px] font-mono text-[#DF2D2D] tracking-widest uppercase mb-1">ACCESSORIES INTEGRITY RECOMMENDATIONS</h4>
                  <p className="text-xs font-sans font-normal text-gray-400 leading-relaxed">
                    {suggestion.accessoriesMatching}
                  </p>
                </div>

                {/* High end quote */}
                {suggestion.designerQuote && (
                  <div className="p-5 border-l-2 border-[#DF2D2D] bg-neutral-950/20 italic text-[11px] text-gray-400 leading-relaxed font-mono">
                    "{suggestion.designerQuote}"
                  </div>
                )}

              </div>
            ) : (
              <div className="text-center py-12 font-mono text-xs text-gray-500">
                SELECT GARMENTS AND HIT "SEND" TO RECRUIT AI COUTURÉ SUGGESTIONS
              </div>
            )}
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-neutral-900 bg-[#050505] flex gap-3">
          <button
            onClick={getStylingAdvice}
            disabled={loading}
            className="flex-1 bg-white hover:bg-gray-100 text-black py-3 rounded text-xs font-bold tracking-widest transition uppercase flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4 text-[#DF2D2D]" />
            <span>FABRICATE_STYLING</span>
          </button>
        </div>

      </div>
    </div>
  );
}
