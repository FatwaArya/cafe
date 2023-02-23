import { create } from 'zustand'



interface orderDateState {
    order: {
        date?: Date
    }
    allOrders: boolean
    toggleTrue: () => void
    toggleFalse: () => void
    setDate: (date: Date) => void
}

export const useOrderDateStore = create<orderDateState>()((set) => ({
    order: {
        date: new Date(),

    },
    allOrders: false,
    toggleTrue: () => set((state) => ({
        allOrders: true
    })),
    toggleFalse: () => set((state) => ({
        allOrders: false
    })),
    setDate(date) {
        set(() => ({ order: { date: date } }))
    },

}))

