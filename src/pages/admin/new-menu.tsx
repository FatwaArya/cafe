import { signOut } from "next-auth/react";
import { WikuPage } from "../_app";
import { ReactElement, useRef, useState } from "react";
import { roleGuard } from "../../utils/roleGuard";
import AdminLayout from "../../components/admin/layout/adminLayout";
import { GetServerSidePropsContext } from "next";
import Head from "next/head";
import { api } from "../../utils/api";
import { PhotoIcon } from "@heroicons/react/24/outline";
import Image from "next/image";


type FileType = { file: File; };

const NewMenu: WikuPage = () => {
    const ref = useRef<HTMLInputElement>(null)
    const [previewAttachments, setPreviewAttachments] = useState<FileType[]>([])

    const createMenu = api.admin.createMenu.useMutation(
        {
            onSuccess: () => {
                setPreviewAttachments([]);
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
            ]);
        }
    }
    const createPost = async () => {
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
        createMenu.mutate({
            files: uploads,
        })
    }



    return (
        <>
            <Head>
                <title>Admin | Overview</title>
            </Head>
            <div className="px-4 sm:px-6 lg:px-8">
                {/*  uplload */}
                <input
                    ref={ref}
                    className="hidden"
                    type="file"
                    onChange={onFileChange}
                    multiple />
                {/*  */}
                <button
                    onClick={() => ref.current?.click()}
                    className="rounded-full bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-blue-500"
                >
                    <PhotoIcon className="w-6 h-6 text-gray-400" />
                </button>
                <button onClick={() => { void createPost() }}>
                    upload
                </button>

            </div>


        </>
    )
}

export default NewMenu



NewMenu.getLayout = function getLayout(page: ReactElement) {
    return <AdminLayout>{page}</AdminLayout>
};
NewMenu.authRequired = true;
export async function getServerSideProps(ctx: GetServerSidePropsContext) {
    return roleGuard(ctx, (session: any) => ({
        props: {
            session,
        },
    }), "admin")
}
