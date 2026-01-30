# SkillBridge-Frontend 🎓
**"Connect with Expert Tutors, Learn Anything"**

---

## Project Overview

A full‑stack tutoring platform backend built as **Assignment Project**. SkillBridge connects learners with expert tutors. **Students** can browse tutor profiles, view availability, and book sessions instantly. **Tutors** can manage their profiles, set availability, and track their teaching sessions. **Admins** oversee the platform and manage users.

---

## Roles & Permissions

| Role | Description | Key Permissions |
|------|-------------|-----------------|
| **Student** | Learners who book tutoring sessions | Browse tutors, book sessions, leave reviews, manage profile |
| **Tutor** | Experts who offer tutoring services | Create profile, set availability, view bookings, manage subjects |
| **Admin** | Platform moderators | Manage all users, view analytics, moderate content |

> 💡 **Note**: Users select their role during registration.Admin accounts should be seeded in the database.

---

## 🛠️ Tech Stack

| Technology  | Purpose                           |
| ----------- | --------------------------------- |
| Node.js     | Runtime                           |
| Express.js  | REST API framework                |
| TypeScript  | Type safety                       |
| PostgreSQL  | Relational database               |
| Prisma ORM  | Database modeling & queries       |
| Better Auth | Authentication & session handling |
| Postman     | API testing                       |

---

## Features

### Public Features
- Browse and search tutors by subject, rating, and price
- Filter tutors by category
- View detailed tutor profiles with reviews
- Landing page with featured tutors

### Student Features
- Register and login as student
- Book tutoring sessions
- View upcoming and past bookings
- Leave reviews after sessions
- Manage profile

### Tutor Features
- Register and login as tutor
- Create and update tutor profile
- Set availability slots
- View teaching sessions
- See ratings and reviews

### Admin Features
- View all users (students and tutors)
- Manage user status (ban/unban)
- View all bookings
- Manage categories


## Project Overview

SkillBridge is a full-stack web application that connects learners with expert tutors. Students can browse tutor profiles, view availability, and book sessions instantly. Tutors can manage their profiles, set availability, and track their teaching sessions. Admins oversee the platform and manage users.

---

## Roles & Permissions

| Role | Description | Key Permissions |
|------|-------------|-----------------|
| **Student** | Learners who book tutoring sessions | Browse tutors, book sessions, leave reviews, manage profile |
| **Tutor** | Experts who offer tutoring services | Create profile, set availability, view bookings, manage subjects |
| **Admin** | Platform moderators | Manage all users, view analytics, moderate content |

> 💡 **Note**: Users select their role during registration.Admin accounts should be seeded in the database.

---

## Features

### Public Features
- Browse and search tutors by subject, rating, and price
- Filter tutors by category
- View detailed tutor profiles with reviews
- Landing page with featured tutors

### Student Features
- Register and login as student
- Book tutoring sessions
- View upcoming and past bookings
- Leave reviews after sessions
- Manage profile

### Tutor Features
- Register and login as tutor
- Create and update tutor profile
- Set availability slots
- View teaching sessions
- See ratings and reviews

### Admin Features
- View all users (students and tutors)
- Manage user status (ban/unban)
- View all bookings
- Manage categories

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user |

### Tutors (Public)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tutors` | Get all tutors with filters |
| GET | `/api/tutors/:id` | Get tutor details |
| GET | `/api/categories` | Get all categories |

### Bookings
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/bookings` | Create new booking |
| GET | `/api/bookings` | Get user's bookings |
| GET | `/api/bookings/:id` | Get booking details |

### Tutor Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| PUT | `/api/tutor/profile` | Update tutor profile |
| PUT | `/api/tutor/availability` | Update availability |

### Reviews
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/reviews` | Create review |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/users` | Get all users |
| PATCH | `/api/admin/users/:id` | Update user status |

## Flow Diagrams

### 👨‍🎓 Student Journey

```
                              ┌──────────────┐
                              │   Register   │
                              └──────────────┘
                                     │
                                     ▼
                              ┌──────────────┐
                              │Browse Tutors │
                              └──────────────┘
                                     │
                                     ▼
                              ┌──────────────┐
                              │ View Profile │
                              └──────────────┘
                                     │
                                     ▼
                              ┌──────────────┐
                              │ Book Session │
                              └──────────────┘
                                     │
                                     ▼
                              ┌──────────────┐
                              │    Attend    │
                              └──────────────┘
                                     │
                                     ▼
                              ┌──────────────┐
                              │ Leave Review │
                              └──────────────┘
```

### 👨‍🏫 Tutor Journey

```
                              ┌──────────────┐
                              │   Register   │
                              └──────────────┘
                                     │
                                     ▼
                              ┌──────────────┐
                              │Create Profile│
                              └──────────────┘
                                     │
                                     ▼
                              ┌──────────────┐
                              │    Set       │
                              │ Availability │
                              └──────────────┘
                                     │
                                     ▼
                              ┌──────────────┐
                              │View Sessions │
                              └──────────────┘
                                     │
                                     ▼
                              ┌──────────────┐
                              │Mark Complete │
                              └──────────────┘
```

### 📊 Booking Status

```
                              ┌──────────────┐
                              │  CONFIRMED   │
                              │   (instant)  │
                              └──────────────┘
                               /            \
                              /              \
                       (tutor)          (student)
                        marks            cancels
                            /                \
                           ▼                  ▼
                   ┌──────────────┐   ┌──────────────┐
                   │  COMPLETED   │   │  CANCELLED   │
                   └──────────────┘   └──────────────┘
```

---

## ▶️ Run Locally

```bash
npm install
npx prisma migrate dev
npm run dev
```

---

## 🔑 Admin Credentials (Demo)

```
Email: 
Password: 
```

---




This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
