
import { Chart as ChartJS, ArcElement, Tooltip, Legend, layouts } from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import { RouterOutputs, api } from '../../../utils/api';
import { useEffect, useMemo, useState, } from 'react';
import { useOrderDateStore } from '../../../store/orderDateStore';

ChartJS.register(ArcElement, Tooltip, Legend);



type Stats = RouterOutputs['manager']['getStatistic'][0]


export default function MenuChart() {
    const startDate = useOrderDateStore(state => state.order.date)
    const { data: stats } = api.manager.getStatistic.useQuery()
    const allTime = useOrderDateStore(state => state.allOrders)
    const today = new Date()
    const [sales, setSales] = useState("0")

    const [chartData, setChartData] = useState({
        labels: stats?.map((menu) => menu.menuName),
        datasets: [
            {
                label: 'Number of Orders',
                data: stats?.map((menu) => menu._sum.quantity),
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
        //make reducer to filter the data if id is the same then merge the data
        const merged = stats?.reduce((acc: any, curr: any) => {
            const found = acc.find((item: any) => item.menuId === curr.menuId);
            if (!found) {
                return acc.concat([curr]);
            } else {
                return acc.map((item: any) => (item.menuId === curr.menuId ? { ...item, _sum: { quantity: item._sum.quantity + curr._sum.quantity } } : item));
            }
        }, []);
        const filtered = stats?.filter((stat: { createdAt: Date; }) => {
            const date = stat.createdAt
            return date?.getDate() === startDate?.getDate() && date?.getMonth() === startDate?.getMonth() && date?.getFullYear() === startDate?.getFullYear()
        }).reduce((acc: any, curr: any) => {
            const found = acc.find((item: any) => item.menuId === curr.menuId);
            if (!found) {
                return acc.concat([curr]);
            } else {
                return acc.map((item: any) => (item.menuId === curr.menuId ? { ...item, _sum: { quantity: item._sum.quantity + curr._sum.quantity } } : item));
            }
        }, []);
        if (allTime) {
            setSales(merged?.reduce((acc: number, curr: { _sum: { quantity: any; }; menuPrice: number; }) => acc + curr?._sum?.quantity! * curr.menuPrice as any, 0).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' }))
            setChartData({
                labels: merged?.map((menu: Stats) => menu.menuName),
                datasets: [
                    {
                        label: 'Number of Orders',
                        data: merged?.map((menu: Stats) => menu._sum.quantity),
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
        else {
            setSales(filtered?.reduce((acc: number, curr: { _sum: { quantity: any; }; menuPrice: number; }) => acc + curr?._sum?.quantity! * curr.menuPrice as any, 0).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' }))
            setChartData({
                labels: filtered?.map((menu: Stats) => menu.menuName),
                datasets: [
                    {
                        label: 'Number of Orders',
                        data: filtered?.map((menu: Stats) => menu._sum.quantity),
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

                    }]
            })
        }

    }, [startDate, allTime, stats])

    return (<>
        {chartData && <>
            <div className="px-4 sm:px-6 lg:px-8 mt-4 min-h-screen">
                <div className="sm:flex sm:items-center">
                    <div className="sm:flex-auto">
                        <h1 className="text-xl font-semibold text-gray-900">
                            {
                                allTime
                                    ? "All time sales" + " - IDR " + sales
                                    : startDate?.toDateString() === today.toDateString()
                                        ? "Today sales - IDR " + sales
                                        : startDate?.toLocaleDateString() + " sales - IDR " + sales
                            }
                        </h1>
                        <p className="text-sm text-gray-700">
                            A list of all the orders presented in a chart.
                        </p>
                    </div>
                </div>


                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 mt-2">
                    {//if charData is empty then show the message
                        chartData?.labels?.length === 0 ? <div className="flex justify-center items-center col-span-2">
                            <p className="text-lg text-gray-700">No data to show</p>
                        </div> : <div className=" border rounded-md p-3 col-span-2 h-96">
                            <Pie data={chartData} options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: {
                                        display: true,
                                        position: 'right',
                                    },
                                },

                            }} />
                        </div>
                    }


                </div>
            </div>

        </>}
    </>)
}


