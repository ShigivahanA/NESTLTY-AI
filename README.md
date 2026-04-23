# Nestly AI 🌙

**Personalized AI Bedtime Stories for Kids**

---

## 🧠 Overview

**Nestly AI** is a Micro-SaaS platform that generates **personalized bedtime stories for children** using AI.
Stories are tailored based on:

* Child’s name, age, interests, and gender
* Daily activities and mood
* Parent-provided notes

Each story is then converted into **natural-sounding audio narration**, creating a calm, immersive bedtime experience.

---

## ✨ Key Features

### 🧩 Personalized Story Generation

* AI-generated stories using OpenRouter
* Context-aware storytelling (child profile + daily input)
* Calm, safe, bedtime-friendly narratives

### 🎙️ Natural Voice Narration

* ElevenLabs TTS integration
* High-quality storytelling voice
* Fallback to browser speech synthesis when needed

### 👶 Multi-Child Profiles

* Parents can manage multiple children
* Each child has unique preferences and history

### 📊 Story History & Playback

* Spotify-like story player
* Stored stories with text + audio
* Replay anytime

### 💳 Subscription System

* Free / Pro / Elite tiers
* Usage tracking and feature gating
* Razorpay mock integration (ready for real payments)

---

## 🏗️ Tech Stack

### Frontend

* React (Vite)
* Tailwind CSS

### Backend / Database

* Supabase (PostgreSQL)
* Supabase Auth
* Supabase Storage

### AI & Voice

* OpenRouter (Story Generation)
* ElevenLabs (Text-to-Speech)

---

## 🗄️ Database Schema

### Tables

#### `child_profiles`

* id (uuid, PK)
* user_id (FK → auth.users)
* name
* age
* gender
* interests (text[])
* avatar_url
* created_at

---

#### `daily_inputs`

* id (uuid, PK)
* child_id (FK)
* activities
* mood
* notes
* created_at

---

#### `stories`

* id (uuid, PK)
* user_id (FK)
* child_id (FK)
* daily_input_id (FK)
* title
* story_text
* audio_url
* prompt
* duration
* is_favorite
* created_at

---

#### `story_sessions`

* id (uuid, PK)
* user_id (FK)
* child_id (FK)
* story_id (FK)
* status (pending, generating, completed, failed)
* created_at

---

#### `subscriptions`

* id (uuid, PK)
* user_id (FK, UNIQUE)
* tier (free, pro, elite)
* status (active, inactive, cancelled)
* stories_generated
* tts_usage_count
* last_reset_date
* created_at

---

#### `media`

* id (uuid, PK)
* user_id (FK)
* file_url
* type
* created_at

---

#### `contact_submissions`

* id
* name
* email
* message
* created_at

---

#### `newsletter_subscriptions`

* id
* email (UNIQUE)
* created_at

---

## 🔐 Authentication

* Supabase Auth (email/password)
* Each user = parent account
* Automatically assigned **Free subscription** on signup via trigger

---

## 🔄 Core User Flow

1. User signs up / logs in
2. Creates child profile(s)
3. Selects a child
4. Inputs daily activity
5. AI generates story
6. Story converted to audio
7. Playback via story player
8. Stored for future access

---

## 🧠 AI Story Generation

* Uses OpenRouter API
* Fallback model strategy implemented
* Handles:

  * Rate limiting (429)
  * Retry logic
  * Model switching

### Models Used:

* z-ai/glm-4.5-air:free
* mistralai/mistral-7b-instruct:free

---

## 🎧 Audio Generation

### Primary:

* ElevenLabs TTS (paid API)

### Fallback:

* Browser SpeechSynthesis

### Temporary Limit:

* 2 ElevenLabs generations per user (testing phase)
* After limit → fallback voice

---

## 💡 Subscription Logic

### Free Tier

* Limited story generation
* Limited premium audio usage

### Pro / Elite

* Unlimited stories
* Premium voice experience
* Future advanced features

---

## 🧪 Testing Mode Behavior

* TTS usage capped at 2 requests per user
* After that → automatic fallback
* Helps control API cost during development

---

## ⚙️ Environment Variables

```env
VITE_SUPABASE_URL=your_url
VITE_SUPABASE_ANON_KEY=your_key

VITE_OPENROUTER_API_KEY=your_key
VITE_ELEVENLABS_API_KEY=your_key
```

---

## 🚀 Running the Project

```bash
npm install
npm run dev
```

---

## ⚠️ Known Constraints

* Free AI models may produce inconsistent story lengths
* ElevenLabs API requires paid access for best voices
* Rate limiting handled but still dependent on provider limits

---

## 🔮 Future Improvements

* Real Razorpay integration (webhooks + billing)
* Background music + ambient audio layering
* Story personalization using uploaded images
* Offline playback support
* Voice selection per child
* Better story structuring (multi-part narratives)

---

## 🎯 Product Vision

Nestly AI is not just about generating stories.

It’s about creating:

> A calming, emotionally engaging bedtime experience
> that feels like a parent is telling the story

---

## 👤 Author

Built as a Micro-SaaS product focusing on:

* AI storytelling
* Emotional UX
* Scalable SaaS architecture

---

## 📜 License

MIT (or customize as needed)

---

**Nestly AI — Where every night becomes a story 🌙**
