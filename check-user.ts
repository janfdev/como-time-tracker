import 'dotenv/config'
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

async function check() {
  try {
    const result = await pool.query(
      'SELECT id, email, name, password IS NOT NULL as has_password, LENGTH(password) as pwd_len FROM users WHERE email = $1',
      ['demo@como.app']
    )
    console.log('Users found:', result.rows.length)
    if (result.rows.length > 0) {
      console.log(result.rows[0])
    } else {
      console.log('No user found with email demo@como.app')
    }
  } catch (err) {
    console.error('Error:', err)
  } finally {
    await pool.end()
  }
}

check()
