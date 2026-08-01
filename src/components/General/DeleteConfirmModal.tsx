"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Modal from "./Modal";
import Loading from "./Loading";
import Message from "./Message";

interface DeleteConfirmModalProps {
  open: boolean;
  onClose: () => void;
  entityName: string;
  onDelete: () => void;
  deleting: boolean;
  error?: string | null;
  dict: {
    delete: string;
    cancel: string;
    deleteConfirm: string;
  };
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  open,
  onClose,
  entityName,
  onDelete,
  deleting,
  error,
  dict,
}) => (
  <Modal open={open} onClose={onClose} title={dict.delete}>
    <div className="flex items-start gap-4">
      <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
        <Trash2 size={20} className="text-red-600" />
      </div>
      <div>
        <p className="text-gray-900 font-medium mb-1">{dict.delete}</p>
        <p className="text-gray-500 text-sm">
          {dict.deleteConfirm.replace("{name}", entityName)}
        </p>
      </div>
    </div>
    <div className="flex justify-end gap-3 mt-6">
      {error && <Message msg={error} type="error" />}
      <Button variant="outline" onClick={onClose} className="px-6 py-2 text-base">
        {dict.cancel}
      </Button>
      {deleting ? (
        <Loading />
      ) : (
        <Button variant="destructive" onClick={onDelete}>
          {dict.delete}
        </Button>
      )}
    </div>
  </Modal>
);

export default DeleteConfirmModal;
