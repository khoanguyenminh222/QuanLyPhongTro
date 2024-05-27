import "@/styles/globals.css";
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Cookies from 'js-cookie';

export default function App({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token && router.pathname !== '/login') {
      router.push('/login');
    }
  }, [router]);

  return <Component {...pageProps} />;
}