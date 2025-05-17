import ReactionDash from '../components/ReactionDash';
import Header from '../components/Header';

export default function Home() {
	return (
		<div className='container'>
			<Header />
			<div className='ad'>Ad Space Top</div>
			<main className='main'>
				<ReactionDash />
			</main>
			<div className='ad'>Ad Space Bottom</div>
		</div>
	);
}
