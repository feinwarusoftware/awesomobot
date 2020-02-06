import { useRouter } from "next/router";
import Jumbotron from "../../../components/Jumbotron";
import Navbar from "../../../components/Navbar";
import XpBar from "../../../components/XpBar";
import Script from "../../../components/Script";
import "slick-carousel/slick/slick.scss";
import Slider from "react-slick";
import Trophy from "../../../components/Trophy";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";

const userQuery = gql`
  query($userId: ID) {
    user(userId: $userId) {
      _id
      discord_id
      username
      banner
      bio
      socials {
        name
        icon
        url
      }
      modules {
        name
        enabled
        content
        __typename
      }
      colours {
        progress
        level
        name
        rank
      }
      admin
      verified
      developer
      tier
      premium
      xp
      shits
      trophies
      likes
    }
  }
`;

const meQuery = gql`
  query {
    me {
      _id
      discord_id
      username
      banner
      bio
      socials {
        name
        icon
        url
      }
      modules {
        name
        enabled
        content
        __typename
      }
      colours {
        progress
        level
        name
        rank
      }
      admin
      verified
      developer
      tier
      premium
      xp
      shits
      trophies
      likes
    }
  }
`;

const Profile = () => {
  const router = useRouter();
  const { id } = router.query;

  const isMe = id === "@me";

  console.log(id);
  const { loading, error, data } = useQuery(isMe ? meQuery : userQuery, {
    variables: { userId: id }
  });
  if (loading) {
    return <div>loading...</div>;
  }

  if (error) {
    return <div>AHHHHHHHHHHHHHHHHHHHHHH</div>;
  }

  const user = data.user ?? data.me;

  const aboutModule = user.modules?.find(x => x.name === "about");
  const artworkModule = user.modules?.find(x => x.name === "artwork");

  const scriptCarouselSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    autoplaySpeed: 5000,
    slidesToShow: 1,
    slidesToScroll: 1,
    variableWidth: true,
    autoplay: true,
    arrows: false,
    focusOnSelect: true
  };

  return (
    <div className="profile">
      <Navbar transparent />
      <Jumbotron overlap={335} image={user.banner} height={700} />
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-4 col-xl-3">
            <img
              className="w-100"
              src="https://cdn.discordapp.com/channel-icons/576042392789057536/f0c43cb741dade86f6c00c37275dadc8.webp?"
            />
          </div>
          <div className="col-12 col-md-8 col-xl-7">
            <h1 className="white name">{user.username}</h1>
            <XpBar xp={user.xp} />
          </div>
        </div>
        <div className="row justify-content-center mt-5">
          <div className="col-12 col-md-4 col-xl-3">
            <p className="bio">{user.bio}</p>
            {user.trophies?.map((e: string) => (
              <Trophy key={e} name={e} />
            ))}
          </div>
          <div className="col-12 col-md-8 col-xl-7">
            {aboutModule?.enabled && (
              <>
                <h1 className="outline outline-2 pink">About</h1>
                <p className="about mb-60">{aboutModule.content[0]}</p>
              </>
            )}
            {artworkModule?.enabled && (
              <>
                <h1 className="outline outline-2 pink">Artwork showcase</h1>
                <div className="carousel mb-60">
                  <Slider {...scriptCarouselSettings}>
                    {artworkModule.content.map((e, i) => (
                      <div key={i}>
                        <img
                          style={{
                            height: "300px",
                            marginLeft: "15px",
                            marginRight: "15px"
                          }}
                          src={e}
                        />
                      </div>
                    ))}
                  </Slider>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
