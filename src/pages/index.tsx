import { GetStaticProps } from 'next';
import Header from '../components/Header';
import Prismic from '@prismicio/client';
import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import { FiCalendar, FiUser } from 'react-icons/fi'
import Link from 'next/link'
import { getPrismicClient } from '../services/prismic';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}


interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({postsPagination}: HomeProps) {
  return (
    <>
      <Header />

      <main className={commonStyles.container}>
        <Link href="#">
          <a>
            <div className={styles.content}>
              <h1>Como utilizar Hooks</h1>
              <p>Pensando em sincronização em vez de ciclos de vida.</p>
              <div className={styles.info}>
                <time><FiCalendar />15 Mar 2021</time><span><FiUser />Fábio Bellaver</span>
              </div>
            </div>
          </a>
        </Link>
        <Link href="#">
          <a>
            <div className={styles.content}>
              <h1>Como utilizar Hooks</h1>
              <p>Pensando em sincronização em vez de ciclos de vida.</p>
              <div className={styles.info}>
                <time><FiCalendar />15 Mar 2021</time><span><FiUser />Fábio Bellaver</span>
              </div>
            </div>
          </a>
        </Link>

        <button
          type="button"
          className={styles.btn}
        >Carregar mais posts</button>

      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query([
    Prismic.Predicates.at('document.type', 'posts')
  ], {
    pageSize: 1,
  });

  const posts = postsResponse.results.map(post => {
    return {
      uid: post.uid,
      first_publication_date: post.first_publication_date,
      data: {
        title: post.data.title,
        subtitle: post.data.subtitle,
        author: post.data.author,
      }
    }
  })

  const postsPagination = {
    next_page: postsResponse.next_page,
    results: posts,
  }
  
  return {
    props: {
      postsPagination,
    }
  }

};