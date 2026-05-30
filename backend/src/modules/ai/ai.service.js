require('dotenv').config();
const prisma = require("../../config/db.js");

const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000;
function getCached(k) { const e = cache.get(k); if (!e) return null; if (Date.now()-e.ts>CACHE_TTL){cache.delete(k);return null;} return e.value; }
function setCache(k, v) { cache.set(k, {value:v, ts:Date.now()}); }

// ─── Descriptions multilingues ───
const DESCRIPTIONS = {
  'Café Clock':            { fr:'Café culturel emblématique. Menu végétarien, burgers marocains, jus frais. Terrasse vue médina.', en:'Iconic cultural café. Vegetarian menu, Moroccan burgers, fresh juices. Medina terrace view.', ar:'مقهى ثقافي مميز. قائمة نباتية، برغر مغربي، عصائر طازجة. تراس بإطلالة على المدينة.', es:'Icónico café cultural. Menú vegetariano, burgers marroquíes, zumos frescos. Terraza con vistas.' },
  'The Ruined Garden':     { fr:'Restaurant gastronomique dans un jardin riad historique. Cuisine fusion, ambiance romantique.', en:'Gastronomic restaurant in a historic riad garden. Fusion cuisine, romantic atmosphere.', ar:'مطعم فاخر في حديقة رياض تاريخية. مطبخ مدمج، أجواء رومانسية.', es:'Restaurante gastronómico en jardín riad. Cocina fusión, ambiente romántico.' },
  'Nur Restaurant':        { fr:'Restaurant bio et végétarien. Produits locaux, cuisine marocaine traditionnelle revisitée.', en:'Organic vegetarian restaurant. Local products, revisited traditional Moroccan cuisine.', ar:'مطعم عضوي ونباتي. منتجات محلية، مطبخ مغربي تقليدي معاصر.', es:'Restaurante ecológico vegetariano. Productos locales, cocina marroquí tradicional revisada.' },
  'Dar Hatim':             { fr:'Authentique cuisine marocaine. Tajines, couscous, pastilla. Musique andalouse en soirée.', en:'Authentic Moroccan cuisine. Tagines, couscous, pastilla. Andalusian music evenings.', ar:'مطبخ مغربي أصيل. طاجين، كسكس، بسطيلة. موسيقى أندلسية مسائية.', es:'Auténtica cocina marroquí. Tagines, cuscús, pastilla. Música andaluza por las noches.' },
  'Atelier Tissage Fassi': { fr:'Atelier artisanal. Zellige, broderie, tapis berbères faits main. Démonstrations gratuites.', en:'Craft workshop. Zellige, embroidery, handmade Berber rugs. Free demonstrations.', ar:'ورشة حرفية. زليج، تطريز، سجاد بربري يدوي. عروض توضيحية مجانية.', es:'Taller artesanal. Zellige, bordados, alfombras bereberes hechas a mano. Demostraciones gratis.' },
  'Riad Laaroussa':        { fr:'Riad de luxe classé patrimoine. 6 suites, piscine, restaurant gastronomique, spa.', en:'Heritage luxury riad. 6 suites, pool, gastronomic restaurant, spa.', ar:'رياض فاخر تراثي. 6 أجنحة، مسبح، مطعم فاخر، سبا.', es:'Riad de lujo patrimonial. 6 suites, piscina, restaurante gastronómico, spa.' },
  'Hammam Sidi Azzouz':    { fr:'Hammam traditionnel du 17ème siècle. Savon beldi, gommage, massage à l\'huile d\'argan.', en:'17th century traditional hammam. Beldi soap, scrub, argan oil massage.', ar:'حمام تقليدي من القرن السابع عشر. صابون بلدي، تقشير، تدليك بزيت الأرغان.', es:'Hammam tradicional del siglo XVII. Jabón beldi, exfoliación, masaje con aceite de argán.' },
  'Café Boulangerie Fassia':{ fr:'Boulangerie artisanale. Msemen, baghrir, pain frais. Petit déjeuner traditionnel.', en:'Artisan bakery. Msemen, baghrir, fresh bread. Traditional breakfast.', ar:'مخبزة حرفية. مسمن، بغرير، خبز طازج. فطور تقليدي.', es:'Panadería artesanal. Msemen, baghrir, pan fresco. Desayuno tradicional.' },
  'Nomad Restaurant':      { fr:'Restaurant moderne sur les toits. Vue sur Jemaa el-Fna. Cuisine marocaine contemporaine.', en:'Modern rooftop restaurant. Views over Jemaa el-Fna. Contemporary Moroccan cuisine.', ar:'مطعم عصري على الأسطح. إطلالة على جامع الفنا. مطبخ مغربي معاصر.', es:'Restaurante moderno en los tejados. Vistas a Jemaa el-Fna. Cocina marroquí contemporánea.' },
  'Earth Café Marrakech':  { fr:'Café 100% végétalien et bio. Smoothies detox, bowls colorés, wraps sains.', en:'100% vegan organic café. Detox smoothies, colorful bowls, healthy wraps.', ar:'مقهى نباتي 100٪ وعضوي. عصائر ديتوكس، أطباق ملونة، لفائف صحية.', es:'Café 100% vegano ecológico. Smoothies detox, bowls coloridos, wraps saludables.' },
  'Souk Artisanat Marrakchi':{ fr:'Coopérative de 30 artisans. Poterie, maroquinerie, babouches, bijoux berbères.', en:'Cooperative of 30 artisans. Pottery, leatherwork, babouches, Berber jewelry.', ar:'تعاونية 30 حرفياً. فخار، جلود، بلاغي، مجوهرات بربرية.', es:'Cooperativa de 30 artesanos. Cerámica, marroquinería, babuchas, joyería bereber.' },
  'Atelier Berbère':       { fr:'Tapis et textiles berbères faits main. Chaque pièce unique. Certifié équitable.', en:'Handmade Berber rugs and textiles. Each piece unique. Fair trade certified.', ar:'سجاد ومنسوجات بربرية يدوية. كل قطعة فريدة. معتمد للتجارة العادلة.', es:'Alfombras y textiles bereberes hechos a mano. Cada pieza única. Certificado comercio justo.' },
  'Riad Yasmine':          { fr:'Riad boutique avec piscine. 8 chambres décorées, petit déjeuner sur terrasse.', en:'Boutique riad with pool. 8 decorated rooms, rooftop breakfast.', ar:'رياض بوتيك مع مسبح. 8 غرف مزينة، فطور على السطح.', es:'Riad boutique con piscina. 8 habitaciones decoradas, desayuno en terraza.' },
  'Les Bains de Marrakech':{ fr:'Spa de luxe. Hammam, massages aux huiles essentielles, soins à l\'argan.', en:'Luxury spa. Hammam, essential oil massages, argan treatments.', ar:'سبا فاخر. حمام، تدليك بالزيوت الأساسية، علاجات الأرغان.', es:'Spa de lujo. Hammam, masajes con aceites esenciales, tratamientos de argán.' },
  'Blend Specialty Coffee': { fr:'Café spécialisé. Single origins du monde entier. Baristas certifiés.', en:'Specialty coffee. Single origins from around the world. Certified baristas.', ar:'مقهى متخصص. أصناف قهوة من حول العالم. باريستا معتمدون.', es:'Café especialidad. Orígenes únicos de todo el mundo. Baristas certificados.' },
  'La Sqala':              { fr:'Restaurant dans les remparts du 18ème siècle. Jardin andalou magnifique.', en:'Restaurant in 18th century ramparts. Beautiful Andalusian garden.', ar:'مطعم في الأسوار التاريخية. حديقة أندلسية رائعة.', es:'Restaurante en murallas del siglo XVIII. Hermoso jardín andaluz.' },
  'Rick\'s Café Casablanca':{ fr:'Café mythique inspiré du film. Cuisine internationale, jazz live chaque soir.', en:'Mythical café inspired by the film. International cuisine, live jazz every evening.', ar:'مقهى أسطوري مستوحى من الفيلم. مطبخ دولي، جاز حي كل مساء.', es:'Café mítico inspirado en la película. Cocina internacional, jazz en vivo cada noche.' },
  'Ain Diab Beach Club':   { fr:'Club de plage avec restaurant et piscine. Vue sur l\'Atlantique.', en:'Beach club with restaurant and pool. Atlantic ocean views.', ar:'نادي شاطئي مع مطعم ومسبح. إطلالة على المحيط الأطلسي.', es:'Club de playa con restaurante y piscina. Vistas al Océano Atlántico.' },
  'Dinarjat Restaurant':   { fr:'Palais du 17ème siècle. Cuisine marocaine royale, plats anciens revisités.', en:'17th century palace. Royal Moroccan cuisine, revisited ancient dishes.', ar:'قصر من القرن السابع عشر. مطبخ مغربي ملكي، أطباق قديمة معاصرة.', es:'Palacio del siglo XVII. Cocina marroquí real, platos antiguos revisitados.' },
  'Café Maure Oudaya':     { fr:'Café dans les jardins des Oudayas. Thé à la menthe, vue sur l\'Atlantique.', en:'Café in the Oudaya gardens. Mint tea, Atlantic ocean view.', ar:'مقهى في حدائق الأوداية. شاي بالنعناع، إطلالة على الأطلسي.', es:'Café en los jardines de Oudaya. Té de menta, vistas al Atlántico.' },
  'El Morocco Club':       { fr:'Restaurant mythique des années 50. Vue sur le détroit de Gibraltar.', en:'Mythical 1950s restaurant. Views over the Strait of Gibraltar.', ar:'مطعم أسطوري من الخمسينيات. إطلالة على مضيق جبل طارق.', es:'Restaurante mítico de los años 50. Vistas al Estrecho de Gibraltar.' },
  'Saveur de Poisson':     { fr:'Poissons frais, menu unique selon arrivages. Expérience authentique.', en:'Fresh fish, unique menu based on daily catch. Authentic experience.', ar:'أسماك طازجة، قائمة فريدة حسب الصيد اليومي. تجربة أصيلة.', es:'Pescado fresco, menú único según la captura del día. Experiencia auténtica.' },
  'Pure Passion Restaurant':{ fr:'Restaurant de plage. Fruits de mer, vue sur l\'Atlantique.', en:'Beach restaurant. Seafood, Atlantic ocean views.', ar:'مطعم شاطئي. مأكولات بحرية، إطلالة على الأطلسي.', es:'Restaurante de playa. Mariscos, vistas al Océano Atlántico.' },
};

