# Zenith AI — Figma Design Prompt

Design a modern, polished, production-ready AI chatbot web application called **"Zenith AI"**.

The application is an AI assistant platform with a clean, premium SaaS aesthetic inspired by modern conversational AI products, but it must have its own unique visual identity.

The application will eventually be deployed using **Vercel** and will use **Firebase Authentication**. For the initial version, **only the developer/owner should be able to log in and access the application**.

The design should be practical for implementation as a modern web application.

---

# BRAND

Application Name:

**Zenith AI**

Tagline:

**"Intelligence, elevated."**

Create a simple modern Zenith AI logo using a geometric/symbolic mark combined with the word "Zenith AI".

The visual identity should communicate:

- Intelligence
- Precision
- Modern technology
- Reliability
- Premium AI software
- Simplicity

Avoid making the design look like a direct copy of ChatGPT.

---

# 1. LOGIN SCREEN

Create a dedicated full-screen login page.

The page should have a sophisticated but minimal appearance.

## Layout

Desktop:

- Split-screen or centered login layout
- Zenith AI branding on the left or centered above the form
- Login card approximately 400–460px wide

Mobile:

- Full-width responsive login layout
- Zenith AI logo at the top
- Login form below

## Login Branding

Display:

**Zenith AI**

"Intelligence, elevated."

Supporting text:

"Sign in to access your Zenith AI workspace."

## Login Form

Fields:

### Email

- Placeholder: "Enter your email"
- Email format validation

### Password

- Placeholder: "Enter your password"
- Show/hide password button

Additional control:

- Remember me checkbox

Primary button:

**Sign In**

Below the form:

**"Developer access only"**

Do NOT include:

- Public registration
- Create account button
- Social login
- Google login
- Facebook login
- Apple login

The interface should clearly communicate that access is currently restricted.

---

# 2. FIREBASE AUTHENTICATION

Zenith AI will use **Firebase Authentication** for user authentication.

The initial version must be restricted to the developer/owner account.

The UI should be designed around a Firebase Email/Password authentication flow.

The design should conceptually follow:

Login Screen
↓
Firebase Authentication
↓
Authenticated User
↓
Developer Authorization Check
↓
Zenith AI Workspace

If authentication fails, the user remains on the login screen.

If the user is authenticated but is not authorized as the developer, display an access-denied state rather than allowing access to the workspace.

The design should leave room for future authentication expansion, but the current UI should clearly represent a private developer-only application.

Do not expose Firebase configuration values, API keys, authentication tokens, passwords, or other sensitive credentials anywhere in the UI.

---

# 3. FIREBASE AUTHENTICATION STATES

Design the following authentication states.

## Default Login

Normal login form with empty fields.

## Email Required

Display:

"Please enter your email."

## Invalid Email

Display:

"Please enter a valid email address."

## Password Required

Display:

"Please enter your password."

## Incorrect Credentials

Display:

"Invalid email or password. Please try again."

## Too Many Attempts

Display:

"Too many unsuccessful attempts. Please try again later."

## Network Error

Display:

"Unable to connect. Check your internet connection and try again."

## Firebase/Server Error

Display:

"Something went wrong while signing you in. Please try again."

## Loading

Disable the login fields and button while authentication is processing.

Change the button to:

**Signing in...**

Show a subtle loading spinner.

## Successful Login

After successful Firebase authentication:

Login Screen
↓
Firebase Authentication
↓
Developer Authorization
↓
Zenith AI Workspace

The transition should feel smooth and immediate.

## Unauthorized User

If a valid Firebase account attempts to access Zenith AI but is not authorized:

Title:

**Access Restricted**

Message:

"This Zenith AI workspace is currently limited to developer access."

Button:

**Return to Login**

---

# 4. AUTHENTICATION PROTECTION

The main Zenith AI workspace should only be accessible to authenticated and authorized users.

If an unauthenticated visitor attempts to access the application:

Redirect them to the Zenith AI login screen.

If a user is authenticated but unauthorized:

Display the access-restricted state.

If the developer signs out:

Zenith AI Workspace
↓
Sign Out
↓
Firebase Sign Out
↓
Zenith AI Login

## Session State

The application should maintain the authenticated Firebase session.

