import { useState, useCallback, useEffect, useMemo } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import Pagination from '@mui/material/Pagination';

// import { _posts } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';

import { PostItem } from '../post-item';
import { PostSort } from '../post-sort';

import { useNavigate } from 'react-router-dom';

import { supabase } from 'src/auth/context/supabase/lib';

import { PostSearch } from '../PostSearch';
import { PostNoData } from '../post-no-data';

// ----------------------------------------------------------------------

export function BlogView() {
  // const [filterBlog, setFilterBlog] = useState([])
  const [search, setSearch] = useState('');
  // ----------------------------------------------

  const [blogs, setBlogs] = useState([]);
  // console.log('🚀 ~ BlogView ~ blogs:', blogs);

  const fetchBlogData = async () => {
    const { data, error } = await supabase.from('Blogs').select();
    if (error) {
      console.error(error);
    } else {
      setBlogs(data || []);
    }
  };

  useEffect(() => {
    fetchBlogData();
  }, []);

  // -------------------------------------------------
  const [sortBy, setSortBy] = useState('latest');

  const handleSort = useCallback((newSort: string) => {
    setSortBy(newSort);
  }, []);

  const navigate = useNavigate();

  const createPost = () => {
    navigate('/AddBlog');
  };

  // const filteredPosts = search
  //   ? blogs.filter((post) => post.title.toLowerCase().includes(search.toLowerCase()))
  //   : blogs;

  // =====================================

  // const isMatch = !filteredPosts || blogs.title.toLowerCase().includes(search.toLowerCase());

  //   if (!isMatch) {
  //     return <PostNoData searchQuery={search} />;

  // const finalPost: any = !filteredPosts ?<PostNoData searchQuery={search} /> : blogs;
  // setFilterBlog(finalPost)

  // const finalPost=useCallback(
  //   () => {
  //    return
  //   },
  //   [search],

  // const finalpost = useMemo(
  //   () =>
  //     search
  //       ? blogs.filter((post) => post.title.toLowerCase().includes(search.toLowerCase()))
  //       : blogs,
  //   [search, blogs]
  // );

  const finalpost = useMemo(() => {
    const filteredPosts = search
      ? blogs.filter((post) => post.title.toLowerCase().includes(search.toLowerCase()))
      : blogs;

    return filteredPosts.length > 0 ? filteredPosts : null;
  }, [search, blogs]);

  // ===========================================

  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          Blog
        </Typography>
        <Button
          onClick={createPost}
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="mingcute:add-line" />}
        >
          New post
        </Button>
      </Box>

      <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mb: 5 }}>
        <PostSearch
          //  posts={blogs}
          searchQuerry={search}
          setSearch={setSearch}
        />

        <PostSort
          sortBy={sortBy}
          onSort={handleSort}
          options={[
            { value: 'latest', label: 'Latest' },
            { value: 'popular', label: 'Popular' },
            { value: 'oldest', label: 'Oldest' },
          ]}
        />
      </Box>

      <Grid container spacing={3}>
        {finalpost ? (
          finalpost.map((post, index) => {
            const latestPostLarge = index === 0;
            const latestPost = index === 1 || index === 2;

            return (
              <Grid
                key={post.id}
                xs={12}
                sm={latestPostLarge ? 12 : 6}
                md={latestPostLarge ? 6 : 3}
              >
                <PostItem
                  // searchQuerry={search}
                  // searchFilter={filteredPosts}
                  post={post}
                  latestPost={latestPost}
                  latestPostLarge={latestPostLarge}
                />
              </Grid>
            );
          })
        ) : (
          <PostNoData searchQuery={search} />
        )}
      </Grid>

      <Pagination count={10} color="primary" sx={{ mt: 8, mx: 'auto' }} />
    </DashboardContent>
  );
}
