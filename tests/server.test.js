import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../server.js';

describe('HuertaHogare-a Server Tests', () => {
  it('GET /health debe retornar estado 200 y servicio correcto', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.service).toBe('HuertaHogare-a');
  });

  it('GET / debe servir el HTML con las variedades de plantines', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.text).toContain('Tomate Reliquia');
    expect(res.text).toContain('Tomate Kumato');
    expect(res.text).toContain('Ajíes Variados');
  });

  it('GET / debe incluir el enlace directo al WhatsApp 5491127504590', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.text).toContain('5491127504590');
    expect(res.text).toContain('6 horas de sol directo');
    expect(res.text).toContain('tierra o maceta grande');
  });

  it('GET /carteles.html debe responder con los carteles listos para imprimir (medidas Ziplock 15.5 x 8 cm)', async () => {
    const res = await request(app).get('/carteles.html');
    expect(res.status).toBe(200);
    expect(res.text).toContain('PLANTINES');
    expect(res.text).toContain('2.500');
    expect(res.text).toContain('7.500');
    expect(res.text).toContain('11.000');
    expect(res.text).toContain('Mini Kumato');
    expect(res.text).toContain('Morrón Rojo');
    expect(res.text).toContain('Ziplock');
  });
});
