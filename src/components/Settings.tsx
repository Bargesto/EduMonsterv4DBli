import { useState, useEffect } from 'react';
import { loadState, saveState } from '../utils/storage';
import { Check } from 'lucide-react';

export default function Settings() {
  const [schoolName, setSchoolName] = useState('');
  const [language, setLanguage] = useState<'en' | 'tr'>('en');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const state = loadState();
    if (state.currentTeacher) {
      setSchoolName(state.currentTeacher.schoolName);
    }
    if (state.settings) {
      setLanguage(state.settings.language);
    }
  }, []);

  const handleSchoolNameChange = () => {
    const state = loadState();
    if (!state.currentTeacher) return;

    // Update current teacher's school name
    state.currentTeacher.schoolName = schoolName;
    
    // Update the teacher in the teachers array
    const teacherIndex = state.teachers.findIndex(t => t.id === state.currentTeacher?.id);
    if (teacherIndex !== -1) {
      state.teachers[teacherIndex].schoolName = schoolName;
    }

    saveState(state);
    showSuccess('School name updated successfully!');
  };

  const handleLanguageChange = (newLanguage: 'en' | 'tr') => {
    const state = loadState();
    state.settings.language = newLanguage;
    setLanguage(newLanguage);
    saveState(state);
    showSuccess(newLanguage === 'en' ? 'Language updated successfully!' : 'Dil başarıyla güncellendi!');
  };

  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">
        {language === 'en' ? 'Settings' : 'Ayarlar'}
      </h1>

      {/* Language Settings */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          {language === 'en' ? 'Language Settings' : 'Dil Ayarları'}
        </h2>
        <div className="flex gap-4">
          <button
            onClick={() => handleLanguageChange('en')}
            className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg border ${
              language === 'en'
                ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            {language === 'en' && <Check className="w-4 h-4" />}
            English
          </button>
          <button
            onClick={() => handleLanguageChange('tr')}
            className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg border ${
              language === 'tr'
                ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            {language === 'tr' && <Check className="w-4 h-4" />}
            Türkçe
          </button>
        </div>
      </div>

      {/* School Settings */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          {language === 'en' ? 'School Settings' : 'Okul Ayarları'}
        </h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="schoolName" className="block text-sm font-medium text-gray-700 mb-1">
              {language === 'en' ? 'School Name' : 'Okul Adı'}
            </label>
            <input
              type="text"
              id="schoolName"
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder={language === 'en' ? 'Enter school name' : 'Okul adını girin'}
            />
          </div>
          <button
            onClick={handleSchoolNameChange}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            {language === 'en' ? 'Save Changes' : 'Değişiklikleri Kaydet'}
          </button>
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg">
          {successMessage}
        </div>
      )}
    </div>
  );
}