// ─── Réponses multilingues ───
const RESPONSES = {
  fr: {
    vegetarian: [
      (city) => `${city} est un véritable paradis pour la cuisine végétarienne ! Voici nos meilleures adresses :`,
      (city) => `Si vous cherchez des plats végétariens à ${city}, voici d'excellentes adresses végétariennes ou veggie-friendly :`,
      (city) => `Voici une sélection de superbes spots proposant de délicieuses options végétariennes à ${city} :`
    ],
    halal: [
      (city) => `Voici les meilleures adresses proposant une cuisine halal à ${city}, toutes très bien notées :`,
      (city) => `Vous cherchez un bon restaurant halal à ${city} ? Voici notre sélection coup de cœur :`,
      (city) => `Découvrez ces excellents établissements halal incontournables à ${city} :`
    ],
    artisan: [
      (city) => `L'artisanat à ${city} est exceptionnel ! Voici les ateliers et coopératives à ne pas manquer :`,
      (city) => `Pour découvrir le savoir-faire local unique de ${city}, voici nos meilleures adresses d'artisans :`,
      (city) => `Voici ma sélection exclusive d'ateliers d'artisanat traditionnel à ${city} :`
    ],
    cafe: [
      (city) => `${city} possède une scène café incroyable et chaleureuse. Voici les adresses les mieux notées :`,
      (city) => `Pour un bon café ou une pause détente à ${city}, je vous recommande vivement ces adresses :`,
      (city) => `Voici les meilleurs cafés et salons de thé recommandés à ${city} :`
    ],
    default: [
      (city, cat) => `${city} regorge de magnifiques adresses ! Voici notre sélection de ${cat || "commerces"} recommandés :`,
      (city, cat) => `Si vous explorez ${city}, voici une sélection exclusive de ${cat || "lieux incontournables"} :`,
      (city, cat) => `Voici nos recommandations de ${cat || "commerces"} à ne pas manquer lors de votre visite à ${city} :`
    ],
    notFound: [
      (city, cat) => `Désolé, je n'ai pas trouvé de ${cat || "commerce"} correspondant à vos critères à ${city}. Voulez-vous essayer avec une autre catégorie ou une autre ville ?`,
      (city, cat) => `Aucun établissement de type ${cat || "commerce"} n'a été trouvé à ${city}. Souhaitez-vous élargir votre recherche ?`,
      (city, cat) => `Il semble que nous n'ayons pas de résultats pour les ${cat || "commerces"} à ${city}. Essayons de chercher dans une autre ville !`
    ],
    itinerary: 'Voulez-vous que je construise un itinéraire personnalisé pour votre soirée ?',
    yes: 'Oui, construire l\'itinéraire',
    map: 'Afficher sur la carte'
  },
  en: {
    vegetarian: [
      (city) => `${city} is a true paradise for vegetarian cuisine! Here are our top veggie-friendly recommendations:`,
      (city) => `Looking for vegetarian food in ${city}? You'll love these highly recommended spots:`,
      (city) => `Here is a selection of great restaurants offering delicious vegetarian options in ${city}:`
    ],
    halal: [
      (city) => `Here are the best halal dining spots in ${city}, all highly rated:`,
      (city) => `Looking for a great halal restaurant in ${city}? Here is our curated selection:`,
      (city) => `Discover these excellent halal-friendly establishments in ${city}:`
    ],
    artisan: [
      (city) => `${city}'s artisans are truly exceptional! Here are the workshops and co-ops you shouldn't miss:`,
      (city) => `To experience the unique local craftsmanship of ${city}, we highly recommend visiting these artisans:`,
      (city) => `Here is our exclusive selection of traditional craft workshops in ${city}:`
    ],
    cafe: [
      (city) => `${city} has a fantastic and vibrant café scene! Here are the top-rated places to visit:`,
      (city) => `For a great cup of coffee or a relaxing break in ${city}, we highly recommend these spots:`,
      (city) => `Here are the best cafés and tea houses recommended in ${city}:`
    ],
    default: [
      (city, cat) => `${city} has so much to offer! Here is our selection of recommended ${cat || "places"}:`,
      (city, cat) => `If you are exploring ${city}, here is a curated list of must-visit ${cat || "locations"}:`,
      (city, cat) => `Here are our top recommendations for ${cat || "places"} to visit during your stay in ${city}:`
    ],
    notFound: [
      (city, cat) => `Sorry, I couldn't find any ${cat || "places"} matching your criteria in ${city}. Would you like to try another category or city?`,
      (city, cat) => `No establishments of type ${cat || "place"} were found in ${city}. Would you like to broaden your search?`,
      (city, cat) => `We couldn't find any results for ${cat || "places"} in ${city}. Let's try searching for another town!`
    ],
    itinerary: 'Would you like me to build a personalized evening itinerary for you?',
    yes: 'Yes, build itinerary',
    map: 'Show on map'
  },
  ar: {
    vegetarian: [
      (city) => `${city} هي جنة حقيقية للمأكولات النباتية! إليك أفضل توصياتنا للأماكن الصديقة للنباتيين:`,
      (city) => `هل تبحث عن طعام نباتي في ${city}؟ ستعجبك هذه الأماكن الموصى بها بشدة:`,
      (city) => `إليك تشكيلة من المطاعم الرائعة التي تقدم خيارات نباتية لذيذة في ${city}:`
    ],
    halal: [
      (city) => `إليك أفضل مطاعم الحلال في ${city}، وجميعها حاصلة على تقييمات ممتازة:`,
      (city) => `تبحث عن مطعم حلال مميز في ${city}؟ إليك اختياراتنا المفضلة:`,
      (city) => `اكتشف هذه المنشآت الرائعة التي تقدم أطعمة حلال في ${city}:`
    ],
    artisan: [
      (city) => `الحرفيون في ${city} استثنائيون حقاً! إليك ورش العمل والتعاونيات التي لا يجب أن تفوتك:`,
      (city) => `لتجربة الحرف اليدوية المحلية الفريدة في ${city}، نوصي بشدة بزيارة هؤلاء الحرفيين:`,
      (city) => `إليك مجموعتنا المختارة الحصرية لورش الحرف التقليدية في ${city}:`
    ],
    cafe: [
      (city) => `تتمتع ${city} بمشهد مقاهٍ رائع وحيوي! إليك الأماكن الأعلى تقييماً للزيارة:`,
      (city) => `للحصول على كوب قهوة رائع أو استراحة مريحة في ${city}، نوصي بشدة بهذه الأماكن:`,
      (city) => `إليك أفضل المقاهي وصالونات الشاي الموصى بها في ${city}:`
    ],
    default: [
      (city, cat) => `مليئة بالأماكن الرائعة! إليك اختيارنا من ${cat || "المحلات"} الموصى بها في ${city}:`,
      (city, cat) => `إذا كنت تستكشف ${city}، فإليك قائمة منسقة من ${cat || "الأماكن التي يجب زيارتها"}:`,
      (city, cat) => `إليك أفضل توصياتنا لـ ${cat || "الأماكن"} التي يمكنك زيارتها أثناء إقامتك في ${city}:`
    ],
    notFound: [
      (city, cat) => `عذرًا، لم أتمكن من العثور على أي ${cat || "محلات"} تطابق معاييرك في ${city}. هل تود تجربة فئة أو مدينة أخرى؟`,
      (city, cat) => `لم يتم العثور على أي ${cat || "محل"} في ${city}. هل تود توسيع نطاق بحثك؟`,
      (city, cat) => `لم نجد أي نتائج لـ ${cat || "المحلات"} في ${city}. لنحاول البحث في مدينة أخرى!`
    ],
    itinerary: 'هل تريد أن أقوم بإعداد مسار رحلة مسائي مخصص لك؟',
    yes: 'نعم، بناء خط السير',
    map: 'عرض على الخريطة'
  },
  es: {
    vegetarian: [
      (city) => `¡${city} es un verdadero paraíso para la cocina vegetariana! Aquí están nuestras mejores recomendaciones:`,
      (city) => `¿Buscas comida vegetariana en ${city}? Te encantarán estos lugares recomendados:`,
      (city) => `Aquí tienes una selección de excelentes restaurantes con opciones vegetarianas en ${city}:`
    ],
    halal: [
      (city) => `Aquí están los mejores lugares de comida halal en ${city}, todos con excelentes valoraciones:`,
      (city) => `¿Buscas un buen restaurante halal en ${city}? Aquí tienes nuestra selección favorita:`,
      (city) => `Descubre estos excelentes establecimientos con opciones halal en ${city}:`
    ],
    artisan: [
      (city) => `¡Los artesanos de ${city} son realmente excepcionales! Aquí están los talleres y cooperativas que no debes perderte:`,
      (city) => `Para conocer la artesanía local única de ${city}, te recomendamos visitar a estos artesanos:`,
      (city) => `Aquí está nuestra selección exclusiva de talleres artesanales tradicionales en ${city}:`
    ],
    cafe: [
      (city) => `¡${city} tiene una escena de cafés fantástica y vibrante! Aquí están los lugares mejor valorados:`,
      (city) => `Para tomar un buen café o relajarte en ${city}, te recomendamos estos sitios:`,
      (city) => `Aquí tienes los mejores cafés y salones de té recomendados en ${city}:`
    ],
    default: [
      (city, cat) => `¡${city} tiene mucho que ofrecer! Aquí tienes nuestra selección de ${cat || "lugares"} recomendados:`,
      (city, cat) => `Si estás explorando ${city}, aquí tienes una lista de ${cat || "sitios de interés"} recomendados:`,
      (city, cat) => `Aquí tienes nuestras recomendaciones de ${cat || "lugares"} para visitar durante tu estancia en ${city}:`
    ],
    notFound: [
      (city, cat) => `Lo siento, no encontré ningún ${cat || "lugar"} que coincida con tus criterios en ${city}. ¿Quieres probar con otra categoría o ciudad?`,
      (city, cat) => `No se encontraron establecimientos de tipo ${cat || "lugar"} en ${city}. ¿Te gustaría ampliar tu búsqueda?`,
      (city, cat) => `Parece que no hay resultados para ${cat || "lugares"} en ${city}. ¡Intentemos buscar en otra ciudad!`
    ],
    itinerary: '¿Te gustaría que diseñara un itinerario nocturno personalizado para ti?',
    yes: 'Sí, construir itinerario',
    map: 'Ver en el mapa'
  }
};

