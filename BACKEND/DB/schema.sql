-- ========================================
-- SQL Schema for Student Marketplace (PostgreSQL)
-- ========================================

-- USERS
CREATE TABLE Users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    student_number VARCHAR(50) NOT NULL,
    role VARCHAR(10) NOT NULL DEFAULT 'buyer' CHECK (role IN ('buyer','seller','admin')),
    status VARCHAR(10) DEFAULT 'active' CHECK (status IN ('active','banned')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- CATEGORIES
CREATE TABLE Categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    parent_id INT,
    CONSTRAINT fk_parent_category FOREIGN KEY (parent_id) REFERENCES Categories(id) ON DELETE SET NULL
);

-- LISTINGS
CREATE TABLE Listings (
    id SERIAL PRIMARY KEY,
    seller_id INT NOT NULL,
    category_id INT,
    type VARCHAR(10) NOT NULL CHECK (type IN ('product','service')),
    description TEXT NOT NULL,
    price NUMERIC(10,2),
    status VARCHAR(10) DEFAULT 'active' CHECK (status IN ('active','inactive')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_seller FOREIGN KEY (seller_id) REFERENCES Users(id) ON DELETE CASCADE,
    CONSTRAINT fk_category FOREIGN KEY (category_id) REFERENCES Categories(id) ON DELETE SET NULL
);

-- LISTING IMAGES
CREATE TABLE Listing_Images (
    id SERIAL PRIMARY KEY,
    listing_id INT NOT NULL,
    url VARCHAR(500) NOT NULL,
    alt_text VARCHAR(255),
    CONSTRAINT fk_listing_image FOREIGN KEY (listing_id) REFERENCES Listings(id) ON DELETE CASCADE
);

-- BOOKINGS
CREATE TABLE Bookings (
    id SERIAL PRIMARY KEY,
    listing_id INT NOT NULL,
    buyer_id INT NOT NULL,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    status VARCHAR(10) DEFAULT 'requested' CHECK (status IN ('requested','confirmed','cancelled')),
    CONSTRAINT fk_booking_listing FOREIGN KEY (listing_id) REFERENCES Listings(id) ON DELETE CASCADE,
    CONSTRAINT fk_booking_buyer FOREIGN KEY (buyer_id) REFERENCES Users(id) ON DELETE CASCADE
);

-- TRANSACTIONS
CREATE TABLE Transactions (
    id SERIAL PRIMARY KEY,
    listing_id INT NOT NULL,
    buyer_id INT NOT NULL,
    seller_id INT NOT NULL,
    amount NUMERIC(10,2) NOT NULL,
    status VARCHAR(10) DEFAULT 'pending' CHECK (status IN ('pending','paid','cancelled')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_transaction_listing FOREIGN KEY (listing_id) REFERENCES Listings(id) ON DELETE CASCADE,
    CONSTRAINT fk_transaction_buyer FOREIGN KEY (buyer_id) REFERENCES Users(id) ON DELETE CASCADE,
    CONSTRAINT fk_transaction_seller FOREIGN KEY (seller_id) REFERENCES Users(id) ON DELETE CASCADE
);

-- REVIEWS
CREATE TABLE Reviews (
    id SERIAL PRIMARY KEY,
    reviewer_id INT NOT NULL,
    reviewee_id INT NOT NULL,
    listing_id INT NOT NULL,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_review_reviewer FOREIGN KEY (reviewer_id) REFERENCES Users(id) ON DELETE CASCADE,
    CONSTRAINT fk_review_reviewee FOREIGN KEY (reviewee_id) REFERENCES Users(id) ON DELETE CASCADE,
    CONSTRAINT fk_review_listing FOREIGN KEY (listing_id) REFERENCES Listings(id) ON DELETE CASCADE
);

-- MESSAGE THREADS
CREATE TABLE Message_Threads (
    id SERIAL PRIMARY KEY,
    listing_id INT,
    buyer_id INT NOT NULL,
    seller_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_thread_listing FOREIGN KEY (listing_id) REFERENCES Listings(id) ON DELETE SET NULL,
    CONSTRAINT fk_thread_buyer FOREIGN KEY (buyer_id) REFERENCES Users(id) ON DELETE CASCADE,
    CONSTRAINT fk_thread_seller FOREIGN KEY (seller_id) REFERENCES Users(id) ON DELETE CASCADE
);

-- MESSAGES
CREATE TABLE Messages (
    id SERIAL PRIMARY KEY,
    thread_id INT NOT NULL,
    sender_id INT NOT NULL,
    body TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_message_thread FOREIGN KEY (thread_id) REFERENCES Message_Threads(id) ON DELETE CASCADE,
    CONSTRAINT fk_message_sender FOREIGN KEY (sender_id) REFERENCES Users(id) ON DELETE CASCADE
);
CREATE TABLE Refresh_Tokens (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES Users(id) ON DELETE CASCADE,
  token_hash VARCHAR(128) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP NOT NULL,
  revoked BOOLEAN DEFAULT FALSE,
  replaced_by_token_hash VARCHAR(128),
  user_agent TEXT,
  ip_address INET,
  last_used_at TIMESTAMP
);

CREATE INDEX idx_refresh_user_id ON Refresh_Tokens(user_id);