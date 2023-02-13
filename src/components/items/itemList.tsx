
import { StarIcon } from '@heroicons/react/24/solid'
import { api } from '../../utils/api'
import Image from 'next/image'
import { Fragment, useState } from 'react'
import { Dialog, Transition, Listbox } from '@headlessui/react'
import { XMarkIcon, CheckIcon, ChevronUpDownIcon } from '@heroicons/react/24/outline'


function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

interface Items {
    id: string
    name: string
    price: string
    image: string
    desc: string
    type: string
    quantity: number
}

export default function ItemList() {
    const { data: items } = api.cashier.getsMenu.useQuery()
    const { data: tables } = api.cashier.getsTable.useQuery()

    //track the selected item
    const [selectedItem, setSelectedItem] = useState<Items[]>([])
    const [open, setOpen] = useState(false)
    const [customerName, setCustomerName] = useState('')
    const [selected, setSelected] = useState(tables?.[0])


    //if product is already in cart, increase quantity
    const handleAddToCart = (item: Items) => {
        const isItemInCart = selectedItem.find((cartItem) => cartItem.id === item.id)
        if (isItemInCart) {
            setSelectedItem(
                selectedItem.map((cartItem) =>
                    cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
                )
            )
        } else {
            setSelectedItem([...selectedItem, { ...item, quantity: 1 }])
        }
    }

    //remove item from cart
    const handleRemoveFromCart = (id: string) => {
        //remove only one item
        const isItemInCart = selectedItem.find((cartItem) => cartItem.id === id)
        if (isItemInCart?.quantity === 1) {
            setSelectedItem(selectedItem.filter((cartItem) => cartItem.id !== id))
        }
        //remove all items
        if (isItemInCart?.quantity! > 1) {
            setSelectedItem(
                selectedItem.map((cartItem) =>
                    cartItem.id === id ? { ...cartItem, quantity: cartItem.quantity - 1 } : cartItem
                )
            )
        }
    }

    //calculate total price
    const calculateTotalPrice = () => {
        return selectedItem.reduce((ack: number, item) => ack + item.quantity * parseInt(item.price), 0)
    }
    const total = calculateTotalPrice()

    const createOrder = api.cashier.createOrder.useMutation({
        onSuccess: () => {
            setSelectedItem([])
            setOpen(false)
        }
    })

    const handleCreateOrder = () => {
        //extract the id 
        const order = selectedItem.map((item) => ({
            menuId: item.id,
            quantity: item.quantity,
        }))

        createOrder.mutate({
            items: order,
            customerName: customerName,
            tableId: selected?.id as string,

        })
    }


    return (
        <>

            <div className="bg-white flex flex-col">
                <div className='flex-end mb-3'>
                    <button
                        onClick={() => setOpen(true)}
                        disabled={selectedItem.length === 0}
                        type="button"
                        //change the color of the button if there is no item in cart
                        className={classNames(selectedItem.length === 0 ? 'bg-gray-300' : 'bg-indigo-600', 'px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500  float-right')}
                    >
                        open cart
                    </button>
                </div>

                <div className="max-w-7xl mx-auto overflow-hidden ">
                    <h2 className="sr-only">Products</h2>

                    <div className="-mx-px border-l border-t border-gray-200 grid grid-cols-2 sm:mx-0 md:grid-cols-3 lg:grid-cols-5 ">
                        {items?.map((product) => (
                            <div key={product.id} className="group relative p-4 border-r border-b border-gray-200 sm:p-6 ">
                                <div className="rounded-lg overflow-hidden bg-gray-200 aspect-w-1 aspect-h-1 ">
                                    <Image
                                        src={product.image || ""}
                                        alt={product.desc || ""}
                                        className="w-full h-full object-center object-cover"
                                        width={100}
                                        height={100}
                                    />
                                </div>
                                <div className="pt-4 pb-4 text-left">
                                    <h3 className="text-sm font-medium text-gray-900">
                                        {product.name}
                                    </h3>
                                    <div className="flex justify-between">
                                        <p className="mt-4 text-base font-medium text-gray-900">{
                                            new Intl.NumberFormat('id-ID', {
                                                style: 'currency',
                                                currency: 'IDR',
                                            }).format(parseInt(product.price))
                                        }</p>
                                        <p className="mt-4 text-base  text-gray-900  font-normal ">{product.type}</p>
                                    </div>


                                </div>
                                <button
                                    onClick={() => {
                                        //apppend the selected item id to the cart
                                        handleAddToCart(product as Items)
                                    }}
                                    type="button"
                                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 float-right "
                                >
                                    Add item
                                </button>
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
                                                    <Dialog.Title className="text-lg font-medium text-gray-900">Shopping cart</Dialog.Title>
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
                                                            {selectedItem.map((product) => (
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
                                                                                        handleRemoveFromCart(product.id)
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
                                                        Checkout
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