import { Button } from "./ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "./ui/dialog";

export default function CreateModal({
    isCreateModalOpen,
    setIsCreateModalOpen,
    handleSubmitCreate,
    children,
    modalFor
}) {
    return (
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="text-3xl font-extrabold text-center capitalize">
                        Create {modalFor}
                    </DialogTitle>
                    <DialogDescription className="text-center">
                        Enter the new {modalFor} information below.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmitCreate}>
                    {children}
                    <DialogFooter>
                        <Button type="submit" className="capitalize">Create {modalFor}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
