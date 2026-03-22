import { useQuery, useMutation } from "urql";
import { BOARDS_QUERY, CREATE_BOARD_MUTATION } from "@forum/shared";
import { useState } from "react";

export default function BoardManagePage() {
  const [{ data }, reexecuteQuery] = useQuery({ query: BOARDS_QUERY });
  const [, createBoard] = useMutation(CREATE_BOARD_MUTATION);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleCreate = async () => {
    if (!name.trim()) return;
    await createBoard({ input: { name, description } });
    setName("");
    setDescription("");
    reexecuteQuery({ requestPolicy: "network-only" });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Board Management</h1>

      <div className="mb-8 p-4 border border-gray-200 rounded">
        <h2 className="font-semibold mb-3">Create Board</h2>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-2"
          placeholder="Board name"
        />
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-3"
          placeholder="Description"
        />
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
        >
          Create
        </button>
      </div>

      <h2 className="font-semibold mb-3">Existing Boards</h2>
      <div className="space-y-2">
        {data?.boards?.map((board: any) => (
          <div key={board.id} className="p-3 border border-gray-200 rounded flex justify-between">
            <div>
              <p className="font-medium">{board.name}</p>
              <p className="text-sm text-gray-500">{board.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
