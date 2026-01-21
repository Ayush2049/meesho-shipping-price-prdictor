// ---------- STATIC (shape-based) ----------
export const aspectPenalty = (bbox) => {
  return Math.abs(bbox.width / bbox.height - 1)
}

export const compactness = (productArea, bbox) => {
  return productArea / (bbox.width * bbox.height)
}

// ---------- VARIANT (dynamic) ----------
export const pirDelta = (pir, optimal = 0.68) => {
  return Math.abs(pir - optimal)
}

export const tightnessScore = (pir, min = 0.6, max = 0.75) => {
  return (pir - min) / (max - min)
}

// ---------- VISUAL HELPERS ----------
export const framePaddingFromTightness = (tightness) => {
  return Math.round(22 - tightness * 18) // 22px → 4px
}

export const visualIndexFromRank = (rank, total) => {
  return Math.min(
    Math.floor(((rank - 1) / (total - 1)) * (total - 1)),
    total - 1
  )
}
