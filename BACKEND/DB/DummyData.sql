-- ========================================
-- Seed Script for NWU Student Marketplace
-- ========================================

-- ---------------------------
-- Clear existing data
-- ---------------------------
TRUNCATE TABLE messages, message_threads, reviews, transactions, bookings, cart, wishlist, listing_images, listings, categories, users RESTART IDENTITY CASCADE;

-- ---------------------------
-- Users
-- ---------------------------
INSERT INTO users (id, email, full_name, password_hash, student_number, role, status)
VALUES
(34364401, 'alice@student.nwu.ac.za', 'Alice Smith', '$2b$10$w2mw.U0IFDQoh5fNCO6.yehPmzXvZikXl/7DmMIKaZorUOOUIM9e2', 'S1001', 'user', 'active'),
(34364402, 'bob@student.nwu.ac.za', 'Bob Johnson', '$2b$10$w2mw.U0IFDQoh5fNCO6.yehPmzXvZikXl/7DmMIKaZorUOOUIM9e2', 'S1002', 'user', 'active'),
(34364403, 'carol@student.nwu.ac.za', 'Carol Williams', '$2b$10$w2mw.U0IFDQoh5fNCO6.yehPmzXvZikXl/7DmMIKaZorUOOUIM9e2', 'S1003', 'user', 'active'),
(34364404, 'dave@student.nwu.ac.za', 'Dave Brown', '$2b$10$w2mw.U0IFDQoh5fNCO6.yehPmzXvZikXl/7DmMIKaZorUOOUIM9e2', 'S1004', 'admin', 'active'),
(34364405, 'test@student.nwu.ac.za', 'Test User', '$2b$10$w2mw.U0IFDQoh5fNCO6.yehPmzXvZikXl/7DmMIKaZorUOOUIM9e2', 'S9999', 'user', 'active');

-- ---------------------------
-- Categories
-- ---------------------------
INSERT INTO categories (id, name, parent_id)
VALUES
(1, 'Electronics', NULL),
(2, 'Mobile Phones', 1),
(3, 'Computers', 1),
(4, 'Services', NULL),
(5, 'Tutoring', 4),
(6, 'Cleaning', 4);

-- ---------------------------
-- Listings
-- ---------------------------
INSERT INTO listings (id, seller_id, category_id, type, description, price, status)
VALUES
(101, 34364401, 2, 'product', 'iPhone 13 for sale, 128GB', 7500.00, 'active'),
(102, 34364403, 3, 'product', 'Laptop Dell Inspiron, 16GB RAM', 12000.00, 'active'),
(103, 34364404, 5, 'service', 'Math tutoring for first-year students', 200.00, 'active');

-- ---------------------------
-- Listing Images
-- ---------------------------
INSERT INTO listing_images (listing_id, url, alt_text)
VALUES
(101, 'https://example.com/images/iphone13.jpg', 'iPhone 13 front view'),
(102, 'https://example.com/images/dell_laptop.jpg', 'Dell Inspiron laptop'),
(103, 'https://example.com/images/tutoring.jpg', 'Math tutoring session');

-- ---------------------------
-- Bookings
-- ---------------------------
INSERT INTO bookings (listing_id, buyer_id, start_time, end_time, status)
VALUES
(103, 34364402, '2025-10-20 10:00:00', '2025-10-20 12:00:00', 'requested');

-- ---------------------------
-- Transactions
-- ---------------------------
INSERT INTO transactions (listing_id, buyer_id, seller_id, amount, status)
VALUES
(101, 34364402, 34364401, 7500.00, 'pending'),
(102, 34364402, 34364403, 12000.00, 'paid');

-- ---------------------------
-- Reviews
-- ---------------------------
INSERT INTO reviews (reviewer_id, reviewee_id, transaction_id, rating, comment)
VALUES
(34364402, 34364401, 1, 5, 'Great seller, very responsive!'),
(34364402, 34364403, 2, 4, 'Laptop as described, good service');

-- ---------------------------
-- Message Threads
-- ---------------------------
INSERT INTO message_threads (listing_id, buyer_id, seller_id)
VALUES
(101, 34364402, 34364401),
(102, 34364402, 34364403);

-- ---------------------------
-- Messages
-- ---------------------------
INSERT INTO messages (thread_id, sender_id, body)
VALUES
(1, 34364402, 'Hi, is the iPhone still available?'),
(1, 34364401, 'Yes, it is available.'),
(2, 34364402, 'Is the laptop still for sale?'),
(2, 34364403, 'Yes, it is ready for pickup.');

-- ---------------------------
-- Wishlist
-- ---------------------------
INSERT INTO wishlist (user_id, listing_id)
VALUES
(34364402, 101),
(34364402, 102);

-- ---------------------------
-- Cart
-- ---------------------------
INSERT INTO cart (user_id, listing_id, quantity)
VALUES
(34364402, 101, 1),
(34364402, 102, 1);
