## retrofit
一款用于 OpenHarmony平台的HTTP客户端.

## 下载安装

```javascript
ohpm install @ohos/retrofit
```

OpenHarmony ohpm环境配置等更多内容，请参考 [如何安装OpenHarmony ohpm包](https://gitee.com/openharmony-tpc/docs/blob/master/OpenHarmony_har_usage.md)



### 使用说明

#### 创建HTTP请求类
    Retrofit parses HTTP Request class and provides method based api calling. 
    As shown below, Create Custom HTTP request class like "DataService" Extending "BaseService".
    Retrofit supports API declaration with Decorators, for example to make "GET" api call use @GET. Other api's supported are listed under "API Introduction" below.
    Use "retrofit" module to import retrofit apis.
    
``` javascript
 // Path注解由于和系统组件Path重名，会导致项目编译失败，所以在引用的时候需要修改Path为UrlPath
import {BaseService,ServiceBuilder,GET,POST,DELETE,PUT,UrlPath,Body,BasePath,Response,Header,Query} from '@ohos/retrofit';

//BasePath - Append "/" to basepath.
@BasePath("/")
class DataService extends BaseService{
  
  //GET Api call with Header and Query params
  @GET("get?test=arg123")
  async getRequest(@Header("Content-Type") contentType: string,@Query('d1') data1: string,@Query('d2') data2: number): Promise<Response<Data>> { return <Response<Data>>{} };

  //POST Api call with Header and Body info
  @POST("post")
  async postRequest(@Header("Content-Type") contentType: string,@Body user: User): Promise<Response<Data>> { return <Response<Data>>{} };

  //PUT Api call with Header and Body info
  @PUT("put")
  async putRequest(@Header("Content-Type") contentType: string,@Body user: User): Promise<Response<Data>> { return <Response<Data>>{} };

  //GET Api call with Header, Query and Path Param
  @GET("{req}?test=arg123")
  async getRequest2(@Header("Content-Type") contentType: string,@Query('d1') data1: string,@Query('d2') data2: number,@Path("req") requestPath: string): Promise<Response<Data>> { return <Response<Data>>{} };
}
```

#### 初始化Retrofit 服务和调用方法
    Initialize the Retrofit BaseService, Set End point and Call required apis by its method.

``` javascript
    const dataService = new ServiceBuilder()
      .setEndpoint("https://restapiservice.com")    //Base Url
      .build(DataService);

    dataService.getRequest("application/json","dat1",8).then((resp)=>{  //Get request with params
        console.log("getRequest Response =" + JSON.stringify(resp.result));
    }
```

### 接口说明

## BaseService.ServiceBuilder

| 接口名      | 参数                                        | 返回值         | 说明                 |
| ----------- | ------------------------------------------- | -------------- | -------------------- |
| setEndpoint | endpoint: string                            | ServiceBuilder | 设置基础url          |
| setTimeout  | timeout: number                             | ServiceBuilder | 设置请求超时时间     |
| build<T>    | service: new (builder: ServiceBuilder) => T | T**            | 构建retrofit基础服务 |

  ## BaseService

| 接口名      | 参数             | 返回值 | 说明             |
| ----------- | ---------------- | ------ | ---------------- |
| setEndpoint | endpoint: string | void   | 设置基础url      |
| clone       | 无               | void   | 复制基础服务请求 |



  ## Decorators

| 接口名          | 参数 | 返回值 | 说明                                          |
| --------------- | ---- | ------ | --------------------------------------------- |
| @GET            | 无   | void   | GET  HTTP方法装饰器                           |
| @POST           | 无   | void   | POST HTTP方法装饰器                           |
| @PUT            | 无   | void   | PUT  HTTP方法装饰器                           |
| @DELETE         | 无   | void   | DELETE HTTP方法装饰器                         |
| @HEAD           | 无   | void   | HEAD  HTTP方法装饰器                          |
| @OPTIONS        | 无   | void   | OPTIONS  HTTP方法装饰器                       |
| @BasePath       | 无   | void   | 用于追加基本路径的BasePath装饰器              |
| @Path           | 无   | void   | Path装饰器(Path注解由于和系统组件Path重名，会导致项目编译失败，所以在入口文件index.ets里面需要通过Path as UrlPath重命名Path为UrlPath)                                 |
| @Body           | 无   | void   | 用于解析请求体的Body装饰器                    |
| @Headers        | 无   | void   | 设置请求头的Headers装饰器                     |
| @Header         | 无   | void   | 设置单个请求头的Header装饰器                  |
| @HeaderMap      | 无   | void   | HeaderMap装饰器，用于将Header设置为map对象    |
| @Queries        | 无   | void   | 用于设置query列表的装饰器                     |
| @Query          | 无   | void   | 用于设置query的装饰器                         |
| @QueryMap       | 无   | void   | 用于在map中设置query的装饰器                  |
| @FormUrlEncoded | 无   | void   | FormUrlEncoded装饰器，用于启用formurlencoding |
| @Field          | 无   | void   | Field装饰器，用于为post方法设置Field          |
| @FieldMap       | 无   | void   | FieldMap装饰器，用于使用map对象设置Field      |
| @Timeout        | 无   | void   | Timeout装饰器，用于设置请求超时               |



## 约束与限制

在下述版本验证通过：

DevEco Studio 版本： 4.1 Canary(4.1.3.317), OpenHarmony SDK: API11 (4.1.0.36)
DevEco Studio NEXT Developer Preview2 ： 4.1.3.600, OpenHarmony SDK: API11 (5.0.0.19)

## 目录结构

```javascript
|---- retrofit  
|     |---- entry  # 示例代码文件夹
|     |---- library  # retrofit 库文件夹
|           |---- src # retrofit源码文件夹
|                 |---- # ets
|                         |---- # baseService.ts 服务的基类
|                         |---- # constants.ts 存放retrofit数据类型、interface等常量
|                         |---- # dataResolver.ts 基础数据解析器，支持的解析器类型为JSON和XML
|                         |---- # decorators.ts  装饰器，注解的封装
|           |---- index.ts  # retrofit对外接口
|     |---- README.MD  # 安装使用方法                   
```

## 贡献代码

使用过程中发现任何问题都可以提[Issue](https://gitee.com/openharmony-tpc/retrofit/issues) 给我们，当然，我们也非常欢迎你给我们提[PR](https://gitee.com/openharmony-tpc/retrofit/pulls)。

## 开源协议

本项目基于 [Apache License 2.0](https://gitee.com/openharmony-tpc/retrofit/blob/master/LICENSE)，请自由地享受和参与开源。

