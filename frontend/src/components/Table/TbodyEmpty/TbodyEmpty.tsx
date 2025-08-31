import type { TbodyEmptyInterface } from "@/types/ui";

export const TbodyEmpty: React.FC<TbodyEmptyInterface> = ({ notFoundMessage, isSearchTerm, filterCleaner}: TbodyEmptyInterface) =>  (
  <tr>
    <td colSpan={9} className="text-center py-4">
      <div className="d-flex flex-column align-items-center">
        <i className="bi bi-exclamation-circle text-muted fs-1 mb-2"></i>
        <p className="text-muted">{notFoundMessage}</p>
        {isSearchTerm && (
          <button 
            className="btn btn-sm btn-outline-secondary"
            onClick={filterCleaner}
          >
            Limpar busca
          </button>
        )}
      </div>
    </td>
  </tr>
)