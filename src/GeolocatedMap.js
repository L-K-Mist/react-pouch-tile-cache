import React from "react";
import { Map as Leaflet, TileLayer } from "react-leaflet";
import { geolocated } from "react-geolocated";
import axios from "axios";
import MapControl from "./MapControl";

const position = [32.3792, -86.3077];

class Map extends React.Component {
  constructor(props) {
    super(props);
    this.interval = null;
    this.state = {
      timestamps: [],
      isLoaded: false
    };
  }

  componentDidMount() {
    this.getTimestamps();
  }

  getTimestamps = async () => {
    try {
      const { data } = await axios.get(
        "https://api.rainviewer.com/public/maps.json"
      );
      this.setState({
        ...this.state,
        timestamps: data,
        currentTimestampIndex: data.length - 1,
        isLoaded: true
      });
    } catch (err) {
      console.error(err);
    }
  };

  setCurrentTimestampIndex = index =>
    this.setState({ ...this.state, currentTimestampIndex: index });

  render() {
    return (
      <div className="GeolocatedMap">
        <Leaflet center={position} zoom={5}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />
          <TileLayer
            useCache={true}
            useOnlyCache={true}
            url={`https://tilecache.rainviewer.com/v2/radar/${
              this.state.timestamps[this.state.currentTimestampIndex]
            }/512/{z}/{x}/{y}/2/1_0.png`}
          />
        </Leaflet>
        <MapControl
          timestamps={this.state.timestamps}
          currentIndex={this.state.currentTimestampIndex}
          setCurrentTimestampIndex={this.setCurrentTimestampIndex.bind(this)}
        />
      </div>
    );
  }
}

const GeolocatedMap = geolocated({
  positionOptions: {
    enableHighAccuracy: false
  },
  userDecisionTimeout: 5000
})(Map);

export default GeolocatedMap;
