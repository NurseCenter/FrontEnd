import { createBrowserRouter } from 'react-router-dom';
import { MainLayout, MypageLayout } from '@/layouts';
import Home from '@/pages/Home';
import SignIn from '@/pages/SignIn';
import Community from '@/pages/Community';
import CreateCommunityPost from '@/pages/CreateCommunityPost';
import Identity from '@/pages/SignUp/Identity';
import Info from '@/pages/SignUp/Info';
import Department from '@/pages/SignUp/Department';
import Error from '@/pages/Error';
import SignUpSuccess from '@/pages/SignUp/Success';
import ID from '@/pages/Find/ID';
import FindIDSuccess from '@/pages/Find/ID/Success';
import Password from '@/pages/Find/Password';
import FindPasswordSuccess from '@/pages/Find/Password/Success';
import MyPage from '@/pages/MyPage';
import Admin from '@/pages/Admin';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/community',
        element: <Community />,
      },
      {
        path: '/community/create-community-post',
        element: <CreateCommunityPost />,
      },
    ],
  },
  {
    path: '/my-page',
    element: <MypageLayout />,
    children: [
      {
        path: '/my-page',
        element: <MyPage />,
      },
    ],
  },
  {
    path: '/sign-in',
    element: <SignIn />,
  },
  {
    path: '/sign-up/identity',
    element: <Identity />,
  },
  {
    path: '/sign-up/info',
    element: <Info />,
  },
  {
    path: '/sign-up/department',
    element: <Department />,
  },
  {
    path: '/sign-up/success',
    element: <SignUpSuccess />,
  },
  {
    path: '/find/id',
    element: <ID />,
  },
  {
    path: '/find/id/success',
    element: <FindIDSuccess />,
  },
  {
    path: '/find/password',
    element: <Password />,
  },
  {
    path: '/find/password/success',
    element: <FindPasswordSuccess />,
  },
  {
    path: '/secure-admin/123456',
    element: <Admin />,
  },
  {
    path: '*',
    element: <Error />,
  },
]);
