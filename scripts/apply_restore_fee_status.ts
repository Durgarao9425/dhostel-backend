import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import db from '../src/config/database.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function main() {
  const sql = fs.readFileSync(path.join(__dirname, '../migrations/restore_fee_status_column.sql'), 'utf8');
  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'));

  for (const stmt of statements) {
    console.log('\n>>> Executing:\n', stmt.slice(0, 120), '...');
    await db.raw(stmt);
    console.log('OK');
  }

  const grouped = await db('monthly_fees')
    .select('fee_status')
    .count('* as count')
    .groupBy('fee_status');
  console.log('\nBackfilled fee_status distribution:', grouped);

  process.exit(0);
}

main().catch(e => { console.error('FAILED:', e); process.exit(1); });
