import ReactionDash from '../components/ReactionDash';
import Header from '../components/Header';

export default function Home() {
	return (
		<div className='container'>
			<Header />
			<div className='ad'>Top Placeholder</div>
			<main className='main'>
				<ReactionDash />
			</main>
			<div className='ad'>Bottom Placeholder</div>
		</div>
	);
}
