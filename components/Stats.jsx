import CountUp from "react-countup";

const stats = [
    {
        num: 2,
        text: "Years of Experience",
    },
    {
        num: 35,
        text: "Projects Completed",
    },
    {
        num: 8,
        text: "Technologies Mastered",
    },
    {
        num: 2,
        text: "Hackathons Attended",
    },
];

export default function Stats() {
    return (
        <section className="mt-10 mb-10 xl:mt-32">
            <div className="container mx-auto p-5">
                <div className="flex flex-wrap gap-6 mamx-w-[80vw] mx-auto xl:max-w-none">
                    {stats.map((item, index) => (
                        <div
                            className="flex-1 flex gap-4 items-center justify-center xl:justify-start"
                            key={index}
                        >
                            <CountUp
                                end={item.num}
                                duration={5}
                                delay={2}
                                className="text-4xl xl:text-6xl font-extrabold"
                            />
                            <p
                                className={`${
                                    item.text.length < 15
                                        ? "max-w-[100px]"
                                        : "max-w-[150px]"
                                } leading-snug dark:text-white/80 text-gray-600`}
                            >
                                {item.text}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
