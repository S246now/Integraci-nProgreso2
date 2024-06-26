import Link from 'next/link';

export default function InitialPage() {
  return (
    <div>
      <h1>Sistema de Órdenes de Compra</h1>
      <br />
      <Link href="/order" legacyBehavior>
        <a>Crear Nueva Orden de Compra</a>
      </Link>
      <br />
      <Link href="/invoice" legacyBehavior>
        <a>Sistema de Facturación</a>
      </Link>
    </div>
  );
}