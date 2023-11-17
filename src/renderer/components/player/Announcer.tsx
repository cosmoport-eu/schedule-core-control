import Sound from 'react-sound';

type Announcer = {
	audio: { path: string };
	announcements: {
		id: number;
		type: string;
	}[];
	onAnnouncementEnd: () => void;
};

const buildUrl = (path: string, track: string) =>
	`media:///${path}/events/${track}`;

export default function Announcer({
	audio = { path: '' },
	announcements = [],
	onAnnouncementEnd = () => {},
}: Announcer) {
	if (announcements.length === 0) return null;

	return (
		<Sound
			url={buildUrl(audio.path, `${announcements[0].type}.mp3`)}
			playStatus={'PLAYING'}
			playFromPosition={0}
			volume={30}
			onFinishedPlaying={onAnnouncementEnd}
		/>
	);
}
