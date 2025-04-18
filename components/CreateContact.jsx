import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";

export default function CreateContact({contactDetails, setContactDetails}) {
    return (
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
    );
}
