import { useSwiper } from "swiper/react";
import { PiCaretLeftBold, PiCaretRightBold } from "react-icons/pi";

export default function WorkSliderBtns({
    containerStyls,
    btnStyles,
    iconStyles,
}) {
    const swiper = useSwiper();
    return (
        <div className={containerStyls}>
            <button className={btnStyles}>
                <PiCaretLeftBold
                    className={iconStyles}
                    onClick={() => swiper.slidePrev()}
                />
            </button>
            <button className={btnStyles} onClick={() => swiper.slideNext()}>
                <PiCaretRightBold className={iconStyles} />
            </button>
        </div>
    );
}
