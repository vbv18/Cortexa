import { ShareIcon } from '../icons/ShareIcon';
import { DeleteIcon } from '../icons/DeleteIcon';
import { Button } from "./Button"

interface CardProps {
    icon: "Youtube" | "Twitter" | "Notion" | "others",
    tag: string,
    title: string,
    link: string,
    reload?: () => void
}

export function Card(props: CardProps) {

    return (
        <div className="p-6 bg-white rounded-md border border-gray-200 max-w-96">
            <div className="flex items-center justify-between">
                <span className='font-medium'>
                    {props.title}
                </span>
                <span className='flex items-center gap-4 '>
                    <Button
                        variant="tetriary"
                        size="sm"
                        startIcon={<ShareIcon />}
                        onClick={() => alert('Button Clicked!')}
                    />
                    <Button
                        variant="tetriary"
                        size="sm"
                        startIcon={<DeleteIcon />}
                        onClick={() => alert('Button Clicked!')}
                    />
                </span>
            </div>
        </div>
    )
}