import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";

const USERS_DATA = gql`
    query {
      users {
        _id
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
    <h1>it werk</h1>
  );
}

export default IndexPage;