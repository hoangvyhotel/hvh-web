import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApiMutation } from '../../hooks/useApi';
import { authRequests } from '../../services/authService';
import { useAuthState, useHotelState } from '../../hooks/useAuth';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import { useForm } from 'react-hook-form';

export default function LoginPage() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();
  const navigate = useNavigate();
  const { setAuth } = useAuthState();
  const { setHotelId } = useHotelState();

  const loginMutation = useApiMutation((dto) => authRequests.login(dto), {
    onSuccess: (res) => {
      if (res?.succeeded) {
        // mark logged in and store hotelId
        setAuth(true);
  try { localStorage.setItem('username', res?.data?.user?.userName || ''); } catch (e) {}
        const hotelId = res?.data?.user?.hotelId;
        if (hotelId) setHotelId(hotelId);
        navigate('/');
      } else {
        // show server message
        alert(res?.message || 'Login failed');
      }
    },
    onError: (err) => {
      const message = err?.message || 'Login failed';
      alert(message);
    }
  });

  const onSubmit = (form) => {
    loginMutation.mutate({ username: form.userName, password: form.password });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box sx={{ width: '100%', maxWidth: 520, mx: 'auto', mt: 4 }}>
        <Stack sx={{ gap: 2 }}>
          <Box>
            <TextField
              id="userName"
              name="username"
              autoComplete="username"
              variant="outlined"
              size="small"
              {...register('userName', { required: 'Username is required' })}
              placeholder="your username"
              fullWidth
              label="Username"
              error={Boolean(errors.userName)}
              sx={{ '& .MuiInputBase-root': { borderRadius: 1 }, '& .MuiInputBase-input': { fontSize: '1rem' } }}
            />
            {errors.userName?.message && <FormHelperText error>{errors.userName.message}</FormHelperText>}
          </Box>

          <Box>
            <FormControl fullWidth error={Boolean(errors.password)} variant="outlined" size="small">
              <InputLabel htmlFor="password">Password</InputLabel>
              <OutlinedInput
                {...register('password', { required: 'Password is required' })}
                id="password"
                name="password"
                autoComplete="current-password"
                type={isPasswordVisible ? 'text' : 'password'}
                label="Password"
                placeholder="Enter your password"
                endAdornment={
                  <InputAdornment
                    position="end"
                    sx={{ cursor: 'pointer' }}
                    onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                  >
                    {isPasswordVisible ? <Visibility /> : <VisibilityOff />}
                  </InputAdornment>
                }
                sx={{ '& .MuiOutlinedInput-input': { padding: '10px 12px', fontSize: '1rem' }, borderRadius: 1 }}
              />
            </FormControl>
            {errors.password?.message && <FormHelperText error>{errors.password.message}</FormHelperText>}
          </Box>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ minWidth: 140, mt: 2, py: 1.5, fontSize: '1rem' }}
            disabled={loginMutation.isLoading}
          >
            {loginMutation.isLoading ? 'Signing in…' : 'Sign In'}
          </Button>
        </Stack>
      </Box>
    </form>
  );
}
