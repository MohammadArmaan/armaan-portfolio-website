import { FiFilter } from "react-icons/fi";
import { Button } from "./ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "./ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

export default function Filter({
    isFilterOpen,
    setIsFilterOpen,
    currentFilterService,
    handleFilterChange,
    availableServices,
    clearFilter,
    filterLabel,
}) {
    return (
        <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                    <FiFilter />
                    {currentFilterService
                        ? `Filter: ${currentFilterService}`
                        : "Filter"}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="capitalize">Filter {filterLabel}</DialogTitle>
                    <DialogDescription>
                        Select a {filterLabel} to filter the contacts.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    <Select
                        value={currentFilterService}
                        onValueChange={handleFilterChange}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select a service" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All {filterLabel}</SelectItem>
                            {availableServices.map((service) => (
                                <SelectItem
                                    className="capitalize"
                                    key={service}
                                    value={service}
                                >
                                    {service}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={clearFilter}>
                        Clear Filter
                    </Button>
                    <Button onClick={() => setIsFilterOpen(false)}>
                        Apply Filter
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
