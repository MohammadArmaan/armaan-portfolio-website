import Login from "./Login";

export const metadata = {
    title: "Login - Dashboard",
    description: "Secure login to access my personal contact dashboard",
};

export default function LoginLayout() {
    return (
        <main className="min-h-screen flex items-center justify-center">
            <Login />
        </main>
    );
}
