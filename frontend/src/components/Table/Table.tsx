'use client'

import { Thead, TbodyContent, TbodyEmpty } from "./"
import { TableInterface } from "./types"

export const Table = <T, >({headers, columns, data, actions, notFoundMessage, searchTerm, filterCleaner }: TableInterface<T>) =>  {
  return (
    <section className="table-responsive">
      <table className="table table-hover rounded shadow-sm">
        <Thead headers={headers} actions />
        
        <tbody>
          { data.length > 0
            ? <TbodyContent columns={columns} data={data} actions={actions} />  
            : <TbodyEmpty notFoundMessage={notFoundMessage} searchTerm={searchTerm} filterCleaner={filterCleaner} />
          }
        </tbody>
      </table>
    </section>
  );
}