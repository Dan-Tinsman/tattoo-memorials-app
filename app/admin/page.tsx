import dynamic from "next/dynamic";

const AdminApp = dynamic(() => import("./admin-app"), { ssr: false });

export default function AdminPage() {
    return <AdminApp />;
}
