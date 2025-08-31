'use client'

import { Thead, TbodyContent, TbodyEmpty, Pagination, Filters } from "./"
import type { TableInterface } from "@/types/ui";

export const Table = <T extends { id: string },>({
    params,
    headers, 
    columns, 
    data, 
    actions, 
    notFoundMessage,
    placeholderFilter,
    searchTerm, 
    pagination,
    otherFilters,
    filter,
    paramsCleaner,
    filterCleaner,
    paginationClickHandler
  }: TableInterface<T>) =>  {

  const increase = pagination.per_page * (pagination.current_page - 1);
  const isSearchTerm = !!searchTerm;

  return (
    <>
      <section className="mb-4">
        <Filters 
          params={params}
          paramsCleaner={paramsCleaner}
          placeholderFilter={placeholderFilter}
          searchTerm={searchTerm}
          filter={filter}
        >
          {otherFilters}
        </Filters>
      </section>

      <section className="table-responsive">
        <table className="table table-hover rounded shadow-sm">
          <Thead headers={headers} actions />
          
          <tbody>
            { data.length > 0
              ? <TbodyContent columns={columns} data={data} actions={actions} increase={increase} />  
              : <TbodyEmpty notFoundMessage={notFoundMessage} isSearchTerm={isSearchTerm} filterCleaner={filterCleaner} />
            }
          </tbody>
        </table>

        <Pagination 
          {...pagination} 
          paginationClickHandler={paginationClickHandler} 
        />

      </section>
    </>
  );
}