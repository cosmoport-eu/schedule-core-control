import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Sound from 'react-sound';

import PlayerControls from './PlayerControls';

import styles from './Player.module.css';

const shrink = (text, length) => {
  if (text.length <= length) {
    return text;
  }

  const separator = '...';
  const charsToShow = length - separator.length;

  return (
    text.substr(0, Math.ceil(charsToShow / 2)) +
    separator +
    text.substr(text.length - Math.floor(charsToShow / 2))
  );
};

export default class Player extends PureComponent {
  static propTypes = {
    music: PropTypes.shape({
      path: PropTypes.string,
      files: PropTypes.arrayOf(PropTypes.string),
    }),
  };

  static defaultProps = {
    music: { path: '', files: [] },
  };

  constructor(props) {
    super(props);

    this.state = {
      track: '',
      path: props.music.path,
      position: 0,
      volume: 20,
      period: 1,
      // Played / Stopped
      playStatus: Sound.status.STOPPED,
      isWaiting: false,
    };

    this.candidates = [];
  }

  componentDidMount() {
    this.candidates = this.props.music.files.slice(0);
    this.randomTrack();
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  getStatus = () => {
    const { isWaiting, period, playStatus } = this.state;

    if (isWaiting) {
      return `waiting (${period} m)`;
    }

    switch (playStatus) {
      case Sound.status.PLAYING:
        return 'playing';
      case Sound.status.PAUSED:
        return 'paused';
      case Sound.status.STOPPED:
        return 'stopped';
      default:
        return '(unknown)';
    }
  };

  randomTrack = () => {
    // reload tracks
    if (this.candidates.length === 0) {
      this.candidates = this.props.music.files.slice(0);
    }

    const name = this.candidates.splice(
      Math.floor(Math.random() * this.candidates.length),
      1,
    );

    this.setState({ track: name.length > 0 ? name[0] : '', position: 0 });
  };

  handlePeriodChange = (value) => {
    if (this.state.period !== value) {
      this.setState({ period: value });
    }
  };

  handleTrackFinish = () => {
    if (this.state === Sound.status.STOPPED) {
      return;
    }

    // wait some time
    this.setState({ playStatus: Sound.status.STOPPED, isWaiting: true }, () => {
      this.randomTrack();
      this.timeout = setTimeout(
        () => {
          this.setState({ playStatus: Sound.status.PLAYING, isWaiting: false });
        },
        this.state.period * 1000 * 60,
      );
    });
  };

  handlePlay = () => {
    this.setState({ playStatus: Sound.status.PLAYING, isWaiting: false });
  };

  handleStop = () => {
    clearTimeout(this.timeout);
    this.setState({
      playStatus: Sound.status.STOPPED,
      position: 0,
      isWaiting: false,
    });
  };

  handlePause = () => {
    clearTimeout(this.timeout);
    this.setState({ playStatus: Sound.status.PAUSED, isWaiting: false });
  };

  buildUrl = (path, track) => `media:///${path}/${track}`;

  render() {
    const { volume, playStatus, path, position, track, period } = this.state;
    const { music } = this.props;
    const hasTrack = track !== '' && music.files.length > 0;
    const trackInfo = `Track ${shrink(
      track.replace('.mp3', ''),
      21,
    )} is ${this.getStatus()}`;

    return (
      <div className={`${styles.centred} ${styles.overlay}`}>
        <PlayerControls
          isPlaying={playStatus === Sound.status.PLAYING}
          onNext={this.randomTrack}
          onPlay={this.handlePlay}
          onPause={this.handlePause}
          onStop={this.handleStop}
          onVolumeUp={() =>
            this.setState({ volume: volume >= 100 ? volume : volume + 10 })
          }
          onVolumeDown={() =>
            this.setState({ volume: volume <= 0 ? volume : volume - 10 })
          }
          duration={0}
          position={position}
          period={period}
          onPeriodChange={this.handlePeriodChange}
        />
        {hasTrack && (
          <Sound
            url={this.buildUrl(path, track)}
            playStatus={playStatus}
            playFromPosition={position}
            volume={volume}
            onFinishedPlaying={this.handleTrackFinish}
          />
        )}
        {hasTrack && (
          <div title={track} className={`${styles.centred} ${styles.player}`}>
            {trackInfo}
          </div>
        )}
      </div>
    );
  }
}
