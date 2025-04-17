"use client";

import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { HiArrowLeft, HiArrowRight, HiTrash, HiPlus } from "react-icons/hi";
import { Button } from "@/components/ui/button";
import { FiEdit, FiFilter } from "react-icons/fi";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FiArrowUp, FiArrowDown } from "react-icons/fi";

export default function Dashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get URL parameters with defaults
  const page = searchParams.get("page") ? parseInt(searchParams.get("page")) : 1;
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
  const [currentFilterService, setCurrentFilterService] = useState(filterService);
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
      const uniqueServices = [...new Set(data.map(item => item.service))].filter(Boolean);
      setAvailableServices(uniqueServices);
    }
  };

  const fetchContacts = async () => {
    let query = supabase
      .from("contact")
      .select("*", { count: "exact" });
    
    // Apply filtering if set
    if (currentFilterService) {
      query = query.eq("service", currentFilterService);
    }
    
    // Apply sorting
    query = query.order(currentSortField, { ascending: currentSortOrder === "asc" });
    
    // Apply pagination
    const from = (currentPage - 1) * recordsPerPage;
    const to = from + recordsPerPage - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (data) {
      setContacts(data);
      setTotalPages(Math.ceil(count / recordsPerPage));
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
      filterService: currentFilterService
    });
  }, [currentSortField, currentSortOrder, currentFilterService]);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handleDelete = async (contactId) => {
    const { error } = await supabase.from("contact").delete().eq("id", contactId);
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

    const { firstName, lastName, email, phoneNo, service, message } = contactDetails;

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

    const { firstName, lastName, email, phoneNo, service, message } = contactDetails;

    if (!firstName || !lastName || !email || !phoneNo || !service) {
      toast.error("Please fill out all required fields");
      return;
    }

    const { error } = await supabase
      .from("contact")
      .insert({
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
            <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <FiFilter />
                  {currentFilterService ? `Filter: ${currentFilterService}` : "Filter"}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Filter Contacts</DialogTitle>
                  <DialogDescription>
                    Select a service to filter the contacts.
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
                      <SelectItem value="all">All Services</SelectItem>
                      {availableServices.map((service) => (
                        <SelectItem className="capitalize" key={service} value={service}>
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
            
            {/* Create contact button */}
            <Button onClick={handleCreateContact} className="flex items-center gap-2">
              <HiPlus />
              Create Contact
            </Button>
          </div>
        </div>
        
        {/* Sorting controls */}
        <div className="mb-6 flex flex-wrap gap-2">
          <span className="text-sm text-muted-foreground mr-2 self-center">Sort by:</span>
          {["created_at", "firstName", "lastName", "email", "service", ].map(field => (
            <Button 
              key={field} 
              variant="outline" 
              size="sm"
              className={`capitalize ${currentSortField === field ? "bg-primary text-dark-background" : ""}`}
              onClick={() => handleSort(field)}
            >
               {field === "created_at" ? "Date Inserted" : field.replace(/([A-Z])/g, ' $1').trim()}
              {currentSortField === field && (
                currentSortOrder === "asc" ? <FiArrowUp className="ml-2" /> : <FiArrowDown className="ml-2" />
              )}
            </Button>
          ))}
        </div>
        
        {/* Contacts grid */}
        {contacts.length === 0 ? (
          <div className="text-center p-10">
            <p className="text-lg text-muted-foreground">No contacts found. {currentFilterService && "Try clearing your filter."}</p>
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

        {/* Edit Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-3xl font-extrabold text-center">Edit Contact</DialogTitle>
              <DialogDescription className="text-center">
                Make changes to the contact information below.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmitEdit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-firstName" className="text-right">
                    Firstname
                  </Label>
                  <Input
                    id="edit-firstName"
                    value={contactDetails.firstName}
                    onChange={(e) =>
                      setContactDetails({
                        ...contactDetails,
                        firstName: e.target.value,
                      })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-lastName" className="text-right">
                    Lastname
                  </Label>
                  <Input
                    id="edit-lastName"
                    value={contactDetails.lastName}
                    onChange={(e) =>
                      setContactDetails({
                        ...contactDetails,
                        lastName: e.target.value,
                      })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-email" className="text-right">
                    Email
                  </Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={contactDetails.email}
                    onChange={(e) =>
                      setContactDetails({
                        ...contactDetails,
                        email: e.target.value,
                      })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-phoneNo" className="text-right">
                    Phone
                  </Label>
                  <Input
                    id="edit-phoneNo"
                    value={contactDetails.phoneNo}
                    onChange={(e) =>
                      setContactDetails({
                        ...contactDetails,
                        phoneNo: e.target.value,
                      })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-service" className="text-right">
                    Service
                  </Label>
                  <Input
                    id="edit-service"
                    value={contactDetails.service}
                    onChange={(e) =>
                      setContactDetails({
                        ...contactDetails,
                        service: e.target.value,
                      })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-message" className="text-right">
                    Message
                  </Label>
                  <Textarea
                    id="edit-message"
                    value={contactDetails.message}
                    onChange={(e) =>
                      setContactDetails({
                        ...contactDetails,
                        message: e.target.value,
                      })
                    }
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Save Changes</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Create Modal */}
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-3xl font-extrabold text-center">Create Contact</DialogTitle>
              <DialogDescription className="text-center">
                Enter the new contact information below.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmitCreate}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="create-firstName" className="text-right">
                    Firstname
                  </Label>
                  <Input
                    id="create-firstName"
                    value={contactDetails.firstName}
                    onChange={(e) =>
                      setContactDetails({
                        ...contactDetails,
                        firstName: e.target.value,
                      })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="create-lastName" className="text-right">
                    Lastname
                  </Label>
                  <Input
                    id="create-lastName"
                    value={contactDetails.lastName}
                    onChange={(e) =>
                      setContactDetails({
                        ...contactDetails,
                        lastName: e.target.value,
                      })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="create-email" className="text-right">
                    Email
                  </Label>
                  <Input
                    id="create-email"
                    type="email"
                    value={contactDetails.email}
                    onChange={(e) =>
                      setContactDetails({
                        ...contactDetails,
                        email: e.target.value,
                      })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="create-phoneNo" className="text-right">
                    Phone
                  </Label>
                  <Input
                    id="create-phoneNo"
                    value={contactDetails.phoneNo}
                    onChange={(e) =>
                      setContactDetails({
                        ...contactDetails,
                        phoneNo: e.target.value,
                      })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="create-service" className="text-right">
                    Service
                  </Label>
                  <Input
                    id="create-service"
                    value={contactDetails.service}
                    onChange={(e) =>
                      setContactDetails({
                        ...contactDetails,
                        service: e.target.value,
                      })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="create-message" className="text-right">
                    Message
                  </Label>
                  <Textarea
                    id="create-message"
                    value={contactDetails.message}
                    onChange={(e) =>
                      setContactDetails({
                        ...contactDetails,
                        message: e.target.value,
                      })
                    }
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Create Contact</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        
      </div>
    </motion.section>
  );
}