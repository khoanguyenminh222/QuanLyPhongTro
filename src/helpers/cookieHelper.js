import { parseCookies } from 'nookies';

export async function getServerSideProps(context) {
    const cookies = parseCookies(context);
    if (!cookies.token) {
      return {
        redirect: {
          destination: '/login',
          permanent: false,
        },
      };
    }
    const token = cookies.token;
    return {
      props: {
        token: token || null,
      },
    };
  }