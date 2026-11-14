import {createBrowserRouter} from 'react-router-dom';
import {ERoutes} from '@/shared/config/routes';
import {LoginPage} from '@/pages/login';
import {RootLayout} from './RootLayout';
import {PublicOnlyRoute} from './PublicOnlyRoute';
import {RegisterPage} from "@/pages/register";

export const router = createBrowserRouter([
  {
    element: <RootLayout/>,
    children: [
      {
        element: <PublicOnlyRoute/>,
        children: [
          {path: ERoutes.LOGIN, element: <LoginPage/>},
          {path: ERoutes.REGISTER, element: <RegisterPage/>},
        ],
      },
      {path: ERoutes.HOME, element: <div>Movies list (TODO)</div>},
      {path: ERoutes.MOVIE_DETAIL, element: <div>Movie detail (TODO)</div>},
    ],
  },
]);
