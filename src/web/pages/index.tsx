import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import Navbar from "../components/Navbar";
import Jumbotron from "../components/Jumbotron";

// const USERS_DATA = gql`
//     query {
//       users {
//         _id
//         discord_id
//       }
//     }
// `;

function IndexPage() {
  // const { loading, error, data } = useQuery(USERS_DATA);

  // if (loading) return <p>Loading...</p>;
  // if (error) return <p>Error :(</p>;
  //   console.log(data)
  return (
    <>
      <Navbar transparent />
      <Jumbotron image="https://cdn.discordapp.com/attachments/606503584372097035/656250053513445434/banner_emma-min.png">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <h1><span className="outline outline-3">The</span><br />Marketplace</h1>
            </div>
          </div>
        </div>
      </Jumbotron>
      <h1>it werk</h1>
    </>
  );
}

export default IndexPage;