"use client";

import "@/styles/layout/card.layout.css";
import "@/styles/design/card.design.css";

export default function ImageCard({
  imageUrl,
  rank,
  pir,
  probe,
  resolution,
  dpi,
  jpegQuality,
  estimatedShipping,
  visualHint,
}) {
  const borderColor = visualHint?.borderColor || "#ccc";
  const borderWidth = visualHint?.borderWidth || 1;
  const framePadding =
    visualHint?.framePadding ?? (estimatedShipping <= 65 ? 20 : 8);

  const safePir = pir ?? "—";
  const safeDpi = dpi ?? "—";
  const safeJpegQuality = jpegQuality ?? "—";

  const getBadge = (price = 999) => {
    if (price <= 65) return { label: "LOWEST", color: "#10b981", emoji: "🔥" };
    if (price <= 75)
      return { label: "VERY LOW", color: "#22c55e", emoji: "✨" };
    if (price <= 89) return { label: "LOW", color: "#84cc16", emoji: "👍" };
    if (price <= 99)
      return { label: "MODERATE", color: "#eab308", emoji: "📦" };
    return { label: "STANDARD", color: "#f97316", emoji: "📮" };
  };

  const badge = getBadge(estimatedShipping);

  return (
    <div className="image-card">
      {/* BADGE */}
      {estimatedShipping <= 75 && (
        <div className="image-badge" style={{ background: badge.color }}>
          {badge.emoji} BEST DEAL
        </div>
      )}

      {/* IMAGE */}
      <div
        className="image-frame"
        style={{
          border: `${borderWidth}px solid ${borderColor}`,
          background: estimatedShipping <= 65 ? "#f0fdf4" : "#fff",
        }}
      >
        <div className="image-inner" style={{ padding: framePadding }}>
          <img src={imageUrl} alt={`Variant ${rank}`} />
        </div>
      </div>

      {/* META */}
      <div className="image-meta">
        <div className="shipping-box" style={{ background: badge.color }}>
          <div className="shipping-label">
            {badge.emoji} {badge.label}
          </div>
          <div className="shipping-price">₹{estimatedShipping}</div>
          <div className="shipping-sub">shipping</div>
        </div>

        <span>
          <strong>Rank:</strong> #{rank}
        </span>
      </div>

      {/* DOWNLOAD */}
      <div className="download-btn">
        <a href={imageUrl} download>
          Download {estimatedShipping <= 65 && "🔥"}
        </a>
      </div>
    </div>
  );
}
