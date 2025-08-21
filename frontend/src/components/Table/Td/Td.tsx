import Link from "next/link"
import type { TdInterface } from "@/types/ui";

export const Td = <T,>({column, ressource}: TdInterface<T>) => {
  const {className, type, attribute, style, href, formatter} = column;
  const customClass = className ?? 'text-center'
  const isText = !type || type == 'text'
  const isLink = type === 'link' && href
  let text = ressource[attribute] as string;

  if(formatter) {
    text = formatter(ressource)
  }
  
  return (
    <td className={customClass} style={style}>
      {isText && text}
      
      {isLink && (
        <Link href={href(ressource)} className="text-decoration-none">
          {text}
        </Link>
      )}
    </td>
  )
}