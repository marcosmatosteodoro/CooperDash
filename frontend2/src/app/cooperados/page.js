'use client'

import { useEffect, useContext, useState, useMemo } from 'react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { useLayout } from '@/providers/LayoutProvider'
import { fetchCooperados, deleteCooperado } from '@/store/slices/cooperadosSlice';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorAlert from '@/components/ErrorAlert';
import useFormatters from '@/hooks/useFormatters';
import { texto } from '@/data/texts';


export default function Cooperadores() {
  const dispatch = useDispatch();
  const { list, status, error } = useSelector(state => state.cooperados);
  const { setLayoutData } = useLayout()
  const [filter, setFilter] = useState('TODOS');
  const [searchTerm, setSearchTerm] = useState('');
  const [tableHeader, setTableHeader] = useState([]);
  const { formatDocument, formatDate, formatCurrency } = useFormatters();

  useEffect(() => {
    dispatch(fetchCooperados());
  }, [dispatch]);

  useEffect(() => {
    setLayoutData(prev => ({
      ...prev,
      breadcrumbs: [
        { path: '/', label: 'Home' }, 
        { path: '/cooperados', label: 'Cooperados' }
      ],
      title: 'Lista de Cooperados',
      buttons: (
        <Link className="btn btn-primary" href="/cooperados/novo">
          <i className="bi bi-plus-circle me-2"></i>Novo Cooperado
        </Link>
      )
    }));
  }, [setLayoutData]);

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Tem certeza?',
      text: 'Deseja realmente excluir este cooperado?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim, excluir!',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteCooperado(id));
        Swal.fire('Excluído!', 'O cooperado foi excluído.', 'success');
      }
    });
  };
  
  useEffect(() => {
    let header;
    if(filter === 'TODOS') {
      header = ['#', 'Nome', 'Tipo', 'Documento', 'Data', 'Valor', 'Telefone', 'Email', 'Ações']
    } else {
      header = [
        '#', 
        texto[filter].nome,
        'Tipo',
        texto[filter].documento,
        texto[filter].data,
        texto[filter].valor,
        'Telefone',
        'Email',
        'Ações'
      ]
    }
    setTableHeader(header)
  }, [filter]);
  
  // Filtrar e buscar cooperados
  const filteredList = useMemo(() => {
    return list.filter(cooperado => {
      // Aplicar filtro por tipo
      const typeMatch = 
        filter === 'TODOS' || 
        (filter === 'FISICA' && cooperado.tipo_pessoa === 'FISICA') || 
        (filter === 'JURIDICA' && cooperado.tipo_pessoa === 'JURIDICA');
      
      // Aplicar busca
      const searchMatch = searchTerm === '' || 
        Object.values(cooperado).some(
          value => value && 
          value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );
      
      return typeMatch && searchMatch;
    });
  }, [list, filter, searchTerm]);
  
  if (status === 'loading') return <LoadingSpinner />;
  if (error) return <ErrorAlert message={error} />;

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        {/* Filtros e Busca */}
        <section className="mb-4">
          <div className="row align-items-center">
            <div className="col-md-8 mb-3 mb-md-0">
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Buscar cooperados..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="d-flex flex-wrap align-items-center gap-3">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="filter"
                    id="filter-all"
                    checked={filter === 'TODOS'}
                    onChange={() => setFilter('TODOS')}
                  />
                  <label className="form-check-label" htmlFor="filter-all">
                    Todos
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="filter"
                    id="filter-fisica"
                    checked={filter === 'FISICA'}
                    onChange={() => setFilter('FISICA')}
                  />
                  <label className="form-check-label" htmlFor="filter-fisica">
                    Físicas
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="filter"
                    id="filter-juridica"
                    checked={filter === 'JURIDICA'}
                    onChange={() => setFilter('JURIDICA')}
                  />
                  <label className="form-check-label" htmlFor="filter-juridica">
                    Jurídicas
                  </label>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tabela */}
        <section className="table-responsive">
          <table className="table table-hover rounded shadow-sm">
            <thead className="table-light rounded">
              <tr>

                {tableHeader.map((header, index) => (
                  <th key={index} className={index > 0 ? 'text-center' : ''}>
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredList.length > 0 ? (
                filteredList.map((cooperado, index) => (
                  <tr key={cooperado.id}>
                    <td>{index + 1}</td>
                    <td>
                      <Link href={`/cooperados/${cooperado.id}`} className="text-decoration-none">
                        {cooperado.nome}
                      </Link>
                    </td>
                    <td className="text-center">{cooperado.tipo_pessoa === 'FISICA' ? 'Física' : 'Jurídica'}</td>
                    <td className="text-center">{formatDocument(cooperado.documento, cooperado.tipo_pessoa)}</td>
                    <td className="text-center">{formatDate(cooperado.data)}</td>
                    <td className="text-center">{formatCurrency(cooperado.valor)}</td>
                    <td className="text-center">{`${cooperado.codigo_pais} ${cooperado.telefone}`}</td>
                    <td className="text-truncate" style={{ maxWidth: '150px' }}>
                      <a href={`mailto:${cooperado.email}`} className="text-decoration-none">
                        {cooperado.email}
                      </a>
                    </td>
                    <td className="text-center">
                      <div className="d-flex gap-2 justify-content-center">
                        <Link 
                          href={`/cooperados/${cooperado.id}/editar`} 
                          className="btn btn-sm btn-outline-primary"
                          title="Editar"
                        >
                          <i className="bi bi-pencil"></i>
                        </Link>
                        <button 
                          onClick={() => handleDelete(cooperado.id)}
                          className="btn btn-sm btn-outline-danger"
                          title="Excluir"
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="text-center py-4">
                    <div className="d-flex flex-column align-items-center">
                      <i className="bi bi-exclamation-circle text-muted fs-1 mb-2"></i>
                      <p className="text-muted">Nenhum cooperado encontrado</p>
                      {searchTerm && (
                        <button 
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() => setSearchTerm('')}
                        >
                          Limpar busca
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
}
