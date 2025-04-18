"use client";

import { supabase } from "@/lib/supabase";
import { Suspense, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { HiTrash, HiPlus } from "react-icons/hi";
import { Button } from "@/components/ui/button";
import { FiEdit } from "react-icons/fi";
import { toast } from "sonner";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

import Filter from "@/components/Filter";
import Pagination from "@/components/Pagination";
import EditModal from "@/components/EditModal";
import CreateModal from "@/components/CreateModal";
import SortBy from "@/components/SortBy";
import { BsGithub, BsLink } from "react-icons/bs";
import EditPortfolio from "@/components/EditPortfolio";
import CreatePortfolio from "@/components/CreatePortfolio";

export default function Portfolio() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <PortfolioContent />
        </Suspense>
    );
}

function PortfolioContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Get URL parameters with defaults
    const page = searchParams.get("page")
        ? parseInt(searchParams.get("page"))
        : 1;
    const sortField = searchParams.get("sortField") || "created_at";
    const sortOrder = searchParams.get("sortOrder") || "asc";
    const filterCategory = searchParams.get("filterCategory") || "";

    const [portfolioItems, setPortfolioItems] = useState([]);
    const [currentPage, setCurrentPage] = useState(page);
    const [totalPages, setTotalPages] = useState(1);
    const [editItem, setEditItem] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [portfolioDetails, setPortfolioDetails] = useState({
        name: "",
        category: "",
        description: "",
        live: "",
        github: "",
        image_url: "",
    });
    const [currentSortField, setCurrentSortField] = useState(sortField);
    const [currentSortOrder, setCurrentSortOrder] = useState(sortOrder);
    const [currentFilterCategory, setCurrentFilterCategory] = useState(filterCategory);
    const [availableCategories, setAvailableCategories] = useState([]);

    const recordsPerPage = 9;

    // Update URL with current state
    const updateUrlParams = (params) => {
        const newParams = new URLSearchParams(searchParams.toString());

        // Update provided parameters
        Object.entries(params).forEach(([key, value]) => {
            if (value) {
                newParams.set(key, value);
            } else {
                newParams.delete(key);
            }
        });

        router.push(`?${newParams.toString()}`, { scroll: false });
    };

    // Fetch available categories for filter dropdown
    const fetchAvailableCategories = async () => {
        const { data, error } = await supabase
            .from("portfolio")
            .select("category")
            .order("category");

        if (data && !error) {
            // Extract unique categories and filter out nulls/empty strings
            const uniqueCategories = [
                ...new Set(data.map((item) => item.category)),
            ].filter(Boolean);
            setAvailableCategories(uniqueCategories);
        }
    };

    const fetchPortfolioItems = async () => {
        let query = supabase.from("portfolio").select("*", { count: "exact" });

        if (currentFilterCategory) {
            query = query.eq("category", currentFilterCategory);
        }

        query = query.order(currentSortField, {
            ascending: currentSortOrder === "asc",
        });

        const from = (currentPage - 1) * recordsPerPage;
        const to = from + recordsPerPage - 1;
        query = query.range(from, to);

        const { data, error, count } = await query;

        const pages = Math.ceil(count / recordsPerPage);

        // Reset currentPage if it's too high
        if (currentPage > pages && pages > 0) {
            setCurrentPage(1);
            return;
        }

        if (data) {
            setPortfolioItems(data);
            setTotalPages(pages);
        }

        if (error) console.error(error);
    };

    // Load data when component mounts or parameters change
    useEffect(() => {
        fetchPortfolioItems();
        fetchAvailableCategories();

        // Update URL when page changes
        updateUrlParams({ page: currentPage });
    }, [currentPage]);

    // Refresh data when sort or filter changes
    useEffect(() => {
        fetchPortfolioItems();

        // Update URL with sort and filter params
        updateUrlParams({
            sortField: currentSortField,
            sortOrder: currentSortOrder,
            filterCategory: currentFilterCategory,
        });
    }, [currentSortField, currentSortOrder, currentFilterCategory]);

    const handleDelete = async (itemId) => {
        const { error } = await supabase
            .from("portfolio")
            .delete()
            .eq("id", itemId);
        if (error) {
            console.error("Error deleting portfolio item:", error);
            toast.error("Failed to delete portfolio item");
        } else {
            toast.success("Portfolio item deleted successfully");
            fetchPortfolioItems(); // Refresh to update pagination
        }
    };

    const handleEdit = (item) => {
        setPortfolioDetails({
            name: item.name || "",
            category: item.category || "",
            description: item.description || "",
            live: item.live || "",
            github: item.github || "",
            image_url: item.image_url || "",
        });
        setEditItem(item);
        setIsEditModalOpen(true);
    };

    const handleSubmitEdit = async (e) => {
        e.preventDefault();

        const { name, category, description, live, github, image_url } =
            portfolioDetails;

        if (!name || !category || !description) {
            toast.error("Please fill out all required fields");
            return;
        }

        const { error } = await supabase
            .from("portfolio")
            .update({
                name,
                category,
                description,
                live,
                github,
                image_url,
            })
            .eq("id", editItem.id);

        if (error) {
            console.error("Error updating portfolio item:", error);
            toast.error("Failed to update portfolio item");
        } else {
            setIsEditModalOpen(false);
            setEditItem(null);
            toast.success("Portfolio item updated successfully");
            fetchPortfolioItems();
            // Refresh categories list in case category changed
            fetchAvailableCategories();
        }
    };

    const handleCreatePortfolioItem = () => {
        // Reset form fields
        setPortfolioDetails({
            name: "",
            category: "",
            description: "",
            live: "",
            github: "",
            image_url: "",
        });
        setIsCreateModalOpen(true);
    };

    const handleSubmitCreate = async (e) => {
        e.preventDefault();

        const { name, category, description, live, github, image_url } =
            portfolioDetails;

        if (!name || !category || !description) {
            toast.error("Please fill out all required fields");
            return;
        }

        const { error } = await supabase.from("portfolio").insert({
            name,
            category,
            description,
            live,
            github,
            image_url,
        });

        if (error) {
            console.error("Error creating portfolio item:", error);
            toast.error("Failed to create portfolio item");
        } else {
            setIsCreateModalOpen(false);
            toast.success("Portfolio item created successfully");
            fetchPortfolioItems();
            fetchAvailableCategories(); // Refresh available categories
        }
    };

    const handleSort = (field) => {
        // If clicking the same field, toggle order; otherwise, set new field with asc order
        if (field === currentSortField) {
            setCurrentSortOrder(currentSortOrder === "asc" ? "desc" : "asc");
        } else {
            setCurrentSortField(field);
            setCurrentSortOrder("asc");
        }
    };

    const handleFilterChange = (value) => {
        setCurrentFilterCategory(value === "all" ? "" : value);
        // Reset to first page when filter changes
        setCurrentPage(1);
    };

    const clearFilter = () => {
        setCurrentFilterCategory("");
        setIsFilterOpen(false);
    };

    return (
        <motion.section
            initial={{ opacity: 0 }}
            animate={{
                opacity: 1,
                transition: { delay: 0.4, duration: 0.4, ease: "easeIn" },
            }}
            className="min-h-[90vh] flex py-12 px-5"
        >
            <div className="container mx-auto p-5">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8">
                    <h1 className="text-4xl text-center lg:text-left font-extrabold mb-5 md:mb-0">
                        My Portfolio
                    </h1>

                    <div className="flex flex-col md:flex-row gap-3">
                        {/* Filter dropdown */}
                        <Filter
                            isFilterOpen={isFilterOpen}
                            setIsFilterOpen={setIsFilterOpen}
                            currentFilterService={currentFilterCategory}
                            handleFilterChange={handleFilterChange}
                            availableServices={availableCategories}
                            clearFilter={clearFilter}
                            filterLabel="category"
                        />

                        {/* Create portfolio item button */}
                        <Button
                            onClick={handleCreatePortfolioItem}
                            className="flex items-center gap-2"
                        >
                            <HiPlus />
                            Add Project
                        </Button>
                    </div>
                </div>

                {/* Sorting controls */}
                <SortBy
                    currentSortField={currentSortField}
                    currentSortOrder={currentSortOrder}
                    fields={[
                        "created_at",
                        "name",
                        "category",
                    ]}
                    handleSort={handleSort}
                />

                {/* Portfolio grid */}
                {portfolioItems.length === 0 ? (
                    <div className="text-center p-10">
                        <p className="text-lg text-muted-foreground">
                            No portfolio items found.{" "}
                            {currentFilterCategory &&
                                "Try clearing your filter."}
                        </p>
                    </div>
                ) : (
                    <ul className="grid grid-cols-1 mt-5 md:grid-cols-2 lg:grid-cols-3 gap-[30px]">
                        {portfolioItems.map((item) => (
                            <li
                                key={item.id}
                                className="bg-[#eee] dark:bg-[#27272c] rounded-xl shadow relative overflow-hidden flex flex-col"
                            >
                                {/* Image Container with responsive handling */}
                                <div className="relative w-full h-48 overflow-hidden">
                                    {item.image_url ? (
                                        <Image
                                            src={item.image_url}
                                            alt={item.name}
                                            fill
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            className="object-cover"
                                            onError={(e) => {
                                                e.target.src = "/placeholder-image.jpg"; // Fallback image
                                                e.target.onerror = null;
                                            }}
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                            <span className="text-gray-500 dark:text-gray-400">No image</span>
                                        </div>
                                    )}
                                </div>

                                {/* Content section */}
                                <div className="p-4">
                                    <div className="absolute top-2 right-2 flex items-center gap-1 md:gap-2 z-10">
                                        <button
                                            className="p-2 bg-white/80 dark:bg-black/50 rounded-full cursor-pointer hover:text-primary transition-all"
                                            onClick={() => handleEdit(item)}
                                        >
                                            <FiEdit size={16} />
                                        </button>
                                        <button
                                            className="p-2 bg-white/80 dark:bg-black/50 rounded-full cursor-pointer hover:text-primary transition-all"
                                            onClick={() => handleDelete(item.id)}
                                        >
                                            <HiTrash size={16} />
                                        </button>
                                    </div>

                                    <h3 className="font-bold text-lg">{item.name}</h3>
                                    <span className="inline-block bg-primary/20 text-primary px-2 py-1 rounded-md text-xs mt-2">
                                        {item.category}
                                    </span>
                                    <p className="text-sm text-muted-foreground mt-3 line-clamp-3">
                                        {item.description}
                                    </p>

                                    <div className="flex gap-3 mt-4">
                                        {item.live && (
                                            <a 
                                                href={item.live} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="text-xl bg-background text-primary px-3 p-2 rounded-full hover:bg-primary hover:text-dark-background transition-all"
                                            >
                                                <BsLink size={25} />
                                            </a>
                                        )}
                                        {item.github && (
                                            <a 
                                                href={item.github} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="text-xl bg-background text-primary px-3 p-2 rounded-full hover:bg-primary hover:text-dark-background transition-all"
                                            >
                                                <BsGithub size={25} />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}

                {/* Pagination */}
                <Pagination
                    totalPages={totalPages}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                />

                {/* Edit Modal */}
                <EditModal
                    isEditModalOpen={isEditModalOpen}
                    setIsEditModalOpen={setIsEditModalOpen}
                    handleSubmitEdit={handleSubmitEdit}
                    modalFor={"portfolio"}
                >
                    <EditPortfolio
                        portfolioDetails={portfolioDetails}
                        setPortfolioDetails={setPortfolioDetails}
                    />
                </EditModal>

                {/* Create Modal */}
                <CreateModal
                    isCreateModalOpen={isCreateModalOpen}
                    setIsCreateModalOpen={setIsCreateModalOpen}
                    handleSubmitCreate={handleSubmitCreate}
                    modalFor={"portfolio"}
                >
                    <CreatePortfolio
                        portfolioDetails={portfolioDetails}
                        setPortfolioDetails={setPortfolioDetails}
                    />
                </CreateModal>
            </div>
        </motion.section>
    );
}