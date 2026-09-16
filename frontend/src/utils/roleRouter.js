export const getDashboardRoute = (role) => {
  if (role === 'Admin') {
    return '/admin';
  }
  if (role === 'Author') {
    return '/author';
  }
  if (role === 'ReaderAuthor') {
    return '/reader-author';
  }
  // Default for Reader and any other undefined roles
  return '/reader';
};
