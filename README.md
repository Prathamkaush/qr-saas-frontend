frontend/
├── app/
│   ├── layout.tsx                 # Root Layout (Fonts, Metadata)
│   ├── globals.css                # Tailwind imports
│   │
│   ├── (auth)/                    # Auth Routes (Public)
│   │   ├── login/page.tsx         # Login + Google OAuth
│   │   ├── signup/page.tsx        # Registration
│   │   └── auth/callback/page.tsx # OAuth Redirect Handler
│   │
│   ├── dashboard/                 # Protected Routes
│   │   ├── layout.tsx             # Sidebar + Topbar Wrapper
│   │   ├── page.tsx               # Global Dashboard (Stats + Quick Actions)
│   │   │
│   │   ├── qr/
│   │   │   ├── page.tsx           # "My QR Codes" List
│   │   │   ├── create/
│   │   │   │   ├── page.tsx       # Wizard Parent (State Manager)
│   │   │   │   ├── step-type.tsx  # Select Type (URL, WiFi, etc)
│   │   │   │   ├── step-content.tsx # Inputs + Project Selector
│   │   │   │   ├── step-design.tsx  # Colors, Logo, Frames
│   │   │   │   └── step-preview.tsx # Final Preview + Save
│   │   │   │
│   │   │   └── [id]/              # Dynamic Route for Single QR
│   │   │       ├── edit/page.tsx       # Edit Existing QR
│   │   │       └── analytics/page.tsx  # Single QR Stats
│   │   │
│   │   ├── projects/              # Folder Management
│   │   │   └── page.tsx           # List Projects + Create Project
│   │   │
│   │   ├── analytics/             # Global Analytics
│   │   │   └── page.tsx           # Aggregated Charts
│   │   │
│   │   ├── billing/               # Subscription Management
│   │   │   └── page.tsx           # Plan Details + Invoices
│   │   │
│   │   └── settings/              # User Profile
│   │       └── page.tsx           # Update Name/Password
│   │
│   └── api/                       # Next.js API Routes (Proxy)
│       └── qr-preview/route.ts    # Server-side QR generation (if needed)
│
├── components/
│   ├── ui/                        # Shadcn UI (Buttons, Inputs, Cards)
│   ├── layout/                    # Sidebar, Topbar, MobileNav
│   ├── qr/                        # QR Specific Components
│   │   ├── qr-card.tsx            # Dashboard Card
│   │   ├── live-qr-code.tsx       # The Renderer (qr-code-styling)
│   │   └── qr-detail-modal.tsx    # Pop-up View
│   └── charts/                    # Recharts Wrappers (for Analytics)
│
├── lib/
│   ├── api.ts                     # Axios instance (Auth header handling)
│   └── utils.ts                   # Class merger (clsx/tailwind-merge)
│
├── public/                        # Static Assets
│   ├── logos/                     # Google, Beam logos
│   └── frames/                    # Frame SVG assets (if not generated)