# Mentee Dashboard Pages

This document outlines the structure and features of the Mentor Connect mentee dashboard application.

## Project Structure

```
app/
├── page.tsx                 # Dashboard home page
├── sessions/
│   └── page.tsx            # Sessions management page
├── mentors/
│   └── page.tsx            # Find & browse mentors page
└── messages/
    └── page.tsx            # Messaging/chat page

components/
├── dashboard/
│   ├── mentee-dashboard.tsx # Main dashboard component with all sections
│   └── top-navigation.tsx   # Top navigation bar (appears on all pages)
└── ui/
    ├── button.tsx          # UI Button component
    └── card.tsx            # UI Card component
```

## Pages Overview

### 1. Dashboard (`/`)

The main dashboard landing page featuring:
- **Welcome Hero Banner**: Greeting with progress percentage toward goal and streak counter
- **Quick Stats Grid**: 4-column grid showing:
  - Next Session (with book button)
  - Active Projects count
  - Pending Tasks status
  - Unread Messages count
- **Recent Activity Feed**: Timeline of recent activities
- **Upcoming Schedule**: Next 3 sessions list with quick view
- **My Mentors Strip**: Horizontal scrolling mentor cards with online status
- **Saved Resources**: Grid of learning resources (max 3 shown + view all link)

**Features:**
- Responsive layout (1-col mobile → 4-col desktop)
- Smooth framer-motion animations
- Empty states for all sections
- Direct navigation to detailed pages

### 2. Sessions (`/sessions`)

Comprehensive session management page featuring:
- **Search & Filter**: Search by mentor name/topic, filter by status (all/scheduled/completed)
- **Upcoming Sessions**: Detailed cards showing:
  - Session topic and mentor
  - Date, time, duration, and type (video/audio/in-person)
  - Session notes
  - "Join Session" and "Reschedule" buttons
- **Past Sessions**: Collapsed list view of completed sessions
- **Empty State**: Calendar icon with CTA to book first session

**Features:**
- Status badges (Upcoming, Completed, Cancelled)
- Color-coded status indicators
- Session type icons (Video, Audio, Location)
- Responsive grid to list layout transition
- Interactive hover effects

### 3. Mentors (`/mentors`)

Mentor discovery and browsing page featuring:
- **Search Bar**: Search by mentor name, role, or company
- **Sidebar Filters**:
  - Expertise multi-select filter
  - Availability radio filter (all/available/busy/offline)
- **Mentor Grid**: 2-column responsive grid showing mentor cards with:
  - Avatar with initials
  - Name and role
  - Availability status indicator
  - Bio excerpt
  - Star rating and review count
  - Session count and hourly rate
  - Expertise tags
  - "Book Session" and "Message" buttons
- **Empty State**: When no results match filters

**Features:**
- Live filtering with multiple criteria
- Visual availability indicators (color-coded)
- Mentor expertise tags
- Rating and review display
- Quick stat cards (rating, sessions, rate)
- Clear filters button for empty states

### 4. Messages (`/messages`)

Chat and messaging interface featuring:
- **Conversation List** (left sidebar):
  - Search conversations
  - Unread message badges
  - Last message preview
  - Online status indicators
  - Timestamp of last message
- **Chat Area** (main):
  - Chat header with mentor info and online status
  - Message thread with timestamps
  - Message status indicators (sent, delivered, read)
  - Message input field with attachment button
  - Responsive sidebar toggle on mobile
- **Message bubbles**:
  - Different styling for sent vs received
  - Status icons for message delivery

**Features:**
- Real-time message rendering
- Unread count badges
- Online/offline status
- Message delivery status (checkmarks)
- Sticky header with mentor info
- Attachment support UI
- Responsive mobile layout with sidebar collapse

## Design System

### Color Palette
- **Primary**: Soft Violet `#A889FF` - Used for highlights, active states, CTAs
- **Secondary**: Warm Gold `#D4B48C` - Used for accents and secondary elements
- **Background**: Dark Slate `#0f1419` - Main background
- **Card**: Slightly lighter slate `#1a1f2e` - Card backgrounds
- **Muted Text**: `#8e94a6` - Secondary text color
- **Border**: `#2a3142` - Border color with 50% opacity

### Typography
- **Font**: System font stack (font-sans)
- **Headings**: Bold with tight tracking
- **Body**: Regular weight with 1.4-1.6 line height

### Component Patterns
- **Cards**: `rounded-xl border border-border/50 p-4-6`
- **Buttons**: Primary (violet background) and outline variants
- **Badges**: Rounded pills with colored background/text
- **Icons**: lucide-react icons at 16-24px sizes
- **Animations**: framer-motion with smooth transitions

## Navigation

All pages include a sticky **TopNavigation** component featuring:
- Brand logo ("Mentor Connect")
- Nav links: Dashboard, Sessions, Mentors, Messages (with active state highlighting)
- Notification bell icon
- User profile icon
- Responsive design with collapsible labels on mobile

## Data & Mocking

All pages use mock data for demonstration:
- **mockUser**: User profile with progress, goal, streak
- **mockSessions**: Array of upcoming and past sessions
- **mockMentors**: Mentor profiles with expertise, ratings, availability
- **mockConversations**: Chat conversations with last messages
- **mockMessages**: Individual messages within conversations
- **mockActivity**: Activity log entries

Data is stored as component state and can be easily replaced with real API calls.

## Responsive Breakpoints

Pages are optimized for:
- **Mobile**: 1-column layouts, hidden labels, compact spacing
- **Tablet** (md): 2-3 column layouts, visible labels
- **Desktop** (lg): 3-4 column layouts, full features

## Getting Started

1. Install dependencies: `pnpm install` (framer-motion required)
2. Run dev server: `pnpm dev`
3. Visit `http://localhost:3000` to see the dashboard
4. Navigate using the top navigation bar

## Future Enhancements

- Connect to real Supabase backend for data persistence
- Add real-time messaging with WebSocket
- Implement file uploads for resources
- Add calendar integration for sessions
- User authentication and profile management
- Notification system with real-time updates
- Video call integration for sessions
