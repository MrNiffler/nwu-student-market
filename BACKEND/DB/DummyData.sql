-- ========================================
-- SAMPLE DATA FOR STUDENT MARKETPLACE (PostgreSQL)
-- ========================================

-- USERS
INSERT INTO Users (email, full_name, password_hash, student_number, role, status)
VALUES
('john.doe@nwu.ac.za', 'John Doe', 'hashed_pw_123', '12345678', 'buyer', 'active'),
('jane.seller@nwu.ac.za', 'Jane Seller', 'hashed_pw_456', '87654321', 'seller', 'active'),
('admin@nwu.ac.za', 'System Admin', 'hashed_pw_789', '11223344', 'admin', 'active');

-- CATEGORIES
INSERT INTO Categories (name, parent_id)
VALUES
('Electronics', NULL),
('Books', NULL),
('Services', NULL),
('Tutoring', 3);  -- child of Services

-- LISTINGS
INSERT INTO Listings (seller_id, category_id, type, description, price, status)
VALUES
(2, 1, 'product', 'Dell Inspiron Laptop, good condition', 5000.00, 'active'),
(2, 2, 'product', 'Used Textbook: Database Systems, latest edition', 600.00, 'active'),
(2, 4, 'service', '1 hour SQL tutoring session', 200.00, 'active');

-- LISTING IMAGES
INSERT INTO Listing_Images (listing_id, url, alt_text)
VALUES
(1, 'https://example.com/images/laptop.jpg', 'Dell Inspiron Laptop'),
(2, 'https://example.com/images/book.jpg', 'Database Systems Textbook');

-- BOOKINGS
INSERT INTO Bookings (listing_id, buyer_id, start_time, end_time, status)
VALUES
(3, 1, '2025-09-20 14:00:00', '2025-09-20 15:00:00', 'confirmed');

-- TRANSACTIONS
INSERT INTO Transactions (listing_id, buyer_id, seller_id, amount, status)
VALUES
(1, 1, 2, 5000.00, 'paid'),
(2, 1, 2, 600.00, 'pending');

-- REVIEWS
INSERT INTO Reviews (reviewer_id, reviewee_id, listing_id, rating, comment)
VALUES
(1, 2, 1, 5, 'Great laptop, works perfectly!'),
(1, 2, 2, 4, 'Book was in good condition, but price a bit high.');

-- MESSAGE THREADS
INSERT INTO Message_Threads (listing_id, buyer_id, seller_id)
VALUES
(1, 1, 2),
(3, 1, 2);

-- MESSAGES
INSERT INTO Messages (thread_id, sender_id, body)
VALUES
(1, 1, 'Hi, is the laptop still available?'),
(1, 2, 'Yes, it is! Do you want to meet on campus?'),
(2, 1, 'Can I book a tutoring session for this weekend?'),
(2, 2, 'Sure, Saturday afternoon works.');
