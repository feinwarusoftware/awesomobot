import Navbar from "../../components/Navbar";
import Jumbotron from "../../components/Jumbotron";
import FeaturedScript from "../../components/FeaturedScript";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { NetworkStatus } from "apollo-client";
import VoteCTA from "../../components/VoteCTA";
import Script from "../../components/Script";
import Filters from "../../components/Filters";

const tempTestVar = 1 + "gay" + `d${1}cks`;

const featuredScriptQuery = gql`
  query {
    scripts(featured: true) {
      _id
      name
      author_id
      thumbnail
      match
      likes
      guild_count
      verified
    }
  }
`;

const scriptQuery = gql`
  query {
    scripts(featured:false) {
      _id
      name
      author_id
      thumbnail
      match
      likes
      guild_count
      verified
    }
  }
`;

function IndexPage() {
  const {
    loading: featuredLoading,
    error: featuredError,
    data: featuredScriptData,
    networkStatus: featuredNetworkStatus
  } = useQuery(featuredScriptQuery);

  const {
    loading: scriptLoading,
    error: scriptError,
    data: scriptData,
    networkStatus: scriptNetworkStatus
  } = useQuery(scriptQuery);

  const loadingMore = featuredNetworkStatus || scriptNetworkStatus === NetworkStatus.fetchMore;

  if (featuredError || scriptError) {
    return <div>error :(</div>;
  }

  if (scriptLoading || featuredLoading) {
    return <div>loading...</div>;
  }
  const { scripts:featuredScripts } = featuredScriptData;
  const { scripts } = scriptData;

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
            {featuredScripts.map(e => (
              <div className="col-4">
                <FeaturedScript
                  id={e._id}
                  name={e.name}
                  author="Mattheous"
                  image={e.thumbnail}
                  usage={e.match}
                  likes={e.likes}
                  servers={e.guild_count}
                  verifiedScript={e.verified}
                  verifiedAuthor={true}
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
          {scripts.map(e => (
            <div className="col-sm-6 col-lg-4 col-xl-3">
              <Script
                id={e._id}
                name={e.name}
                author="Mattheous"
                image={e.thumbnail}
                likes={e.likes}
                servers={e.guild_count}
                verifiedScript={e.verified}
                verifiedAuthor={true}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default IndexPage;
