# Wedding Celebration Website

A beautiful, interactive wedding website built with Next.js and Supabase. Guests can view the event schedule, browse photos/videos, upload their own memories, and leave messages.

## Features

- **Event Schedule** - Display wedding program timeline with times and descriptions
- **Photo & Video Gallery** - Browse all uploaded media in a beautiful grid layout
- **Upload Functionality** - Guests can upload photos and short videos
- **Guest Messages** - Comment section for guests to leave wishes and memories
- **Download Media** - Download any photo or video from the gallery
- **Persistent Storage** - All data stored in Supabase (PostgreSQL + Storage)

## Design

- **Color Scheme**: Burgundy (#800020), Sage Green (#9CAF88), Beige (#F5E6D3)
- **Responsive**: Works beautifully on desktop, tablet, and mobile
- **Clean & Professional**: Modern design with smooth transitions

## Setup Instructions

### 1. Install Dependencies

```bash
cd wedding-app
pnpm install
```

### 2. Set Up Supabase

Follow the detailed instructions in [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)

Quick summary:
1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Run the SQL in `supabase-setup.sql` in your Supabase SQL Editor
3. Copy your project URL and anon key to `.env.local`

### 3. Configure Environment Variables

Create/edit `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### 4. Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the website.

## Tech Stack

- **Framework**: Next.js 16 (React 19)
- **Styling**: Tailwind CSS 4
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage
- **Deployment**: Vercel (recommended)

## Project Structure

```
wedding-app/
├── app/
│   ├── page.js          # Main wedding website
│   ├── layout.js        # Root layout with metadata
│   └── globals.css      # Global styles and color scheme
├── lib/
│   └── supabase.js      # Supabase client configuration
├── supabase-setup.sql   # Database schema and policies
└── .env.local           # Environment variables (not in git)
```

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

Make sure to add your environment variables in Vercel:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Customization

### Update Event Schedule

Edit the `program` array in `app/page.js`:

```javascript
const program = [
  { time: '2:00 PM', event: 'Your Event', description: 'Description' },
  // Add more events...
];
```

### Change Colors

Edit CSS variables in `app/globals.css`:

```css
:root {
  --burgundy: #800020;
  --sage: #9CAF88;
  --beige: #F5E6D3;
}
```

### Update Header Text

Edit the header section in `app/page.js`:

```javascript
<h1 className="text-5xl font-serif mb-3">Your Names</h1>
<p className="text-xl opacity-90">Your custom message</p>
```

## Support

For issues or questions:
1. Check [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for setup help
2. Review Supabase dashboard logs
3. Check browser console for errors

## License

Private project for personal use.
