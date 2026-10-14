'use client';

import { useState, useEffect, useCallback } from 'react';
import { signIn } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'signin' | 'register';
  onSuccess?: () => void;
}

export default function AuthModal({
  isOpen,
  onClose,
  defaultTab = 'signin',
  onSuccess,
}: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<'signin' | 'register'>(defaultTab);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // Form states
  const [signinData, setSigninData] = useState({
    email: '',
    password: '',
  });

  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  // Validation errors
  const [validationErrors, setValidationErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  // Validation functions
  const validateField = (field: string, value: string) => {
    let error = '';

    switch (field) {
      case 'name':
        if (!value.trim()) {
          error = 'Імʼя обовʼязкове';
        } else if (value.trim().length < 2) {
          error = 'Імʼя має містити мінімум 2 символи';
        }
        break;

      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value) {
          error = 'Email обовʼязковий';
        } else if (!emailRegex.test(value)) {
          error = 'Введіть коректний email';
        }
        break;

      case 'password':
        if (!value) {
          error = 'Пароль обовʼязковий';
        } else if (value.length < 8) {
          error = 'Пароль має містити мінімум 8 символів';
        } else if (value.length > 20) {
          error = 'Пароль має бути не більше 20 символів';
        }
        break;

      case 'confirmPassword':
        if (!value) {
          error = 'Підтвердження пароля обовʼязкове';
        } else if (value !== registerData.password) {
          error = 'Паролі не співпадають';
        }
        break;
    }

    setValidationErrors(prev => ({
      ...prev,
      [field]: error,
    }));

    return error === '';
  };

  const validateAllFields = () => {
    const fields = ['name', 'email', 'password', 'confirmPassword'];
    let isValid = true;

    fields.forEach(field => {
      const value = registerData[field as keyof typeof registerData];
      if (!validateField(field, value)) {
        isValid = false;
      }
    });

    return isValid;
  };

  // Check if there's any data entered in forms
  const hasFormData = useCallback(() => {
    if (activeTab === 'signin') {
      return signinData.email.trim() !== '' || signinData.password.trim() !== '';
    } else {
      return (
        registerData.name.trim() !== '' ||
        registerData.email.trim() !== '' ||
        registerData.password.trim() !== '' ||
        registerData.confirmPassword.trim() !== ''
      );
    }
  }, [activeTab, signinData, registerData]);

  // Handle modal close with confirmation if needed
  const handleClose = useCallback(() => {
    if (hasFormData()) {
      setShowConfirmDialog(true);
    } else {
      onClose();
    }
  }, [hasFormData, onClose]);

  const confirmClose = () => {
    setShowConfirmDialog(false);
    onClose();
  };

  const cancelClose = () => {
    setShowConfirmDialog(false);
  };

  // Handle Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, handleClose]);

  // Reset form data when modal opens
  useEffect(() => {
    if (isOpen) {
      setActiveTab(defaultTab);
      setSigninData({ email: '', password: '' });
      setRegisterData({ name: '', email: '', password: '', confirmPassword: '' });
      setValidationErrors({ name: '', email: '', password: '', confirmPassword: '' });
    }
  }, [isOpen, defaultTab]);

  // Also reset when modal closes to ensure clean state
  useEffect(() => {
    if (!isOpen) {
      setSigninData({ email: '', password: '' });
      setRegisterData({ name: '', email: '', password: '', confirmPassword: '' });
      setValidationErrors({ name: '', email: '', password: '', confirmPassword: '' });
    }
  }, [isOpen]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        email: signinData.email,
        password: signinData.password,
        redirect: false,
      });

      if (result?.error) {
        toast.error('Невірні дані для входу');
      } else {
        toast.success('Успішний вхід!');
        // Даємо час сесії оновитися перед викликом onSuccess
        setTimeout(() => {
          onSuccess?.();
          onClose();
        }, 100);
      }
    } catch {
      toast.error('Помилка входу');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields before submission
    if (!validateAllFields()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: registerData.name,
          email: registerData.email,
          password: registerData.password,
        }),
      });

      if (response.ok) {
        toast.success('Акаунт створено! Входимо...');

        // Автоматично входимо після реєстрації
        const result = await signIn('credentials', {
          email: registerData.email,
          password: registerData.password,
          redirect: false,
        });

        if (result?.error) {
          toast.error('Помилка автоматичного входу');
        } else {
          // Даємо час сесії оновитися перед викликом onSuccess
          setTimeout(() => {
            onSuccess?.();
            onClose();
          }, 100);
        }
      } else {
        const error = await response.json();
        console.error('Registration API error:', error);

        // Show specific error message from API
        if (error.details && Array.isArray(error.details)) {
          // Handle validation errors
          const firstError = error.details[0];
          toast.error(firstError.message || 'Помилка валідації');
        } else {
          toast.error(error.error || error.message || 'Помилка реєстрації');
        }
      }
    } catch (error) {
      console.error('Registration fetch error:', error);
      toast.error('Помилка підключення до сервера');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-xs"
          onClick={e => {
            e.stopPropagation();
            handleClose();
          }}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto"
          onClick={e => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>

          {/* Header */}
          <div className="p-6 pb-0">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {activeTab === 'signin' ? 'Вхід до акаунту' : 'Створення акаунту'}
            </h2>
            <p className="text-gray-600 text-sm">
              {activeTab === 'signin'
                ? 'Увійдіть, щоб зберігати улюблені товари'
                : 'Створіть акаунт для збереження улюблених товарів'}
            </p>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 mx-6 mt-6">
            <button
              onClick={() => {
                if (hasFormData()) {
                  // If switching tabs with data, ask for confirmation
                  if (
                    confirm(
                      'Ви ввели деякі дані. Переключення на іншу вкладку очистить форму. Продовжити?'
                    )
                  ) {
                    setActiveTab('signin');
                    setSigninData({ email: '', password: '' });
                    setRegisterData({ name: '', email: '', password: '', confirmPassword: '' });
                    setValidationErrors({ name: '', email: '', password: '', confirmPassword: '' });
                  }
                } else {
                  setActiveTab('signin');
                  setSigninData({ email: '', password: '' });
                  setRegisterData({ name: '', email: '', password: '', confirmPassword: '' });
                  setValidationErrors({ name: '', email: '', password: '', confirmPassword: '' });
                }
              }}
              className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'signin'
                  ? 'border-brand-500 text-brand-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Вхід
            </button>
            <button
              onClick={() => {
                if (hasFormData()) {
                  // If switching tabs with data, ask for confirmation
                  if (
                    confirm(
                      'Ви ввели деякі дані. Переключення на іншу вкладку очистить форму. Продовжити?'
                    )
                  ) {
                    setActiveTab('register');
                    setSigninData({ email: '', password: '' });
                    setRegisterData({ name: '', email: '', password: '', confirmPassword: '' });
                    setValidationErrors({ name: '', email: '', password: '', confirmPassword: '' });
                  }
                } else {
                  setActiveTab('register');
                  setSigninData({ email: '', password: '' });
                  setRegisterData({ name: '', email: '', password: '', confirmPassword: '' });
                  setValidationErrors({ name: '', email: '', password: '', confirmPassword: '' });
                }
              }}
              className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'register'
                  ? 'border-brand-500 text-brand-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Реєстрація
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {activeTab === 'signin' ? (
              <form key="signin-form" onSubmit={handleSignIn} className="space-y-4 text-justify">
                <div>
                  <label
                    htmlFor="signin-email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email
                  </label>
                  <input
                    id="signin-email"
                    type="email"
                    required
                    value={signinData.email}
                    onChange={e => setSigninData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                    autoComplete="email"
                  />
                </div>

                <div>
                  <label
                    htmlFor="signin-password"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Пароль
                  </label>
                  <input
                    id="signin-password"
                    type="password"
                    required
                    value={signinData.password}
                    onChange={e => setSigninData(prev => ({ ...prev, password: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                    autoComplete="current-password"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-brand-600 text-white py-3 px-4 rounded-lg hover:bg-brand-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Входимо...' : 'Увійти'}
                </button>
              </form>
            ) : (
              <form
                key="register-form"
                onSubmit={handleRegister}
                className="space-y-4 text-justify"
              >
                <div>
                  <label
                    htmlFor="register-name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Імʼя
                  </label>
                  <input
                    id="register-name"
                    type="text"
                    required
                    value={registerData.name}
                    onChange={e => {
                      const value = e.target.value;
                      setRegisterData(prev => ({ ...prev, name: value }));
                      if (validationErrors.name) {
                        validateField('name', value);
                      }
                    }}
                    onBlur={e => validateField('name', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent ${
                      validationErrors.name
                        ? 'border-red-300 focus:ring-red-500'
                        : 'border-gray-300'
                    }`}
                    autoComplete="name"
                  />
                  {validationErrors.name && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.name}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="register-email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email
                  </label>
                  <input
                    id="register-email"
                    type="email"
                    required
                    value={registerData.email}
                    onChange={e => {
                      const value = e.target.value;
                      setRegisterData(prev => ({ ...prev, email: value }));
                      if (validationErrors.email) {
                        validateField('email', value);
                      }
                    }}
                    onBlur={e => validateField('email', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent ${
                      validationErrors.email
                        ? 'border-red-300 focus:ring-red-500'
                        : 'border-gray-300'
                    }`}
                    autoComplete="email"
                  />
                  {validationErrors.email && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.email}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="register-password"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Пароль
                  </label>
                  <input
                    id="register-password"
                    type="password"
                    required
                    value={registerData.password}
                    onChange={e => {
                      const value = e.target.value;
                      setRegisterData(prev => ({ ...prev, password: value }));
                      if (validationErrors.password) {
                        validateField('password', value);
                      }
                      // Also revalidate confirm password if it has content
                      if (registerData.confirmPassword && validationErrors.confirmPassword) {
                        validateField('confirmPassword', registerData.confirmPassword);
                      }
                    }}
                    onBlur={e => validateField('password', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent ${
                      validationErrors.password
                        ? 'border-red-300 focus:ring-red-500'
                        : 'border-gray-300'
                    }`}
                    autoComplete="new-password"
                  />
                  {validationErrors.password && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.password}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="register-confirm-password"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Підтвердження пароля
                  </label>
                  <input
                    id="register-confirm-password"
                    type="password"
                    required
                    value={registerData.confirmPassword}
                    onChange={e => {
                      const value = e.target.value;
                      setRegisterData(prev => ({ ...prev, confirmPassword: value }));
                      if (validationErrors.confirmPassword) {
                        validateField('confirmPassword', value);
                      }
                    }}
                    onBlur={e => validateField('confirmPassword', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent ${
                      validationErrors.confirmPassword
                        ? 'border-red-300 focus:ring-red-500'
                        : 'border-gray-300'
                    }`}
                    autoComplete="new-password"
                  />
                  {validationErrors.confirmPassword && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.confirmPassword}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-brand-600 text-white py-3 px-4 rounded-lg hover:bg-brand-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Створюємо акаунт...' : 'Створити акаунт'}
                </button>
              </form>
            )}
          </div>
        </motion.div>

        {/* Confirmation Dialog */}
        {showConfirmDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-xs z-10 flex items-center justify-center p-4"
            onClick={cancelClose}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm mx-auto"
              onClick={e => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Закрити вікно?</h3>
              <p className="text-gray-600 mb-6 text-sm">
                Ви ввели деякі дані. Якщо закриєте вікно, всі введені дані буде втрачено.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={cancelClose}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Продовжити
                </button>
                <button
                  onClick={confirmClose}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  Закрити
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </AnimatePresence>
  );
}
