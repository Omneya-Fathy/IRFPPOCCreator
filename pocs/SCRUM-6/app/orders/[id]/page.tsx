import Link from "next/link";
import { notFound } from "next/navigation";
import { getEmailForOrder, getOrder } from "../../../lib/store";

type PageProps = { params: Promise<{ id: string }> };

export default async function OrderPage({ params }: PageProps) {
  const { id } = await params;
  const order = getOrder(id);
  if (!order) {
    notFound();
  }
  const email = getEmailForOrder(id);

  return (
    <section>
      <h1>Order confirmation</h1>
      <p data-testid="order-id">Order ID: {order.id}</p>
      <h2>Line items</h2>
      <ul data-testid="order-line-items">
        {order.items.map((item) => (
          <li key={item.isbn}>
            {item.title} (ISBN {item.isbn}) x{item.quantity} — EGP{" "}
            {(item.price * item.quantity).toFixed(2)}
          </li>
        ))}
      </ul>
      <p>Total: EGP {order.total.toFixed(2)}</p>
      <h2>Delivery address</h2>
      <p>
        {order.address.fullName}<br />
        {order.address.street}<br />
        {order.address.city}, {order.address.governorate}{" "}
        {order.address.postalCode}<br />
        {order.address.country}
      </p>
      {email && (
        <section data-testid="email-payload">
          <h2>Confirmation email payload</h2>
          <p>To: {email.to}</p>
          <p>Subject: {email.subject}</p>
          <pre>{email.body}</pre>
        </section>
      )}
      <p><Link href="/">Back to home</Link></p>
    </section>
  );
}
