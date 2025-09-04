// OAuth2 Success Page
// Processes OAuth callback and redirects to debug page

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function AuthSuccessPage() {
  // Get temporary access token from httpOnly cookie
  const cookieStore = await cookies();
  const tempAccessToken = cookieStore.get('tempAccessToken')?.value;

  // Redirect to debug page with token if available
  if (tempAccessToken) {
    redirect(`/debug?token=${encodeURIComponent(tempAccessToken)}`);
  } else {
    redirect('/login?error=no_token');
  }
}
