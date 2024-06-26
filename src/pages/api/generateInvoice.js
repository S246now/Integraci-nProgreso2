import { database } from '../../firebase';
import { ref, set, get, child, update } from 'firebase/database';
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

const CSV_DIRECTORY = path.join(process.cwd(), 'csv');

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { orderId } = req.body;

    try {
      // Leer la orden del archivo CSV
      const csvFilePath = path.join(CSV_DIRECTORY, `order_${orderId}.csv`);
      if (!fs.existsSync(csvFilePath)) {
        console.error('Archivo CSV no encontrado');
        res.status(404).json({ error: 'Archivo CSV no encontrado' });
        return;
      }

      const csvData = fs.readFileSync(csvFilePath, 'utf8');
      const records = parse(csvData, { columns: true });

      if (records.length < 1) {
        console.error('Datos CSV no válidos');
        res.status(400).json({ error: 'Datos CSV no válidos' });
        return;
      }

      const order = records[0];

      // Actualizar stock en Firebase
      const productsRef = ref(database, 'products');
      const productsSnapshot = await get(productsRef);

      if (!productsSnapshot.exists()) {
        console.error('No se encontraron productos en la base de datos');
        res.status(404).json({ error: 'No se encontraron productos en la base de datos' });
        return;
      }

      const products = productsSnapshot.val();
      let productKey = null;
      let stock = null;

      for (const key in products) {
        if (products[key].productId === order.productId.toString()) {
          productKey = key;
          stock = products[key].stock;
          break;
        }
      }

      if (!productKey) {
        console.error('Producto no encontrado');
        res.status(404).json({ error: 'Producto no encontrado' });
        return;
      }

      const newStock = stock - order.quantity;
      if (newStock < 0) {
        console.error('Stock insuficiente');
        res.status(400).json({ error: 'Stock insuficiente' });
        return;
      }

      const productRef = ref(database, `products/${productKey}`);
      await update(productRef, { stock: newStock });

      // Guardar factura en Firebase
      const invoiceRef = ref(database, `invoices/${orderId}`);
      await set(invoiceRef, { ...order, invoiceDate: new Date().toISOString() });

      res.status(200).json({ message: 'Factura generada y stock actualizado correctamente' });
    } catch (error) {
      console.error('Error al generar la factura y actualizar el stock:', error);
      res.status(500).json({ error: 'Error al generar la factura y actualizar el stock' });
    }
  } else {
    res.status(405).end(); // Método no permitido
  }
}
