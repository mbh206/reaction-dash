import { useState, useEffect, useRef } from 'react';
import Stats from './Stats';

export default function ReactionDash() {
	const today = new Date().toISOString().slice(0, 10);
	const storageKey = `reactionDash_${today}`;
	const maxTries = 6;

	const [times, setTimes] = useState<number[]>([]);
	const [penalties, setPenalties] = useState<number>(0);
	const [stage, setStage] = useState<'start' | 'waiting' | 'react' | 'done'>(
		'start'
	);
	const [message, setMessage] = useState<string>('Click START to begin');
	const [startTime, setStartTime] = useState<number>(0);
	const timeoutRef = useRef<number>(0);

	const attempts = times.length + penalties;

	useEffect(() => {
		const stored = localStorage.getItem(storageKey);
		if (stored) {
			const data = JSON.parse(stored);
			setTimes(data.times || []);
			setPenalties(data.penalties || 0);
		}
	}, [storageKey]);

	useEffect(() => {
		localStorage.setItem(storageKey, JSON.stringify({ times, penalties }));
	}, [storageKey, times, penalties]);

	const handleStart = () => {
		if (attempts >= maxTries) {
			setMessage('No tries left today');
			return;
		}
		setStage('waiting');
		setMessage('Wait for GREEN');
		const delay = Math.random() * 4000 + 1000;
		timeoutRef.current = window.setTimeout(() => {
			setStage('react');
			setMessage('CLICK!');
			setStartTime(performance.now());
		}, delay);
	};

	const handleClick = () => {
		if (stage === 'react') {
			const rt = Math.round(performance.now() - startTime);
			setTimes((prev) => [...prev, rt]);
			setStage('done');
			setMessage(`Your time: ${rt} ms`);
		} else if (stage === 'waiting') {
			window.clearTimeout(timeoutRef.current);
			setStage('start');
			setPenalties((prev) => prev + 1);
			setMessage('Too soon! You lost a try. Click START to try again');
		}
	};

	const shareResults = () => {
		const avg = times.length
			? Math.round(times.reduce((a, b) => a + b, 0) / times.length)
			: 0;
		const best = times.length ? Math.min(...times) : 0;
		const text = `Reaction Dash ${today}\nTimes: ${times.join(
			' ms, '
		)} ms\nAverage: ${avg} ms\nBest: ${best} ms`;
		if (navigator.share) {
			navigator.share({ text });
		} else {
			navigator.clipboard
				.writeText(text)
				.then(() => alert('Results copied to clipboard'));
		}
	};

	return (
		<div className='dash'>
			<div
				onClick={handleClick}
				className={`dash-box ${stage === 'react' ? 'react' : ''}`}>
				{message}
			</div>
			<button
				onClick={handleStart}
				className='start-button'
				disabled={stage === 'waiting' || attempts >= maxTries}>
				START
			</button>
			<Stats
				times={times}
				penalties={penalties}
				maxTries={maxTries}
				attempts={attempts}
			/>
			{attempts >= maxTries && (
				<button
					onClick={shareResults}
					className='share-button'>
					SHARE RESULTS
				</button>
			)}
		</div>
	);
}
