
import { Dialog, Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon, XMarkIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import { Fragment, useState } from 'react'
import { Items, useOrderStore } from '../../../store/orderStore'
import { api } from '../../../utils/api'
import { Loader } from '../../auth/AuthGuard'
import { classNames } from '../../../utils/classNames'

function UserChangeModal({ open, setOpen, change }: { open: boolean, setOpen: (open: boolean) => void, change: number }) {

    return (
        <Transition.Root show={open} as={Fragment}>
            <Dialog as="div" className="fixed z-10 inset-0 overflow-y-auto" onClose={setOpen}>
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
                        <div className="relative inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6">
                            <div>
                                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                                    <CheckIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
                                </div>
                                <div className="mt-3 text-center sm:mt-5">
                                    <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900">
                                        Order successful
                                    </Dialog.Title>
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-500">
                                            {/* user change */}
                                            Customer change is {

                                                new Intl.NumberFormat('id-ID', {
                                                    style: 'currency',
                                                    currency: 'IDR',
                                                    minimumFractionDigits: 0
                                                }).format(change)

                                            }
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-5 sm:mt-6">
                                <button
                                    type="button"
                                    className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                                    onClick={() => setOpen(false)}
                                >
                                    Go back to dashboard
                                </button>
                            </div>
                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>
    )
}


export default function ItemList() {
    const { data: items, status } = api.cashier.getsMenu.useQuery()
    const { data: tables } = api.cashier.getsTable.useQuery()
    const utils = api.useContext()
    const [open, setOpen] = useState(false)
    const [openModal, setOpenModal] = useState(false)
    const [customerName, setCustomerName] = useState('')
    const [customerCash, setCustomerCash] = useState(0)
    const [selected, setSelected] = useState(tables?.[0])
    const orders = useOrderStore((state) => state.items)
    const addOrder = useOrderStore((state) => state.addItems)
    const removeOrder = useOrderStore((state) => state.removeItems)
    const clearOrder = useOrderStore((state) => state.clearItems)

    //calculate total price
    const calculateTotalPrice = () => {
        return orders.reduce((ack: number, item) => ack + item.quantity * parseInt(item.price), 0)
    }
    //total price
    const total = calculateTotalPrice()
    //create order mutation
    const createOrder = api.cashier.createOrder.useMutation({
        onSuccess(data, variables) {
            utils.cashier.getTransaction.invalidate();
            setOpen(false)
            clearOrder()
            setOpenModal(true)
        },

    })
    const handleCreateOrder = () => {
        const order = orders.map((item) => ({
            menuId: item.id,
            quantity: item.quantity,
        }))

        createOrder.mutate({
            items: order,
            customerName: customerName,
            tableId: selected?.id as string,
            total: total,
            customerCash
        })
    }

    if (status === "loading") { return <Loader /> }


    return (
        <>
            <UserChangeModal open={openModal} setOpen={setOpenModal} change={createOrder.data as number} />
            <div className="bg-white flex flex-col">
                <div className="sm:flex sm:items-center mb-6">
                    <div className="sm:flex-auto">
                        <h1 className="text-xl font-semibold text-gray-900">New Order</h1>
                        <p className="mt-2 text-sm text-gray-700">
                            A list of all the items available in the menu. Select the items customer want to order.
                        </p>
                    </div>
                    <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                        <button
                            onClick={() => setOpen(true)}
                            disabled={orders.length === 0}
                            type="button"
                            className={classNames(orders.length === 0 ? 'bg-gray-300' : 'bg-indigo-600', 'px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500  float-right')}
                        >
                            open cart
                        </button>
                    </div>

                </div>
                <div className="max-w-7xl mx-auto overflow-hidden ">
                    <h2 className="sr-only">Products</h2>


                    <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                        {items?.map((product) => (
                            <div key={product.id} className="group relative">
                                <div className="min-h-80 aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75 lg:aspect-none lg:h-80">

                                    <Image
                                        src={product.image || ""}
                                        alt={product.desc || ""}
                                        className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                                        width={100}
                                        height={100}
                                    />
                                </div>
                                <div className="mt-4 flex justify-between gap-2">
                                    <div>
                                        <h3 className="text-sm text-gray-700">
                                            {product.name}
                                        </h3>
                                        <p className="mt-1 text-sm text-gray-500">{product.type}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">{new Intl.NumberFormat('id-ID', {
                                            style: 'currency',
                                            currency: 'IDR',
                                        }).format(parseInt(product.price))}</p>
                                        <button
                                            onClick={() => {
                                                addOrder(product as Items)
                                            }}
                                            type="button"
                                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 float-right "
                                        >
                                            Add item
                                        </button>
                                    </div>

                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <Transition.Root show={open} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={setOpen}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-in-out duration-500"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in-out duration-500"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-hidden">
                        <div className="absolute inset-0 overflow-hidden">
                            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                                <Transition.Child
                                    as={Fragment}
                                    enter="transform transition ease-in-out duration-500 sm:duration-700"
                                    enterFrom="translate-x-full"
                                    enterTo="translate-x-0"
                                    leave="transform transition ease-in-out duration-500 sm:duration-700"
                                    leaveFrom="translate-x-0"
                                    leaveTo="translate-x-full"
                                >
                                    <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                                        <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                                            <div className="flex-1 overflow-y-auto py-6 px-4 sm:px-6">
                                                <div className="flex items-start justify-between">
                                                    <Dialog.Title className="text-lg font-medium text-gray-900">Order</Dialog.Title>
                                                    <div className="ml-3 flex h-7 items-center">
                                                        <button
                                                            type="button"
                                                            className="-m-2 p-2 text-gray-400 hover:text-gray-500"
                                                            onClick={() => setOpen(false)}
                                                        >
                                                            <span className="sr-only">Close panel</span>
                                                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="mt-8">
                                                    <div className="flow-root">
                                                        <ul role="list" className="-my-6 divide-y divide-gray-200">
                                                            {orders.map((product) => (
                                                                <li key={product.id} className="flex py-6">
                                                                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                                                        <Image
                                                                            src={product.image || ""}
                                                                            alt={product.desc || ""}
                                                                            className="w-full h-full object-center object-cover"
                                                                            width={100}
                                                                            height={100}
                                                                        />
                                                                    </div>

                                                                    <div className="ml-4 flex flex-1 flex-col">
                                                                        <div>
                                                                            <div className="flex justify-between text-base font-medium text-gray-900">
                                                                                <h3>
                                                                                    {product.name}
                                                                                </h3>
                                                                                <p className="ml-4">{
                                                                                    new Intl.NumberFormat('id-ID', {
                                                                                        style: 'currency',
                                                                                        currency: 'IDR',
                                                                                    }).format(parseInt(product.price))
                                                                                }</p>
                                                                            </div>
                                                                            {/* <p className="mt-1 text-sm text-gray-500">{product.color}</p> */}
                                                                        </div>
                                                                        <div className="flex flex-1 items-end justify-between text-sm">

                                                                            <p className="text-gray-500">Qty {product.quantity}</p>

                                                                            <div className="flex">
                                                                                <button
                                                                                    onClick={() => {
                                                                                        removeOrder(product as Items)
                                                                                    }}
                                                                                    type="button"
                                                                                    className="font-medium text-indigo-600 hover:text-indigo-500"
                                                                                >
                                                                                    Remove
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
                                                <div className='mb-4'>
                                                    <label htmlFor="Customer Name" className="block text-sm font-medium text-gray-700">
                                                        Customer Name
                                                    </label>
                                                    <div className="mt-1">
                                                        <input

                                                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                                            type="text"
                                                            onChange={(e) => {
                                                                setCustomerName(e.target.value)
                                                            }}
                                                            placeholder='Customer Name'
                                                            required

                                                        />
                                                    </div>

                                                    <Listbox defaultValue={selected} onChange={setSelected} >
                                                        {({ open }) => (
                                                            <>
                                                                <Listbox.Label className="block text-sm font-medium text-gray-700">Table Number</Listbox.Label>
                                                                <div className="mt-1 relative">
                                                                    <Listbox.Button className="bg-white relative w-full border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                                                                        <span className="block truncate">{selected?.number || 'Select Table'

                                                                        }</span>
                                                                        <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                                                            <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                                                        </span>
                                                                    </Listbox.Button>

                                                                    <Transition
                                                                        show={open}
                                                                        as={Fragment}
                                                                        leave="transition ease-in duration-100"
                                                                        leaveFrom="opacity-100"
                                                                        leaveTo="opacity-0"
                                                                    >
                                                                        <Listbox.Options className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                                                                            {tables?.map((table) => (
                                                                                <Listbox.Option
                                                                                    key={table.id}
                                                                                    className={({ active }) =>
                                                                                        classNames(
                                                                                            active ? 'text-white bg-indigo-600' : 'text-gray-900',
                                                                                            'cursor-default select-none relative py-2 pl-3 pr-9'
                                                                                        )
                                                                                    }
                                                                                    value={table}
                                                                                >
                                                                                    {({ selected, active }) => (
                                                                                        <>
                                                                                            <span className={classNames(selected ? 'font-semibold' : 'font-normal', 'block truncate')}>
                                                                                                {table.number}
                                                                                            </span>

                                                                                            {selected ? (
                                                                                                <span
                                                                                                    className={classNames(
                                                                                                        active ? 'text-white' : 'text-indigo-600',
                                                                                                        'absolute inset-y-0 right-0 flex items-center pr-4'
                                                                                                    )}
                                                                                                >
                                                                                                    <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                                                                                </span>
                                                                                            ) : null}
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

                                                    <label htmlFor="Customer Name" className="block text-sm font-medium text-gray-700">
                                                        Customer Cash
                                                    </label>
                                                    <div className="mt-1">
                                                        <input

                                                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                                            type="text"
                                                            onChange={(e) => {
                                                                setCustomerCash(parseInt(e.target.value))
                                                            }}
                                                            placeholder='Customer Cash'
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex justify-between text-base font-medium text-gray-900">


                                                    <p>Total</p>
                                                    <p> {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(total)}</p>
                                                </div>
                                                <div className="mt-6">
                                                    <button
                                                        onClick={
                                                            () => {
                                                                handleCreateOrder()
                                                            }
                                                        }
                                                        className="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
                                                    >
                                                        Order
                                                    </button>
                                                </div>

                                            </div>
                                        </div>
                                    </Dialog.Panel>
                                </Transition.Child>
                            </div>
                        </div>
                    </div>
                </Dialog>
            </Transition.Root>
        </>
    )
}