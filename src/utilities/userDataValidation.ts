// validation function 
export default function validate (
  login: string,  
  password: string, 
  password2: string
): string
{
  if (password.length < 6 || password.length > 20) return 'Your password needs a minimum of six characters and maximum 20 characters';
  if (password !== password2) return 'Password do not match !';
  if (login.length < 2) return 'Your login is too short';
  if (login.length > 15) return 'Your login is too long';
  return '';
}