When the developer returns to the application while still authenticated, automatically display the Zenith AI workspace instead of showing the login screen again.

If the Firebase authentication session expires or becomes invalid:

Display:

**Session expired**

"Your session has expired. Please sign in again."

Button:

**Sign In Again**

---

# 5. AUTHENTICATED AI CHAT APPLICATION

After successful authentication and authorization, redirect the developer to the main Zenith AI workspace.

Create three primary areas:

1. LEFT SIDEBAR
2. MAIN CHAT AREA
3. SETTINGS / ACCOUNT PANEL

---

# 6. LEFT SIDEBAR

Create a collapsible sidebar approximately 260px wide.

## Top

Zenith AI logo and name.

Primary button:

**+ New Chat**

Below:

**Search conversations**

Then conversation history.

Group conversations by:

- Today
- Yesterday
- Previous 7 Days
- Older

Each conversation item should contain:

- Conversation title
- Chat icon
- Three-dot menu

Three-dot menu options:

- Rename
- Archive
- Delete

## Sidebar Bottom

Developer account section.

Display:

**Developer**

developer@example.com

Use a circular avatar.

Clicking the account area should open an account menu containing:

- Account
- Settings
- API Usage
- Sign Out

Do not display a registration option.

---

# 7. COLLAPSED SIDEBAR

Create a collapsed version of the sidebar.

Show only:

- Zenith AI logo
- New Chat icon
- Search icon
- Conversation icons
- Settings icon
- Developer avatar

Include tooltips when hovering over icons.

---

# 8. MAIN CHAT HEADER

Create a compact top navigation/header.

Left:

- Sidebar toggle button

Center/left:

- Zenith AI model selector
- Current model name
- Dropdown arrow

Example:

**Zenith Pro**

Dropdown options:

### Zenith Fast

"Fast responses for everyday questions"

### Zenith Pro

"Advanced reasoning and complex tasks"

### Zenith Reasoning

"Deep reasoning for difficult problems"

The selected model should have a checkmark.

Right side:

- Usage indicator
- Developer avatar
- Three-dot menu

---

# 9. EMPTY CHAT STATE

When starting a new conversation, display a beautiful centered welcome screen.

Display the Zenith AI logo/icon.

Large heading:

**"How can I help you today?"**

Supporting text:

"Ask questions, explore ideas, analyze information, or build something new."

Below, create suggestion cards.

Examples:

### Explain Something

"Explain quantum computing in simple terms."

### Write Something

"Help me write a professional email."

### Analyze

"Analyze this document and summarize the key points."

### Build

"Help me create a React component."

Suggestion cards should be clickable.

---

# 10. ACTIVE CHAT

Design a realistic conversation interface.

Use a clean vertical conversation layout.

## User Message

Clearly distinguish user messages from AI responses.

User message should include:

- User avatar
- Message content
- Timestamp

## AI Message

AI response should include:

- Zenith AI avatar
- Response content
- Timestamp

AI responses should support:

- Markdown
- Headings
- Bold
- Italic
- Bullet lists
- Numbered lists
- Tables
- Blockquotes
- Links
- Code blocks

---

# 11. AI RESPONSE ACTIONS

Under every AI response, provide:

- Copy
- Like
- Dislike
- Regenerate
- More

The buttons should appear subtly and become more visible on hover.

---

# 12. CODE BLOCK

Create a polished code block component.

Include:

- Language label
- Copy button
- Code content
- Optional line numbers
- Syntax highlighting

Example language labels:

- JavaScript
- TypeScript
- Python
- C#
- HTML
- CSS
- SQL

---

# 13. AI GENERATING STATE

Create a state where Zenith AI is generating an answer.

Display:

- Zenith AI avatar
- Animated typing indicator
- "Zenith AI is thinking..."

The animation should be subtle and professional.

Also design a:

**Stop generating**

button.

---

# 14. CHAT INPUT

At the bottom of the conversation area create a large modern chat composer.

The composer should include:

- Attachment button
- Text input
- Voice input button
- Send button

Placeholder:

**"Message Zenith AI..."**

The input should support multiple lines.

It should automatically expand as the user types.

When no text is entered:

- Send button disabled

When text is entered:

- Send button becomes active