const GREETINGS = {
  fr: ["bonjour", "salut", "bonsoir", "coucou", "allô", "salam"],
  en: ["hello", "hi", "hey", "greetings", "howdy"],
  ar: ["salam", "marhaban", "ahlan", "مرحبا", "سلام", "أهلاً", "السلام عليكم"],
  es: ["hola", "buenas", "saludos"]
};

const GREETING_RESPONSES = {
  fr: [
    "Bonjour ! Comment puis-je vous aider à découvrir les meilleures adresses au Maroc aujourd'hui ?",
    "Salut ! Je suis là pour vous guider vers les meilleurs restaurants, cafés et artisans locaux. Que recherchez-vous ?",
    "Bonjour ! Ravis de vous aider à explorer le Maroc. Quelle ville ou spécialité vous intéresse ?"
  ],
  en: [
    "Hello! How can I help you discover the best places in Morocco today?",
    "Hi there! Ready to explore? I can help you find top-rated restaurants, cafés, and local craft workshops.",
    "Hello! Welcome to LocalBoost AI. What kind of places are you looking for today?"
  ],
  ar: [
    "مرحباً بك! كيف يمكنني مساعدتك في اكتشاف أفضل الأماكن في المغرب اليوم؟",
    "أهلاً وسهلاً! أنا هنا لمساعدتك في العثور على أفضل المطاعم والمقاهي والحرفيين المحليين. ماذا تفضل؟",
    "مرحباً! يسعدني مساعدتك في استكشاف المغرب. ما هي المدينة أو الأماكن التي تود زيارتها؟"
  ],
  es: [
    "¡Hola! ¿Cómo puedo ayudarte a descubrir los mejores lugares en Marruecos hoy?",
    "¡Hola! Estoy aquí para guiarte a los mejores restaurantes, cafés y talleres artesanales. ¿Qué estás buscando?",
    "¡Hola! Bienvenido a LocalBoost AI. ¿Qué tipo de lugares te gustaría explorar hoy?"
  ]
};

