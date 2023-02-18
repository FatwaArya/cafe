import { create } from 'zustand'



interface orderDateState {
    order: {
        date?: Date
        allOrders?: Boolean
    }
    setDate: (date: Date) => void
    setAllOrders: () => void
}

export const useOrderDateStore = create<orderDateState>()((set) => ({
    order: {
        date: new Date(),
        setAllOrders: false
    },
    setAllOrders() {
        set((state) => ({ order: { date: undefined, allOrders: true } }))
    },
    setDate(date) {
        set(() => ({ order: { date: date, allOrders: false } }))
    },

}))

