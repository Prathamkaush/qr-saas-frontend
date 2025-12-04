frontend/
│
├── app/
│   ├── layout.tsx
│   ├── globals.css
│   │
│   ├── (auth)/            ← login/signup (future)
│   │
│   ├── dashboard/
│   │   ├── layout.tsx     ← sidebar + topbar
│   │   ├── page.tsx       ← dashboard home
│   │   │
│   │   ├── qr/
│   │   │   ├── create/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── step-type.tsx
│   │   │   │   ├── step-content.tsx
│   │   │   │   ├── step-design.tsx
│   │   │   │   ├── step-preview.tsx
│   │   │   │
│   │   ├── projects/      ← (future)
│   │   ├── analytics/     ← (future)
│   │   ├── billing/       ← (future)
│   │   ├── settings/      ← (future)
│   │
│   ├── api/
│   │   ├── qr-preview/
│   │   │   └── route.ts   ← generates QR preview (client-side)
│   │
│   └── favicon.ico
│
├── components/
│   ├── ui/                ← shadcn-ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── textarea.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── avatar.tsx
│   │   ├── separator.tsx
│   │   └── ... (others)
│   │
│   ├── layout/
│   │   ├── sidebar.tsx
│   │   ├── topbar.tsx
│   │
│   ├── qr/
│   │   ├── live-qr-code.tsx     ← QR preview component
│   │   └── frame-presets.ts     ← (future) QR frames like QRFY
│   │
│   └── icons/
│
├── lib/
│   ├── utils.ts
│   ├── api-client.ts       ← will contain Axios instance
│   ├── auth.ts            ← will handle JWT
│   └── cn.ts              ← shadcn utility
│
├── public/
│   ├── frames/            ← (future)
│   ├── logos/
│   └── qrfy-clone-assets/
│
├── styles/
│   └── theme.css          ← (future themes)
│
├── package.json
└── tsconfig.json

❌ What Is NOT Working Yet
⛔ Live preview is stuck (needs new QR generator)
⛔ Frames are not implemented
⛔ QR Code styling not fully applied
⛔ Logo overlay not working
⛔ Eye shape rendering not accurate
⛔ Frame text (Scan Me, Tap Here) missing
⛔ Final save flow not connected to backend
⛔ No template selection
⛔ No project assignment for QR
⛔ No saved QR list (My QR Codes)
⛔ No analytics frontend
⛔ No billing UI

All these are planned.