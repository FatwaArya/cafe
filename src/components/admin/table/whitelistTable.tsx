import { api } from "../../../utils/api"
import { Loader } from "../../auth/AuthGuard"



export default function WhitelistTable() {
    const utils = api.useContext()
    const { data: users, status } = api.admin.getWhitelist.useQuery()
    const deleteWhitelist = api.admin.deleteWhitelist.useMutation(
        {
            onSuccess: () => {
                utils.admin.getWhitelist.invalidate()
            }
        }
    )

    if (status === "loading") { return <Loader /> }


    return (
        <>
            <div className="mt-6">
                <div className="sm:flex-auto">
                    <h1 className="text-md font-semibold text-gray-900">Whitelisted email</h1>
                </div>
                <div className="flex flex-col mt-2">
                    <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="inline-block  py-2 align-middle md:px-6 lg:px-8 min-w-0 ">
                            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                                <table className="min-w-full divide-y divide-gray-300 ">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                                No
                                            </th>

                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                Email
                                            </th>
                                            <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                                <span className="sr-only">Edit</span>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {users?.map((person, key) => (
                                            <tr key={person.email}>
                                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                                    {key + 1}
                                                </td>

                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{person.email}</td>
                                                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                    <button className="text-red-600 hover:text-red-700"
                                                        onClick={() => {
                                                            deleteWhitelist.mutate({
                                                                email: person.email
                                                            })
                                                        }}
                                                    >
                                                        Delete<span className="sr-only">, {person.email}</span>
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
            </div>
        </>
    )

}