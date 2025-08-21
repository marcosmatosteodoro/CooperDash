import type { ThInterface } from "@/types/ui";

export const Th: React.FC<ThInterface> = ({header, className }) =>  (
  <th className={className}>
    {header}
  </th>
)