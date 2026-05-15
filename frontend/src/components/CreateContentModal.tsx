import { CrossIcon } from "./icons/CrossIcon";
import { Button } from "./Button";
import { PlusIcon } from "./icons/PlusIcon";


type ModalProps = {
    open: boolean,
    onClose: () => void
}

export function CreateContentModal({ open, onClose }: ModalProps) {

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-60">
            <div
                className="fixed inset-0 bg-black/30 backdrop-blur-sm"
                onClick={onClose}
            />

            <div className="fixed inset-0 z-70 flex items-center justify-center p-4">
                <div
                    className="w-full max-w-md rounded-xl bg-white p-5 shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="mb-4 flex items-center justify-between">
                        <div
                            className="text-2xl font-bold">
                            Create Content
                        </div>
                        <Button
                            variant="tetriary"
                            startIcon={<CrossIcon />}
                            onClick={onClose}
                        />
                    </div>

                    <div className={"flex flex-col gap-4"}>
                        <Input placeholder="Type" />
                        <Input placeholder="Title" />
                        <Input placeholder="Link" />
                        <Input placeholder="Description" />
                    </div>

                    <div className="mt-6 flex justify-end">
                        <Button
                            variant="primary"
                            startIcon={<PlusIcon />}
                            text="Add"
                            onClick={() => { }}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

function Input({ placeholder }: { placeholder?: string }) {

    return (
        <input
            placeholder={placeholder}
            type={"text"}
            className="w-full rounded-xl border px-4 py-3 outline-none transition focus:border-purple-500"
        />
    )
}