import { api } from "../../../utils/api"
import { CheckIcon, ChevronUpDownIcon, MagnifyingGlassIcon, UserGroupIcon } from "@heroicons/react/24/outline"
import { Fragment, useRef, useState, useEffect } from 'react'
import { Dialog, Listbox, Transition } from '@headlessui/react'
import { ROLE } from "@prisma/client"
import { Loader } from "../../auth/AuthGuard"
import WhitelistTable from "./whitelistTable"
import { classNames } from "../../../utils/classNames"



export const Role: {
    MANAGER: "MANAGER",
    CASHIER: "CASHIER",
    ADMIN: "ADMIN"
} = {
    MANAGER: 'MANAGER',
    CASHIER: 'CASHIER',
    ADMIN: 'ADMIN'
}


export type Role = typeof ROLE[keyof typeof Role]

const roleOpts = [
    { role: Role.CASHIER },
    { role: Role.MANAGER },
    { role: Role.ADMIN },
]

export default function UsersTable() {
    const { data: users, status } = api.admin.getUsers.useQuery()
    const [searchField, setSearchField] = useState("")
    const [filteredUsers, setFilteredUsers] = useState(users)
    const [openEditUser, setEditUser] = useState(false)
    const [selectedRole, setSelectedRole] = useState(roleOpts[0])
    const [userId, setUserId] = useState("")
    const [error, setError] = useState(false)
    const cancelButtonRef = useRef(null)


    const { data: user } = api.admin.getUserById.useQuery({
        id: userId
    })


    const utils = api.useContext()

    const mutateRole = api.admin.updateRole.useMutation(
        {
            onSuccess: () => {
                utils.admin.getUsers.invalidate()
                utils.admin.getUserById.invalidate({ id: userId })
                setEditUser(false)
            }, onError: () => {
                setError(true)
            },

        }
    )

    useEffect(() => {
        setFilteredUsers(
            users?.filter((user) => {
                return user?.name?.toLowerCase().includes(searchField.toLowerCase())
            })
        )
    }, [searchField, users])
    if (status === "loading") { return <Loader /> }

    return (<>


        {/* add user edit */}
        <Transition.Root show={openEditUser} as={Fragment}>
            <Dialog as="div" className="fixed z-10 inset-0 overflow-y-auto" initialFocus={cancelButtonRef} onClose={setEditUser}>
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
                        <div className="relative inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                            <div className="flex flex-row">
                                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                                    <UserGroupIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
                                </div>
                                <div className="mt-3  sm:mt-0 sm:ml-4 sm:text-left sm:w-full">
                                    <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900">
                                        Update employee role
                                    </Dialog.Title>
                                    <div className="mt-2">
                                        <label htmlFor="role" className="block text-sm font-medium text-gray-700 text-left ">
                                            change role for <span className="capitalize">{user?.name?.toLocaleLowerCase()}</span> from <span className="capitalize">{user?.role.toLocaleLowerCase()} </span> to <span className="capitalize font-bold">{selectedRole?.role.toLocaleLowerCase()} </span>
                                        </label>

                                        <div className=" mt-2 flex-grow">
                                            <Listbox defaultValue={selectedRole} onChange={setSelectedRole}  >
                                                {({ open }) => (
                                                    <>
                                                        <div className="relative mt-1">
                                                            <Listbox.Button className="bg-white relative w-full border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                                                                <span className="block truncate">{selectedRole?.role}</span>
                                                                <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                                                    <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                                                </span>
                                                            </Listbox.Button>
                                                            {error && <p className="mt-2 text-sm text-red-600" id="email-error">
                                                                Invalid role change
                                                            </p>}
                                                            <Transition
                                                                show={open}
                                                                as={Fragment}
                                                                leave="transition ease-in duration-100"
                                                                leaveFrom="opacity-100"
                                                                leaveTo="opacity-0"
                                                            >
                                                                <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm" >
                                                                    {roleOpts.map((role, key) => (
                                                                        <Listbox.Option
                                                                            key={key}
                                                                            className={({ active }) =>
                                                                                classNames(
                                                                                    active ? 'text-white bg-indigo-600' : 'text-gray-900',
                                                                                    'relative cursor-default select-none py-2 pl-3 pr-9'
                                                                                )
                                                                            }
                                                                            value={role}
                                                                        >
                                                                            {({ selected, active }) => (

                                                                                <>
                                                                                    <span className={classNames(selected ? 'font-semibold' : 'font-normal', 'block truncate')}>
                                                                                        {role.role}
                                                                                    </span>

                                                                                    {
                                                                                        selected ? (
                                                                                            <span
                                                                                                className={classNames(
                                                                                                    active ? 'text-white' : 'text-indigo-600',
                                                                                                    'absolute inset-y-0 right-0 flex items-center pr-4'
                                                                                                )}
                                                                                            >
                                                                                                <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                                                                            </span>
                                                                                        ) : null


                                                                                    }
                                                                                </>
                                                                            )}
                                                                        </Listbox.Option>
                                                                    ))}
                                                                </Listbox.Options>
                                                            </Transition>
                                                        </div>
                                                    </>
                                                )}
                                            </Listbox>
                                        </div>

                                    </div>
                                </div>
                            </div>
                            <div className="mt-8 sm:mt-6 sm:flex sm:flex-row-reverse">
                                <button
                                    type="button"
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                                    onClick={() => {
                                        mutateRole.mutate({ userId: user?.id as string, role: selectedRole?.role as Role })
                                    }}
                                >
                                    Change
                                </button>
                                <button
                                    type="button"
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                                    onClick={() => {
                                        setError(false)
                                        setEditUser(false)
                                    }}
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


        <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
                <h1 className="text-xl font-semibold text-gray-900">Employees</h1>
                <p className="mt-2 text-sm text-gray-700">
                    A list of all the employees, including their name, title, email and role.
                </p>
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
                    <div className=" shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
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
                                            <button className="text-indigo-600 hover:text-indigo-900"
                                                onClick={() => {
                                                    setUserId(person.id)
                                                    setEditUser(true)
                                                }}
                                            >
                                                Edit<span className="sr-only">, {person.name}</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </>

    )
}
