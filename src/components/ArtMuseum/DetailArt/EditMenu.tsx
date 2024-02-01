import { Menu } from "@headlessui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import http from "../../../axios/axios";
import { Comment } from "../../../shared/types";

interface EditMenuProps {
  data: string;
  type: string;
  reply?: Comment;
  editHandler: () => void;
}
function EditMenu({ data, type, reply, editHandler }: EditMenuProps) {
  const { id } = useParams();
  const handleDelete = async() => {
    if (type === "comment")
      return await http.delete(`inspiration/${id}/comment/del/${data}`);
    if (type === "reply" && reply)
      return await http.delete(`inspiration/${id}/reply/del/${data}/${reply._id}`);
  };

  const queryClient = useQueryClient();
  const deleteComtMutation = useMutation({
    mutationKey: ["deleteComt"],
    mutationFn: handleDelete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["detail"] });
    },
  });
  return (
    <>
      <Menu.Item>
        <div
          className="p-2 rounded-xl hover:text-white hover:bg-[#cc0000] "
          onClick={editHandler}
        >
          Edit
        </div>
      </Menu.Item>
      <Menu.Item>
        <div
          className="p-2 rounded-xl hover:text-white hover:bg-[#cc0000]"
          onClick={() => {
            deleteComtMutation.mutate();
          }}
        >
          Delete
        </div>
      </Menu.Item>
    </>
  );
}

export default EditMenu;
