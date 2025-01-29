import type { CardProps } from '@mui/material/Card';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';

import { fDate } from 'src/utils/format-time';
import { fShortenNumber } from 'src/utils/format-number';

import { varAlpha } from 'src/theme/styles';

import { Iconify } from 'src/components/iconify';
import { SvgColor } from 'src/components/svg-color';

import { supabase } from 'src/auth/context/supabase/lib';

import { useEffect, useState } from 'react';

// ----------------------------------------------------------------------

export type PostItemProps = {
  id: string;
  title: string;
  coverUrl: string;
  totalViews: number;
  description: string;
  totalShares: number;
  totalComments: number;
  totalFavorites: number;
  postedAt: string | number | null;
  author: {
    name: string;
    avatarUrl: string;
  };
  created_at?: string; // Assuming this is part of your Blogs table
  image?: string; // Assuming blogs have images
};

export function PostItem({
  sx,
  post,
  latestPost,
  latestPostLarge,
  ...other
}: CardProps & {
  post: PostItemProps;
  latestPost: boolean;
  latestPostLarge: boolean;
}) {
  const [blogs, setBlogs] = useState<PostItemProps[]>([]);

  const fetchBlogData = async () => {
    const { data, error } = await supabase.from<PostItemProps>('Blogs').select();
    if (error) {
      console.error(error);
    } else {
      setBlogs(data || []);
    }
  };

  useEffect(() => {
    fetchBlogData();
  }, []);

  if (!blogs.length) {
    return <Typography>No blogs found</Typography>;
  }

  return (
    <>
      {blogs.map((blog) => (
        <Card sx={sx} key={blog.id} {...other}>
          {/* Cover Image */}
          <Box
            sx={(theme) => ({
              position: 'relative',
              pt: 'calc(100% * 3 / 4)',
              ...((latestPostLarge || latestPost) && {
                pt: 'calc(100% * 4 / 3)',
                '&:after': {
                  top: 0,
                  content: "''",
                  width: '100%',
                  height: '100%',
                  position: 'absolute',
                  bgcolor: varAlpha(theme.palette.grey['900Channel'], 0.72),
                },
              }),
              ...(latestPostLarge && {
                pt: {
                  xs: 'calc(100% * 4 / 3)',
                  sm: 'calc(100% * 3 / 4.66)',
                },
              }),
            })}
          >
            {/* Render SVG Shape */}
            <SvgColor
              width={88}
              height={36}
              src={blog.authorImage}
              sx={{
                left: 0,
                zIndex: 9,
                bottom: -16,
                position: 'absolute',
                color: 'background.paper',
                ...((latestPostLarge || latestPost) && { display: 'none' }),
              }}
            />
            {/* Avatar */}
            <Avatar
              alt={blog.author.name}
              src={blog.authorImage}
              sx={{
                left: 24,
                zIndex: 9,
                bottom: -24,
                position: 'absolute',
                ...((latestPostLarge || latestPost) && {
                  top: 24,
                }),
              }}
            />
            {/* Cover Image */}
            <Box
              component="img"
              alt={blog.title}
              src={blog.image}
              sx={{
                top: 0,
                width: 1,
                height: 1,
                objectFit: 'cover',
                position: 'absolute',
              }}
            />
          </Box>

          {/* Blog Content */}
          <Box
            sx={(theme) => ({
              p: theme.spacing(6, 3, 3, 3),
              ...((latestPostLarge || latestPost) && {
                width: 1,
                bottom: 0,
                position: 'absolute',
              }),
            })}
          >
            {/* Date */}
            <Typography
              variant="caption"
              component="div"
              sx={{
                mb: 1,
                color: 'text.disabled',
                ...((latestPostLarge || latestPost) && {
                  opacity: 0.48,
                  color: 'common.white',
                }),
              }}
            >
              {fDate(blog.created_at)}
            </Typography>

            {/* Title */}
            <Link
              color="inherit"
              variant="subtitle2"
              underline="hover"
              sx={{
                height: 44,
                overflow: 'hidden',
                WebkitLineClamp: 2,
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                ...(latestPostLarge && { typography: 'h5', height: 60 }),
                ...((latestPostLarge || latestPost) && {
                  color: 'common.white',
                }),
              }}
            >
              {blog.title}
            </Link>

            {/* Info Section */}
            <Box
              gap={1.5}
              display="flex"
              flexWrap="wrap"
              justifyContent="flex-end"
              sx={{
                mt: 3,
                color: 'text.disabled',
              }}
            >
              {[
                { number: blog.totalComments, icon: 'solar:chat-round-dots-bold' },
                { number: blog.totalViews, icon: 'solar:eye-bold' },
                { number: blog.totalShares, icon: 'solar:share-bold' },
              ].map((info, index) => (
                <Box
                  key={index}
                  display="flex"
                  sx={{
                    ...((latestPostLarge || latestPost) && {
                      opacity: 0.64,
                      color: 'common.white',
                    }),
                  }}
                >
                  <Iconify width={16} icon={info.icon} sx={{ mr: 0.5 }} />
                  <Typography variant="caption">{fShortenNumber(info.number)}</Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Card>
      ))}
    </>
  );
}
