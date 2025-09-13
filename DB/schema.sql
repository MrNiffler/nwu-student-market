-- ========================================
-- SQL Schema for Student Marketplace
-- Based on Dark ERD (simplified roles)
-- ========================================

-- USERS
CREATE TABLE Users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    student_number VARCHAR(50) NOT NULL,
    role ENUM('buyer', 'seller', 'admin') NOT NULL DEFAULT 'buyer',
    status ENUM('active', 'banned') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- CATEGORIES
CREATE TABLE Categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    parent_id INT,
    FOREIGN KEY (parent_id) REFERENCES Categories(id) ON DELETE SET NULL
);

-- LISTINGS
CREATE TABLE Listings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    seller_id INT NOT NULL,
    category_id INT,
    type ENUM('product', 'service') NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10,2),
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (seller_id) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES Categories(id) ON DELETE SET NULL
);

-- LISTING IMAGES
CREATE TABLE Listing_Images (
    id INT PRIMARY KEY AUTO_INCREMENT,
    listing_id INT NOT NULL,
    url VARCHAR(500) NOT NULL,
    alt_text VARCHAR(255),
    FOREIGN KEY (listing_id) REFERENCES Listings(id) ON DELETE CASCADE
);

-- BOOKINGS
CREATE TABLE Bookings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    listing_id INT NOT NULL,
    buyer_id INT NOT NULL,
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    status ENUM('requested', 'confirmed', 'cancelled') DEFAULT 'requested',
    FOREIGN KEY (listing_id) REFERENCES Listings(id) ON DELETE CASCADE,
    FOREIGN KEY (buyer_id) REFERENCES Users(id) ON DELETE CASCADE
);

-- TRANSACTIONS
CREATE TABLE Transactions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    listing_id INT NOT NULL,
    buyer_id INT NOT NULL,
    seller_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    status ENUM('pending', 'paid', 'cancelled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (listing_id) REFERENCES Listings(id) ON DELETE CASCADE,
    FOREIGN KEY (buyer_id) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (seller_id) REFERENCES Users(id) ON DELETE CASCADE
);

-- REVIEWS
CREATE TABLE Reviews (
    id INT PRIMARY KEY AUTO_INCREMENT,
    reviewer_id INT NOT NULL,
    reviewee_id INT NOT NULL,
    listing_id INT NOT NULL,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (reviewer_id) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (reviewee_id) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (listing_id) REFERENCES Listings(id) ON DELETE CASCADE
);

-- MESSAGE THREADS
CREATE TABLE Message_Threads (
    id INT PRIMARY KEY AUTO_INCREMENT,
    listing_id INT,
    buyer_id INT NOT NULL,
    seller_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (listing_id) REFERENCES Listings(id) ON DELETE SET NULL,
    FOREIGN KEY (buyer_id) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (seller_id) REFERENCES Users(id) ON DELETE CASCADE
);

-- MESSAGES
CREATE TABLE Messages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    thread_id INT NOT NULL,
    sender_id INT NOT NULL,
    body TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (thread_id) REFERENCES Message_Threads(id) ON DELETE CASCADE,
    FOREIGN KEY (sender_id) REFERENCES Users(id) ON DELETE CASCADE
);
