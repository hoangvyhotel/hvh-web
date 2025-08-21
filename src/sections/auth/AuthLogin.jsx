import { useState } from 'react';
import { authRequests } from '../../services/authService';
import { tokenStorage } from '../../lib/http/storage';
import { useApiMutation } from '../../hooks/useApi';
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

  const loginMutation = useApiMutation(authRequests.login, {
    onSuccess: (data) => {
      tokenStorage.access = data.accessToken;
      tokenStorage.refresh = data.refreshToken;
      console.log('Login success', data);
    },
    onError: (err) => {
      console.error('Login failed', err);
    }
  });

  const onSubmit = (form) => loginMutation.mutate(form);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack sx={{ gap: 3 }}>
        <Box>
          <TextField
            id="email"
            variant="outlined"
            {...register('email', { required: 'Email is required' })}
            placeholder="example@domain.com"
            fullWidth
            label="Email Address / Username"
            error={Boolean(errors.email)}
          />
          {errors.email?.message && <FormHelperText error>{errors.email.message}</FormHelperText>}
        </Box>

        <Box>
          <FormControl fullWidth error={Boolean(errors.password)}>
            <InputLabel htmlFor="password">Password</InputLabel>
            <OutlinedInput
              {...register('password', { required: 'Password is required' })}
              id="password"
              type={isPasswordVisible ? 'text' : 'password'}
              label="Password"
              placeholder="Enter your password"
              endAdornment={
                <InputAdornment position="end" sx={{ cursor: 'pointer' }} onClick={() => setIsPasswordVisible(!isPasswordVisible)}>
                  {isPasswordVisible ? <Visibility /> : <VisibilityOff />}
                </InputAdornment>
              }
            />
          </FormControl>
          {errors.password?.message && <FormHelperText error>{errors.password.message}</FormHelperText>}
        </Box>
      </Stack>

      <Button type="submit" variant="contained" fullWidth sx={{ minWidth: 120, mt: { xs: 2, sm: 3 } }} disabled={loginMutation.isLoading}>
        {loginMutation.isLoading ? 'Signing in…' : 'Sign In'}
      </Button>
    </form>
  );
}
