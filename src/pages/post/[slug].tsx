import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import { RichText } from 'prismic-dom';
import { FiCalendar, FiClock, FiUser } from 'react-icons/fi';
import Header from '../../components/Header';
import { getPrismicClient } from '../../services/prismic';
import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';
import Prismic from '@prismicio/client'
import { useRouter } from 'next/router';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps): JSX.Element {

  const totalWords = post.data.content.reduce((total, contentItem) => {
    total += contentItem.heading.split(' ').length

    const words = contentItem.body.map(item => item.text.split(' ').length)
    words.map(word => (total += word))
    return total
  }, 0)
  
  const readTime = Math.ceil(totalWords / 200)

  const router = useRouter();

  if (router.isFallback) {
    return <h1>Carregando...</h1>
  }

  const formatedDate = format(
    new Date(post.first_publication_date),
    "dd MMM yyyy",
    {
      locale: ptBR,
    }
  )

  return (
    <>
      <Header />
      <Head><title>{post.data.title} | spacetraveling</title></Head>
      <main className={styles.postContent}>
        <img
          src={post.data.banner.url}
          alt="Post Image"
          className={styles.banner}
        />
        <section className={commonStyles.container}>
          <h1>{post.data.title}</h1>
          <div className={styles.postInfo}>
            <time><FiCalendar />{formatedDate}</time>
            <span><FiUser />{post.data.author}</span>
            <span><FiClock />{`${readTime} min`}</span>
          </div>
        </section>
        {post.data.content.map(content => {
          return (
            <article
              key={content.heading}
              className={commonStyles.container}>
              <h2>{content.heading}</h2>
              <div
                className={styles.postContent}
                dangerouslySetInnerHTML={{ __html: RichText.asHtml(content.body) }}
              />
            </article>
          )
        })}
      </main>
    </>

  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();
  const posts = await prismic.getByType('blog', { pageSize: 1 })

  const paths = await posts.results.map(post => {
    return {
      params: {
        slug: post.uid,
      }
    }
  })

  return {
    paths,
    fallback: true,
  }
};

export const getStaticProps: GetStaticProps = async context => {
  const prismic = getPrismicClient();
  const { slug } = context.params
  const response = await prismic.getByUID('blog', String(slug), {});

  const post = {
    uid: response.uid,
    first_publication_date: response.first_publication_date,
    data: {
      title: response.data.title,
      subtitle: response.data.subtitle,
      author: response.data.author,
      banner: {
        url: response.data.banner.url
      },
      content: response.data.content.map(content => {
        return {
          heading: content.heading,
          body: [...content.body]
        }
      })
    }
  }

  return {
    props: {
      post,
    }
  }
};
