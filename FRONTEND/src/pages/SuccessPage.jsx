function SuccessPage() {
  return (
    <div className="page-container">
      <h2>🎉 Payment Successful!</h2>
      <p>Thank you for your order.</p>
      <Link to="/marketplace" className="btn-primary">Back to Marketplace</Link>
    </div>
  );
}
export default SuccessPage;
