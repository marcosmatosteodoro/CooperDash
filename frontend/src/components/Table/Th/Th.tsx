import { ThInterface } from "../types"

export const Th: React.FC<ThInterface> = ({header, className }) =>  (
  <th className={className}>
    {header}
  </th>
)