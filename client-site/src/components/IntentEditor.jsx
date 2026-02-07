// Intent Editor Component - Live JSON editor for intents
import React, { useState } from 'react';
import { Edit, Save, RotateCcw } from 'lucide-react';
import { useFormStore } from '../store/formStore';
import { useLogStore } from '../store/logStore';
import { exampleIntents } from '../intents/exampleIntents';

const IntentEditor = ({ onIntentChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedIntent, setSelectedIntent] = useState('contactForm');
  const [jsonInput, setJsonInput] = useState('');
  const [jsonError, setJsonError] = useState('');
  const { setActiveIntent } = useFormStore();
  const { logInfo, logError } = useLogStore();

  const handleEditClick = () => {
    setIsEditing(true);
    const intent = exampleIntents[selectedIntent];
    setJsonInput(JSON.stringify(intent, null, 2));
  };

  const handleSave = () => {
    try {
      const parsedIntent = JSON.parse(jsonInput);
      setJsonError('');
      setActiveIntent(parsedIntent);
      onIntentChange(parsedIntent);
      setIsEditing(false);
      logInfo('Intent updated successfully', { intentId: parsedIntent.id });
    } catch (error) {
      setJsonError(error.message);
      logError('Intent JSON parse error', { error: error.message });
    }
  };

  const handleReset = () => {
    const intent = exampleIntents[selectedIntent];
    setJsonInput(JSON.stringify(intent, null, 2));
    setJsonError('');
  };

  const handleIntentSelect = (intentKey) => {
    setSelectedIntent(intentKey);
    const intent = exampleIntents[intentKey];
    setActiveIntent(intent);
    onIntentChange(intent);
    setIsEditing(false);
    logInfo('Intent changed', { intentId: intent.id });
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Edit className="w-5 h-5 text-purple-400" />
          <h3 className="text-lg font-bold text-white">Intent Editor</h3>
        </div>
        {!isEditing && (
          <button
            onClick={handleEditClick}
            className="px-3 py-1 bg-purple-600 text-white rounded text-sm hover:bg-purple-700 transition"
          >
            Edit JSON
          </button>
        )}
      </div>

      {!isEditing ? (
        <div className="space-y-2">
          <label className="block text-sm text-gray-400 mb-1">Select Intent:</label>
          <select
            value={selectedIntent}
            onChange={(e) => handleIntentSelect(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
          >
            {Object.entries(exampleIntents).map(([key, intent]) => (
              <option key={key} value={key}>
                {intent.title} ({intent.type})
              </option>
            ))}
          </select>

          <div className="mt-3 p-3 bg-gray-900 rounded border border-gray-700">
            <div className="text-xs text-gray-400">Active Intent:</div>
            <div className="text-sm text-white font-semibold mt-1">
              {exampleIntents[selectedIntent].title}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Type: {exampleIntents[selectedIntent].type}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            className="w-full h-64 px-3 py-2 bg-gray-900 border border-gray-600 rounded text-white font-mono text-xs"
            spellCheck={false}
          />

          {jsonError && (
            <div className="p-2 bg-red-900/30 border border-red-600 rounded text-red-300 text-xs">
              Error: {jsonError}
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="flex-1 px-3 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              Apply Changes
            </button>
            <button
              onClick={handleReset}
              className="px-3 py-2 bg-gray-700 text-white rounded text-sm hover:bg-gray-600 transition"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="px-3 py-2 bg-gray-700 text-white rounded text-sm hover:bg-gray-600 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default IntentEditor;