// Helper for selecting random response template
function getResponseText(type, lang, param1, param2) {
  const langResponses = RESPONSES[lang] || RESPONSES.fr;
  const templates = langResponses[type];
  if (!templates) return '';
  if (typeof templates === 'string') return templates;
  const template = templates[Math.floor(Math.random() * templates.length)];
  return template(param1, param2);
}

// ─── Détecter la langue ───
function detectLang(message) {
  if (/[\u0600-\u06FF]/.test(message)) return 'ar';
  const msg = message.toLowerCase();
  const fr = ['je','cherche','voudrais','bonjour','végétarien','trouver','restaurant','à','fès','marrakech','meilleur','café'];
  const es = ['busco','quiero','restaurante','hola','vegetariano','encontrar','en','presupuesto','artesano'];
  const en = ['looking','want','find','restaurant','hello','vegetarian','budget','near','best','café','coffee'];
  const frS = fr.filter(w=>msg.includes(w)).length;
  const esS = es.filter(w=>msg.includes(w)).length;
  const enS = en.filter(w=>msg.includes(w)).length;
  if (esS>frS && esS>enS) return 'es';
  if (enS>frS) return 'en';
  return 'fr';
}

// Helper to check words with boundary boundaries (for both Latin and Arabic support)
function matchWord(msg, patterns) {
  return patterns.some(pattern => {
    const escaped = pattern.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`(?:^|[\\s.,;!?'"()\\-\\u060C\\u061F])` + escaped + `(?:$|[\\s.,;!?'"()\\-\\u060C\\u061F])`, 'i');
    return regex.test(msg);
  });
}

