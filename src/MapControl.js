import React from "react";

import "./MapControl.scss";

class MapControl extends React.Component {
  constructor(props) {
    super(props);
    this.setCurrentTimestampIndex = props.setCurrentTimestampIndex;
    this.interval = null;
    this.state = {
      isPlaying: false,
      currentIndex: props.currentIndex,
      timestamps: props.timestamps || []
    };
  }

  componentDidUpdate(newProps, newState) {
    if (newProps.currentIndex !== newState.currentIndex)
      this.setState({ ...this.state, currentIndex: newProps.currentIndex });
    if (newProps.timestamps !== newState.timestamps)
      this.setState({ ...this.state, timestamps: newProps.timestamps });
  }

  handlePlayingClick = e => {
    if (!this.state.isPlaying) {
      this.setState({ ...this.state, isPlaying: true });
      clearInterval(this.interval);
      this.interval = setInterval(() => {
        const nextIndex =
          this.state.currentIndex + 1 < this.state.timestamps.length
            ? this.state.currentIndex + 1
            : 0;
        this.setCurrentTimestampIndex(nextIndex);
      }, 500);
    } else {
      this.setState({ ...this.state, isPlaying: false });
      clearInterval(this.interval);
    }
  };

  render() {
    return (
      <div className="MapControl">
        <div className="fluid-container">
          <div className="column is-1">
            <div className="icon">
              <i
                className={`fas ${
                  this.state.isPlaying ? "fa-pause" : "fa-play"
                }`}
                onClick={this.handlePlayingClick}
              />
            </div>
          </div>
          <div className="column is-10">
            <input
              type="range"
              step={1}
              min={0}
              value={this.state.currentIndex}
              max={this.state.timestamps.length - 1}
              list="timestamps"
              onChange={e => this.setCurrentTimestampIndex(e.target.value)}
            />
            <datalist id="timestamps">
              {this.state.timestamps.map((s, i) => (
                <option key={s} value={i} label={new Date(s).toTimeString()} />
              ))}
            </datalist>
          </div>
          <div className="column is-2">
            <div className="timestamp">
              {new Date(
                this.state.timestamps[this.state.currentIndex] * 1000
              ).toLocaleTimeString()}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default MapControl;
