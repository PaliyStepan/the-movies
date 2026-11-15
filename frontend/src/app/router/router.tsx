import {createBrowserRouter} from 'react-router-dom';
import {ERoutes} from '@/shared/config/routes';
import {LoginPage} from '@/pages/login';
import {RootError, RootLayout} from './RootLayout';
import {PublicOnlyRoute} from './PublicOnlyRoute';
import {RegisterPage} from "@/pages/register";
import {MoviesListPage} from "@/pages/movies-list";
import {MovieDetailPage} from "@/pages/movie-detail";
import {ProtectedRoute} from "./ProtectedRoute";
import {MovieCreatePage} from "@/pages/movie-create";
import {MovieEditPage} from "@/pages/move-edit";

export const router = createBrowserRouter([
  {
    element: <RootLayout/>,
    errorElement: <RootError/>,
    children: [
      {
        element: <PublicOnlyRoute />,
        children: [
          { path: ERoutes.LOGIN, element: <LoginPage /> },
          { path: ERoutes.REGISTER, element: <RegisterPage /> },
        ],
      },
      {
        element: <ProtectedRoute />,
        children: [
          { path: ERoutes.MOVIE_CREATE, element: <MovieCreatePage /> },
          { path: ERoutes.MOVIE_EDIT, element: <MovieEditPage /> },
        ],
      },
      { path: ERoutes.HOME, element: <MoviesListPage /> },
      { path: ERoutes.MOVIE_DETAIL, element: <MovieDetailPage /> },
    ],
  },
]);
