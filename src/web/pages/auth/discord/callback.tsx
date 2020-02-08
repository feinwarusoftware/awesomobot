import Router from "next/router";
import { setCookie, parseCookies } from "nookies";
import { NextPage, NextPageContext } from "next";
import fetch from "isomorphic-unfetch";
import { useEffect } from "react";

interface ICallbackProps {
  error: boolean,
  apiToken?: string,
}

interface ICallbackContext extends NextPageContext { }

// Need to set this to any instead of ICallbackProps, probably a bug with next types
const Callback: NextPage<any> = props => {
  const { error, apiToken } = props.pageProps;

  useEffect(() => {
    if (apiToken != null) {
      setCookie({}, "apiToken", apiToken, {
        // 1 week
        maxAge: 60 * 60 * 24,
        path: "/",
        domain: "localhost"
      });

      const { redirect } = parseCookies({});

      Router.push(redirect || "/");
    }
  });

  if (error) {
    return (
      <div>error fetching api token :(</div>
    );
  }

  return (
    <div>requesting api token...</div>
  );
};

Callback.getInitialProps = async (ctx: ICallbackContext) => {
  const { code: accessToken } = ctx.query;
  if (accessToken == null) {
    return {
      error: true,
      apiToken: null,
    };
  }

  const request = await fetch(`http://localhost/auth/discord/token?accessToken=${accessToken}`, {
      method: "POST",
    });

  if (!request.ok) {
    return {
      error: true,
      apiToken: null,
    };
  }

  const { apiToken } = await request.json();

  return {
    error: false,
    apiToken,
  };
};

export default Callback;
