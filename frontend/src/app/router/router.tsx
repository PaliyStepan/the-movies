import {createBrowserRouter} from 'react-router-dom';
import {ERoutes} from '@/shared/config/routes';
import {LoginPage} from '@/pages/login';
import {RootLayout} from './RootLayout';
import {PublicOnlyRoute} from './PublicOnlyRoute';
import {RegisterPage} from "@/pages/register";
import {MoviesListPage} from "@/pages/movies-list";

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
      {path: ERoutes.HOME, element: <MoviesListPage/>},
      {path: ERoutes.MOVIE_DETAIL, element: <div>Movie detail (TODO)</div>},
    ],
  },
]);
