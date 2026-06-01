require('dotenv').config({ path: __dirname + '/../../.env' });
const prisma = require('../config/db.js');

async function main() {
  console.log('🔄 Normalizing business statuses...');
  
  const result = await prisma.business.updateMany({
    where: { status: 'active' },
    data: { status: 'approved' },
  });
  
  console.log(`✅ Migrated ${result.count} businesses from 'active' to 'approved'`);
  
  const stats = await prisma.business.groupBy({
    by: ['status'],
    _count: { id: true },
  });
  
  console.log('\n📊 Business status distribution after migration:');
  for (const s of stats) {
    console.log(`   ${s.status}: ${s._count.id}`);
  }
}

main()
  .catch((e) => {
    console.error('❌ Error:', e.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
