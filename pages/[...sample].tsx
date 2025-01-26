import { GetStaticPaths } from "next";
import React from "react";
import { createMemoryCache } from "@algolia/client-common";
import { liteClient as algoliasearch } from "algoliasearch/lite";
import singletonRouter from "next/router";
import {
  DynamicWidgets,
  InstantSearch,
  Hits,
  SearchBox,
  InstantSearchSSRProvider,
  getServerState,
  InstantSearchServerState,
} from "react-instantsearch";
import { createInstantSearchRouterNext } from "react-instantsearch-router-nextjs";
import { FallbackComponent, Hit } from "./plp";
import { renderToString } from "react-dom/server";
import { ParsedUrlQuery } from 'querystring'

const responsesCache = createMemoryCache();
const client = algoliasearch("JDZ432CYPW", "16e05bf66555be22a345fa38ab024cb8", {
  responsesCache,
});

interface Params extends ParsedUrlQuery {
  sample: string | string[]
}

interface IGetServerSideProps {
  params: Params
  locale: string
}

export const getStaticPaths = (async () => {
  return {
    paths: ['/sample'],
    fallback: true, // false or "blocking"
  }
}) satisfies GetStaticPaths

export async function getStaticProps({ params }: IGetServerSideProps ) {
  const serverUrl = `${process?.env?.BASE_URL}${params?.sample?.[0]}`;
  console.log('hhh serverUrl', serverUrl)
  const serverState = await getServerState(<HomePage url={serverUrl} />, { renderToString });

  return {
    props: {
      url: serverUrl,
      serverState
    },
  };
}

type SearchPageProps = {
  url: string
  serverState?: InstantSearchServerState;
};

export default function HomePage({ serverState, url }: SearchPageProps) {
  return (
    <InstantSearchSSRProvider {...serverState}>
      <InstantSearch
        searchClient={client}
        indexName="magento2_superatv_sandboxdefault_products"
        routing={{
          router: createInstantSearchRouterNext({
            serverUrl: url,
            singletonRouter,
            routerOptions: {
              cleanUrlOnDispose: false,
            },
          }),
        }}
        insights={true}
        future={{
          preserveSharedStateOnUnmount: true,
        }}
      >
        <h1>Server Side Rendering with getStaticProps</h1>
        <div className="Container">
          <div>
            <DynamicWidgets fallbackComponent={FallbackComponent} />
          </div>
          <div>
            <SearchBox />
            <div className="products">
              <Hits hitComponent={Hit} />
            </div>
          </div>
        </div>
      </InstantSearch>
    </InstantSearchSSRProvider>
  );
}
