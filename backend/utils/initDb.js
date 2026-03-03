import pool from '../config/db.js';

const schemaStatements = [
  `CREATE TABLE IF NOT EXISTS companies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    logo_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`,

  `CREATE TABLE IF NOT EXISTS materials (
    id INT AUTO_INCREMENT PRIMARY KEY,
    company_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    quantity DECIMAL(12,2) NOT NULL,
    unit VARCHAR(30) NOT NULL DEFAULT 'kg',
    cost_per_unit DECIMAL(12,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
  )`,

  `CREATE TABLE IF NOT EXISTS production (
    id INT AUTO_INCREMENT PRIMARY KEY,
    company_id INT NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    quantity DECIMAL(12,2) NOT NULL,
    cost DECIMAL(12,2) NOT NULL,
    date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
  )`,

  `CREATE TABLE IF NOT EXISTS sales (
    id INT AUTO_INCREMENT PRIMARY KEY,
    company_id INT NOT NULL,
    buyer_name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    quantity DECIMAL(12,2) NOT NULL,
    selling_price DECIMAL(12,2) NOT NULL,
    date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
  )`
];

export const initializeDatabase = async () => {
  const connection = await pool.getConnection();

  try {
    // Create tables
    for (const query of schemaStatements) {
      await connection.query(query);
    }

    // 🔥 Safe column check (only if table existed before)
    const [columns] = await connection.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'materials' 
      AND COLUMN_NAME = 'unit'
      AND TABLE_SCHEMA = DATABASE()
    `);

    if (columns.length === 0) {
      await connection.query(`
        ALTER TABLE materials
        ADD COLUMN unit VARCHAR(30) NOT NULL DEFAULT 'kg'
      `);
      console.log('✅ Added unit column to materials table');
    }

    console.log('✅ Database initialized successfully');

  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    throw error;
  } finally {
    connection.release();
  }
};