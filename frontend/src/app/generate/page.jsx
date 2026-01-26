"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ImageCard from "../../components/Card/ImageCard";
import { generateImages } from "../../modules/image/services/image.api";
import "@/styles/design/generate.form.css";

export default function GeneratePage() {
  const router = useRouter();

  // 🔐 AUTH GUARD
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/auth");
    }
  }, [router]);

  // 📦 STATE
  const [category, setCategory] = useState("");
  const [file, setFile] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState("shipping"); // shipping | rank | pir

  // 🚀 GENERATE
  const handleGenerate = async () => {
    if (!category || !file) {
      alert("Category and image are required");
      return;
    }

    const formData = new FormData();
    formData.append("category", category);
    formData.append("image", file);

    setLoading(true);
    try {
      const result = await generateImages(formData);
      setData(result);
    } catch (err) {
      alert(err?.response?.data?.error || "Failed to generate images");
    } finally {
      setLoading(false);
    }
  };

  // ⛔ EMPTY STATE
  if (!data || !data.variants?.length) {
    return (
      <main className="generate-container">
        <h1 className="generate-title">Low Shipping Image Optimizer</h1>

        <div className="generate-form">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Select Category</option>
            <option value="tshirt">T-Shirt</option>
            <option value="dress">Dress</option>
            <option value="footwear">Footwear</option>
            <option value="home">Home / Kitchen</option>
          </select>

          <input
            type="file"
            accept="image/jpeg"
            onChange={(e) => setFile(e.target.files[0])}
          />

          <button onClick={handleGenerate} disabled={loading}>
            {loading ? "Optimizing…" : "Generate"}
          </button>
        </div>
      </main>
    );
  }

  // 🔁 SORTING (SAFE)
  const sortedVariants = [...data.variants].sort((a, b) => {
    if (sortBy === "shipping")
      return (a.estimatedShipping ?? 999) - (b.estimatedShipping ?? 999);
    if (sortBy === "rank") return (a.rank ?? 0) - (b.rank ?? 0);
    if (sortBy === "pir") return (a.pir ?? 1) - (b.pir ?? 1);
    return 0;
  });

  // 📊 STATS
  const prices = data.variants.map((v) => v.estimatedShipping ?? 0);
  const lowestShipping = Math.min(...prices);
  const avgShipping = Math.round(
    prices.reduce((s, v) => s + v, 0) / prices.length,
  );

  return (
    <main style={{ padding: 24, maxWidth: 1400, margin: "0 auto" }}>
      {/* SUMMARY */}
      <div
        style={{
          background: "linear-gradient(135deg, #10b981, #22c55e)",
          color: "#fff",
          padding: 24,
          borderRadius: 12,
          marginBottom: 24,
        }}
      >
        <h2>🎯 Shipping Optimization Results</h2>
        <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
          <div>
            <div style={{ fontSize: 28, fontWeight: "bold" }}>
              ₹{lowestShipping}
            </div>
            <div>Lowest Shipping</div>
          </div>
          <div>
            <div style={{ fontSize: 28, fontWeight: "bold" }}>
              ₹{avgShipping}
            </div>
            <div>Average Shipping</div>
          </div>
          <div>
            <div style={{ fontSize: 28, fontWeight: "bold" }}>
              {data.variants.length}
            </div>
            <div>Total Variants</div>
          </div>
        </div>
      </div>

      {/* SORT CONTROLS */}
      {/* SORT CONTROLS + BACK */}
      <div
        style={{
          display: "flex",
          gap: 12,
          marginBottom: 24,
          alignItems: "center",
        }}
      >
        {/* SORT BUTTONS */}
        {[
          { key: "shipping", label: "💰 Shipping" },
          { key: "rank", label: "🏆 Rank" },
        ].map((btn) => (
          <button
            key={btn.key}
            onClick={() => setSortBy(btn.key)}
            style={{
              padding: "8px 16px",
              borderRadius: 8,
              border: "2px solid #10b981",
              background: sortBy === btn.key ? "#10b981" : "#fff",
              color: sortBy === btn.key ? "#fff" : "#065f46",
              cursor: "pointer",
              fontWeight: 500,
            }}
          >
            {btn.label}
          </button>
        ))}

        {/* PUSH BACK BUTTON TO RIGHT */}
        <div style={{ flex: 1 }} />

        {/* BACK BUTTON */}
        <button
          onClick={() => router.back()}
          style={{
            padding: "8px 16px",
            borderRadius: 8,
            border: "2px solid #4a7768",
            background: "#ea3e23",
            color: "#ffffff",
            cursor: "pointer",
            fontWeight: 500,
          }}
        >
          ⬅️ GENRATE AGAIN
        </button>
      </div>

      {/* IMAGE GRID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 20,
        }}
      >
        {sortedVariants.map((v) => (
          <ImageCard
            key={v.rank}
            imageUrl={v.imageUrl}
            rank={v.rank}
            pir={v.pir}
            probe={v.probe}
            resolution={v.resolution}
            jpegQuality={v.jpegQuality}
            dpi={v.dpi}
            estimatedShipping={v.estimatedShipping}
            visualHint={v.visualHint}
          />
        ))}
      </div>
    </main>
  );
}
