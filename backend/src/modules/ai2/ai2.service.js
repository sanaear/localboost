const fs = require('fs');
const path = require('path');

// ─── Categories ───────────────────────────────────────────────────────────────
const CATEGORIES = [
  {
    id: 1,
    label: {
      EN: 'Traditional Restaurant',
      FR: 'Restaurant Traditionnel',
      AR: 'مطعم تقليدي',
      ES: 'Restaurante Tradicional',
    },
    icon: '🍽️',
  },
  {
    id: 2,
    label: {
      EN: 'Café & Tea House',
      FR: 'Café & Maison de Thé',
      AR: 'مقهى وبيت شاي',
      ES: 'Café y Casa de Té',
    },
    icon: '☕',
  },
  {
    id: 3,
    label: {
      EN: 'Pottery & Ceramics',
      FR: 'Poterie & Céramique',
      AR: 'فخار وسيراميك',
      ES: 'Alfarería y Cerámica',
    },
    icon: '🏺',
  },
  {
    id: 4,
    label: {
      EN: 'Leather & Bags',
      FR: 'Cuir & Maroquinerie',
      AR: 'جلود وحقائب',
      ES: 'Cuero y Bolsos',
    },
    icon: '👜',
  },
  {
    id: 5,
    label: {
      EN: 'Spices & Argan Oil',
      FR: "Épices & Huile d'Argan",
      AR: 'توابل وزيت الأرغان',
      ES: 'Especias y Aceite de Argán',
    },
    icon: '🌶️',
  },
  {
    id: 6,
    label: {
      EN: 'Jewelry & Silver',
      FR: 'Bijoux & Argent',
      AR: 'مجوهرات وفضة',
      ES: 'Joyería y Plata',
    },
    icon: '💎',
  },
  {
    id: 7,
    label: {
      EN: 'Carpet & Textile',
      FR: 'Tapis & Textile',
      AR: 'سجاد ومنسوجات',
      ES: 'Alfombras y Textiles',
    },
    icon: '🧶',
  },
  {
    id: 8,
    label: {
      EN: 'Riad / Guesthouse',
      FR: "Riad / Maison d'hôtes",
      AR: 'رياض / بيت ضيافة',
      ES: 'Riad / Casa de Huéspedes',
    },
    icon: '🏨',
  },
  {
    id: 9,
    label: { EN: 'Hammam & Spa', FR: 'Hammam & Spa', AR: 'حمام وسبا', ES: 'Hammam y Spa' },
    icon: '🧖',
  },
  {
    id: 10,
    label: {
      EN: 'Bakery & Patisserie',
      FR: 'Boulangerie & Pâtisserie',
      AR: 'مخبزة وحلويات',
      ES: 'Panadería y Pastelería',
    },
    icon: '🥐',
  },
  {
    id: 11,
    label: { EN: 'Tour Guide', FR: 'Guide Touristique', AR: 'مرشد سياحي', ES: 'Guía Turístico' },
    icon: '🗺️',
  },
  {
    id: 12,
    label: {
      EN: 'Tailor & Couture',
      FR: 'Tailleur & Couture',
      AR: 'خياطة وأزياء',
      ES: 'Sastrería y Costura',
    },
    icon: '🧵',
  },
  { id: 13, label: { EN: 'Pharmacy', FR: 'Pharmacie', AR: 'صيدلية', ES: 'Farmacia' }, icon: '💊' },
  {
    id: 14,
    label: { EN: 'Supermarket', FR: 'Supermarché', AR: 'سوبر ماركت', ES: 'Supermercado' },
    icon: '🛒',
  },
  { id: 15, label: { EN: 'Other', FR: 'Autre', AR: 'أخرى', ES: 'Otro' }, icon: '🏪' },
];

