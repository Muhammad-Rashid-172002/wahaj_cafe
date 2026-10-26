/**
 * Wahaj Cafe — The Pizza Lab
 * AI Food Visual Studio & Motion Generator
 * 
 * Implements:
 * 1. Image generation with gemini-nano-banana-2.1
 * 2. Image editing with gemini-nano-banana-2.1
 * 3. Video animation with gemini-omni-1.1-flash via Interactions API (16:9 or 9:16)
 */

import React, { useState } from "react";
import {
  X,
  Wand2,
  Image as ImageIcon,
  Film,
  Sparkles,
  Download,
  Upload,
  RefreshCw,
  AlertCircle,
  Play,
  SlidersHorizontal,
  Flame
} from "lucide-react";

interface AiVisualStudioProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AiVisualStudio: React.FC<AiVisualStudioProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<"generate" | "edit" | "animate">("generate");

  // Generate Image State
  const [genPrompt, setGenPrompt] = useState(
    "Gourmet Crown Crust Pizza for Wahaj Cafe, scalloped crust filled with seekh kababs, golden mozzarella stretch, red paprika, dark burgundy background"
  );
  const [genAspectRatio, setGenAspectRatio] = useState<"1:1" | "16:9" | "4:3" | "9:16">("1:1");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [genError, setGenError] = useState<string | null>(null);

  // Edit Image State
  const [editPrompt, setEditPrompt] = useState("Add steam rising and extra bubbling mozzarella cheese pull");
  const [editSourceImage, setEditSourceImage] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [editError, setEditError] = useState<string | null>(null);

  // Animate Video State (gemini-omni-1.1-flash)
  const [videoSourceImage, setVideoSourceImage] = useState<string | null>(null);
  const [videoPrompt, setVideoPrompt] = useState(
    "Cinematic slow-motion food commercial of this pizza, appetizing cheese stretch, gentle steam rising, warm luxury restaurant lighting"
  );
  const [videoAspectRatio, setVideoAspectRatio] = useState<"16:9" | "9:16">("16:9");
  const [isAnimating, setIsAnimating] = useState(false);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  const [videoError, setVideoError] = useState<string | null>(null);

  if (!isOpen) return null;

  // Handle Generate
  const handleGenerateImage = async () => {
    if (!genPrompt.trim()) return;
    setIsGenerating(true);
    setGenError(null);
    try {
      const res = await fetch("/api/gemini/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: genPrompt,
          aspectRatio: genAspectRatio
        })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to generate image");
      }
      setGeneratedImage(data.imageUrl);
    } catch (err: any) {
      setGenError(err.message || "Image generation failed");
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle Edit
  const handleEditImage = async () => {
    if (!editSourceImage || !editPrompt.trim()) return;
    setIsEditing(true);
    setEditError(null);
    try {
      const res = await fetch("/api/gemini/edit-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: editSourceImage,
          prompt: editPrompt
        })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to edit image");
      }
      setEditedImage(data.imageUrl);
    } catch (err: any) {
      setEditError(err.message || "Image editing failed");
    } finally {
      setIsEditing(false);
    }
  };

  // Handle Animate Video with gemini-omni-1.1-flash
  const handleAnimateVideo = async () => {
    if (!videoSourceImage) return;
    setIsAnimating(true);
    setVideoError(null);
    try {
      const res = await fetch("/api/gemini/animate-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: videoSourceImage,
          prompt: videoPrompt,
          aspectRatio: videoAspectRatio
        })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to animate video");
      }
      setGeneratedVideoUrl(data.videoUrl);
    } catch (err: any) {
      setVideoError(err.message || "Video generation failed");
    } finally {
      setIsAnimating(false);
    }
  };

  // Upload helper for edit / video source
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, target: "edit" | "video") => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (target === "edit") {
        setEditSourceImage(result);
      } else {
        setVideoSourceImage(result);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-4xl rounded-3xl bg-[#1A060A] border border-[#D4AF66]/40 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-[#140507]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#500B19] to-[#26070D] border border-[#D4AF66]/50 flex items-center justify-center text-[#D4AF66]">
              <Wand2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#D4AF66] tracking-widest uppercase">
                  Wahaj Cafe Pizza Lab
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#500B19] text-[#F3D99B] border border-[#D4AF66]/30">
                  Gemini AI Powered
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-[#FFF4DF] font-heading">
                AI FOOD VISUAL STUDIO
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close AI Studio"
            className="p-2 rounded-xl bg-[#10090B] hover:bg-[#500B19] text-[#FFF4DF] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 pt-4 border-b border-white/10 flex gap-2 overflow-x-auto bg-[#10090B]">
          <button
            onClick={() => setActiveTab("generate")}
            className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === "generate"
                ? "border-[#D4AF66] text-[#F3D99B]"
                : "border-transparent text-[#FFF4DF]/60 hover:text-[#FFF4DF]"
            }`}
          >
            <ImageIcon className="w-4 h-4 text-[#D4AF66]" />
            <span>Generate Food Visual (nano-banana-2.1)</span>
          </button>

          <button
            onClick={() => setActiveTab("edit")}
            className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === "edit"
                ? "border-[#D4AF66] text-[#F3D99B]"
                : "border-transparent text-[#FFF4DF]/60 hover:text-[#FFF4DF]"
            }`}
          >
            <SlidersHorizontal className="w-4 h-4 text-[#D4AF66]" />
            <span>Edit Food Photo</span>
          </button>

          <button
            onClick={() => setActiveTab("animate")}
            className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === "animate"
                ? "border-[#D4AF66] text-[#F3D99B]"
                : "border-transparent text-[#FFF4DF]/60 hover:text-[#FFF4DF]"
            }`}
          >
            <Film className="w-4 h-4 text-[#D4AF66]" />
            <span>Animate to Video (omni-1.1-flash)</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1">
          {/* TAB 1: GENERATE IMAGE */}
          {activeTab === "generate" && (
            <div className="space-y-6">
              <div>
                <label className="text-xs font-bold text-[#D4AF66] uppercase tracking-wider block mb-2">
                  Describe the Dish to Create
                </label>
                <textarea
                  rows={3}
                  value={genPrompt}
                  onChange={(e) => setGenPrompt(e.target.value)}
                  placeholder="e.g. Luxurious Crown Crust Pizza with melted mozzarella, charred blistered crust, herb sprinkle, dark restaurant setting"
                  className="w-full p-4 rounded-2xl bg-[#10090B] border border-[#D4AF66]/30 text-sm text-[#FFF4DF] focus:outline-none focus:border-[#D4AF66]"
                />
              </div>

              {/* Quick Prompts */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] text-[#FFF4DF]/50">Quick ideas:</span>
                {[
                  "Crown Crust Pizza with meat stuffing & gold cheese",
                  "Lava Jalapeno Burger bursting with melted cheddar",
                  "Mint Margarita glass frosted with crushed mint & ice",
                  "Pizza Loaded Fries with mozzarella & pepperoni"
                ].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setGenPrompt(s)}
                    className="px-2.5 py-1 rounded-lg bg-[#26070D] border border-white/10 text-[11px] text-[#FFF4DF]/80 hover:text-[#D4AF66] cursor-pointer"
                  >
                    {s}
                  </button>
                ))}
              </div>

              {/* Aspect Ratio */}
              <div>
                <label className="text-xs font-bold text-[#D4AF66] uppercase tracking-wider block mb-2">
                  Aspect Ratio
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(["1:1", "16:9", "4:3", "9:16"] as const).map((ratio) => (
                    <button
                      key={ratio}
                      type="button"
                      onClick={() => setGenAspectRatio(ratio)}
                      className={`py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                        genAspectRatio === ratio
                          ? "bg-[#D4AF66] text-[#10090B] border-[#D4AF66]"
                          : "bg-[#10090B] border-white/10 text-[#FFF4DF]/70 hover:border-[#D4AF66]/40"
                      }`}
                    >
                      {ratio}
                    </button>
                  ))}
                </div>
              </div>

              {genError && (
                <div className="p-4 rounded-2xl bg-rose-950/50 border border-rose-500/40 text-xs text-rose-200 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{genError}</span>
                </div>
              )}

              <button
                type="button"
                disabled={isGenerating}
                onClick={handleGenerateImage}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#D4AF66] to-[#F3D99B] text-[#10090B] font-extrabold text-sm tracking-wide shadow-xl flex items-center justify-center gap-2 hover:opacity-95 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Cooking AI Visual with gemini-nano-banana-2.1...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4" />
                    <span>Generate Food Image</span>
                  </>
                )}
              </button>

              {/* Preview Generated Result */}
              {generatedImage && (
                <div className="p-4 rounded-3xl bg-[#10090B] border border-[#D4AF66]/40 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#D4AF66] uppercase">Generated Food Visual</span>
                    <div className="flex gap-2">
                      <a
                        href={generatedImage}
                        download="wahaj-cafe-food-visual.png"
                        className="p-2 rounded-xl bg-[#26070D] hover:bg-[#500B19] text-[#FFF4DF] text-xs flex items-center gap-1"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download</span>
                      </a>
                      <button
                        onClick={() => {
                          setVideoSourceImage(generatedImage);
                          setActiveTab("animate");
                        }}
                        className="px-3 py-1.5 rounded-xl bg-[#500B19] border border-[#D4AF66]/40 text-[#F3D99B] text-xs font-semibold flex items-center gap-1"
                      >
                        <Film className="w-3.5 h-3.5" />
                        <span>Animate into Video</span>
                      </button>
                    </div>
                  </div>
                  <div className="relative rounded-2xl overflow-hidden max-h-96 flex items-center justify-center bg-black">
                    <img src={generatedImage} alt="AI Generated Food" className="max-h-96 object-contain" />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: EDIT IMAGE */}
          {activeTab === "edit" && (
            <div className="space-y-6">
              <div>
                <label className="text-xs font-bold text-[#D4AF66] uppercase tracking-wider block mb-2">
                  1. Select or Upload Image to Edit
                </label>
                <div className="flex flex-wrap items-center gap-3">
                  <label className="px-4 py-3 rounded-2xl bg-[#26070D] border border-[#D4AF66]/40 text-xs text-[#F3D99B] font-semibold flex items-center gap-2 cursor-pointer hover:bg-[#500B19] transition-colors">
                    <Upload className="w-4 h-4" />
                    <span>Upload Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, "edit")}
                      className="hidden"
                    />
                  </label>
                  {generatedImage && (
                    <button
                      type="button"
                      onClick={() => setEditSourceImage(generatedImage)}
                      className="px-4 py-3 rounded-2xl bg-[#10090B] border border-white/10 text-xs text-[#FFF4DF] hover:border-[#D4AF66]/40"
                    >
                      Use Recent Generated Image
                    </button>
                  )}
                </div>

                {editSourceImage && (
                  <div className="mt-3 relative w-32 h-32 rounded-xl overflow-hidden border border-[#D4AF66]/30">
                    <img src={editSourceImage} alt="Source" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div>
                <label className="text-xs font-bold text-[#D4AF66] uppercase tracking-wider block mb-2">
                  2. Edit Instruction Prompt
                </label>
                <input
                  type="text"
                  value={editPrompt}
                  onChange={(e) => setEditPrompt(e.target.value)}
                  placeholder="e.g. Add extra melted cheese strings and a fresh basil leaf on top"
                  className="w-full p-4 rounded-2xl bg-[#10090B] border border-[#D4AF66]/30 text-sm text-[#FFF4DF] focus:outline-none focus:border-[#D4AF66]"
                />
              </div>

              {editError && (
                <div className="p-4 rounded-2xl bg-rose-950/50 border border-rose-500/40 text-xs text-rose-200 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{editError}</span>
                </div>
              )}

              <button
                type="button"
                disabled={isEditing || !editSourceImage}
                onClick={handleEditImage}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#D4AF66] to-[#F3D99B] text-[#10090B] font-extrabold text-sm tracking-wide shadow-xl flex items-center justify-center gap-2 hover:opacity-95 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50"
              >
                {isEditing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Applying Edits with Gemini...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4" />
                    <span>Apply Image Edits</span>
                  </>
                )}
              </button>

              {editedImage && (
                <div className="p-4 rounded-3xl bg-[#10090B] border border-[#D4AF66]/40 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#D4AF66] uppercase">Edited Image Result</span>
                    <a
                      href={editedImage}
                      download="wahaj-cafe-edited-food.png"
                      className="p-2 rounded-xl bg-[#26070D] hover:bg-[#500B19] text-[#FFF4DF] text-xs flex items-center gap-1"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </a>
                  </div>
                  <div className="relative rounded-2xl overflow-hidden max-h-96 flex items-center justify-center bg-black">
                    <img src={editedImage} alt="AI Edited Food" className="max-h-96 object-contain" />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: ANIMATE PHOTO TO VIDEO (gemini-omni-1.1-flash) */}
          {activeTab === "animate" && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-[#500B19]/40 border border-[#D4AF66]/30 text-xs text-[#FFF4DF]/90 space-y-1">
                <div className="font-bold text-[#F3D99B] flex items-center gap-1.5">
                  <Film className="w-4 h-4 text-[#D4AF66]" />
                  <span>Powered by gemini-omni-1.1-flash (Interactions API)</span>
                </div>
                <p>
                  Upload any food photograph to create a cinematic slow-motion video commercial featuring appetizing cheese stretches, gentle steam, and dynamic restaurant lighting.
                </p>
              </div>

              <div>
                <label className="text-xs font-bold text-[#D4AF66] uppercase tracking-wider block mb-2">
                  1. Select Photo to Animate
                </label>
                <div className="flex flex-wrap items-center gap-3">
                  <label className="px-4 py-3 rounded-2xl bg-[#26070D] border border-[#D4AF66]/40 text-xs text-[#F3D99B] font-semibold flex items-center gap-2 cursor-pointer hover:bg-[#500B19] transition-colors">
                    <Upload className="w-4 h-4" />
                    <span>Upload Dish Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, "video")}
                      className="hidden"
                    />
                  </label>
                  {generatedImage && (
                    <button
                      type="button"
                      onClick={() => setVideoSourceImage(generatedImage)}
                      className="px-4 py-3 rounded-2xl bg-[#10090B] border border-white/10 text-xs text-[#FFF4DF] hover:border-[#D4AF66]/40"
                    >
                      Use Studio Generated Image
                    </button>
                  )}
                </div>

                {videoSourceImage && (
                  <div className="mt-3 relative w-40 h-32 rounded-xl overflow-hidden border border-[#D4AF66]/40">
                    <img src={videoSourceImage} alt="Video source" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              {/* Video Aspect Ratio Requirement: 16:9 or 9:16 */}
              <div>
                <label className="text-xs font-bold text-[#D4AF66] uppercase tracking-wider block mb-2">
                  Video Aspect Ratio (Required 16:9 or 9:16)
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setVideoAspectRatio("16:9")}
                    className={`py-3 rounded-2xl text-xs font-bold border transition-all cursor-pointer ${
                      videoAspectRatio === "16:9"
                        ? "bg-[#D4AF66] text-[#10090B] border-[#D4AF66]"
                        : "bg-[#10090B] border-white/10 text-[#FFF4DF]/70 hover:border-[#D4AF66]/40"
                    }`}
                  >
                    16:9 (Landscape Commercial)
                  </button>
                  <button
                    type="button"
                    onClick={() => setVideoAspectRatio("9:16")}
                    className={`py-3 rounded-2xl text-xs font-bold border transition-all cursor-pointer ${
                      videoAspectRatio === "9:16"
                        ? "bg-[#D4AF66] text-[#10090B] border-[#D4AF66]"
                        : "bg-[#10090B] border-white/10 text-[#FFF4DF]/70 hover:border-[#D4AF66]/40"
                    }`}
                  >
                    9:16 (Portrait Story / Reel)
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#D4AF66] uppercase tracking-wider block mb-2">
                  Motion & Camera Direction Prompt
                </label>
                <textarea
                  rows={2}
                  value={videoPrompt}
                  onChange={(e) => setVideoPrompt(e.target.value)}
                  className="w-full p-4 rounded-2xl bg-[#10090B] border border-[#D4AF66]/30 text-sm text-[#FFF4DF] focus:outline-none focus:border-[#D4AF66]"
                />
              </div>

              {videoError && (
                <div className="p-4 rounded-2xl bg-rose-950/50 border border-rose-500/40 text-xs text-rose-200 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{videoError}</span>
                </div>
              )}

              <button
                type="button"
                disabled={isAnimating || !videoSourceImage}
                onClick={handleAnimateVideo}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#D4AF66] to-[#F3D99B] text-[#10090B] font-extrabold text-sm tracking-wide shadow-xl flex items-center justify-center gap-2 hover:opacity-95 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50"
              >
                {isAnimating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Synthesizing Video with gemini-omni-1.1-flash (may take ~30-60s)...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-[#10090B]" />
                    <span>Generate Video with gemini-omni-1.1-flash</span>
                  </>
                )}
              </button>

              {generatedVideoUrl && (
                <div className="p-4 rounded-3xl bg-[#10090B] border border-[#D4AF66]/40 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#D4AF66] uppercase">Generated Food Commercial Video</span>
                    <a
                      href={generatedVideoUrl}
                      download="wahaj-cafe-food-video.mp4"
                      className="p-2 rounded-xl bg-[#26070D] hover:bg-[#500B19] text-[#FFF4DF] text-xs flex items-center gap-1"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Video</span>
                    </a>
                  </div>
                  <div className="relative rounded-2xl overflow-hidden max-h-[450px] flex items-center justify-center bg-black">
                    <video
                      src={generatedVideoUrl}
                      controls
                      autoPlay
                      loop
                      className="max-h-[450px] w-auto rounded-xl shadow-2xl"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
