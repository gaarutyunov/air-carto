import { Test, TestingModule } from '@nestjs/testing';

import { SqlBuilderService } from './sql-builder.service';

describe('SqlBuilderService', () => {
	let service: SqlBuilderService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [SqlBuilderService],
		}).compile();

		service = await module.resolve<SqlBuilderService>(SqlBuilderService);
	});

	it('should build simple select', async () => {
		const query = await service.build((builder) =>
			builder.select().field('*').from('table')
		);

		expect(query).toBe('select * from table');
	});
});
