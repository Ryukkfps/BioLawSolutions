'use client';

import { LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';

export default function SignOutButton() {
    const handleSignOut = async () => {
        try {
            // Get the current origin dynamically
            const currentOrigin = typeof window !== 'undefined' ? window.location.origin : '';
            const callbackUrl = `${currentOrigin}/admin/login`;

            // Clear all client-side storage
            localStorage.clear();
            sessionStorage.clear();

            // Clear all cookies by setting them to expire
            document.cookie.split(";").forEach((c) => {
                const eqPos = c.indexOf("=");
                const name = eqPos > -1 ? c.substring(0, eqPos) : c;
                document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
                document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=" + window.location.hostname;
                document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=." + window.location.hostname;
            });

            // Sign out using NextAuth and redirect to admin login with current origin
            await signOut({
                callbackUrl,
                redirect: true
            });
        } catch (error) {
            console.error('Sign out error:', error);
            // Fallback: force redirect to login page with current origin
            const currentOrigin = typeof window !== 'undefined' ? window.location.origin : '';
            window.location.href = `${currentOrigin}/admin/login`;
        }
    };

    return (
        <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium hover:bg-white/10 rounded-lg transition-colors text-left"
        >
            <LogOut className="w-5 h-5" />
            Sign Out
        </button>
    );
}