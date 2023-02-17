import { GetServerSidePropsContext, NextPage } from "next";
import { signOut } from "next-auth/react";
import { WikuPage } from "../_app";
import ManagerLayout from "../../components/manager/layout/managerLayout";
import { ReactElement } from "react";
import { roleGuard } from "../../utils/roleGuard";
import AllTransactionTable from "../../components/manager/table/transactionTable";
import MenuChart from "../../components/manager/chart/menuChart";
import Head from "next/head";

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