Below the composer:

"Zenith AI can make mistakes. Verify important information."

---

# 15. FILE UPLOAD

Design a file upload interface.

Users should be able to attach:

- PDF
- DOCX
- TXT
- CSV
- Images

Create attachment cards containing:

- File icon
- Filename
- File type
- File size
- Upload progress
- Remove button

Also create a drag-and-drop upload state.

Example:

**"Drop files here to upload"**

---

# 16. CONVERSATION SEARCH

Create a conversation search interface.

Search input:

**"Search conversations..."**

Display matching conversations.

Include:

- Conversation title
- Date
- Matching text preview

Create an empty search state:

**"No conversations found."**

---

# 17. MODEL SELECTION

Create a polished model selection dropdown.

Example models:

### Zenith Fast

Fast responses for everyday questions.

### Zenith Pro

Advanced reasoning and general-purpose tasks.

### Zenith Reasoning

Deep reasoning for complex problems.

Each model should have:

- Model name
- Short description
- Optional capability indicator
- Selection checkmark

The selected model should be visually emphasized.

---

# 18. SETTINGS

Create a settings interface accessible from the developer account menu.

Use a clean settings page or right-side drawer.

## General

- Theme
  - Light
  - Dark
  - System
- Language
- Interface density
  - Comfortable
  - Compact

## AI Preferences

- Default model
- Response style
  - Balanced
  - Concise
  - Detailed
- Temperature / creativity
- Streaming responses toggle

## Chat

- Save conversation history
- Automatically generate conversation titles
- Clear conversation history

## Developer

- API usage
- Token usage
- Request statistics
- Model usage
- API connection status

## Account

- Developer email
- Session information
- Sign out

Because this is currently a developer-only application, do not include:

- User management
- Public registration
- Invite users
- Team members

---

# 19. DEVELOPER API USAGE DASHBOARD

Create a developer-only usage screen.

Display:

- Today's Requests
- Total Tokens
- Input Tokens
- Output Tokens
- Estimated API Cost

Create simple charts for:

- Requests over time
- Token usage
- Model usage

Include a date filter:

- Today
- 7 Days
- 30 Days

Use clean dashboard cards without making the application feel like an enterprise analytics platform.

---

# 20. DEVELOPER ACCOUNT MENU

Create a dropdown menu opened by clicking the developer avatar.

Display:

**Developer**

developer@example.com

Menu options:

- Account
- Settings
- API Usage
- Sign Out

Use the authenticated Firebase user's profile information when available.

Do not expose:

- Firebase API keys
- Firebase configuration
- Authentication tokens
- AI provider API keys
- Passwords
- Private credentials

---

# 21. SIGN OUT

Create a sign-out confirmation modal.

Title:

**"Sign out of Zenith AI?"**

Message:

"You will need to sign in again to access your developer workspace."

Buttons:

**Cancel**

**Sign Out**

After confirmation:

Workspace
↓
Firebase Sign Out
↓
Login Screen

---

# 22. ERROR STATES

Design professional error states.

## API Error

Title:

**"Something went wrong"**

Message:

"Zenith AI couldn't generate a response. Please try again."

Button:

**Try Again**

## Network Error

Title:

**"Connection lost"**

Message:

"Check your internet connection and try again."

## Authentication Error

Title:

**"Session expired"**

Message:

"Please sign in again to continue."

Button:

**Sign In**

## Server Error

Title:

**"Zenith AI is temporarily unavailable."**

Message:

"Please try again in a moment."

---

# 23. RESPONSIVE DESIGN

The application must be fully responsive.

## Desktop

- Expanded sidebar
- Large chat area
- Centered conversation content
- Large chat composer

## Tablet

- Collapsible sidebar
- Flexible chat width
- Compact header

## Mobile

- Sidebar becomes a slide-out drawer
- Compact header
- Full-width chat
- Touch-friendly buttons
- Chat composer adapts to small screen
- Settings become a full-screen modal/page
- Messages use nearly the entire screen width

---

# 24. VISUAL DESIGN

Use a premium modern SaaS aesthetic.

Typography:

Use:

- Inter
- Google Sans
- Poppins

Use a neutral color system with a distinctive Zenith AI accent color.

The interface should feel:

