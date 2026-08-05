import 'server-only';

// TODO: Replace with actual auth integration (e.g. better-auth or next-auth)
export async function getSession() {
  return {
    user: {
      id: 'default_user',
      name: 'Default User',
      email: 'default@example.com'
    }
  };
}

export async function getCurrentUserId() {
  const session = await getSession();
  return session.user.id;
}
