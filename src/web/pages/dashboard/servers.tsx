import Navbar from "../../components/Navbar";
import Jumbotron from "../../components/Jumbotron";
import FeaturedScript from "../../components/FeaturedScript";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { NetworkStatus } from "apollo-client";
import VoteCTA from "../../components/VoteCTA";
import Script from "../../components/Script";
import Filters from "../../components/Filters";

function IndexPage() {
  return (
    <div className="server-manager">
      <Navbar transparent />
      <Jumbotron
        height={800}
        image="https://cdn.discordapp.com/attachments/379432139856412682/672577255549173760/ethernet-cables-plugged-in-network-switch-2881224.jpg"
      >
        <div className="container">
          <div className="row full-height">
            <div className="col-12">
              <h1>
                <span className="outline outline-3">Server</span>
                <br />
                Manager
              </h1>
              <h2>YOU ARE USING 1 OF 3 SERVERS IN YOUR PLAN</h2>
              <button className="btn-outline">Change your plan</button>
            </div>
          </div>
        </div>
      </Jumbotron>

      {/* All Scripts */}
      <div className="container mb-120">
        <div className="row mb-60">
          <div className="col-12">
            <Filters />
          </div>
        </div>
        <div className="row"></div>
      </div>
    </div>
  );
}

export default IndexPage;
