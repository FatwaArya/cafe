
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js';
import { useEffect, useState, } from 'react';
import { Pie } from 'react-chartjs-2';
import { useOrderDateStore } from '../../../store/orderDateStore';
import { api } from '../../../utils/api';
import { Loader } from '../../auth/AuthGuard';

ChartJS.register(ArcElement, Tooltip, Legend);

interface IStats {
    name: string | undefined;
    quantity: number | null | undefined;
    createdAt: Date | undefined;
}


export default function MenuChart() {
    const startDate = useOrderDateStore(state => state.order.date)
    const newStartDate = new Date(startDate?.toISOString().slice(0, 10) + 'T00:00:00.000Z').toISOString()
    const { data: stats, status } = api.manager.getStatistic.useQuery({ date: newStartDate })
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
        const newFilteredAllTime = stats?.reduce((acc: IStats[], cur: IStats) => {
            const index = acc.findIndex((item) => item.name === cur.name)
            if (index === -1) {
                acc.push(cur)
            } else {
                let quantity = acc?.[index]?.quantity as number
                quantity += cur.quantity as number
            }
            return acc
        }, [])

        const sortedByDate = stats?.filter((stat) => {
            const date = stat.createdAt
            return date?.getDate() === startDate?.getDate() && date?.getMonth() === startDate?.getMonth() && date?.getFullYear() === startDate?.getFullYear()
        })

        const newFilteredByDate = sortedByDate?.reduce((acc: IStats[], cur: IStats) => {
            const index = acc.findIndex((item) => item.name === cur.name)
            if (index === -1) {
                acc.push(cur)
            } else {
                let quantity = acc?.[index]?.quantity as number
                quantity += cur.quantity as number
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
            setFilteredStats(newFilteredByDate)
            setChartData({
                labels: newFilteredByDate?.map((menu) => menu.name),
                datasets: [
                    {
                        label: 'Number of Orders',
                        data: newFilteredByDate?.map((menu) => menu.quantity),
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
    console.log(newStartDate)

    if (status === "loading") { return <Loader /> }

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


