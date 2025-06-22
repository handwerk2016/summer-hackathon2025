import { config } from './config';

const API_BASE_URL = '/api/v1';

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface RegisterResponse {
  username: string;
  id: number;
}

export interface ApiError {
  detail: string;
}

// Функция для сохранения токена
export const setToken = (token: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('jwt_token', token);
  }
};

// Функция для получения токена
export const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('jwt_token');
  }
  return null;
};

// Функция для удаления токена (при выходе)
export const removeToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('jwt_token');
  }
};

// Базовая функция для API запросов
const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const token = getToken();
  
  const headers = new Headers({
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  });

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  try {
    const response = await fetch(`${config.apiBaseUrl}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('API Error:', {
        status: response.status,
        statusText: response.statusText,
        data
      });
      throw new Error(data.detail || 'Что-то пошло не так');
    }

    return data;
  } catch (error) {
    console.error('Request Error:', error);
    throw error;
  }
};

// Функция для авторизации
export const login = async (username: string, password: string): Promise<AuthResponse> => {
  const formData = new URLSearchParams();
  formData.append('username', username);
  formData.append('password', password);

  const response = await apiRequest<AuthResponse>('/auth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData.toString(),
  });
  
  setToken(response.access_token);
  return response;
};

// Функция для регистрации
export const register = async (username: string, password: string): Promise<RegisterResponse> => {
  return apiRequest<RegisterResponse>('/users/register', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
};

interface LLMRequest {
  prompt: string;
  max_length: number;
  temperature: number;
  top_p: number;
  top_k: number;
}

interface LLMResponse {
  response: string;
}

// Функция для отправки сообщения чатботу
export const sendMessage = async (message: string): Promise<LLMResponse> => {
  const request: LLMRequest = {
    prompt: message,
    max_length: 1024,
    temperature: 0.7,
    top_p: 0.95,
    top_k: 50
  };

  return apiRequest<LLMResponse>('/llm/generate', {
    method: 'POST',
    body: JSON.stringify(request),
  });
}; 