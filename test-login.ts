import 'dotenv/config'
import bcrypt from 'bcryptjs'
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

async function testLogin() {
  try {
    // Get user
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      ['demo@como.app']
    )

    if (result.rows.length === 0) {
      console.log('ERROR: User not found')
      return
    }

    const user = result.rows[0]
    console.log('User found:', user.email)

    // Test password
    const valid = await bcrypt.compare('password123', user.password)
    console.log('Password valid:', valid)

    if (!valid) {
      console.log('ERROR: Password does not match')
      // Let's check what the hash looks like
      console.log('Hash from DB:', user.password.substring(0, 20) + '...')
      
      // Generate new hash to compare
      const newHash = await bcrypt.hash('password123', 10)
      console.log('New hash:', newHash.substring(0, 20) + '...')
    } else {
      console.log('SUCCESS: Login would work!')
      console.log('User ID:', user.id)
    }
  } catch (err) {
    console.error('Error:', err)
  } finally {
    await pool.end()
  }
}

testLogin()
