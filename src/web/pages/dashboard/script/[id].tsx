import { useRouter } from "next/router";
import ReactMarkdown from "react-markdown";
import Jumbotron from "../../../components/Jumbotron";
import Navbar from "../../../components/Navbar";
import XpBar from "../../../components/XpBar";
import Script from "../../../components/Script";
import "slick-carousel/slick/slick.scss";
import Slider from "react-slick";
import Trophy from "../../../components/Trophy";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";
import displayMatchType from "../../../utils/displayMatchType";

const scriptQuery = gql`
  query($scriptId: ID) {
    script(scriptId: $scriptId) {
      _id
      name
      description
      help
      author_id
      username
      thumbnail
      match
      match_type
      likes
      guild_count
      use_count
      verified
      user_verified
      created_at
      updated_at
      local
    }
  }
`;

const ScriptPage = () => {
  const router = useRouter();
  const { id } = router.query;

  console.log(id);
  const { loading, error, data } = useQuery(scriptQuery, {
    variables: { scriptId: id }
  });
  if (loading) {
    return <div>loading...</div>;
  }

  if (error) {
    return <div>AHHHHHHHHHHHHHHHHHHHHHH</div>;
  }

  const { script } = data;

  return (
    <div className="profile">
      <Navbar transparent />
      <Jumbotron
        overlap={335}
        image={script.thumbnail}
        height={492}
        blur
      />
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-4 col-xl-3">
            <img className="img-fluid" src={script.thumbnail} />
          </div>
          <div className="col-12 col-md-8 col-xl-7">
            <h1 className="white name">{script.name}</h1>
            <h4 className="white author">
              by {script.username}{" "}
              {script.user_verified && (
                <sup>
                  <i className="fas fa-check-circle" />
                </sup>
              )}
            </h4>
            <p className="description">{script.description}</p>
          </div>
        </div>
        <div className="row justify-content-center mt-5">
          <div className="col-12 col-md-4 col-xl-3">

            <Trophy color="#ff594f" text="Feinwaru Developer">
              <img src={require("../../../static/img/feinwaru_f.svg")} />
            </Trophy>
            <Trophy color="#4844C1" text="Translator">
              <i className="fas fa-language" style={{ color: "#4844C1" }} />
            </Trophy>
          </div>
          <div className="col-12 col-md-8 col-xl-7">
            <h1 className="outline outline-2 pink">USAGE</h1>
            {script.help ? <ReactMarkdown source={script.help.replace(/\[prefix\]/g, "-")} /> : <code>{displayMatchType(script.match, script.match_type)}</code>}
            <h1 className="outline outline-2 pink">Scripts</h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScriptPage;
