import { api } from "../../../utils/api"
import { MagnifyingGlassIcon, UserGroupIcon } from "@heroicons/react/24/outline"
import { Fragment, useRef, useState, useEffect } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import WhitelistTable from "./whitelistTable"


export default function UsersTable() {
    const { data: users } = api.admin.getUsers.useQuery()
    const [searchField, setSearchField] = useState("")
    const [filteredUsers, setFilteredUsers] = useState(users)
    const [open, setOpen] = useState(false)
    const [emailError, setEmailError] = useState(false)
    const cancelButtonRef = useRef(null)
    const [email, setEmail] = useState("")
    const utils = api.useContext()
    const mutateWhitelist = api.admin.whitelistUser.useMutation(
        {
            onSuccess: () => {
                utils.admin.getWhitelist.invalidate()
                setOpen(false)
            },
            onError: () => {
                setEmailError(true)
            },
        },

    )

    useEffect(() => {
        setFilteredUsers(
            users?.filter((user) => {
                return user?.name?.toLowerCase().includes(searchField.toLowerCase())
            })
        )
    }, [searchField, users])

    return (<>
        <Transition.Root show={open} as={Fragment}>
            <Dialog as="div" className="fixed z-10 inset-0 overflow-y-auto" initialFocus={cancelButtonRef} onClose={setOpen}>
                <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                    </Transition.Child>

                    {/* This element is to trick the browser into centering the modal contents. */}
                    <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
                        &#8203;
                    </span>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        enterTo="opacity-100 translate-y-0 sm:scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                        leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    >
                        <div className="relative inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                            <div className="flex flex-row">
                                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                                    <UserGroupIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
                                </div>
                                <div className="mt-3  sm:mt-0 sm:ml-4 sm:text-left sm:w-full">
                                    <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900">
                                        Whitelist employee
                                    </Dialog.Title>
                                    <div className="mt-2">
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 text-left">
                                            Email
                                        </label>
                                        <div className="mt-1 flex-grow ">
                                            <input
                                                type="email"
                                                name="email"
                                                id="email"
                                                onChange={(e) => { setEmail(e.target.value) }}
                                                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block  sm:text-sm border-gray-300 rounded-md w-full"
                                                placeholder="you@example.com"
                                            />
                                        </div>
                                        {emailError && <p className="mt-2 text-sm text-red-600" id="email-error">
                                            Your email must be a valid.
                                        </p>}
                                    </div>
                                </div>
                            </div>
                            <div className="mt-8 sm:mt-6 sm:flex sm:flex-row-reverse">
                                <button
                                    type="button"
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                                    onClick={() => {
                                        mutateWhitelist.mutate({
                                            email,
                                        })
                                    }}
                                >
                                    Deactivate
                                </button>
                                <button
                                    type="button"
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                                    onClick={() => setOpen(false)}
                                    ref={cancelButtonRef}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>
        <div className="px-4 sm:px-6 lg:px-8">
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-xl font-semibold text-gray-900">Employees</h1>
                    <p className="mt-2 text-sm text-gray-700">
                        A list of all the employees, including their name, title, email and role.
                    </p>
                </div>
                <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                    <button
                        type="button"
                        onClick={() => setOpen(!open)}
                        className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
                    >
                        Add employee
                    </button>
                </div>


            </div>
            <div className="mt-3 relative rounded-md shadow-sm">
                <input

                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    type="text"
                    onChange={(e) => {
                        setSearchField(e.target.value)
                    }}
                    placeholder='Search by name'
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer  ">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 " aria-hidden="true" onClick={() => { }} />
                </div>
            </div>
            <div className="mt-8 flex flex-col">
                <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-300">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                            No
                                        </th>
                                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                            Name
                                        </th>

                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Email
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Role
                                        </th>
                                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                            <span className="sr-only">Edit</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {filteredUsers?.map((person, key) => (
                                        <tr key={person.email}>
                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                                {key + 1}
                                            </td>
                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                                {person.name}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{person.email}</td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{person.role}</td>
                                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                <a href="#" className="text-indigo-600 hover:text-indigo-900">
                                                    Edit<span className="sr-only">, {person.name}</span>
                                                </a>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <WhitelistTable />

        </div>
    </>

    )
}
