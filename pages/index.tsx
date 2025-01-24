import { createMemoryCache } from "@algolia/client-common";
import { liteClient as algoliasearch } from "algoliasearch/lite";
import { Hit as AlgoliaHit } from "instantsearch.js";
import { GetServerSideProps } from "next";
import Head from "next/head";
import singletonRouter from "next/router";
import React from "react";
import { renderToString } from "react-dom/server";
import {
  DynamicWidgets,
  InstantSearch,
  Hits,
  Highlight,
  RefinementList,
  SearchBox,
  InstantSearchServerState,
  InstantSearchSSRProvider,
  getServerState,
} from "react-instantsearch";
import { createInstantSearchRouterNext } from "react-instantsearch-router-nextjs";

import { Panel } from "../components/Panel";

const responsesCache = createMemoryCache();
const client = algoliasearch("JDZ432CYPW", "16e05bf66555be22a345fa38ab024cb8", {
  responsesCache,
});

type HitProps = {
  hit: AlgoliaHit<{
    name: string;
    price: number;
  }>;
};

function Hit({ hit }: HitProps) {
  // Safely extract the desired field from the price object
  const price = hit.price?.group_0 ?? "N/A";

  return (
    <>
      <Highlight hit={hit} attribute="name" className="Hit-label" />
      <span className="Hit-price">${price}</span>
    </>
  );
}

type HomePageProps = {
  serverState?: InstantSearchServerState;
  url?: string;
};

export default function HomePage({ serverState, url }: HomePageProps) {
  return (
    <InstantSearchSSRProvider {...serverState}>
      <Head>
        <title>React InstantSearch - Next.js</title>
      </Head>

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
        <div className="Container">
          <div>
            <DynamicWidgets fallbackComponent={FallbackComponent} />
          </div>
          <div>
            <SearchBox />
            <Hits hitComponent={Hit} />
          </div>
        </div>
      </InstantSearch>
    </InstantSearchSSRProvider>
  );
}

function FallbackComponent({ attribute }: { attribute: string }) {
  return (
    <Panel header={attribute}>
      <RefinementList attribute={attribute} />
    </Panel>
  );
}

export const getServerSideProps: GetServerSideProps<HomePageProps> =
  async function getServerSideProps({ req }) {
    const protocol = req.headers.referer?.split("://")[0] || "https";
    const url = `${protocol}://${req.headers.host}${req.url}`;
    const serverState = await getServerState(<HomePage url={url} />, {
      renderToString,
    });

    responsesCache.clear();

    return {
      props: {
        serverState,
        url,
      },
    };
  };