- Modern
- Minimal
- Professional
- Premium
- Technical
- Calm
- Fast
- Reliable

Use:

- 8px spacing system
- 10–14px border radius
- 1px subtle borders
- Very subtle shadows
- Smooth 150–250ms transitions
- Clear hover states
- Clear active states
- Clear focus states
- Accessible contrast

Avoid:

- Excessive gradients
- Excessive glassmorphism
- Heavy shadows
- Overly colorful UI
- Huge decorative illustrations
- Unnecessary animations
- Clutter

---

# 25. DESIGN SYSTEM

Create reusable components and variants.

Components:

- Button
- Icon Button
- Input
- Textarea
- Dropdown
- Modal
- Toast
- Avatar
- Sidebar
- Conversation Item
- Chat Message
- AI Response
- Chat Composer
- File Attachment
- Code Block
- Model Selector
- Settings Section
- Usage Card
- Tooltip
- Login Form
- Authentication Error
- Loading State

Variants:

- Default
- Hover
- Active
- Disabled
- Loading
- Error
- Success

---

# 26. REQUIRED FIGMA SCREENS

Create complete designs for the following screens:

1. Developer Login
2. Login Error
3. Login Loading
4. Unauthorized Access
5. Session Expired
6. Empty Chat
7. Active Conversation
8. AI Generating
9. AI Response with Code
10. File Upload
11. Conversation Search
12. Model Selection
13. Settings
14. API Usage Dashboard
15. Account Menu
16. Sign Out Confirmation
17. API Error
18. Network Error
19. Server Error
20. Mobile Login
21. Mobile Empty Chat
22. Mobile Active Chat
23. Mobile Sidebar
24. Mobile Settings

---

# 27. AUTHENTICATION UX FLOW

The initial application is **developer-only**.

The authentication flow should be:

Developer opens Zenith AI
↓
Login Screen
↓
Enter email and password
↓
Firebase Authentication
↓
Check authentication result
↓
Check developer authorization
↓
Authorized?
├── No → Access Restricted
└── Yes → Zenith AI Workspace

If authentication fails:

Login
↓
Display appropriate error
↓
Remain on Login Screen

If the developer signs out:

Workspace
↓
Sign Out
↓
Firebase Sign Out
↓
Login Screen

The design should leave room for future authentication expansion, but the current UI should clearly represent a private developer-only application.

---

# 28. IMPLEMENTATION-AWARE DESIGN

Design the UI so it can realistically be implemented as a modern web application deployed on **Vercel**.

Use reusable components and consistent spacing.

Avoid designs that require complicated custom graphics or interactions that would be difficult to implement.

The final result should look like a real functioning AI product rather than a static concept.

The architecture should conceptually support:

**Frontend**
→ Zenith AI chat interface
→ Authentication state
→ Conversation history
→ File upload
→ Markdown/code rendering
→ Model selector

**Firebase**
→ Firebase Authentication
→ Developer authentication
→ Session management
→ Future user authentication

**Backend / Server**
→ Secure AI API requests
→ Streaming responses
→ Conversation management
→ Usage/token tracking

**Vercel**
→ Application hosting
→ Server-side API routes
→ Secure environment variables

AI provider API keys must remain server-side and must never be exposed directly to the browser.

---

# 30. RECOMMENDED PROJECT STRUCTURE

Before building Zenith AI, use a clean, scalable project structure designed for **Next.js + TypeScript + Tailwind CSS + Firebase + Vercel**.

The goal is to keep the application modular so authentication, AI providers, chat functionality, UI components, database logic, and future features can be developed independently.

Recommended structure:

