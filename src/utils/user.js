import decode from 'jwt-decode';

const getUser = () => {
  const token = localStorage.getItem('token');
  const { user } = decode(token);
  return user;
}

export const getUsername = () => {
  try {
    const { username } = getUser();
    return username;
  } catch (e) {}
  return '';
}

export const isOwner = team => {
  try {
    const { id } = getUser();
    return team.owner === id;
  } catch (e) {
    return false;
  }
}