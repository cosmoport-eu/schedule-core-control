import styles from './GateSchedule.module.css';

const groupByGate = (events, prop) =>
	events.reduce((acc, val) => {
		const day = val[prop];
		acc[day] = acc[day] || [];
		acc[day].push(val);

		return acc;
	}, Object.create(null));

const draw1440 = (lines, minutes) => {
	const rez = [];

	for (let i = 0; i < 1441; i += 1) {
		const set = lines.find(
			(e) => i >= e.startTime && i <= e.startTime + e.durationTime,
		);
		rez.push(
			set ? (
				<span key={i} className={styles.set} />
			) : (
				<span key={i} className={i < minutes ? styles.pass : ''} />
			),
		);
	}

	return rez;
};

export default function GateSchedule({ events = [], minutes = 0 }) {
	const mapping = {
		...groupByGate(events, 'gateId') /* , groupByGate(events, 'gate2Id')*/,
	};
	return (
		<>
			<div>
				A duration of the events across all the gates (the second gates are not
				included).
			</div>
			<div className={styles.container}>
				{Object.keys(mapping).map((key) => (
					<div
						key={key}
						className={styles.container}
						style={{ marginBottom: '1em' }}
					>
						<div>{key}</div>
						<div className={styles.container}>
							{draw1440(mapping[key], minutes)}
						</div>
					</div>
				))}
			</div>
		</>
	);
}
