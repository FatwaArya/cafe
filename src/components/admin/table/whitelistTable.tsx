import { api } from "../../../utils/api"



export default function WhitelistTable() {
    const { data: users } = api.admin.getWhitelist.useQuery()

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

                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {users?.map((person, key) => (
                                            <tr key={person.email}>
                                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                                    {key + 1}
                                                </td>

                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{person.email}</td>

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