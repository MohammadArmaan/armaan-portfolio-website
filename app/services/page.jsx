import Services from "./Services";

export const metadata = {
    title: "Services",
    description:
        "Explore the web development services offered by Mohammad Armaan, including responsive websites, full-stack applications, and modern UI/UX solutions tailored for businesses and individuals.",
};

export default function Page() {
    return (
        <section className="min-h-[80vh] flex flex-col justify-center py-12 xl:py-8">
            <Services />
        </section>
    );
}
