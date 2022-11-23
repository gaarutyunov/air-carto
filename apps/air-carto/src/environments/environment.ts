export const environment = {
	production: false,
	tables: {
		stations: 'cartodb-gcp-backend-data-team.code_test.airquality_stations',
		statistics:
			'cartodb-gcp-backend-data-team.code_test.airquality_measurements',
		population_data:
			'carto-data.ac_svhknbdi.sub_worldpop_demographics_population_esp_grid100m_v1_yearly_2010',
		population_geo:
			'carto-data.ac_svhknbdi.sub_worldpop_geography_esp_grid100m_v1',
	},
	envFilePath: '.env',
	collection: 'carto_dw',
	cors: {
		origin: '*',
		methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTION',
		allowedHeaders: 'Content-Type, Accept, Authorization',
		exposedHeaders: 'Content-Type, Accept, Authorization',
	},
};
