/* This example requires Tailwind CSS v2.0+ */
import { Dialog, Transition } from '@headlessui/react'
import {
    ArrowRightOnRectangleIcon,
    Bars3Icon,
    DocumentPlusIcon,
    HomeIcon,
    UserCircleIcon,
    XMarkIcon
} from '@heroicons/react/24/outline'
import { signOut, useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Fragment, useEffect, useState } from 'react'
import { Loader } from '../../auth/AuthGuard'



function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

interface IAdminLayoutProps {
    children: React.ReactNode
}

const AdminLayout: React.FC<IAdminLayoutProps> = ({ children }) => {
    const { data: session, status } = useSession()


    const [sidebarOpen, setSidebarOpen] = useState(false);

    const [navigation, setNavigation] = useState([
        {
            name: "Overview",
            href: "/admin",
            icon: HomeIcon,
            current: false,
        },
        // {
        //     name: "New Order",
        //     href: "/cashier/new-order",
        //     icon: DocumentPlusIcon,
        //     current: false,
        // },
        {
            name: "Sign Out",
            href: "/",
            icon: ArrowRightOnRectangleIcon,
            current: false,
        }
    ]);

    const { asPath } = useRouter();
    useEffect(() => {
        if (asPath) {
            const newNavigation = navigation.map((nav) => ({
                ...nav,
                current: nav.href === asPath,
            }));
            setNavigation(newNavigation);
        }
    }, [asPath]);

    if (status === "loading") { return <Loader /> }

    return (
        <>

            <div>
                <Transition.Root show={sidebarOpen} as={Fragment}>
                    <Dialog as="div" className="fixed inset-0 flex z-40 md:hidden" onClose={setSidebarOpen}>
                        <Transition.Child
                            as={Fragment}
                            enter="transition-opacity ease-linear duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="transition-opacity ease-linear duration-300"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <Dialog.Overlay className="fixed inset-0 bg-gray-600 bg-opacity-75" />
                        </Transition.Child>
                        <Transition.Child
                            as={Fragment}
                            enter="transition ease-in-out duration-300 transform"
                            enterFrom="-translate-x-full"
                            enterTo="translate-x-0"
                            leave="transition ease-in-out duration-300 transform"
                            leaveFrom="translate-x-0"
                            leaveTo="-translate-x-full"
                        >
                            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
                                <Transition.Child
                                    as={Fragment}
                                    enter="ease-in-out duration-300"
                                    enterFrom="opacity-0"
                                    enterTo="opacity-100"
                                    leave="ease-in-out duration-300"
                                    leaveFrom="opacity-100"
                                    leaveTo="opacity-0"
                                >
                                    <div className="absolute top-0 right-0 -mr-12 pt-2">
                                        <button
                                            type="button"
                                            className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                                            onClick={() => setSidebarOpen(false)}
                                        >
                                            <span className="sr-only">Close sidebar</span>
                                            <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                                        </button>
                                    </div>
                                </Transition.Child>
                                <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                                    <div className="flex flex-shrink-0 px-4 justify-center">
                                        <Image
                                            className="h-8 w-auto rotate-90"
                                            src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
                                            alt="Workflow"
                                            width={32}
                                            height={32}
                                        />
                                        <p className="text-2xl font-semibold mx-2">wikuadmin</p>
                                    </div>
                                    <nav className="mt-5 px-2 space-y-1">
                                        {navigation.map((item) => (
                                            <Link
                                                key={item.name}
                                                href={item.href}
                                                className={classNames(
                                                    item.current
                                                        ? 'bg-gray-100 text-gray-900'
                                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                                                    'group flex items-center px-2 py-2 text-base font-medium rounded-md'
                                                )}
                                                onClick={() => {
                                                    if (item.name === "Sign Out") {
                                                        signOut();
                                                    }
                                                }}
                                            >
                                                <item.icon
                                                    className={classNames(
                                                        item.current ? 'text-gray-500' : 'text-gray-400 group-hover:text-gray-500',
                                                        'mr-4 flex-shrink-0 h-6 w-6'
                                                    )}
                                                    aria-hidden="true"

                                                />
                                                {item.name}
                                            </Link>
                                        ))}
                                    </nav>
                                </div>
                                <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
                                    <div className="flex-shrink-0 group block">
                                        <div className="flex items-center">
                                            <div>
                                                <Image
                                                    className="inline-block  w-10 rounded-full h-10"
                                                    src={session?.user?.image || ""}
                                                    alt=""
                                                    width={40}
                                                    height={40}
                                                />
                                            </div>
                                            <div className="ml-3">
                                                <p className="text-base font-medium text-gray-700 group-hover:text-gray-900">{session?.user?.name}</p>
                                                <p className="text-sm font-medium text-gray-500 group-hover:text-gray-700">{session?.user?.email}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Transition.Child>
                        <div className="flex-shrink-0 w-14">{/* Force sidebar to shrink to fit close icon */}</div>
                    </Dialog>
                </Transition.Root>

                {/* Static sidebar for desktop */}
                <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
                    {/* Sidebar component, swap this element with another sidebar if you like */}
                    <div className="flex-1 flex flex-col min-h-0 border-r border-gray-200 bg-white">
                        <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
                            <div className="flex flex-shrink-0 px-4 justify-center">
                                <Image
                                    className="h-8 w-auto rotate-90"
                                    src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
                                    alt="Workflow"
                                    width={32}
                                    height={32}
                                />
                                <p className="text-2xl font-semibold mx-2">wikuadmin</p>
                            </div>
                            <nav className="mt-5 flex-1 px-2 bg-white space-y-1">
                                {navigation.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={classNames(
                                            item.current ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                                            'group flex items-center px-2 py-2 text-sm font-medium rounded-md'
                                        )}
                                        onClick={() => {
                                            if (item.name === "Sign Out") {
                                                signOut();
                                            }
                                        }}
                                    >
                                        <item.icon
                                            className={classNames(
                                                item.current ? 'text-gray-500' : 'text-gray-400 group-hover:text-gray-500',
                                                'mr-3 flex-shrink-0 h-6 w-6'
                                            )}
                                            aria-hidden="true"
                                        />
                                        {item.name}
                                    </Link>
                                ))}
                            </nav>
                        </div>
                        <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
                            <div className="flex-shrink-0 w-full group block">
                                <div className="flex items-center">
                                    <div>
                                        <Image
                                            className="inline-block  w-10 rounded-full h-10"
                                            src={session?.user?.image || ""}
                                            alt=""
                                            width={40}
                                            height={40}
                                        />
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">{session?.user?.name}</p>
                                        <p className="text-xs font-medium text-gray-500 group-hover:text-gray-700">{session?.user?.email}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="md:pl-64 flex flex-col flex-1">
                    <div className="sticky top-0 z-10 md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 bg-white">
                        <button
                            type="button"
                            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                            onClick={() => setSidebarOpen(true)}
                        >
                            <span className="sr-only">Open sidebar</span>
                            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                        </button>
                    </div>
                    <main className="flex-1">
                        <div className="py-6">
                            {/* <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                                <h1 className="text-2xl font-semibold text-gray-900">{}</h1>
                            </div> */}
                            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                                {/* Replace with your content */}
                                {/* <div className="py-4"> */}
                                {children}
                                {/* </div> */}
                                {/* /End replace */}
                            </div>
                        </div>
                    </main>
                </div>
            </div>



        </>
    )
}

export default AdminLayout