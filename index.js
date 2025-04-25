const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Importar las rutas
app.use('/api/restaurantes', require('./routes/restaurante'));
app.use('/api/empleados', require('./routes/empleado'));
app.use('/api/productos', require('./routes/producto'));
app.use('/api/pedidos', require('./routes/pedido'));
app.use('/api/detalles', require('./routes/detallePedido'));
app.use('/api/consultas', require('./routes/consultasNativas'));

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
