import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  useLogin: vi.fn(),
  mutate: vi.fn(),
}));

vi.mock('@/features/auth/model/use-auth', () => ({
  useLogin: mocks.useLogin,
}));

vi.mock('react-router-dom', () => ({
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  ),
}));

vi.mock('@mantine/core', () => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;
  const Field = ({
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
    PasswordInput: Field,
    Stack: Wrapper,
    Text: Wrapper,
    TextInput: Field,
    Title: ({ children }: { children: React.ReactNode }) => <h1>{children}</h1>,
  };
});

import { LoginPage } from './LoginPage';

describe('LoginPage', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('validates email and password before submitting', async () => {
    mocks.useLogin.mockReturnValue({ mutate: mocks.mutate, isError: false });

    render(<LoginPage />);
    fireEvent.click(screen.getByRole('button', { name: 'Войти' }));

    expect(await screen.findByText('Введите корректный email')).toBeInTheDocument();
    expect(
      screen.getByText('Пароль должен быть не менее 6 символов'),
    ).toBeInTheDocument();
    expect(mocks.mutate).not.toHaveBeenCalled();
  });

  it('submits valid credentials', async () => {
    mocks.useLogin.mockReturnValue({ mutate: mocks.mutate, isError: false });

    render(<LoginPage />);
    fireEvent.change(screen.getByPlaceholderText('example@example.ru'), {
      target: { value: 'user@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('••••••'), {
      target: { value: 'secret1' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Войти' }));

    await waitFor(() => {
      expect(mocks.mutate).toHaveBeenCalledWith({
        email: 'user@example.com',
        password: 'secret1',
      });
    });
  });
});
