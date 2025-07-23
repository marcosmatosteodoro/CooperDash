import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import { LayoutProvider } from './context/LayoutContext';
import Layout from './Layout';
import CooperadosList from './features/cooperados/CooperadosList';
import CooperadoView from './features/cooperados/CooperadoView';
import CooperadoForm from './features/cooperados/CooperadoForm';
import './App.css';

function App() {
  return (
    <Provider store={store}>
      <LayoutProvider>
      <Router>
          <Routes>
            <Route path="/" element={<Navigate to="/cooperados" replace />} />
            <Route element={<Layout />}>
              <Route path="/cooperados" element={<CooperadosList />} />
              <Route path="/cooperados/novo" element={<CooperadoForm />} />
              <Route path="/cooperados/:id" element={<CooperadoView />} />
              <Route path="/cooperados/:id/editar" element={<CooperadoForm />} />
            </Route>
          </Routes>
        </Router>
      </LayoutProvider>
    </Provider>
  );
}

export default App;