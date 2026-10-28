import { Plus } from "lucide-react";
import { Link } from "react-router-dom"

function NewButton() {
  return (
    <Link
      to="/"
      className="flex min-h-10 gap-2 items-center px-3 py-2 rounded-lg bg-indigo-500 text-sm font-medium text-white transition-colors duration-150 hover:bg-indigo-400"
    >
        <Plus size={18} aria-hidden="true" />
        Novo Documento
    </Link>
  );
}

export default NewButton;
