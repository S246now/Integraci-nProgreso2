//generaión de factura y subida a la base de datos
import { database } from '../../firebase';
import { ref, push } from 'firebase/database';
import fs from 'fs';
import path from 'path';

const CSV_DIRECTORY = path.join(process.cwd(), 'csv');

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { orderId } = req.body;

    // Leer archivo CSV asociado al ID de orden
    const csvFilePath = path.join(CSV_DIRECTORY, `order_${orderId}.csv`);
    if (fs.existsSync(csvFilePath)) {
      const csvData = fs.readFileSync(csvFilePath, 'utf-8');

      // Subir información del CSV a la base de datos como factura
      const invoiceRef = ref(database, 'invoices');
      await push(invoiceRef, { orderId, csvData });

      // Eliminar archivo CSV temporal
      fs.unlinkSync(csvFilePath);

      res.status(200).json({ message: 'Factura generada y guardada correctamente' });
    } else {
      res.status(404).json({ message: 'No se encontró el archivo CSV asociado a la orden' });
    }
  } else {
    res.status(405).end(); // Método no permitido
  }
}
