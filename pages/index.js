import Head from 'next/head';
import Link from 'next/link';
import Layout, { siteTitle, name } from '../components/layout';
import Date from '../components/date';
import { getSortedPostsData } from '../lib/posts';
import utilStyles from '../styles/utils.module.css';

export default function Home({ allPostsData }) {
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={utilStyles.headingMd}>
        <p className={utilStyles.textCenter}>
          I am {name}, A MERN Stack Developer. I craft beautiful websites using
          ReactJS, NextJS on the Frontend and NodeJS, Express, MongoDB on the
          backend!
        </p>
        <p className={utilStyles.textCenter}>
          You can find me on Twitter at{' '}
          <a
            href="https://twitter.com/mhm13dev"
            target="_blank"
            rel="noopener noreferrer"
          >
            @mhm13dev
          </a>{' '}
        </p>
      </section>

      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>Blog</h2>
        <ul className={utilStyles.list}>
          {allPostsData.map(({ id, date, title }) => (
            <li className={utilStyles.listItem} key={id}>
              <Link href={`/posts/${id}`}>
                <a>{title}</a>
              </Link>
              <br />
              <small className={utilStyles.lightText}>
                <Date dateString={date} />
              </small>
            </li>
          ))}
        </ul>
      </section>
    </Layout>
  );
}

export async function getStaticProps() {
  const allPostsData = getSortedPostsData();
  return {
    props: {
      allPostsData,
    },
  };
}
