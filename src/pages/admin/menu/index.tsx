import { signOut } from "next-auth/react";
import { ReactElement, useRef, useState } from "react";

import { GetServerSidePropsContext } from "next";
import Head from "next/head";

import { PhotoIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { WikuPage } from "../../_app";
import MenuTable from "../../../components/admin/table/menuTable";
import AdminLayout from "../../../components/admin/layout/adminLayout";
import { roleGuard } from "../../../utils/roleGuard";




const Menu: WikuPage = () => {



    return (
        <>
            <Head>
                <title>Admin | Add New Products</title>
            </Head>

            {/* <MenuForm /> */}
            <MenuTable />


        </>
    )
}

export default Menu



Menu.getLayout = function getLayout(page: ReactElement) {
    return <AdminLayout>{page}</AdminLayout>
};
Menu.authRequired = true;
export async function getServerSideProps(ctx: GetServerSidePropsContext) {
    return roleGuard(ctx, (session: any) => ({
        props: {
            session,
        },
    }), "admin")
}
