import { signOut } from "next-auth/react";
import { WikuPage } from "../_app";
import { ReactElement } from "react";
import { roleGuard } from "../../utils/roleGuard";
import AdminLayout from "../../components/admin/layout/adminLayout";
import { GetServerSidePropsContext } from "next";
import UsersTable from "../../components/admin/table/usersTable";
import WhitelistTable from "../../components/admin/table/whitelistTable";
import Head from "next/head";
const Admin: WikuPage = () => {
    return (
        <>
            <Head>
                <title>Admin | Overview</title>
            </Head>
            <div className="px-4 sm:px-6 lg:px-8">
                <UsersTable />
                <WhitelistTable />
            </div>
        </>
    )
}

export default Admin



Admin.getLayout = function getLayout(page: ReactElement) {
    return <AdminLayout>{page}</AdminLayout>
};
Admin.authRequired = true;
export async function getServerSideProps(ctx: GetServerSidePropsContext) {
    return roleGuard(ctx, (session: any) => ({
        props: {
            session,
        },
    }), "admin")
}
