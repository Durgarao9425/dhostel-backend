import db from '../src/config/database.js';
async function main() {
  const cols = await db.raw("SHOW COLUMNS FROM monthly_fees");
  console.log(cols[0].map((c:any) => c.Field));
  process.exit(0);
}
main().catch(e => { console.error(e); process.exit(1); });
