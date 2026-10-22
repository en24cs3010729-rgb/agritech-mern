function analyzeSoil(nitrogen, phosphorus, potassium, phLevel, moisture = 45, organicCarbon = 0.65) {
  const recommendations = [];
  let score = 100;
  let status = 'Optimal';

  // 1. pH Level Evaluation
  if (phLevel < 6.0) {
    score -= 15;
    status = 'Acidic Soil';
    recommendations.push({
      category: 'pH Balance (Acidic)',
      message: `Your soil pH is ${phLevel}, which is acidic. Nutrient absorption is restricted.`,
      remedy: 'Apply Agricultural Lime (Calcium Carbonate) or Dolomite at 500-800 kg/acre to neutralize acidity.'
    });
  } else if (phLevel > 7.8) {
    score -= 15;
    status = 'Alkaline Soil';
    recommendations.push({
      category: 'pH Balance (Alkaline)',
      message: `Your soil pH is ${phLevel}, which is moderately alkaline. Micro-nutrients like zinc and iron may get locked.`,
      remedy: 'Incorporate Agricultural Gypsum (400-600 kg/acre) or decomposed organic farmyard manure (FYM).'
    });
  } else {
    recommendations.push({
      category: 'pH Balance',
      message: `Soil pH of ${phLevel} is in the prime optimal range for nutrient uptake.`,
      remedy: 'Maintain organic mulch to retain balanced soil microbes.'
    });
  }

  // 2. Nitrogen (N) Analysis
  if (nitrogen < 250) {
    score -= 15;
    recommendations.push({
      category: 'Nitrogen (N) Deficiency',
      message: `Nitrogen is low (${nitrogen} kg/ha). Stunted growth and yellowing of older leaves may occur.`,
      remedy: 'Top-dress with Urea or bio-fertilizers like Azotobacter / Rhizobium. Sow green manure crops like Dhaincha.'
    });
  } else if (nitrogen > 550) {
    score -= 5;
    recommendations.push({
      category: 'Excess Nitrogen',
      message: `Nitrogen is high (${nitrogen} kg/ha). Excessive vegetative growth can invite sucking pests.`,
      remedy: 'Reduce synthetic nitrogen application; balance with potash.'
    });
  } else {
    recommendations.push({
      category: 'Nitrogen (N)',
      message: `Nitrogen level is adequate (${nitrogen} kg/ha) for healthy foliage development.`,
      remedy: 'Follow split application during active vegetative stages.'
    });
  }

  // 3. Phosphorus (P) Analysis
  if (phosphorus < 20) {
    score -= 15;
    recommendations.push({
      category: 'Phosphorus (P) Deficiency',
      message: `Phosphorus is low (${phosphorus} kg/ha). Root expansion and flowering will be delayed.`,
      remedy: 'Apply Single Super Phosphate (SSP) or DAP at basal sowing along with Phosphate Solubilizing Bacteria (PSB).'
    });
  } else {
    recommendations.push({
      category: 'Phosphorus (P)',
      message: `Phosphorus status is sufficient (${phosphorus} kg/ha) for robust root development and tillering.`,
      remedy: 'Maintain soil organic matter to keep phosphorus bioavailable.'
    });
  }

  // 4. Potassium (K) Analysis
  if (potassium < 140) {
    score -= 15;
    recommendations.push({
      category: 'Potassium (K) Deficiency',
      message: `Potassium is low (${potassium} kg/ha). Crop will be vulnerable to water stress and fungal blight.`,
      remedy: 'Apply Muriate of Potash (MOP) or Sulfate of Potash (SOP) at 25-40 kg/acre.'
    });
  } else {
    recommendations.push({
      category: 'Potassium (K)',
      message: `Potassium level is optimal (${potassium} kg/ha). Ensures strong stalk and disease resistance.`,
      remedy: 'Continue standard dosage during grain-filling / flowering stage.'
    });
  }

  // Suggested Crops based on conditions
  const suggestedCrops = [];
  if (phLevel >= 6.0 && phLevel <= 7.5) {
    suggestedCrops.push('Wheat', 'Rice (Paddy)', 'Maize (Corn)', 'Soybean', 'Cotton');
  } else if (phLevel < 6.0) {
    suggestedCrops.push('Tea', 'Potato', 'Sweet Potato', 'Rye');
  } else {
    suggestedCrops.push('Barley', 'Mustard', 'Sugarbeet', 'Cotton');
  }

  if (organicCarbon < 0.5) {
    score -= 10;
  }

  const finalScore = Math.max(25, Math.min(98, score));

  return {
    healthScore: finalScore,
    overallStatus: finalScore >= 80 ? 'Optimal' : finalScore >= 60 ? 'Moderate' : 'Deficient',
    recommendations,
    suggestedCrops
  };
}

module.exports = { analyzeSoil };
