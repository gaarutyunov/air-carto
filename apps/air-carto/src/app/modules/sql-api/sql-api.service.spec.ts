import { Test, TestingModule } from '@nestjs/testing';

import { CartoService } from '../carto';
import { SqlApiService } from './sql-api.service';

describe('SqlApiService', () => {
	let service: SqlApiService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				SqlApiService,
				{
					provide: CartoService,
					useValue: {
						get: jest.fn().mockResolvedValue({
							rows: [],
							schema: [],
						}),
					},
				},
			],
		}).compile();

		service = await module.resolve<SqlApiService>(SqlApiService);
	});

	it('should execute query', async () => {
		const response = await service.executeQuery(
			'test',
			'SELECT * FROM table'
		);

		expect(response).toBeDefined();
	});
});
