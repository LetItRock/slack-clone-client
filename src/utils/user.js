import decode from 'jwt-decode';

export default () => {
  let username = '';
  try {
    const token = localStorage.getItem('token');
    const { user } = decode(token);
    username = user.username;
  } catch (e) {}
  return username;
}