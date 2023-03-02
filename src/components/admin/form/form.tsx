import { Fragment, useEffect, useState } from 'react'
import { Transition } from '@headlessui/react'
import { CheckCircleIcon } from '@heroicons/react/24/outline'
import { XMarkIcon } from '@heroicons/react/20/solid'
import { api } from "../../../utils/api";
import { MENU_TYPE } from "@prisma/client";
import { useRouter } from 'next/router';

type FileType = { file: File; };


export default function MenuForm() {
    const [previewAttachments, setPreviewAttachments] = useState<FileType[]>([])
    const router = useRouter();
    const { id } = router.query;
    const { data: menu } = api.admin.getMenuById.useQuery({ id: id as string, })
    const [menuName, setMenuName] = useState<string>("");
    const [menuPrice, setMenuPrice] = useState<string>("");
    const [menuDescription, setMenuDescription] = useState<string>("");
    const [menuType, setMenuType] = useState<MENU_TYPE>(MENU_TYPE.FOOD);
    const [show, setShow] = useState(false)
    //router query
    useEffect(() => {
        if (menu) {
            setMenuName(menu.name);
            setMenuPrice(menu.price);
            setMenuDescription(menu.desc as string);
            setMenuType(menu.type);
        }
    }, [menu])

    const createMenu = api.admin.createMenu.useMutation(
        {
            onError: (error) => {
                console.log(error);
            },
            onSuccess: () => {
                router.push("/admin/menu");

            }
        }
    )
    const updateMenu = api.admin.updateMenu.useMutation(
        {
            onError: (error) => {
                console.log(error);
            },
            onSuccess: () => {
                //redirect to menu page
                router.push("/admin/menu");
            }
        }
    )

    const presignedUrls = api.admin.createPresignedUrl.useQuery(
        {
            count: previewAttachments.length,
        },
        {
            enabled: previewAttachments.length > 0,
        }
    );

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newPreviewAttachments = [];
            for (const file of e.target.files) {
                newPreviewAttachments.push({ file });
            }
            setPreviewAttachments([
                ...previewAttachments,
                ...newPreviewAttachments,
            ])
        }
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const uploads: { key: string; ext: string }[] = [];

        if (previewAttachments.length && presignedUrls.data) {
            for (let i = 0; i < previewAttachments.length; i++) {
                const previewAttachment = previewAttachments[i];
                const data = presignedUrls.data[i];
                if (previewAttachment && data && data.key && data.url) {
                    const { file } = previewAttachment;

                    await fetch(data.url, {
                        method: "PUT",
                        body: file,
                    });

                    uploads.push({
                        key: data.key,
                        ext: file.name.split(".").pop() as string,
                    });
                }

            }
        }
        if (menu) {
            updateMenu.mutate({
                id: menu.id,
                name: menuName,
                menuPrice,
                menuDescription,
                menuType,
                files: uploads,
            })
        }
        else {
            createMenu.mutate({
                name: menuName,
                menuPrice,
                menuDescription,
                menuType,
                files: uploads,
            })

        }
    }
    console.log(menuName)



    return (
        <>
            {/* Global notification live region, render this permanently at the end of the document */}
            <div
                aria-live="assertive"
                className="fixed inset-0 flex items-end px-4 py-6 pointer-events-none sm:p-6 sm:items-start"
            >
                <div className="w-full flex flex-col items-center space-y-4 sm:items-end">
                    {/* Notification panel, dynamically insert this into the live region when it needs to be displayed */}
                    <Transition
                        show={show}
                        as={Fragment}
                        enter="transform ease-out duration-300 transition"
                        enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
                        enterTo="translate-y-0 opacity-100 sm:translate-x-0"
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden">
                            <div className="p-4">
                                <div className="flex items-start">
                                    <div className="flex-shrink-0">
                                        <CheckCircleIcon className="h-6 w-6 text-green-400" aria-hidden="true" />
                                    </div>
                                    <div className="ml-3 w-0 flex-1 pt-0.5">
                                        <p className="text-sm font-medium text-gray-900">Successfully saved!</p>
                                        <p className="mt-1 text-sm text-gray-500">
                                            New menu has been created!
                                        </p>
                                    </div>
                                    <div className="ml-4 flex-shrink-0 flex">
                                        <button
                                            className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                            onClick={() => {
                                                setShow(false)
                                            }}
                                        >
                                            <span className="sr-only">Close</span>
                                            <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Transition>
                </div>
            </div>
            <form className="space-y-8 divide-y divide-gray-200" onSubmit={handleSubmit}>
                <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">

                    <div className="pt-4 space-y-6 sm:pt-10 sm:space-y-5">
                        <div>
                            <h3 className="text-lg leading-6 font-medium text-gray-900">{
                                id === "new" ? "Create new menu" : "Edit menu"
                            }</h3>
                            <p className="mt-1 max-w-2xl text-sm text-gray-500">
                                Menu information and details.
                            </p>
                        </div>
                        <div className="space-y-6 sm:space-y-5">
                            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                                <label htmlFor="first-name" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                    Menu name
                                </label>
                                <div className="mt-1 sm:mt-0 sm:col-span-2">
                                    <input
                                        type="text"
                                        name="menu-name"
                                        id="menu-name"
                                        onChange={(e) => setMenuName(e.target.value)}
                                        value={menuName}
                                        // required
                                        className="max-w-lg block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
                                    />
                                </div>
                            </div>

                            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                                <label htmlFor="price" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                    Price
                                </label>
                                <div className="relative mt-1 sm:mt-0 sm:col-span-2">

                                    <input
                                        id="price"
                                        name="price"
                                        type="number"
                                        inputMode="numeric"
                                        min={0}
                                        // required
                                        className="max-w-lg block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
                                        placeholder="0.00"
                                        onChange={(e) => setMenuPrice(e.target.value)}
                                        value={menuPrice}
                                    />

                                </div>
                            </div>



                            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                                <label htmlFor="food-type" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                    Menu type
                                </label>
                                <div className="mt-1 sm:mt-0 sm:col-span-2">
                                    <select
                                        id="food-type"
                                        name="food-type"
                                        autoComplete="food-type"
                                        onChange={(e) => setMenuType(e.target.value as MENU_TYPE)}
                                        value={menuType}
                                        // required
                                        className="max-w-lg block focus:ring-indigo-500 focus:border-indigo-500 w-full shadow-sm sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
                                    >
                                        <option value={MENU_TYPE.FOOD}>Food</option>
                                        <option value={MENU_TYPE.BEVERAGE}>Beverage</option>
                                    </select>
                                </div>
                            </div>

                            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                                <label htmlFor="about" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                    Menu description
                                </label>
                                <div className="mt-1 sm:mt-0 sm:col-span-2">
                                    <textarea
                                        id="description"
                                        name="description"
                                        rows={3}
                                        className="max-w-lg shadow-sm block w-full focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border border-gray-300 rounded-md"
                                        onChange={(e) => setMenuDescription(e.target.value)}
                                        value={menuDescription}
                                    />
                                    <p className="mt-2 text-sm text-gray-500">Write a few sentences about the food.</p>
                                </div>
                            </div>

                        </div>
                    </div>
                    <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                        <label htmlFor="cover-photo" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                            Menu photo
                        </label>
                        <div className="mt-1 sm:mt-0 sm:col-span-2">
                            <div className="max-w-lg flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                <div className="space-y-1 text-center">
                                    <svg
                                        className="mx-auto h-12 w-12 text-gray-400"
                                        stroke="currentColor"
                                        fill="none"
                                        viewBox="0 0 48 48"
                                        aria-hidden="true"
                                    >
                                        <path
                                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                            strokeWidth={2}
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                    <div className="flex text-sm text-gray-600">
                                        <label
                                            htmlFor="file-upload"
                                            className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                                        >
                                            <span>Upload a file</span>
                                            <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={onFileChange} />

                                        </label>
                                        <p className="pl-1">or drag and drop</p>
                                    </div>
                                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                <div className="pt-5">
                    <div className="flex justify-end">
                        <button
                            type="button"
                            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"

                            className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Save
                        </button>
                    </div>
                </div>
            </form>
        </>
    )
}