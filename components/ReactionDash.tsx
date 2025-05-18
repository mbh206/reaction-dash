import { useState, useEffect, useRef } from 'react';
import Stats from './Stats';

export default function ReactionDash() {
	const now = new Date();
	if (now.getHours() < 1) now.setDate(now.getDate() - 1);
	const today = now.toISOString().slice(0, 10);
	const storageKey = `reactionDash_${today}`;
	const maxTries = 5;

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
		const delay = Math.random() * 4000 + 1000; // 1-5 seconds
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
			clearTimeout(timeoutRef.current);
			setStage('start');
			setPenalties((prev) => prev + 1);
			setMessage('Too soon! You lost a try. Click START to try again');
		}
	};

	const shareResults = () => {
		const avg = times.length
			? Math.round(times.reduce((a, b) => a + b, 0) / times.length)
			: 0;
		const text = `I just averaged ${avg} ms on Reaction Dash! Can you beat me? 🤔
Play now: ${window.location.origin}`;
		if (navigator.share) {
			navigator.share({ text });
		} else {
			window.open(
				`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
				'_blank'
			);
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
					Share Your Score
				</button>
			)}
		</div>
	);
}
