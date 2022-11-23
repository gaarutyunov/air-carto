import { AxiosRequestConfig } from 'axios';
import { firstValueFrom } from 'rxjs';

import { HttpService as AxiosHttpService } from '@nestjs/axios';
import { Injectable, Scope } from '@nestjs/common';

/**
 * This service makes requests to CARTO API.
 */
@Injectable({ scope: Scope.REQUEST })
export class CartoService {
	constructor(private readonly _http: AxiosHttpService) {}

	public async get<T>(
		url: string,
		params?: Record<string, string>
	): Promise<T> {
		/**
		 * Perform GET request.
		 * @param url - URL to request.
		 * @param params - Query parameters.
		 */
		return await this.request<T>({ url, method: 'GET', params });
	}

	public async post<T, R>(
		url: string,
		data: R,
		params?: Record<string, string>
	): Promise<T> {
		/**
		 * Perform POST request.
		 * @param url - URL to request.
		 * @param data - Request body.
		 * @param params - Query parameters.
		 */
		return await this.request<T>({ url, method: 'POST', data, params });
	}

	public async put<T, R>(
		url: string,
		data: R,
		params?: Record<string, string>
	): Promise<T> {
		/**
		 * Perform PUT request.
		 * @param url - URL to request.
		 * @param data - Request body.
		 * @param params - Query parameters.
		 */
		return await this.request<T>({ url, method: 'PUT', data, params });
	}

	public async patch<T, R>(
		url: string,
		data: R,
		params?: Record<string, string>
	): Promise<T> {
		/**
		 * Perform PATCH request.
		 * @param url - URL to request.
		 * @param data - Request body.
		 * @param params - Query parameters.
		 */
		return await this.request<T>({ url, method: 'PATCH', data, params });
	}

	public async delete<T>(
		url: string,
		params?: Record<string, string>
	): Promise<T> {
		/**
		 * Perform DELETE request.
		 * @param url - URL to request.
		 * @param params - Query parameters.
		 */
		return await this.request<T>({ url, method: 'DELETE', params });
	}

	private async request<T>(config: AxiosRequestConfig): Promise<T> {
		/**
		 * Promises are used for simplicity here.
		 * Nevertheless, we could use observables for pagination or stream data.
		 * @param config - Request configuration.
		 */
		return await firstValueFrom(this._http.request(config)).then(
			(response) => response.data
		);
	}
}
