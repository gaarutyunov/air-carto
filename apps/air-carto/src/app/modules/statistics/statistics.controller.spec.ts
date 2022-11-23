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
import { StatisticsModule } from './statistics.module';

describe('StatisticsController', () => {
	let app: INestApplication;
	const cartoService = {
		get: jest.fn().mockResolvedValueOnce({
			rows: [
				{
					co: 0.5174640660150058,
					station_id: 'aq_uam',
				},
				{
					co: 0.5177565426657756,
					station_id: 'aq_nevero',
				},
				{
					co: 0.5172752951409235,
					station_id: 'aq_aragoneses',
				},
				{
					co: 0.5176683940014911,
					station_id: 'aq_alcala_zamora',
				},
				{
					co: 0.5174305201682716,
					station_id: 'aq_jaen',
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
				StatisticsModule,
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

	it('/POST statistics', async () => {
		const response = await request(app.getHttpServer())
			.post('/statistics')
			.send({
				filter: {
					variable: 'co',
					timeRange: {
						from: '2015-01-01T00:00:00.000Z',
						to: '2018-12-31T23:59:59.999Z',
					},
					aggregate: 'avg',
				},
			});

		expect(response.status).toBe(200);
		expect(response.body).toEqual({
			hits: [
				{
					stationId: 'aq_uam',
					statistics: [
						{
							name: 'co',
							unit: 'μg/m3',
							value: 0.5174640660150058,
						},
					],
				},
				{
					stationId: 'aq_nevero',
					statistics: [
						{
							name: 'co',
							unit: 'μg/m3',
							value: 0.5177565426657756,
						},
					],
				},
				{
					stationId: 'aq_aragoneses',
					statistics: [
						{
							name: 'co',
							unit: 'μg/m3',
							value: 0.5172752951409235,
						},
					],
				},
				{
					stationId: 'aq_alcala_zamora',
					statistics: [
						{
							name: 'co',
							unit: 'μg/m3',
							value: 0.5176683940014911,
						},
					],
				},
				{
					stationId: 'aq_jaen',
					statistics: [
						{
							name: 'co',
							unit: 'μg/m3',
							value: 0.5174305201682716,
						},
					],
				},
			],
		});
	});
});
