// Basic email + phone validation helpers

export const isEmail = (value: string) =>
  /^\S+@\S+\.\S+$/.test(value);

export const isPhone = (value: string) =>
  /^[0-9+\- ]{7,15}$/.test(value);

export const isEmpty = (value: string) =>
  !value || value.trim() === "";
