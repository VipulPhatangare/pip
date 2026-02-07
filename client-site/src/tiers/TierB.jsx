// Tier B - Constraint Mode - 2D ANIMATIONS & MODERATE EFFECTS
import React from 'react';
import { Battery, Wifi, Cpu, Activity, Database, CheckCircle } from 'lucide-react';
import { useFormStore } from '../store/formStore';

const TierB = ({ intent, metrics }) => {
  const { updateField, getFormData } = useFormStore();
  const formData = getFormData(intent.id);

  const handleInputChange = (fieldId, value) => {
    updateField(intent.id, fieldId, value);
  };

  // Render form intent with 2D animations (lighter than Tier A)
  const renderForm = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12">
      {/* Subtle Animated Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(139,92,246,0.3),transparent_50%)] animate-pulse"></div>
      </div>

      <div className="relative max-w-2xl mx-auto px-4">
        {/* Card with 2D slide-in animation */}
        <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-md p-8 rounded-xl shadow-2xl border border-purple-500/30 transform transition-all duration-500 hover:scale-[1.01]">
          
          {/* Header with slide-in animation */}
          <div className="flex items-center gap-3 mb-6 animate-slide-in-left">
            <div className="w-4 h-4 bg-purple-500 rounded-full animate-pulse"></div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              {intent.title}
            </h2>
            <CheckCircle className="w-6 h-6 text-purple-400 animate-bounce-slow" />
          </div>
          
          <p className="text-gray-300 mb-8 text-lg animate-fade-in">{intent.description}</p>

          {/* Form Fields with staggered fade-in */}
          <div className="space-y-5">
            {intent.fields.map((field, index) => (
              <div 
                key={field.id} 
                className="space-y-2 animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <label className="block text-gray-200 font-semibold text-sm uppercase tracking-wide">
                  {field.label}
                  {field.required && <span className="text-purple-400 ml-1">*</span>}
                </label>
                
                {field.type === 'textarea' ? (
                  <textarea
                    placeholder={field.placeholder}
                    rows={field.rows || 3}
                    value={formData[field.id] || ''}
                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                    className="w-full px-4 py-3 bg-gray-700/50 border-2 border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 focus:bg-gray-700 transition-all duration-300 transform focus:scale-[1.01]"
                  />
                ) : field.type === 'select' ? (
                  <select
                    value={formData[field.id] || ''}
                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                    className="w-full px-4 py-3 bg-gray-700/50 border-2 border-gray-600 rounded-lg text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 focus:bg-gray-700 transition-all duration-300 transform focus:scale-[1.01]"
                  >
                    <option value="">Select {field.label}</option>
                    {field.options?.map(opt => (
                      <option key={opt} value={opt} className="bg-gray-800">{opt}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type}
                    placeholder={field.placeholder}
                    value={formData[field.id] || ''}
                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                    className="w-full px-4 py-3 bg-gray-700/50 border-2 border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 focus:bg-gray-700 transition-all duration-300 transform focus:scale-[1.01]"
                  />
                )}
              </div>
            ))}
          </div>

          {/* Action Buttons with hover animations */}
          <div className="flex gap-4 mt-8">
            {intent.actions?.map((action, index) => (
              <button
                key={action.id}
                className={`flex-1 py-4 rounded-lg font-bold text-lg uppercase tracking-wide transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 active:scale-95 ${
                  action.type === 'primary'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-500 hover:to-pink-500 shadow-lg hover:shadow-purple-500/50'
                    : 'bg-gray-700 text-gray-200 hover:bg-gray-600 shadow-lg'
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Indicator */}
      <div className="fixed bottom-4 right-4 bg-gray-800/80 backdrop-blur-sm px-4 py-2 rounded-lg border border-purple-500 animate-fade-in">
        <p className="text-purple-400 text-sm font-bold">
          ⚡ TIER B: 2D Optimized
        </p>
        <p className="text-purple-300 text-xs">Bundle: ~250KB | Reduced Effects</p>
      </div>
    </div>
  );

  // Render dashboard intent
  const renderDashboard = () => {
    const icons = { battery: Battery, wifi: Wifi, cpu: Cpu, activity: Activity, database: Database };
    
    return (
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-white">{intent.title}</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {intent.widgets.map((widget) => {
            const Icon = icons[widget.icon] || Activity;
            const value = metrics[widget.valueKey];
            const secondaryValue = widget.secondaryKey ? metrics[widget.secondaryKey] : null;
            
            return (
              <div
                key={widget.id}
                className="bg-gray-800 p-4 rounded-lg border border-gray-700"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-300">{widget.label}</h3>
                  <Icon className="w-5 h-5 text-purple-400" />
                </div>
                
                <div className="text-3xl font-bold text-white">
                  {value}
                  {widget.unit && <span className="text-xl text-gray-400 ml-1">{widget.unit}</span>}
                </div>
                
                {secondaryValue && (
                  <div className="text-xs text-gray-400 mt-1">
                    of {secondaryValue}{widget.unit}
                  </div>
                )}
                
                {widget.displayFormat === 'progress' && secondaryValue && (
                  <div className="mt-2 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${(value / secondaryValue) * 100}%` }}
                      className="h-full bg-purple-500 transition-all duration-500"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Render based on intent type
  switch (intent.type) {
    case 'form':
      return renderForm();
    case 'dashboard':
      return renderDashboard();
    default:
      return renderForm();
  }
};

export default TierB;
