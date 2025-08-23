import { useState } from 'react';
import { Check } from 'lucide-react';

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    match: false
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    // Validate password in real-time
    if (name === 'newPassword') {
      setPasswordValidation((prev) => ({
        ...prev,
        length: value.length >= 10,
        match: value === formData.confirmPassword && value !== ''
      }));
    }

    if (name === 'confirmPassword') {
      setPasswordValidation((prev) => ({
        ...prev,
        match: value === formData.newPassword && value !== ''
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (passwordValidation.length && passwordValidation.match) {
      console.log('Password change submitted:', formData);
      // Handle password change logic here
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4 py-6">
      <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-md">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
              <div className="w-6 h-6 bg-white rounded opacity-80"></div>
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-400 rounded opacity-90"></div>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-2">Change Your Password</h2>

        {/* Description */}
        <p className="text-gray-600 text-center mb-8">Enter a new password below to change your password.</p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Current Password */}
          <div>
            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Current password*
            </label>
            <input
              type="password"
              id="currentPassword"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleInputChange}
              className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* New Password */}
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
              New password*
            </label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleInputChange}
              className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Re-enter new password*
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Password Requirements */}
          <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
            <p className="text-sm font-medium text-gray-700 mb-3">Your password must contain:</p>
            <div className="flex items-center text-sm">
              <Check className={`w-4 h-4 mr-2 ${passwordValidation.length ? 'text-green-500' : 'text-gray-400'}`} />
              <span className={passwordValidation.length ? 'text-green-600' : 'text-gray-600'}>At least 10 characters in length</span>
            </div>
            {formData.confirmPassword && (
              <div className="flex items-center text-sm mt-2">
                <Check className={`w-4 h-4 mr-2 ${passwordValidation.match ? 'text-green-500' : 'text-gray-400'}`} />
                <span className={passwordValidation.match ? 'text-green-600' : 'text-gray-600'}>Passwords match</span>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!passwordValidation.length || !passwordValidation.match || !formData.currentPassword}
            className={`w-full py-3 px-4 rounded-md font-medium text-white transition-colors ${
              passwordValidation.length && passwordValidation.match && formData.currentPassword
                ? 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            Reset password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
