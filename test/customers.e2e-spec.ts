import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { AppModule } from '../src/app.module';

describe('Customers (e2e)', () => {
  let app: INestApplication;
  let jwt: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // create user and login
    await request(app.getHttpServer())
      .post('/users')
      .send({ username: 'test', password: 'secret123' });

    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'test', password: 'secret123' });

    jwt = res.body.access_token;
  });

  afterAll(async () => {
    await app.close();
  });

  it('/customers (POST)', async () => {
    const res = await request(app.getHttpServer())
      .post('/customers')
      .set('Authorization', `Bearer ${jwt}`)
      .send({ name: 'John', surname: 'Doe', email: `john${Date.now()}@doe.com` })
      .expect(201);

    expect(res.body).toHaveProperty('id');
  });

  it('/customers (GET)', () => {
    return request(app.getHttpServer())
      .get('/customers')
      .set('Authorization', `Bearer ${jwt}`)
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBeTruthy();
      });
  });
}); 