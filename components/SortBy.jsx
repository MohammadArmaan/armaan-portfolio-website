import { FiArrowDown, FiArrowUp } from "react-icons/fi";
import { Button } from "./ui/button";

export default function SortBy({
    currentSortField,
    currentSortOrder,
    fields,
    handleSort,
}) {
    return (
        <div className="mb-6 flex flex-wrap gap-2">
            <span className="text-sm text-muted-foreground mr-2 self-center">
                Sort by:
            </span>
            {fields.map((field) => (
                <Button
                    key={field}
                    variant="outline"
                    size="sm"
                    className={`capitalize ${
                        currentSortField === field
                            ? "bg-primary text-dark-background"
                            : ""
                    }`}
                    onClick={() => handleSort(field)}
                >
                    {field === "created_at"
                        ? "Date Inserted"
                        : field.replace(/([A-Z])/g, " $1").trim()}
                    {currentSortField === field &&
                        (currentSortOrder === "asc" ? (
                            <FiArrowUp className="ml-2" />
                        ) : (
                            <FiArrowDown className="ml-2" />
                        ))}
                </Button>
            ))}
        </div>
    );
}
