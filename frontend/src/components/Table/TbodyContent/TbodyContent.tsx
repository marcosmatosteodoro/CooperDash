import Link from "next/link"
import { TbodyContentInterface, ColumnType } from "../types"
import { Td } from '../'

export const TbodyContent: React.FC<TbodyContentInterface> = ({columns, data, actions}) =>  (
  data.map((ressource, index) => 
    <tr key={ressource?.id || index}>
      <td>{index + 1}</td>

      {columns.map((column: ColumnType, index) => 
        <Td key={index} column={column} ressource={ressource} />
      )}

      <td className="text-center">
        <div className="d-flex gap-2 justify-content-center">
          { actions.edit && (
            <Link 
              href={actions.edit.href(ressource)} 
              className="btn btn-sm btn-outline-primary"
              title="Editar"
            >
              <i className="bi bi-pencil"></i>
            </Link>
          )}
          { actions.delete?.onClick && (
            <button 
              onClick={() => { actions.delete?.onClick(ressource) }}
              className="btn btn-sm btn-outline-danger"
              title="Excluir"
            >
              <i className="bi bi-trash"></i>
            </button>
          )}
        </div>
      </td>
    </tr>
  )
)