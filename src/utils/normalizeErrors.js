// [{ path: '', message: ''}]
/*
{
  email: ['e1', 'e2', ...]
}
*/
export default (errors) => errors.reduce((acc, el) => {
  if (el.path in acc) {
    acc[el.path].push(el.message);
  } else {
    acc[el.path] = [el.message];
  }
  return acc;
}, {});