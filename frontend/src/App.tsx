import './App.css'
import { Button } from "./components/Button"
import { PlusIcon } from './icons/PlusIcon'
import { ShareIcon } from './icons/ShareIcon'

export default function App() {
  return (
    <div className="p-2 m-2 flex gap-4">
      <Button
        variant="secondary"
        size="md"
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
  )
}