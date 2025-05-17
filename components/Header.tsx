import Link from 'next/link';
export default function Header() {
	return (
		<div className='header'>
			<nav className='nav'>
				<Link href='/'>Reaction Dash</Link>
				<Link href='/history'>History</Link>
			</nav>
		</div>
	);
}
