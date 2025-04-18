import { HiArrowLeft, HiArrowRight } from "react-icons/hi";
import { Button } from "./ui/button";

export default function Pagination({
    totalPages,
    currentPage,
    setCurrentPage
}) {
    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage((prev) => prev + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage((prev) => prev - 1);
        }
    };
    return (
        <>
            {totalPages > 1 && (
                <div className="mt-6 flex justify-center items-center space-x-4">
                    <Button
                        onClick={handlePreviousPage}
                        disabled={currentPage === 1}
                    >
                        <HiArrowLeft size={24} />
                    </Button>

                    <span className="font-medium">
                        Page {currentPage} of {totalPages}
                    </span>

                    <Button
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                    >
                        <HiArrowRight size={24} />
                    </Button>
                </div>
            )}
        </>
    );
}
