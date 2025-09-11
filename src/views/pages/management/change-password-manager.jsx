import { useState } from 'react';
import Header from '../../../layouts/HotelManagementLayout/Header';
import { Eye, EyeClosed } from 'lucide-react';
import { changeManagerPassword } from 'services/authService';
import { toast } from 'react-toastify';

const ChangePasswordManager = () => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    username: '',
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

    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }

    // Validate password in real-time
    if (name === 'newPassword') {
      const isValidLength = value.length >= 6;
      setPasswordValidation((prev) => ({
        ...prev,
        length: isValidLength,
        match: value === formData.confirmPassword && value !== ''
      }));

      if (!isValidLength && value.length > 0) {
        setErrors((prev) => ({ ...prev, newPassword: 'Mật khẩu phải có ít nhất 6 ký tự.' }));
      }
    }

    if (name === 'confirmPassword') {
      const isMatch = value === formData.newPassword && value !== '';
      setPasswordValidation((prev) => ({
        ...prev,
        match: isMatch
      }));

      if (!isMatch && value.length > 0) {
        setErrors((prev) => ({ ...prev, confirmPassword: 'Mật khẩu xác nhận không khớp.' }));
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate all fields before submit
    const newErrors = {};

    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Vui lòng nhập mật khẩu hiện tại.';
    }

    if (!formData.newPassword) {
      newErrors.newPassword = 'Vui lòng nhập mật khẩu mới.';
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = 'Mật khẩu phải có ít nhất 6 ký tự.';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu mới.';
    } else if (formData.confirmPassword !== formData.newPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const username = localStorage.getItem('username') || '';
    formData.username = username;

    // All validations passed
    const doChangePassword = async () => {
      try {
        console.log('Changing password with data:', formData);
        const pwdResponse = await changeManagerPassword(formData);

        if (pwdResponse && pwdResponse.status === 200) {
          toast.success('Đổi mật khẩu thành công!');
        } else {
          const message = (pwdResponse && pwdResponse.data && pwdResponse.data.message) || 'Đổi mật khẩu thất bại. Vui lòng thử lại!';
          toast.error(message);
        }
      } catch (error) {
        console.error('Error changing password:', error);

        if (error.response) {
          const status = error.response.status;
          let message = 'Đã xảy ra lỗi.';

          switch (status) {
            case 400:
              message = (error.response.data && error.response.data.message) || 'Dữ liệu không hợp lệ.';
              break;
            case 401:
              message = 'Mật khẩu cũ không đúng.';
              break;
            case 403:
              message = 'Bạn không có quyền đổi mật khẩu.';
              break;
            case 500:
              message = 'Lỗi hệ thống. Vui lòng thử lại sau.';
              break;
            default:
              message = (error.response.data && error.response.data.message) || 'Có lỗi xảy ra.';
          }

          toast.error(message);
        } else {
          // Lỗi mạng, không kết nối được server
          toast.error('Không thể kết nối đến máy chủ. Vui lòng kiểm tra mạng!');
        }
      }
    };

    doChangePassword();
    // Handle password change logic here
  };

  return (
    <>
      <Header />
      <div className="flex items-center justify-center bg-gray-100 px-4 py-6">
        <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-md">
          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                <div className="w-6 h-6 bg-white rounded opacity-80"></div>
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-400 rounded opacity-90"></div>
            </div>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-semibold text-gray-800 text-center mb-2">Đổi mật khẩu</h2>
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Current Password */}
            <div className="space-y-2">
              <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Mật khẩu hiện tại*
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  id="currentPassword"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleInputChange}
                  className="w-full px-3 py-3 pr-12 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center text-gray-400 hover:text-gray-600"
                  style={{ top: 'calc(50% + 14px)' }}
                  aria-label={showCurrentPassword ? 'Hide password' : 'Show password'}
                  tabIndex={-1}
                >
                  {showCurrentPassword ? <EyeClosed className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.currentPassword && <div className="text-sm text-red-600">{errors.currentPassword}</div>}
            </div>

            {/* New Password */}
            <div className="space-y-2">
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Mật khẩu mới*
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  id="newPassword"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  className="w-full spac-x-2 px-3 py-3 pr-12 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center text-gray-400 hover:text-gray-600"
                  style={{ top: 'calc(50% + 14px)' }}
                  aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                  tabIndex={-1}
                >
                  {showNewPassword ? <EyeClosed className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.newPassword && <div className="text-sm text-red-600">{errors.newPassword}</div>}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Nhập lại mật khẩu mới*
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full px-3 py-3 pr-12 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center text-gray-400 hover:text-gray-600"
                  style={{ top: 'calc(50% + 14px)' }}
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <EyeClosed className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.confirmPassword && <div className="text-sm text-red-600">{errors.confirmPassword}</div>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!formData.currentPassword || !passwordValidation.length || !passwordValidation.match}
              className={`w-full py-3 px-4 rounded-md font-medium text-white transition-colors ${
                formData.currentPassword && passwordValidation.length && passwordValidation.match
                  ? 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              Đổi mật khẩu
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ChangePasswordManager;
