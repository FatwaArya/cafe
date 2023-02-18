
import { GetServerSidePropsContext } from "next";
import Head from "next/head";
import { ReactElement } from "react";
import CashierLayout from "../../components/cashier/layout/cashierLayout";
import TransactionTable from "../../components/cashier/table/transactionTable";
import { roleGuard } from "../../utils/roleGuard";
import { WikuPage } from "../_app";

const Cashier: WikuPage = () => {

    return (
        <>
            <Head>
                <title>Cashier | Overview Transaction</title>
                <meta name="description" content="Overview Transaction" />
            </Head>
            <TransactionTable />
        </>
    )
}


Cashier.getLayout = function getLayout(page: ReactElement) {
    return <CashierLayout>{page}</CashierLayout>
};
Cashier.authRequired = true;
export async function getServerSideProps(ctx: GetServerSidePropsContext) {
    return roleGuard(ctx, (session: any) => ({
        props: {
            session,
        },
    }), "cashier")
}



export default Cashier
