const express = require('express');
const router = express.Router();
const client = require('../baseDatos');

// Obtener todos los productos de un pedido específico
router.get('/productos-por-pedido/:id_pedido', async (req, res) => {
  const { id_pedido } = req.params;
  const query = `
    SELECT p.nombre, p.precio, dp.cantidad, dp.subtotal
    FROM detallepedido dp
    JOIN producto p ON dp.id_prod = p.id_prod
    WHERE dp.id_pedido = $1
  `;
  try {
    const result = await client.query(query, [id_pedido]);
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener productos del pedido', error: error.message });
  }
});

// Obtener los productos más vendidos (más de X unidades)
router.get('/productos-mas-vendidos/:cantidad', async (req, res) => {
  const { cantidad } = req.params;
  const query = `
    SELECT p.nombre, SUM(dp.cantidad) AS total_vendido
    FROM detallepedido dp
    JOIN producto p ON dp.id_prod = p.id_prod
    GROUP BY p.nombre
    HAVING SUM(dp.cantidad) > $1
    ORDER BY total_vendido DESC
  `;
  try {
    const result = await client.query(query, [cantidad]);
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener productos más vendidos', error: error.message });
  }
});

// Obtener el total de ventas por restaurante
router.get('/ventas-por-restaurante', async (req, res) => {
  const query = `
    SELECT r.nombre AS restaurante, SUM(p.total) AS total_ventas
    FROM pedido p
    JOIN restaurante r ON p.id_rest = r.id_rest
    GROUP BY r.nombre
  `;
  try {
    const result = await client.query(query);
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener ventas por restaurante', error: error.message });
  }
});

// Obtener los pedidos realizados en una fecha específica
router.get('/pedidos-por-fecha/:fecha', async (req, res) => {
  const { fecha } = req.params;
  const query = `
    SELECT * FROM pedido
    WHERE fecha = $1
  `;
  try {
    const result = await client.query(query, [fecha]);
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener pedidos por fecha', error: error.message });
  }
});

// Obtener los empleados por rol en un restaurante
router.get('/empleados-por-rol/:id_rest', async (req, res) => {
    const { id_rest } = req.params;
    try {
      const result = await client.query(`
        SELECT e.rol, COUNT(*) AS cantidad_empleados
        FROM Empleado e
        WHERE e.id_rest = $1
        GROUP BY e.rol
      `, [id_rest]);
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener empleados por rol', error: error.message });
    }
  });
  

module.exports = router;
