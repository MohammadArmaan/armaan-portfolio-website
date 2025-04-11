import Social from "./Social";

export default function Footer() {
    const year = new Date().getFullYear();
    return (
        <footer className="bg-secondary py-12">
            <div className="container mx-auto p-5">
                <div className="flex flex-col items-center justify-between text-center">
                    <Social
                        containerStyles="flex gap-x-6 mx-auto xl:mx-0 mb-4"
                        iconStyles="text-foreground text-[20px] transition-all hover:text-primary"
                    />
                    <div className="text-foreground mt-4">
                        &copy; Copyright by {year}{" "}
                        <a
                            href="https://www.linkedin.com/in/mohammad-armaan-8b61b127a/"
                            target="_blank"
                            className="font-extrabold hover:text-primary transition-all whitespace-nowrap"
                        >
                            Mohammad Armaan
                        </a>
                        . Inc. All rights reserverd
                    </div>
                </div>
            </div>
        </footer>
    );
}
