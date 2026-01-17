/**
 * Dynamically get the base URL from request headers
 * This works with localhost, LAN IPs, and production domains
 */
export function getBaseUrl(headers?: Headers): string {
  // If NEXTAUTH_URL is explicitly set, use it (for override scenarios)
  if (process.env.NEXTAUTH_URL) {
    return process.env.NEXTAUTH_URL;
  }

  // Server-side: try to get from headers
  if (headers) {
    const host = headers.get('host');
    const protocol = headers.get('x-forwarded-proto') || 
                     headers.get('x-forwarded-protocol') || 
                     (host?.includes('localhost') ? 'http' : 'http');
    
    if (host) {
      return `${protocol}://${host}`;
    }
  }

  // Fallback for server-side when headers aren't available
  if (typeof window === 'undefined') {
    // Check common environment variables
    if (process.env.VERCEL_URL) {
      return `https://${process.env.VERCEL_URL}`;
    }
    
    // Default fallback
    return process.env.NEXTAUTH_URL || 'http://localhost:3000';
  }

  // Client-side: use window.location
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }

  return 'http://localhost:3000';
}

/**
 * Get the current URL for client-side usage
 */
export function getClientBaseUrl(): string {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return '';
}
