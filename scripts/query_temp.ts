import db from '../src/config/database.js';

async function main() {
  try {
    const hostelTypes = await db('hostel_type_master').select('*');
    console.log('--- hostel_type_master ---');
    console.log(hostelTypes);
  } catch (err) {
    console.error(err);
  } finally {
    await db.destroy();
  }
}

main();
