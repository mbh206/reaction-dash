import React from 'react';

interface Props {
	times: number[];
	penalties: number;
	maxTries: number;
	attempts: number;
}

export default function Stats({ times, penalties, maxTries, attempts }: Props) {
	if (attempts === 0) {
		return (
			<div className='stats'>No tries yet today. {maxTries} tries allowed.</div>
		);
	}
	const avg = Math.round(times.reduce((a, b) => a + b, 0) / times.length);
	const best = Math.min(...times);

	return (
		<div className='stats'>
			<div>Times (ms): {times.join(', ')}</div>
			<div>Penalties: {penalties}</div>
			<div>Average: {avg} ms</div>
			<div>Best: {best} ms</div>
			<div>Tries left: {maxTries - attempts}</div>
		</div>
	);
}
