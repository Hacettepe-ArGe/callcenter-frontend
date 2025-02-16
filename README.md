<h3 align="center">
    <p>Carbon Footprint Tracker</p>
</h3>

A modern web application for tracking and managing carbon emissions, built with Next.js and TypeScript.

## Table of Contents
- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [Contributing](#contributing)

## Overview

Carbon Footprint Tracker is a comprehensive solution that helps organizations monitor and reduce their environmental impact by:
- Tracking carbon emissions across different categories
- Providing detailed analytics and reporting
- Offering insights for sustainability improvements
- Managing environmental data efficiently

## Tech Stack

- **Frontend**: Next.js 15, TypeScript
- **Backend**: Express.js, Node.js
- **Authentication**: JWT Authentication, NextAuth
- **Database**: PostgreSQL with Prisma ORM
- **Styling**: Tailwind CSS

## Deployment
- **Frontend**: Vercel
- **Backend**: Railway
- **Database**: Vercel Postgres

## Features

- **Dashboard Analytics**
  - Real-time emission tracking
  - Interactive charts and visualizations
  - Historical data comparison
  - Coverage analysis

- **User Management**
  - Role-based access control
  - Secure authentication

- **Reporting System**
  - Report generation for user
  - Data visualization

## Getting Started

1. Clone the repository
```bash
git clone https://github.com/Hacettepe-ArGe/callcenter-frontend.git
```

2. Install dependencies
```bash
pnpm install
```

3. Set up environment variables
```bash
cp .env.example .env
```

4. Configure your `.env` file with the following:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/carbon_tracker"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# in local
```

5. Start the development server
```bash
pnpm dev
```

Visit `http://localhost:3000` to see the application.

## Environment Variables

Required environment variables:

- `NEXTAUTH_URL`: Backend server link
- `NEXTAUTH_SECRET`: Secret key for JWT authentication

## Project Structure

```
├── app/
│   ├── (auth)/        # Auth Page
│   ├── (promotion)/   # Facts & Info Pages
│   ├── api/           # API routes
│   ├── auth/error/    # Authentication Error page
│   └── dashboard/     # Dashboard page
├── components/        # React components
├── hooks/             # custom React hooks
├── types/             # NextAuth Types
├── public/
└── lib/
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request