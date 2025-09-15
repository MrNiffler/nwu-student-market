NWU Student Market Backend — Team Getting Started Guide
=======================================================
This is the starter backend project for the NWU Student Market. It provides a foundation for building a student marketplace API using Node.js, Express, and PostgreSQL.

## Features

- Node.js + Express API  
- PostgreSQL database  
- Docker support for PostgreSQL (optional)  
- ESLint + Prettier for code quality  
- Jest + Supertest for testing

## Setup

1. Clone the repository:
   ----------------------
   git clone https://github.com/MrNiffler/nwu-student-market.git
   cd nwu-student-market-backend

2. Install dependencies:
   ----------------------
Open the folder and navigate into the BACKEND part -> \nwu-student-market\BACKEND 
Here right click in this folder run this in powershell(command prompt) ->   npm install

3. Set up environment variables:
   ------------------------------
   - Copy .env.example to .env
     (e.g., cp .env.example .env on Linux/Mac)
   - Or manually create .env in project root and copy the values replacing username and password with your POSTGRESQL credentials.

4. Start the backend server:
   ---------------------------
   npm run dev
   - The server should run on http://localhost:5000 can check by running in browser.
   - Root endpoint: GET / returns a success message
   - Health endpoint: GET /api/health returns DB status

5. Database:
   ------------
   - Tables already created: users, listings
   - Use pgAdmin or Docker to manage PostgreSQL
   - If using Docker, run:
     docker-compose up -d

6. Workflow:
   -----------
   - Always create a feature branch:
     git checkout -b feature/your-task
   - Make changes, commit, push
   - Open a pull request to merge into main
   - Do not commit .vs/, node_modules/, or .env files

7. Running tests:
   ----------------
   npm test

8. Notes:
   --------
   - ESLint + Prettier are already configured — follow the rules
   - Only main branch should be protected; work on feature branches
   - Contact Phill Nel (MRNiffler) for questions

