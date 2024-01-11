import React from 'react';
import { NavLink } from 'react-router-dom';

import {
	Alignment,
	Tooltip,
	Position,
	Colors,
	Navbar,
} from '@blueprintjs/core';
import { Exchange, Lock, Unlock, Translate } from '@blueprintjs/icons';

import ServerTime from '../time/ServerTime';
import Player from '../player/Player';

type NavBar = {
	auth: boolean;
	audio: {
		path: string;
		files: string[];
	};
	nodes: {
		timetables: number;
		gates: number;
	};
	timestamp: number;
	simulation: {
		active: boolean;
	};
};

type Navigate = {
	to: string;
	icon: React.JSX.Element | string;
};

function Navigate({ to, icon }: Navigate) {
	return (
		<NavLink to={to} className="nav-link">
			{icon}
		</NavLink>
	);
}

export default function NavigationBar({
	auth = false,
	audio = { path: '', files: [] },
	nodes = { timetables: 0, gates: 0 },
	timestamp = 0,
	simulation = { active: false },
}: NavBar) {
	return (
		<Navbar style={{ cursor: 'default', position: 'fixed' }}>
			<Navbar.Group align={Alignment.LEFT}>
				<Navbar.Heading className="app-caption">Cosmoport</Navbar.Heading>
				<>
					<Navigate to="/" icon="Home" />
					<Navigate to="/simulation" icon="Simulation" />
					<Navigate to="/table" icon="Timetable" />
					<Navigate to="/types" icon="Types" />
					{auth && (
						<Navigate
							to="/translation"
							icon={
								<>
									<Translate /> Translation
								</>
							}
						/>
					)}
					{auth && <Navigate to="/settings" icon="Settings" />}
					{!auth && <Navigate to="/login" icon={<Lock />} />}
					{auth && <Navigate to="/logout" icon={<Unlock />} />}
				</>
			</Navbar.Group>
			<Navbar.Group align={Alignment.RIGHT}>
				<Player music={audio} />
				<Navbar.Divider />
				<>{`${nodes.timetables}/${nodes.gates}`}</>
				<Navbar.Divider />
				<Tooltip
					content={`Simulation is ${simulation.active ? 'ON' : 'OFF'}`}
					position={Position.BOTTOM}
				>
					<Exchange
						size={18}
						color={simulation.active ? Colors.GREEN4 : Colors.LIGHT_GRAY1}
					/>
				</Tooltip>
				<Navbar.Divider />
				<Tooltip content="Server time" position={Position.BOTTOM}>
					<ServerTime timestamp={timestamp} />
				</Tooltip>
			</Navbar.Group>
		</Navbar>
	);
}
