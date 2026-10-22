const bcrypt = require('bcryptjs');

// In-memory data store with comprehensive seed data
const store = {
  users: [
    {
      _id: 'user_farmer_1',
      id: 'user_farmer_1',
      name: 'Ramesh Patel',
      email: 'farmer@agritech.com',
      passwordHash: bcrypt.hashSync('farmer123', 10),
      role: 'farmer',
      phone: '+91 98765 43210',
      location: { state: 'Punjab', district: 'Ludhiana', village: 'Raikot' },
      preferredLanguage: 'en',
      createdAt: new Date()
    },
    {
      _id: 'user_admin_1',
      id: 'user_admin_1',
      name: 'Dr. Sunita Sharma (Admin & Agronomist)',
      email: 'admin@agritech.com',
      passwordHash: bcrypt.hashSync('admin123', 10),
      role: 'admin',
      phone: '+91 91234 56789',
      location: { state: 'New Delhi', district: 'Central', village: 'ICAR Complex' },
      preferredLanguage: 'en',
      createdAt: new Date()
    }
  ],
  farms: [
    {
      _id: 'farm_1',
      id: 'farm_1',
      farmer: 'user_farmer_1',
      name: 'Green Horizon Farm',
      location: {
        address: 'Plot 44, GT Road Bypass',
        village: 'Raikot',
        district: 'Ludhiana',
        state: 'Punjab',
        pincode: '141109'
      },
      sizeInAcres: 12.5,
      soilType: 'Alluvial',
      irrigationType: 'Drip',
      waterSource: 'Solar Borewell',
      activeCropsCount: 2,
      createdAt: new Date('2026-01-15')
    },
    {
      _id: 'farm_2',
      id: 'farm_2',
      farmer: 'user_farmer_1',
      name: 'Surya Organic Orchards',
      location: {
        address: 'Survey No 102, Canal Bank',
        village: 'Khanna',
        district: 'Ludhiana',
        state: 'Punjab',
        pincode: '141401'
      },
      sizeInAcres: 6.0,
      soilType: 'Loamy',
      irrigationType: 'Sprinkler',
      waterSource: 'Canal Lift',
      activeCropsCount: 1,
      createdAt: new Date('2026-03-01')
    }
  ],
  crops: [
    {
      _id: 'crop_1',
      id: 'crop_1',
      farm: 'farm_1',
      farmer: 'user_farmer_1',
      name: 'Wheat (Sharbati)',
      variety: 'HD-2967 High Yield',
      plantingDate: new Date('2025-11-20'),
      expectedHarvestDate: new Date('2026-04-10'),
      growthStage: 'Grain Filling / Fruiting',
      healthStatus: 'Excellent',
      estimatedYieldKg: 24000,
      notes: 'Third irrigation completed with micro-nutrients spray.',
      createdAt: new Date('2025-11-20')
    },
    {
      _id: 'crop_2',
      id: 'crop_2',
      farm: 'farm_1',
      farmer: 'user_farmer_1',
      name: 'Mustard (Sarson)',
      variety: 'Pusa Bold',
      plantingDate: new Date('2025-10-15'),
      expectedHarvestDate: new Date('2026-03-25'),
      growthStage: 'Maturity / Ready to Harvest',
      healthStatus: 'Good',
      estimatedYieldKg: 4200,
      notes: 'Pods are turning golden yellow, harvest in 5 days.',
      createdAt: new Date('2025-10-15')
    },
    {
      _id: 'crop_3',
      id: 'crop_3',
      farm: 'farm_2',
      farmer: 'user_farmer_1',
      name: 'Paddy / Basmati Rice',
      variety: 'Pusa 1121',
      plantingDate: new Date('2026-06-15'),
      expectedHarvestDate: new Date('2026-10-25'),
      growthStage: 'Sowing / Germination',
      healthStatus: 'Good',
      estimatedYieldKg: 18000,
      notes: 'Nursery beds prepared with organic vermicompost.',
      createdAt: new Date('2026-06-15')
    }
  ],
  soilReports: [
    {
      _id: 'soil_1',
      id: 'soil_1',
      farm: 'farm_1',
      farmer: 'user_farmer_1',
      testDate: new Date('2026-02-10'),
      nitrogen: 340,
      phosphorus: 38,
      potassium: 220,
      phLevel: 6.8,
      moisturePercent: 52,
      organicCarbonPercent: 0.72,
      healthScore: 88,
      overallStatus: 'Optimal',
      recommendations: [
        {
          category: 'NPK Balance',
          message: 'Nitrogen and Phosphorus levels are ideal for cereal crops.',
          remedy: 'Apply organic mulch and split potash dosage.'
        },
        {
          category: 'pH Balance',
          message: 'Soil pH of 6.8 is neutral and optimal for high yield nutrient uptake.',
          remedy: 'Maintain microbial activity using Jeevamrutha or vermiwash.'
        }
      ],
      suggestedCrops: ['Wheat', 'Rice (Paddy)', 'Maize (Corn)', 'Cotton', 'Mustard'],
      createdAt: new Date('2026-02-10')
    }
  ],
  pestAlerts: [
    {
      _id: 'pest_1',
      id: 'pest_1',
      title: 'Fall Armyworm Outbreak Warning',
      pestName: 'Spodoptera frugiperda (Fall Armyworm)',
      severity: 'High',
      affectedCrops: ['Maize', 'Sorghum', 'Sweet Corn'],
      symptoms: 'Large ragged holes in leaves, whorl damage, sawdust-like fecal droppings inside leaf funnel.',
      preventiveMeasures: 'Install pheromone traps (5 per acre). Spray neem seed kernel extract (NSKE 5%).',
      organicRemedy: 'Spray Bacillus thuringiensis (Bt) @ 2g/L or Beauveria bassiana @ 5g/L during dusk.',
      chemicalRemedy: 'Emamectin Benzoate 5% SG @ 0.4g/L of water if infestation exceeds ETL threshold.',
      affectedRegions: ['Punjab', 'Haryana', 'Uttar Pradesh', 'Madhya Pradesh'],
      isActive: true,
      reportedDate: new Date()
    },
    {
      _id: 'pest_2',
      id: 'pest_2',
      title: 'Aphids & Mustard Sawfly Alert',
      pestName: 'Lipaphis erysimi (Mustard Aphids)',
      severity: 'Medium',
      affectedCrops: ['Mustard', 'Canola', 'Crucifers'],
      symptoms: 'Curling of leaves, sticky honeydew secretion, presence of black sooty mould on pods.',
      preventiveMeasures: 'Set up yellow sticky traps (15 per acre). Conserve natural predators like Ladybird beetles.',
      organicRemedy: 'Neem oil 1500 ppm @ 3ml per liter with liquid detergent.',
      chemicalRemedy: 'Dimethoate 30% EC @ 1.5ml/L or Imidacloprid 17.8% SL @ 0.5ml/L.',
      affectedRegions: ['Punjab', 'Rajasthan', 'Gujarat'],
      isActive: true,
      reportedDate: new Date()
    },
    {
      _id: 'pest_3',
      id: 'pest_3',
      title: 'Yellow Rust Surveillance Alert',
      pestName: 'Puccinia striiformis (Yellow Stripe Rust)',
      severity: 'Critical',
      affectedCrops: ['Wheat', 'Barley'],
      symptoms: 'Bright yellow powdery stripes along leaf veins on upper leaf surface.',
      preventiveMeasures: 'Avoid excess nitrogen fertilizer. Inspect northern fields daily after dewy mornings.',
      organicRemedy: 'Trichoderma viride foliar bio-spray @ 10g/L.',
      chemicalRemedy: 'Propiconazole 25% EC @ 1ml/L immediately upon observing initial symptoms.',
      affectedRegions: ['Sub-mountainous zones of Punjab', 'Jammu', 'Himachal Pradesh'],
      isActive: true,
      reportedDate: new Date()
    }
  ],
  products: [
    {
      _id: 'prod_1',
      id: 'prod_1',
      name: 'Organic Vermicompost Soil Revitalizer',
      category: 'Fertilizer',
      price: 450,
      unit: '25 kg bag',
      inStock: 120,
      rating: 4.9,
      description: 'Enriched 100% pure organic earthworm castings packed with beneficial microbes, humic acid, and macro-nutrients.',
      imageUrl: 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?w=600&auto=format&fit=crop&q=80',
      benefits: ['Enhances soil moisture retention', 'Restores earthworm population', 'Safe for all organic crops']
    },
    {
      _id: 'prod_2',
      id: 'prod_2',
      name: 'Cold-Pressed Pure Neem Oil (1500 PPM)',
      category: 'Bio-Pesticide',
      price: 320,
      unit: '1 Liter Bottle',
      inStock: 85,
      rating: 4.8,
      description: 'Broad-spectrum organic bio-pesticide that repels over 200 species of chewing and sucking pests without harming bees.',
      imageUrl: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=600&auto=format&fit=crop&q=80',
      benefits: ['Zero chemical residue', 'Safe for pollinators', 'Acts as pest growth inhibitor']
    },
    {
      _id: 'prod_3',
      id: 'prod_3',
      name: 'Certified Hybrid Wheat Seeds (HD-3086)',
      category: 'Seeds',
      price: 1100,
      unit: '40 kg bag',
      inStock: 60,
      rating: 4.9,
      description: 'High yielding, drought-resilient and heat-tolerant certified wheat seeds developed for North and Central farming plains.',
      imageUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&auto=format&fit=crop&q=80',
      benefits: ['Rust-resistant variety', 'High grain weight', '125-130 days maturity']
    },
    {
      _id: 'prod_4',
      id: 'prod_4',
      name: 'Solar Powered Smart Drip Irrigation Kit',
      category: 'Irrigation Tools',
      price: 4200,
      unit: 'Complete Kit (1 Acre)',
      inStock: 25,
      rating: 5.0,
      description: 'Automated solar timer controlled drip irrigation system saving up to 60% water while maintaining root-zone moisture.',
      imageUrl: 'https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?w=600&auto=format&fit=crop&q=80',
      benefits: ['60% water conservation', 'Solar battery backup', 'Zero electricity bill']
    },
    {
      _id: 'prod_5',
      id: 'prod_5',
      name: 'Digital Soil pH & Moisture Meter 4-in-1',
      category: 'Equipment',
      price: 850,
      unit: '1 Unit',
      inStock: 90,
      rating: 4.7,
      description: 'Portable probe for instant on-field readout of soil pH, moisture level, temperature, and sunlight intensity.',
      imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80',
      benefits: ['Instant 5-second results', 'No batteries needed', 'Easy calibration']
    }
  ],
  orders: [
    {
      _id: 'ord_1',
      id: 'ord_1',
      farmer: 'user_farmer_1',
      items: [
        { product: 'prod_1', name: 'Organic Vermicompost Soil Revitalizer', price: 450, quantity: 2, unit: '25 kg bag' },
        { product: 'prod_2', name: 'Cold-Pressed Pure Neem Oil (1500 PPM)', price: 320, quantity: 1, unit: '1 Liter Bottle' }
      ],
      totalAmount: 1220,
      shippingAddress: {
        address: 'Plot 44, GT Road Bypass',
        village: 'Raikot',
        district: 'Ludhiana',
        state: 'Punjab',
        pincode: '141109',
        phone: '+91 98765 43210'
      },
      paymentMethod: 'Cash on Delivery (Kisan Pay)',
      status: 'Dispatched',
      estimatedDeliveryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000)
    }
  ],
  forumPosts: [
    {
      _id: 'post_1',
      id: 'post_1',
      author: 'user_farmer_1',
      authorName: 'Ramesh Patel',
      title: 'How to manage early signs of yellowing in wheat flag leaf?',
      category: 'Crop Management',
      content: 'I noticed light yellow patches on the upper leaves of HD-2967 wheat after recent cloudy weather. Should I apply urea or is it a fungal sign?',
      upvotes: 8,
      tags: ['Wheat', 'Yellowing', 'Nutrition', 'Disease'],
      answers: [
        {
          expert: 'user_admin_1',
          expertName: 'Dr. Sunita Sharma (Agronomist)',
          isAgronomist: true,
          answerText: 'Do not rush to apply urea if leaves have powdery lines, as that indicates Yellow Stripe Rust. Check if yellow powder stains your fingers when touched. If yes, spray Propiconazole 25% EC (1ml/L). If no powder and it is uniform pale yellow, it is nitrogen deficiency exacerbated by waterlogging; apply a 2% foliar spray of urea.',
          helpfulVotes: 12,
          answeredAt: new Date(Date.now() - 12 * 60 * 60 * 1000)
        }
      ],
      createdAt: new Date(Date.now() - 36 * 60 * 60 * 1000)
    },
    {
      _id: 'post_2',
      id: 'post_2',
      author: 'user_farmer_1',
      authorName: 'Ramesh Patel',
      title: 'Subsidy process for installing solar drip irrigation in 2026',
      category: 'Market & Subsidies',
      content: 'Can anyone guide me on the PM-KUSUM and Per Drop More Crop scheme document checklist for Ludhiana district?',
      upvotes: 5,
      tags: ['Solar Pump', 'Drip Irrigation', 'PM-KUSUM', 'Subsidy'],
      answers: [
        {
          expert: 'user_admin_1',
          expertName: 'Dr. Sunita Sharma (Agronomist)',
          isAgronomist: true,
          answerText: 'You will need: 1. Land ownership 7/12 extract / Jamabandi, 2. Aadhaar card & Kisan Credit Card, 3. Bank passbook copy, 4. Ground water test report / borewell NOC. Submit online via the state agriculture portal and choose an empaneled vendor.',
          helpfulVotes: 9,
          answeredAt: new Date(Date.now() - 18 * 60 * 60 * 1000)
        }
      ],
      createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000)
    }
  ]
};

module.exports = store;
