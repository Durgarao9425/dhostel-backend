import { getMonthlyFeesSummary } from '../src/controllers/monthlyFeeController.js';
import db from '../src/config/database.js';

async function main() {
  const users = await db('users').where({ role_id: 2 }).select('user_id', 'full_name', 'email', 'hostel_id').limit(20);
  console.log('Owner users:', users);

  for (const u of users) {
    const req: any = {
      user: { user_id: u.user_id, role_id: 2, hostel_id: u.hostel_id },
      query: { onlyPending: 'true', page: 1, limit: 10 },
    };
    const res: any = {
      status: (code: number) => { console.log(`\n--- user_id=${u.user_id} (${u.full_name}) hostel_id=${u.hostel_id} => status ${code}`); return res; },
      json: (data: any) => {
        if (data.success === false) {
          console.log('ERROR RESPONSE:', JSON.stringify(data));
        } else {
          console.log('OK, fees count:', data.data?.fees?.length);
        }
        return res;
      }
    };
    try {
      await getMonthlyFeesSummary(req, res);
    } catch (e) {
      console.error(`THREW for user_id=${u.user_id}:`, e);
    }
  }
  process.exit(0);
}

main().catch(e => { console.error('FATAL', e); process.exit(1); });
