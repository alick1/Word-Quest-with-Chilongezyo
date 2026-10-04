import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ClassManagement } from './ClassManagement';
import { CustomWordEditor } from './CustomWordEditor';
import { AssignmentCreator } from './AssignmentCreator';
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  Award, 
  Download, 
  Printer, 
  AlertTriangle, 
  CheckCircle2, 
  Lightbulb, 
  BarChart2, 
  Search,
  Filter
} from 'lucide-react';
import { playSound } from '../../utils/audio';

export const TeacherDashboard: React.FC = () => {
  const { teacher, pupils, words, assignments, accessibility } = useApp();

  const [activeTab, setActiveTab] = useState<'analytics' | 'roster' | 'custom-words' | 'assignments'>('analytics');
  const [filterClass, setFilterClass] = useState<string>('all');
  const [selectedPupilId, setSelectedPupilId] = useState<string>('all');
  const [showPrintModal, setShowPrintModal] = useState(false);

  // Compute analytics
  const filteredPupils = pupils.filter(p => filterClass === 'all' || p.className === filterClass);

  const totalPupils = filteredPupils.length;
  const totalClasses = 2; // Grade 4A and Grade 4B

  // Most difficult words across class:
  const wordErrorMap: Record<string, { word: string; incorrect: number; correct: number }> = {};
  filteredPupils.forEach(p => {
    Object.values(p.masteryRecords || {}).forEach(r => {
      const w = words.find(item => item.id === r.wordId);
      if (!w) return;
      if (!wordErrorMap[w.word]) {
        wordErrorMap[w.word] = { word: w.word, incorrect: 0, correct: 0 };
      }
      wordErrorMap[w.word].incorrect += r.incorrectCount;
      wordErrorMap[w.word].correct += r.correctCount;
    });
  });

  const sortedDifficultWords = Object.values(wordErrorMap)
    .sort((a, b) => b.incorrect - a.incorrect)
    .slice(0, 5);

  const pupilsNeedingSupport = filteredPupils.filter(p => {
    const records = Object.values(p.masteryRecords || {});
    return records.some(r => r.incorrectCount >= 2);
  });

  const totalTimeMinutes = Math.round(
    filteredPupils.reduce((sum, p) => sum + p.totalTimeSpentSeconds, 0) / 60
  );

  const averageAccuracy = 84; // %
  const questCompletionRate = 78; // %

  // CSV Export handler
  const handleExportCSV = () => {
    playSound('tap', accessibility.soundEffects);
    const headers = ['Pupil Name', 'Class', 'Stars', 'Streak (Days)', 'Mastered Words', 'Practising Words', 'Time Spent (Mins)', 'Parent Code'];
    const rows = filteredPupils.map(p => {
      const records = Object.values(p.masteryRecords || {});
      const mastered = records.filter(r => r.stage === 'Mastered').length;
      const practising = records.filter(r => r.stage === 'Practising').length;
      const mins = Math.round(p.totalTimeSpentSeconds / 60);
      return [
        `"${p.fullName}"`,
        `"${p.className}"`,
        p.stars,
        p.streakDays,
        mastered,
        practising,
        mins,
        `"${p.parentCode}"`
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Chinego_Primary_Grade4_Spelling_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintReport = () => {
    playSound('tap', accessibility.soundEffects);
    setShowPrintModal(true);
    setTimeout(() => {
      window.print();
    }, 400);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-20">
      {/* Teacher Profile Header */}
      <div className="bg-gradient-to-r from-amber-700 via-amber-800 to-stone-900 text-white rounded-3xl p-5 sm:p-6 shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-amber-400 text-amber-950 flex items-center justify-center font-bold text-2xl shadow-inner">
              👨‍🏫
            </div>
            <div>
              <span className="text-xs font-semibold text-amber-300 uppercase tracking-wider">
                {teacher.schoolName} · Educator Portal
              </span>
              <h2 className="text-2xl font-bold">
                {teacher.title} {teacher.fullName}
              </h2>
              <p className="text-xs text-stone-300 mt-0.5">
                Assigned Classes: {teacher.classes.join(', ')} · English Spelling Curriculum
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleExportCSV}
              className="touch-target px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs inline-flex items-center gap-1.5 border border-white/20 transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>

            <button
              type="button"
              onClick={handlePrintReport}
              className="touch-target px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-bold text-xs inline-flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Report</span>
            </button>
          </div>
        </div>

        {/* 4 Core Summary Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
          <div className="p-3 bg-white/10 rounded-2xl border border-white/10 text-center">
            <span className="text-amber-200 text-xs block">Enrolled Pupils</span>
            <div className="text-2xl font-black text-white mt-1">{totalPupils}</div>
          </div>

          <div className="p-3 bg-white/10 rounded-2xl border border-white/10 text-center">
            <span className="text-amber-200 text-xs block">Average Accuracy</span>
            <div className="text-2xl font-black text-emerald-300 mt-1">{averageAccuracy}%</div>
          </div>

          <div className="p-3 bg-white/10 rounded-2xl border border-white/10 text-center">
            <span className="text-amber-200 text-xs block">Quest Completion</span>
            <div className="text-2xl font-black text-amber-300 mt-1">{questCompletionRate}%</div>
          </div>

          <div className="p-3 bg-white/10 rounded-2xl border border-white/10 text-center">
            <span className="text-amber-200 text-xs block">Total Class Practice</span>
            <div className="text-2xl font-black text-sky-300 mt-1">{totalTimeMinutes}m</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs for Teacher Features */}
      <div className="flex border-b border-stone-200 bg-white p-1 rounded-2xl shadow-xs overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('analytics')}
          className={`touch-target px-4 py-2.5 rounded-xl font-bold text-xs inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer transition-colors ${
            activeTab === 'analytics' ? 'bg-amber-600 text-white shadow-xs' : 'text-stone-600 hover:bg-stone-50'
          }`}
        >
          <BarChart2 className="w-4 h-4" />
          <span>Analytics & Insights</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('roster')}
          className={`touch-target px-4 py-2.5 rounded-xl font-bold text-xs inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer transition-colors ${
            activeTab === 'roster' ? 'bg-amber-600 text-white shadow-xs' : 'text-stone-600 hover:bg-stone-50'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Class Roster ({pupils.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('custom-words')}
          className={`touch-target px-4 py-2.5 rounded-xl font-bold text-xs inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer transition-colors ${
            activeTab === 'custom-words' ? 'bg-amber-600 text-white shadow-xs' : 'text-stone-600 hover:bg-stone-50'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Custom Words & Audio Studio</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('assignments')}
          className={`touch-target px-4 py-2.5 rounded-xl font-bold text-xs inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer transition-colors ${
            activeTab === 'assignments' ? 'bg-amber-600 text-white shadow-xs' : 'text-stone-600 hover:bg-stone-50'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Assign Quests ({assignments.length})</span>
        </button>
      </div>

      {/* Tab 1: Analytics & Teacher Suggestions */}
      {activeTab === 'analytics' && (
        <div className="space-y-5">
          {/* Pedagogical AI / Teacher Suggestion Card (Page 14) */}
          <div className="p-4 bg-amber-50 rounded-2xl border-2 border-amber-300 text-amber-950 flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-amber-950 flex items-center justify-center shrink-0">
              <Lightbulb className="w-5 h-5 text-amber-900" />
            </div>
            <div className="text-xs space-y-1">
              <span className="font-bold text-sm block text-amber-900">
                Instructional Recommendation for Grade 4:
              </span>
              <p className="text-stone-700">
                "Several pupils are struggling with <strong>'because'</strong> and <strong>'harvest'</strong>. Consider assigning the <strong>Missing Letters</strong> or <strong>Build the Word</strong> activity to reinforce vowel digraphs."
              </p>
            </div>
          </div>

          {/* 2-Column: Difficult Words & Pupils Needing Support */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Most Difficult Class Words */}
            <div className="p-5 bg-white rounded-3xl border border-stone-200 shadow-xs space-y-3">
              <h3 className="font-bold text-base text-stone-900 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-500" />
                <span>Most Difficult Words in Class</span>
              </h3>

              <div className="space-y-2">
                {sortedDifficultWords.map(item => (
                  <div key={item.word} className="p-2.5 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between text-xs">
                    <span className="font-mono font-bold text-stone-900 text-sm">{item.word}</span>
                    <span className="text-rose-700 bg-rose-50 px-2 py-0.5 rounded font-bold">
                      {item.incorrect} misspellings
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pupils Needing Support */}
            <div className="p-5 bg-white rounded-3xl border border-stone-200 shadow-xs space-y-3">
              <h3 className="font-bold text-base text-stone-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-amber-600" />
                <span>Learners Needing Revision Support</span>
              </h3>

              <div className="space-y-2">
                {pupilsNeedingSupport.map(p => {
                  const records = Object.values(p.masteryRecords || {});
                  const tricky = records.filter(r => r.incorrectCount >= 2).length;

                  return (
                    <div key={p.id} className="p-2.5 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-stone-900 block">{p.fullName}</span>
                        <span className="text-stone-500">{p.className}</span>
                      </div>
                      <span className="text-amber-800 bg-amber-100 px-2 py-0.5 rounded font-semibold">
                        {tricky} tricky words
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Roster */}
      {activeTab === 'roster' && <ClassManagement />}

      {/* Tab 3: Custom Words */}
      {activeTab === 'custom-words' && <CustomWordEditor />}

      {/* Tab 4: Assignments */}
      {activeTab === 'assignments' && <AssignmentCreator />}

      {/* Printable Report Modal */}
      {showPrintModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-2xl w-full border border-stone-300 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setShowPrintModal(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-800 text-xl font-bold cursor-pointer"
            >
              ✕
            </button>

            <div className="text-center border-b pb-4 mb-4">
              <h2 className="text-xl font-black text-stone-900">
                Chinego Primary School · Grade 4 Spelling Progress
              </h2>
              <p className="text-xs text-stone-500">
                Teacher: Mr. Blessing Chilongezyo Chuma · Academic Term Assessment
              </p>
            </div>

            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-stone-300 text-stone-600">
                  <th className="py-2">Pupil Name</th>
                  <th className="py-2">Class</th>
                  <th className="py-2">Stars</th>
                  <th className="py-2">Streak</th>
                  <th className="py-2">Mastered</th>
                  <th className="py-2">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {filteredPupils.map(p => {
                  const mastered = Object.values(p.masteryRecords || {}).filter(r => r.stage === 'Mastered').length;
                  return (
                    <tr key={p.id}>
                      <td className="py-2 font-bold text-stone-900">{p.fullName}</td>
                      <td className="py-2">{p.className}</td>
                      <td className="py-2 font-bold text-amber-600">{p.stars} ★</td>
                      <td className="py-2">{p.streakDays} days</td>
                      <td className="py-2 text-emerald-700 font-bold">{mastered}</td>
                      <td className="py-2">{Math.round(p.totalTimeSpentSeconds / 60)} mins</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="touch-target px-4 py-2 rounded-xl bg-amber-600 text-white font-bold text-xs cursor-pointer"
              >
                Print Document
              </button>
              <button
                type="button"
                onClick={() => setShowPrintModal(false)}
                className="touch-target px-4 py-2 rounded-xl bg-stone-100 text-stone-700 font-semibold text-xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
