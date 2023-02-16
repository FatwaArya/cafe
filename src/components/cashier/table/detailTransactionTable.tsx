import Image from "next/image"
import { api } from "../../../utils/api"
import Link from "next/link"
import { ArrowLeftIcon } from "@heroicons/react/24/solid"


const DetailTransactionTable = ({ id }: { id: string }) => {
    const { data: orders } = api.cashier.getDetailTransactionById.useQuery({
        id
    })
    if (!orders) return null

    return (
        <>

            <div className="bg-white print:text-black">

                <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:pb-24 lg:px-8">

                    <div className="max-w-xl flex flex-col">
                        <div className="mb-4 ">

                            <Link
                                href="/cashier"
                                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 print:hidden"
                            >
                                <ArrowLeftIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                                Back
                            </Link>
                        </div>
                        <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl capitalize ">{orders?.transactionNumber} </h1>
                        <p className="mt-2 text-sm text-gray-500 print:hidden">
                            Detail of transaction number {orders?.transactionNumber}.
                            <br />
                            Transaction date {orders?.createdAt.toDateString()}, manage returns, and download invoices.
                        </p>
                    </div>

                    <div className="mt-16">
                        <h2 className="sr-only">Recent orders</h2>

                        <div className="space-y-20">
                            <div key={orders.id}>
                                <h3 className="sr-only">
                                    Order placed on <time dateTime={orders.createdAt.toDateString()}>{orders.createdAt.toDateString()}</time>
                                </h3>

                                <div className="bg-gray-50 rounded-lg py-6 px-4 sm:px-6 sm:flex sm:items-center sm:justify-between sm:space-x-6 lg:space-x-8">
                                    <dl className="divide-y divide-gray-200 space-y-6 text-sm text-gray-600 flex-auto sm:divide-y-0 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-x-6 lg:w-1/2 lg:flex-none lg:gap-x-8">
                                        <div className="flex justify-between sm:block">
                                            <dt className="font-medium text-gray-900">Date placed</dt>
                                            <dd className="sm:mt-1">
                                                <time dateTime={orders.createdAt.toDateString()}>{orders.createdAt.toDateString()}</time>
                                            </dd>
                                        </div>
                                        <div className="flex justify-between pt-6 sm:block sm:pt-0">
                                            <dt className="font-medium text-gray-900">Order number</dt>
                                            <dd className="sm:mt-1">{orders.transactionNumber}</dd>
                                        </div>
                                        <div className="flex justify-between pt-6 font-medium text-gray-900 sm:block sm:pt-0">
                                            <dt>Total amount</dt>
                                            <dd className="sm:mt-1">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(orders.total)}</dd>
                                        </div>
                                    </dl>
                                    <button
                                        type="button"
                                        onClick={() => window.print()}
                                        className="w-full flex items-center justify-center bg-white mt-6 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:w-auto sm:mt-0 print:hidden"
                                    >
                                        Download Invoice
                                        <span className="sr-only">for order {orders.transactionNumber}</span>
                                    </button>
                                </div>

                                <table className="mt-4 w-full text-gray-500 sm:mt-6">
                                    <caption className="sr-only">Products</caption>
                                    <thead className="sr-only text-sm text-gray-500 text-left sm:not-sr-only">
                                        <tr>
                                            <th scope="col" className="sm:w-2/5 lg:w-1/3 pr-8 py-3 font-normal">
                                                Product
                                            </th>
                                            <th scope="col" className="hidden w-1/5 pr-8 py-3 font-normal sm:table-cell">
                                                Price
                                            </th>
                                            <th scope="col" className="hidden w-1/5 pr-8 py-3 font-normal sm:table-cell">
                                                Quantity
                                            </th>
                                            <th scope="col" className="hidden pr-8 py-3 font-normal sm:table-cell">
                                                Status
                                            </th>
                                            <th scope="col" className="w-0 py-3 font-normal text-right">
                                                Info
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="border-b border-gray-200 divide-y divide-gray-200 text-sm sm:border-t">
                                        {orders?.transaction?.map((product) => (
                                            <tr key={product.id}>
                                                <td className="py-6 pr-8">
                                                    <div className="flex items-center">
                                                        <Image
                                                            src={product.menu.image || ""}
                                                            alt={product.menu.desc || ""}
                                                            width={64}
                                                            height={64}
                                                            className="w-16 h-16 object-center object-cover rounded mr-6 print:hidden"
                                                        />
                                                        <div>
                                                            <div className="font-medium text-gray-900">{product.menu.name}</div>
                                                            <div className="mt-1 sm:hidden">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(parseInt(product.menu.price))}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="hidden py-6 pr-8 sm:table-cell">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(parseInt(product.menu.price))}</td>
                                                <td className="hidden py-6 pr-8 sm:table-cell">{product.quantity}</td>
                                                <td className="hidden py-6 pr-8 sm:table-cell">{product.status}</td>
                                                <td className="py-6 font-medium text-right whitespace-nowrap">
                                                    <a className="text-indigo-600">
                                                        View<span className="hidden lg:inline"> Product</span>
                                                        <span className="sr-only">, {product.menu.name}</span>
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
            </div>
        </>
    )
}

export default DetailTransactionTable