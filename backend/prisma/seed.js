require('dotenv').config({ path: __dirname + '/../.env' });
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Début du seed...');

  // ─── CATÉGORIES ───
  const restaurant = await prisma.category.upsert({ where: { id: 1 }, update: {}, create: { name_fr: 'Restaurant', name_en: 'Restaurant', name_ar: 'مطعم', name_es: 'Restaurante' } });
  const cafe = await prisma.category.upsert({ where: { id: 2 }, update: {}, create: { name_fr: 'Café', name_en: 'Café', name_ar: 'مقهى', name_es: 'Café' } });
  const artisan = await prisma.category.upsert({ where: { id: 3 }, update: {}, create: { name_fr: 'Artisanat', name_en: 'Craft', name_ar: 'حرف يدوية', name_es: 'Artesanía' } });
  const hotel = await prisma.category.upsert({ where: { id: 4 }, update: {}, create: { name_fr: 'Hôtel & Riad', name_en: 'Hotel & Riad', name_ar: 'فندق ورياض', name_es: 'Hotel y Riad' } });
  const spa = await prisma.category.upsert({ where: { id: 5 }, update: {}, create: { name_fr: 'Spa & Hammam', name_en: 'Spa & Hammam', name_ar: 'سبا وحمام', name_es: 'Spa y Hammam' } });
  console.log('✅ Catégories créées');

  // ─── USERS ───
  const owner1 = await prisma.user.upsert({ where: { email: 'hassan@localboost.ma' }, update: {}, create: { email: 'hassan@localboost.ma', password_hash: '$2b$10$hashedpassword1', first_name: 'Hassan', last_name: 'Benali', role: 'business_owner', phone: '+212661234567' } });
  const owner2 = await prisma.user.upsert({ where: { email: 'fatima@localboost.ma' }, update: {}, create: { email: 'fatima@localboost.ma', password_hash: '$2b$10$hashedpassword2', first_name: 'Fatima', last_name: 'Alaoui', role: 'business_owner', phone: '+212662345678' } });
  const owner3 = await prisma.user.upsert({ where: { email: 'karim@localboost.ma' }, update: {}, create: { email: 'karim@localboost.ma', password_hash: '$2b$10$hashedpassword3', first_name: 'Karim', last_name: 'Idrissi', role: 'business_owner', phone: '+212663456789' } });
  const customer1 = await prisma.user.upsert({ where: { email: 'tourist1@gmail.com' }, update: {}, create: { email: 'tourist1@gmail.com', password_hash: '$2b$10$hashedpassword4', first_name: 'Emma', last_name: 'Dupont', role: 'tourist', preferred_lang: 'fr' } });
  const customer2 = await prisma.user.upsert({ where: { email: 'tourist2@gmail.com' }, update: {}, create: { email: 'tourist2@gmail.com', password_hash: '$2b$10$hashedpassword5', first_name: 'Carlos', last_name: 'Garcia', role: 'tourist', preferred_lang: 'es' } });
  const customer3 = await prisma.user.upsert({ where: { email: 'local1@gmail.com' }, update: {}, create: { email: 'local1@gmail.com', password_hash: '$2b$10$hashedpassword6', first_name: 'Youssef', last_name: 'Mansouri', role: 'local', preferred_lang: 'ar' } });
  console.log('✅ Utilisateurs créés');

  // ─── BUSINESSES ───
  const bList = [
    { name: 'Café Clock', city: 'Fès', description: 'Café culturel emblématique de la médina. Menu végétarien varié, burgers marocains, jus frais. Terrasse avec vue sur la médina.', lat: 34.0631, lng: -5.0009, category_id: restaurant.id, user_id: owner1.id },
    { name: 'The Ruined Garden', city: 'Fès', description: 'Restaurant gastronomique dans un jardin riad historique du 14ème siècle. Cuisine marocaine fusion, ambiance romantique.', lat: 34.0641, lng: -5.0019, category_id: restaurant.id, user_id: owner1.id },
    { name: 'Nur Restaurant', city: 'Fès', description: 'Restaurant bio et végétarien au cœur de la médina. Produits locaux, cuisine marocaine traditionnelle revisitée.', lat: 34.0651, lng: -5.0029, category_id: restaurant.id, user_id: owner1.id },
    { name: 'Dar Hatim', city: 'Fès', description: 'Authentique cuisine marocaine dans un riad traditionnel. Tajines, couscous, pastilla. Dîners avec musique andalouse.', lat: 34.0620, lng: -5.0015, category_id: restaurant.id, user_id: owner1.id },
    { name: 'Atelier Tissage Fassi', city: 'Fès', description: 'Atelier artisanal spécialisé dans le tissage traditionnel fassi. Zellige, broderie, tapis berbères faits main.', lat: 34.0645, lng: -5.0040, category_id: artisan.id, user_id: owner1.id },
    { name: 'Riad Laaroussa', city: 'Fès', description: 'Riad de luxe classé patrimoine. 6 suites décorées à la main, piscine, restaurant gastronomique, spa traditionnel.', lat: 34.0635, lng: -5.0025, category_id: hotel.id, user_id: owner1.id },
    { name: 'Hammam Sidi Azzouz', city: 'Fès', description: 'Hammam traditionnel fassi datant du 17ème siècle. Soins au savon beldi, gommage, massage à l\'huile d\'argan.', lat: 34.0628, lng: -5.0032, category_id: spa.id, user_id: owner1.id },
    { name: 'Café Boulangerie Fassia', city: 'Fès', description: 'Boulangerie artisanale et café. Msemen, baghrir, pain marocain frais. Petit déjeuner traditionnel avec thé à la menthe.', lat: 34.0375, lng: -4.9999, category_id: cafe.id, user_id: owner1.id },
    { name: 'Nomad Restaurant', city: 'Marrakech', description: 'Restaurant moderne sur les toits de la médina avec vue sur Jemaa el-Fna. Cuisine marocaine contemporaine.', lat: 31.6276, lng: -7.9891, category_id: restaurant.id, user_id: owner2.id },
    { name: 'Earth Café Marrakech', city: 'Marrakech', description: 'Café 100% végétalien et bio. Smoothies detox, bowls colorés, wraps sains. Ambiance zen, décor bohème.', lat: 31.6289, lng: -7.9901, category_id: restaurant.id, user_id: owner2.id },
    { name: 'Souk Artisanat Marrakchi', city: 'Marrakech', description: 'Coopérative de 30 maîtres artisans. Poterie, maroquinerie, babouches, lanernes, bijoux berbères.', lat: 31.6295, lng: -7.9881, category_id: artisan.id, user_id: owner2.id },
    { name: 'Atelier Berbère', city: 'Marrakech', description: 'Atelier familial spécialisé dans les tapis et textiles berbères. Chaque pièce unique, tissée à la main. Certifié équitable.', lat: 31.6260, lng: -7.9870, category_id: artisan.id, user_id: owner2.id },
    { name: 'Riad Yasmine', city: 'Marrakech', description: 'Riad boutique avec piscine. 8 chambres décorées, petit déjeuner marocain sur terrasse, service spa.', lat: 31.6301, lng: -7.9911, category_id: hotel.id, user_id: owner2.id },
    { name: 'Les Bains de Marrakech', city: 'Marrakech', description: 'Spa de luxe alliant tradition hammam et soins modernes. Massages aux huiles essentielles, soins à l\'argan.', lat: 31.6218, lng: -7.9917, category_id: spa.id, user_id: owner2.id },
    { name: 'Blend Specialty Coffee', city: 'Casablanca', description: 'Café spécialisé proposant des single origins du monde entier. Baristas certifiés, méthodes alternatives.', lat: 33.5888, lng: -7.6234, category_id: cafe.id, user_id: owner3.id },
    { name: 'La Sqala', city: 'Casablanca', description: 'Restaurant dans les remparts historiques du 18ème siècle. Cuisine marocaine dans un jardin andalou magnifique.', lat: 33.6072, lng: -7.6208, category_id: restaurant.id, user_id: owner3.id },
    { name: 'Rick\'s Café Casablanca', city: 'Casablanca', description: 'Café-restaurant mythique inspiré du film Casablanca. Cuisine internationale, bar à cocktails, musique jazz live.', lat: 33.6089, lng: -7.6234, category_id: cafe.id, user_id: owner3.id },
    { name: 'Ain Diab Beach Club', city: 'Casablanca', description: 'Club de plage avec restaurant et piscine. Cuisine méditerranéenne et marocaine face à l\'Atlantique.', lat: 33.5966, lng: -7.6789, category_id: restaurant.id, user_id: owner3.id },
    { name: 'Dinarjat Restaurant', city: 'Rabat', description: 'Restaurant gastronomique dans un palais du 17ème siècle. Cuisine marocaine royale, plats anciens revisités.', lat: 34.0239, lng: -6.8371, category_id: restaurant.id, user_id: owner1.id },
    { name: 'Café Maure Oudaya', city: 'Rabat', description: 'Café historique dans les jardins andalous des Oudayas avec vue sur l\'Atlantique. Thé à la menthe, pâtisseries.', lat: 34.0329, lng: -6.8412, category_id: cafe.id, user_id: owner1.id },
    { name: 'El Morocco Club', city: 'Tanger', description: 'Restaurant mythique des années 50. Cuisine internationale et marocaine, vue sur le détroit de Gibraltar.', lat: 35.7770, lng: -5.8018, category_id: restaurant.id, user_id: owner3.id },
    { name: 'Saveur de Poisson', city: 'Tanger', description: 'Restaurant de poissons frais iconique. Menu unique selon les arrivages du jour. Expérience culinaire authentique.', lat: 35.7793, lng: -5.8125, category_id: restaurant.id, user_id: owner3.id },
    { name: 'Pure Passion Restaurant', city: 'Agadir', description: 'Restaurant de plage spécialisé en fruits de mer. Vue directe sur l\'Atlantique, terrasse face au coucher de soleil.', lat: 30.4202, lng: -9.5981, category_id: restaurant.id, user_id: owner2.id },
  ];

  const created = [];
  for (const b of bList) {
    const biz = await prisma.business.create({ data: { ...b, status: 'active' } });
    created.push(biz);
  }
  console.log(`✅ ${created.length} businesses créés`);

  // ─── REVIEWS ───
  const reviews = [
    { rating: 5, content: 'Ambiance incroyable, cuisine délicieuse ! Le burger marocain est à tomber.', user_id: customer1.id, business_id: created[0].id, moderation_status: 'approved' },
    { rating: 5, content: 'Amazing place in the heart of the medina. Vegetarian options are excellent!', user_id: customer2.id, business_id: created[0].id, moderation_status: 'approved' },
    { rating: 4, content: 'مكان رائع في قلب المدينة العتيقة. الأكل لذيذ والخدمة ممتازة', user_id: customer3.id, business_id: created[0].id, moderation_status: 'approved' },
    { rating: 5, content: 'Un de mes endroits préférés à Fès. Y revenir à chaque voyage !', user_id: customer1.id, business_id: created[0].id, moderation_status: 'approved' },
    { rating: 5, content: 'Romantic garden, exceptional food. Worth every dirham!', user_id: customer2.id, business_id: created[1].id, moderation_status: 'approved' },
    { rating: 4, content: 'Cadre magique, service attentionné. Prix élevé mais ça vaut le coup.', user_id: customer1.id, business_id: created[1].id, moderation_status: 'approved' },
    { rating: 5, content: '¡Jardín espectacular! La comida marroquí es auténtica y deliciosa.', user_id: customer2.id, business_id: created[1].id, moderation_status: 'approved' },
    { rating: 4, content: 'Meilleur restaurant végétarien de Fès. Produits bio locaux !', user_id: customer1.id, business_id: created[2].id, moderation_status: 'approved' },
    { rating: 5, content: 'مطعم نباتي ممتاز. أفضل مكان للنباتيين في فاس', user_id: customer3.id, business_id: created[2].id, moderation_status: 'approved' },
    { rating: 4, content: 'Tajine au poulet exceptionnel. Nourriture excellente.', user_id: customer1.id, business_id: created[3].id, moderation_status: 'approved' },
    { rating: 5, content: 'Best couscous in Morocco. Authentic and generous portions.', user_id: customer2.id, business_id: created[3].id, moderation_status: 'approved' },
    { rating: 5, content: 'Artisanat magnifique, prix honnêtes. La démonstration est fascinante !', user_id: customer1.id, business_id: created[4].id, moderation_status: 'approved' },
    { rating: 4, content: 'Beautiful handmade crafts. The artisans are very skilled.', user_id: customer2.id, business_id: created[4].id, moderation_status: 'approved' },
    { rating: 5, content: 'Le riad de mes rêves. Chaque détail est parfait, service 5 étoiles.', user_id: customer1.id, business_id: created[5].id, moderation_status: 'approved' },
    { rating: 5, content: 'Luxury at its finest in Fès medina. The breakfast alone is worth it.', user_id: customer2.id, business_id: created[5].id, moderation_status: 'approved' },
    { rating: 5, content: 'Vue imprenable sur Jemaa el-Fna. Cuisine moderne délicieuse !', user_id: customer1.id, business_id: created[8].id, moderation_status: 'approved' },
    { rating: 4, content: 'Great rooftop views and tasty food. A must in Marrakech!', user_id: customer2.id, business_id: created[8].id, moderation_status: 'approved' },
    { rating: 5, content: '¡Vistas espectaculares! La comida es deliciosa y el ambiente increíble.', user_id: customer2.id, business_id: created[8].id, moderation_status: 'approved' },
    { rating: 5, content: 'Meilleur smoothie bowl de ma vie ! Végétalien 100%, frais et délicieux.', user_id: customer1.id, business_id: created[9].id, moderation_status: 'approved' },
    { rating: 5, content: 'Best vegan café in Morocco! The açaí bowl is incredible.', user_id: customer2.id, business_id: created[9].id, moderation_status: 'approved' },
    { rating: 4, content: 'Grand choix d\'artisanat, prix corrects. Pensez à négocier !', user_id: customer1.id, business_id: created[10].id, moderation_status: 'approved' },
    { rating: 5, content: 'حرفيون موهوبون جداً. منتجات أصيلة وجميلة جداً', user_id: customer3.id, business_id: created[10].id, moderation_status: 'approved' },
    { rating: 5, content: 'Meilleur café specialty de Casablanca !', user_id: customer3.id, business_id: created[14].id, moderation_status: 'approved' },
    { rating: 5, content: 'Excellent specialty coffee! The baristas really know their craft.', user_id: customer2.id, business_id: created[14].id, moderation_status: 'approved' },
    { rating: 5, content: 'Cadre historique magnifique. Couscous du vendredi absolument divin !', user_id: customer1.id, business_id: created[15].id, moderation_status: 'approved' },
    { rating: 4, content: 'Beautiful historic setting. Food is authentic and delicious.', user_id: customer2.id, business_id: created[15].id, moderation_status: 'approved' },
    { rating: 5, content: 'Le thé à la menthe avec vue sur l\'Atlantique, c\'est le paradis !', user_id: customer1.id, business_id: created[19].id, moderation_status: 'approved' },
    { rating: 5, content: 'Most beautiful café setting in Morocco. The view is stunning!', user_id: customer2.id, business_id: created[19].id, moderation_status: 'approved' },
  ];

  await prisma.review.createMany({ data: reviews });
  console.log(`✅ ${reviews.length} reviews créées`);
  console.log('🎉 Seed complet ! 23 businesses · 28 reviews · fr/en/ar/es');
}

main()
  .catch((e) => { console.error('❌ Erreur seed:', e.message); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });