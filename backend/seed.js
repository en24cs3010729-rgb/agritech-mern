const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

const User = require('./models/User');
const Farm = require('./models/Farm');
const Crop = require('./models/Crop');
const SoilReport = require('./models/SoilReport');
const PestAlert = require('./models/PestAlert');
const Product = require('./models/Product');
const Order = require('./models/Order');
const ForumPost = require('./models/ForumPost');

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/agritech';
    console.log(`Connecting to MongoDB at: ${mongoUri}`);
    await mongoose.connect(mongoUri);

    console.log('Clearing existing database collections...');
    await Promise.all([
      User.deleteMany(),
      Farm.deleteMany(),
      Crop.deleteMany(),
      SoilReport.deleteMany(),
      PestAlert.deleteMany(),
      Product.deleteMany(),
      Order.deleteMany(),
      ForumPost.deleteMany()
    ]);

    console.log('Seeding Users (Farmer & Admin)...');
    const farmerPassword = await bcrypt.hash('farmer123', 10);
    const adminPassword = await bcrypt.hash('admin123', 10);

    const farmer = await User.create({
      name: 'Ramesh Patel',
      email: 'farmer@agritech.com',
      password: farmerPassword,
      role: 'farmer',
      phone: '+91 98765 43210',
      location: { state: 'Punjab', district: 'Ludhiana', village: 'Raikot' }
    });

    const admin = await User.create({
      name: 'Dr. Sunita Sharma (Agronomist)',
      email: 'admin@agritech.com',
      password: adminPassword,
      role: 'admin',
      phone: '+91 91234 56789',
      location: { state: 'New Delhi', district: 'Central', village: 'ICAR Complex' }
    });

    console.log('Seeding Farms...');
    const farm1 = await Farm.create({
      farmer: farmer._id,
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
      activeCropsCount: 2
    });

    const farm2 = await Farm.create({
      farmer: farmer._id,
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
      activeCropsCount: 1
    });

    console.log('Seeding Crops...');
    await Crop.create([
      {
        farm: farm1._id,
        farmer: farmer._id,
        name: 'Wheat (Sharbati)',
        variety: 'HD-2967 High Yield',
        plantingDate: new Date('2025-11-20'),
        expectedHarvestDate: new Date('2026-04-10'),
        growthStage: 'Grain Filling / Fruiting',
        healthStatus: 'Excellent',
        estimatedYieldKg: 24000,
        notes: 'Third irrigation completed with micro-nutrients spray.'
      },
      {
        farm: farm1._id,
        farmer: farmer._id,
        name: 'Mustard (Sarson)',
        variety: 'Pusa Bold',
        plantingDate: new Date('2025-10-15'),
        expectedHarvestDate: new Date('2026-03-25'),
        growthStage: 'Maturity / Ready to Harvest',
        healthStatus: 'Good',
        estimatedYieldKg: 4200,
        notes: 'Pods are turning golden yellow, harvest in 5 days.'
      },
      {
        farm: farm2._id,
        farmer: farmer._id,
        name: 'Paddy / Basmati Rice',
        variety: 'Pusa 1121',
        plantingDate: new Date('2026-06-15'),
        expectedHarvestDate: new Date('2026-10-25'),
        growthStage: 'Sowing / Germination',
        healthStatus: 'Good',
        estimatedYieldKg: 18000,
        notes: 'Nursery beds prepared with organic vermicompost.'
      }
    ]);

    console.log('Seeding Soil Report...');
    await SoilReport.create({
      farm: farm1._id,
      farmer: farmer._id,
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
      suggestedCrops: ['Wheat', 'Rice (Paddy)', 'Maize (Corn)', 'Cotton', 'Mustard']
    });

    console.log('Seeding Pest Alerts...');
    await PestAlert.create([
      {
        title: 'Fall Armyworm Outbreak Warning',
        pestName: 'Spodoptera frugiperda (Fall Armyworm)',
        severity: 'High',
        affectedCrops: ['Maize', 'Sorghum', 'Sweet Corn'],
        symptoms: 'Large ragged holes in leaves, whorl damage, sawdust-like fecal droppings inside leaf funnel.',
        preventiveMeasures: 'Install pheromone traps (5 per acre). Spray neem seed kernel extract (NSKE 5%).',
        organicRemedy: 'Spray Bacillus thuringiensis (Bt) @ 2g/L or Beauveria bassiana @ 5g/L during dusk.',
        chemicalRemedy: 'Emamectin Benzoate 5% SG @ 0.4g/L of water if infestation exceeds ETL threshold.',
        affectedRegions: ['Punjab', 'Haryana', 'Uttar Pradesh', 'Madhya Pradesh'],
        isActive: true
      },
      {
        title: 'Aphids & Mustard Sawfly Alert',
        pestName: 'Lipaphis erysimi (Mustard Aphids)',
        severity: 'Medium',
        affectedCrops: ['Mustard', 'Canola', 'Crucifers'],
        symptoms: 'Curling of leaves, sticky honeydew secretion, presence of black sooty mould on pods.',
        preventiveMeasures: 'Set up yellow sticky traps (15 per acre). Conserve natural predators like Ladybird beetles.',
        organicRemedy: 'Neem oil 1500 ppm @ 3ml per liter with liquid detergent.',
        chemicalRemedy: 'Dimethoate 30% EC @ 1.5ml/L or Imidacloprid 17.8% SL @ 0.5ml/L.',
        affectedRegions: ['Punjab', 'Rajasthan', 'Gujarat'],
        isActive: true
      }
    ]);

    console.log('Seeding Products...');
    const prod1 = await Product.create({
      name: 'Organic Vermicompost Soil Revitalizer',
      category: 'Fertilizer',
      price: 450,
      unit: '25 kg bag',
      inStock: 120,
      rating: 4.9,
      description: 'Enriched 100% pure organic earthworm castings packed with beneficial microbes, humic acid, and macro-nutrients.',
      imageUrl: 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?w=600&auto=format&fit=crop&q=80',
      benefits: ['Enhances soil moisture retention', 'Restores earthworm population', 'Safe for all organic crops']
    });

    const prod2 = await Product.create({
      name: 'Cold-Pressed Pure Neem Oil (1500 PPM)',
      category: 'Bio-Pesticide',
      price: 320,
      unit: '1 Liter Bottle',
      inStock: 85,
      rating: 4.8,
      description: 'Broad-spectrum organic bio-pesticide that repels over 200 species of chewing and sucking pests without harming bees.',
      imageUrl: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=600&auto=format&fit=crop&q=80',
      benefits: ['Zero chemical residue', 'Safe for pollinators', 'Acts as pest growth inhibitor']
    });

    console.log('Seeding Forum Posts...');
    await ForumPost.create({
      author: farmer._id,
      authorName: farmer.name,
      title: 'How to manage early signs of yellowing in wheat flag leaf?',
      category: 'Crop Management',
      content: 'I noticed light yellow patches on the upper leaves of HD-2967 wheat after recent cloudy weather. Should I apply urea or is it a fungal sign?',
      upvotes: 8,
      tags: ['Wheat', 'Yellowing', 'Nutrition', 'Disease'],
      answers: [
        {
          expert: admin._id,
          expertName: 'Dr. Sunita Sharma (Agronomist)',
          isAgronomist: true,
          answerText: 'Do not rush to apply urea if leaves have powdery lines, as that indicates Yellow Stripe Rust. Check if yellow powder stains your fingers when touched. If yes, spray Propiconazole 25% EC (1ml/L). If no powder and it is uniform pale yellow, it is nitrogen deficiency exacerbated by waterlogging; apply a 2% foliar spray of urea.',
          helpfulVotes: 12,
          answeredAt: new Date(Date.now() - 12 * 60 * 60 * 1000)
        }
      ]
    });

    console.log('Seeding Orders...');
    await Order.create({
      farmer: farmer._id,
      items: [
        { product: prod1._id, name: prod1.name, price: prod1.price, quantity: 2, unit: prod1.unit },
        { product: prod2._id, name: prod2.name, price: prod2.price, quantity: 1, unit: prod2.unit }
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
      status: 'Dispatched'
    });

    console.log('✅ Database successfully populated with comprehensive AgriTech seed data!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err.message);
    process.exit(1);
  }
};

seedData();
