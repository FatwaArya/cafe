import { useEffect, useState } from 'react'
import { api } from '../../../utils/api'
import Link from 'next/link'
import { AdjustmentsHorizontalIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import DatePicker from 'react-datepicker'
import { format, getDate } from 'date-fns'
import { useOrderDateStore } from '../../../store/orderDateStore'


export default function AllTransactionTable() {
    const [searchField, setSearchField] = useState('')
    const startDate = useOrderDateStore(state => state.order.date)
    const newStartDate = startDate?.toISOString() as string
    const { data: transactions } = api.manager.getTransaction.useQuery(
        { date: newStartDate },
    )
    const setStartDate = useOrderDateStore(state => state.setDate)
    const setAllOrders = useOrderDateStore(state => state.setAllOrders)
    const [filteredTransactions, setFilteredTransactions] = useState(transactions)
    const [allTime, setAllTime] = useState(false)

    useEffect(() => {
        const newFilteredTransactions = transactions?.filter((transaction) => {
            return transaction.transaction[0]?.user?.name?.toLowerCase().includes(searchField.toLowerCase())
        })
        setFilteredTransactions(newFilteredTransactions)
    }, [searchField, transactions])

    useEffect(() => {
        if (allTime) {
            setFilteredTransactions(transactions)
            setAllOrders()
        } else {
            const newFilteredTransactions = transactions?.filter((transaction) => {
                const date = transaction.transaction[0]?.createdAt
                return date?.getDate() === startDate?.getDate() && date?.getMonth() === startDate?.getMonth() && date?.getFullYear() === startDate?.getFullYear()
            }
            )
            setFilteredTransactions(newFilteredTransactions)
        }
    }, [startDate, transactions, allTime])

    const renderDayContents = (day: any, date: any) => {
        //if theres transaction then show the red dot on top of the date but still show if were on different date
        const isTransaction = transactions?.some((transaction) => {
            const transactionDate = transaction.transaction[0]?.createdAt
            return transactionDate?.getDate() === date.getDate() && transactionDate?.getMonth() === date.getMonth() && transactionDate?.getFullYear() === date.getFullYear()
        })

        return (
            <button className='inline-block relative' key={day} onClick={() => {
                setAllTime(false)
            }}>
                <div className='cursor-pointer' >
                    {date.getDate()}
                </div>
                {isTransaction && <span className="absolute top-[-4px] right-[-9px] block h-2 w-2 rounded-full ring-2 ring-white bg-red-400" />}
            </button>
        );
    };


    return (
        <>

            <div className="px-4 sm:px-6 lg:px-8">
                <div className="sm:flex sm:items-center">
                    <div className="sm:flex-auto">
                        <h1 className="text-xl font-semibold text-gray-900">Overview</h1>
                        <p className="mt-2 text-sm text-gray-700">
                            A list of all the transactions that have been made by the cashier.
                        </p>
                    </div>
                </div>
                <div className='flex justify-between'>
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
                            <AdjustmentsHorizontalIcon className="h-5 w-5 text-gray-400 " aria-hidden="true" onClick={() => { }} />
                        </div>
                    </div>
                    <div className="mt-3 relative rounded-md shadow-sm">
                        <DatePicker
                            selected={startDate}
                            onChange={(date) => setStartDate(date as Date)}
                            startDate={startDate}
                            selectsStart
                            renderDayContents={renderDayContents}
                            placeholderText='All Time'
                            renderCustomHeader={({
                                date,
                                decreaseMonth,
                                increaseMonth,
                                prevMonthButtonDisabled,
                                nextMonthButtonDisabled,
                            }) => (
                                <div className="flex items-center justify-between px-2 py-2 ">
                                    <span className="text-lg text-gray-700 ">
                                        {format(date, 'MM/dd/yyyy')}
                                    </span>
                                    <div className="space-x-2">
                                        <button
                                            onClick={() => {
                                                setAllTime(!allTime)
                                            }}
                                            disabled={allTime}
                                            type="button"
                                            //if all time is true then disable the button
                                            className={`${allTime && 'cursor-not-allowed opacity-50'} inline-flex p-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-blue-500`}
                                        >
                                            All Time
                                        </button>

                                    </div>


                                    <div className="space-x-2">
                                        <button
                                            onClick={decreaseMonth}
                                            disabled={prevMonthButtonDisabled}
                                            type="button"
                                            className={`${prevMonthButtonDisabled && 'cursor-not-allowed opacity-50'} inline-flex p-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-blue-500`}
                                        >
                                            <ChevronLeftIcon className="w-5 h-5 text-gray-600" />
                                        </button>

                                        <button
                                            onClick={increaseMonth}
                                            disabled={nextMonthButtonDisabled}
                                            type="button"
                                            className={`${nextMonthButtonDisabled && 'cursor-not-allowed opacity-50'}inline-flex p-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-blue-500`}
                                        >
                                            <ChevronRightIcon className="w-5 h-5 text-gray-600" />
                                        </button>
                                    </div>


                                </div>
                            )}
                        />

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
                                                    Order Number
                                                </a>
                                            </th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                <a href="#" className="group inline-flex">
                                                    Order Quantity
                                                </a>
                                            </th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                <a href="#" className="group inline-flex">
                                                    Order Total
                                                </a>
                                            </th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                <a href="#" className="group inline-flex">
                                                    Cashier
                                                </a>
                                            </th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                <a href="#" className="group inline-flex">
                                                    Date Placed
                                                </a>
                                            </th>
                                            <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                                <span className="sr-only">Edit</span>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {filteredTransactions?.map((transaction, key) => (
                                            <tr key={transaction.id}>
                                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                                    {key + 1}
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{transaction.transactionNumber}</td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{
                                                    transaction.transaction.map((item) => (
                                                        item.quantity
                                                    )).reduce((a, b) => a + b, 0)
                                                }</td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(transaction.total)}</td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{transaction.transaction[0]?.user?.name}</td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{transaction.createdAt.toLocaleDateString()}</td>

                                                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                    <Link href={`/orders/detail/${transaction.id}`} className="text-indigo-600 hover:text-indigo-900">
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