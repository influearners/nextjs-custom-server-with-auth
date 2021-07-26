import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useUser } from '../context/UserProvider';
import styles from './layout.module.css';
import utilStyles from '../styles/utils.module.css';

export const name = 'Mubashir Hassan';
export const siteTitle = 'Next.js Sample Website';

export default function Layout({ children, home }) {
  const [user, setUser] = useUser();

  async function logout() {
    try {
      const res = await fetch('/api/logout', { method: 'POST' });
      const resJson = await res.json();

      if (resJson.status === 'success') {
        setUser(null);
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content="Learn how to build a personal website using Next.js"
        />
        <meta
          property="og:image"
          content={`https://og-image.vercel.app/${encodeURI(
            siteTitle
          )}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`}
        />
        <meta name="og:title" content={siteTitle} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <header className={styles.header}>
        {home ? (
          <>
            <Image
              priority
              src="/images/profile.png"
              className={utilStyles.borderCircle}
              height={144}
              width={144}
              alt={name}
            />
            <h1 className={utilStyles.heading2Xl}>{name}</h1>
          </>
        ) : (
          <>
            <Link href="/">
              <a>
                <Image
                  priority
                  src="/images/profile.png"
                  className={utilStyles.borderCircle}
                  height={108}
                  width={108}
                  alt={name}
                />
              </a>
            </Link>
            <h2 className={utilStyles.headingLg}>
              <Link href="/">
                <a className={utilStyles.colorInherit}>{name}</a>
              </Link>
            </h2>
          </>
        )}
        {!user ? (
          <section>
            <Link href="/login">
              <a>Login</a>
            </Link>{' '}
            <Link href="/signup">
              <a>Signup</a>
            </Link>
          </section>
        ) : (
          <section>
            <button onClick={logout}>Logout</button>
          </section>
        )}
      </header>
      <main>{children}</main>
      {!home && (
        <div className={styles.backToHome}>
          <Link href="/">
            <a>← Back to home</a>
          </Link>
        </div>
      )}
    </div>
  );
}
