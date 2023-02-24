
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

interface IOrderSummary {
    _sum: {
        quantity: number;
    };
    _count: {
        id: number;
    };
    menuId: string;
    createdAt: string;
    menuName: string;
}


export default function MenuChart() {
    const startDate = useOrderDateStore(state => state.order.date)
    const { data: stats } = api.manager.getStatistic.useQuery()
    const allTime = useOrderDateStore(state => state.allOrders)
    const [filteredStats, setFilteredStats] = useState(stats)

    // console.log(filteredStats)

    // useEffect(() => {
    //     if (allTime) {
    //         setFilteredStats(stats)
    //     } else {
    //         console.log(startDate)
    //         const filtered = stats?.filter((stat) => {
    //             const date = stat.createdAt
    //             return date?.getDate() === startDate?.getDate() && date?.getMonth() === startDate?.getMonth() && date?.getFullYear() === startDate?.getFullYear()
    //         })
    //         setFilteredStats(filtered)
    //     }
    // }, [startDate, allTime, stats])

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
        if (allTime) {
            setFilteredStats(merged)
        }
        else {
            console.log(startDate)
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

            setFilteredStats(filtered)
        }
    }, [startDate, allTime, stats])





    const chartData = {
        labels: filteredStats?.map((menu) => menu.menuName),
        datasets: [
            {
                label: 'Number of Orders',
                data: filteredStats?.map((menu) => menu._sum.quantity),
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
    }








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


