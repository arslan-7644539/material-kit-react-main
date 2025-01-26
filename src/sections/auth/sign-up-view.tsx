import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { useRouter } from 'src/routes/hooks';
import { Iconify } from 'src/components/iconify';
// import supabase from 'src/lib/supabase';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { supabase } from 'src/auth/context/supabase/lib';
// import { supabase } from 'src/supabase/lib';

// ----------------------------------------------------------------------

export function SignUpView(): JSX.Element {
  const router = useRouter();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
  });

  const handleSignUp = async (e) => {
    e.preventDefault();
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        emailRedirectTo: 'http://localhost:5173/login',
      },
    });
    if (signUpError) {
      console.log(signUpError);
    } else {
      console.log(signUpData);
      const { data: insertData, error: insertError } = await supabase
        .from('users')
        .insert([
          {
            email: formData.email,
            username: formData.fullName,
            password: formData.password,
            uid: signUpData?.user?.id,
          },
        ])
        .select();
      if (insertError) {
        console.log(insertError);
      } else {
        console.log(insertData);
        setFormData({
          fullName: '',
          email: '',
          password: '',
        });
        toast.success('Successfully SignUp!', {
          position: 'top-right',
        });
        navigate('/sign-in');
      }
    }

    // router.push('/welcome');
  };

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const renderForm = (
    <Box display="flex" flexDirection="column" alignItems="flex-end">
      <TextField
        fullWidth
        name="fullName"
        label="Full Name"
        onChange={changeHandler}
        value={formData.fullName}
        InputLabelProps={{ shrink: true }}
        sx={{ mb: 3 }}
      />

      <TextField
        fullWidth
        name="email"
        label="Email Address"
        onChange={changeHandler}
        value={formData.email}
        InputLabelProps={{ shrink: true }}
        sx={{ mb: 3 }}
      />

      <TextField
        fullWidth
        name="password"
        label="Password"
        onChange={changeHandler}
        value={formData.password}
        InputLabelProps={{ shrink: true }}
        type={showPassword ? 'text' : 'password'}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                <Iconify icon={showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{ mb: 3 }}
      />

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        color="inherit"
        variant="contained"
        onClick={handleSignUp}
      >
        Sign up
      </LoadingButton>
    </Box>
  );

  return (
    <>
      <Box gap={1.5} display="flex" flexDirection="column" alignItems="center" sx={{ mb: 5 }}>
        <Typography variant="h5">Sign up</Typography>
        <Typography variant="body2" color="text.secondary">
          Already have an account?
          <Link variant="subtitle2" sx={{ ml: 0.5 }} onClick={() => router.push('/sign-in')}>
            Sign in
          </Link>
        </Typography>
      </Box>

      {renderForm}

      <Divider sx={{ my: 3, '&::before, &::after': { borderTopStyle: 'dashed' } }}>
        <Typography
          variant="overline"
          sx={{ color: 'text.secondary', fontWeight: 'fontWeightMedium' }}
        >
          OR
        </Typography>
      </Divider>

      <Box gap={1} display="flex" justifyContent="center">
        <IconButton color="inherit">
          <Iconify icon="logos:google-icon" />
        </IconButton>
        <IconButton color="inherit">
          <Iconify icon="eva:github-fill" />
        </IconButton>
        <IconButton color="inherit">
          <Iconify icon="ri:twitter-x-fill" />
        </IconButton>
      </Box>
    </>
  );
}
