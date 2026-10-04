import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SpellingWord, DifficultyLevel } from '../../types';
import { VoiceRecorder, speakText } from '../../utils/audio';
import { Mic, Square, Play, Plus, Trash2, CheckCircle2, Volume2 } from 'lucide-react';

interface CustomWordEditorProps {
  onClose?: () => void;
}

export const CustomWordEditor: React.FC<CustomWordEditorProps> = ({ onClose }) => {
  const { addWord, words, deleteWord, accessibility } = useApp();

  const [word, setWord] = useState('');
  const [category, setCategory] = useState('School and classroom words');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('Developing');
  const [definition, setDefinition] = useState('');
  const [exampleSentence, setExampleSentence] = useState('');
  const [syllables, setSyllables] = useState('');
  const [commonMisspelling, setCommonMisspelling] = useState('');
  const [hint, setHint] = useState('');
  const [imageIcon, setImageIcon] = useState('book');

  // Audio recording state
  const [recorder] = useState(() => new VoiceRecorder());
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const startRecord = async () => {
    const ok = await recorder.start();
    if (ok) {
      setIsRecording(true);
    }
  };

  const stopRecord = async () => {
    try {
      const audioData = await recorder.stop();
      setIsRecording(false);
      setRecordedAudioUrl(audioData);
    } catch (e) {
      setIsRecording(false);
      console.error(e);
    }
  };

  const handleTestTTS = () => {
    if (!word.trim()) return;
    speakText(`Listen: ${word}. ${exampleSentence || ''}`, {
      rate: accessibility.speechRate,
      customAudioUrl: recordedAudioUrl || undefined
    });
  };

  const handleSaveWord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!word.trim() || !definition.trim()) return;

    addWord({
      word: word.trim().toLowerCase(),
      category,
      difficulty,
      definition: definition.trim(),
      exampleSentence: exampleSentence.trim() || `The word is ${word}.`,
      syllables: syllables.trim() || word.trim(),
      commonMisspelling: commonMisspelling.trim(),
      hint: hint.trim() || `Think about the syllables in ${word}.`,
      imageIcon,
      imageDescription: `Illustration for ${word}`,
      customAudioUrl: recordedAudioUrl || undefined,
      audioPronunciationText: `The word is ${word}. ${exampleSentence}`
    });

    setSaveSuccess(true);
    // Reset form
    setWord('');
    setDefinition('');
    setExampleSentence('');
    setSyllables('');
    setCommonMisspelling('');
    setHint('');
    setRecordedAudioUrl(null);

    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-stone-900">
            Word Builder & Audio Recording Studio
          </h3>
          <p className="text-xs text-stone-500">
            Add curriculum words and record your own authentic Zimbabwean English pronunciation.
          </p>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-3 bg-emerald-100 border border-emerald-400 text-emerald-900 rounded-xl text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>New word successfully added to Chinego Primary spelling database!</span>
        </div>
      )}

      {/* Editor Form */}
      <form onSubmit={handleSaveWord} className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-stone-700 block mb-1">
              Spelling Word: *
            </label>
            <input
              type="text"
              required
              value={word}
              onChange={(e) => setWord(e.target.value)}
              placeholder="e.g. library, bicycle"
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm font-mono font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-stone-700 block mb-1">
              Syllable Breakdown: (e.g. li-brar-y)
            </label>
            <input
              type="text"
              value={syllables}
              onChange={(e) => setSyllables(e.target.value)}
              placeholder="e.g. li-brar-y"
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-stone-700 block mb-1">
              Theme / Category:
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
            >
              <option value="School and classroom words">School and classroom words</option>
              <option value="Home and family words">Home and family words</option>
              <option value="Food and farming words">Food and farming words</option>
              <option value="Animals and nature">Animals and nature</option>
              <option value="Health and hygiene">Health and hygiene</option>
              <option value="Weather and seasons">Weather and seasons</option>
              <option value="Transport and community">Transport and community</option>
              <option value="Sports and games">Sports and games</option>
              <option value="Places in Zimbabwe">Places in Zimbabwe</option>
              <option value="Challenge words">Challenge words</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-stone-700 block mb-1">
              Difficulty Level:
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as DifficultyLevel)}
              className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
            >
              <option value="Beginner">Beginner</option>
              <option value="Developing">Developing</option>
              <option value="Challenge">Challenge</option>
            </select>
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-stone-700 block mb-1">
            Simple Definition (suitable for 9-10 year olds): *
          </label>
          <input
            type="text"
            required
            value={definition}
            onChange={(e) => setDefinition(e.target.value)}
            placeholder="A place where books are kept for reading and borrowing."
            className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-stone-700 block mb-1">
            Example Sentence (with local context):
          </label>
          <input
            type="text"
            value={exampleSentence}
            onChange={(e) => setExampleSentence(e.target.value)}
            placeholder="Our class visited the sunny school library."
            className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-stone-700 block mb-1">
              Common Misspelling (Warning):
            </label>
            <input
              type="text"
              value={commonMisspelling}
              onChange={(e) => setCommonMisspelling(e.target.value)}
              placeholder="e.g. libary"
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-stone-700 block mb-1">
              Hint for Learners:
            </label>
            <input
              type="text"
              value={hint}
              onChange={(e) => setHint(e.target.value)}
              placeholder="Remember the first 'r' in the middle!"
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>

        {/* Audio Recording / Upload Section */}
        <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-2">
          <label className="text-xs font-bold text-amber-950 block">
            Audio Pronunciation (Record Teacher Voice or Use Built-in Speech):
          </label>

          <div className="flex flex-wrap items-center gap-2">
            {!isRecording ? (
              <button
                type="button"
                onClick={startRecord}
                className="touch-target px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Mic className="w-4 h-4" />
                <span>Record Teacher Voice</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={stopRecord}
                className="touch-target px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs inline-flex items-center gap-1.5 animate-pulse cursor-pointer shadow-xs"
              >
                <Square className="w-4 h-4" />
                <span>Stop Recording</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleTestTTS}
              disabled={!word.trim()}
              className="touch-target px-3 py-2 rounded-xl bg-white hover:bg-stone-100 text-stone-800 border border-stone-300 font-semibold text-xs inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
            >
              <Volume2 className="w-4 h-4 text-emerald-600" />
              <span>Preview Audio</span>
            </button>

            {recordedAudioUrl && (
              <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-lg">
                ✓ Teacher Audio Captured
              </span>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="touch-target w-full py-3.5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-sm inline-flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-98"
        >
          <Plus className="w-4 h-4" />
          <span>Save Word to Chinego Curriculum</span>
        </button>
      </form>
    </div>
  );
};
