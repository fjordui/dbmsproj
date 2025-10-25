# Paradise Resort - Hotel Booking System

A comprehensive hotel room management and booking system built with modern web technologies and professional database design for seamless reservation experiences.

## Overview

Paradise Resort is a full-stack hotel booking application designed to provide guests with an intuitive platform to browse, filter, and reserve luxury accommodations. This system represents a complete implementation of a relational database management system (DBMS) with proper normalization, foreign key relationships, and security constraints.

Developed as a Database Management System (DBMS) final project, demonstrating enterprise-level database architecture and web application integration.

## Features

- **Room Management**: 9 distinct room types with detailed descriptions and amenities
- **Real-time Availability**: Check room availability based on reservation dates
- **Advanced Filtering**: Sort by price and guest capacity with dynamic queries
- **Secure Guest Management**: User authentication with password hashing and email verification
- **Reservation System**: Complete booking lifecycle with status tracking
- **Profile Management**: Guest profiles with reservation history
- **Image Management**: Multiple images per room with efficient storage
- **Responsive Design**: Mobile-optimized user interface

## Room Types & Pricing

| Room Type | Price (₹/night) | Capacity |
|-----------|-----------------|----------|
| Standard Room | 8,000 | 2 |
| Superior Room | 8,000 | 2 |
| Deluxe Room | 12,000 | 2 |
| Premier Sea-View Room | 10,500 | 4 |
| Deluxe Room – Sea View | 12,500 | 4 |
| Premier Suite | 22,000 | 4 |
| Executive Suite | 28,000 | 4 |
| Presidential Suite | 32,000 | 3 |

## Database Management System (DBMS) Architecture

### Schema Overview

Paradise Resort uses a **normalized relational database** with 4 core tables implementing proper DBMS principles:

```
guests (PK: id)
    ↓ (1:M)
reservations (FK: guest_id, room_id)
    ↑
    └─ (M:1) rooms (PK: id)
              ↓ (1:M)
              room_images (FK: room_id)
```

### Table Design

#### **guests** Table
Primary entity for user management with security considerations.

| Column | Type | Constraints | Purpose |
|--------|------|-----------|---------|
| id | UUID | PRIMARY KEY, NOT NULL | Unique identifier (auto-generated) |
| email | TEXT | UNIQUE, NOT NULL | User authentication & contact |
| password | TEXT | NOT NULL | Hashed password (bcrypt) |
| nationalID | TEXT | NULLABLE | Guest identification |
| nationality | TEXT | NULLABLE | Country information |
| countryFlag | TEXT | NULLABLE | Flag emoji/icon |
| fullname | TEXT | NULLABLE | Guest full name |
| phone | TEXT | NULLABLE | Contact number |
| avatar | TEXT | NULLABLE | Profile picture URL |
| created_at | TIMESTAMP | DEFAULT now() | Account creation timestamp |

**Key Features:**
- Email uniqueness constraint prevents duplicate accounts
- Passwords stored securely with bcrypt hashing
- Row-Level Security (RLS) enabled for guest privacy
- Created_at timestamp for audit trails

#### **rooms** Table
Core room inventory and pricing information.

| Column | Type | Constraints | Purpose |
|--------|------|-----------|---------|
| id | UUID | PRIMARY KEY, NOT NULL | Unique room identifier |
| name | VARCHAR | NOT NULL | Room type/name |
| description | TEXT | NULLABLE | Detailed room information |
| price | NUMERIC | NULLABLE | Nightly rate in INR |
| capacity | INTEGER | NULLABLE | Maximum guest occupancy |
| location | VARCHAR | NULLABLE | Room location/floor |
| image_url | TEXT | NULLABLE | Primary room image |
| slug | VARCHAR | UNIQUE | URL-friendly identifier |
| thumbnail | VARCHAR | NULLABLE | Thumbnail image |
| created_at | TIMESTAMP | DEFAULT now() | Record creation date |
| updated_at | TIMESTAMP | DEFAULT now() | Last modification date |

**Key Features:**
- Slug field for SEO-friendly URLs with uniqueness constraint
- Separate thumbnail for performance optimization
- Timestamp tracking for data audit

#### **reservations** Table
Core booking records implementing business logic.

| Column | Type | Constraints | Purpose |
|--------|------|-----------|---------|
| id | UUID | PRIMARY KEY, NOT NULL | Unique reservation ID |
| guest_id | UUID | FOREIGN KEY → guests.id | Links to booking guest |
| room_id | UUID | FOREIGN KEY → rooms.id | Links to booked room |
| start_date | DATE | NOT NULL | Check-in date |
| end_date | DATE | NOT NULL | Check-out date |
| status | VARCHAR | DEFAULT 'pending' | Booking status (pending/confirmed) |
| guests_count | INTEGER | NULLABLE | Number of guests |
| reserved_price | NUMERIC | NULLABLE | Booking total price |
| message | TEXT | NULLABLE | Special requests/notes |
| created_at | TIMESTAMP | DEFAULT now() | Booking creation time |
| updated_at | TIMESTAMP | DEFAULT now() | Last update timestamp |