function isGreeting(message) {
  const cleanMsg = message.toLowerCase().trim().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, "");
  if (!cleanMsg) return false;
  
  const allGreetings = [].concat(...Object.values(GREETINGS));
  if (allGreetings.includes(cleanMsg)) {
    return true;
  }
  
  const words = cleanMsg.split(/\s+/);
  if (words.length <= 2 && words.some(w => allGreetings.includes(w))) {
    const lower = message.toLowerCase();
    const cityKeywords = ['fès', 'fes', 'fez', 'فاس', 'casablanca', 'casa', 'الدار البيضاء', 'marrakech', 'marrakesh', 'مراكش', 'rabat', 'الرباط', 'tanger', 'tangier', 'طنجة', 'agadir', 'أكادير'];
    const catKeywords = ['restaurant', 'manger', 'dîner', 'food', 'مطعم', 'restaurante', 'eat', 'café', 'cafe', 'coffee', 'مقهى', 'artisan', 'souk', 'artisanat', 'حرف', 'artesano', 'craft'];
    const hasCity = cityKeywords.some(city => lower.includes(city));
    const hasCat = catKeywords.some(cat => lower.includes(cat));
    if (hasCity || hasCat) {
      return false;
    }
    return true;
  }
  
  return false;
}

// ─── Parser l'intention ───
function parseIntent(message) {
  const msg = message.toLowerCase();
  const intent = { city: null, category: null, maxPrice: null, vegetarian: false, halal: false, artisan: false };
  
  const cities = [
    { p: ['fès', 'fes', 'fez', 'فاس'], n: 'Fès' },
    { p: ['casablanca', 'casa', 'الدار البيضاء'], n: 'Casablanca' },
    { p: ['marrakech', 'marrakesh', 'مراكش'], n: 'Marrakech' },
    { p: ['rabat', 'الرباط'], n: 'Rabat' },
    { p: ['tanger', 'tangier', 'طنجة'], n: 'Tanger' },
    { p: ['agadir', 'أكادير'], n: 'Agadir' },
  ];
  
  for (const c of cities) {
    if (matchWord(msg, c.p)) {
      intent.city = c.n;
      break;
    }
  }
  
  const restaurantKeywords = ['restaurant', 'restaurants', 'manger', 'dîner', 'diner', 'food', 'foods', 'مطعم', 'مطاعم', 'restaurante', 'restaurantes', 'eat', 'eats', 'dining'];
  const cafeKeywords = ['café', 'cafes', 'cafés', 'cafe', 'coffee', 'coffees', 'مقهى', 'مقاهي', 'cafeteria'];
  const artisanKeywords = ['artisan', 'artisans', 'souk', 'souks', 'artisanat', 'حرف', 'حرفي', 'حرفية', 'artesano', 'artesanos', 'craft', 'crafts', 'workshop', 'workshops'];
  const vegetarianKeywords = ['végétarien', 'végétarienne', 'végétariens', 'végétariennes', 'vegetarian', 'vegetarians', 'vegan', 'vegans', 'végétalien', 'végétalienne', 'نباتي', 'نباتية', 'vegetariano', 'vegetariana'];
  const halalKeywords = ['halal', 'حلال'];
  
  if (matchWord(msg, restaurantKeywords)) intent.category = 'restaurant';
  if (matchWord(msg, cafeKeywords)) intent.category = 'café';
  if (matchWord(msg, artisanKeywords)) {
    intent.category = 'artisan';
    intent.artisan = true;
  }
  
  if (matchWord(msg, vegetarianKeywords)) intent.vegetarian = true;
  if (matchWord(msg, halalKeywords)) intent.halal = true;
  
  // Price parsing
  // 1. Number followed by currency
  const currencyMatch = msg.match(/\b(\d+)\s*(?:dh|mad|dirhams?|dirhems?|درهم|درهماً|euros?|€|\$)\b/i);
  if (currencyMatch) {
    intent.maxPrice = parseInt(currencyMatch[1]);
  } else {
    // 2. Price indicator followed by number
    const indicatorMatch = msg.match(/\b(?:budget|max|under|price|prix|moins de|sous|أقل من|ميزانية|سعر|presupuesto|bajo|menos de)\s*(?:de|of|under|limit|limite|à|a)?\s*(\d+)\b/i);
    if (indicatorMatch) {
      intent.maxPrice = parseInt(indicatorMatch[1]);
    } else {
      // 3. Number followed by max indicator
      const reverseMatch = msg.match(/\b(\d+)\s*(?:max|budget|dirhams?|dirhems?|dh|mad)\b/i);
      if (reverseMatch) {
        intent.maxPrice = parseInt(reverseMatch[1]);
      }
    }
  }
  
  return intent;
}

