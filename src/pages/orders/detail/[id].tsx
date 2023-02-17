import { useRouter } from "next/router";
import { WikuPage } from "../../_app";
import DetailTransactionTable from "../../../components/cashier/table/detailTransactionTable";
import CashierLayout from "../../../components/cashier/layout/cashierLayout";
import { ReactElement } from "react";
import Head from "next/head";
import { GetServerSidePropsContext } from "next";
import { roleGuard } from "../../../utils/roleGuard";


const DetailOrder: WikuPage = () => {
    const router = useRouter();
    const { id } = router.query;
    return (
        <>
            <Head>
                <title>Detail Order</title>
            </Head>
            <DetailTransactionTable id={id as string} />
        </>
    )
}

DetailOrder.authRequired = true;

// export async function getServerSideProps(ctx: GetServerSidePropsContext) {
//     return roleGuard(ctx, (session: any) => ({
//         props: {
//             session,
//         },
//     }), "cashier")
// }


export default DetailOrder