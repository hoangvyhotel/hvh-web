import { useState } from 'react';
import { toast } from 'react-toastify';
import { FileUser } from 'lucide-react';
import { http } from 'lib/http/axios';
import { authRequests } from 'services/authService';
import Header from 'layouts/HotelManagementLayout/Header';

const AddUserPage = () => {
  // ---------------- STATE ----------------
  const [formData, setFormData] = useState({
    hotelName: '',
    username: '',
    password: '',
    confirmPassword: '',
    passwordManage: '',
    confirmPasswordManage: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ---------------- HANDLERS ----------------
  const validateForm = () => {
    const newErrors = {};

    if (!formData.hotelName) newErrors.hotelName = 'Tên khách sạn/chi nhánh là bắt buộc';
    if (!formData.username) {
      newErrors.username = 'Tên đăng nhập là bắt buộc';
    } else if (/\s/.test(formData.username)) {
      newErrors.username = 'Tên đăng nhập không được chứa dấu cách';
    }
    if (!formData.password) {
      newErrors.password = 'Mật khẩu là bắt buộc';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }

    if (!formData.passwordManage) {
      newErrors.passwordManage = 'Mật khẩu quản lý là bắt buộc';
    } else if (formData.passwordManage.length < 6) {
      newErrors.passwordManage = 'Mật khẩu quản lý phải có ít nhất 6 ký tự';
    }

    if (formData.passwordManage !== formData.confirmPasswordManage) {
      newErrors.confirmPasswordManage = 'Mật khẩu quản lý xác nhận không khớp';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Vui lòng kiểm tra lại thông tin!');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await http(
        authRequests.register({
          hotelName: formData.hotelName,
          username: formData.username,
          password: formData.password,
          passwordManage: formData.passwordManage
        })
      );
      console.log(response);

      toast.success(response.data.message || 'Đăng ký thành công');

      setFormData({
        hotelName: '',
        username: '',
        password: '',
        confirmPassword: '',
        passwordManage: '',
        confirmPasswordManage: ''
      });
      setErrors({});
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message || 'Có lỗi xảy ra');
      } else {
        toast.error(error.message || 'Không thể kết nối đến server');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // ---------------- RENDER ----------------
  return (
    <div className="p-2 sm:p-4 md:p-6">
      {/* HEADER */}
      <div className="border-b border-gray-300 mb-4" style={{ borderBottomWidth: '0.5px' }}>
        <Header title="Thêm người dùng" icon={<FileUser className="w-6 h-6 mr-2 text-green-600" />} />
      </div>

      {/* FORM */}
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md max-w-2xl mx-auto">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Tên khách sạn/chi nhánh</label>
            <input
              type="text"
              name="hotelName"
              value={formData.hotelName}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {errors.hotelName && <p className="text-red-500 text-sm mt-1">{errors.hotelName}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Tên đăng nhập</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Mật khẩu</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Xác nhận mật khẩu</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Mật khẩu quản lý</label>
            <input
              type="password"
              name="passwordManage"
              value={formData.passwordManage}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {errors.passwordManage && <p className="text-red-500 text-sm mt-1">{errors.passwordManage}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Xác nhận mật khẩu quản lý</label>
            <input
              type="password"
              name="confirmPasswordManage"
              value={formData.confirmPasswordManage}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {errors.confirmPasswordManage && <p className="text-red-500 text-sm mt-1">{errors.confirmPasswordManage}</p>}
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`px-4 py-2 bg-green-500 text-white font-semibold rounded hover:bg-green-600 transition-colors ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
              }`}
            >
              {isSubmitting ? 'Đang xử lý...' : 'Thêm người dùng'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddUserPage;
