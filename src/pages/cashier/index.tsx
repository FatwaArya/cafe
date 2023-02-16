
import { ReactElement } from "react";
import CashierLayout from "../../components/layouts/cashierLayout";
import { WikuPage } from "../_app";
import TransactionTable from "../../components/cashier/table/transactionTable";

const Cashier: WikuPage = () => {

    return (
        <>
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
