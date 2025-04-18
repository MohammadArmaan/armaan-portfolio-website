"use client";

import { supabase } from "@/lib/supabase";
import { Suspense, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { HiTrash, HiPlus } from "react-icons/hi";
import { Button } from "@/components/ui/button";
import { FiEdit } from "react-icons/fi";
import { toast } from "sonner";

import { useRouter, useSearchParams } from "next/navigation";

import Filter from "@/components/Filter";
import Pagination from "@/components/Pagination";
import EditModal from "@/components/EditModal";
import CreateModal from "@/components/CreateModal";
import SortBy from "@/components/SortBy";
import CreateContact from "@/components/CreateContact";
import EditContact from "@/components/EditContact";

export default function Dashboard() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <DashboardContent />
        </Suspense>
    );
}

function DashboardContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Get URL parameters with defaults
    const page = searchParams.get("page")
        ? parseInt(searchParams.get("page"))
        : 1;
    const sortField = searchParams.get("sortField") || "created_at";
    const sortOrder = searchParams.get("sortOrder") || "asc";
    const filterService = searchParams.get("filterService") || "";

    const [contacts, setContacts] = useState([]);
    const [currentPage, setCurrentPage] = useState(page);
    const [totalPages, setTotalPages] = useState(1);
    const [editContact, setEditContact] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [contactDetails, setContactDetails] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phoneNo: "",
        service: "",
        message: "",
    });
    const [currentSortField, setCurrentSortField] = useState(sortField);
    const [currentSortOrder, setCurrentSortOrder] = useState(sortOrder);
    const [currentFilterService, setCurrentFilterService] =
        useState(filterService);
    const [availableServices, setAvailableServices] = useState([]);

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

    // Fetch available services for filter dropdown
    const fetchAvailableServices = async () => {
        const { data, error } = await supabase
            .from("contact")
            .select("service")
            .order("service");

        if (data && !error) {
            // Extract unique services and filter out nulls/empty strings
            const uniqueServices = [
                ...new Set(data.map((item) => item.service)),
            ].filter(Boolean);
            setAvailableServices(uniqueServices);
        }
    };

    const fetchContacts = async () => {
        let query = supabase.from("contact").select("*", { count: "exact" });

        if (currentFilterService) {
            query = query.eq("service", currentFilterService);
        }

        query = query.order(currentSortField, {
            ascending: currentSortOrder === "asc",
        });

        const from = (currentPage - 1) * recordsPerPage;
        const to = from + recordsPerPage - 1;
        query = query.range(from, to);

        const { data, error, count } = await query;

        const pages = Math.ceil(count / recordsPerPage);

        // ⛔ Reset currentPage if it's too high
        if (currentPage > pages) {
            setCurrentPage(1); // or setCurrentPage(pages);
            return;
        }

        if (data) {
            setContacts(data);
            setTotalPages(pages);
        }

        if (error) console.error(error);
    };

    // Load data when component mounts or parameters change
    useEffect(() => {
        fetchContacts();
        fetchAvailableServices();

        // Update URL when page changes
        updateUrlParams({ page: currentPage });
    }, [currentPage]);

    // Refresh data when sort or filter changes
    useEffect(() => {
        fetchContacts();

        // Update URL with sort and filter params
        updateUrlParams({
            sortField: currentSortField,
            sortOrder: currentSortOrder,
            filterService: currentFilterService,
        });
    }, [currentSortField, currentSortOrder, currentFilterService]);

    const handleDelete = async (contactId) => {
        const { error } = await supabase
            .from("contact")
            .delete()
            .eq("id", contactId);
        if (error) {
            console.error("Error deleting contact:", error);
            toast.error("Failed to delete contact");
        } else {
            toast.success("Contact deleted successfully");
            fetchContacts(); // Refresh to update pagination
        }
    };

    const handleEdit = (contact) => {
        setContactDetails({
            firstName: contact.firstName || "",
            lastName: contact.lastName || "",
            email: contact.email || "",
            phoneNo: contact.phoneNo || "",
            service: contact.service || "",
            message: contact.message || "",
        });
        setEditContact(contact);
        setIsEditModalOpen(true);
    };

    const handleSubmitEdit = async (e) => {
        e.preventDefault();

        const { firstName, lastName, email, phoneNo, service, message } =
            contactDetails;

        if (!firstName || !lastName || !email || !phoneNo || !service) {
            toast.error("Please fill out all required fields");
            return;
        }

        const { error } = await supabase
            .from("contact")
            .update({
                firstName,
                lastName,
                email,
                phoneNo,
                service,
                message,
            })
            .eq("id", editContact.id);

        if (error) {
            console.error("Error updating contact:", error);
            toast.error("Failed to update contact");
        } else {
            setIsEditModalOpen(false);
            setEditContact(null);
            toast.success("Contact updated successfully");
            fetchContacts();
            // Refresh services list in case service name changed
            fetchAvailableServices();
        }
    };

    const handleCreateContact = () => {
        // Reset form fields
        setContactDetails({
            firstName: "",
            lastName: "",
            email: "",
            phoneNo: "",
            service: "",
            message: "",
        });
        setIsCreateModalOpen(true);
    };

    const handleSubmitCreate = async (e) => {
        e.preventDefault();

        const { firstName, lastName, email, phoneNo, service, message } =
            contactDetails;

        if (!firstName || !lastName || !email || !phoneNo || !service) {
            toast.error("Please fill out all required fields");
            return;
        }

        const { error } = await supabase.from("contact").insert({
            firstName,
            lastName,
            email,
            phoneNo,
            service,
            message,
        });

        if (error) {
            console.error("Error creating contact:", error);
            toast.error("Failed to create contact");
        } else {
            setIsCreateModalOpen(false);
            toast.success("Contact created successfully");
            fetchContacts();
            fetchAvailableServices(); // Refresh available services
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
        setCurrentFilterService(value === "all" ? "" : value);
        // Reset to first page when filter changes
        setCurrentPage(1);
    };

    const clearFilter = () => {
        setCurrentFilterService("");
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
                        Contact Responses
                    </h1>

                    <div className="flex flex-col md:flex-row gap-3">
                        {/* Filter dropdown */}
                        <Filter
                            isFilterOpen={isFilterOpen}
                            setIsFilterOpen={setIsFilterOpen}
                            currentFilterService={currentFilterService}
                            handleFilterChange={handleFilterChange}
                            availableServices={availableServices}
                            clearFilter={clearFilter}
                        />

                        {/* Create contact button */}
                        <Button
                            onClick={handleCreateContact}
                            className="flex items-center gap-2"
                        >
                            <HiPlus />
                            Create Contact
                        </Button>
                    </div>
                </div>

                {/* Sorting controls */}
                <SortBy
                    currentSortField={currentSortField}
                    currentSortOrder={currentSortOrder}
                    fields={[
                        "created_at",
                        "firstName",
                        "lastName",
                        "email",
                        "service",
                    ]}
                    handleSort={handleSort}
                />

                {/* Contacts grid */}
                {contacts.length === 0 ? (
                    <div className="text-center p-10">
                        <p className="text-lg text-muted-foreground">
                            No contacts found.{" "}
                            {currentFilterService &&
                                "Try clearing your filter."}
                        </p>
                    </div>
                ) : (
                    <ul className="grid grid-cols-1 mt-5 md:grid-cols-2 lg:grid-cols-3 gap-[30px]">
                        {contacts.map((contact) => (
                            <li
                                key={contact.id}
                                className="p-4 bg-[#eee] dark:bg-[#27272c] rounded-xl shadow relative"
                            >
                                <div className="absolute top-2 right-2 flex items-center gap-1 md:gap-2">
                                    <button
                                        className="p-2 mt-1 cursor-pointer hover:text-primary transition-all"
                                        onClick={() => handleEdit(contact)}
                                    >
                                        <FiEdit size={20} />
                                    </button>
                                    <button
                                        className="p-2 mt-1 cursor-pointer hover:text-primary transition-all"
                                        onClick={() => handleDelete(contact.id)}
                                    >
                                        <HiTrash size={20} />
                                    </button>
                                </div>

                                <p className="font-medium">
                                    {contact.firstName} {contact.lastName}
                                </p>
                                <p className="text-sm text-muted-foreground mt-2">
                                    Email:{" "}
                                    <span className="text-md text-foreground">
                                        {contact.email}
                                    </span>
                                </p>
                                <p className="text-sm text-muted-foreground mt-2">
                                    Phone Number:{" "}
                                    <span className="text-md text-foreground capitalize">
                                        {contact.phoneNo}
                                    </span>
                                </p>
                                <p className="text-sm text-muted-foreground mt-2">
                                    Service Needed:{" "}
                                    <span className="text-md text-foreground capitalize">
                                        {contact.service}
                                    </span>
                                </p>
                                <p className="text-sm text-muted-foreground mt-2">
                                    Message:{" "}
                                    <span className="text-md text-foreground">
                                        {contact.message}
                                    </span>
                                </p>
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
                    modalFor={"contact"}
                >
                    <EditContact
                        contactDetails={contactDetails}
                        setContactDetails={setContactDetails}
                    />
                </EditModal>

                {/* Create Modal */}
                <CreateModal
                    isCreateModalOpen={isCreateModalOpen}
                    setIsCreateModalOpen={setIsCreateModalOpen}
                    handleSubmitCreate={handleSubmitCreate}
                    modalFor={"contact"}
                >
                    <CreateContact
                        contactDetails={contactDetails}
                        setContactDetails={setContactDetails}
                    />
                </CreateModal>
            </div>
        </motion.section>
    );
}