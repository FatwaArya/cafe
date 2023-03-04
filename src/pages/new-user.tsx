import { GetServerSidePropsContext } from "next";
import { WikuPage } from "./_app";
import { roleGuard } from "../utils/roleGuard";
import { useState } from "react";
import { FileType } from "../components/admin/form/form";
import { api } from "../utils/api";
import { useRouter } from "next/router";
import { getServerAuthSession } from "../server/auth";

const NewUser: WikuPage = () => {
    const [name, setName] = useState("");
    const [previewAttachments, setPreviewAttachments] = useState<FileType[]>([])
    const router = useRouter();
    const updateProfile = api.cashier.updateProfile.useMutation(
        {
            onSuccess: () => {
                router.push("/cashier")
            }
        }
    );
    const presignedUrls = api.cashier.createPresignedUrl.useQuery(
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
        updateProfile.mutate({
            name,
            files: uploads,
        })
    }


    return (
        <> <div className="h-screen bg-gray-50">
            <div className="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-md">

                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Welcome Abroad!</h2>
                    <p className="mt-2 text-center text-sm text-gray-600 font-medium hover:text-indigo-500">
                        tell us your name, so we can get you started
                    </p>
                </div>

                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                    Name
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="name"
                                        name="name"
                                        type="name"
                                        autoComplete="name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    />
                                </div>
                            </div>
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
                                                <span>Upload your best profile picture right here!</span>
                                                <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={onFileChange} />

                                            </label>
                                        </div>
                                        <p className="text-xs text-gray-500">PNG, JPG, JPEG up to 10MB</p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Get started
                                </button>
                            </div>
                        </form>


                    </div>
                </div>
            </div>
        </div>

        </>
    )
}
NewUser.authRequired = true;

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
    //this page is only accessible to new users who have not yet completed their profile
    const session = await getServerAuthSession(ctx);
    if (session) {
        if (session.user?.name) {
            return {
                redirect: {
                    destination: "/cashier",
                    permanent: false,
                },
            }
        }
    }


}


export default NewUser

