import { ShareIcon } from './icons/ShareIcon';
import { DeleteIcon } from './icons/DeleteIcon';
import { TwitterIcon } from './icons/TwitterIcon';
import { NotionIcon } from './icons/NotionIcon';
import { YoutubeIcon } from './icons/YoutubeIcon';
import { Button } from "./Button";
import { Tags, type TagType } from "./Tags";

interface CardProps {
    icon: "Youtube" | "Twitter" | "Notion" | "others";
    tag: TagType[];
    title: string;
    link: string;
    reload?: () => void;
}

interface ContentPreviewProps {
    icon: "Youtube" | "Twitter" | "Notion" | "others";
    link: string;
}


export function Card(props: CardProps) {

    return (
        <div
            className="relative m-2 p-6 pb-16 bg-white rounded-xl border border-gray-200 max-w-96 shadow-sm hover:shadow-md transition-all duration-300 "
        >
            <div
                className="flex items-start justify-between gap-4"
            >
                <h2
                    className="
                        font-semibold
                        text-lg
                        wrap-break-words
                        text-gray-800
                    "
                >
                    {props.title}
                </h2>
                <div className="flex items-center gap-1">
                    <Button
                        variant="tetriary"
                        size="sm"
                        startIcon={<ShareIcon />}
                        onClick={() => {
                            navigator.clipboard.writeText(props.link);
                            alert("Link copied!");
                        }}
                    />

                    <Button
                        variant="tetriary"
                        size="sm"
                        startIcon={<DeleteIcon />}
                        onClick={() => {
                            alert("Delete Clicked!");
                        }}
                    />
                </div>
            </div>

            <div className="mt-4">
                <ContentPreview
                    icon={props.icon}
                    link={props.link}
                />
            </div>

            <div className="mt-5">
                <Tags tagTypes={props.tag} />
            </div>

            <div
                className="absolute bottom-3 left-6 text-sm text-gray-500"
            >
            </div>
        </div>
    );
}

function ContentPreview(props: ContentPreviewProps) {
    const getYoutubeVideoId = (url: string) => {
        const regExp = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/;
        const match = url.match(regExp);
        return match ? match[1] : null;
    };

    if (props.icon === "Youtube") {
        const videoId = getYoutubeVideoId(props.link);

        return (
            <div className="pt-6">
                <div
                    className="flex items-center gap-2 mb-3 text-red-500"
                >
                    <YoutubeIcon />
                    <span className="font-medium text-black">
                        Youtube Video
                    </span>
                </div>

                {videoId ? (
                    <iframe
                        className="w-full rounded-lg"
                        height="220"
                        src={`https://www.youtube.com/embed/${videoId}`}
                        title="Youtube Video Player"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                ) : (
                    <p className="text-red-500 text-sm">
                        Invalid Youtube Link
                    </p>
                )}

            </div>
        );
    }

    if (props.icon === "Twitter") {
        return (
            <div className="pt-6">
                <a
                    href={props.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 border rounded-lg hover:bg-gray-50 transition-all"
                >
                    <TwitterIcon />
                    <div>
                        <p className="font-medium">
                            Open Twitter Post
                        </p>
                        <p className="text-sm text-gray-500 break-all">
                            {props.link}
                        </p>
                    </div>
                </a>
            </div>
        );
    }

    if (props.icon === "Notion") {

        return (
            <div className="pt-6">
                <a
                    href={props.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 border rounded-lg hover:bg-gray-50 transition-all"
                >
                    <NotionIcon />
                    <div>
                        <p className="font-medium">
                            Open Notion Document
                        </p>
                        <p className="text-sm text-gray-500 break-all">
                            {props.link}
                        </p>
                    </div>
                </a>
            </div>
        );
    }

    return (
        <p className="text-gray-500 text-sm pt-6">
            No Content Available
        </p>
    );
}