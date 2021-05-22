import { useQuery } from "@apollo/client";
import { gql } from "apollo-boost";
import React from "react";
import "./App.css";

function App() {
  const { data, loading } = useQuery(
    gql`
      {
        hello
      }
    `
  );
  if (loading) {
    return <h1>Loading...</h1>;
  }

  return (
    <div className="">
      <h1>hello </h1>
      <h4>{JSON.stringify(data)}</h4>
    </div>
  );
}

export { App };