```text
zenith-ai/
├── app/
│   ├── (auth)/
│   │   └── login/
│   │       └── page.tsx
│   │
│   ├── (dashboard)/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── chat/
│   │   │   └── [conversationId]/
│   │   │       └── page.tsx
│   │   ├── settings/
│   │   │   └── page.tsx
│   │   └── usage/
│   │       └── page.tsx
│   │
│   ├── api/
│   │   ├── chat/
│   │   │   └── route.ts
│   │   ├── conversations/
│   │   │   └── route.ts
│   │   ├── upload/
│   │   │   └── route.ts
│   │   └── usage/
│   │       └── route.ts
│   │
│   ├── unauthorized/
│   │   └── page.tsx
│   │
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
│
├── components/
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   ├── AuthGuard.tsx
│   │   └── AuthLoading.tsx
│   │
│   ├── chat/
│   │   ├── ChatContainer.tsx
│   │   ├── ChatHeader.tsx
│   │   ├── ChatMessage.tsx
│   │   ├── MessageActions.tsx
│   │   ├── ChatInput.tsx
│   │   ├── TypingIndicator.tsx
│   │   ├── EmptyChat.tsx
│   │   ├── CodeBlock.tsx
│   │   └── FileAttachment.tsx
│   │
│   ├── sidebar/
│   │   ├── Sidebar.tsx
│   │   ├── ConversationList.tsx
│   │   ├── ConversationItem.tsx
│   │   └── ConversationSearch.tsx
│   │
│   ├── settings/
│   │   ├── SettingsPanel.tsx
│   │   ├── GeneralSettings.tsx
│   │   ├── AISettings.tsx
│   │   └── ChatSettings.tsx
│   │
│   ├── usage/
│   │   ├── UsageDashboard.tsx
│   │   ├── UsageCard.tsx
│   │   └── UsageChart.tsx
│   │
│   ├── model/
│   │   └── ModelSelector.tsx
│   │
│   └── ui/
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Modal.tsx
│       ├── Dropdown.tsx
│       ├── Avatar.tsx
│       ├── Tooltip.tsx
│       └── Toast.tsx
│
├── lib/
│   ├── firebase/
│   │   ├── client.ts
│   │   ├── auth.ts
│   │   └── admin.ts
│   │
│   ├── ai/
│   │   ├── client.ts
│   │   ├── models.ts
│   │   └── prompts.ts
│   │
│   ├── auth/
│   │   ├── permissions.ts
│   │   └── session.ts
│   │
│   ├── db/
│   │   ├── conversations.ts
│   │   └── messages.ts
│   │
│   └── utils/
│       ├── formatting.ts
│       ├── validation.ts
│       └── constants.ts
│
├── hooks/
│   ├── useAuth.ts
│   ├── useChat.ts
│   ├── useConversations.ts
│   ├── useFileUpload.ts
│   └── useTheme.ts
│
├── types/
│   ├── auth.ts
│   ├── chat.ts
│   ├── conversation.ts
│   ├── ai.ts
│   └── usage.ts
│
├── config/
│   ├── site.ts
│   └── models.ts
│
├── public/
│   ├── logo.svg
│   ├── favicon.ico
│   └── icons/
│
├── middleware.ts
├── .env.local
├── .env.example
├── .gitignore
├── next.config.ts
├── package.json
├── tsconfig.json
├── postcss.config.mjs
├── tailwind.config.ts
└── README.md
```

## Architecture Responsibilities

### `app/`

Use the Next.js App Router for pages, layouts, protected dashboard routes, and server-side API endpoints.

Keep page files focused on composing the appropriate components instead of placing large amounts of business logic inside them.

### `components/`

Store reusable UI components here.

Separate components by feature instead of putting every component into one large folder.

For example:

```text
components/
├── auth/
├── chat/
├── sidebar/
├── settings/
├── usage/
├── model/
└── ui/
```

This makes the application easier to maintain as Zenith AI grows.

### `lib/firebase/`

Keep all Firebase-specific functionality here.

Recommended responsibilities:

- Firebase client initialization
- Firebase Authentication
- Firebase Admin SDK
- User/session verification
- Firestore access where applicable

Never put Firebase Admin SDK code inside client components.

### `lib/ai/`

Keep AI-provider-specific code isolated from the UI.

This is especially important because the AI provider may change in the future.

For example:

```text
lib/ai/
├── client.ts
├── models.ts
└── prompts.ts
```

The UI should not need to know whether Zenith AI is using OpenAI, Gemini, Anthropic, OpenRouter, or another provider.

The application should communicate with an internal `/api/chat` endpoint rather than calling a private AI API key directly from the browser.

### `lib/auth/`

Handle authorization logic separately from Firebase initialization.

For example:

- `permissions.ts` — determines whether the authenticated Firebase user is allowed to access Zenith AI.
- `session.ts` — handles authenticated session information.

