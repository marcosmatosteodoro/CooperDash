import apiClient from '../../api/apiClient';
import AxiosMockAdapter from 'axios-mock-adapter';

describe('apiClient', () => {
  let mock;

  beforeEach(() => {
    mock = new AxiosMockAdapter(apiClient);
  });

  afterEach(() => {
    mock.restore();
  });

  it('deve fazer GET com sucesso e retornar os dados', async () => {
    const mockData = { mensagem: 'ok' };

    mock.onGet('/exemplo').reply(200, mockData);

    const response = await apiClient.get('/exemplo');

    expect(response.status).toBe(200);
    expect(response.data).toEqual(mockData);
  });

  it('deve enviar headers corretos', async () => {
    mock.onGet('/headers-test').reply(config => {
      expect(config.headers['Content-Type']).toBe('application/json');
      expect(config.headers['Accept']).toBe('application/json');
      return [200, { sucesso: true }];
    });

    const response = await apiClient.get('/headers-test');
    expect(response.data.sucesso).toBe(true);
  });

  it('deve lidar com erro 404', async () => {
    mock.onGet('/nao-existe').reply(404, { erro: 'Não encontrado' });

    try {
      await apiClient.get('/nao-existe');
    } catch (error) {
      expect(error.response.status).toBe(404);
      expect(error.response.data.erro).toBe('Não encontrado');
    }
  });
});
