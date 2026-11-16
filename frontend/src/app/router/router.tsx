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
import {ReviewsListPage} from '@/pages/reviews-list';
import {ReviewDetailPage} from '@/pages/review-detail';
import {ReviewCreatePage} from '@/pages/review-create';
import {ReviewEditPage} from '@/pages/review-edit';
import {LkLayout, LkInfoPage, LkReviewsPage, LkMoviesPage} from '@/pages/lk';

export const router = createBrowserRouter([
  {
    element: <RootLayout/>,
    errorElement: <RootError/>,
    children: [
      {
        element: <PublicOnlyRoute/>,
        children: [
          {path: ERoutes.LOGIN, element: <LoginPage/>},
          {path: ERoutes.REGISTER, element: <RegisterPage/>},
        ],
      },
      {
        element: <ProtectedRoute/>,
        children: [
          {
            path: ERoutes.LK,
            element: <LkLayout />,
            children: [
              { index: true, element: <LkInfoPage /> },
              { path: 'reviews', element: <LkReviewsPage /> },
              { path: 'movies', element: <LkMoviesPage /> },
            ],
          },
          {path: ERoutes.MOVIE_CREATE, element: <MovieCreatePage/>},
          {path: ERoutes.MOVIE_EDIT, element: <MovieEditPage/>},
          {path: ERoutes.REVIEW_CREATE, element: <ReviewCreatePage/>},
          {path: ERoutes.REVIEW_EDIT, element: <ReviewEditPage/>},
        ],
      },
      {path: ERoutes.HOME, element: <MoviesListPage/>},
      {path: ERoutes.REVIEWS_LIST, element: <ReviewsListPage/>},
      {path: ERoutes.REVIEW_DETAIL, element: <ReviewDetailPage/>},
      {path: ERoutes.MOVIE_DETAIL, element: <MovieDetailPage/>},
    ],
  },
]);
