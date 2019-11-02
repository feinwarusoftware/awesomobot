import React from "react"
import { useTranslation } from "react-i18next";

export default function Footer() {
  const [t, i18n] = useTranslation();
  return (
    <footer>
      <div className="footer-contents">
        <div className="container">
          <div className="row align-items-center justify-content-center justify-content-sm-start">
            <div className="col-8 col-sm-12 col-md-6 col-lg-3 mt-5 mt-md-0 order-last order-md-0">
              <a href="https://feinwaru.com"><img
                draggable="false"
                className="img-fluid mx-auto px-0 px-sm-5 pl-md-0 px-lg-0 px-xl-4 mb-3"
                alt=""
                src={require("../static/img/feinwaru_logo.svg")}
              /></a>
              <p>
                &copy; 2017 - {new Date().getFullYear()} {t("Copyright")}
              </p>
            </div>
            <div className="col-8 col-sm-6 col-lg-3">
              <h2>{i18n.t("About Feinwaru").split(" ").slice(0, -1).join(" ").toUpperCase()}</h2>
              <h1>{i18n.t("About Feinwaru").split(" ").pop().toUpperCase()}</h1>
              <ul>
                <li>
                  <a href="https://awesomo.feinwaru.com/soontm">{t("Our Team")}</a>
                </li>
                <li>
                  <a href="https://awesomo.feinwaru.com/soontm">{t("Branding")}</a>
                </li>
                <li>
                  <a href="https://discord.feinwaru.com/">Discord</a>
                </li>
                <li>
                  <a href="https://awesomo.feinwaru.com/soontm">{t("Careers")}</a>
                </li>
              </ul>
            </div>
            <div className="col-8 col-sm-6 col-lg-3">
              <h2>{i18n.t("Our Projects").split(" ").slice(0, -1).join(" ").toUpperCase()}</h2>
              <h1>{i18n.t("Our Projects").split(" ").pop().toUpperCase()}</h1>
              <ul>
                <li>
                  <a href="https://awesomo.feinwaru.com/">AWESOM-O</a>
                </li>
                <li>
                  <a href="https://sppd.feinwaru.com/">SPPD</a>
                </li>
                <li>
                  <a href="https://awesomo.feinwaru.com/soontm">Canary</a>
                </li>
                <li>
                  <a href="https://feinwaru.com">{t("more...")}</a>
                </li>
              </ul>
            </div>
            <div className="col-8 col-sm-6 col-lg-3">
              <h2>{i18n.t("Extra Resources").split(" ").slice(0, -1).join(" ").toUpperCase()}</h2>
              <h1>{i18n.t("Extra Resources").split(" ").pop().toUpperCase()}</h1>
              <ul>
                <li>
                  <a href="https://awesomo.feinwaru.com/docs/welcome">{t("Help & Support")}</a>
                </li>
                <li>
                  <a href="https://github.com/feinwarusoftware/sppd">{t("Developers")}</a>
                </li>
                <li>
                  <a href="https://github.com/feinwarusoftware/sppd/issues/new">{t("Feedback")}</a>
                </li>
                <li>
                  <a href="https://awesomo.feinwaru.com/soontm">{t("Terms & Privacy")}</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
