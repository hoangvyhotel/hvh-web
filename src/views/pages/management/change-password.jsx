import { useState } from "react";
import Header from "../../../layouts/HotelManagementLayout/Header";
import { Eye, EyeClosed } from "lucide-react";
import { changeStaffPassword } from "services/authService";
import { toast } from "react-toastify";

const ChangePassword = () => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    match: false,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear lỗi khi user nhập lại
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    // Validate mật khẩu
    if (name === "newPassword") {
      const isValidLength = value.length >= 6;
      setPasswordValidation((prev) => ({
        ...prev,
        length: isValidLength,
        match: value === formData.confirmPassword && value !== "",
      }));

      if (!isValidLength && value.length > 0) {
        setErrors((prev) => ({
          ...prev,
          newPassword: "Mật khẩu phải có ít nhất 6 ký tự.",
        }));
      }
    }

    if (name === "confirmPassword") {
      const isMatch = value === formData.newPassword && value !== "";
      setPasswordValidation((prev) => ({
        ...prev,
        match: isMatch,
      }));

      if (!isMatch && value.length > 0) {
        setErrors((prev) => ({
          ...prev,
          confirmPassword: "Mật khẩu xác nhận không khớp.",
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.currentPassword) {
      newErrors.currentPassword = "Vui lòng nhập mật khẩu hiện tại.";
    }
    if (!formData.newPassword) {
      newErrors.newPassword = "Vui lòng nhập mật khẩu mới.";
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = "Mật khẩu phải có ít nhất 6 ký tự.";
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu mới.";
    } else if (formData.confirmPassword !== formData.newPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const username = localStorage.getItem("username") || "";
    const payload = { ...formData, username };

    try {
      setLoading(true);
      const response = await changeStaffPassword(payload);

      if (response?.status === 200) {
        toast.success("Đổi mật khẩu thành công!");
        setFormData({
          username: "",
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setPasswordValidation({ length: false, match: false });
      }
    } catch (err) {
      toast.error(err?.message || "Đổi mật khẩu thất bại. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="flex items-center justify-center bg-gray-100 px-4 py-6">
        <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-md">
          <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
            Đổi mật khẩu
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Current Password */}
            <PasswordInput
              label="Mật khẩu hiện tại*"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleInputChange}
              error={errors.currentPassword}
              show={showCurrentPassword}
              toggleShow={() => setShowCurrentPassword((p) => !p)}
            />

            {/* New Password */}
            <PasswordInput
              label="Mật khẩu mới*"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleInputChange}
              error={errors.newPassword}
              show={showNewPassword}
              toggleShow={() => setShowNewPassword((p) => !p)}
            />

            {/* Confirm Password */}
            <PasswordInput
              label="Nhập lại mật khẩu mới*"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              error={errors.confirmPassword}
              show={showConfirmPassword}
              toggleShow={() => setShowConfirmPassword((p) => !p)}
            />

            {/* Submit */}
            <button
              type="submit"
              disabled={
                loading ||
                !formData.currentPassword ||
                !passwordValidation.length ||
                !passwordValidation.match
              }
              className={`w-full py-3 px-4 rounded-md font-medium text-white transition-colors ${
                !loading &&
                formData.currentPassword &&
                passwordValidation.length &&
                passwordValidation.match
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              {loading ? "Đang xử lý..." : "Đổi mật khẩu"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ChangePassword;

/* Component Input dùng lại */
const PasswordInput = ({
  label,
  name,
  value,
  onChange,
  error,
  show,
  toggleShow,
}) => (
  <div className="space-y-2">
    <label
      htmlFor={name}
      className="block text-sm font-medium text-gray-700 mb-2"
    >
      {label}
    </label>
    <div className="relative">
      <input
        type={show ? "text" : "password"}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full px-3 py-3 pr-12 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
      <button
        type="button"
        onClick={toggleShow}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        aria-label={show ? "Hide password" : "Show password"}
        tabIndex={-1}
      >
        {show ? <EyeClosed className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
      </button>
    </div>
    {error && <div className="text-sm text-red-600">{error}</div>}
  </div>
);
