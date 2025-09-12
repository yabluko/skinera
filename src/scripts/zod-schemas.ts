import { z } from 'zod';

export const RegisterSchema = z
  .object({
    name: z.string().min(1, { message: `Поле Ім'я обов'язкове` }),
    email: z
      .string()
      .min(1, { message: `Поле електронна адреса обов'язкове` })
      .email({ message: `Введіть коректну електронну адресу` }),
    password: z
      .string({ message: `Поле Пароль обов'язкове` })
      .min(1, { message: `Поле з паролем обов'язкове` })
      .min(8, { message: 'Пароль має бути не менше 8 символів' })
      .max(20, { message: 'Пароль має бути не більше 20 символів' }),
  })
  .required();

export const SignInSchema = z
  .object({
    email: z
      .string()
      .min(1, { message: `Поле електронна адреса обов'язкове` })
      .email({ message: `Введіть коректну електронну адресу` }),
    password: z
      .string({ message: `Поле Пароль обов'язкове` })
      .min(8, { message: 'Пароль має бути не менше 8 символів' })
      .max(20, { message: 'Пароль має бути не більше 20 символів' }),
  })
  .required();

export type RegisterFields = z.infer<typeof RegisterSchema>;
export type SignInSchema = z.infer<typeof SignInSchema>;
