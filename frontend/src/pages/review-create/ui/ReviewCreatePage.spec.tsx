import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  useCreateReview: vi.fn(),
  mutate: vi.fn(),
}));

vi.mock('@/entities/review/model/use-create-review', () => ({
  useCreateReview: mocks.useCreateReview,
}));

vi.mock('react-router-dom', () => ({
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  ),
  useParams: () => ({ movieId: 'movie-1' }),
}));

vi.mock('@mantine/core', () => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;
  const Input = ({
    label,
    error,
    ...props
  }: React.InputHTMLAttributes<HTMLInputElement> & {
    label: string;
    error?: string;
  }) => (
    <label>
      {label}
      <input {...props} />
      {error && <span>{error}</span>}
    </label>
  );
  const Textarea = ({
    label,
    error,
    ...props
  }: React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
    label: string;
    error?: string;
  }) => (
    <label>
      {label}
      <textarea {...props} />
      {error && <span>{error}</span>}
    </label>
  );

  return {
    Alert: ({ children }: { children: React.ReactNode }) => <div role="alert">{children}</div>,
    Anchor: ({
      children,
      component: Component,
      to,
    }: {
      children: React.ReactNode;
      component: React.ElementType;
      to: string;
    }) => <Component to={to}>{children}</Component>,
    Button: ({
      children,
      type,
    }: {
      children: React.ReactNode;
      type: 'submit' | 'button';
    }) => <button type={type}>{children}</button>,
    Stack: Wrapper,
    Text: Wrapper,
    Textarea,
    TextInput: Input,
    Title: ({ children }: { children: React.ReactNode }) => <h1>{children}</h1>,
  };
});

import { ReviewCreatePage } from './ReviewCreatePage';

describe('ReviewCreatePage', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('requires review text and submits optional title with its description', async () => {
    mocks.useCreateReview.mockReturnValue({ mutate: mocks.mutate, isError: false });

    render(<ReviewCreatePage />);
    fireEvent.click(screen.getByRole('button', { name: 'Опубликовать' }));
    expect(await screen.findByText('Введите текст отзыва')).toBeInTheDocument();
    expect(mocks.mutate).not.toHaveBeenCalled();

    fireEvent.change(
      screen.getByPlaceholderText('Короткая фраза, которая цепляет (необязательно)'),
      { target: { value: 'Great story' } },
    );
    fireEvent.change(screen.getByPlaceholderText('Поделитесь впечатлениями о фильме'), {
      target: { value: 'Really enjoyed it.' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Опубликовать' }));

    await waitFor(() => {
      expect(mocks.useCreateReview).toHaveBeenCalledWith('movie-1');
      expect(mocks.mutate).toHaveBeenCalledWith({
        title: 'Great story',
        description: 'Really enjoyed it.',
      });
    });
  });
});
