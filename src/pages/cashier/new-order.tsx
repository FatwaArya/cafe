import { signOut } from "next-auth/react";
import { GetServerSidePropsContext } from "next";
import { getServerAuthSession } from "../../server/auth";
import { roleGuard } from "../../utils/guard";
import { ReactElement } from "react";
import CashierLayout from "../../components/layouts/cashierLayout";
import { NextPageWithLayout } from "../_app";
import ItemList from "../../components/items/itemList";
import Head from "next/head";


const NewOrder: NextPageWithLayout = () => {
    return (
        <>
            <Head>
                <title>New Order</title>

            </Head>
            <ItemList />
        </>
    )
}


NewOrder.getLayout = function getLayout(page: ReactElement) {
    return <CashierLayout>{page}</CashierLayout>
};


export default NewOrder

//prevent other roles from accessing this page

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
    return roleGuard(ctx, (session: any) => ({
        props: {
            session,
        },
    }), "cashier")
}





