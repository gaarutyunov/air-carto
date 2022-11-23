import * as request from 'supertest';

import {
	ClassSerializerInterceptor,
	INestApplication,
	ValidationPipe,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';

import { CartoService } from '../carto';
import { CoreModule } from '../core/core.module';
import { MapperModule } from '../mapper/mapper.module';
import { TimeSeriesModule } from './time-series.module';

describe('TimeSeriesController', () => {
	let app: INestApplication;
	const cartoService = {
		get: jest.fn().mockResolvedValueOnce({
			rows: [
				{
					co: 1,
					station_id: 'test',
					period: new Date('2017-01-01'),
				},
				{
					co: 1,
					station_id: 'test1',
					period: new Date('2017-01-01'),
				},
				{
					co: 1,
					station_id: 'test',
					period: new Date('2017-01-02'),
				},
			],
			schema: [
				{
					name: 'co',
					type: 'number',
				},
				{
					name: 'station_id',
					type: 'string',
				},
				{
					name: 'total',
					type: 'number',
				},
				{
					name: 'group_total',
					type: 'number',
				},
				{
					name: 'period',
					type: 'timestamp',
				},
			],
		}),
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [
				CoreModule.forRoot({
					tables: {
						statistics: 'test-table',
					},
					collection: 'test-collection',
				}),
				TimeSeriesModule,
				MapperModule,
			],
		})
			.overrideProvider(CartoService)
			.useValue(cartoService)
			.compile();

		app = module.createNestApplication();
		app.useGlobalInterceptors(
			new ClassSerializerInterceptor(app.get(Reflector))
		);
		app.useGlobalPipes(
			new ValidationPipe({
				transform: true,
			})
		);

		await app.init();
	});

	it('/POST ts', async () => {
		const response = await request(app.getHttpServer())
			.post('/ts')
			.send({
				filter: {
					variable: 'co',
					timeRange: {
						from: '2015-01-01T00:00:00.000Z',
						to: '2018-12-31T23:59:59.999Z',
					},
					aggregate: 'avg',
					step: '1 day',
				},
			});

		expect(response.status).toBe(200);
		expect(response.body).toEqual({
			hits: [
				{
					stationId: 'test',
					statistics: [
						{
							name: 'co',
							value: 1,
							unit: 'μg/m3',
							period: new Date('2017-01-01').toISOString(),
						},
						{
							name: 'co',
							value: 1,
							unit: 'μg/m3',
							period: new Date('2017-01-02').toISOString(),
						},
					],
				},
				{
					stationId: 'test1',
					statistics: [
						{
							name: 'co',
							value: 1,
							unit: 'μg/m3',
							period: new Date('2017-01-01').toISOString(),
						},
					],
				},
			],
		});
	});
});
