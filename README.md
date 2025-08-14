# Reverie - Personal Journal & Self-Discovery App

A peaceful space for reflection, journaling, and self-discovery with integrated speech-to-text functionality.

## Features

- **Journal Writing**: Write and save your daily thoughts and reflections
- **Voice Journal**: Speak your thoughts and get real-time transcription using AssemblyAI
- **Personality Quizzes**: Take assessments to better understand yourself
- **Writing Prompts**: Get inspired with thoughtful journaling prompts
- **Modern UI**: Beautiful, responsive design built with Tailwind CSS and shadcn/ui

## Speech-to-Text Setup

This app uses AssemblyAI's Universal Streaming model for real-time speech transcription. To enable this feature:

### 1. Get an AssemblyAI API Key

1. Sign up at [AssemblyAI](https://www.assemblyai.com/)
2. Navigate to your account settings
3. Copy your API key

### 2. Environment Variables

Create a `.env.local` file in your project root:

```bash
# AssemblyAI API Key for speech-to-text
NEXT_PUBLIC_ASSEMBLYAI_API_KEY=your_api_key_here
```

**Important**: The `NEXT_PUBLIC_` prefix is required for client-side access in Next.js.

### 3. For Development

```bash
npm install
npm run dev
```

### 4. For Production (Vercel)

When deploying to Vercel:

1. Go to your project settings in Vercel
2. Navigate to "Environment Variables"
3. Add:
   - **Name**: `NEXT_PUBLIC_ASSEMBLYAI_API_KEY`
   - **Value**: Your AssemblyAI API key
   - **Environment**: Production (and Preview if desired)

## How to Use Speech-to-Text

1. Navigate to the "Voice Journal" tab
2. Click "Start Recording"
3. Speak clearly into your microphone
4. Watch real-time transcription
5. Click "Stop Recording" when finished
6. Your transcribed text will automatically be added to your journal entry

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Speech**: AssemblyAI Universal Streaming API
- **Database**: Supabase (configured but not yet implemented)

## Project Structure

```
reverie/
├── app/                    # Next.js app directory
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── journal-app.tsx   # Main journal application
│   ├── speech-component.tsx # Speech-to-text component
│   └── quiz-component.tsx   # Quiz functionality
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
└── public/               # Static assets
```

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

If you encounter any issues with the speech-to-text functionality:

1. Ensure your AssemblyAI API key is correctly set
2. Check that your microphone permissions are enabled
3. Verify your internet connection is stable
4. Check the browser console for any error messages

For AssemblyAI-specific issues, refer to their [documentation](https://docs.assemblyai.com/).
