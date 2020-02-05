import { useRouter } from "next/router";
import Jumbotron from "../../../components/Jumbotron";
import Navbar from "../../../components/Navbar";
import XpBar from "../../../components/XpBar";
import Script from "../../../components/Script";
import "slick-carousel/slick/slick.scss";
import Slider from "react-slick";
import Trophy from "../../../components/Trophy";

const Profile = () => {
  const router = useRouter();
  const { id } = router.query;

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
      <Jumbotron
        overlap={335}
        image="https://i.redd.it/axsnzqlpztv01.jpg"
        height={700}
      />
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-4 col-xl-3">
            <img
              className="img-fluid"
              src="https://cdn.discordapp.com/avatars/179320046563098624/bbb4040fd660d1de025abb0c46694180.png?size=512"
            />
          </div>
          <div className="col-12 col-md-8 col-xl-7">
            <h1 className="white name">Mattheous#5750</h1>
            <XpBar xp={18354} />
          </div>
        </div>
        <div className="row justify-content-center mt-5">
          <div className="col-12 col-md-4 col-xl-3">
            <p className="bio">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam
              sit amet diam vitae metus semper convallis.
            </p>
            <Trophy color="#ff594f" text="Feinwaru Developer">
              <img src={require("../../../static/img/feinwaru_f.svg")} />
            </Trophy>
            <Trophy color="#4844C1" text="Translator">
              <i className="fas fa-language" style={{ color: "#4844C1" }} />
            </Trophy>
          </div>
          <div className="col-12 col-md-8 col-xl-7">
            <h1 className="outline outline-2 pink">About</h1>
            <p className="about">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam
              sit amet diam vitae metus semper convallis. Sed ac condimentum mi.
              Sed risus erat, mollis vel leo nec, gravida imperdiet mauris.
              Curabitur tincidunt arcu non tortor rhoncus, eget ullamcorper nisi
              laoreet. Vestibulum sit amet nulla lectus. Suspendisse vitae
              dapibus ante. Class aptent taciti sociosqu ad litora torquent per
              conubia nostra, per inceptos himenaeos. Nunc nec diam eros. Sed
              ultricies nisl arcu, vitae blandit massa venenatis ac. Nullam
              tempus enim vel imperdiet scelerisque. Cras consequat rutrum eros
              at ornare. Quisque malesuada est eu consectetur ornare. Mauris
              dignissim tortor quis ultrices accumsan. In porta nulla vel
              euismod semper. Vestibulum eget nibh lectus. Suspendisse pharetra
              augue id dolor vulputate elementum.
            </p>
            <h1 className="outline outline-2 pink">Scripts</h1>

            <Slider {...scriptCarouselSettings}>
              <div style={{ width: "300px" }}>
                <Script
                  id={1}
                  name="Alex Jones Quotes"
                  author={null}
                  image=""
                  likes={1}
                  servers={1}
                  verifiedScript={true}
                  verifiedAuthor={true}
                />
              </div>
            </Slider>

            <h1 className="outline outline-2 pink">Artwork showcase</h1>
            <div className="carousel">
              <Slider {...scriptCarouselSettings}>
                <div>
                  <img
                    style={{
                      height: "300px",
                      marginLeft: "15px",
                      marginRight: "15px"
                    }}
                    src="https://cdn.discordapp.com/avatars/179320046563098624/bbb4040fd660d1de025abb0c46694180.png?size=512"
                  />
                </div>
                <div>
                  <img
                    style={{
                      height: "300px",
                      marginLeft: "15px",
                      marginRight: "15px"
                    }}
                    src="https://i.ytimg.com/vi/PEGAYqr9M_c/maxresdefault.jpg"
                  />
                </div>
                <div>
                  <img
                    style={{
                      height: "300px",
                      marginLeft: "15px",
                      marginRight: "15px"
                    }}
                    src="https://i.ytimg.com/vi/rN33y1dari0/maxresdefault.jpg"
                  />
                </div>
                <div>
                  <img
                    style={{
                      height: "300px",
                      marginLeft: "15px",
                      marginRight: "15px"
                    }}
                    src="https://cnet1.cbsistatic.com/img/CnG9gKluvb3O-JJgJbR2PNPFOI4=/1200x675/2018/03/01/4e62f1c4-7c3d-4bd1-9445-678dcdcd1b39/frontfacingbart.jpg"
                  />
                </div>
              </Slider>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
