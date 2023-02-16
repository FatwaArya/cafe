
import { ReactElement } from "react";
import CashierLayout from "../../components/cashier/layout/cashierLayout";
import { WikuPage } from "../_app";
import TransactionTable from "../../components/cashier/table/transactionTable";
import Head from "next/head";

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
Cashier.role = "cashier";


export default Cashier
