# Secret Santa

Simple Secret Santa App to create a group, write a wishlist and then draw names without being tracked or enter personal data.

## Tech Stack

- **Framework**: Next.js 16
- **Database**: PostgreSQL (via Prisma ORM)
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Security**: bcryptjs

## Usage

### Prerequisites

- Node.js (v20+ recommended)
- A PostgreSQL database

### Local Development

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Database Setup**:
   Ensure your `.env` file is configured with your `DATABASE_URL` (and any other necessary variables). Then, push the database schema:
   ```bash
   npx prisma db push
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.
