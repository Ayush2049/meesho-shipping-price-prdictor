"use client";

import { useEffect, useState } from "react";
import ImageCard from "../../components/Card/ImageCard";

export default function GeneratePage() {
  const [data, setData] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [sortBy, setSortBy] = useState("shipping"); // shipping | rank | pir

  useEffect(() => {
    setMounted(true);
    const stored = sessionStorage.getItem("results");
    if (stored) {
      setData(JSON.parse(stored));
    }
  }, []);

  if (!mounted) return null;
  if (!data || !data.variants?.length) {
    return <p>No results found</p>;
  }

  // 🔁 Sorting (safe)
  const sortedVariants = [...data.variants].sort((a, b) => {
    if (sortBy === "shipping")
      return (a.estimatedShipping ?? 999) - (b.estimatedShipping ?? 999);
    if (sortBy === "rank") return (a.rank ?? 0) - (b.rank ?? 0);
    if (sortBy === "pir") return (a.pir ?? 1) - (b.pir ?? 1);
    return 0;
  });

  // 📊 Stats
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
      <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
        {[
          { key: "shipping", label: "💰 Shipping" },
          { key: "rank", label: "🏆 Rank" },
          { key: "pir", label: "📐 PIR" },
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
            }}
          >
            {btn.label}
          </button>
        ))}
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
            imageUrl={v.imageUrl} // ✅ Use the URL directly - it's already complete!
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
