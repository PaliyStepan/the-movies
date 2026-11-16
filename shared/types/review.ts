import {IUserPublic} from "./user";
import {IPaginated} from "./movie";

export interface IReview {
  id: string;
  title: string | null;
  description: string;
  userId: string;
  movieId: string;
  user: IUserPublic;
  createdAt: string;
  updatedAt: string;
}

export interface ICreateReviewPayload {
  title?: string;
  description: string;
}

export interface IUpdateReviewPayload {
  title?: string;
  description?: string;
}

export type IPaginatedReviews = IPaginated<IReview>;
