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

const tempTestVar = 1 + "gay" + `d${1}ck(s)`;

const scriptPageSize = 12;

const featuredScriptQuery = gql`
  query {
    scripts(featured: true, marketplace_enabled: true) {
      list {
        _id
        name
        author_id
        username
        thumbnail
        match
        match_type
        likes
        guild_count
        verified
        user_verified
      }
      total
    }
  }
`;

const scriptQuery = gql`
  query($limit: Int, $page: Int, $verified: Boolean, $with_ids: [ID], $author_id: ID, $name: String, $sortField: String, $sortDirection: Int) {
    scripts(featured: false, marketplace_enabled: true, limit: $limit, page: $page, verified: $verified, with_ids: $with_ids, author_id: $author_id, name: $name, sortField: $sortField, sortDirection: $sortDirection) {
      list {
        _id
        name
        author_id
        username
        thumbnail
        match
        likes
        guild_count
        verified
        user_verified
      }
      total
    }
  }
`;

let firstLoad = true;

const queryMultiple = scriptPage => {
  const scripts = useQuery(scriptQuery, {
    variables: {
      limit: scriptPageSize,
      page: scriptPage,
      verified: null,
      with_ids: null,
      author_id: null,
      name: null,
      sortField: "use_count",
      sortDirection: -1,
      notifyOnNetworkStatusChange: true,
    },
  });
  const featuredScripts = useQuery(featuredScriptQuery);

  return [scripts, featuredScripts];
};

function Marketplace() {
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

  // console.log(refetch, scripts.networkStatus, NetworkStatus.setVariables);

  // console.log(refetch);

  if ((scripts.loading || featuredScripts.loading) && !refetch) {
    return <div>loading...</div>;
  }

  // const {
  //   loading: featuredLoading,
  //   error: featuredError,
  //   data: featuredScriptData,
  //   networkStatus: featuredNetworkStatus
  // } = useQuery(featuredScriptQuery);

  // const {
  //   loading: scriptLoading,
  //   error: scriptError,
  //   data: scriptData,
  //   networkStatus: scriptNetworkStatus
  // } = useQuery(scriptQuery);

  // const loadingMore = featuredNetworkStatus || scriptNetworkStatus === NetworkStatus.fetchMore;

  // if (featuredError || scriptError) {
  //   return <div>error :(</div>;
  // }

  // if (scriptLoading || featuredLoading) {
  //   return <div>loading...</div>;
  // }
  // const { scripts:featuredScripts } = featuredScriptData;
  // const { scripts } = scriptData;

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
            {featuredScripts.data.scripts.list.map(e => (
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
          {scripts.data.scripts.list.map(e => (
            <div className="col-12 col-md-6 col-lg-4 col-xl-3 mb-4">
              <Script
                key={e._id}
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
          ))}
        </div>
        <div className="row justify-content-center">
          <Pagination
            totalItems={scripts.data.scripts.total}
            pageSize={scriptPageSize}
            updatePage={setScriptPage}
            currentPage={scriptPage + 1}
          />
        </div>
      </div>
    </div>
  );
}

export default Marketplace;
