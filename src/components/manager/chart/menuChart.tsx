
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { api } from '../../../utils/api';
import { useEffect, useState, } from 'react';
import { useOrderDateStore } from '../../../store/orderDateStore';

ChartJS.register(ArcElement, Tooltip, Legend);

interface IStats {
    name: string
    quantity: number
    createdAt: Date
}


export default function MenuChart() {
    const startDate = useOrderDateStore(state => state.order.date)
    const newStartDate = startDate?.toISOString() || undefined
    const { data: stats } = api.manager.getStatistic.useQuery({ date: newStartDate })
    console.log(newStartDate)
    const allTime = useOrderDateStore(state => state.order.allOrders)
    const [filteredStats, setFilteredStats] = useState(stats)
    const [chartData, setChartData] = useState({
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
                borderWidth: 2,
            }
        ]
    })

    useEffect(() => {
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
            setChartData({
                labels: newFilteredAllTime?.map((menu) => menu.name),
                datasets: [
                    {
                        label: 'Number of Orders',
                        data: newFilteredAllTime?.map((menu) => menu.quantity),
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
                        borderWidth: 2,
                    }
                ]
            })
        } else {
            setFilteredStats(stats)
            setChartData({
                labels: stats?.map((menu) => menu.name),
                datasets: [
                    {
                        label: 'Number of Orders',
                        data: stats?.map((menu) => menu.quantity),
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
                        borderWidth: 2,
                    }
                ]
            })
        }
    }, [startDate, stats, allTime])


    return (<>
        {filteredStats && <>
            <div className="px-4 sm:px-6 lg:px-8 mt-4 min-h-screen">
                <div className="sm:flex sm:items-center">
                    <div className="sm:flex-auto">
                        <h1 className="text-xl font-semibold text-gray-900">Analytics</h1>
                        <p className="text-sm text-gray-700">
                            A list of all the orders presented in a chart.
                        </p>
                    </div>
                </div>

                <div className="flex justify-center  w-full mt-4">
                    <div className="w-96">
                        <Pie data={chartData} />

                    </div>
                </div>


                {chartData.labels?.map((label, index) => {
                    //sort the data in descending order
                    const sortedData = chartData?.datasets?.[0]?.data?.sort((a: any, b: any) => b - a) || []
                    return <div key={index} className="flex justify-between">
                        <p className="text-sm text-gray-700">{label}</p>
                        <p className="text-sm text-gray-700">{sortedData[index]}</p>
                    </div>

                })}
            </div>

        </>}
    </>)
}


