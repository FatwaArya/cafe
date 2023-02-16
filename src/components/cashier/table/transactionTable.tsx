import { useState } from 'react'
import { api } from '../../../utils/api'
import Link from 'next/link'


export default function TransactionTable() {
    const { data: transactions } = api.cashier.getTransaction.useQuery()

    return (
        <>

            <div className="px-4 sm:px-6 lg:px-8">
                <div className="sm:flex sm:items-center">
                    <div className="sm:flex-auto">
                        <h1 className="text-xl font-semibold text-gray-900">Overview</h1>
                        <p className="mt-2 text-sm text-gray-700">
                            A list of all the transactions that have been made.
                        </p>
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
                                                <a href="#" className="group inline-flex">
                                                    No
                                                </a>
                                            </th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                <a href="#" className="group inline-flex">
                                                    Order number
                                                </a>
                                            </th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                <a href="#" className="group inline-flex">
                                                    Order quantity
                                                </a>
                                            </th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                <a href="#" className="group inline-flex">
                                                    Order Total
                                                </a>
                                            </th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                <a href="#" className="group inline-flex">
                                                    Date                                                </a>
                                            </th>
                                            <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                                <span className="sr-only">Edit</span>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {transactions?.map((transaction, key) => (
                                            <tr key={transaction.id}>
                                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                                    {key + 1}
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{transaction.transactionNumber}</td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{transaction.quantity}</td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(transaction.total)}</td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{transaction.createdAt.toLocaleString('sv')}</td>

                                                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                    <Link href={`/cashier/detail/${transaction.id}`} className="text-indigo-600 hover:text-indigo-900">
                                                        Detail
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div></>

    )
}