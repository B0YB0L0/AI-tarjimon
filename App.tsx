
import React, { useState, useCallback } from 'react';
import { translateWord } from './services/geminiService';
import { LANGUAGES } from './constants';
import { TranslateIcon, BookOpenIcon, ErrorIcon } from './components/IconComponents';
import { Loader } from './components/Loader';

const App: React.FC = () => {
  const [word, setWord] = useState<string>('');
  const [targetLanguage, setTargetLanguage] = useState<string>('English');
  const [translation, setTranslation] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleTranslate = useCallback(async () => {
    if (!word.trim()) {
      setError("Please enter a word to translate.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setTranslation('');

    try {
      const result = await translateWord(word, targetLanguage);
      setTranslation(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [word, targetLanguage]);

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans flex items-center justify-center p-4">
      <div className="w-full max-w-2xl mx-auto">
        <div className="bg-gray-800/50 backdrop-blur-sm border border-cyan-500/20 rounded-2xl shadow-2xl shadow-cyan-500/10 p-6 md:p-10">
          <header className="text-center mb-8">
            <div className="inline-flex items-center gap-3">
              <BookOpenIcon />
              <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-500">
                Glossary AI
              </h1>
            </div>
            <p className="text-gray-400 mt-2">O'zbekcha so'zlarning ma'nosini dunyo tillarida kashf eting</p>
          </header>

          <main>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="word-input" className="block text-sm font-medium text-gray-300 mb-2">
                    So'zni kiriting (O'zbekcha)
                  </label>
                  <input
                    id="word-input"
                    type="text"
                    value={word}
                    onChange={(e) => setWord(e.target.value)}
                    placeholder="Masalan: salom"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-all duration-300 placeholder-gray-500"
                  />
                </div>
                <div>
                  <label htmlFor="language-select" className="block text-sm font-medium text-gray-300 mb-2">
                    Tilni tanlang
                  </label>
                  <select
                    id="language-select"
                    value={targetLanguage}
                    onChange={(e) => setTargetLanguage(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-all duration-300 appearance-none bg-no-repeat bg-right-3"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                      backgroundPosition: 'right 0.75rem center',
                      backgroundSize: '1.5em 1.5em'
                    }}
                  >
                    {LANGUAGES.map((lang) => (
                      <option key={lang.code} value={lang.name}>
                        {lang.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                onClick={handleTranslate}
                disabled={isLoading || !word.trim()}
                className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader />
                    <span>Tarjima qilinmoqda...</span>
                  </>
                ) : (
                  <>
                    <TranslateIcon />
                    <span>Tarjima qilish</span>
                  </>
                )}
              </button>
            </div>

            {error && (
              <div className="mt-6 bg-red-900/50 border border-red-500/50 text-red-300 p-4 rounded-lg flex items-center gap-3">
                <ErrorIcon />
                <p>{error}</p>
              </div>
            )}
            
            {(translation || isLoading) && !error && (
              <div className="mt-8">
                <h2 className="text-xl font-semibold text-gray-300 mb-4">Natija:</h2>
                <div className="bg-gray-900/70 border border-gray-700 rounded-lg p-6 min-h-[150px] whitespace-pre-wrap text-gray-200 prose prose-invert max-w-none prose-p:my-2">
                  {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-gray-400 animate-pulse">Javob kutilmoqda...</p>
                    </div>
                  ) : (
                    translation
                  )}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default App;
