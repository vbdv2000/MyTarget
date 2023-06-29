import sql from "mssql";

export async function conectarDB() {
  const config = {
    server: 'mytarget2.database.windows.net',
    port: 1433,
    database: 'mytarget',
    user: 'mytarget',
    password: 'Micontrasena6.',
    options: {
      encrypt: true,
      trustServerCertificate: false,
      connectTimeout: 30000
    }
  };

  try {
    const pool = await sql.connect(config);
    return pool;
  } catch (error) {
    console.log('Error connecting to SQL Server:', error);
    throw error;
  }
}
