# 🛍️ Full-Stack E-Commerce Platform


[![Next.js](https://img.shields.io/badge/-Next.js-000?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/-TailwindCSS-38B2AC?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Stripe](https://img.shields.io/badge/-Stripe-6772e5?style=for-the-badge&logo=stripe&logoColor=white)](https://stripe.com/)
[![Zustand](https://img.shields.io/badge/-Zustand-000?style=for-the-badge)](https://github.com/pmndrs/zustand)
[![Gemini AI](https://img.shields.io/badge/-Gemini%20AI-8E75B2?style=for-the-badge&logo=googlegemini&logoColor=white)](https://ai.google.dev/)


## 📋 Table of Contents

1. [Overview](#overview)
2. [Tech Stack](#tech-stack)
3. [Features](#features)
4. [Getting Started](#getting-started)
5. [Project Structure](#project-structure)

## 🚀 Overview

A full-stack e-commerce web app built from scratch with **Next.js 15** and **TypeScript**. It combines a responsive storefront, a secure Stripe checkout flow, and a **Gemini AI-powered shopping assistant** that helps customers find products through natural language.

## ⚙️ Tech Stack

- **Next.js 15** – App Router, server components, and modern routing
- **Tailwind CSS v4** – CSS-first styling for a fast, responsive UI
- **TypeScript** – End-to-end type safety
- **Stripe** – Product catalog and payment processing
- **Zustand** – Lightweight global state management (cart, UI state)
- **Gemini AI** – Conversational product assistant / chatbot

## ⚡️ Features

- **AI Shopping Assistant** — Gemini-powered chatbot that answers product questions and gives recommendations in natural language
- **Dynamic Product Carousel** — Auto-cycling showcase of featured products on the landing page
- **Responsive Product Pages** — Detailed product views with quantity controls
- **Real-Time Cart** — Live-updating cart state across the app via Zustand
- **Stripe Checkout** — Secure, hosted payment flow with a success confirmation page
- **Dark Mode** — Full light/dark theme support

## 👌 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/en/)
- [npm](https://www.npmjs.com/)

### Installation

```bash
git clone https://github.com/Peter-Lee00/E-Commerce.git
cd E-Commerce
npm install
```

Create a `.env.local` file with your own keys:

```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_key
STRIPE_SECRET_KEY=your_key
GEMINI_API_KEY=your_key
```

Then run the dev server:

```bash
npm run dev
```

## 📁 Project Structure

```
├── app/          # Next.js App Router pages & API routes
├── components/   # UI components (product cards, chatbot, cart, etc.)
├── lib/          # Utility functions and API clients (Stripe, Gemini)
├── store/        # Zustand state stores
└── public/       # Static assets
```

---

Built by [Peter Lee](https://github.com/Peter-Lee00)
