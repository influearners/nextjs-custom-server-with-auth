import { useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Layout from '../../components/layout';
import Date from '../../components/date';
// import { getAllPostIds, getPostData } from '../../lib/posts';
import { useUser } from '../../context/UserProvider';
import { getPostData } from '../../lib/posts';
import utilStyles from '../../styles/utils.module.css';

export default function Post({ postData }) {
  const [user, setUser] = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.back();
    }
  }, [user, router]);

  return user ? (
    <Layout>
      <Head>
        <title>{postData.title}</title>
      </Head>
      <h1 className={utilStyles.headingXl}>{postData.title}</h1>

      <div className={utilStyles.lightText}>
        <Date dateString={postData.date} />
      </div>
      <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
    </Layout>
  ) : (
    <p>Loading...</p>
  );
}

// export async function getStaticPaths() {
//   const paths = getAllPostIds();
//   return {
//     paths,
//     fallback: false,
//   };
// }

// export async function getStaticProps({ params }) {
//   const postData = await getPostData(params.id);
//   return {
//     props: {
//       postData,
//     },
//   };
// }
export async function getServerSideProps({ params, req }) {
  if (!req.session.user) {
    return {
      redirect: {
        permanent: false,
        destination: '/login',
      },
    };
  }
  const postData = await getPostData(params.id);
  return {
    props: {
      postData,
    },
  };
}
