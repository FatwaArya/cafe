import Image from "next/image";


function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}
export default function Item(
    product: {
        id: string;
        name: string;
        price: string;
        type: string;
        desc: string | null;
        image: string | null;
    }
) {
    return (
        <div key={product.id} className="group relative p-4 border-r border-b border-gray-200 sm:p-6 ">
            <div className="rounded-lg overflow-hidden bg-gray-200 aspect-w-1 aspect-h-1 group-hover:opacity-75">
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
                {/* <div className="mt-3 flex flex-col items-center">
                    <p className="sr-only">{product.rating} out of 5 stars</p>
                    <div className="flex items-center">
                        {[0, 1, 2, 3, 4].map((rating) => (
                            <StarIcon
                                key={rating}
                                className={classNames(
                                    product.rating > rating ? 'text-yellow-400' : 'text-gray-200',
                                    'flex-shrink-0 h-5 w-5'
                                )}
                                aria-hidden="true"
                            />
                        ))}
                    </div>
                    <p className="mt-1 text-sm text-gray-500">{product.reviewCount} reviews</p>
                </div> */}
                <div className="flex justify-between">
                    <p className="mt-4 text-base font-medium text-gray-900">{product.price}</p>
                    <p className="mt-4 text-base  text-gray-900  font-normal  ">{product.type}</p>
                </div>


            </div>
        </div>)
}