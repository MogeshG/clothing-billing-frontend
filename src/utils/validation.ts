export const isValidEmail = (email: string): boolean => {
  const value = email.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value);
};

export const isValidPhone = (phone: string): boolean => {
  const value = phone.trim();

  const phoneRegex = /^(\+?\d{1,3}[- ]?)?\d{10}$/;

  return phoneRegex.test(value);
};

export const isValidGST = (gst: string): boolean => {
  const value = gst.trim().toUpperCase();

  const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

  return gstRegex.test(value);
};

export const isValidPAN = (pan: string): boolean => {
  const value = pan.trim().toUpperCase();

  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

  return panRegex.test(value);
};
