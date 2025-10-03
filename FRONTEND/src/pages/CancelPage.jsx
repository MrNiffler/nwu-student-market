function CancelPage() {
  return (
    <div className="page-container">
      <h2>❌ Payment Cancelled</h2>
      <p>Your order was not completed.</p>
      <Link to="/cart" className="btn-secondary">Return to Cart</Link>
    </div>
  );
}
export default CancelPage;
