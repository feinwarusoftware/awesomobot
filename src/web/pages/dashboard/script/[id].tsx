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
import { useState } from "react";

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

const numberWithCommas = (x:number) => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

const ScriptPage = () => {
  const router = useRouter();
  const { id } = router.query;

  console.log(id);
  const [addDropdown, setAddDropdown] = useState(false)
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
            <div className="square-div" style={{backgroundImage: `url(${script.thumbnail})`}}></div>
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
            <p className="description white">{script.description}</p>
          </div>
        </div>
        <div className="row justify-content-center mt-3">
          <div className="col-12 col-md-4 col-xl-3">
            <button className="btn-outline thicc green" onClick={() => setAddDropdown(!addDropdown)}>Add this script <i className="fas fa-chevron-down ml-2" /></button>
              <div className="button-dropdown green mb-3" data-expanded={addDropdown}>
                  <ul>
                    <li>Feinwaru Server</li>
                    <li>Feinwaru Server</li>
                    <li>Feinwaru Server</li>
                  </ul>
              </div>
            <button className="btn-outline thicc pink mb-4">Like</button>

              <h1 className="mb-0">{numberWithCommas(script.use_count)}</h1>
              <h5 className="pink mb-4">Uses</h5>
              <h1 className="mb-0">{numberWithCommas(script.likes)}</h1>
              <h5 className="pink mb-4">Uses</h5>
              <h1 className="mb-0">{numberWithCommas(script.guild_count)}</h1>
              <h5 className="pink mb-4">Uses</h5>
          </div>
          <div className="col-12 col-md-8 col-xl-7">
            <h1 className="outline outline-2 pink">USAGE</h1>
            {script.help ? <ReactMarkdown className="mb-60" source={script.help.replace(/\[prefix\]/g, "-")} /> : <code className="mb-60">{displayMatchType(script.match, script.match_type)}</code>}
            <h1 className="outline outline-2 pink">MANAGEMENT</h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScriptPage;
