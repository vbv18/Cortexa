import '../App.css'
import { useState } from 'react'
import { Button } from "../components/Button"
import { Card } from '../components/Card'
import { CreateContentModal } from '../components/CreateContentModal'
import { PlusIcon } from '../components/icons/PlusIcon'
import { ShareIcon } from '../components/icons/ShareIcon'
import { SideNavbar } from '../components/SideNavbar'

export default function Home() {
    const [modalOpen, setModalOpen] = useState(false);

    return (
        <div className='min-h-screen bg-primary-bg'>
            <SideNavbar />

            <main
                className='sm:ml-72 md:ml-80 h-screen p-4 pt-20 sm:pt-4 grid grid-rows-[auto_1fr] gap-4 overflow-hidden'
            >
                {/* Header */}
                <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
                    <div className='flex items-center'>
                        <h1 className='text-3xl font-bold tracking-tight'>
                            CORTEXA
                        </h1>
                    </div>

                    {/* Buttons */}
                    <div className='flex flex-wrap gap-3'>
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
                            onClick={() => setModalOpen(true)}
                        />
                    </div>
                </div>

                {/* Cards */}
                <div className='overflow-y-auto pr-2'>
                    <div className='flex flex-wrap gap-4 content-start'>
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
            </main>
            <CreateContentModal open={modalOpen} onClose={() => setModalOpen(false)} />
        </div>
    )
}