This separation makes it easier to expand from one developer account to multiple authorized users later.

### `lib/db/`

Keep conversation and message persistence logic separate from the UI.

Recommended responsibilities:

- Create conversation
- Retrieve conversations
- Rename conversation
- Delete conversation
- Save messages
- Retrieve messages
- Archive conversations

If Firebase Firestore is used for chat persistence, keep Firestore-specific queries inside this layer.

### `hooks/`

Create reusable React hooks for client-side application state.

Recommended hooks:

- `useAuth()` — authentication state
- `useChat()` — current conversation and message state
- `useConversations()` — conversation history
- `useFileUpload()` — upload state
- `useTheme()` — theme preferences

### `types/`

Keep TypeScript interfaces and types centralized.

Example:

```text
types/
├── auth.ts
├── chat.ts
├── conversation.ts
├── ai.ts
└── usage.ts
```

This prevents duplicated type definitions throughout the project.

---

# 31. RECOMMENDED APPLICATION ARCHITECTURE

Use the following high-level architecture:

```text
                         ┌─────────────────────┐
                         │      User Browser   │
                         │                     │
                         │    Zenith AI UI     │
                         └──────────┬──────────┘
                                    │
                                    │ Firebase Auth
                                    ▼
                         ┌─────────────────────┐
                         │ Firebase            │
                         │ Authentication      │
                         └──────────┬──────────┘
                                    │
                              Authorized?
                              ┌─────┴─────┐
                              │           │
                             No          Yes
                              │           │
                              ▼           ▼
                       Access Denied   Dashboard
                                          │
                                          │
                              ┌───────────┴───────────┐
                              │                       │
                              ▼                       ▼
                       Next.js API              Firebase/
                       Routes                   Firestore
                              │                       │
                              │                       │
                              ▼                       ▼
                       AI Provider              Conversations
                       API                       & Messages
                              │
                              ▼
                       Streaming Response
                              │
                              ▼
                         Chat Interface
```

The browser should communicate with the Zenith AI server-side API rather than directly exposing private AI credentials.

---

# 32. AUTHENTICATION ARCHITECTURE

Use Firebase Authentication for the initial developer-only login.

Recommended flow:

```text
Browser
   │
   ▼
LoginForm
   │
   ▼
Firebase Authentication
   │
   ▼
Authenticated Firebase User
   │
   ▼
Developer Authorization Check
   │
   ├── Unauthorized → /unauthorized
   │
   └── Authorized → /chat
```

The authorization layer should determine whether the Firebase user is allowed to use the private Zenith AI workspace.

For the initial version, maintain an allowlist containing the developer's Firebase UID.

Prefer checking the **Firebase UID** rather than relying only on an email address because the UID is a stable Firebase user identifier.

Example conceptual configuration:

```text
AUTHORIZED_DEVELOPER_UID=your-firebase-user-uid
```

Do not place this value in publicly accessible client-side code.

As the project grows, authorization can later be expanded to roles such as:

```text
developer
admin
user
```

without redesigning the entire application.

---

# 33. FIREBASE STRUCTURE

If Firebase Firestore is used for storing chat data, organize the data logically.

Example:

```text
users/
  {userId}/
    profile
    settings

    conversations/
      {conversationId}
        title
        model
        createdAt
        updatedAt
        archived

        messages/
          {messageId}
            role
            content
            createdAt
            model
            usage
```

Potential top-level collections:

```text
users
conversations
usage
```

However, keep database access behind the application's data-access layer rather than scattering Firestore queries throughout React components.

---

# 34. AI API ARCHITECTURE

Do not place private AI API keys in client-side code.

Use:

```text
Chat UI
   ↓
POST /api/chat
   ↓
Server-side validation
   ↓
Authenticated user check
   ↓
AI provider client
   ↓
Streaming response
   ↓
Chat UI
```

The `/api/chat` endpoint should:

1. Verify the user is authenticated.
2. Verify the user is authorized.
3. Validate the request.
4. Validate the selected model.
5. Apply system instructions.
6. Send the request to the AI provider.
7. Stream the response back to the browser.
8. Track usage where supported.
9. Save the conversation/message data when appropriate.
10. Return a safe error if the provider fails.

