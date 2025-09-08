import { useNavigate, useLocation } from 'react-router-dom';
import { useApiMutation } from '../../hooks/useApi';
import { authRequests } from '../../services/authService';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { useForm } from 'react-hook-form';

export default function AdminLogin() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = (location.state && location.state.from) || '/pages/management';
  const params = new URLSearchParams(location.search);
  const expired = params.get('expired') === '1';

  const loginMutation = useApiMutation((dto) => authRequests.loginAdmin(dto), {
    onSuccess: (res) => {
      if (res?.succeeded && res?.data?.user) {
        try {
          localStorage.setItem('is_admin_logged_in', 'true');
          localStorage.setItem('admin_auth_expiry', String(Date.now() + 3 * 60 * 60 * 1000));
          localStorage.setItem('user_role', res.data.user.role || 'admin');
          localStorage.setItem('username', res.data.user.username || '');
          localStorage.setItem('hotel_id', res.data.user.hotelId || '');
        } catch (e) {}
        navigate(redirectTo);
      } else {
        alert(res?.message || 'Xác thực quản lý thất bại');
      }
    },
    onError: (err) => {
      alert(err?.message || 'Xác thực quản lý thất bại');
    }
  });

  const onSubmit = (form) => {
    const username = localStorage.getItem('username') || '';
    loginMutation.mutate({ username, passwordManage: form.passwordManage });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box sx={{ width: '100%', maxWidth: 520, mx: 'auto', mt: 8 }}>
        <Stack sx={{ gap: 2 }}>
            {expired && (
              <Alert severity="warning">Phiên quản lý đã hết hạn — vui lòng đăng nhập lại bằng mật khẩu quản trị.</Alert>
            )}
          <FormControl fullWidth error={Boolean(errors.passwordManage)} variant="outlined" size="small">
            <InputLabel htmlFor="passwordManage">Mật khẩu quản lý</InputLabel>
            <OutlinedInput
              {...register('passwordManage', { required: 'Mật khẩu quản lý là bắt buộc' })}
              id="passwordManage"
              type="password"
              label="Mật khẩu quản lý"
              placeholder="Nhập mật khẩu quản lý"
            />
          </FormControl>
          {errors.passwordManage?.message && <FormHelperText error>{errors.passwordManage.message}</FormHelperText>}

          <Button type="submit" variant="contained" fullWidth disabled={loginMutation.isLoading}>
            {loginMutation.isLoading ? 'Đang xác thực…' : 'Xác thực quản lý'}
          </Button>
        </Stack>
      </Box>
    </form>
  );
}
