import Axios, { AxiosResponse, AxiosRequestConfig } from 'axios';
import { EntityMetadata, ErrorInfo } from "../models";

export class BaseHttpService {
  private apiUrl: string;
  private defaultTimeout: number;
  protected config: AxiosRequestConfig;

  constructor(apiUrl: string, defaultTimeout: number = 10000) {
    this.apiUrl = apiUrl;
    this.defaultTimeout = defaultTimeout;
    this.initConfig();
  }

  protected async get<T>(url: string): Promise<T> {
    return Axios.get(url, this.config).then(this.handleResponse);
  }

  protected async post<TR, TS>(url: string, data: TR): Promise<TS> {
    return Axios.post<TS>(url, data, this.config).then(r => this.handleResponse<TS>(r));
  }

  protected async put<TR, TS>(url: string, data: TR): Promise<TS> {
    return Axios.put<TS>(url, data, this.config).then(r => this.handleResponse<TS>(r));
  }

  protected async patch<TR, TS>(url: string, data: TR): Promise<TS> {
    return Axios.patch<TS>(url, data, this.config).then(r => this.handleResponse<TS>(r));
  }
  protected async delete<T>(url: string): Promise<T> {
    return Axios.delete(url, this.config).then(this.handleResponse);
  }

  private handleResponse<T>(response: AxiosResponse<T>): Promise<T> {
    if (!response) {
      return Promise.reject(new EntityMetadata<T>(null, new ErrorInfo('EmptyServerResponse')));
    }

    if (response.status !== 200) {
      return Promise.reject(new EntityMetadata<T>(null, new ErrorInfo('ServerError', response.statusText)));
    }

    return Promise.resolve(response.data);
  }

  private initConfig() {
    this.config = {
      baseURL: this.apiUrl,
      timeout: this.defaultTimeout,
    };
  }
}