# Word Quest with Chilongezyo: Grade 4 Spelling Adventure
### Chinego Primary School, Zimbabwe

**Word Quest with Chilongezyo** is a mobile-first, offline-capable Progressive Web Application (PWA) designed for Grade 4 pupils (aged 9–10) in Zimbabwe. It provides an encouraging, accessible spelling curriculum with authentic Zimbabwean context, child-safe illustrations, and role-based views for pupils, teachers, parents, and administrators.

---

## 🌟 Key Features

### 1. Game-Based Quest Architecture
- **8 Themed Quest Zones**:
  1. *School Station* (Chinego Primary Grounds)
  2. *Family Village* (Community & Friendship)
  3. *Green Farm* (Maize, Sadza, Crops & Harvest)
  4. *Animal Safari* (Hwange Wildlife: Elephant, Lion, Zebra)
  5. *Weather Mountain* (Rain, Sunshine, Drought & Seasons)
  6. *Community Town* (Bicycle, Market & Trade)
  7. *Zimbabwe Explorer Zone* (Victoria Falls, Heritage & Culture)
  8. *Spelling Champion Castle* (Mastery Summit)

### 2. Interactive Spelling Game Modes
- **Listen and Spell**: Spoken pronunciation with normal and slow letter-by-letter playback, progressive hints (first letter, pattern `_ _ r _ e _`, syllable breakdown, meaning), and supportive feedback.
- **Build the Word**: Scrambled letter tiles that learners tap or drag into correct order with audio assistance.
- **Missing Letters**: Interactive letter gaps focusing on tricky vowels and blends.
- **Picture and Word Match**: Visual learning pairing child-safe SVG illustrations with tap-to-speak options.
- **Word Detective**: Spotting misspelled words inside realistic sentences (e.g. *"The farmer grows maiz"* → **maize**).
- **Spelling Race**: Optional speed sprint with a gentle toggle to turn off timers for pupils needing extra time or anxiety relief.
- **Revision Garden**: Spaced repetition tracking 4 mastery stages (*New*, *Practising*, *Improving*, *Mastered*). Mastering words allows learners to water and grow a virtual blooming Baobab tree!

### 3. Accessibility & Inclusive Design (WCAG 2.2 AA)
- **Dyslexia-Friendly Support**: Custom font option, expanded letter and line spacing, and syllable breakdown (e.g., `har-vest`, `be-cause`).
- **Visual Accessibility**: High-contrast mode, dark mode toggle, adjustable text sizes (1x, 1.25x, 1.5x), and touch targets exceeding 44×44px.
- **Hearing & Audio Support**: Web Audio API synthesizer for child-friendly sound effects (100% offline), Web Speech API text-to-speech fallback, and visual captions on all instructions.
- **Calm Mode**: Reduces rapid visual animations and sounds for neurodivergent pupils.

### 4. Role-Based Access & Privacy
- **Pupil Account**: Nicknames and cartoon avatar choices with **no email required**. Private progress tracking with zero public leaderboards or shaming.
- **Teacher Portal (Mr. B C Chuma)**:
  - Class rosters for Grade 4A and 4B.
  - Performance analytics (completion rates, tricky words, struggling learners).
  - Custom Word Editor with in-browser **microphone voice recording** to capture authentic Zimbabwean English pronunciation.
  - CSV export and printable certificates / learner progress reports.
- **Parent / Guardian View**: Access via simple parent code (e.g. `ROSE-4A`) with supportive home tips and practice words.
- **Administrator Dashboard**: Curriculum word management, category settings, and offline storage maintenance.

---

## 👥 Demo Accounts & Seed Data

The application comes pre-loaded with realistic data:
- **Demo Pupils**:
  - `Rose Chaguma` (Grade 4A, Active Progress, 38 Stars, 5-Day Streak)
  - `Chilongezyo Muzamba` (Grade 4A, 45 Stars, 7-Day Streak)
  - `Robert Muzamba` (Grade 4A, Beginner Track)
  - `Lytia Mwembe` (Grade 4A)
  - `Mungelo Moomba` (Grade 4A)
- **Demo Teacher**: Mr. Blessing Chilongezyo Chuma (`Mr. B C Chuma`)
- **Demo Parent**: Parent of Rose (`ROSE-4A`)
- **Demo Class**: Grade 4A & 4B
- **Preloaded Words**: Over 40 Grade 4 spelling words including both standard curriculum and local context: *because, beautiful, bicycle, business, calendar, caught, centre, certain, different, enough, exercise, favourite, February, forward, friend, garden, government, grammar, harvest, important, interest, library, medicine, minute, natural, notice, probably, question, remember, sentence, special, straight, strength, suppose, through, weather, Wednesday, maize, sadza, village, market, school, pupil, teacher, river, elephant, lion, zebra, drought, clinic*.

Use the **Chinego Primary Mode** bar at the top of the screen to switch between roles instantly.

---

## 🛠️ Technology Stack

- **Frontend**: React 19 + TypeScript
- **Styling**: Tailwind CSS v4 with custom accessibility variables
- **Audio Synthesizer**: Web Audio API (real-time generated sound waves, no MP3 dependencies)
- **Speech Engine**: Web Speech API (`SpeechSynthesis`) with child-friendly pitch and rate adjustment
- **Audio Recording**: `MediaRecorder` API for capturing teacher microphone audio
- **PWA & Offline**: Web App Manifest (`manifest.json`), Service Worker (`sw.js`), and `localStorage` state caching.

---

## 🚀 Running and Testing Locally

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

3. **Build for Production**:
   ```bash
   npm run build
   ```

4. **Lint and Type Check**:
   ```bash
   npm run lint
   ```
