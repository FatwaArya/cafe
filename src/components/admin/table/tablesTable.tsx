import { api } from "../../../utils/api"
import { Loader } from "../../auth/AuthGuard"


function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}



export default function TablesTable() {
    const utils = api.useContext()
    const { data: tables, status } = api.admin.getTables.useQuery()
    const updateStatus = api.admin.setTableToAvailable.useMutation(
        {
            onSuccess: () => {
                utils.admin.getTables.invalidate()
            }
        }
    )


    if (status === "loading") { return <Loader /> }


    return (
        <>
            <div className="mt-6">
                <div className="flex flex-col mt-2">
                    <div className="sm:flex-auto mb-2">
                        <h1 className="text-xl font-semibold text-gray-900">Tables</h1>
                        <p className="text-sm text-gray-700">
                            A list of all the tables.
                        </p>

                    </div>
                    <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className=" py-2 align-middle md:px-6 lg:px-8">
                            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg ">
                                <table className="min-w-full divide-y divide-gray-300 ">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                                No
                                            </th>

                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                Number
                                            </th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                Status
                                            </th>
                                            <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                                <span className="sr-only">Edit</span>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {tables?.map((table, key) => (
                                            <tr key={table.id}>
                                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                                    {key + 1}
                                                </td>

                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{table.number}</td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{table.status}</td>
                                                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                    <button
                                                        onClick={() => {
                                                            updateStatus.mutate({ tableId: table.id })
                                                        }}
                                                        disabled={table.status === "AVAILABLE"}
                                                        className={classNames(
                                                            table.status === "AVAILABLE" ? 'text-gray-200' : 'text-indigo-600'

                                                        )}
                                                    >
                                                        Update<span className="sr-only">, {table.number}</span>
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