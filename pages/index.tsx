import ReactionDash from '../components/ReactionDash';

export default function Home() {
	return (
		<div className='container'>
			<div className='ad'>Ad Space Top</div>
			<ReactionDash />
			<div className='ad'>Ad Space Bottom</div>
		</div>
	);
}
