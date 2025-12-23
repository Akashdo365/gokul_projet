# Intelligent Blind Assistance System with AI Vision

An advanced AI-powered web application designed to assist visually impaired users by leveraging computer vision technology. The system detects objects, reads text, recognizes currency, and provides emergency support.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running Locally](#running-locally)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [Environment Variables](#environment-variables)
- [Building for Production](#building-for-production)

---

## Features

### 🔍 Object Detection
- Real-time object detection using camera
- AI-powered image analysis with confidence scores
- Maintains scan history for reference

### 📖 Text Reading (OCR)
- Extract and read text from images
- Powered by OpenAI Vision API
- Display extracted text clearly

### 💱 Currency Recognition
- Identify currency denominations from images
- Useful for blind users to identify money
- Confidence-based recognition

### 🚨 Emergency Support
- One-click emergency alert button
- Location tracking (optional)
- Emergency contact notifications

### 👤 User Profile Management
- Store personal information
- Configure emergency contacts
- Language preferences (multiple languages supported)
- Accessibility preferences (high contrast, voice speed)

### 📊 Scan History
- Track all object detections, text readings, and currency recognitions
- Historical data with timestamps
- View confidence scores for AI predictions

---

## Tech Stack

### **Frontend**
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Fast build tool and dev server
- **TailwindCSS** - Styling framework
- **Shadcn/ui** - Component library (built on Radix UI)
- **React Hook Form** - Form management
- **TanStack React Query (v5)** - Server state management
- **Wouter** - Client-side routing
- **React Webcam** - Camera access
- **Lucide React** - Icons

### **Backend**
- **Express.js** - Web framework
- **Node.js** - Runtime environment
- **TypeScript** - Type safety

### **Database**
- **PostgreSQL** - Relational database
- **Drizzle ORM** - Type-safe database toolkit
- **Drizzle Zod** - Validation schemas

### **AI/Vision**
- **OpenAI Vision API** - Image analysis and OCR
- **GPT-4 Vision** - Advanced image understanding

### **Authentication & Sessions**
- **Passport.js** - Authentication middleware
- **Express Session** - Session management
- **Connect PG Simple** - PostgreSQL session store

### **Development Tools**
- **TSX** - TypeScript execution
- **Drizzle Kit** - Database migrations
- **Tailwind CSS** - Utility-first CSS framework
- **PostCSS** - CSS transformation
- **Autoprefixer** - CSS vendor prefixes

---

## Project Structure

```
.
├── client/                          # Frontend application
│   ├── src/
│   │   ├── pages/                  # Route pages
│   │   │   ├── home.tsx
│   │   │   ├── profile.tsx
│   │   │   ├── scan-history.tsx
│   │   │   └── not-found.tsx
│   │   ├── components/             # Reusable components
│   │   │   └── ui/                # Shadcn UI components
│   │   ├── lib/                    # Utilities
│   │   │   └── queryClient.ts
│   │   ├── App.tsx                 # Main app component
│   │   ├── index.css               # Global styles
│   │   └── main.tsx                # Entry point
│   └── index.html
│
├── server/                          # Backend application
│   ├── index.ts                    # Server entry point
│   ├── routes.ts                   # API routes
│   ├── storage.ts                  # Data storage interface
│   ├── vite.ts                     # Vite configuration
│   └── replit_integrations/        # Integration modules
│       ├── chat.ts                 # Chat API routes
│       └── image.ts                # Image processing routes
│
├── shared/                          # Shared code
│   ├── schema.ts                   # Database schema & types
│   ├── routes.ts                   # Shared route definitions
│   └── models/
│       └── chat.ts                 # Chat models
│
├── package.json                     # Dependencies
├── tsconfig.json                    # TypeScript config
├── vite.config.ts                   # Vite config
├── tailwind.config.ts               # Tailwind config
├── drizzle.config.ts                # Drizzle ORM config
└── README.md                        # This file
```

---

## Prerequisites

Before running locally, ensure you have:

- **Node.js** (v16 or higher)
- **npm** or **yarn** package manager
- **PostgreSQL** database
- **OpenAI API Key** (for vision features)

---

## Installation

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd intelligent-blind-assistance
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Set Up Environment Variables

Create a `.env.local` file in the root directory:

```env
# OpenAI API Configuration
AI_INTEGRATIONS_OPENAI_API_KEY=sk-your-openai-api-key-here
AI_INTEGRATIONS_OPENAI_BASE_URL=https://api.openai.com/v1

# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/blind_assistance_db

# Session Secret (generate a random string)
SESSION_SECRET=your-random-session-secret-here

# Frontend Environment Variables
VITE_API_URL=http://localhost:5000
```

### Step 4: Set Up Database

**Create a PostgreSQL database:**

```bash
createdb blind_assistance_db
```

**Run database migrations:**

```bash
npm run db:push
```

This will create the required tables:
- `users` - User profiles and preferences
- `scan_logs` - History of object detections, text readings, and currency recognitions
- `emergency_logs` - Emergency alert history with location data

---

## Running Locally

### Development Mode

Start the development server:

```bash
npm run dev
```

The application will be available at:
- **Frontend**: `http://localhost:5000`
- **Backend API**: `http://localhost:5000/api`

The development server includes:
- Hot module reloading for instant updates
- TypeScript compilation
- Vite dev server with optimized builds

### Production Build

Build for production:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

### Type Checking

Check TypeScript types:

```bash
npm run check
```

---

## API Endpoints

### User Profile

**Get User Profile**
```
GET /api/user/profile
Response: { id, name, address, emergencyContact, alternateContact, language, preferences }
```

**Update User Profile**
```
POST /api/user/profile
Body: { name, address, emergencyContact, alternateContact?, language, preferences? }
Response: Updated user object
```

### Image Analysis

**Detect Objects**
```
POST /api/detect-object
Body: { image: "base64-encoded-image" }
Response: { objects: [{ name: string, confidence: 0-100 }] }
```

**Read Text (OCR)**
```
POST /api/read-text
Body: { image: "base64-encoded-image" }
Response: { text: "extracted text" }
```

**Recognize Currency**
```
POST /api/recognize-currency
Body: { image: "base64-encoded-image" }
Response: { value: number, currency: string }
```

### Scan History

**Get Scan History**
```
GET /api/scan-history
Response: [{ id, type, result, confidence, timestamp }]
```

### Emergency

**Trigger Emergency**
```
POST /api/emergency/trigger
Body: { locationLat?: string, locationLng?: string }
Response: { success: true, message: "Emergency triggered..." }
```

---

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT,
  emergency_contact TEXT NOT NULL,
  alternate_contact TEXT,
  language TEXT DEFAULT 'en',
  preferences JSONB -- { highContrast?: boolean, voiceSpeed?: number }
);
```

### Scan Logs Table
```sql
CREATE TABLE scan_logs (
  id SERIAL PRIMARY KEY,
  type TEXT NOT NULL, -- 'object', 'text', 'currency'
  result TEXT NOT NULL,
  confidence INTEGER, -- 0-100
  timestamp TIMESTAMP DEFAULT NOW()
);
```

### Emergency Logs Table
```sql
CREATE TABLE emergency_logs (
  id SERIAL PRIMARY KEY,
  location_lat TEXT,
  location_lng TEXT,
  timestamp TIMESTAMP DEFAULT NOW(),
  status TEXT DEFAULT 'triggered'
);
```

---

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `AI_INTEGRATIONS_OPENAI_API_KEY` | OpenAI API key for vision features | `sk-...` |
| `AI_INTEGRATIONS_OPENAI_BASE_URL` | OpenAI API endpoint | `https://api.openai.com/v1` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost/db` |
| `SESSION_SECRET` | Secret for session encryption | `random-string-here` |
| `VITE_API_URL` | Frontend API endpoint | `http://localhost:5000` |
| `NODE_ENV` | Environment mode | `development` or `production` |
| `PORT` | Server port | `5000` |

---

## Building for Production

### Step 1: Build the Application

```bash
npm run build
```

This creates optimized bundles in the `dist/` directory.

### Step 2: Set Production Environment Variables

Update `.env` with production values:
```env
NODE_ENV=production
AI_INTEGRATIONS_OPENAI_API_KEY=your-production-key
DATABASE_URL=your-production-db-url
SESSION_SECRET=your-production-secret
```

### Step 3: Start Production Server

```bash
npm start
```

---

## Features Breakdown

### Object Detection
- Uses GPT-4 Vision API to identify objects in images
- Returns array of detected objects with confidence scores
- Automatically logs results to scan history

### Text Reading (OCR)
- Extracts visible text from images
- Powered by OpenAI Vision for high accuracy
- Results stored in scan history for future reference

### Currency Recognition
- Identifies currency denomination and type
- Useful for visually impaired users to identify money
- Confidence scoring for accuracy

### Emergency Support
- One-click emergency alert
- Can include location coordinates
- Logs all emergency events for record-keeping

### User Preferences
- Customize language (multiple languages supported)
- Accessibility settings (high contrast mode, voice speed)
- Emergency contact management

---

## Troubleshooting

### "PayloadTooLargeError"
If you get a payload too large error when uploading images:
- The server is configured to accept up to 50MB
- If still failing, check your image size
- Reduce image resolution if necessary

### Database Connection Issues
```bash
# Check PostgreSQL is running
psql --version

# Create database if needed
createdb blind_assistance_db

# Run migrations
npm run db:push
```

### OpenAI API Errors
- Verify your API key is valid
- Check you have sufficient credits
- Ensure the model `gpt-4o` is available in your account

### Port Already in Use
```bash
# Change the port
PORT=3000 npm run dev
```

---

## Contributing

Contributions are welcome! Please follow the existing code style and submit pull requests.

---

## License

MIT License - feel free to use this project for any purpose.

---

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review API endpoint documentation
3. Check environment variable configuration
4. Verify database connectivity

---

**Built with ❤️ for accessibility and inclusion**