// ─── Moroccan Cities ──────────────────────────────────────────────────────────
const CITIES = [
  'Casablanca',
  'Rabat',
  'Fès',
  'Marrakech',
  'Agadir',
  'Tanger',
  'Meknès',
  'Oujda',
  'Tétouan',
  'Safi',
  'Ifrane',
  'Errachidia',
  'Ouarzazate',
  'Essaouira',
  'Chefchaouen',
  'El Jadida',
  'Beni Mellal',
  'Kenitra',
  'Nador',
  'Dakhla',
];

/**
 * Validate step 1 data
 */
function validateStep1(data) {
  const errors = [];
  if (!data.businessName || data.businessName.trim().length < 2)
    errors.push('Business name is required (min 2 characters).');
  if (!data.category) errors.push('Category is required.');
  if (!data.city) errors.push('City is required.');
  if (!data.address || data.address.trim().length < 5)
    errors.push('Address is required (min 5 characters).');
  if (!data.phoneNumber || !/^\+?[\d\s\-]{7,15}$/.test(data.phoneNumber))
    errors.push('A valid phone number is required.');
  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
    errors.push('A valid email address is required.');
  return errors;
}

/**
 * Validate step 3 data
 */
function validateStep3(data) {
  const errors = [];
  if (!data.openingHours || typeof data.openingHours !== 'object')
    errors.push('Opening hours are required.');
  if (data.whatsapp && !/^\+?[\d\s\-]{7,15}$/.test(data.whatsapp))
    errors.push('WhatsApp number format is invalid.');
  if (data.website && !/^https?:\/\/.+/.test(data.website))
    errors.push('Website URL must start with http:// or https://');
  return errors;
}

/**
 * Build a complete profile object from wizard data
 */
function buildProfile(body) {
  const { step1, step2, step3 } = body;
  const lang = step1.lang ? step1.lang.toUpperCase() : 'EN';

  // Find category label
  const cat = CATEGORIES.find((c) => String(c.id) === String(step1.category));
  let categoryLabel = step1.category;
  if (cat) {
    categoryLabel = cat.label[lang] || cat.label['EN'] || cat.label;
  }

  return {
    // Step 1 — Business Info
    businessName: step1.businessName.trim(),
    category: categoryLabel,
    categoryIcon: cat ? cat.icon : '🏪',
    city: step1.city,
    address: step1.address.trim(),
    phoneNumber: step1.phoneNumber.trim(),
    email: step1.email ? step1.email.trim() : null,
    tagline: step1.tagline ? step1.tagline.trim() : null,
    lang: lang,
    // Step 2 — Photos & Logo
    logoPath: step2?.logoPath || null,
    photos: Array.isArray(step2?.photos) ? step2.photos : [],
    // Step 3 — Hours & Contact
    openingHours: step3.openingHours || {},
    whatsapp: step3.whatsapp || null,
    website: step3.website || null,
    socialLinks: Array.isArray(step3.socialLinks) ? step3.socialLinks : [],
    specialOffers: step3.specialOffers || null,
    // Meta
    status: 'pending_review',
    completionScore: calcCompletionScore({ step1, step2, step3 }),
  };
}

/**
 * Calculate a completion score 0-100 based on what was filled
 */
function calcCompletionScore({ step1, step2, step3 }) {
  let score = 0;
  if (step1?.businessName) score += 15;
  if (step1?.category) score += 15;
  if (step1?.city) score += 10;
  if (step1?.address) score += 10;
  if (step1?.phoneNumber) score += 10;
  if (step1?.email) score += 5;
  if (step1?.tagline) score += 5;
  if (step2?.photos && step2.photos.length > 0) score += 15;
  if (step2?.logoPath) score += 5;
  if (step3?.openingHours && Object.keys(step3.openingHours).length > 0) score += 5;
  if (step3?.whatsapp) score += 5;
  if (step3?.website) score += 5;
  if (step3?.socialLinks && step3.socialLinks.length > 0) score += 5;
  return Math.min(score, 100);
}

module.exports = {
  CATEGORIES,
  CITIES,
  validateStep1,
  validateStep3,
  buildProfile,
  calcCompletionScore,
};
