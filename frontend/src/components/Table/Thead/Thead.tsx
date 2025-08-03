
import { TheadInterface } from "../types"
import { Th } from '../'

export const Thead: React.FC<TheadInterface> = ({headers, actions}) =>  (
  <thead className="table-light rounded">
    <tr>
      <Th header={'#'} />

      {headers.map((header, index) => 
        <Th key={index} header={header} className={"text-center"} /> 
      )}

      {actions && 
        <Th header={'Ações'} className={"text-center"} />
      }
    </tr>
  </thead>
)