import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/20/solid'
import {
    ColumnDef,
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
} from '@tanstack/react-table'
import { api } from '../../../utils/api'
import { useMemo, useState } from 'react'
import { Menu } from '@prisma/client'
import Link from 'next/link'
import { Loader } from '../../auth/AuthGuard'



const columnHelper = createColumnHelper<Menu>()

const columns = [
    columnHelper.accessor("name", {
        header: "Name",
        cell: info => info.getValue(),
    }),
    columnHelper.accessor("desc", {
        header: "Description",
        cell: info => info.getValue()?.length! > 20 ? info.getValue()?.substring(0, 20) + "..." : info.getValue(),
    }),

    columnHelper.accessor("price", {
        header: "Price",
        cell: info => {
            const price = info.getValue()
            const formatter = new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
            })
            return formatter.format(parseInt(price))
        },
    }),
    columnHelper.accessor("type", {
        header: "Category",
        cell: info => info.getValue(),
    }),
    columnHelper.accessor("id", {
        header: "",
        cell: info => <Link href={`/admin/menu/${info.getValue()}`} className="text-indigo-600 hover:text-indigo-900">Edit</Link>,
    }),
]

export default function MenuTable() {
    const { data: Menus, status } = api.admin.getMenus.useQuery()
    const [sorting, setSorting] = useState<SortingState>([])

    const table = useReactTable({
        columns: columns,
        data: Menus || [],
        state: {
            sorting
        },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),

    })

    if (status === "loading") return <Loader />



    return (
        <div className="px-4 sm:px-6 lg:px-8">
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-xl font-semibold text-gray-900">Menus</h1>
                    <p className="mt-2 text-sm text-gray-700">
                        A list of all the menu item in the system. You can edit the menu item by clicking on the edit button.
                    </p>
                </div>
                <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                    <Link
                        href={`/admin/menu/new`}
                        type="button"
                        className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
                    >
                        Add menu
                    </Link>
                </div>
            </div>
            <div className="mt-8 flex flex-col">
                <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-300">
                                <thead className="bg-gray-50">
                                    {table.getHeaderGroups().map((headerGroup) => (
                                        <tr key={headerGroup.id}>
                                            {headerGroup.headers.map(header => {
                                                return (
                                                    <th key={header.id} scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                                        <div   {...{
                                                            className: header.column.getCanSort()
                                                                ? 'cursor-pointer select-none group inline-flex'
                                                                : '',
                                                            onClick: header.column.getToggleSortingHandler(),
                                                        }}>
                                                            {flexRender(
                                                                header.column.columnDef.header,
                                                                header.getContext()
                                                            )}

                                                            {header.column.getIsSorted() ? (
                                                                <span className="invisible ml-2 flex-none rounded text-gray-400 group-hover:visible group-focus:visible">
                                                                    <ChevronUpIcon className="h-5 w-5" aria-hidden="true" />
                                                                </span>
                                                            ) : (
                                                                <span className="invisible ml-2 flex-none rounded text-gray-400 group-hover:visible group-focus:visible">
                                                                    <ChevronDownIcon className="h-5 w-5" aria-hidden="true" />
                                                                </span>
                                                            )}
                                                        </div>

                                                    </th>
                                                )

                                            })}
                                        </tr>))
                                    }


                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {
                                        table.getRowModel().rows.map((row) => {
                                            return (
                                                <tr key={row.id}>
                                                    {row.getVisibleCells().map((cell) => {
                                                        return (
                                                            <td key={cell.id} className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                                                {flexRender(
                                                                    cell.column.columnDef.cell,
                                                                    cell.getContext()
                                                                )}
                                                            </td>
                                                        )
                                                    })}
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}