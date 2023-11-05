import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Sound from 'react-sound';

const buildUrl = (path, track) => `media:///${path}/events/${track}`;

export default class Announcer extends Component {
  static propTypes = {
    audio: PropTypes.shape({
      path: PropTypes.string,
    }),
    announcements: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
        type: PropTypes.string,
      }),
    ),
    onAnnouncementEnd: PropTypes.func,
  };

  static defaultProps = {
    audio: { path: '' },
    announcements: [],
    onAnnouncementEnd: () => {},
  };

  state = {
    active: false,
    playStatus: Sound.status.PLAYING,
  };

  handleTrackFinish = () => {
    this.props.onAnnouncementEnd();
  };

  render() {
    const { audio, announcements } = this.props;
    const { playStatus } = this.state;
    const hasAnnouncements = announcements.length > 0;

    if (!hasAnnouncements) {
      return null;
    }

    return (
      <Sound
        url={buildUrl(audio.path, `${announcements[0].type}.mp3`)}
        playStatus={playStatus}
        playFromPosition={0}
        volume={30}
        onFinishedPlaying={this.handleTrackFinish}
      />
    );
  }
}