function isVegetarianBusiness(b) {
  const name = (b.name || '').toLowerCase();
  const desc = (b.description || '').toLowerCase();
  const vegKeywords = ['végétarien', 'vegetarian', 'vegan', 'végétalien', 'vegetariano', 'vegetariana', 'نباتي', 'نباتية'];
  
  if (vegKeywords.some(kw => name.includes(kw) || desc.includes(kw))) {
    return true;
  }
  if (b._descriptions) {
    for (const lang of Object.keys(b._descriptions)) {
      const transDesc = (b._descriptions[lang] || '').toLowerCase();
      if (vegKeywords.some(kw => transDesc.includes(kw))) {
        return true;
      }
    }
  }
  return false;
}

function isHalalBusiness(b) {
  const name = (b.name || '').toLowerCase();
  const desc = (b.description || '').toLowerCase();
  const halalKeywords = ['halal', 'حلال'];
  
  if (halalKeywords.some(kw => name.includes(kw) || desc.includes(kw))) {
    return true;
  }
  if (b._descriptions) {
    for (const lang of Object.keys(b._descriptions)) {
      const transDesc = (b._descriptions[lang] || '').toLowerCase();
      if (halalKeywords.some(kw => transDesc.includes(kw))) {
        return true;
      }
    }
  }
  return false;
}

