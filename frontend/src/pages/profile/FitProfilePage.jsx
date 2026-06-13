import React, { useState, useEffect } from 'react';
import { getUserFitProfile, updateUserFitProfile } from '../../api/fitProfileService';
import { Save, Ruler, UserCircle2, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function FitProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const data = await getUserFitProfile();
      setProfile(data);
      setLoading(false);
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    await updateUserFitProfile(profile);
    setSaving(false);
    // Optional: show toast notification here
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#14b8a6]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <button 
        onClick={() => navigate('/profile')} 
        className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Profile
      </button>

      <div className="flex items-center mb-8">
        <div className="p-3 bg-[#14b8a6]/10 rounded-xl mr-4">
          <UserCircle2 className="w-8 h-8 text-[#14b8a6]" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Your Fit Profile</h1>
          <p className="text-sm text-gray-500">Provide accurate measurements for better AI size recommendations.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 sm:p-8 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900 flex items-center">
            <Ruler className="w-5 h-5 mr-2 text-gray-400" /> Measurements
          </h2>
          <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full border border-green-200">
            Profile Active
          </span>
        </div>

        <form onSubmit={handleSave} className="p-6 sm:p-8 space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Height (cm)</label>
              <input 
                type="number" 
                name="height" 
                value={profile.height} 
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#14b8a6]/30 focus:border-[#14b8a6] outline-none transition-all font-medium text-gray-900" 
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Weight (kg)</label>
              <input 
                type="number" 
                name="weight" 
                value={profile.weight} 
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#14b8a6]/30 focus:border-[#14b8a6] outline-none transition-all font-medium text-gray-900" 
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Gender</label>
              <select 
                name="gender" 
                value={profile.gender} 
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#14b8a6]/30 focus:border-[#14b8a6] outline-none transition-all font-medium text-gray-900 appearance-none"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Unisex">Unisex / Prefer not to say</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Age Group</label>
              <select 
                name="ageGroup" 
                value={profile.ageGroup} 
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#14b8a6]/30 focus:border-[#14b8a6] outline-none transition-all font-medium text-gray-900 appearance-none"
              >
                <option value="18-24">18-24</option>
                <option value="25-34">25-34</option>
                <option value="35-44">35-44</option>
                <option value="45+">45+</option>
              </select>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100">
            <h3 className="text-md font-bold text-gray-900 mb-6">Detailed Body Measurements (Optional)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Chest (cm)</label>
                <input 
                  type="number" 
                  name="chest" 
                  value={profile.chest} 
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#14b8a6]/30 focus:border-[#14b8a6] outline-none transition-all font-medium text-gray-900" 
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Waist (cm)</label>
                <input 
                  type="number" 
                  name="waist" 
                  value={profile.waist} 
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#14b8a6]/30 focus:border-[#14b8a6] outline-none transition-all font-medium text-gray-900" 
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Hip (cm)</label>
                <input 
                  type="number" 
                  name="hip" 
                  value={profile.hip} 
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#14b8a6]/30 focus:border-[#14b8a6] outline-none transition-all font-medium text-gray-900" 
                />
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100">
            <h3 className="text-md font-bold text-gray-900 mb-6">Style Preferences</h3>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">Preferred Fit</label>
              <div className="flex gap-4">
                {['Slim', 'Regular', 'Relaxed'].map(fit => (
                  <label key={fit} className={`flex-1 cursor-pointer text-center py-3 px-4 rounded-xl border-2 font-bold text-sm transition-all ${
                    profile.preferredFit === fit ? 'border-[#14b8a6] bg-[#14b8a6]/5 text-[#14b8a6]' : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                  }`}>
                    <input 
                      type="radio" 
                      name="preferredFit" 
                      value={fit} 
                      checked={profile.preferredFit === fit} 
                      onChange={handleChange}
                      className="hidden" 
                    />
                    {fit}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-8 flex justify-end">
            <button 
              type="submit" 
              disabled={saving}
              className="flex items-center px-8 py-3 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all"
            >
              {saving ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              ) : (
                <Save className="w-5 h-5 mr-2" />
              )}
              Save Fit Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