**Key Features:**
- Foreign keys ensure referential integrity
- Status tracking for reservation lifecycle
- Date fields enable availability checking
- Price snapshot prevents pricing disputes

#### **room_images** Table
Many-to-one relationship for multiple images per room.

| Column | Type | Constraints | Purpose |
|--------|------|-----------|---------|
| id | UUID | PRIMARY KEY, NOT NULL | Image record ID |
| room_id | UUID | FOREIGN KEY → rooms.id | Links to parent room |
| image_url | TEXT | NOT NULL | Image storage path |
| created_at | TIMESTAMP | DEFAULT now() | Upload timestamp |

**Key Features:**
- Enables multiple images per room without denormalization
- Proper foreign key relationship maintains data integrity
- Storage URL for Supabase image bucket

### Advanced DBMS Concepts Implemented

#### 1. **Relational Integrity**
- Foreign Key Constraints: All child tables enforce referential integrity
- Cascade operations prevent orphaned records
- 2 Foreign Keys in reservations, 1 in room_images

#### 2. **Data Normalization**
- **3NF Compliance**: Eliminates data redundancy and dependencies
- Room information separated from reservations
- Images normalized in separate table (avoiding repeated data)
- Guest data centralized in single source of truth

#### 3. **Security & Access Control**
- **Row-Level Security (RLS)**: Enabled on `guests` table
  - Each user can only access their own reservation data
  - Prevents unauthorized data access
- **Unique Constraints**: Email uniqueness prevents duplicate accounts
- **Password Security**: Bcrypt hashing in application layer

#### 4. **Data Integrity Constraints**
- **Primary Keys**: All tables have UUID primary keys
- **Unique Keys**: Email (guests), Slug (rooms)
- **NOT NULL Constraints**: Enforces required fields
- **Default Values**: Automatic timestamps and status assignment
- **CHECK Constraints**: 10 check constraints for data validation

#### 5. **Indexing Strategy**
- **Unique Indexes**: On id, email, slug for fast lookups
- **Primary Key Indexes**: B-tree indexes on all PKs
- **Performance**: Enables O(log n) search complexity

#### 6. **Database Views**
- **guests_view**: Restricts sensitive data exposure
  - Excludes password field from API responses
  - Used for public guest information queries
  - Maintains security without exposing authentication data

#### 7. **Timestamp Tracking**
- **created_at**: Audit trail for record creation
- **updated_at**: Tracks modifications (reservations, rooms)
- **Timezone Support**: With timezone awareness for international guests

### Query Optimization

**Availability Check Query Pattern:**
```sql
SELECT * FROM rooms 
WHERE id NOT IN (
  SELECT room_id FROM reservations 
  WHERE status = 'confirmed' 
  AND start_date <= '2024-10-26' 
  AND end_date >= '2024-10-25'
);
```

**Guest Reservations Query:**
```sql
SELECT r.*, ro.name, ro.price 
FROM reservations r
JOIN rooms ro ON r.room_id = ro.id
WHERE r.guest_id = 'guest-uuid'
ORDER BY r.created_at DESC;
```

## Technology Stack

### Frontend
- **Next.js 14**: Full-stack framework with SSR/CSR
- **React**: Component-based UI architecture
- **Tailwind CSS**: Responsive utility-first styling
- **date-fns**: Date manipulation for availability logic

### Backend & Database
- **Supabase**: PostgreSQL DBMS with REST API
- **Auth.js**: Session management and authentication
- **bcrypt**: Secure password hashing
- **PostgreSQL**: Advanced RDBMS features

### Key Libraries
- React Select: Multi-select dropdowns
- FontAwesome: Icon system
- Zod: Schema validation

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd paradise-resort
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables in `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_KEY=your-supabase-key
NEXT_PUBLIC_SUPABASE_IMGS_URL=your-storage-url
SUPABASE_JWT_SECRET=your-jwt-secret
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
AUTH_SECRET=your-auth-secret
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
app/
├── _components/           # Reusable React components
├── _lib/supabase/        # Database queries and operations
├── _ui/                  # UI component library
├── rooms/                # Room listing and details pages
├── account/              # User profile and history
└── page.jsx              # Homepage
```

## DBMS Learning Outcomes

This project demonstrates proficiency in:
- ✅ Relational database design and normalization (3NF)
- ✅ Foreign key relationships and referential integrity
- ✅ Row-Level Security implementation
- ✅ Unique and primary key constraints
- ✅ Query optimization and indexing strategies
- ✅ Data validation with check constraints
- ✅ View creation for security and abstraction
- ✅ Transaction handling and data consistency
- ✅ Real-world business logic implementation

## License

MIT License - See LICENSE file for details

## Authors

Developed as a Database Management System (DBMS) final project at Vidyalankar Institute Of Technology, Mumbai.