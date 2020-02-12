import Navbar from "../../components/Navbar";
import Jumbotron from "../../components/Jumbotron";
import FeaturedScript from "../../components/FeaturedScript";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { NetworkStatus } from "apollo-client";
import VoteCTA from "../../components/VoteCTA";
import Script from "../../components/Script";
import Filters from "../../components/Filters";
import Pagination from "../../components/Pagination";
import { useState, useEffect } from "react";
import { parseCookies } from "nookies";
import { NextPage, NextPageContext } from "next";
import fetch from "isomorphic-unfetch";
import SkeletonScript from "../../components/SkeletonScript";

const tempTestVar = 1 + "gay" + `d${1}ck(s)`;

const scriptPageSize = 12;

const featuredScriptQuery = gql`
  query {
    getScripts(featured: true, marketplaceEnabled: true) {
      data {
        _id
        name
        author_id
        authorUsername
        thumbnail
        match
        match_type
        likes
        guild_count
        verified
        authorVerified
      }
      count
    }
  }
`;

const scriptQuery = gql`
  query($take: Int, $skip: Int, $verified: Boolean, $ids: [ID!], $authorIds: [ID!], $name: String, $sortField: ScriptSortField, $sort: SortDirection) {
    getScripts(featured: false, marketplaceEnabled: true, take: $take, skip: $skip, verified: $verified, ids: $ids, authorIds: $authorIds, name: $name, sortField: $sortField, sort: $sort) {
      data {
        _id
        name
        author_id
        authorUsername
        thumbnail
        match
        likes
        guild_count
        verified
        authorVerified
      }
      count
    }
  }
`;

let firstLoad = true;

const queryMultiple = scriptPage => {
  const scripts = useQuery(scriptQuery, {
    variables: {
      take: scriptPageSize,
      skip: scriptPage,
      verified: null,
      ids: null,
      authorIds: null,
      name: null,
      sortField: "USE_COUNT",
      sort: "DESCENDING",
      notifyOnNetworkStatusChange: true,
    },
  });
  const featuredScripts = useQuery(featuredScriptQuery);

  return [scripts, featuredScripts];
};

interface IMarketplaceProps {
  cookies: {
    [key: string]: string,
  },
}

interface IMarketplaceContext extends NextPageContext {

}

const Marketplace: NextPage<any> = (props) => {
  const isAuthenticated = props?.pageProps?.isAuthenticated;

  if (!isAuthenticated) {
    return <div>not authenticated :(</div>;
  }

  const [scriptPage = 0, setScriptPage] = useState(0);

  const [scripts, featuredScripts] = queryMultiple(scriptPage);

  useEffect(() => {
    if (!firstLoad) {
      scripts.refetch();
    }

    firstLoad = false;
  }, [scriptPage]);

  if (scripts.error || featuredScripts.error) {
    return <div>error :(</div>;
  }

  const refetch = scripts.networkStatus === NetworkStatus.setVariables;

  // if ((scripts.loading || featuredScripts.loading) && !refetch) {
  //   return <div>loading...</div>;
  // }

  return (
    <div className="marketplace">
      <Navbar transparent />
      <Jumbotron
        overlap={300}
        image="https://cdn.discordapp.com/attachments/456771924639612940/466128291171008522/banner.png"
      >
        <div className="container">
          <div className="row">
            <div className="col-12">
              <h1>
                <span className="outline outline-3">The</span>
                <br />
                Marketplace
              </h1>
            </div>
          </div>
        </div>
      </Jumbotron>

      <div className="container">
        <div className="row">
          <div className="col-12">
            <h1 className="white">Featured Scripts</h1>
          </div>
        </div>
      </div>

      {/* Featured Scripts */}
      <div className="overflow-scroll-container mb-120">
        <div className="container">
          <div className="row fixed-width">
            {featuredScripts?.data?.scripts.data.map(e => (
              <div className="col-4 mb-4">
                <FeaturedScript
                  key={e._id}
                  id={e._id}
                  name={e.name}
                  author={e.username}
                  authorId={e.author_id}
                  image={e.thumbnail}
                  usage={e.match}
                  matchType={e.match_type}
                  likes={e.likes}
                  servers={e.guild_count}
                  verifiedScript={e.verified}
                  verifiedAuthor={e.user_verified}
                  addFn={() => console.log("add")}
                />
              </div>
            )) ?? [...Array(3)].map((e, i) => (
              <div key={i} className="col-4 mb-4">
                <SkeletonScript />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Voting CTA */}
      <div className="container mb-120">
        <div className="row">
          <div className="col-12">
            <VoteCTA />
          </div>
        </div>
      </div>

      {/* All Scripts */}
      <div className="container mb-120">
        <div className="row mb-60">
          <div className="col-12">
            <Filters />
          </div>
        </div>
        <div className="row">
          {scripts?.data?.scripts.data.map(e => (
            <div key={e._id} className="col-12 col-md-6 col-lg-4 col-xl-3 mb-4">
              <Script
                id={e._id}
                name={e.name}
                author={e.username}
                authorId={e.author_id}
                image={e.thumbnail}
                likes={e.likes}
                servers={e.guild_count}
                verifiedScript={e.verified}
                verifiedAuthor={e.user_verified}
              />
            </div>
          )) ?? [...Array(12)].map((e, i) => (
            <div key={i} className="col-12 col-md-6 col-lg-4 col-xl-3 mb-4">
              <SkeletonScript />
            </div>
          ))}
        </div>
        <div className="row justify-content-center">
          {scripts.data && (
          <Pagination
            totalItems={scripts.data.scripts.count}
            pageSize={scriptPageSize}
            updatePage={setScriptPage}
            currentPage={scriptPage + 1}
          />
          )}
        </div>
      </div>
    </div>
  );
}

Marketplace.getInitialProps = async (ctx: IMarketplaceContext) => {
  const cookies = parseCookies(ctx);

  const { apiToken } = cookies;

  // console.log(res);

  const isAuthenticated = apiToken != null;

  return {
    isAuthenticated,
  };
};

export default Marketplace;
