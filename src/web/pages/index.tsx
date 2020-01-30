import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import Navbar from "../components/Navbar";
import Jumbotron from "../components/Jumbotron";
import FeaturedScript from "../components/FeaturedScript";
import { withApollo } from "../lib/apollo";

const USERS_DATA = gql`
    query {
      users {
        discord_id
      }
    }
`;

function IndexPage() {
  const { loading, error, data } = useQuery(USERS_DATA);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
    console.log(data)


  return (
    <div className="marketplace">
      <Navbar transparent />
      <Jumbotron
        image="https://cdn.discordapp.com/attachments/456771924639612940/466128291171008522/banner.png"
      >
        <div className="container">
          <div className="row">
            <div className="col-12">
              <h1>
                  <span className="outline outline-3">Home</span>
                  <br />
                  Screen
              </h1>
            </div>
          </div>
        </div>
      </Jumbotron>

      <div className="container overlap-jumbotron">
        <div className="row">
            <div className="col-12">
              <h1 className="white"><a href="http://localhost/auth/discord">Login</a></h1>
            </div>
        </div>
      </div>
    </div>
  );
}

export default IndexPage;
