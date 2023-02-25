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
import MenuForm from "../../components/admin/form/form";



const NewMenu: WikuPage = () => {



    return (
        <>
            <Head>
                <title>Admin | Add New Products</title>
            </Head>

            <MenuForm />


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
