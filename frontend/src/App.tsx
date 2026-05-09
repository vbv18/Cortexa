import './App.css'
import { Button } from "./components/Button"
import { Card } from './components/Card'
import { PlusIcon } from './components/icons/PlusIcon'
import { ShareIcon } from './components/icons/ShareIcon'

export default function App() {
	return (
		<div className='h-screen bg-primary-bg'>
			<div className="p-2 m-2 flex gap-4">
				<Button
					variant="secondary"
					size="sm"
					text="Share Brain"
					startIcon={<ShareIcon />}
					disabled={false}
					onClick={() => alert('Button Clicked!')}
				/>

				<Button
					variant="primary"
					size="md"
					text="Add Content"
					startIcon={<PlusIcon />}
					disabled={false}
					onClick={() => alert('Button Clicked!')}
				/>
			</div>

			<div className='flex flex-wrap gap-4'>
				<Card
					icon="Youtube"
					title="Project Details"
					link="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
					tag={[
						{
							_id: "1",
							title: "react"
						},
						{
							_id: "2",
							title: "typescript"
						},
						{
							_id: "3",
							title: "frontend"
						}
					]}
				/>

				<Card
					icon="Twitter"
					title="Interesting AI Thread"
					link="https://twitter.com"
					tag={[
						{
							_id: "4",
							title: "ai"
						},
						{
							_id: "5",
							title: "ml"
						}
					]}
				/>
			</div>
		</div>
	)
}