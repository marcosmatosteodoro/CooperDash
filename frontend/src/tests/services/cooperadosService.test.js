import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import CooperadosService from '../../services/CooperadosService';
import apiClient from '../../api/apiClient';

describe('CooperadosService', () => {
  let mock;

  beforeAll(() => {
    mock = new MockAdapter(apiClient);
  });

  afterEach(() => {
    mock.reset();
  });

  afterAll(() => {
    mock.restore();
  });

  it('getAll: deve buscar todos os cooperados', async () => {
    const mockData = [{ id: 1, nome: 'João' }];
    mock.onGet('/cooperados').reply(200, mockData);

    const response = await CooperadosService.getAll();
    expect(response.status).toBe(200);
    expect(response.data).toEqual(mockData);
  });

  it('getById: deve buscar cooperado por ID', async () => {
    const mockData = { id: 1, nome: 'João' };
    mock.onGet('/cooperados/1').reply(200, mockData);

    const response = await CooperadosService.getById(1);
    expect(response.status).toBe(200);
    expect(response.data).toEqual(mockData);
  });

  it('create: deve criar um novo cooperado', async () => {
    const newData = { nome: 'Maria' };
    const mockResponse = { id: 2, ...newData };
    mock.onPost('/cooperados', newData).reply(201, mockResponse);

    const response = await CooperadosService.create(newData);
    expect(response.status).toBe(201);
    expect(response.data).toEqual(mockResponse);
  });

  it('update: deve atualizar um cooperado', async () => {
    const updatedData = { nome: 'Maria Atualizada' };
    const mockResponse = { id: 2, ...updatedData };
    mock.onPut('/cooperados/2', updatedData).reply(200, mockResponse);

    const response = await CooperadosService.update(2, updatedData);
    expect(response.status).toBe(200);
    expect(response.data).toEqual(mockResponse);
  });

  it('delete: deve deletar um cooperado', async () => {
    mock.onDelete('/cooperados/3').reply(204);

    const response = await CooperadosService.delete(3);
    expect(response.status).toBe(204);
  });
});
