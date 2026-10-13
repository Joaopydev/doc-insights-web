import { Plus } from "lucide-react";
import { Link } from "react-router-dom"

function NewButton() {
  return (
    <Link to="/" className="flex gap-2 items-center p-2 rounded hover:bg-zinc-800">
        <Plus size={18} />
        <button>
            Novo Documento
        </button>
    </Link>
  );
}

export default NewButton;