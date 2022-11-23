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
import { SpatialModule } from './spatial.module';

describe('SpatialController', () => {
	let app: INestApplication;
	const cartoService = {
		get: jest.fn().mockResolvedValueOnce({
			rows: [
				{
					co: 0.5174640660150058,
					station_id: 'aq_uam',
					affected_population: 100,
				},
				{
					co: 0.5177565426657756,
					station_id: 'aq_nevero',
					affected_population: 100,
				},
				{
					co: 0.5172752951409235,
					station_id: 'aq_aragoneses',
					affected_population: 100,
				},
				{
					co: 0.5176683940014911,
					station_id: 'aq_alcala_zamora',
					affected_population: 100,
				},
				{
					co: 0.5174305201682716,
					station_id: 'aq_jaen',
					affected_population: 100,
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
						statistics: 'test-statistics',
						stations: 'test-stations',
						population_geo: 'test-population-geo',
						population_data: 'test-population-data',
					},
					collection: 'test-collection',
				}),
				SpatialModule,
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

	it('/POST spatial', async () => {
		const response = await request(app.getHttpServer())
			.post('/spatial')
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
					affectedPopulation: 100,
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
					affectedPopulation: 100,
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
					affectedPopulation: 100,
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
					affectedPopulation: 100,
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
					affectedPopulation: 100,
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
