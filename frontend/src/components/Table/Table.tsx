'use client'

import { Thead, TbodyContent, TbodyEmpty, Pagination } from "./"
import type { TableInterface } from "@/types/ui";

export const Table = <T extends { id: string },>({
    headers, 
    columns, 
    data, 
    actions, 
    notFoundMessage, 
    searchTerm, 
    pagination,
    filterCleaner,
    paginationClickHandler
  }: TableInterface<T>) =>  {


  const increase = pagination.per_page * (pagination.current_page - 1);

  return (
    <section className="table-responsive">
      <table className="table table-hover rounded shadow-sm">
        <Thead headers={headers} actions />
        
        <tbody>
          { data.length > 0
            ? <TbodyContent columns={columns} data={data} actions={actions} increase={increase} />  
            : <TbodyEmpty notFoundMessage={notFoundMessage} searchTerm={searchTerm} filterCleaner={filterCleaner} />
          }
        </tbody>
      </table>

      <Pagination 
        {...pagination} 
        paginationClickHandler={paginationClickHandler} 
      />

    </section>
  );
}