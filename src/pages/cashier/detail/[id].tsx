import { useRouter } from "next/router";
import { WikuPage } from "../../_app";
import DetailTransactionTable from "../../../components/cashier/table/detailTransactionTable";
import CashierLayout from "../../../components/layouts/cashierLayout";
import { ReactElement } from "react";


const DetailOrder: WikuPage = () => {
    const router = useRouter();
    const { id } = router.query;
    return (
        <>
            <DetailTransactionTable id={id as string} />
        </>
    )
}

DetailOrder.authRequired = true;
DetailOrder.role = "cashier";

export default DetailOrder