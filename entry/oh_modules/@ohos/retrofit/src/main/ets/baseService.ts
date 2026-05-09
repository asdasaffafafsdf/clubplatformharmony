/*
 * Copyright (c) 2021 Huawei Device Co., Ltd.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { DataResolverFactory } from './dataResolver';
import { HttpMethodOptions } from './decorators';
import http from '@ohos.net.http';
import { HttpClient, Request, RequestBody, TimeUnit, FormEncoder } from '@ohos/httpclient';
import { OkhttpRequestConfig } from './constants';
import hilog from '@ohos.hilog';

interface InternalResponse<T = any> {
  result: T;
  responseCode: number;
  header: any;
}

export interface Response<T = any> extends InternalResponse<T> {
  message(): string;

  code(): number;

  isSuccessful(): boolean;

  body(): any;
}

const NON_HTTP_REQUEST_PROPERTY_NAME = "__nonHTTPRequestMethod__";

export const nonHTTPRequestMethod = (target: any, methodName: string) => {
  const descriptor = {
    value: true,
    writable: false,
  };
  Object.defineProperty(target[methodName], NON_HTTP_REQUEST_PROPERTY_NAME, descriptor);
};

export class BaseService {
  public __meta__: any;
  private _endpoint: string;
  private _httpClient: HttpClient;
  private _methodMap: Map<string, Function>;
  private _connectTimeout: number;
  private _readTimeout: number;

  constructor(serviceBuilder: ServiceBuilder) {
    this._endpoint = serviceBuilder.endpoint;
    this._methodMap = new Map<string, Function>();
    this._connectTimeout = serviceBuilder.connectTimeout;
    this._readTimeout = serviceBuilder.readTimeout;
    this._httpClient = serviceBuilder.httpClient;
    const methodNames = this._getInstanceMethodNames();
    methodNames.forEach((methodName) => {
      this._methodMap[methodName] = this[methodName];
    });

    for (const methodName of methodNames) {
      const descriptor = {
        enumerable: true,
        configurable: true,
        get(): Function {
          const method = this._methodMap[methodName];
          const m1 = this.__meta__[methodName];
          const methodOriginalDescriptor = Object.getOwnPropertyDescriptor(method, NON_HTTP_REQUEST_PROPERTY_NAME);
          if (methodOriginalDescriptor && methodOriginalDescriptor.value === true) {
            return method;
          }
          return (...args: any[]) => {
            return this._wrap(methodName, args);
          };
        },
      };
      Object.defineProperty(this, methodName, descriptor);
    }
  }

  @nonHTTPRequestMethod
  public clone(): any {
    var obj = Object.create(this);
    if (!obj._httpClient) {
      obj._httpClient = new HttpClient.Builder().build();
    }
    return obj;
  }

  @nonHTTPRequestMethod
  public setEndpoint(endpoint: string): void {
    this._endpoint = endpoint;
  }

  @nonHTTPRequestMethod
  public setClient(client: HttpClient): void {
    this._httpClient = client;
  }


  @nonHTTPRequestMethod
  private _getInstanceMethodNames(): string[] {
    let properties: string[] = [];
    let obj = this;
    do {
      properties = properties.concat(Object.getOwnPropertyNames(obj));
      obj = Object.getPrototypeOf(obj);
    } while (obj);
    return properties.sort().filter((e, i, arr) => {
      return e !== arr[i + 1] && this[e] && typeof this[e] === "function";
    });
  }

  @nonHTTPRequestMethod
  private _wrap(methodName: string, args: any[]): Promise<Response> {
    const { url, method, headers, query, data } = this._resolveParameters(methodName, args);
    const config = this._makeConfig(methodName, url, method, headers, query, data);
    return sendRequest(config, this._httpClient);
  }

  @nonHTTPRequestMethod
  private _resolveParameters(methodName: string, args: any[]): any {
    const url = this._resolveUrl(methodName, args);
    const method = this._resolveHttpMethod(methodName);
    let headers = this._resolveHeaders(methodName, args);
    const query = this._resolveQuery(methodName, args);
    const data = this._resolveData(methodName, headers, args);
    if (headers["content-type"] && headers["content-type"].indexOf("multipart/form-data") !== -1) {
      //headers = { ...headers, ...(data as FormData).getHeaders() };
    }
    return {
      url,
      method,
      headers,
      query,
      data
    };
  }

  @nonHTTPRequestMethod
  private _makeConfig(methodName: string, url: string, method: typeof http.RequestMethod, headers: any, query: any, data: any): OkhttpRequestConfig {
    let config: OkhttpRequestConfig = {
      url,
      method,
      headers,
      params: query,
      data,
    };
    // response type
    if (this.__meta__[methodName].responseType) {
      config.responseType = this.__meta__[methodName].responseType;
    }
    // request transformer
    if (this.__meta__[methodName].requestTransformer) {
      config.transformRequest = this.__meta__[methodName].requestTransformer;
    }
    // response transformer
    if (this.__meta__[methodName].responseTransformer) {
      config.transformResponse = this.__meta__[methodName].responseTransformer;
    }
    // request connect Timeout
    config.connectTimeout = this.__meta__[methodName].connectTimeout || this._connectTimeout;

    // request read Timeout
    config.readTimeout = this.__meta__[methodName].readTimeout || this._readTimeout;
    // mix in config set by @Config
    config = {
      ...config,
      ...this.__meta__[methodName].config,
    };
    return config;
  }


  @nonHTTPRequestMethod
  private _resolveUrl(methodName: string, args: any[]): string {
    const meta = this.__meta__;
    const endpoint = this._endpoint;
    const basePath = meta.basePath;
    const path = meta[methodName].path;
    const pathParams = meta[methodName].pathParams;
    const options = meta[methodName].options || {};
    let urlArgIndex = -1;
    if (meta[methodName].urlIndex !== undefined) {
      urlArgIndex = meta[methodName].urlIndex;
    }
    let url = this.makeURL(endpoint, basePath, path, options);
    for (const pos in pathParams) {
      if (pathParams[pos]) {
        url = url.replace(new RegExp(`\{${pathParams[pos]}}`), args[pos]);
      }
    }
    if (urlArgIndex != -1) {
      url = args[urlArgIndex];
    }
    return url;
  }

  @nonHTTPRequestMethod
  private makeURL(endpoint: string, basePath: string, path: string, options: HttpMethodOptions): string {
    const isAbsoluteURL = /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(path);
    if (isAbsoluteURL) {
      return path;
    }
    if (options.ignoreBasePath) {
      return [endpoint, path].join("");
    }
    return [endpoint, basePath, path].join("");
  }

  @nonHTTPRequestMethod
  private _resolveHttpMethod(methodName: string): typeof http.RequestMethod {
    const meta = this.__meta__;
    return meta[methodName].method;
  }

  @nonHTTPRequestMethod
  private _resolveHeaders(methodName: string, args: any[]): any {
    const meta = this.__meta__;
    const headers = meta[methodName].headers || {};
    const headerParams = meta[methodName].headerParams;
    for (const pos in headerParams) {
      if (headerParams[pos]) {
        headers[headerParams[pos]] = args[pos];
      }
    }
    const headerMapIndex = meta[methodName].headerMapIndex;
    if (headerMapIndex >= 0) {
      for (const key in args[headerMapIndex]) {
        if (args[headerMapIndex][key]) {
          headers[key] = args[headerMapIndex][key];
        }
      }
    }
    return headers;
  }

  @nonHTTPRequestMethod
  private _resolveQuery(methodName: string, args: any[]): any {
    const meta = this.__meta__;
    const query = meta[methodName].query || {};
    const queryParams = meta[methodName].queryParams;
    for (const pos in queryParams) {
      if (queryParams[pos]) {
        query[queryParams[pos]] = args[pos];
      }
    }
    const queryMapIndex = meta[methodName].queryMapIndex;
    if (queryMapIndex >= 0) {
      for (const key in args[queryMapIndex]) {
        if (args[queryMapIndex][key]) {
          query[key] = args[queryMapIndex][key];
        }
      }
    }
    return query;
  }

  @nonHTTPRequestMethod
  private _resolveData(methodName: string, headers: any, args: any[]): any {
    const meta = this.__meta__;
    const bodyIndex = meta[methodName].bodyIndex;
    const fields = meta[methodName].fields || {};
    const parts = meta[methodName].parts || {};
    const fieldMapIndex = meta[methodName].fieldMapIndex;
    const gqlQuery = meta[methodName].gqlQuery;
    const gqlOperationName = meta[methodName].gqlOperationName;
    const gqlVariablesIndex = meta[methodName].gqlVariablesIndex;

    let data: any = {};

    // @Body
    if (bodyIndex >= 0) {
      if (Array.isArray(args[bodyIndex])) {
        data = args[bodyIndex];
      } else {
        if (typeof args[bodyIndex] != "object")
          data = args[bodyIndex].toString();
        else
          data = { ...data, ...args[bodyIndex] };
      }
    }

    // @Field
    if (Object.keys(fields).length > 0) {
      const reqData = {};
      for (const pos in fields) {
        if (fields[pos]) {
          reqData[fields[pos]] = args[pos];
        }
      }
      data = { ...data, ...reqData };
    }

    // @FieldMap
    if (fieldMapIndex >= 0) {
      const reqData = {};
      for (const key in args[fieldMapIndex]) {
        if (args[fieldMapIndex][key]) {
          reqData[key] = args[fieldMapIndex][key];
        }
      }
      data = { ...data, ...reqData };
    }

    // @MultiPart
    if (Object.keys(parts).length > 0) {
      const reqData = {};
      for (const pos in parts) {
        if (parts[pos]) {
          reqData[parts[pos]] = args[pos];
        }
      }
      data = { ...data, ...reqData };
    }

    // @GraphQL
    if (gqlQuery) {
      data.query = gqlQuery;
      if (gqlOperationName) {
        data.operationName = gqlOperationName;
      }
      // @GraphQLVariables
      if (gqlVariablesIndex >= 0) {
        data.variables = args[gqlVariablesIndex];
      }
    }

    const contentType = headers["content-type"] || "application/json";
    const dataResolverFactory = new DataResolverFactory();
    const dataResolver = dataResolverFactory.createDataResolver(contentType);
    return dataResolver.resolve(headers, data);
  }
}

export class ServiceBuilder {
  public endpoint: string = "";

  public connectTimeout: number = 10000;

  public readTimeout: number= 10000;

  public httpClient: HttpClient;

  public build<T>(service: new (builder: ServiceBuilder) => T): T {
    return new service(this);
  }

  public setEndpoint(endpoint: string): ServiceBuilder {
    this.endpoint = endpoint;
    return this;
  }

  public setConnectTimeout(timeout: number): ServiceBuilder {
    this.connectTimeout = timeout;
    return this;
  }

  public setClient(client: HttpClient): ServiceBuilder {
    this.httpClient = client;
    return this;
  }

  public setReadTimeout(timeout: number): ServiceBuilder {
    this.readTimeout = timeout;
    return this;
  }
}

async function sendRequest(config: OkhttpRequestConfig, client: HttpClient): Promise<Response> {
  try {
    var url = buildURL(config.url, config.params);
    var headers;
    if (null != config.headers) {
      headers = config.headers;
    }
    if (!client) {
      client = new HttpClient.Builder().setConnectTimeout(config.connectTimeout)
        .setReadTimeout(config.readTimeout / 1000, TimeUnit.SECONDS)
        .build();
    }

    let body = config.data;
    let requestObj = new Request.Builder();
    if (!body) {
      throw new Error("baseService.ts config.data is null");
    } else {
      if (config.headers['Content-Type'] === "application/x-www-form-urlencoded") {
        hilog.info(0x0000, "[__retrofit baseServices.ts ___]", "execute form-urlencoded");
        const builder: FormEncoder = buildFormEncoder(config.data);
        const feBody: RequestBody = builder.createRequestBody();
        requestObj.url(url).body(feBody);
      } else {
        body = RequestBody.create(body);
        requestObj.url(url).body(body);
      }
    }
    requestObj.headers(headers);
    requestObj.request(config.method);
    let resp = await client.newCall(requestObj.build()).execute();
    let header = JSON.parse(resp.header)
    let isJson : boolean = isContentTypeJson(header);
    let internalResp = resp.result;
    if (isJson && resp.result) {
      internalResp = JSON.parse(resp.result);
    }
    let message = '', isSuccessful = false;
    if (resp.responseCode >= 200 && resp.responseCode < 300) {
      message = 'Response.success()';
      isSuccessful = true;
    } else {
      message = 'Response.error()';
    }

    // Build response object
    const response: Response = {
      result: internalResp,
      responseCode: resp.responseCode,
      header: resp.header,
      code: () => resp.responseCode,
      isSuccessful: () => isSuccessful,
      message: () => message,
      body: () => internalResp
    };

    return forceCast(response);
  } catch (err) {
    throw err;
  }
}

function buildFormEncoder(data: object): FormEncoder | null {
  if (!data) {
    return null;
  } else {
    let builder = new FormEncoder.Builder();
    for (const [key, value] of Object.entries(data)) {
      builder = builder.add(key, value);
    }
    return builder.build()
  }
}

function buildURL(url, params) {
  if (!params) {
    return url;
  }
  var parts = [];
  var serializedParams;
  for (var key in params) {
    if (params.hasOwnProperty(key)) {
      parts.push(key + '=' + params[key]);
    }
  }
  serializedParams = parts.join('&');
  if (serializedParams) {
    return url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }
  return url;
}

function forceCast<T>(input: any): T {
  return input;
}

function isContentTypeJson(header: { [key: string]: string | undefined }): boolean {
  const contentType = header['Content-Type'] || header['content-type'];
  return contentType ? /(application\/json)(; charset=utf-8)?/i.test(contentType) : false;
}
