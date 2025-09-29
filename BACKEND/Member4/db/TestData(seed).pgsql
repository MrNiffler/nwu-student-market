-- Insert sample users
INSERT INTO users (name, role) VALUES 
('Alice Buyer', 'buyer'),
('Bob Seller', 'seller'),
('Admin User', 'admin')
ON CONFLICT DO NOTHING;

-- Insert sample transaction
INSERT INTO transactions (buyer_id, seller_id, listing_id, status) 
VALUES (1, 2, 101, 'completed')
ON CONFLICT DO NOTHING;

-- Insert sample review
INSERT INTO reviews (transaction_id, reviewer_id, reviewee_id, rating, comment)
VALUES (1, 1, 2, 5, 'Great seller, smooth transaction!')
ON CONFLICT DO NOTHING;