The frontend should never receive the private AI provider API key.

---

# 35. ENVIRONMENT VARIABLES

Use Vercel Environment Variables for all secrets.

Create:

```text
.env.local
.env.example
```

Example `.env.example`:

```text
# Firebase Client Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Firebase Admin
FIREBASE_ADMIN_PROJECT_ID=
FIREBASE_ADMIN_CLIENT_EMAIL=
FIREBASE_ADMIN_PRIVATE_KEY=

# Developer Authorization
AUTHORIZED_DEVELOPER_UID=

# AI Provider
AI_API_KEY=
```

Important:

Only variables that are intentionally safe for the browser should use the `NEXT_PUBLIC_` prefix.

Private secrets such as AI API keys, Firebase Admin credentials, and authorization secrets must not use `NEXT_PUBLIC_`.

Never commit `.env.local` to Git.

---

# 36. SECURITY PRINCIPLES

Before building the AI functionality, follow these principles:

### Never expose private AI API keys

Bad:

```text
Browser → AI Provider using secret API key
```

Good:

```text
Browser → Zenith API Route → AI Provider
```

### Never hardcode passwords

Firebase should handle password authentication.

Do not create a JavaScript object containing:

```text
email: "developer@example.com"
password: "password123"
```

### Do not rely only on frontend route protection

Hiding the dashboard in React is not sufficient.

The server-side API endpoints must independently verify authentication and authorization.

### Validate every API request

The server should validate:

- Authentication
- Authorization
- Message content
- Model
- Request size
- Uploaded files
- Other user-controlled values

### Add rate limiting later

Even for a developer-only application, consider adding rate limiting to AI endpoints before making the application publicly accessible.

---

# 37. DEVELOPMENT PHASES

Build Zenith AI in stages instead of implementing everything at once.

## Phase 1 — Project Foundation

Set up:

- Next.js
- TypeScript
- Tailwind CSS
- ESLint
- Git repository
- Vercel project

Create the base folder structure.

## Phase 2 — Firebase Authentication

Implement:

- Firebase project
- Email/Password authentication
- Login screen
- Firebase authentication state
- Developer UID authorization
- Protected dashboard
- Unauthorized page
- Sign out
- Session handling

Do not build the AI functionality yet.

## Phase 3 — Zenith AI UI

Implement the Figma design:

- Sidebar
- Empty chat
- Chat messages
- Chat composer
- Model selector
- Settings
- Responsive mobile layout

Use mock responses initially.

## Phase 4 — AI Integration

Connect:

```text
Chat UI
→ /api/chat
→ AI Provider
→ Streaming Response
→ Chat UI
```

Keep the AI provider implementation inside `lib/ai/`.

## Phase 5 — Conversation Persistence

Add:

- Firestore
- Conversation creation
- Conversation history
- Message persistence
- Rename
- Delete
- Archive
- Search

## Phase 6 — File Upload

Add:

- File validation
- Upload UI
- Storage
- File processing
- AI attachment handling

Only support the file types actually required by the AI provider/backend.

## Phase 7 — Usage Tracking

Add:

- Request count
- Token usage
- Model usage
- Estimated cost
- Usage charts

## Phase 8 — Production Hardening

Before production deployment:

- Security review
- Authentication review
- Firestore security rules
- API validation
- Rate limiting
- Error handling
- Loading states
- Mobile testing
- Accessibility testing
- Environment variable verification
- Vercel deployment testing

---

# 38. COMPONENT DEVELOPMENT PRINCIPLE

Build the UI from reusable components rather than creating one giant page.

Avoid:

```text
app/page.tsx
  └── 2,000+ lines of UI and logic
```

Prefer:

```text
ChatPage
 ├── ChatHeader
 ├── Sidebar
 │    ├── NewChatButton
 │    ├── ConversationSearch
 │    └── ConversationList
 │         └── ConversationItem
 │
 └── ChatContainer
      ├── EmptyChat
      ├── MessageList
      │    └── ChatMessage
      └── ChatInput
           ├── FileAttachment
           └── SendButton
```

Keep components focused on one responsibility whenever practical.

---

# 39. RECOMMENDED DATA FLOW

