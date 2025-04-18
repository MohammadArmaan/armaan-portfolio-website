import { Button } from "./ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";

export default function EditModal({
    isEditModalOpen,
    setIsEditModalOpen,
    handleSubmitEdit,
    children,
    modalFor
}) {
    return (
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="text-3xl font-extrabold capitalize text-center">
                        Edit {modalFor}
                    </DialogTitle>
                    <DialogDescription className="text-center">
                        Make changes to the {modalFor} information below.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmitEdit}>
                    {/* <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                                htmlFor="edit-firstName"
                                className="text-right"
                            >
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
                            <Label
                                htmlFor="edit-lastName"
                                className="text-right"
                            >
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
                            <Label
                                htmlFor="edit-phoneNo"
                                className="text-right"
                            >
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
                            <Label
                                htmlFor="edit-service"
                                className="text-right"
                            >
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
                            <Label
                                htmlFor="edit-message"
                                className="text-right"
                            >
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
                    </div> */}
                    {children}
                    <DialogFooter>
                        <Button type="submit">Save Changes</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
