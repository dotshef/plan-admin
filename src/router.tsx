import { createBrowserRouter, Navigate } from 'react-router-dom';
import { App } from '@/App';
import { PostsListPage } from '@/pages/posts-list';
import { PostCreatePage } from '@/pages/post-create';
import { PostEditPage } from '@/pages/post-edit';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Navigate to="/posts" replace /> },
      { path: 'posts', element: <PostsListPage /> },
      { path: 'posts/new', element: <PostCreatePage /> },
      { path: 'posts/:id/edit', element: <PostEditPage /> },
      { path: '*', element: <Navigate to="/posts" replace /> },
    ],
  },
]);
