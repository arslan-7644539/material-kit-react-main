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
import { supabase } from 'src/supabase/lib';

// ----------------------------------------------------------------------

export function SignInView() {
  const router = useRouter();
  const navigate = useNavigate()

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email:"",
    password:"",
  });

  const handleSignIn = async (e) => {
    e.preventDefault();
    const {error: loginError} = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    });
    if (loginError) {
      console.log(loginError);
      toast.error("Incorrect password.", {
        position: "top-right",
      });
      return;
    }

    let { data: users, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", formData.email);

  if (error) {
    console.log(error);
    return;
  }
  if (users.length > 0) {
    const user = users[0];

    switch (user.role) {
      case null:
      case "":
      case undefined:
        navigate("/");
        break;

      case "user":
        navigate("/");
        break;

      case "admin":
        navigate("/");
        break;

      default:
        console.warn("Unexpected role:", users.role);
        navigate("/"); // Optional: Redirect to a safe default
        break;
    }
    toast.success("Successfully Logged In!", {
      position: "top-right",
    });
  } else {
    console.log("user not found");
    toast.error("credentials invalid", {
      position: "top-right",
    });
  }

    // router.push('/');
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
        name="email"
        label="Email address"
        onChange={changeHandler}
        value={formData.email}
        InputLabelProps={{ shrink: true }}
        sx={{ mb: 3 }}
      />

      <Link variant="body2" color="inherit" sx={{ mb: 1.5 }}>
        Forgot password?
      </Link>

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
        onClick={handleSignIn}
      >
        Sign in
      </LoadingButton>
    </Box>
  );

  return (
    <>
      <Box gap={1.5} display="flex" flexDirection="column" alignItems="center" sx={{ mb: 5 }}>
        <Typography variant="h5">Sign in</Typography>
        <Typography variant="body2" color="text.secondary">
          Don’t have an account?
          <Link variant="subtitle2" sx={{ ml: 0.5 }}>
            Get started
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
