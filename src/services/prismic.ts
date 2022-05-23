import * as prismic from '@prismicio/client'

export function getPrismicClient(req?: unknown) {
  const endpoint = prismic.getEndpoint('criando-projeto-do-zero-rs')
  const client = prismic.createClient(
    endpoint,
    { accessToken: process.env.PRISMIC_ACESS_TOKEN }
  )
  client.enableAutoPreviewsFromReq(req);
  return client
}