// ─── Fetch businesses depuis DB ───
async function fetchBusinesses({ city, category, maxPrice, vegetarian, halal }) {
  const key = JSON.stringify({ city, category, maxPrice, vegetarian, halal });
  const cached = getCached(key);
  if (cached) return cached;

  const where = {};
  if (city) where.city = { contains: city, mode: 'insensitive' };

  if (category) {
    let searchTerms = [category];
    if (category === 'restaurant') {
      searchTerms = ['restaurant', 'restaurante', 'مطعم'];
    } else if (category === 'café' || category === 'cafe') {
      searchTerms = ['café', 'cafe', 'coffee', 'مقهى'];
    } else if (category === 'artisan' || category === 'artisanat' || category === 'craft') {
      searchTerms = ['artisanat', 'craft', 'artesan', 'حرف'];
    } else if (category === 'hotel' || category === 'riad') {
      searchTerms = ['hotel', 'riad', 'فندق'];
    } else if (category === 'spa' || category === 'hammam') {
      searchTerms = ['spa', 'hammam', 'حمام'];
    }

    const conditions = [];
    for (const term of searchTerms) {
      conditions.push(
        { name_fr: { contains: term, mode: 'insensitive' } },
        { name_en: { contains: term, mode: 'insensitive' } },
        { name_ar: { contains: term, mode: 'insensitive' } },
        { name_es: { contains: term, mode: 'insensitive' } }
      );
    }
    where.category = { OR: conditions };
  }

  const businesses = await prisma.business.findMany({
    where,
    include: {
      category: true,
      reviews: { where: { moderation_status: 'approved' }, select: { rating: true } }
    },
    take: 40
  });

  let enriched = businesses.map(b => {
    const ratings = b.reviews.map(r => r.rating);
    const avgRating = ratings.length > 0 ? parseFloat((ratings.reduce((a, c) => a + c, 0) / ratings.length).toFixed(1)) : null;
    return {
      id: b.id,
      name: b.name,
      city: b.city,
      category: b.category?.name_fr || 'Autre',
      lat: b.lat,
      lng: b.lng,
      images: b.images,
      avgRating,
      reviewCount: ratings.length,
      estimatedPrice: Math.floor(Math.random() * 150) + 50,
      description: b.description,
      _descriptions: DESCRIPTIONS[b.name] || null
    };
  });

  // Fetch newly registered merchants from SQLite DB
  let sqliteBiz = [];
  try {
    const { all: dbAll } = require('../../database/sqlite.js');
    let query = `SELECT * FROM ai2_profiles WHERE 1=1`;
    const params = [];
    if (city) {
      query += ` AND city LIKE ?`;
      params.push(`%${city}%`);
    }
    if (category) {
      let searchCat = category;
      if (category === 'café') searchCat = 'cafe';
      query += ` AND category LIKE ?`;
      params.push(`%${searchCat}%`);
    }
    const rows = await dbAll(query, params);
    sqliteBiz = rows.map(r => {
      let photos = [];
      try {
        photos = r.photos ? JSON.parse(r.photos) : [];
      } catch(e) {
        photos = [];
      }
      return {
        id: `ai2-${r.id}`,
        name: r.name,
        city: r.city,
        category: r.category || 'Autre',
        lat: 34.0631 + (Math.random() - 0.5) * 0.01,
        lng: -5.0009 + (Math.random() - 0.5) * 0.01,
        images: photos.length > 0 ? photos.map(p => p.startsWith('/uploads') ? `http://localhost:5000${p}` : p) : ['https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500'],
        avgRating: 5.0, // Default perfect rating for new registered profiles
        reviewCount: 1,
        estimatedPrice: 75,
        description: r.tagline || r.special_offers || 'Nouveau commerce enregistré sur LocalBoost !',
        _descriptions: {
          fr: r.tagline || 'Nouveau commerce sur LocalBoost !',
          en: r.tagline || 'New business on LocalBoost!',
          ar: r.tagline || 'عمل تجاري جديد على LocalBoost!',
          es: r.tagline || '¡Nuevo negocio en LocalBoost!'
        }
      };
    });
  } catch (err) {
    console.error("[SQLite Fetch Chatbot Error]", err);
  }

  // Combine both sources
  let allBiz = [...sqliteBiz, ...enriched];

  // Sort by rating (highest first)
  allBiz.sort((a, b) => {
    const ratingA = a.avgRating !== null ? a.avgRating : 0;
    const ratingB = b.avgRating !== null ? b.avgRating : 0;
    return ratingB - ratingA;
  });

  // Apply vegetarian filtering if requested
  if (vegetarian) {
    allBiz = allBiz.filter(isVegetarianBusiness);
  }

  // Apply halal filtering if requested
  if (halal) {
    const halalMatched = allBiz.filter(isHalalBusiness);
    if (halalMatched.length > 0) {
      allBiz = halalMatched;
    } else {
      allBiz = allBiz.filter(b => b.category === 'Restaurant' || b.category === 'Café');
    }
  }

  // Apply maxPrice filtering if requested
  if (maxPrice) {
    allBiz = allBiz.filter(b => b.estimatedPrice <= maxPrice);
  }

  setCache(key, allBiz);
  return allBiz;
}

