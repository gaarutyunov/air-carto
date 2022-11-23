import { of } from 'rxjs';

import { HttpModule, HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';

import { CartoService } from './carto.service';

describe('CartoService', () => {
	let service: CartoService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				CartoService,
				{
					provide: HttpService,
					useValue: {
						request: jest.fn().mockReturnValue(of({ data: {} })),
					},
				},
			],
			imports: [
				HttpModule.register({
					baseURL: 'https://test-url.loc',
					headers: {
						Authorization: 'Bearer test',
					},
				}),
			],
		}).compile();

		service = await module.resolve<CartoService>(CartoService);
	});

	it('should perform get request', async () => {
		const response = await service.get('/test');

		expect(response).toBeDefined();
	});

	it('should perform post request', async () => {
		const response = await service.post('/test', {});

		expect(response).toBeDefined();
	});

	it('should perform put request', async () => {
		const response = await service.put('/test', {});

		expect(response).toBeDefined();
	});

	it('should perform delete request', async () => {
		const response = await service.delete('/test');

		expect(response).toBeDefined();
	});

	it('should perform patch request', async () => {
		const response = await service.patch('/test', {});

		expect(response).toBeDefined();
	});
});