For a normal chat message:

```text
User types message
        ↓
ChatInput
        ↓
useChat()
        ↓
POST /api/chat
        ↓
Authentication verification
        ↓
Authorization verification
        ↓
Request validation
        ↓
AI Provider
        ↓
Streaming response
        ↓
useChat()
        ↓
ChatMessage
        ↓
Save conversation/message
```

This separation keeps the UI independent from the AI provider.

---

# 40. FUTURE-PROOFING

Although Zenith AI will initially be developer-only, structure the application so it can later support multiple users.

Future capabilities could include:

- User registration
- Multiple authorized users
- Admin dashboard
- User roles
- Per-user conversations
- Per-user usage limits
- Team workspaces
- Subscription plans
- Multiple AI providers
- Custom system prompts
- Knowledge bases
- RAG
- Web search
- Voice conversations

Do not implement these features initially unless needed.

Instead, structure the application so they can be added without rewriting the core architecture.

---

# 41. RECOMMENDED INITIAL TECH STACK

Use the following stack as the baseline:

| Area | Recommended Technology |
|---|---|
| Framework | Next.js |
| Language | TypeScript |
| Styling | Tailwind CSS |
| UI Components | Reusable custom components |
| Authentication | Firebase Authentication |
| Database | Firebase Firestore |
| File Storage | Firebase Storage |
| Hosting | Vercel |
| AI Integration | Server-side API route |
| AI Streaming | Streaming responses |
| Validation | Zod |
| Icons | Lucide React |
| Markdown | React Markdown |
| Code Highlighting | Shiki or compatible syntax highlighter |
| Charts | Recharts |
| Version Control | Git + GitHub |

Keep the AI provider implementation abstract so changing providers later does not require rebuilding the frontend.

---

# 42. FINAL BUILD ORDER

Before starting the full AI functionality, follow this order:

```text
1. Create Next.js project
        ↓
2. Set up TypeScript + Tailwind
        ↓
3. Create project structure
        ↓
4. Set up Git/GitHub
        ↓
5. Create Firebase project
        ↓
6. Enable Firebase Email/Password Authentication
        ↓
7. Create developer Firebase account
        ↓
8. Implement Firebase login
        ↓
9. Implement developer UID authorization
        ↓
10. Protect dashboard routes
        ↓
11. Build Zenith AI Figma UI
        ↓
12. Build responsive layout
        ↓
13. Add mock chat functionality
        ↓
14. Create server-side /api/chat endpoint
        ↓
15. Connect AI provider
        ↓
16. Add streaming responses
        ↓
17. Add Firestore conversation persistence
        ↓
18. Add file uploads
        ↓
19. Add usage tracking
        ↓
20. Test authentication/security
        ↓
21. Configure Vercel environment variables
        ↓
22. Deploy to Vercel
        ↓
23. Test production deployment
```

This approach prevents authentication, UI, database, and AI-provider logic from becoming tightly coupled and makes the project much easier to maintain.

---

# 43. IMPORTANT INITIAL-SCOPE RULE

For the first version, keep Zenith AI intentionally simple.

The MVP should contain only:

- Developer login
- Firebase authentication
- Developer authorization
- Protected AI workspace
- New chat
- Conversation history
- AI chat
- Streaming responses
- Model selection
- Markdown
- Code blocks
- Basic file attachments
- Settings
- Sign out
- Responsive design

Avoid building advanced features such as:

- Public registration
- Team management
- Subscriptions
- Complex admin systems
- RAG
- Autonomous agents
- Web browsing
- Voice calls
- Multi-user collaboration

until the core application is stable.

The first objective is:

**Build a secure, polished, developer-only Zenith AI chatbot that works reliably on Vercel.**

# 29. FINAL PRODUCT EXPERIENCE

The final Figma design should feel like a polished production AI assistant rather than a simple mockup.

Prioritize:

- Usability
- Accessibility
- Responsive behavior
- Clean information architecture
- Fast and intuitive interactions
- Clear authentication states
- Developer-only access
- Consistent visual language

The final product identity should be:

# Zenith AI

**Intelligence, elevated.**

Create the interface as an original AI product with its own visual identity while maintaining the familiar usability patterns users expect from modern AI assistants.
