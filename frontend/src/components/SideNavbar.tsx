import { useState, useEffect, createContext, useContext } from "react";
import { BarIcon } from "./icons/BarIcon";
import { YoutubeIcon } from "./icons/YoutubeIcon";
import { All } from "./icons/All";
import { NotionIcon } from "./icons/NotionIcon";
import { TwitterIcon } from "./icons/TwitterIcon";
import { Button } from "./Button";
import { CrossIcon } from "./icons/CrossIcon";

type SideNavbarProps = {
    data1?: any,
    setData?: any,
    setYtData?: any,
    setNotionData?: any,
    setTwitterData?: any,
    setDataShow?: any
}

type ToggleContextType = {
    isOpen: boolean,
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
    isMobile: boolean,
    setIsMobile: React.Dispatch<React.SetStateAction<boolean>>
}

type ProviderPropsType = {
    children: React.ReactNode
}

const ToggleContext = createContext<ToggleContextType | undefined>(undefined);

function ToggleContextProvider({ children }: ProviderPropsType) {
    const [isOpen, setIsOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const media = window.matchMedia("(max-width:640px)");

        const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
            const mobile = e.matches;

            setIsMobile(mobile);

            if (mobile) {
                setIsOpen(false);
            } else {
                setIsOpen(true);
            }
        }

        handleChange(media);

        media.addEventListener("change", handleChange);

        return () => {
            media.removeEventListener("change", handleChange);
        };
    }, []);

    return (
        <ToggleContext.Provider
            value={{ isOpen, setIsOpen, isMobile, setIsMobile }}
        >
            {children}
        </ToggleContext.Provider>
    )
}

function useToggle() {
    const context = useContext(ToggleContext);

    if (!context) {
        throw new Error("useToggle must be used within ToggleContextProvider");
    }

    return context;
}

export function SideNavbar(props: SideNavbarProps) {

    return (
        <ToggleContextProvider>
            <Parent props={props} />
        </ToggleContextProvider>
    )
}

function Parent({ props }: { props: SideNavbarProps }) {
    const { isMobile, isOpen, setIsOpen } = useToggle();

    return (
        <>
            {/* Mobile Toggle */}
            {isMobile && !isOpen && (
                <div
                    className="fixed top-4 left-4 z-60 h-12 w-12 rounded-2xl backdrop-blur-md flex items-center justify-center transition active:scale-95"
                >
                    <Button startIcon={<BarIcon />} onClick={() => setIsOpen(true)} variant="tetriary" />
                </div>
            )}

            {/* Overlay */}
            {isMobile && isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
                    fixed top-0 left-0 z-50 h-screen w-72 md:w-80 bg-white shadow-xl overflow-y-auto transition-transform duration-300 ease-out will-change-transform
                    ${isMobile
                        ? isOpen
                            ? "translate-x-0"
                            : "-translate-x-full"
                        : "translate-x-0"
                    }
                `}
            >
                <Content props={props} />
            </aside>
        </>
    )
}

function Content({ props }: { props: SideNavbarProps }) {
    const { isMobile, setIsOpen } = useToggle();

    function yt() {
        const ytData = props.data1.filter(
            (item: any) => item.contentType === "Youtube"
        );

        props.setYtData(ytData);
        props.setDataShow("Youtube");

        if (isMobile) setIsOpen(false);
    }

    function twitter() {
        const twitterData = props.data1.filter(
            (item: any) => item.contentType === "Twitter"
        );

        props.setTwitterData(twitterData);
        props.setDataShow("Twitter");

        if (isMobile) setIsOpen(false);
    }

    function notion() {
        const ntData = props.data1.filter(
            (item: any) => item.contentType === "Notion"
        );

        props.setNotionData(ntData);
        props.setDataShow("Notion");

        if (isMobile) setIsOpen(false);
    }

    function all() {
        props.setDataShow("All");

        if (isMobile) setIsOpen(false);
    }

    return (
        <div className="h-full">
            {/* Header */}
            <div className="flex items-center justify-end border-b px-5 py-4">
                {isMobile && (
                    <Button
                        startIcon={<CrossIcon />}
                        onClick={() => setIsOpen(false)}
                        variant="tetriary"
                    />
                )}
            </div>

            {/* Nav Items */}
            <div className="pt-4">
                <div onClick={all}>
                    <NavItem text="All" startIcon={<All />} />
                </div>

                <div onClick={yt}>
                    <NavItem text="Youtube" startIcon={<YoutubeIcon />} />
                </div>

                <div onClick={twitter}>
                    <NavItem text="Twitter" startIcon={<TwitterIcon />} />
                </div>

                <div onClick={notion}>
                    <NavItem text="Notion" startIcon={<NotionIcon />} />
                </div>
            </div>
        </div>
    )
}

type NavItemProps = {
    text: string,
    startIcon: React.ReactNode
}

function NavItem(props: NavItemProps) {
    return (
        <div
            className="
                mx-3 my-1
                flex items-center gap-3
                rounded-xl px-4 py-3
                cursor-pointer
                transition-all
                hover:bg-gray-100
                active:scale-[0.98]
            "
        >
            <div className="text-gray-600">
                {props.startIcon}
            </div>

            <span className="text-lg font-semibold">
                {props.text}
            </span>
        </div>
    )
}