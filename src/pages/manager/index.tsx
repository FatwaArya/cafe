import { GetServerSidePropsContext } from "next";
import Head from "next/head";
import { ReactElement } from "react";
import MenuChart from "../../components/manager/chart/menuChart";
import ManagerLayout from "../../components/manager/layout/managerLayout";
import AllTransactionTable from "../../components/manager/table/transactionTable";
import { roleGuard } from "../../utils/roleGuard";
import { WikuPage } from "../_app";

const Manager: WikuPage = () => {

    return (
        <>
            <Head>
                <title>Manager | Overview</title>
            </Head>
            <AllTransactionTable />
            <MenuChart />
        </>
    )
}

Manager.getLayout = function getLayout(page: ReactElement) {
    return <ManagerLayout>{page}</ManagerLayout>
};
Manager.authRequired = true;

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
    return roleGuard(ctx, (session: any) => ({
        props: {
            session,
        },
    }), "manager")
}

export default Manager










