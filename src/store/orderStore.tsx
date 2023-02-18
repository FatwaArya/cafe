import { create } from 'zustand'

export interface Items {
    id: string
    name: string
    price: string
    image: string
    desc: string
    type: string
    quantity: number
}

interface orderState {
    items: Items[]
    addItems: (item: Items) => void
    removeItems: (item: Items) => void
    clearItems: () => void

}

export const useOrderStore = create<orderState>()((set) => ({
    items: [],
    addItems: (item) => set((state) => (
        //add item to cart if it's not already in the cart and set quantity to 1
        //if it is in the cart, increase the quantity by 1
        {
            items: state.items.some((i) => i.id === item.id)
                ? state.items.map((i) => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i)
                : [...state.items, { ...item, quantity: 1 }]
        }
    )),
    removeItems: (item) => set((state) => (
        //remove item from cart if it's quantity is 1
        //if it's quantity is more than 1, decrease the quantity by 1
        {
            items: state.items.some((i) => i.id === item.id && i.quantity > 1)
                ? state.items.map((i) => i.id === item.id ? { ...i, quantity: i.quantity - 1 } : i)
                : state.items.filter((i) => i.id !== item.id)
        }
    )),
    clearItems: () => set(() => ({ items: [] })),
}))
