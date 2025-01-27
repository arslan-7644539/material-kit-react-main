import { useState } from 'react';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Iconify } from 'src/components/iconify';
import toast from 'react-hot-toast';
import { useAuthContext } from 'src/auth/hooks';
import { supabase } from 'src/auth/context/supabase/lib';
import { PATH_AFTER_LOGIN } from 'src/config-global';
import { useRouter } from 'src/routes/hooks';

// ----------------------------------------------------------------------

export function SignInView() {
  const navigate = useNavigate();
  const { login } = useAuthContext();
  const router = useRouter();
  const [searchParams] = useSearchParams(); // Array destructuring for searchParams
  const returnTo = searchParams.get('returnTo'); // Get query parameter
  


  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false); // Loading state

  // Input Validation Function
  const validateInputs = () => {
    if (!formData.email || !formData.password) {
      toast.error('Please fill out all fields.', { position: 'top-right' });
      return false;
    }
    return true;
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    if (!validateInputs()) return; // Agar validation fail kare to stop

    setLoading(true);
    try {
      // Login function call
      await login(formData.email, formData.password);
      router.push(returnTo || PATH_AFTER_LOGIN);
      console.log('Logged in successfully');

      // Supabase se user data fetch karein
      const { data: users, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', formData.email);

      if (error) {
        console.error('Error fetching user data:', error);
        toast.error('Error fetching user data.', { position: 'top-right' });
        return;
      }

      if (users.length > 0) {
        const user = users[0];

        // Role ke mutabiq navigation karein
        switch (user.role) {
          case 'user':
            navigate('/');
            break;
          case 'admin':
            navigate('/');
            break;
          default:
            console.warn('Unexpected role:', user.role);
            navigate('/'); // Default route
            break;
        }

        toast.success('Successfully Logged In!', { position: 'top-right' });
      } else {
        toast.error('Invalid credentials or user not found.', { position: 'top-right' });
      }
    } catch (error) {
      console.error('Login failed:', error);
      toast.error('Login failed. Please try again.', { position: 'top-right' });
    } finally {
      setLoading(false);
    }
  };

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Render form component
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

      <Link
        variant="body2"
        color="inherit"
        sx={{ mb: 1.5 }}
        onClick={() => navigate('/forgot-password')}
      >
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
              <IconButton
                onClick={() => setShowPassword(!showPassword)}
                edge="end"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
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
        loading={loading}
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
          <Link variant="subtitle2" sx={{ ml: 0.5 }} onClick={() => navigate('/register')}>
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
