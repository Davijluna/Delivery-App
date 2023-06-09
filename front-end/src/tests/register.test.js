import { fireEvent, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import App from '../App';
import renderWithRouter from './helper/renderWithRouter';
import {
  data,
  emailMock,
  nameMock,
  passwordMock,
  userAlreadyExists,
} from './mocks/registerMock';

jest.mock('axios');

describe('Register page', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render the register page', () => {
    const { history } = renderWithRouter(<App />);
    history.push('/register');
    expect(history.location.pathname).toBe('/register');
    const nameInput = screen.getByLabelText(/nome/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/senha/i);
    const registerButton = screen.getByRole('button', { name: /cadastrar/i });
    expect(nameInput).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(registerButton).toBeInTheDocument();
    expect(registerButton).toBeDisabled();
  });

  it('should be possible to interact with the inputs', () => {
    const { history } = renderWithRouter(<App />);
    history.push('/register');
    const nameInput = screen.getByLabelText(/nome/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/senha/i);
    fireEvent.input(nameInput, { target: { value: nameMock } });
    fireEvent.input(emailInput, { target: { value: emailMock } });
    fireEvent.input(passwordInput, { target: { value: passwordMock } });
    expect(nameInput.value).toBe(nameMock);
    expect(emailInput.value).toBe(emailMock);
    expect(passwordInput.value).toBe(passwordMock);
  });

  it('if the login button is enabled after filling in the fields', () => {
    const { history } = renderWithRouter(<App />);
    history.push('/register');
    const nameInput = screen.getByLabelText(/nome/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/senha/i);
    const registerButton = screen.getByRole('button', { name: /cadastrar/i });
    fireEvent.input(nameInput, { target: { value: nameMock } });
    fireEvent.input(emailInput, { target: { value: emailMock } });
    fireEvent.input(passwordInput, { target: { value: passwordMock } });
    expect(registerButton).toBeEnabled();
  });

  it('if after successful registration you should redirect to customer page', () => {
    const spyAxios = jest.spyOn(axios, 'post');
    const res = { data };
    const userLocalStorage = { name: nameMock, email: emailMock, role: 'customer' };
    axios.post.mockResolvedValue(res);
    const { history } = renderWithRouter(<App />);
    history.push('/register');
    const nameInput = screen.getByLabelText(/nome/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/senha/i);
    const registerButton = screen.getByRole('button', { name: /cadastrar/i });
    fireEvent.input(nameInput, { target: { value: nameMock } });
    fireEvent.input(emailInput, { target: { value: emailMock } });
    fireEvent.input(passwordInput, { target: { value: passwordMock } });
    fireEvent.click(registerButton);
    waitFor(() => {
      expect(history.location.pathname).toBe('/customer/products');
      expect(localStorage.getItem('user')).toBe(JSON.stringify(userLocalStorage));
    });
    expect(spyAxios).toHaveBeenCalled();
  });

  it(
    'if there is already a user with the name, the message "Usuário ou email já existe!"',
    () => {
      const res = { response: { data: userAlreadyExists } };
      axios.post.mockRejectedValue(res);
      const { history } = renderWithRouter(<App />);
      history.push('/register');
      const nameInput = screen.getByLabelText(/nome/i);
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/senha/i);
      const registerButton = screen.getByRole('button', { name: /cadastrar/i });
      fireEvent.input(nameInput, { target: { value: nameMock } });
      fireEvent.input(emailInput, { target: { value: emailMock } });
      fireEvent.input(passwordInput, { target: { value: passwordMock } });
      fireEvent.click(registerButton);
      waitFor(() => {
        expect(screen.getByText(/usuário ou email já existe/i)).toBeInTheDocument();
      });
    },
  );
});
