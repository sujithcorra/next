import { GetServerSideProps } from "next";
import React from "react";
import { createMemoryCache } from "@algolia/client-common";
import { liteClient as algoliasearch } from "algoliasearch/lite";
import singletonRouter from "next/router";
import {
  DynamicWidgets,
  InstantSearch,
  Hits,
  SearchBox,
} from "react-instantsearch";
import { createInstantSearchRouterNext } from "react-instantsearch-router-nextjs";
import { FallbackComponent, Hit } from "./plp";

const responsesCache = createMemoryCache();
const client = algoliasearch("JDZ432CYPW", "16e05bf66555be22a345fa38ab024cb8", {
  responsesCache,
});

export const getServerSideProps: GetServerSideProps =
  async function getServerSideProps({ req, res }) {
    res.setHeader(
      "Cache-Control",
      "public, s-maxage=1800, stale-while-revalidate=3600"
    );

    return {
      props: {},
    };
  };

export default function HomePage() {
  return (
    <InstantSearch
      searchClient={client}
      indexName="magento2_superatv_sandboxdefault_products"
      routing={{
        router: createInstantSearchRouterNext({
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
      <h1>Client side rendering</h1>
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
  );
}
