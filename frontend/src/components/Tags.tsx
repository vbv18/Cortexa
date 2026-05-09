export interface TagType {
    _id: string;
    title: string;
}

export interface TagsProps {
    tagTypes: TagType[];
}

export const Tags = ({ tagTypes }: TagsProps) => {

    return (
        <div className="flex flex-wrap gap-2">
            {tagTypes.map((tag) => (
                <div
                    key={tag._id}
                    className="px-3 py-1text-sm bg-blue-100 rounded-2xl text-blue-500"
                >
                    #{tag.title}
                </div>
            ))}

        </div>
    )
}