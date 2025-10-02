-- ========================================
-- TEST DATA INSERTS 
-- ========================================

-- USERS
INSERT INTO Users (email, full_name, password_hash, student_number, role)
VALUES
('alice@example.com', 'Alice Smith', 'hashedpassword1', 'S1001', 'buyer'),
('bob@example.com', 'Bob Johnson', 'hashedpassword2', 'S1002', 'seller'),
('carol@example.com', 'Carol Lee', 'hashedpassword3', 'S1003', 'seller'),
('dave@example.com', 'Dave Brown', 'hashedpassword4', 'S1004', 'buyer'),
('admin@example.com', 'Admin User', 'hashedpassword5', 'S0001', 'admin');

-- CATEGORIES
INSERT INTO Categories (name)
VALUES
('Books'),
('Electronics'),
('Furniture'),
('Services');

-- LISTINGS
INSERT INTO Listings (seller_id, category_id, type, description, price)
VALUES
(2, 1, 'product', 'Calculus Textbook, lightly used', 300.00),
(3, 2, 'product', 'Used Laptop Dell Inspiron', 4500.00),
(2, 3, 'product', 'Second-hand Office Chair', 750.00),
(3, 4, 'service', 'Tutoring Service: Mathematics', 200.00);

-- LISTING IMAGES
INSERT INTO Listing_Images (listing_id, url, alt_text)
VALUES
(1, 'uploads/book1.jpg', 'Calculus Textbook Cover'),
(2, 'uploads/laptop1.jpg', 'Dell Inspiron Laptop'),
(3, 'uploads/chair1.jpg', 'Office Chair'),
(4, 'uploads/tutor1.jpg', 'Math Tutoring');

-- BOOKINGS
INSERT INTO Bookings (listing_id, buyer_id, start_time, end_time, status)
VALUES
(1, 1, '2025-09-25 10:00', '2025-09-25 12:00', 'confirmed'),
(2, 4, '2025-09-26 14:00', '2025-09-26 16:00', 'requested');

-- TRANSACTIONS
INSERT INTO Transactions (listing_id, buyer_id, seller_id, amount, status)
VALUES
(1, 1, 2, 300.00, 'paid'),
(2, 4, 3, 4500.00, 'pending');

-- REVIEWS (using transaction_id now)
INSERT INTO Reviews (reviewer_id, reviewee_id, transaction_id, rating, comment)
VALUES
(1, 2, 1, 5, 'Great seller, fast delivery!'),
(4, 3, 2, 4, 'Laptop in good condition');

-- MESSAGE THREADS
INSERT INTO Message_Threads (listing_id, buyer_id, seller_id)
VALUES
(1, 1, 2),
(2, 4, 3);

-- MESSAGES
INSERT INTO Messages (thread_id, sender_id, body)
VALUES
(1, 1, 'Hi, is the textbook still available?'),
(1, 2, 'Yes, it is available.'),
(2, 4, 'Can I negotiate the laptop price?'),
(2, 3, 'Sure, make me an offer.');
