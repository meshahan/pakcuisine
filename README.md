# 🍛 Pak Cuisine Pro | Enterprise Restaurant Management Platform

![Ibn Adam Logo](/images/logo.jpg)

**Pak Cuisine Pro** is a high-performance, full-stack restaurant management solution designed for premium dining experiences. Built with modern web technologies and a cloud-native architecture, it provides a seamless bridge between customer satisfaction and administrative efficiency.

---

## 🚀 Vision
To empower restaurant owners with a state-of-the-art digital storefront that is not just a menu, but a complete business ecosystem—featuring AI-driven engagement, secure automated payments, and comprehensive content management.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 18 (Vite), TypeScript, Tailwind CSS, shadcn/ui |
| **Platforms** | Web, Android (APK), Windows Desktop (.exe) |
| **Animations** | Framer Motion (Premium Polish), Lucide Icons |
| **Backend** | Supabase (PostgreSQL, Auth, Edge Functions) |
| **Email** | Custom SMTP (Outlook/Gmail) with Fallbacks |
| **Payments** | Stripe API Integration |
| **AI/Engagement** | Context-Aware Chatbot (Custom Logic) |
| **Charts** | Recharts (Admin Analytics) |

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18.x or higher)
- **npm** (v9.x or higher)
- **Supabase CLI** (Optional, for Edge Function deployment)
- **Docker** (Required ONLY if running Supabase Edge Functions locally)

---

## ⚙️ Installation & Setup

1. **Navigate to the Project Directory:**
   ```powershell
   cd pak-cuisine-pro-main
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory and add your keys:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
   VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_test_key
   STRIPE_SECRET_KEY=your_stripe_secret_key
   ```

---

## 🏃 Running the Application

### **Frontend Development**
Starts the UI with hot-reloading at `http://localhost:8080`.
```bash
npm run dev
```

### **Backend (Supabase Edge Functions)**
If you are developing the Stripe payment function locally:
```bash
npx supabase functions serve payment --no-verify-jwt
```

---

## 📦 Core Modules

### **1. AI-Driven Chatbot 🤖**
- **Context-Aware**: Understands queries like "Show me a burger deal".
- **Real-time Analytics**: Suggests "Bestsellers" by analyzing actual order history.
- **Dynamic deals**: Direct integration with the database to display current promos.

### **2. Order & Payment Flow 💳**
- **Shopping Cart**: Persistent local storage cart.
- **Smart Checkout**: Supports Cash on Delivery and Stripe Payments.
- **Unified Email Gateway**: Integrated SMTP/Outlook support for automated customer confirmations and admin alerts.
- **Branded Touchpoints**: Custom burger app icons for mobile and desktop for a premium identity.
- **Cross-Platform**: Automated CI/CD pipelines to generate production-ready Android APKs and Windows installers.

### **3. Admin CMS Panel 🔐**
- **Dashboard**: Real-time sales charts and order tracking.
- **Content Management**: Update Menu items, Gallery photos, and Blog posts instantly.
- **User Management**: RBAC (Role-Based Access Control) for staff and admins.

---

## 🚢 Deployment

### **Deploying to Vercel/Netlify**
1. Run `npm run build`.
2. Upload the `dist/` folder.
3. Set the Environment Variables in your hosting provider's dashboard.

### **Deploying Supabase Functions**
```bash
# Login to Supabase
npx supabase login

# Deploy the payment function
npx supabase functions deploy payment --no-verify-jwt

# Set the Stripe secret key on Supabase
npx supabase secrets set STRIPE_SECRET_KEY=your_secret_key
```

---

## 🤝 Support
Developed by **Ibn Adam Technologies**.

---
© 2026 Pak Cuisine Pro. All rights reserved. Proprietary software.
"# PakCuisine" 
