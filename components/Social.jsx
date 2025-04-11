import {
    FaGithub,
    FaLinkedinIn,
    FaTwitter,
    FaInstagram,
    FaCode,
} from "react-icons/fa";

const socials = [
    {
        icon: <FaGithub />,
        path: "https://github.com/MohammadArmaan",
    },
    {
        icon: <FaLinkedinIn />,
        path: "https://www.linkedin.com/in/mohammad-armaan-8b61b127a/",
    },
    {
        icon: <FaTwitter />,
        path: "https://x.com/ArmaanPhantom?t=fdkmylikGITjOxHRO9Ze4A&s=03",
    },
    {
        icon: <FaInstagram />,
        path: "https://www.instagram.com/mohammad_amraan_7786.man?utm_source=qr&igsh=MWpucTFjY3p5dG9sYw==",
    },
    {
        icon: <FaCode />,
        path: "https://leetcode.com/u/funtasticarmaan7786/",
    },
];

export default function Social({ containerStyles, iconStyles }) {
    return (
        <div className={containerStyles}>
            {socials.map((social, index) => (
                <a
                    key={index}
                    href={social.path}
                    target="_blank"
                    rel="noreferrer"
                    className={iconStyles}
                >
                    {social.icon}
                </a>
            ))}
        </div>
    );
}
