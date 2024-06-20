const { getDatabase, ref, onValue, update } = require('firebase/database');
const { initializeApp } = require('firebase/app');
const firebaseConfig = {
  apiKey: "AIzaSyC4AMtpdqIrFGJvCpH6R_dOmdbTZn72N64",
  authDomain: "integracion-3bba0.firebaseapp.com",
  projectId: "integracion-3bba0",
  storageBucket: "integracion-3bba0.appspot.com",
  messagingSenderId: "2748154650",
  appId: "1:2748154650:web:d20483cacfa2b488ae22a3"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const ordersRef = ref(database, 'orders');
onValue(ordersRef, (snapshot) => {
  const orders = snapshot.val();
  if (orders) {
    Object.values(orders).forEach(order => {
      if (order.status === 'new') {
        const productRef = ref(database, 'products/' + order.productId);
        onValue(productRef, (productSnapshot) => {
          const product = productSnapshot.val();
          if (product) {
            const updatedStock = product.stock - order.quantity;
            update(productRef, { stock: updatedStock });
            update(ref(database, 'orders/' + order.id), { status: 'processed' });
            console.log(`Updated product ${order.productId} with ${order.quantity} units`);
          }
        });
      }
    });
  }
});
