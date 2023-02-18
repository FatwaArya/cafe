import { ReactElement } from "react";
import CashierLayout from "../../components/cashier/layout/cashierLayout";
import { WikuPage } from "../_app";
import ItemList from "../../components/cashier/items/itemList";
import Head from "next/head";
import { GetServerSidePropsContext } from "next";
import { roleGuard } from "../../utils/roleGuard";


const NewOrder: WikuPage = () => {
    return (
        <>
            <Head>
                <title>Cashier | New Order</title>
            </Head>
            <ItemList />
        </>
    )
}


NewOrder.getLayout = function getLayout(page: ReactElement) {
    return <CashierLayout>{page}</CashierLayout>
};

NewOrder.authRequired = true;

export default NewOrder

//prevent other roles from accessing this page

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
    return roleGuard(ctx, (session: any) => ({
        props: {
            session,
        },
    }), "cashier")
}





