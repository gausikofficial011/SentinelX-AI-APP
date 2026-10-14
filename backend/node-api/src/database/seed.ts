import { Pool } from 'pg';
import bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../../.env') });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/sentinelx',
});

async function seed() {
  console.log('🌱 Starting database seed...');
  const defaultPassword = 'Demo@1234';
  const passwordHash = await bcrypt.hash(defaultPassword, 12);

  try {
    // 1. Clean existing demo data (Optional: truncate all for fresh seed)
    // await pool.query('TRUNCATE TABLE users, departments, stations CASCADE;');

    // 2. Create Departments
    const deptResult = await pool.query(`
      INSERT INTO departments (name, contact_phone, contact_email)
      VALUES ('Metropolitan Police Dept', '555-0100', 'hq@sentinelx.local')
      RETURNING id
    `);
    const deptId = deptResult.rows[0].id;

    // 3. Create Stations
    const stationResult = await pool.query(`
      INSERT INTO stations (department_id, name, location, address)
      VALUES ($1, 'Central District Station', ST_SetSRID(ST_MakePoint(77.2090, 28.6139), 4326), '100 Central Ave')
      RETURNING id
    `, [deptId]);
    const stationId = stationResult.rows[0].id;

    // 4. Create Demo Users (All Roles)
    const users = [
      { email: 'demo.citizen@sentinelx.local', name: 'Demo Citizen', role: 'CITIZEN' },
      { email: 'demo.officer@sentinelx.local', name: 'Demo Officer', role: 'OFFICER' },
      { email: 'demo.investigator@sentinelx.local', name: 'Demo Investigator', role: 'INVESTIGATOR' },
      { email: 'demo.dispatcher@sentinelx.local', name: 'Demo Dispatcher', role: 'DISPATCHER' },
      { email: 'demo.analyst@sentinelx.local', name: 'Demo Analyst', role: 'INTELLIGENCE_ANALYST' },
      { email: 'demo.admin@sentinelx.local', name: 'Demo Admin', role: 'ADMIN' },
      { email: 'demo.superadmin@sentinelx.local', name: 'Demo Superadmin', role: 'SUPER_ADMIN' },
    ];

    for (const u of users) {
      await pool.query(`
        INSERT INTO users (email, password_hash, full_name, role, department_id, is_active)
        VALUES ($1, $2, $3, $4, $5, true)
        ON CONFLICT (email) DO NOTHING
      `, [u.email, passwordHash, u.name, u.role, deptId]);
    }
    console.log('✅ Demo users seeded successfully');

    // Link Officer to Station
    const officerRes = await pool.query("SELECT id FROM users WHERE email = 'demo.officer@sentinelx.local'");
    if (officerRes.rows.length > 0) {
      await pool.query(`
        INSERT INTO officers (user_id, station_id, rank, is_on_duty)
        VALUES ($1, $2, 'Sergeant', true)
      `, [officerRes.rows[0].id, stationId]);
    }

    // 5. Seed some initial Public Alerts
    await pool.query(`
      INSERT INTO public_alerts (title, message, severity, area, expires_at)
      VALUES 
      ('Road Closure', 'Highway 12 closed for maintenance', 'WARNING', 'Downtown', NOW() + INTERVAL '2 days'),
      ('Weather Alert', 'Heavy rain expected this evening', 'INFO', 'All Districts', NOW() + INTERVAL '1 day')
    `);

    console.log('✅ Seeding completed');
    console.log(`🔑 Login for all demo users: Password = ${defaultPassword}`);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    await pool.end();
  }
}

seed();
