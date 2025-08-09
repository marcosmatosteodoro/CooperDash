import Link from "next/link"
import { TbodyContentInterface, ColumnType } from "../types"
import { Td } from '../'

export const TbodyContent = <T,> ({columns, data, actions}: TbodyContentInterface<T>) =>  (
  data.map((ressource, index) => 
    <tr key={index + 1}>
      <td>{index + 1}</td>

      {columns.map((column: ColumnType<T>, index) => 
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