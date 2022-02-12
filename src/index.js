import React from "react";
import { render } from "react-dom";
import GeolocatedMap from "./GeolocatedMap";
import "./styles.scss";

const App = props => {
  return <GeolocatedMap />;
};

render(<App />, document.getElementById("map-container"));
