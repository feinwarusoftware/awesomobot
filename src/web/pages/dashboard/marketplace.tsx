import Navbar from "../../components/Navbar";
import Jumbotron from "../../components/Jumbotron";
import FeaturedScript from "../../components/FeaturedScript";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { NetworkStatus } from "apollo-client";

const tempTestVar = 1 + "gay" + `d${1}cks`;

const GQL_TEST_QUERY = gql`
  query {
    scripts {
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
  const { loading, error, data, fetchMore, networkStatus } = useQuery(
    GQL_TEST_QUERY
  );

  const loadingMore = networkStatus === NetworkStatus.fetchMore;

  if (error) {
    return <div>error :(</div>;
  }

  if (loading && !loadingMore) {
    return <div>loading...</div>;
  }

  const { scripts } = data;

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
            {scripts.map(e => (
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

      <div>{tempTestVar}</div>
    </div>
  );
}

export default IndexPage;
