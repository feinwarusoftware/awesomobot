import App from "next/app";
import React from 'react';
import { render } from 'react-dom';
import { ApolloProvider } from '@apollo/react-hooks';
import { withApollo } from "../lib/apollo";
import "../styles.scss";

class MyApp extends App<any> {
  render() {
    const { Component } = this.props;
    return (
      <Component {...this.props} />
    );
  }
}

export default withApollo(MyApp);
