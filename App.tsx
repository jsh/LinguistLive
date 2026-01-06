
import React, { useState } from 'react';
import { LANGUAGES, SCENARIOS, LEVELS } from './constants';
import { Language, Scenario, ProficiencyLevel } from './types';
import VoiceChat from './components/VoiceChat';

const App: React.FC = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(LANGUAGES[0]);
  const [selectedScenario, setSelectedScenario] = useState<Scenario>(SCENARIOS[0]);
  const [selectedLevel, setSelectedLevel] = useState<ProficiencyLevel>('Intermediate');
  const [isLive, setIsLive] = useState(false);

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 py-8 px-4 md:px-8">
      <header className="w-full max-w-4xl flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
            L
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 leading-none">LinguistLive</h1>
            <p className="text-gray-500 text-sm">Powered by Gemini AI</p>
          </div>
        </div>
        {!isLive && (
          <div className="hidden lg:flex gap-2">
            <div className="flex items-center gap-1 bg-white px-3 py-1 rounded-full border border-gray-200">
              <span className="text-xs font-bold text-gray-400 uppercase">Lang</span>
              <span className="text-sm font-medium">{selectedLanguage.flag} {selectedLanguage.name}</span>
            </div>
            <div className="flex items-center gap-1 bg-white px-3 py-1 rounded-full border border-gray-200">
              <span className="text-xs font-bold text-gray-400 uppercase">Level</span>
              <span className="text-sm font-medium">{selectedLevel}</span>
            </div>
          </div>
        )}
      </header>

      <main className="w-full max-w-4xl">
        {!isLive ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <section className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Choose Your Language</h2>
                <div className="grid grid-cols-2 gap-3">
                  {LANGUAGES.map(lang => (
                    <button
                      key={lang.code}
                      onClick={() => setSelectedLanguage(lang)}
                      className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all text-left ${
                        selectedLanguage.code === lang.code
                          ? 'border-indigo-600 bg-indigo-50 shadow-md'
                          : 'border-white bg-white hover:border-gray-200 text-gray-600'
                      }`}
                    >
                      <span className="text-2xl">{lang.flag}</span>
                      <span className="font-semibold text-sm md:text-base">{lang.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Set Your Level</h2>
                <div className="flex flex-col gap-2">
                  {LEVELS.map(level => (
                    <button
                      key={level.value}
                      onClick={() => setSelectedLevel(level.value)}
                      className={`flex items-center gap-4 p-3 rounded-2xl border-2 transition-all text-left ${
                        selectedLevel === level.value
                          ? 'border-indigo-600 bg-indigo-50 shadow-md'
                          : 'border-white bg-white hover:border-gray-200 text-gray-600'
                      }`}
                    >
                      <span className="text-2xl bg-white p-2 rounded-xl border border-gray-100">{level.icon}</span>
                      <div>
                        <h3 className="font-bold text-gray-900 text-sm">{level.label}</h3>
                        <p className="text-xs text-gray-500 leading-tight">{level.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Select Scenario</h2>
                <div className="grid grid-cols-1 gap-3">
                  {SCENARIOS.map(scenario => (
                    <button
                      key={scenario.id}
                      onClick={() => setSelectedScenario(scenario)}
                      className={`flex items-start gap-4 p-4 rounded-2xl border-2 transition-all text-left ${
                        selectedScenario.id === scenario.id
                          ? 'border-indigo-600 bg-indigo-50 shadow-md'
                          : 'border-white bg-white hover:border-gray-200 text-gray-600'
                      }`}
                    >
                      <span className="text-3xl bg-white p-2 rounded-xl shadow-sm border border-gray-100">
                        {scenario.icon}
                      </span>
                      <div>
                        <h3 className="font-bold text-gray-900">{scenario.title}</h3>
                        <p className="text-sm text-gray-500">{scenario.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setIsLive(true)}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-indigo-100 transition-all flex items-center justify-center gap-2 group"
              >
                Enter Practice Room
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </button>
            </section>

            <section className="hidden md:flex flex-col items-center justify-center bg-indigo-600 rounded-3xl p-10 text-white text-center shadow-xl">
              <div className="w-24 h-24 bg-indigo-500 rounded-full flex items-center justify-center mb-6 text-5xl">
                🎙️
              </div>
              <h2 className="text-3xl font-bold mb-4 italic">"{selectedLanguage.welcomeMessage}"</h2>
              <p className="text-indigo-100 text-lg mb-8 max-w-sm">
                Practicing {selectedLanguage.name} at a <span className="font-bold underline">{selectedLevel}</span> level.
              </p>
              <div className="space-y-2 w-full">
                <div className="bg-indigo-500/50 rounded-xl p-3 text-sm flex items-center gap-3">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  Dynamic role-play partner
                </div>
                <div className="bg-indigo-500/50 rounded-xl p-3 text-sm flex items-center gap-3">
                  <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
                  Speech recognition feedback
                </div>
                <div className="bg-indigo-500/50 rounded-xl p-3 text-sm flex items-center gap-3">
                  <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
                  Level-adjusted difficulty
                </div>
              </div>
            </section>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setIsLive(false)}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-500"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                </button>
                <div>
                  <h2 className="font-bold text-gray-900">{selectedScenario.title}</h2>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-indigo-600 font-semibold tracking-wide uppercase">
                      {selectedLanguage.name} {selectedLanguage.flag}
                    </span>
                    <span className="text-[10px] text-gray-400 font-bold">•</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                      selectedLevel === 'Beginning' ? 'border-green-200 text-green-600 bg-green-50' :
                      selectedLevel === 'Intermediate' ? 'border-yellow-200 text-yellow-600 bg-yellow-50' :
                      'border-red-200 text-red-600 bg-red-50'
                    }`}>
                      {selectedLevel.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
              <div className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full uppercase tracking-widest animate-pulse">
                Live Session
              </div>
            </div>

            <VoiceChat language={selectedLanguage} scenario={selectedScenario} level={selectedLevel} />
          </div>
        )}
      </main>

      <footer className="mt-12 text-gray-400 text-sm">
        &copy; {new Date().getFullYear()} LinguistLive. All rights reserved.
      </footer>
    </div>
  );
};

export default App;
