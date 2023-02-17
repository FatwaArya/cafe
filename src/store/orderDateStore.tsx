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
        //new date is the current date with time set to T00:00:00Z
        date: new Date(new Date().setHours(0, 0, 0, 0)),
        setAllOrders: false
    },
    setAllOrders() {
        set((state) => ({ order: { date: undefined, allOrders: true } }))
    },
    setDate(date) {
        set(() => ({ order: { date: date, allOrders: false } }))
    },

}))