// ─── Générer réponse avec description dans la bonne langue ───
async function generateAIResponse(userMessage, conversationHistory = [], options = {}) {
  const { lang: requestedLang, tone = 'default', tags = [] } = options;
  const lang = requestedLang || detectLang(userMessage);

  // If message is a greeting, handle it cleanly and return immediately (no DB query)
  if (isGreeting(userMessage)) {
    const greetingsList = GREETING_RESPONSES[lang] || GREETING_RESPONSES.fr;
    let text = greetingsList[Math.floor(Math.random() * greetingsList.length)];
    
    if (tone === 'friendly') {
      text = "👋 " + text + " 😊✨";
    } else if (tone === 'professional') {
      text = text + " Nous sommes à votre écoute.";
    }
    
    return {
      text,
      suggestions: [],
      followUp: null,
      intent: { city: null, category: null, maxPrice: null, vegetarian: false, halal: false, artisan: false },
      lang,
      tone,
      timestamp: new Date().toISOString()
    };
  }

  const intent = parseIntent(userMessage);
  const businesses = await fetchBusinesses(intent);
  const city = intent.city || 'Maroc';

  // If no businesses found → return a clean fallback message only
  if (businesses.length === 0) {
    const text = getResponseText('notFound', lang, city, intent.category);
    return {
      text,
      suggestions: [],
      followUp: null,
      intent,
      lang,
      tone,
      timestamp: new Date().toISOString()
    };
  }

  // Generate appropriate response text based on query intent
  let responseType = 'default';
  if (intent.vegetarian) {
    responseType = 'vegetarian';
  } else if (intent.halal) {
    responseType = 'halal';
  } else if (intent.artisan) {
    responseType = 'artisan';
  } else if (intent.category === 'café') {
    responseType = 'cafe';
  }

  let responseText = getResponseText(responseType, lang, city, intent.category);

  // Tone post-processing
  if (tone === 'friendly') {
    const intros = {
      fr: "Coucou ! 😊 Voici ce que j'ai déniché pour vous :",
      en: "Hey there! 😊 Check out these awesome spots I found for you:",
      ar: "أهلاً بك! 😊 إليك بعض الأماكن الرائعة التي وجدتها لك:",
      es: "¡Hola! 😊 Mira estos lugares increíbles que encontré para ti:"
    };
    const outros = {
      fr: " J'espère que vous allez adorer ! N'hésitez pas si vous voulez d'autres idées ! ✨",
      en: " Hope you love them! Let me know if you want any other recommendations! ✨",
      ar: "أتمنى أن تنال إعجابك! لا تتردد في طلب المزيد من الاقتراحات! ✨",
      es: "¡Espero que te gusten! ¡No dudes en pedir más sugerencias si las necesitas! ✨"
    };
    responseText = `${intros[lang] || intros.fr}\n\n${responseText}\n\n${outros[lang] || outros.fr}`;
  } else if (tone === 'professional') {
    const intros = {
      fr: "Bonjour. Suite à votre requête, veuillez trouver ci-dessous notre sélection d'établissements recommandés :",
      en: "Dear traveler, please find below our recommended selection based on your criteria:",
      ar: "مرحباً. بناءً على طلبك، يرجى الاطلاع على خياراتنا الموصى بها أدناه:",
      es: "Estimado viajero, a continuación encontrará nuestra selección de establecimientos recomendados:"
    };
    const outros = {
      fr: " Nous restons à votre entière disposition pour tout renseignement complémentaire.",
      en: " We remain at your service for any further inquiries.",
      ar: "نحن في خدمتكم لأي استفسارات إضافية.",
      es: "Quedamos a su entera disposición para cualquier consulta adicional."
    };
    responseText = `${intros[lang] || intros.fr}\n\n${responseText}\n\n${outros[lang] || outros.fr}`;
  } else if (tone === 'luxurious' || tone === 'luxury') {
    const intros = {
      fr: "Vivez l'extraordinaire au Maroc. Découvrez notre sélection d'adresses exclusives et prestigieuses :",
      en: "Experience the extraordinary in Morocco. Discover our selection of exclusive and prestigious addresses:",
      ar: "عش تجربة استثنائية في المغرب. اكتشف مجموعتنا المختارة من العناوين الحصرية والفاخرة:",
      es: "Viva una experiencia extraordinaria en Marruecos. Descubra nuestra selección de direcciones exclusivas y prestigiosas:"
    };
    const outros = {
      fr: " Que votre séjour soit empreint d'élégance, de sérénité et de raffinement ultime.",
      en: " May your visit be filled with elegance, serenity, and ultimate refinement.",
      ar: "نتمنى لكم زيارة مليئة بالأناقة والرفاهية والراحة القصوى.",
      es: "Que su estancia esté llena de elegancia, serenidad y el máximo refinamiento."
    };
    responseText = `${intros[lang] || intros.fr}\n\n${responseText}\n\n${outros[lang] || outros.fr}`;
  }

  // Filter recommendations: apply tags filtering if requested
  let filtered = [...businesses];
  if (tags && tags.length > 0) {
    filtered = filtered.filter(b => {
      const searchSpace = `${b.name} ${b.description} ${b.category} ${b._descriptions ? Object.values(b._descriptions).join(' ') : ''}`.toLowerCase();
      return tags.some(tag => searchSpace.includes(tag.toLowerCase()));
    });
    // Fallback if tag filtering yielded nothing
    if (filtered.length === 0) filtered = [...businesses];
  }

  // Format suggestions: limit to top 3, ensure keys: name, description, rating, city
  const suggestions = filtered.slice(0, 3).map(b => ({
    name: b.name,
    description: b._descriptions ? (b._descriptions[lang] || b._descriptions.fr) : (b.description || ""),
    rating: b.avgRating || 0,
    city: b.city,
    id: b.id,
    category: b.category,
    lat: b.lat,
    lng: b.lng,
    images: b.images,
    avgRating: b.avgRating,
    reviewCount: b.reviewCount,
    estimatedPrice: b.estimatedPrice
  }));

  const langResponses = RESPONSES[lang] || RESPONSES.fr;
  const followUp = filtered.length >= 2 ? {
    question: langResponses.itinerary,
    options: [langResponses.yes, langResponses.map]
  } : null;

  return {
    text: responseText,
    suggestions,
    followUp,
    intent,
    lang,
    tone,
    timestamp: new Date().toISOString()
  };
}

// ─── Itinéraire multilingue ───
async function generateItinerary(city, lang = 'fr', preferences = {}) {
  const businesses = await fetchBusinesses({ city, ...preferences });
  if (businesses.length === 0) {
    const noResultsMsg = {
      fr: 'Aucun établissement trouvé.',
      en: 'No establishments found.',
      ar: 'لم يتم العثور على أي مكان.',
      es: 'No se encontraron establecimientos.'
    };
    return { steps: [], message: noResultsMsg[lang] || noResultsMsg.fr };
  }

  const tips = {
    fr: ['Réservez à l\'avance.', 'Essayez la spécialité maison.', 'Profitez de la terrasse.'],
    en: ['Book ahead, very popular.', 'Try the house specialty.', 'Enjoy the terrace if weather permits.'],
    ar: ['احجز مسبقاً.', 'جرب تخصص المطعم.', 'استمتع بالتراس إذا أمكن.'],
    es: ['Reserve con anticipación.', 'Pruebe la especialidad de la casa.', 'Disfrute de la terraza.']
  };
  const t = tips[lang] || tips.fr;
  const selected = businesses.slice(0, 3);

  return {
    city,
    lang,
    steps: selected.map((b, i) => ({
      order: i + 1,
      time: ['19:00', '20:30', '22:00'][i],
      business: {
        name: b.name,
        description: b._descriptions ? (b._descriptions[lang] || b._descriptions.fr) : (b.description || ""),
        rating: b.avgRating || 0,
        city: b.city,
        id: b.id,
        category: b.category,
        lat: b.lat,
        lng: b.lng,
        images: b.images,
        avgRating: b.avgRating,
        reviewCount: b.reviewCount,
        estimatedPrice: b.estimatedPrice
      },
      tip: t[i] || t[0]
    })),
    totalEstimatedCost: selected.reduce((s, b) => s + b.estimatedPrice, 0)
  };
}

module.exports = { generateAIResponse, generateItinerary, fetchBusinesses, detectLang, parseIntent };