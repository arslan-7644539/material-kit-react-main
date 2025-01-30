import React from 'react';

import { Toolbar, TextField, InputAdornment } from '@mui/material';
import { Iconify } from 'src/components/iconify';

export const PostSearch = ({ searchQuerry, setSearch }): any => {
  console.log('🚀 ~ PostSearch ~ searchQuerry:', searchQuerry);

  return (
    <Toolbar sx={{ justifyContent: 'center', gap: 2 }}>
      <TextField
        variant="outlined"
        placeholder="Search Post..."
        value={searchQuerry}
        onChange={(e) => setSearch(e.target.value)}
        size="small"
        sx={{
          width: { xs: '100%', sm: 300 }, // Responsive width
          bgcolor: 'background.paper', // Background color match kare
          borderRadius: 2, // Rounded corners
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify width={20} icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
            </InputAdornment>
          ),
        }}
      />
    </Toolbar>
  );
};
