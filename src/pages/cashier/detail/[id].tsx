import { useRouter } from "next/router";
import { WikuPage } from "../../_app";
import DetailTransactionTable from "../../../components/cashier/table/detailTransactionTable";
import CashierLayout from "../../../components/cashier/layout/cashierLayout";
import { ReactElement } from "react";
import Head from "next/head";


const DetailOrder: WikuPage = () => {
    const router = useRouter();
    const { id } = router.query;
    return (
        <>
            <Head>
                <title>Cashier | Detail Order</title>
            </Head>
            <DetailTransactionTable id={id as string} />
        </>
    )
}

DetailOrder.authRequired = true;
DetailOrder.role = "cashier";

export default DetailOrder