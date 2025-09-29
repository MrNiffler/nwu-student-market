-- Users table (already exists in the bigger project, shown for context)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(20) CHECK (role IN ('buyer', 'seller', 'admin')),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Transactions table (already exists, shown for context)
CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    buyer_id INT REFERENCES users(id) ON DELETE CASCADE,
    seller_id INT REFERENCES users(id) ON DELETE CASCADE,
    listing_id INT,
    status VARCHAR(20) CHECK (status IN ('paid', 'completed', 'cancelled')),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Ratings & Reviews table (your Member 4 task)
CREATE TABLE IF NOT EXISTS reviews (
    id SERIAL PRIMARY KEY,
    transaction_id INT REFERENCES transactions(id) ON DELETE CASCADE,
    reviewer_id INT REFERENCES users(id) ON DELETE CASCADE,
    reviewee_id INT REFERENCES users(id) ON DELETE CASCADE,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE (transaction_id, reviewer_id) -- Prevent duplicate reviews per transaction
);
