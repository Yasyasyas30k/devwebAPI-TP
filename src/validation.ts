import { object, string } from 'yup';

let createPersonSchema = object({
  firstName: string().required().trim(),
  lastName: string().required().trim()
});

let updatePersonSchema = object({
  firstName: string().trim(),
  lastName: string().trim()
});

let createUserSchema = object({
  email: string().required().trim(),
  password: string().required().trim(),
  role: string().required().trim()
});

let updateUserSchema = object({
  email: string().trim(),
  password: string().trim(),
  role: string().trim()
});

export { createPersonSchema, updatePersonSchema, createUserSchema, updateUserSchema };