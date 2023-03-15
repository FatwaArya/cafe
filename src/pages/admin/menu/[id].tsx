import { GetServerSidePropsContext } from "next";
import AdminLayout from "../../../components/admin/layout/adminLayout";
import { roleGuard } from "../../../utils/roleGuard";
import { WikuPage } from "../../_app";
import { ReactElement, useEffect, useState } from "react";
import MenuForm from "../../../components/admin/form/form";
import Head from "next/head";
import { useRouter } from "next/router";

const EditMenu: WikuPage = () => {
    const [isNew, setIsNew] = useState(false)
    const router = useRouter()
    const { id } = router.query;
    //if id is new, then set isNew to true
    useEffect(() => {
        if (id === "new") {
            setIsNew(true)
        }
    }, [id])


    return (
        <>
            <Head>
                <title>Admin | {
                    isNew ? "Add New" : "Edit"
                } Products</title>
            </Head>
            <MenuForm />
        </>
    )
}


export default EditMenu

EditMenu.getLayout = function getLayout(page: ReactElement) {
    return <AdminLayout>{page}</AdminLayout>
};
EditMenu.authRequired = true;
export async function getServerSideProps(ctx: GetServerSidePropsContext) {
    return roleGuard(ctx, (session: any) => ({
        props: {
            session,
        },
    }), "admin")
}
