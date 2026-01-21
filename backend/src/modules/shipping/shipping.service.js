import { VISUAL_SCALE } from './shipping.constants.js'
import { visualIndexFromRank } from './shipping.utils.js'


export const computeShippingScores = ({ variants }) => {
  console.log('\n🚀 === computeShippingScores START ===')

  const enriched = variants.map(v => {
    let estimatedShipping
    let slab

    // 🔒 1️⃣ HARD LOCK — Meesho ignores borders in real shipping
    if (
      v.source === 'BORDER' ||
      v.shippingLocked === true ||
      v.probe?.startsWith('BORDER') ||
      v.probe === 'NO_BORDER'
    ) {
      estimatedShipping = 65
      slab = '₹65'

      console.log(`🧮 ${v.probe} | LOCKED → ₹65`)

      return {
        ...v,
        slab,
        estimatedShipping,
        shippingScore: estimatedShipping
      }
    }

    // 📦 2️⃣ REAL GEOMETRY-BASED SHIPPING (PIR variants ONLY)
    const evf = v.evf
    const compactness = v.compactness

    const shapePenalty =
      compactness < 0.6 ? 1.18 :
        compactness > 0.75 ? 0.92 :
          1.0

    const effectiveEVF = evf * shapePenalty

    if (effectiveEVF < 420) {
      estimatedShipping = 65
      slab = '₹65'
    } else if (effectiveEVF < 470) {
      estimatedShipping = 75
      slab = '₹75'
    } else if (effectiveEVF < 520) {
      estimatedShipping = 89
      slab = '₹89'
    } else if (effectiveEVF < 580) {
      estimatedShipping = 99
      slab = '₹99'
    } else {
      estimatedShipping = 111
      slab = '₹111'
    }

    console.log(
      `🧮 ${v.probe} | EVF=${evf.toFixed(1)} | C=${compactness.toFixed(
        2
      )} | eff=${effectiveEVF.toFixed(1)} → ₹${estimatedShipping}`
    )

    return {
      ...v,
      slab,
      estimatedShipping,
      shippingScore: estimatedShipping
    }
  })

  // 🏆 Rank by shipping
  const ranked = enriched
    .sort((a, b) => a.shippingScore - b.shippingScore)
    .map((v, i) => ({ ...v, rank: i + 1 }))

  const total = ranked.length

  // 🎨 UI-only visual hints (safe)
  return ranked.map(v => {
    const rawIndex = visualIndexFromRank(v.rank, total)
    const safeIndex = Math.min(
      Math.max(rawIndex, 0),
      VISUAL_SCALE.length - 1
    )

    const visual = VISUAL_SCALE[safeIndex]

    let framePadding = 12
    if (v.estimatedShipping <= 65) framePadding = 44
    else if (v.estimatedShipping <= 75) framePadding = 36
    else if (v.estimatedShipping <= 89) framePadding = 28
    else if (v.estimatedShipping <= 99) framePadding = 20

    return {
      ...v,
      visualHint: {
        borderColor: visual.color,
        borderWidth: visual.width,
        framePadding
      }
    }
  })
}
