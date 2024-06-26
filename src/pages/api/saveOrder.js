import { database } from '../../firebase';
import { ref, set, get, child } from 'firebase/database';
import { Parser } from 'json2csv';
import fs from 'fs';
import path from 'path';

const CSV_DIRECTORY = path.join(process.cwd(), 'csv');

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { orderData } = req.body;

    try {
      // Generar ID de orden
      const orderRef = ref(database, 'orders');
      const snapshot = await get(child(orderRef, 'latestOrderId'));
      const latestOrderId = snapshot.exists() ? snapshot.val() + 1 : 1;
      await set(ref(database, 'orders/latestOrderId'), latestOrderId);
      orderData.id = latestOrderId;

      // Guardar orden en Firebase
      await set(ref(database, 'orders/' + latestOrderId), orderData);

      // Guardar orden en CSV localmente
      if (!fs.existsSync(CSV_DIRECTORY)) {
        fs.mkdirSync(CSV_DIRECTORY);
      }
      const csvFilePath = path.join(CSV_DIRECTORY, `order_${latestOrderId}.csv`);
      const parser = new Parser({ header: true });
      const csv = parser.parse(orderData);
      fs.writeFileSync(csvFilePath, csv);

      res.status(200).json({ message: 'Orden guardada correctamente', orderId: latestOrderId });
    } catch (error) {
      res.status(500).json({ error: 'Error al guardar la orden y el archivo CSV.' });
    }
  } else {
    res.status(405).end(); // Método no permitido
  }
}
