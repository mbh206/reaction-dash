import { useEffect, useState } from 'react';
import Header from '../components/Header';

interface Entry {
	date: string;
	times: number[];
	penalties: number;
}

export default function History() {
	const [entries, setEntries] = useState<Entry[]>([]);

	useEffect(() => {
		const data: Entry[] = [];
		Object.keys(localStorage).forEach((key) => {
			if (key.startsWith('reactionDash_')) {
				const date = key.replace('reactionDash_', '');
				try {
					const { times, penalties } = JSON.parse(
						localStorage.getItem(key) || '{}'
					);
					data.push({ date, times: times || [], penalties: penalties || 0 });
				} catch {}
			}
		});
		data.sort((a, b) => b.date.localeCompare(a.date));
		setEntries(data);
	}, []);

	return (
		<div className='container'>
			<Header />
			<div className='history'>
				{entries.length === 0 && <div>No history yet.</div>}
				{entries.map((e) => (
					<div
						key={e.date}
						className='history-entry'>
						<h3>{e.date}</h3>
						<div>Times: {e.times.join(', ')} ms</div>
						<div>Penalties: {e.penalties}</div>
					</div>
				))}
			</div>
		</div>
	);
}
