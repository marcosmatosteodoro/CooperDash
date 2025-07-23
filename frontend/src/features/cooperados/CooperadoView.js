import React, { useEffect, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCooperado } from '../../store/slices/cooperadosSlice';
import { useParams, Link } from 'react-router-dom';
import { LayoutContext } from '../../context/LayoutContext';
import useFormatters from '../../hooks/useFormatters';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorAlert from '../../components/ErrorAlert';
import NotFoundPage from '../../components/NotFoundPage';
import { texto } from '../../data/texts';

const CooperadoView = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { current, status, error } = useSelector(state => state.cooperados);
  const { setLayoutData } = useContext(LayoutContext);
  const { formatDocument, formatDate, formatCurrency } = useFormatters();

  useEffect(() => {
    dispatch(fetchCooperado(id));
  }, [dispatch, id]);

  useEffect(() => {
    setLayoutData(prev => ({
      ...prev,
      breadcrumbs: [
        { path: '/', label: 'Home' }, 
        { path: '/cooperados', label: 'Cooperados' }, 
        { path: `/cooperados/${id}`, label: current?.nome || 'Detalhes' }
      ],
      title: current?.nome ? `Detalhes: ${current.nome}` : 'Detalhes do Cooperado',
      icon: 'bi-person-badge',
      buttons: (
        <div className="d-flex gap-2">
          <Link className="btn btn-primary" to={`/cooperados/${id}/editar`}>
            <i className="bi bi-pencil-square me-2"></i>Editar
          </Link>
          <Link className="btn btn-outline-secondary" to="/cooperados">
            <i className="bi bi-arrow-left me-2"></i>Voltar para Lista
          </Link>
        </div>
      )
    }));
  }, [setLayoutData, current, id]);

  if (status === 'loading') return <LoadingSpinner />;
  if (error) return <ErrorAlert message={error} />;
  if (!current) return <NotFoundPage message="Cooperado não encontrado" />;

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <div className="row">
          <div className="col-md-6">
            <div className="mb-3">
              <h5 className="text-muted mb-3">
                <i className="bi bi-file-text me-2"></i>
                Informações Básicas
              </h5>
              <ul className="list-group list-group-flush">
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  <span className="fw-bold">{texto[current.tipo_pessoa].nome }:</span>
                  <span>{current.nome}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  <span className="fw-bold">Tipo:</span>
                  <span>{current.tipo_pessoa === 'FISICA' ? 'Pessoa Física' : 'Pessoa Jurídica'}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  <span className="fw-bold">{texto[current.tipo_pessoa].documento }:</span>
                  <span>{formatDocument(current.documento, current.tipo_pessoa)}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  <span className="fw-bold">{texto[current.tipo_pessoa].data }:</span>
                  <span>{formatDate(current.data)}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  <span className="fw-bold">{texto[current.tipo_pessoa].valor }:</span>
                  <span>{formatCurrency(current.valor)}</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="col-md-6">
            <div className="mb-3">
              <h5 className="text-muted mb-3">
                <i className="bi bi-telephone me-2"></i>
                Contato
              </h5>
              <ul className="list-group list-group-flush">
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  <span className="fw-bold">Telefone:</span>
                  <span>{current.codigo_pais} {current.telefone}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  <span className="fw-bold">Email:</span>
                  <a href={`mailto:${current.email}`} className="text-decoration-none">
                    {current.email}
                  </a>
                </li>
              </ul>
            </div>
            
            {current.observacoes && (
              <div className="mb-3">
                <h5 className="text-muted mb-3">
                  <i className="bi bi-chat-square-text me-2"></i>
                  Observações
                </h5>
                <div className="card">
                  <div className="card-body">
                    <p className="card-text">{current.observacoes}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        

      </div>
    </div>
  );
};

export default CooperadoView;