import Link from "next/link"
import { TdInterface } from "../types"

export const Td: React.FC<TdInterface> = ({column, ressource}) => {
  const {className, type, attribute, style, href, formatter} = column;
  const customClass = className ?? 'text-center'
  const isText = !type || type == 'text'
  const isLink = type === 'link' && href
  let text = ressource[attribute];

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