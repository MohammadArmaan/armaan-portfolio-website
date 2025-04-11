import { JetBrains_Mono, Poppins } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { ThemeProvider } from "@/components/ThemeProvider";
import PageTransition from "@/components/PageTransition";
import StairTransition from "@/components/StairTransition";
import { Toaster } from "sonner";
import Footer from "@/components/Footer";

const jetbrainsMono = JetBrains_Mono({
    subsets: ["latin"],
    weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
    variable: "--font-jetbrainsMono",
    display: "swap",
});

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["400", "500", "700"],
    variable: "--font-poppins",
});

export const metadata = {
    title: {
        template: "Mohammad Armaan | %s",
        default: "Mohammad Armaan | Welcome",
    },
    description:
        "Discover the dynamic portfolio of Mohammad Armaan, showcasing a fusion of creativity,innovation, and expertise in web development and design. Explore a curated collection of projects",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={jetbrainsMono.variable}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                >
                    <Header />
                    <StairTransition />
                    <PageTransition>{children}</PageTransition>
                    <Toaster />
                    <Footer />
                </ThemeProvider>
            </body>
        </html>
    );
}
