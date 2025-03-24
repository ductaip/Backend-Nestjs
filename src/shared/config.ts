import fs from 'fs'
import path from 'path'

if (!fs.existsSync(path.resolve('.env'))) {
  console.log('Khong tim thay .env')
  process.exit(1)
}
