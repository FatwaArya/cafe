
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { api } from '../../../utils/api';
import { useEffect, useState, useMemo } from 'react';
import { useOrderDateStore } from '../../../store/orderDateStore';
ChartJS.register(ArcElement, Tooltip, Legend);

interface IStats {
    name: string
    quantity: number
    createdAt: Date
}


export default function MenuChart() {
    const startDate = useOrderDateStore(state => state.order.date)

    const newStartDate = startDate?.toISOString() as string
    const { data: stats } = api.manager.getStatistic.useQuery(
        { date: newStartDate },
    )
    const allTime = useOrderDateStore(state => state.order.allOrders)
    const [filteredStats, setFilteredStats] = useState(stats)


    // useEffect(() => {
    //     const sortedByDate = stats?.filter((stat) => {
    //         const date = stat.createdAt
    //         return date?.getDate() === startDate?.getDate() && date?.getMonth() === startDate?.getMonth() && date?.getFullYear() === startDate?.getFullYear()
    //     })
    //     const newFiltered = sortedByDate?.reduce((acc: any[], cur) => {
    //         const existingItem = acc.find((item) => item.name === cur.name)
    //         if (existingItem) {
    //             existingItem.quantity += cur.quantity
    //         } else {
    //             acc.push(cur)
    //         }
    //         return acc
    //     }, [])


    //     return stats?.reduce((acc: any[], cur) => {
    //         const index = acc.findIndex((item) => item.name === cur.name)
    //         if (index === -1) {
    //             acc.push(cur)
    //         } else {
    //             acc[index].quantity += cur.quantity
    //         }
    //         return acc
    //     }, [])


    // }, [startDate, stats, allTime]);

    useEffect(() => {
        const sorted = stats?.filter((stat) => {
            const date = stat.createdAt
            return date?.getDate() === startDate?.getDate() && date?.getMonth() === startDate?.getMonth() && date?.getFullYear() === startDate?.getFullYear()
        })

        const newFilteredByDate = sorted?.reduce((acc: any[], cur) => {
            const existingItem = acc.find((item) => item.name === cur.name)
            if (existingItem) {
                existingItem.quantity += cur.quantity
            } else {
                acc.push(cur)
            }
            return acc
        }, [])

        const newFilteredAllTime = stats?.reduce((acc: any[], cur) => {
            const index = acc.findIndex((item) => item.name === cur.name)
            if (index === -1) {
                acc.push(cur)
            } else {
                acc[index].quantity += cur.quantity
            }
            return acc
        }, [])

        if (allTime) {
            setFilteredStats(newFilteredAllTime)
        } else {
            setFilteredStats(sorted)
        }
    }, [startDate, stats, allTime])


    console.log(filteredStats)
    const data = {
        labels: filteredStats?.map((menu) => menu.name),
        datasets: [
            {
                label: 'Number of Orders',
                data: filteredStats?.map((menu) => menu.quantity),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                ],
                borderWidth: 1,
            }
        ]
    }



    return (<>
        {filteredStats && <Pie data={data} />}

    </>)
}


