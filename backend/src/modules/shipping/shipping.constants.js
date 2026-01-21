// ❌ REMOVED OLD CATEGORY_WEIGHTS - Not used for Meesho shipping
// ❌ REMOVED OLD PRICE_BANDS - Replaced with actual Meesho slabs

// ✅ ACTUAL MEESHO SHIPPING SLABS (based on package weight/dimensions)
export const MEESHO_SHIPPING_SLABS = [
  { price: 65, minPIR: 0.00, maxPIR: 0.42, label: '₹65' },   // Smallest/lightest
  { price: 75, minPIR: 0.42, maxPIR: 0.50, label: '₹75' },
  { price: 89, minPIR: 0.50, maxPIR: 0.58, label: '₹89' },
  { price: 99, minPIR: 0.58, maxPIR: 0.68, label: '₹99' },
  { price: 111, minPIR: 0.68, maxPIR: 1.00, label: '₹111' }  // Largest/heaviest
]

// Visual differentiation for variants (best → worst)
export const VISUAL_SCALE = [
  { color: '#10b981', width: 5 }, // Emerald (BEST - ₹65)
  { color: '#22c55e', width: 4 }, // Green (₹75)
  { color: '#84cc16', width: 4 }, // Lime (₹89)
  { color: '#eab308', width: 3 }, // Yellow (₹99)
  { color: '#f97316', width: 3 }, // Orange (₹111)
  { color: '#ef4444', width: 2 }, // Red (fallback)
]