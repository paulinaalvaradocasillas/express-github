const express = require('express'); 
const app = express();             
const pool = require('./db');       


pool.connect()
  .then(() => {
    console.log('✅ Conexión exitosa a PostgreSQL');
  })
  .catch((err) => {
    console.error('❌ Error de conexión:', err);
  });


app.get('/', (req, res) => {
  res.send('API funcionando');
});


app.listen(3000, () => {
  console.log('🚀 Servidor corriendo en http://localhost:3000');
});