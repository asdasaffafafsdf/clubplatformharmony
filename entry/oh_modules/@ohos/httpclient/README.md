## httpclient

## Introduction

HTTP is the way for modern applications to exchange data and media over networks. httpclient is an efficient HTTP client in OpenHarmony that enables faster content loading and saves bandwidth. This project is developed on OKHTTP and has integrated the features of libraries such as android-async-http, AutobahnAndroid, and OkGo. It is dedicated to building an efficient, easy-to-use, and comprehensive network request library in OpenHarmony. The current version of httpclient is built on the network request capability and upload/download capability of the system and implements the following features:

- Global configuration of the debugging switch, timeout interval, common request headers, and request parameters, and chained calls

- Custom task scheduler that maintains a task queue to process synchronous/asynchronous requests

- Canceling requests by tag

- Setting of custom interceptors

- Redirection

- Client decompression

- File upload and download

- Cookie management

- Encryption and decryption of request content

- Custom requests

- Identity authentication

- Certificate verification

- Response caching

- Configuration of the **responseData** attribute for requests

- Request priority setting

- Certificate pinning

- Skip certificate verification

## How to Install

```
ohpm install @ohos/httpclient
```

For details about the OpenHarmony ohpm environment configuration, see [OpenHarmony HAR](https://gitcode.com/openharmony-tpc/docs/blob/master/OpenHarmony_har_usage.en.md).

## How to Use

Follow the instructions provided in this section. The original httpclient has been deprecated.

```
 Add the network request permissions to **module.json5** of the entry module.
 "requestPermissions": [
      {
        "name": "ohos.permission.INTERNET"
      },
      {
        "name": "ohos.permission.GET_NETWORK_INFO"
      }
    ]
```

```typescript
import { HttpClient,TimeUnit } from '@ohos/httpclient';
```

Obtain an **HttpClient** object and configure timeout values.

```typescript
this.client =new HttpClient.Builder()
    .setConnectTimeout(10, TimeUnit.SECONDS)
    .setReadTimeout(10, TimeUnit.SECONDS)
    .setWriteTimeout(10, TimeUnit.SECONDS)
    .build();

let status:string= "" // Response code.
let content:string= "" // Response content.
```

### GET Request Example

  ```typescript
import { HttpClient, Request,Logger } from '@ohos/httpclient';

// Set request parameters.
let request = new Request.Builder()
              .get("https://postman-echo.com/get?foo1=bar1&foo2=bar2")
              .addHeader("Content-Type", "application/json")
              .params("testKey1", "testValue1")
              .params("testKey2", "testValue2")
              .build();
  // Initiate a request.
  this.client.newCall(request).enqueue((result) => {
              if (result) {
                  this.status = result.responseCode.toString();
              }
              if (result.result) {
                this.content = result.result;
              } else {
                this.content = JSON.stringify(result);
              }
              Logger.info("onComplete -> Status : " + this.status);
              Logger.info("onComplete -> Content : " + JSON.stringify(this.content));
            }, (error)=> {
              this.status = error.code.toString();
              this.content = error.data;
              Logger.info("onError -> Error : " + this.content);
            });
  ```

### POST Request Example

```typescript
import { HttpClient, Request,RequestBody,Logger } from '@ohos/httpclient';

 let request: Request = new Request.Builder()
            .url("https://1.94.37.200:8080/user/requestBodyPost")
            .post(RequestBody.create(
                {
                    "email": "zhang_san@gmail.com",
                    "name": "zhang_san"
                }
                ,new Mime.Builder().contentType('application/json').build().getMime()))
            .ca([this.certData])
            .build();

 this.client.newCall(request).execute().then((result) => {
              if (result) {
                this.status = result.responseCode.toString();
              }
              if (result.result) {
                this.content = result.result;
              } else {
                this.content = JSON.stringify(result);
              }
              Logger.info("onComplete -> Status : " + this.status);
              Logger.info("onComplete -> Content : " + JSON.stringify(this.content));
            }).catch((error)=> {
              this.status = error.code.toString();
              this.content = error.data;
              Logger.error("onError -> Error : " + this.content);
            });
```

### Example of a POST Request with Two Parameters

  ```typescript
import { HttpClient, Request,RequestBody,Mime,Logger } from '@ohos/httpclient';  

let request = new Request.Builder()
              .url("https://postman-echo.com/post")
              .post(RequestBody.create({
                a: 'a1', b: 'b1'
              }, new Mime.Builder()
              .contentType('application/json', 'charset', 'utf8').build().getMime()))
              .build();
// Initiate a synchronous request.
  this.client.newCall(request).execute().then((result) => {
              if (result) {
                this.status = result.responseCode.toString();;
              }
              if (result.result) {
                this.content = result.result;
              } else {
                this.content = JSON.stringify(result);
              }
              Logger.info("onComplete -> Status : " + this.status);
              Logger.info("onComplete -> Content : " + JSON.stringify(this.content));
            }).catch((error)=> {
              this.status = error.code.toString();
              this.content = error.data;
              Logger.error("onError -> Error : " + this.content);
            });
  ```

### Example of Using FormEncoder as a POST Request

  ```typescript
    import { HttpClient, Request,FormEncoder,Logger } from '@ohos/httpclient';
    
    let formEncoder = new FormEncoder.Builder()
        .add("email","zhang_san@gmail.com")
        .add("name","zhang_san")
        .build();
    let feBody = formEncoder.createRequestBody();
    let request: Request = new Request.Builder()
        .url("https://1.94.37.200:8080/user/requestParamPost")
            // When sending a form request, set Content-Type of the header to application/x-www-form-urlencoded.
        .addHeader("Content-Type","application/x-www-form-urlencoded") 
        .post(feBody)
        .ca([this.certData])
        .build();
    
      this.client.newCall(request).execute().then((result) => {
          if (result) {
            this.status = result.responseCode.toString();
          }
          if (result.result) {
            this.content = result.result;
          } else {
            this.content = JSON.stringify(result);
          }
          Logger.info("onComplete -> Status : " + this.status);
          Logger.info("onComplete -> Content : " + JSON.stringify(this.content));
        }).catch((error)=> {
          this.status = error.code.toString();
          this.content = error.data;
          Logger.error("onError -> Error : " + this.content);
        });
  ```

### PUT Request Example

  ```typescript
import { HttpClient, Request, RequestBody,Logger } from '@ohos/httpclient';

let request: Request = new Request.Builder()
    .url("https://1.94.37.200:8080/user/createUser")
    .put(RequestBody.create(
        {
            "age": 0,
            "createTime": "2024-03-08T06:12:53.876Z",
            "email": "string",
            "gender": 0,
            "mobile": "string",
            "name": "string",
            "updateTime": "2024-03-08T06:12:53.876Z",
            "userUuid": "string"
        }, new Mime.Builder().contentType('application/json').build()))
    .ca([this.certData])
    .build();

 this.client.newCall(request).execute().then((result) => {
              if (result) {
                this.status = result.responseCode.toString();
              }
              if (result.result) {
                this.content = result.result;
              } else {
                this.content = JSON.stringify(result);
              }
              Logger.info("onComplete -> Status : " + this.status);
              Logger.info("onComplete -> Content : " + JSON.stringify(this.content));
            }).catch((error) => {
              this.status = error.code.toString();
              this.content = error.data;
              Logger.error("onError -> Error : " + this.content);
            });
  ```

### DELETE Request Example

  ```typescript
import { HttpClient, Request, RequestBody,Logger } from '@ohos/httpclient'; 

let request = new Request.Builder()
              .url("https://reqres.in/api/users/2")
              .delete()
              .build();

 this.client.newCall(request).execute().then((result) => {
      if (result) {
          this.status = result.responseCode.toString();
      }
      if (result.result) {
           this.content = result.result;
      } else {
           this.content = JSON.stringify(result);
      }
         Logger.info("onComplete -> Status : " + this.status);
         Logger.info("onComplete -> Content : " + JSON.stringify(this.content));
      }).catch((error) => {
         this.status = error.code.toString();
         this.content = error.data;
         Logger.error("onError -> Error : " + this.content);
      });
  ```

### Example of Canceling a Request by Tag

```typescript
import { HttpClient, Request, RequestBody,Logger } from '@ohos/httpclient';  

let request = new Request.Builder()
                  .get()
                  .url(this.echoServer)
                  .tag("tag123") // Set a tag for the request.
                  .addHeader("Content-Type", "application/json")
                  .build();

 this.client.newCall(request).enqueue((result) => {
      if (result) {
         this.status = result.responseCode.toString();
      }
      if (result.result)
         this.content = result.result;
       else
         this.content = JSON.stringify(result);
        }, (error) => {
         this.content = JSON.stringify(error);
    });

  this.client.cancelRequestByTag("tag123"); // Cancel the request by tag.
```

### File Upload Example

Obtain the path of the file to upload, generate the file to upload (you can skip this step or run commands to import the file), and process the file path.

  ```typescript
import { HttpClient, Request, FileUpload,Logger } from '@ohos/httpclient';

    let hereAbilityContext: Context = getContext();
    let hereCacheDir: string = hereAbilityContext.cacheDir;
    let hereFilesDir: string = hereAbilityContext.filesDir;

     const ctx = this
     Logger.info(" cacheDir   " + hereCacheDir)
     let filePath = hereCacheDir + fileName;
     Logger.info("   filePath   " + filePath)
     let fd = fs.openSync(filePath, fs.OpenMode.READ_WRITE | fs.OpenMode.CREATE)
     fs.truncateSync(fd.fd)
     fs.writeSync(fd.fd, "test httpclient")
     fs.fsyncSync(fd.fd)
     fs.closeSync(fd)

    Logger.info(" writeSync    ");
    Logger.info( "create file success   ")
	
	// Currently, only dataability and internal are supported for file upload.
	// In the case of internal, only temporary directories are supported. Example: internal:// cache/path/to/file.txt.          	  
	// You need to convert the obtained file path into a path in the format required by internal.
    filePath = filePath.replace(hereCacheDir, "internal://cache");

  ```

Start file upload.

```typescript
import { HttpClient, Request, FileUpload,Logger } from '@ohos/httpclient';

    let hereAbilityContext: Context = getContext();
    let hereCacheDir: string = hereAbilityContext.cacheDir;
    let hereFilesDir: string = hereAbilityContext.filesDir;
	// Generate a file upload object and pack the parameters.
    let fileUploadBuilder = new FileUpload.Builder()
      .addFile(filePath)
      .addData("name2", "value2")
      .build();

    Log.showInfo('about to set : abilityContext - cacheDir  = ' + hereCacheDir);
    Log.showInfo('about to Set : abilityContext - filesDir  = ' + hereFilesDir);
    Log.showInfo("type of :" + typeof hereAbilityContext)

	// Generate upload parameters.
    let request = new Request.Builder()
      .url(this.fileServer)
      .body(fileUploadBuilder)
      .setAbilityContext(hereAbilityContext)
      .build();

    this.client.newCall(request).execute().then((data) => {
        // Callback to listen for the upload progress.
      data.uploadTask.on('progress', (uploadedSize, totalSize) => {
        Logger.info('progress--->uploadedSize: ' + uploadedSize 
                     + ' ,totalSize--->' + totalSize);
        if (uploadedSize == totalSize){
			 Logger.info("upload success")
        }
      })
        // Callback invoked when the upload is complete.
      data.uploadTask.on('headerReceive', (headers) => {
        Logger.info( 'progress--->uploadSize: ' + JSON.stringify(headers));
      })
    }).catch((error)=> {
        this.status = "";
      this.content = error.data;
      Logger.error("onError -> Error : " + this.content);
    });
```

### File Download Example

  ```typescript
import { HttpClient, Request,Logger } from '@ohos/httpclient';

    let hereAbilityContext: Context = getContext();
    let hereFilesDir: string = hereAbilityContext.filesDir;

try {
      this.status = "";
      let fPath = hereFilesDir + "/sampleEnqueue.jpg";
     
     // fPath indicates the downloaded file path and is optional in the request. If it is not set, the downloaded file is saved in the cache directory by default.
      let request = new Request.Builder()
      .download("https://imgkub.com/images/2022/03/09/pexels-francesco-ungaro-15250411.jpg", fPath)
      .setAbilityContext(hereAbilityContext)
      .build();
      // Initiate a request.
      this.client.newCall(request).enqueue((data) => {
          // Set a listener to listen for download completion events.
          data.downloadTask.on('complete', () => {
           	Logger.info(" download complete");
           	this.content = "Download Task Completed";
           	});
            // Set a listener to listen for the download progress.
          data.downloadTask.on("progress", ( receivedSize, totalSize)=>{
          	 Logger.info(" downloadSize : "+receivedSize+" totalSize : "+totalSize);
           	 this.content = ""+(receivedSize/totalSize)*100;
           	});
           }, (error)=> {
                this.status = "";
                this.content = error.data;
                Logger.error("onError -> Error : " + this.content);
              });
            } catch (err) {
              Logger.error(" execution failed - errorMsg : "+err);
            }
  ```

### Example of Uploading a Binary File by Segment

Import and upload a file to the **cache** directory of the application, and run the **chown** command to modify the user permission.

    1. Query the physical path corresponding to the cache directory in the application sandbox path.
    2. Go to the physical path and change the permissions for files such as uoload.rar in the cache to the same user_id.
        2.1 Run the ps -ef | grep cn.openharmony.httpclient command to query the user_id. When running the command, use the actual bundle name. The first column in the query result is the user_id.
    3. Run the chown {user_id}:{user_id} uploar.rar command. In this example, run chown 20010042:20010042 upload.rar.

For details, see [Mapping Between Application Sandbox Paths and Physical Paths](https://gitcode.com/openharmony/docs/blob/master/en/application-dev/file-management/app-sandbox-directory.md#mapping-between-application-sandbox-paths-and-physical-paths).


Start file upload.

```typescript
  import { HttpClient, Request,BinaryFileChunkUpload,Logger } from '@ohos/httpclient';

    let hereAbilityContext: Context = getContext();
    let hereCacheDir: string = hereAbilityContext.cacheDir;
  
	// Path of the file to upload.
    let filePath: string = this.hereCacheDir + '/' + this.fileName
	let fileUploadBuilder = new BinaryFileChunkUpload.Builder()
      .addBinaryFile(hereAbilityContext, {
        filePath: filePath,
        fileName: this.fileName,
        chunkSize: 1024 * 1024 * 4,
        name: 'chunk'
      })
      .addData('filename', this.fileName)
      .addUploadProgress(this.uploadCallback.bind(this))
      .addUploadCallback(this.callStat.bind(this))
      .build();

    let request = new Request.Builder()
    .url(this.baseUrl + '/upload')
    .setAbilityContext(hereAbilityContext)
    .body(fileUploadBuilder)
    .build();

    this.client.newCall(request).execute();
```

### Example of Using an Interceptor

```typescript
import { Chain, Dns, HttpClient, Interceptor, Request, Response, TimeUnit, Utils,Logger } from '@ohos/httpclient';

// Use addInterceptor to add an interceptor.
// addInterceptor can be called multiple times to add multiple interceptors. The interceptors are invoked in the same order as they were added.
let request = new Request.Builder()
           		.url('https://postman-echo.com/post')
            	.post()
         		.body(RequestBody.create('test123'))
         		.setDefaultConfig(defaultConfigJSON)
         		.addInterceptor(new CustomInterceptor())
           		.build();
           		
   this.client.newCall(request).execute().then((result) => {
              if (result) {
                this.status = result.responseCode.toString();
              }
              if (result.result) {
                this.content = result.result;
              } else {
                this.content = JSON.stringify(result);
              }
              Logger.info("onComplete -> Status : " + this.status);
              Logger.info("onComplete -> Content : " + JSON.stringify(this.content));
            }).catch((error) => {
              this.status = error.code.toString();
              this.content = error.data;
              Logger.error("onError -> Error : " + this.content);
            }); 

```

```typescript
export class CustomInterceptor implements Interceptor {
  intercept(chain: Chain): Promise<Response> {
    return new Promise<Response>(function (resolve, reject) {
      let request = chain.requestI();
      Logger.info("request = " + request)
      let response = chain.proceedI(request)
      Logger.info("response = " + response)
      response.then((data) => {
        resolve(data)
      }).catch((err) => {
        reject(err)
      })
    })
  }
}
```

### Example of GZIP Decompression

Encode and decode the text on the client.

```typescript
import { FileUpload, gZipUtil, HttpClient, Mime, Request, RequestBody } from '@ohos/httpclient'

// Encode the text.
const test = "hello, GZIP! this is a gzip word";
let compressed = gZipUtil.gZipString(test);
// Decode the text.
let restored =   gZipUtil.ungZipString(JSON.parse(JSON.stringify(compressed)));
let result = "Decoded data: "+ restored

```

Encode a file on the client.

```typescript
// Encode a file.
let appInternalDir: string = this.getContext().cacheDir;
let encodeStr = "hello, GZIP! this is a gzip word"
let resourcePath = appInternalDir + "/hello.txt";
let gzipPath = appInternalDir + "/test.txt.gz";
let fd = fs.openSync(resourcePath, fs.OpenMode.READ_WRITE | fs.OpenMode.CREATE);
fs.truncateSync(fd.fd);
fs.writeSync(fd.fd, encodeStr);
fs.fsyncSync(fd.fd)
fs.closeSync(fd);
gZipUtil.gZipFile(resourcePath, gzipPath);

```

Decode a file on the client.

```typescript
// Decompress a string.
let appInternalDir = getContext().cacheDir;
let gzipPath = appInternalDir + "/test.txt.gz";
let dest = appInternalDir + "/hello2.txt";

await gZipUtil.ungZipFile(gzipPath, dest);

let fileID = fs.openSync(dest, fs.OpenMode.READ_WRITE | fs.OpenMode.CREATE)
// Obtain the file information.
let stat = fs.statSync(fileID.fd);
let size = stat.size // File size, in bytes.
let buf = new ArrayBuffer(size);
fs.readSync(fileID.fd, buf)
let textDecoder = new util.TextDecoder("utf-8", { ignoreBOM: true });
let decodedString = textDecoder.decode(new Uint8Array(buf), { stream: false });
let result='Decompression succeeded.'
result = '\nPath of the source file:' + gzipPath + '\n'
result += '\nPath of the decoded file:' + dest + '\n'
result += '\nFile size:' + size + ' byte' + '\n'
result += '\nDecoding result:' + decodedString + '\n'

```

```typescript
let test = "hello, GZIP! this is a gzip word";
let requestBody: RequestBody = RequestBody.create(test);
let request: Request = new Request.Builder()
    .url('http://www.yourserverfortest.com')
    .post(requestBody)
    // Add an Accept-Encoding request header for GZIP compression.
    .addHeader('Accept-Encoding', 'gzip')
    // Add the type of data to be transmitted after compression.
    .addHeader('Content-Type', 'application/octet-stream')
    // Convert the compressed data into a buffer object.
    .setGzipBuffer(true)
    .build();

this.client.newCall(request).execute().then((result) => {
    if (result.result) {
        Logger.info('Returned result: ' + result.result);
    } else {
        Logger.info('Returned result: ' + JSON.stringify(result));
    }
}).catch((err) => {
    Logger.error('Request status: ' + error.code.toString());
})
```

HTTP supports automatic decompression.

```typescript
let requestBody1 = RequestBody.create('your data', new Mime.Builder().build().getMime())
let request = new Request.Builder()
    .url('http://www.yourserverfortest.com')
    .post(requestBody1)
    .addHeader("Content-Type", "text/plain")
    .addHeader("Accept-Encoding", "gzip")
    .build();

this.client.newCall(request).enqueue((result) => {
    this.status = '\nReturned status: ' + result.responseCode + '\n';
    if (result.result) {
        this.content += '\nReturned result: ' + result.result + '\n';
        this.content += '\nReturned header: ' + JSON.stringify(result.header) + '\n';
    } else {
        this.content += '\nReturned result: ' + result.result + '\n';
    }
   
}, (error) => {
    this.status = 'Request status: ' + error.code.toString();
    this.content = error.data;
   
});
```

Upload a GZIP file using HTTP.

```typescript
let hereCacheDir: string = getContext().cacheDir;

let appInternalDir = hereCacheDir;
let destpath = appInternalDir + "/test2.txt.gz";
destpath = destpath.replace(hereCacheDir, "internal://cache");

let fileUploadBuilder = new FileUpload.Builder()
.addFile(destpath)
.addData("filename", "test2.txt")
.build();
let fileObject = fileUploadBuilder.getFile();
let dataObject = fileUploadBuilder.getData();

let request = new httpclient.Request.Builder()
.url('http://www.yourserverfortest.com')
.addFileParams(fileObject, dataObject)
.setAbilityContext(this.hereAbilityContext)
.build();
this.client.newCall(request).execute().then((data) => {
 data.uploadTask.on('progress', (uploadedSize, totalSize) => {
     Logger.info('Upload progress--->uploadedSize: ' + uploadedSize + ' ,totalSize--->' + totalSize);
     this.content = "Size already uploaded: " + uploadedSize + 'byte\n'
     if (uploadedSize >= totalSize) {
         Logger.info('Upload finished');
         this.content += "\nTotal size to upload: " + totalSize + 'byte\n'
         this.content += "\nPath of the file to upload: " + appInternalDir + "/test2.txt.gz\n"
     }
 })
 data.uploadTask.on('headerReceive', (headers) => {
     Logger.info('Upload--->headerReceive: ' + JSON.stringify(headers));
 })
 data.uploadTask.on('complete', (data) => {
     this.status = "Upload finished."
     this.status += "\nUpload result: "+ data[0].message
     Logger.info('Upload--->complete,data: ' + JSON.stringify(data));
 })
}).catch((error) => {
 this.status = "";
 this.content = error;
 Logger.error("onError -> Error : " + this.content);
});
```

Download a GZIP file using HTTP.

```typescript
let hereAbilityContext: Context = getContext();
let hereFilesDir: string = this.hereAbilityContext.filesDir;

this.downloadfile = this.hereFilesDir + '/yourserverUrlFileName';
let request = new Request.Builder()
    .download('http://www.yourserverfortest.com/yourserverUrlFileName')
    .setAbilityContext(this.hereAbilityContext)
    .build();
this.client.newCall(request).execute().then(async (data) => {
    data.downloadTask.on('progress', (receivedSize, totalSize) => {
        this.content = '\nSize already downloaded: ' + receivedSize + ' byte\n'
        this.content = '\nTotal size to download: ' + totalSize + ' byte\n'
        this.content += "\nPath of the file to download: " + this.downloadfile + '\n'
    })
    data.downloadTask.on('complete', async () => {
        let appInternalDir = this.hereFilesDir;
        let dest = appInternalDir + "/helloServer.txt";
        await gZipUtil.ungZipFile(this.downloadfile, dest);
        let fileID = fs.openSync(dest, fs.OpenMode.READ_WRITE | fs.OpenMode.CREATE)
        // Obtain the file information.
        let stat = fs.statSync(fileID.fd);
        let size = stat.size // File size, in bytes.
        let buf = new ArrayBuffer(size);
        fs.readSync(fileID.fd, buf)
        let textDecoder = new util.TextDecoder("utf-8", { ignoreBOM: true });
        let decodedString = textDecoder.decode(new Uint8Array(buf), { stream: false });
        this.status ='Download succeeded.'
        this.content += '\nDownloaded file content: ' + decodedString + '\n'
    })
}).catch((error) => {
    this.status = 'Request status: ' + error.code.toString();
    this.content = error.data;
    Logger.error("onError -> Error : " + JSON.stringify(error));
});

```

### Cookie Management Example

Initialize the module.

```typescript
import {CookieJar,CookieManager,CookiePolicy,CookieStore,HttpClient,Request,RequestBody,
  TimeUnit,Logger} from '@ohos/httpclient';
  let hereCacheDir: string = getContext().cacheDir;
  client: any = new HttpClient
    .Builder()
    .setConnectTimeout(10, TimeUnit.SECONDS)
    .setReadTimeout(10, TimeUnit.SECONDS)
    .build();
  cookieJar = new CookieJar();
  cookieManager = new CookieManager();
  store = new CookieStore(hereCacheDir);


```

Set cookie management parameters for the **HttpClient** object.

```typescript
  Logger.info("http cookiejarRequest request sending ");

  this.cookiemanager.setCookiePolicy(httpclient.CookiePolicy.ACCEPT_ALL); // Set a cache policy.
  this.cookiejar.setCookieStore(this.store); // Set a cookie store object.

  //first request to get the cookie
  let request1 = new Request.Builder()
        .get(this.commonServer) //Modify URL
        .tag("tag_cookie1")
        .cookieJar(this.cookiejar) // Set a cache object for the HttpClient object.
        .cookieManager(this.cookiemanager) // Set a cache policy management object for the HttpClient object.
        .addHeader("Content-Type", "application/json")
        .build();

   this.client.newCall(request1).enqueue(this.onComplete, this.onError);
```

Set an HttpClient request callback.

```typescript
    onComplete: function (result) {
        if (result.response) {
            this.status = result.response.responseCode;
        }
        if (result.response.result)
            this.content = result.response.result;
        else
            this.content = JSON.stringify(result.response);

        Logger.info("onComplete -> Content : " + JSON.stringify(this.content));
    }
    onError: function (error) {
        Logger.error("onError -> Error : " + error);
        this.content = JSON.stringify(error);
        Logger.error("onError -> Content : " + JSON.stringify(this.content));
    }
```

### Example of Encrypting and Decrypting Request Content

Import the crypto-js library.

```
	"dependencies": {
		"@ohos/crypto-js": "^1.0.2"
	}
```

Introduce the CryptoJS module.

```typescript
import { CryptoJS } from '@ohos/crypto-js'

const secretKey: string = 'abcd1234' 
```

Use AES to encrypt the request content and decrypt the response.
```typescript
import {HttpClient,Request,RequestBody,TimeUnit,Logger} from '@ohos/httpclient';

let request = new Request.Builder()
     .post()
     .body(RequestBody.create("test123"))
     .url(this.echoServer)
     .addInterceptor(new CustomInterceptor())
     .build();
		// Initiate a request.
        this.client.newCall(request).execute().then((result) => {
            if (result) {
              this.status = result.responseCode.toString();
            }
            if (result.result)
            this.content = result.result;
            else
            this.content = JSON.stringify(result.response);
        }).catch((error) => {
            this.content = JSON.stringify(error);
        });
```

```typescript
import {Interceptor,Chain,Response,Logger} from '@ohos/httpclient';

class CustomInterceptor implements Interceptor {
  intercept(chain: Chain): Promise<Response> {
    return new Promise<Response>(function (resolve, reject) {
      let request = chain.requestI();
      Logger.info("request = " + request)
      Logger.info("inside AES interceptor request" + JSON.stringify(request.body.content))
      let encrypted = CryptoJS.AES.encrypt(request.body.content, CryptoJS.enc.Utf8.parse(secretKey), {
        iv: CryptoJS.enc.Utf8.parse('0000000000'),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
        format: CryptoJS.format.Hex
      }).toString()
      request.body.content = encrypted;

      let response = chain.proceedI(request)
      Logger.info("response = " + response)
      response.then((data) => {
        resolve(data)
        Logger.info("inside AES interceptor response")
        let decrypted = CryptoJS.AES.decrypt(data.result, CryptoJS.enc.Utf8.parse(secretKey), {
          iv: CryptoJS.enc.Utf8.parse('0000000000'),
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7,
          format: CryptoJS.format.Hex
        }).toString()
        Logger.log("AES decrypt = " + decrypted);
        data.result = decrypted;
      }).catch((err) => {
        reject(err)
      })
    })
  }
}
```

### Custom Request Example

A custom synchronous request.

```typescript
import {HttpClient,Request,RequestBody,TimeUnit,Logger} from '@ohos/httpclient';

let request = new Request.Builder()
    .url("https:// postman-echo.com/post") // URL of the configuration.
    .post(RequestBody.create("test123"))
    .addHeader("Content-Type", "text/plain")
    .setEntryObj(new Weather()) // Set an entity object for the custom request.
    .build();

this.client.newCall(request)
    .executed() // Initiate a synchronous request.
    .then(result => { 
        // An object of the custom request type is obtained.
        Logger.info('Custom Request Result' + JSON.stringify(result));
    })
    .catch(err => {
        Logger.error('Custom Request Error' + JSON.stringify(err));
    });
```

A custom asynchronous request.

```typescript
 let request = new Request.Builder()
    .url("https:// postman-echo.com/post") // URL of the configuration.
    .post(RequestBody.create("test123"))
    .addHeader("Content-Type",  "text/plain")
    .setEntryObj(new Weather(), true) // Set an entity object for the custom request. In asynchronous mode, true must be passed in. Otherwise, a common request is executed.
    .build();

this.client.newCall(request)
    // Initiate an asynchronous request.
    .enqueue((result) => {
        // An object of the custom request type is obtained.
        Logger.info('Custom Request Result == ' + JSON.stringify(result));
    }, (error) => {
        Logger.error('Custom Request error == ' + JSON.stringify(error));
    })
```

### Example of multipart/form-data

Create a request body and use it to initialize a multipart generator.

```typescript
import {HttpClient,Request,RequestBody,MultiPart,TimeUnit,Mime,Logger} from '@ohos/httpclient';

let requestBody1 = RequestBody.create({Title: 'Multipart', Color: 'Brown'},new Mime.Builder().contentDisposition('form-data; name="myfile"').contentType('text/plain', 'charset', 'utf8').build().getMime())
let requestBody2 = RequestBody.create("HttpClient",new Mime.Builder().contentDisposition('form-data; name="http"').contentType('text/plain', 'charset', 'utf8').build().getMime())
let requestBody3 = RequestBody.create(data,new Mime.Builder().contentDisposition('form-data; name="file";filename="httpclient.txt"').contentType('text/plain', 'charset', 'utf8').build().getMime())
let boundary = "webKitFFormBoundarysioud821";

let multiPartObj = new MultiPart.Builder()
    .type(MultiPart.FORMDATA)
    .boundary(boundary)
    .addPart(requestBody1)
    .addPart(requestBody2)
    .addPart(requestBody3)
    .build();
let body = multiPartObj.createRequestBody();
```

Use the multipart generator in requests and responses.

```typescript
let request =  new Request.Builder()
    .url(this.echoServer)
    .post(body)
    .addHeader("Content-Type", "multipart/form-data")
    .params("LibName", "HttpClient-ohos")
    .params("Request", "MultiData")
    .build()
```

### Identity Authentication

Create client and request objects, and use the **NetAuthenticator** object to encrypt the username and password for identity authentication.

```typescript
import {HttpClient,Request,NetAuthenticator,TimeUnit,Mime,Logger} from '@ohos/httpclient';

let client = new HttpClient.Builder().setConnectTimeout(10,TimeUnit.SECONDS)
    .authenticator(new NetAuthenticator('jesse', 'password1'))
    .build();
 let request = new Request.Builder()
    .get("https://publicobject.com/secrets/hellosecret.txt")
    .addHeader("Content-Type", "application/json")
    .build();

 client.newCall(request).execute().then((result) => {
     Logger.info('authenticator:' + result.responseCode.toString())
     if (result) {
         Logger.info('authenticator:' + result.responseCode.toString())
     }
 })
```
### Certificate Verification

Save a certificate file to the **rawfile** directory under **resources**. For example, save the private key file **client_rsa_private.pem.unsecure** to **rawfile**.
```typescript
import  { HttpClient, RealTLSSocket, Request, StringUtil, TLSSocketListener, Utils } from '@ohos/httpclient';

let currentALPNProtocols = ["spdy/1", "http/1.1"]
let currentPasswd = "123456"
let currentSignatureAlgorithms = "rsa_pss_rsae_sha256:ECDSA+SHA256"
let currentCipherSuites = "AES256-SHA256"
let ifUseRemoteCipherPrefer = true
let protocols = [socket.Protocol.TLSv12]

let keyRes = 'client_rsa_private.pem.unsecure'
let certRes = 'client.crt'
let caRes = ['ca.crt']
let url = "https://106.15.92.248:5555"

let client = new HttpClient.Builder().build();
let realTlsSocet = new RealTLSSocket();

let hereResourceManager: resmgr.ResourceManager = getContext().resourceManager;

realTlsSocet.setLisenter(new TLSSocketListenerImpl(this.content))
realTlsSocet.setKeyDataByRes(hereResourceManager, keyRes, (errKey, resultKey) => {
})
.setCertDataByRes(hereResourceManager, certRes, (errCert, resulterrKey) => {
})
.setCaDataByRes(hereResourceManager, caRes, (errCa, resultCa) => {
})
.setUseRemoteCipherPrefer(ifUseRemoteCipherPrefer)
.setSignatureAlgorithms(currentSignatureAlgorithms)
.setCipherSuites(currentCipherSuites)
.setPasswd(currentPasswd)
.setProtocols(protocols)
.setALPNProtocols(currentALPNProtocols)

let request: Request = new Request.Builder().setTlsRequst(realTlsSocet).url(url).build();
client.newCall(request).execute()

class TLSSocketListenerImpl extends TLSSocketListener {

    constructor(content: string) {
    super(content);
}

onBind(err: string, data: string): void {
    if (!!!err) {
        this.content += '\ntlsSoket:onBind:data: Binding succeeded.'
        this.content += '\ntlsSoket:onBind:data: Connecting...'
    } else {
        this.content += '\ntlsSoket:onBind:err:' + JSON.stringify(err)
    }
}

onMessage(err: string, data: object): void {
    if (!!!err) {
      let bufferContent = buffer.from(data['message'])
      let unitString: ArrayBuffer = JSON.parse(JSON.stringify(bufferContent)).data;
      let resultData: ESObject = Utils.Utf8ArrayToStr(unitString);
      this.content += '\ntlsSoket:onMessage: Receiving a server message:' + JSON.stringify(resultData)
      this.content += '\ntlsSoket:onMessage: Server route: '+ JSON.stringify(data['remoteInfo'])
    } else {
        this.content += '\ntlsSoket:onMessage: Receiving a server message: err:' + JSON.stringify(err)
    }
}

onConnect(err: string, data: string) {
    if (!!!err) {
        this.content += '\ntlsSoket:onConnect:data:' + ((!!data && data != undefined) ? data: 'Connection succeeded.')
    } else {
        this.content += '\ntlsSoket:onConnect:err:' + JSON.stringify(err)
        if (err['code'] == 0) {
            this.content += '\ntlsSoket:onConnect:err: Failed to connect to the server. Check whether the server is available and whether the client is connected to the network.'
        }
    }
}

onSend(err: string, data: string) {
    if (!!!err) {
        this.content += '\ntlsSoket:onSend:data: Data sent successfully.'
    } else {
        this.content += '\ntlsSoket:onSend:err:' + JSON.stringify(err)
    }
}

onClose(err: string, data: string) {
    if (!!!err) {
        this.content += '\ntlsSoket:onClose:data:' + data
    } else {
        this.content += '\ntlsSoket:onClose:err:' + JSON.stringify(err)
    }
}

onError(err: string, data: string) {
    if (!!!err) {
        this.content += '\ntlsSoket:onError:data:' + data
    } else {
        this.content += '\ntlsSoket:onError:err:' + JSON.stringify(err)
        if (err['errorNumber'] = -1 || JSON.stringify(err).includes('951')) {
            this.content += '\ntlsSoket:onError:err: Failed to connect to the server. Check whether the server is available and whether the client is connected to the network.'
        }
    }
}

onVerify(verifyName: string, err: string, data: string) {
    if (!!!err) {
        this.content += '\n' + verifyName + ': Certificate verification passed.'
        this.content += '\nVerify certificate data: '+ data
    } else {
        this.content += '\n' + verifyName + ' err:' +JSON.stringify(err)
    }
    this.content += '\n'
}

setExtraOptions(err: string, data: string) {
    if (!!!err) {
        this.content += '\ntlsSoket:setExtraOptions:data: Setting succeeded.'
    } else {
        this.content += '\ntlsSoket:setExtraOptions:err:' + JSON.stringify(err)
    }
}

offConnect(err: string, data: string) {
    if (!!!err) {
        this.content += '\ntlsSoket:offConnect:data:' + data
    } else {
        this.content += '\ntlsSoket:offConnect:err:' + JSON.stringify(err)
    }
}

offClose(err: string, data: string) {
    if (!!!err) {
        this.content += '\ntlsSoket:offClose:data:' + data
    } else {
        this.content += '\ntlsSoket:offClose:err:' + JSON.stringify(err)
    }
}

offMessage(err: string, data: string) {
    if (!!!err) {
        this.content += '\ntlsSoket:offMessage:data:' + data
    } else {
        this.content += '\ntlsSoket:offMessage:err:' + JSON.stringify(err)
    }
}

offError(err: string, data: string) {
    if (!!!err) {
        this.content += '\ntlsSoket:offError:data:' + data
    } else {
        this.content += '\ntlsSoket:offError:err:' + JSON.stringify(err)
    }
  }
}

```

### Custom Certificate Verification

Save a certificate file to the **rawfile** directory under **resources**. For example, save the CA certificate file **ca.crt** to **rawfile**.

```typescript
let client: HttpClient = new HttpClient
  .Builder()
  .setConnectTimeout(10, TimeUnit.SECONDS)
  .setReadTimeout(10, TimeUnit.SECONDS)
  .build();
Logger.info(TAG, 'HttpClient end');
let context: Context = getContext();
let CA: string = await new GetCAUtils().getCA(this.ca, context);
Logger.info(TAG, 'request begin');
Logger.info(TAG, 'CA:', JSON.stringify(CA));
let request: Request = new Request.Builder()
  .url(this.url)
  .method('GET')
  .ca([CA])
  .build();
Logger.info(TAG, 'request end');
client.newCall(request)
  .checkCertificate(new SslCertificateManagerSuccess())
  .enqueue((result: Response) => {
    this.result = "Custom certificate returns a success, result: " + JSON.stringify(JSON.parse(JSON.stringify(result)), null, 4);
    Logger.info(TAG, "Custom certificate returns a success, result: " + JSON.stringify(JSON.parse(JSON.stringify(result)), null, 4));
  }, (err: Response) => {
    this.result = "Custom certificate returns a failure, result: " + JSON.stringify(err);
    Logger.info(TAG, "Custom certificate returns a failure, result:", JSON.stringify(err));
  });

export class SslCertificateManager implements X509TrustManager {
  checkServerTrusted(X509Certificate: certFramework.X509Cert): void {
    Logger.info(TAG, 'Get Server Trusted X509Certificate');
    // Value set when the time verification is successful.
    let currentDayTime = StringUtil.getCurrentDayTime();
    let date = currentDayTime + 'Z';
    try {
      X509Certificate.checkValidityWithDate(date); // Check the validity period of the X.509 certificate.
      console.error('checkValidityWithDate success');
    } catch (error) {
      console.error('checkValidityWithDate failed, errCode: ' + error.code + ', errMsg: ' + error.message);
      error.message = 'checkValidityWithDate failed, errCode: ' + error.code + ', errMsg: ' + error.message;
      throw new Error(error);
    }
  }

  checkClientTrusted(X509Certificate: certFramework.X509Cert): void {
    Logger.info(TAG, 'Get Client Trusted X509Certificate');
    let encoded = X509Certificate.getEncoded(); // Obtain the serialized data of the X.509 certificate.
    Logger.info(TAG, 'encoded: ', JSON.stringify(encoded));
    let publicKey = X509Certificate.getPublicKey(); // Obtain the public key of the X.509 certificate.
    Logger.info(TAG, 'publicKey: ', JSON.stringify(publicKey));
    let version = X509Certificate.getVersion(); // Obtain the version of the X.509 certificate.
    Logger.info(TAG, 'version: ', JSON.stringify(version));
    let serialNumber = X509Certificate.getCertSerialNumber(); // Obtain the serial number of the X.509 certificate.
    Logger.info(TAG, 'serialNumber: ', serialNumber);
    let issuerName = X509Certificate.getIssuerName(); // Obtain the issuer name of the X.509 certificate.
    Logger.info(TAG, 'issuerName: ', Utils.Uint8ArrayToString(issuerName.data));
    let subjectName = X509Certificate.getSubjectName(); // Obtain the subject name of the X.509 certificate.
    Logger.info(TAG, 'subjectName: ', Utils.Uint8ArrayToString(subjectName.data));
    let notBeforeTime = X509Certificate.getNotBeforeTime(); // Obtain the start time of the validity period of the X.509 certificate.
    Logger.info(TAG, 'notBeforeTime: ', notBeforeTime);
    let notAfterTime = X509Certificate.getNotAfterTime(); // Obtain the end time of the validity period of the X509 certificate.
    Logger.info(TAG, 'notAfterTime: ', notAfterTime);
    let signature = X509Certificate.getSignature(); // Obtain the signature data of the X.509 certificate.
    Logger.info(TAG, 'signature: ', Utils.Uint8ArrayToString(signature.data));
    let signatureAlgName = X509Certificate.getSignatureAlgName(); // Obtain the signing algorithm name of the X.509 certificate.
    Logger.info(TAG, 'signatureAlgName: ', signatureAlgName);
    let signatureAlgOid = X509Certificate.getSignatureAlgOid(); // Obtain the object identifier (OID) of the signing algorithm of the X.509 certificate.
    Logger.info(TAG, 'signatureAlgOid: ', signatureAlgOid);
    let signatureAlgParams = X509Certificate.getSignatureAlgParams(); // Obtain the signing algorithm parameters of the X509 certificate.
    Logger.info(TAG, 'signatureAlgParams: ', Utils.Uint8ArrayToString(signatureAlgParams.data));
    let keyUsage = X509Certificate.getKeyUsage(); // Obtain the key usage of the X.509 certificate.
    Logger.info(TAG, 'keyUsage: ', Utils.Uint8ArrayToString(keyUsage.data));
    let extKeyUsage = X509Certificate.getExtKeyUsage(); // Obtain the extended key usage of the X.509 certificate.
    Logger.info(TAG, 'extKeyUsage: ', JSON.stringify(extKeyUsage));
    let basicConstraints = X509Certificate.getBasicConstraints(); // Obtain the basic constraints of the X.509 certificate.
    Logger.info(TAG, 'basicConstraints: ', JSON.stringify(basicConstraints));
    let subjectAltNames = X509Certificate.getSubjectAltNames(); // Obtain the optional subject name of the X.509 certificate.
    Logger.info(TAG, 'subjectAltNames: ', JSON.stringify(subjectAltNames));
    let issuerAltNames = X509Certificate.getIssuerAltNames(); // Obtain the optional issuer name of the X.509 certificate.
    Logger.info(TAG, 'issuerAltNames: ', JSON.stringify(issuerAltNames));
    let tbs = X509Certificate.getItem(certFramework.CertItemType.CERT_ITEM_TYPE_TBS).data; // Obtain the To Be Signed (TBS) of the X.509 certificate.
    Logger.info(TAG, 'tbs: ', base64.fromByteArray(tbs));
    let pubKey = X509Certificate.getItem(certFramework.CertItemType.CERT_ITEM_TYPE_PUBLIC_KEY); // Obtain the public key of the X.509 certificate.
    Logger.info(TAG, 'pubKey: ', base64.fromByteArray(pubKey.data));
    let extensions = X509Certificate.getItem(certFramework.CertItemType.CERT_ITEM_TYPE_EXTENSIONS).data;
    Logger.info(TAG, 'extensions: ', base64.fromByteArray(extensions));
  }
}
```

### WebSocket API Request Example

```typescript
import { HttpClient, RealWebSocket, Request, TimeUnit, WebSocket, WebSocketListener,Logger } from '@ohos/httpclient';

class MyWebSocketListener implements WebSocketListener {

    onOpen(webSocket: RealWebSocket, response: string) {
        Logger.info("ws------onOpen");
    };

    onMessage(webSocket: RealWebSocket, text: string) {
        Logger.info("ws------onMessage");
    };

    onClosing(webSocket: RealWebSocket, code: number, reason: string) {
        Logger.info("ws------onClosing");
    };

    onClosed(webSocket: RealWebSocket, code: number, reason: string) {
        Logger.info("ws------onClosed");
    };

    onFailure(webSocket: RealWebSocket, e: Error, response?: string) {
        Logger.error("ws------onFailure--" + e.message);
    };
}


let client = new HttpClient
        .Builder()
        .setConnectTimeout(10, TimeUnit.SECONDS)
        .setReadTimeout(10, TimeUnit.SECONDS)
        .build();

let request = new Request.Builder()
        .url(this.url)
        .params("","")
        .params("","")
        .build();

// Initiate a WebSocket request.
ws = client.newWebSocket(request, new MyWebSocketListener(this.connectStatus, this.chatArr));

// Send a message to the server.
ws.send(this.msg).then((isSuccess) => {
  if (isSuccess) {
    this.chatArr.push(new User(1, this.msg))
    Logger.info("ws------sendMessage--success:");
  } else {
    Logger.error("ws------sendMessage--FAIL:");
  }
})

```

### Custom DNS Resolution

Use **lookup** of the **Dns** class to implement custom DNS resolution where only resolution is performed.

```typescript
import { Chain, Dns, HttpClient, Interceptor, Request, Response, TimeUnit, Utils,Logger } from '@ohos/httpclient';

export class CustomDns implements Dns {
  lookup(hostname: string): Promise<Array<connection.NetAddress>> {
    return new Promise((resolve, reject) => {
      connection.getAddressesByName(hostname).then((netAddress) => {
        resolve(netAddress)
      }).catch((err: BusinessError) => {
        reject(err)
      });
    })
  }
}

let client = new HttpClient.Builder()
        .dns(new CustomDns())
        .setConnectTimeout(10, TimeUnit.SECONDS)
        .setReadTimeout(10, TimeUnit.SECONDS)
        .build();

let request = new Request.Builder().url(this.url).build();

client.newCall(request).enqueue((result) => {
        Logger.info("dns---success---" + JSON.stringify(result));
                    }, (err) => {
    Logger.error("dns---failed---" + JSON.stringify(err));
});

```

Use **lookup** of the **Dns** class to implement custom DNS resolution where a custom DNS is passed in.
```typescript
import { Chain, Dns, HttpClient, Interceptor, Request, Response, TimeUnit, Utils,Logger } from '@ohos/httpclient';

export class CustomAddDns implements Dns {
  lookup(hostname: string): Promise<Array<connection.NetAddress>> {
    return new Promise((resolve, reject) => {
      connection.getAddressesByName(hostname).then((netAddress) => {
          netAddress.push({'address': 'xx.xx.xx.xx'});
          resolve(netAddress)
      }).catch((err: BusinessError) => {
        reject(err)
      });
    })
  }
}

let client = new HttpClient.Builder()
        .dns(new CustomDns())
        .setConnectTimeout(10, TimeUnit.SECONDS)
        .setReadTimeout(10, TimeUnit.SECONDS)
        .build();

let request = new Request.Builder().url(this.url).build();

client.newCall(request).enqueue((result) => {
        Logger.info("dns---success---" + JSON.stringify(result));
                    }, (err) => {
    Logger.error("dns---failed---" + JSON.stringify(err));
});
```

Use **lookup** of the **Dns** class to implement custom DNS resolution where a redirection DNS is involved.
```typescript
import { Chain, Dns, HttpClient, Interceptor, Request, Response, TimeUnit, Utils,Logger } from '@ohos/httpclient';

export class CustomAddDns implements Dns {
  lookup(hostname: string): Promise<Array<connection.NetAddress>> {
    return  new Promise((resolve, reject) => {
      connection.getAddressesByName(hostname).then((netAddress) => {
          netAddress = [{'address': 'xxx.xx.xx.xxx'}];
          resolve(netAddress)
      }).catch((err: BusinessError) => {
        reject(err)
      });
    })
  }
}

let client = new HttpClient.Builder()
        .dns(new CustomDns())
        .setConnectTimeout(10, TimeUnit.SECONDS)
        .setReadTimeout(10, TimeUnit.SECONDS)
        .build();

let request = new Request.Builder().url(this.url).build();

client.newCall(request).enqueue((result) => {
        Logger.info("dns---success---" + JSON.stringify(result));
                    }, (err) => {
    Logger.error("dns---failed---" + JSON.stringify(err));
});
```

Use the interceptor interface to implement custom DNS resolution.

```typescript
export class CustomInterceptor implements Interceptor {
    intercept(chain: Chain): Promise<Response> {
        return new Promise<Response>(function (resolve, reject) {
            let originRequest = chain.requestI();
            let url = originRequest.url.getUrl();
            let host = Utils.getDomainOrIp(url)
    connection.getAddressesByName(host).then(function (netAddress) {
                let newRequest = originRequest.newBuilder()
                if (!!netAddress) {
                    url = url.replace(host, netAddress[0].address)
                    newRequest.url(url)
                }
                let newResponse = chain.proceedI(newRequest.build())
                resolve(newResponse)
            }).catch(err => {
                resolve(err)
            });
        })
    }
}

let client = new HttpClient
        .Builder()
        // Set a custom interceptor.
        .addInterceptor(new CustomInterceptor())
        .setConnectTimeout(10, TimeUnit.SECONDS)
        .setReadTimeout(10,TimeUnit.SECONDS)
        .build();

let request = new Request.Builder().url(this.url).build();

client.newCall(request).enqueue((result) => {
        Logger.info("dns---success---" + JSON.stringify(result));
                    }, (err) => {
    Logger.error("dns---failed---" + JSON.stringify(err));
});
```

### Response Cache Example

Add a response cache.

```typescript
import {
    Cache,
    CacheControl,
    Dns,
    HttpClient,
    Logger,
    Request,
    Response,
    StringUtil,
    TimeUnit,
    Utils,
    X509TrustManager
} from '@ohos/httpclient';
import { Utils as GetCAUtils } from "../utils/Utils";

caPem = "noPassword/ca.pem";
let cache = new Cache.Cache(getContext().cacheDir, 10 * 1024 * 1024, getContext());
let httpClient = new HttpClient
    .Builder().dns(new CustomDns())
    .cache(cache)
    .setConnectTimeout(10000, TimeUnit.SECONDS)
    .setReadTimeout(10000, TimeUnit.SECONDS)
    .build();
let caFile: string = await new GetCAUtils().getCA(this.caPem, context);

// The server returns a header request.
let request = new Request.Builder()
    .get()
    .url('https://1.94.37.200:8080/cache/e/tag')
    .ca([caFile])
    .build();
// Manually set the header request.
request = new Request.Builder()
    .get()
    .url('https://1.94.37.200:8080/cache/max/age')
    .addHeader("Cache-Control", "max-age=30")
    .ca([caFile])
    .build();
// Manually set the cache request.
request = new Request.Builder()
    .get()
    .url('https://1.94.37.200:8080/cache/no/cache')
    .cacheControl(CacheControl.FORCE_CACHE())
    .ca([caFile])
    .build();

httpClient
    .newCall(request)
    .checkCertificate(new sslCertificateManager())
    .execute().then((result) => {
    // ...
})

export class CustomDns implements Dns {
    // ...
}

export class SslCertificateManager implements X509TrustManager {
    // ...
}

```

### Example of a Request for Configuring the responseData Attribute

Add a request for configuring the **responseData** attribute.

```typescript
import { HttpClient, Request, Logger, TimeUnit, Response , HttpDataType} from '@ohos/httpclient';

let client: HttpClient = new HttpClient.Builder()
    .setConnectTimeout(1000, TimeUnit.SECONDS)
    .setReadTimeout(1000, TimeUnit.SECONDS)
    .setWriteTimeout(1000, TimeUnit.SECONDS)
    .build();

let request = new Request.Builder()
    .get("https://postman-echo.com/get?foo1=bar1&foo2=bar2")
    .addHeader("Content-Type", "application/json")
    .setHttpDataType(HttpDataType.STRING)
    .build();

client.newCall(request).execute().then((result: Response) => {})

```

### Priority

Set the request priority.

```typescript
import { HttpClient, Request, Logger } from '@ohos/httpclient';

// Configure the request priority.
let request = new Request.Builder()
    .get('https://postman-echo.com/get?foo1=bar1&foo2=bar2')
    .setPriority(5)
    .build();
// Initiate a request.
this.client.newCall(request).enqueue((result) => {
    if (result) {
        this.status = result.responseCode.toString();
    }
    if (result.result) {
        this.content = result.result;
    } else {
        this.content = JSON.stringify(result);
    }
    Logger.info("onComplete -> Status : " + this.status);
    Logger.info("onComplete -> Content : " + JSON.stringify(this.content));
}, (error)=> {
    this.status = error.code.toString();
    this.content = error.data;
    Logger.info("onError -> Error : " + this.content);
});

```


### Network Event Listening

Set a network event listener.

```typescript
import { Dns, HttpClient, Request, Response, BusinessError, IOException, EventListener, HttpCall } from '@ohos/httpclient';

// Customize a network event listener.
let client = new HttpClient.Builder()
    .addEventListener(new HttpEventListener())
    .build();

let request = new Request.Builder()
    .get(this.url)
    .build();

client.newCall(request).execute().then((result) => {})

class HttpEventListener extends EventListener {
    protected startTime: number = 0;

    logWithTime(message: string) {
        const nosTime: number = new Date().getTime();
        if (message == 'callStart') {
          this.startTime = nosTime;
        }
        const elapsedTime: number = (nosTime - this.startTime) / 1000;
        Logger.info('Custom EventListener' + elapsedTime + ' ' + message );
    }
    
    callStart(call: HttpCall) {
        this.logWithTime('callStart');
    };
    
    requestHeadersStart(call: HttpCall) {
    	this.logWithTime('requestHeadersStart');
	}

	requestHeadersEnd(call: HttpCall, request: Request) {
	    this.logWithTime('requestHeadersEnd');
	}


  // ...

}

```

### Example of Certificate Pinning

Set certificate pinning.

```typescript
import {
    Dns,
    HttpClient,
    Request,
    Response,
    TimeUnit,
    CertificatePinnerBuilder
} from '@ohos/httpclient';
import { Utils } from "../utils/Utils";

let certificatePinner = new CertificatePinnerBuilder()
    .add('1.94.37.200', 'sha256/WAFcHG6pAINrztx343nlM3jYzLOdfoDS9pPgMvD2XHk=')
    .build()
let client: HttpClient = new HttpClient
    .Builder()
    .dns(new CustomDns())
    .setConnectTimeout(10, TimeUnit.SECONDS)
    .setReadTimeout(10, TimeUnit.SECONDS)
    .build();
let context: Context = getContext();
let CA: string = await new Utils().getCA('caPin.crt', context);
let request: Request = new Request.Builder()
    .url('https://1.94.37.200:8080/user/getUserByUuid?userUuid=1')
    .method('GET')
    .ca([CA])
    .build();
client.newCall(request)
    .setCertificatePinner(certificatePinner)
    .enqueue((result: Response) => {
        this.result = "Response result: success" + JSON.stringify(JSON.parse(JSON.stringify(result)), null, 4)
        Logger.info("Certificate pinning---success---" + JSON.stringify(JSON.parse(JSON.stringify(result)), null, 4));
    }, (err: BusinessError) => {
        this.result = "Response result: failed" + JSON.stringify(err)
        Logger.info("Certificate pinning---failed--- ", JSON.stringify(err));
    });
```
### Example of Skipping the certificate verification

```typescript
    let request: Request = new Request.Builder()
      .url("https://1.94.37.200:8080/user/requestBodyPost")
      .skipRemoteValidation(true)
      .post(body)
      .build();
    this.client.newCall(request)
      .execute()
      .then((result: Response) => {
        if (result) {
          this.status = result.responseCode.toString();
        }
        if (result.result) {
          this.content = result.result;
        } else {
          this.content = JSON.stringify(result);
        }
        Log.showInfo("onComplete -> Status : " + this.status);
        Log.showInfo("onComplete -> Content : " + JSON.stringify(this.content));
      })
      .catch((error: BusinessError<string>) => {
        this.status = error.code.toString();
        if (error.data != undefined) {
          this.content = error.data;
        }
        hilog.info(0x0001, "onError -> Error", this.content);
    });
```

### Example of Adding a Proxy

Add a proxy.

```typescript
import {Cache,Chain,DnsResolve,FormEncoder,HttpClient,Interceptor, Mime,MultiPart,Request,RequestBody,Response} from '@ohos/httpclient';

let client: HttpClient = new HttpClient
    .Builder()
    .setProxy(new Proxy(Type.HTTP,'xx.xx.xx.xx',80))
    .setConnectTimeout(10, TimeUnit.SECONDS)
    .setReadTimeout(10, TimeUnit.SECONDS)
    .build();
let request: Request = new Request.Builder()
    .url('http://publicobject.com/helloworld.txt')
    .method('GET')
    .build();

CacheClient.newCall(request).execute().then((result) => {})
```

### Link to OS Error Codes

https://gitcode.com/openharmony/docs/blob/master/en/application-dev/reference/apis-network-kit/js-apis-http.md#responsecode

## Available APIs

### Request.Builder

| API                  | Parameter                      | Return Value         | Description                                                                                                                                                                                                                                                                           |
| ------------------------ | -------------------------- | --------------- |---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| setAbilityContext        | abilityContext             | Request.Builder | Sets the context for upload and download parameters.                                                                                                                                                                                                                                  |
| convertor                | convertorType              | Request.Builder | Sets the convertor type, which is used to parse and convert the response result to the required type.                                                                                                                                                                                 |
| setCookieJar             | cookieJar                  | Request.Builder | Sets cookieJar to automatically obtain a cached cookie and set it to the request header.                                                                                                                                                                                              |
| setCookieManager         | cookieManager              | Request.Builder | Sets a cookie manager, which is used to set a cookie policy.                                                                                                                                                                                                                          |
| retryOnConnectionFailure | isRetryOnConnectionFailure | Request.Builder | Sets whether to retry upon a request failure.                                                                                                                                                                                                                                         |
| retryMaxLimit            | maxValue                   | Request.Builder | Sets the maximum number of retry attempts allowed for this request.                                                                                                                                                                                                                   |
| retryConnectionCount     | count                      | Request.Builder | Sets the number of retry attempts that have been initiated for this request.                                                                                                                                                                                                          |
| followRedirects          | aFollowRedirects           | Request.Builder | Sets whether redirection is allowed for this request.                                                                                                                                                                                                                                 |
| redirectMaxLimit         | maxValue                   | Request.Builder | Sets the maximum number of times that this request can be redirected.                                                                                                                                                                                                                 |
| redirectionCount         | count                      | Request.Builder | Sets the number of times that this request has been redirected.                                                                                                                                                                                                                       |
| addInterceptor           | req, resp                  | Request.Builder | Adds an interceptor. The **req** parameter indicates a request interceptor, and **resp** indicates a response interceptor. This API can be called multiple times to add multiple interceptors. The parameter can be empty.                                                            |
| headers                  | value                      | Request.Builder | Sets a header for this request.                                                                                                                                                                                                                                                       |
| cache                    | value                      | Request.Builder | Sets a cache for this request.                                                                                                                                                                                                                                                        |
| addHeader                | key, value                 | Request.Builder | Adds parameters to the request header.                                                                                                                                                                                                                                                |
| setDefaultUserAgent      | value                      | Request.Builder | Sets the default user agent for this request. The user agent is a special string header, which enables the server to identify the operating system and its version, CPU type, browser and its version, browser rendering engine, browser language, and browser plugin used by a user. |
| setDefaultContentType    | value                      | Request.Builder | Sets the default media type for this request.                                                                                                                                                                                                                                         |
| body                     | value                      | Request.Builder | Sets a body for this request.                                                                                                                                                                                                                                                         |
| url                      | value                      | Request.Builder | Sets a URL for this request.                                                                                                                                                                                                                                                          |
| tag                      | value                      | Request.Builder | Sets a tag for this request. Requests can be canceled by tag.                                                                                                                                                                                                                         |
| method                   | value                      | Request.Builder | Sets a method for this request.                                                                                                                                                                                                                                                       |
| params                   | key, value                 | Request.Builder | Sets parameters for this request. The parameters are added to the end of the URL.                                                                                                                                                                                                     |
| addFileParams            | files, data                | Request.Builder | Adds file upload parameters to this request.                                                                                                                                                                                                                                          |
| setFileName              | name                       | Request.Builder | Sets a file name for this request. It is used for download requests.                                                                                                                                                                                                                  |
| get                      | url                        | Request.Builder | Sets the method of this request as GET. If the **url** parameter is not empty, you must also set the request URL.                                                                                                                                                                     |
| put                      | body                       | Request.Builder | Sets the method of this request as PUT. If the **body** parameter is not empty, you must also set the request body.                                                                                                                                                                   |
| delete                   | N/A                      | Request.Builder | Sets the method of this request as DELETE.                                                                                                                                                                                                                                            |
| head                     | N/A                      | Request.Builder | Sets the method of this request as HEAD.                                                                                                                                                                                                                                              |
| options                  | N/A                      | Request.Builder | Sets the method of this request as OPTIONS.                                                                                                                                                                                                                                           |
| post                     | body                       | Request.Builder | Sets the method of this request as POST. If the **body** parameter is not empty, you must also set the request body.                                                                                                                                                                  |
| upload                   | files, data                | Request.Builder | Sets the method of this request as UPLOAD. You must also set the parameters **files** and **data**.                                                                                                                                                                                   |
| download                 | url,filename               | Request.Builder | Sets the method of this request as DOWNLOAD. If the **filename** parameter is not empty, you must also set a file name.                                                                                                                                                               |
| trace                    | N/A                      | Request.Builder | Sets the method of this request as TRACE.                                                                                                                                                                                                                                             |
| connect                  | N/A                      | Request.Builder | Sets the method of this request as CONNECT.                                                                                                                                                                                                                                           |
| setDefaultConfig         | defaultConfig              | Request.Builder | Adds the default configuration to this request, including setting the default **content_type** and **user_agent**. You can import a JSON file as the global configuration.                                                                                                            |
| build                    | N/A                      | Request.Builder | Constructs a request object based on the configured parameters.                                                                                                                                                                                                                       |
| setEntryObj              | value,flag                 | Request.Builder | Sets a custom request object. The first parameter is an empty object of the custom entity. The second parameter must be set to **true** for an asynchronous custom request. For a synchronous request, this parameter can be set to **false** (default value) or left unspecified.    |
| setHttpDataType          | HttpDataType               | Request.Builder | Sets the data type of the response. By default, data of the string type is returned.                                                                                                                                                                                                  |
| setPriority              | number                     | Request.Builder | Sets the priority for this request.                                                                                                                                                                                                                                                   |
| skipRemoteValidation     | boolean                    | Request.Builder | The current request sets whether to skip certificate validation, which defaults to false                                                                                                                                                                                                                       |

### HttpClient.Builder

| API           | Parameter                          | Return Value            | Description                                                        |
| ----------------- | ------------------------------ | ------------------ | ------------------------------------------------------------ |
| addInterceptor    | aInterceptor                   | HttpClient.Builder | Adds an interceptor for this HTTP request client to perform special operations before initiating a request or after obtaining the corresponding data.|
| authenticator     | aAuthenticator                 | HttpClient.Builder | Adds identity authentication for this HTTP request client. You can add information such as the account and password to the request header.|
| setConnectTimeout | timeout, unit                  | HttpClient.Builder | Sets the connection timeout interval for this HTTP request client.                            |
| setReadTimeout    | timeout, unit                  | HttpClient.Builder | Sets the read timeout interval for this HTTP request client.                            |
| setWriteTimeout   | timeout, unit                  | HttpClient.Builder | Sets the write timeout interval for this HTTP request client.                            |
| _setTimeOut       | timeout, timeUnit, timeoutType | HttpClient.Builder | Sets the timeout interval for this HTTP request client. The **timeoutType** parameter specifies the timeout interval type, which can be connection timeout interval, read timeout interval, or write timeout interval.|
| build             | N/A                          | HttpClient.Builder | Builds an HTTP client object.                                      |
| dns               | dns: Dns                       | HttpClient.Builder | Configures a custom DNS for resolution.                                           |
| addEventListener  | EventListener                  | HttpClient.Builder | Adds a network event listener.                                            |
| setProxy          | type,host,port                 | HttpClient.Builder | Sets a proxy. |
### HttpCall

| API              | Parameter             | Return Value    | Description                              |
| -------------------- | ----------------- | ---------- | ---------------------------------- |
| getRequest           | N/A             | Request    | Obtains a request object of this request task.        |
| getClient            | N/A             | HttpClient | Obtains a request client of this request task.      |
| execute              | N/A             | Promise    | Initiates a synchronous request for this request task.          |
| enqueue              | N/A             | N/A      | Initiates an asynchronous request for this request task.          |
| getSuccessCallback   | N/A             | Callback   | Obtains the callback for a request success of this request task.|
| getFailureCallback   | N/A             | Callback   | Obtains the callback for a request failure of this request task.|
| cancel               | N/A             | N/A      | Cancels this request task.                  |
| isCancelled          | N/A             | Boolean    | Checks whether this request task is canceled.    |
| executed             | N/A             | Promise    | Initiates a synchronous request for this custom request task.    |
| checkCertificate     | X509TrustManager  | HttpCall   | Sets a verification function for a custom certificate.            |
| setCertificatePinner | certificatePinner | HttpCall   | Sets certificate pinning.                      |

### X509TrustManager

| API            | Parameter                  | Return Value| Description          |
| ------------------ | ---------------------- | ------ | -------------- |
| checkClientTrusted | certFramework.X509Cert | void   | Verifies a client certificate.|
| checkServerTrusted | certFramework.X509Cert | void   | Verifies a server certificate.|

### WebSocket

| API   | Parameter                     | Return Value          | Description            |
| --------- | ------------------------- | ---------------- | ---------------- |
| request   | N/A                     | Request          | Obtains a request.     |
| queueSize | N/A                     | number           | Obtains the queue size.    |
| send      | text: string  ArrayBuffer | Promise\<boolean> | Sends a message to the server.|
| close | code: number, reason?: string | Promise\<boolean> | Closes a connection. |
### WebSocket

### WebSocketListener

| API   | Parameter                                               | Return Value| Description                       |
| --------- | --------------------------------------------------- | ------ | --------------------------- |
| onOpen    | webSocket: RealWebSocket, response: string          | void   | Called when a WebSocket connection is established.  |
| onMessage | webSocket: RealWebSocket, text: string  ArrayBuffer | void   | Called when the WebSocket server responds.|
| onClosed         | webSocket: RealWebSocket, code: number, reason: string | void       |  Called when a WebSocket connection is closed.   |
| onFailure   | webSocket: RealWebSocket, e: Error, response?: string   | void      | Called when a WebSocket connection fails.   |

### RealWebSocket

| API   | Parameter                     | Return Value          | Description            |
| --------- | ------------------------- | ---------------- | ---------------- |
| request   | N/A                     | Request          | Obtains a request.     |
| queueSize | N/A                     | number           | Obtains the queue size.    |
| send      | text: string  ArrayBuffer | Promise\<boolean> | Sends a message to the server.|
| close | code: number, reason?: string | Promise\<boolean> | Closes a connection. |
### WebSocket

### RequestBody

| API| Parameter                                          | Return Value     | Description               |
| ------ | ---------------------------------------------- | ----------- | ------------------- |
| create | content : String/JSON Object of Key:Value pair | RequestBody | Creates a request body object.|

### RequestBuilder

| API         | Parameter                    | Return Value        | Description                    |
| --------------- | ------------------------ | -------------- | ------------------------ |
| buildAndExecute | N/A                      | void           | Builds and executes a request builder.|
| newCall         | N/A                      | void           | Executes a request.                |
| header          | name:String,value:String | RequestBuilder | Creates a request header with the passed in keys and values.|
| connectTimeout  | timeout:Long             | RequestBuilder | Sets a connection timeout interval.        |
| url             | value:String             | RequestBuilder | Sets a request URL.             |
| GET             | N/A                      | RequestBuilder | Creates a GET request method.         |
| PUT             | body:RequestBody         | RequestBuilder | Creates a PUT request method.         |
| DELETE          | N/A                      | RequestBuilder | Creates a DELETE request method.      |
| POST            | N/A                      | RequestBuilder | Creates a POST request method.        |
| UPLOAD          | files:Array, data:Array  | RequestBuilder | Creates an UPLOAD request method.      |
| CONNECT         | N/A                      | RequestBuilder | Creates a CONNECT request method.     |

### MimeBuilder

| API     | Parameter        | Return Value| Description                         |
| ----------- | ------------ | ------ | ----------------------------- |
| contentType | value:String | void   | Adds a content type.|

### FormEncodingBuilder

| API| Parameter                    | Return Value| Description                |
| ------ | ------------------------ | ------ | -------------------- |
| add    | name:String,value:String | void   | Adds parameters in key-value pairs.|
| build  | N/A                      | void   | Obtains a request body object. |

### FileUploadBuilder

| API   | Parameter                    | Return Value| Description                       |
| --------- | ------------------------ | ------ | --------------------------- |
| addFile   | furi : String            | void   | Adds a file URI for uploading.|
| addData   | name:String,value:String | void   | Adds request data in key-value pairs.   |
| buildFile | N/A                      | void   | Generates a file object for uploading.     |
| buildData | N/A                      | void   | Builds data to upload.         |

### BinaryFileChunkUploadBuilder

| API           | Parameter                              | Return Value| Description                    |
| ----------------- | ---------------------------------- | ------ | ------------------------ |
| addBinaryFile     | abilityContext, chunkUploadOptions | void   | Adds a configuration for chunk upload.    |
| addData           | name:String,value:String           | void   | Adds request data in key-value pairs.|
| addUploadCallback | callback                           | void   | Adds a callback to listen for upload completion/failure.   |
| addUploadProgress | uploadProgressCallback             | void   | Adds a callback tol listen for the upload progress.        |

### RetryAndFollowUpInterceptor

| API         | Parameter                                        | Return Value           | Description                         |
| --------------- | -------------------------------------------- | ----------------- | ----------------------------- |
| intercept       | chain: Chain                                 | Promise\<Response> | Intercepts a response.                 |
| followUpRequest | request: Request, userResponse: Response     | Request           | Generates a retry policy based on the request result.     |
| retryAfter      | userResponse: Response, defaultDelay: number | number            | Obtains Retry-After in the response header.|

### Dns

| API| Parameter            | Return Value                               | Description         |
| ------ | ---------------- | ------------------------------------- | ------------- |
| lookup | hostname: String | Promise<Array<connection.NetAddress>> | Configures a custom DNS for resolution.|

### NetAuthenticator

| API      | Parameter                                | Return Value | Description                    |
| ------------ | ------------------------------------ | ------- | ------------------------ |
| constructor  | userName: string, password: string   | void    | Adds a username and password.        |
| authenticate | request: Request, response: Response | Request | Adds an identity authentication credential to the request header.|

### RealTLSSocket

| API                | Parameter                                                        | Return Value       | Description                |
| ---------------------- | ------------------------------------------------------------ | ------------- | -------------------- |
| setCaDataByRes         | resourceManager: resmgr.ResourceManager, resName: string[], callBack | void          | Sets a CA certificate or certificate chain.|
| setCertDataByRes       | resourceManager: resmgr.ResourceManager, resName: string, callBack | void          | Sets a local digital certificate.    |
| setKeyDataByRes        | resourceManager: resmgr.ResourceManager, resName: string, callBack | void          | Sets a key.            |
| setOptions             | options: socket.TLSSecureOptions                             | RealTLSSocket | Configures TLS connection parameters. |
| setAddress             | ipAddress: string                                            | void          | Sets an IP address.          |
| setPort                | port: number                                                 | void          | Sets a port number.            |
| bind                   | callback?:(err,data)=>void                                   | void          | Binds a port.            |
| connect                | callback?:(err,data)=>void                                   | void          | Establishes a TLS connection.         |
| send                   | data, callback?:(err,data)=>void                             | void          | Sends data.            |
| getRemoteCertificate   | callback:(err,data)=>void                                    | void          | Obtains a remote certificate.        |
| getSignatureAlgorithms | callback:(err,data)=>void                                    | void          | Obtains signature algorithms.        |
| setVerify              | isVerify: boolean                                            | void          | Sets whether to verify the certificate.    |
| verifyCertificate      | callback:(err,data)=>void                                    | void          | Verifies a certificate.            |
| setCertificateManager  | certificateManager: CertificateManager                       | void          | Verifies a custom certificate.      |

### TLSSocketListener

| API         | Parameter                     | Return Value| Description                |
| --------------- | ------------------------- | ------ | -------------------- |
| onBind          | err: string, data: string | void   | Called for a request that is used to bind a port.        |
| onMessage       | err: string, data: string | void   | Called when a message is received.        |
| onConnect       | err: string, data: string | void   | Called when a server connection is established.      |
| onClose         | err: string, data: string | void   | Called when a connection is closed.            |
| onError         | err: string, data: string | void   | Called when an error is encountered.            |
| onSend          | err: string, data: string | void   | Called when data is sent.            |
| setExtraOptions | err: string, data: string | void   | Sets a listener for extra operations.|

### CertificateVerify

| API                   | Parameter                     | Return Value| Description        |
| ------------------------- | ------------------------- | ------ | ------------ |
| verifyCertificate         | callback:(err,data)=>void | void   | Verifies a certificate.    |
| verifyCipherSuite         | callback:(err,data)=>void | void   | Verifies a cipher suite.|
| verifyIpAddress           | callback:(err,data)=>void | void   | Verifies an IP address.    |
| verifyProtocol            | callback:(err,data)=>void | void   | Verifies a communication protocol.|
| verifySignatureAlgorithms | callback:(err,data)=>void | void   | Verifies a signing algorithm.|
| verifyTime                | callback:(err,data)=>void | void   | Verifies a validity period.|

### Cache
| API                  | Parameter                                             | Return Value  | Description                             |
| ------------------------ | ------------------------------------------------- | -------- | --------------------------------- |
| constructor              | filePath: string,maxSize: number,context: Context | void     | Sets the address and size of a journal file.  |
| key                      | url:string                                        | string   | Returns a URL encoded using MD5.       |
| get                      | request: Request                                  | Response | Reads the locally cached information based on a request.|
| put                      | response: Response                                | string   | Writes a response body.                       |
| remove                   | request: Request                                  | void     | Removes the response cache information of a request.    |
| evictAll                 | NA                                                | void     | Removes all response cache information.           |
| update                   | cache: Response, network: Response                | void     | Updates the cache information.                     |
| writeSuccessCount        | NA                                                | number   | Obtains the number of successful writes.               |
| size                     | NA                                                | number   | Obtains the size of the cache.               |
| maxSize                  | NA                                                | number   | Obtains the maximum size of the cache.             |
| flush                    | NA                                                | void     | Flushes the cache.                         |
| close                    | NA                                                | void     | Closes the cache.                         |
| directory                | NA                                                | string   | Obtains the address of the file.       |
| trackResponse            | cacheStrategy: CacheStrategy.CacheStrategy        | void     | Sets the number of cache hits.               |
| trackConditionalCacheHit | NA                                                | number   | Tracks a conditional cache hit.             |
| networkCount             | NA                                                | number   | Obtains the number of added networks.                     |
| hitCount                 | NA                                                | number   | Obtains the number of hits.                     |
| requestCount             | NA                                                | number   | Obtains the number of requests.                   |

### CacheControl
| API         | Parameter          | Return Value      | Description                                          |
| --------------- | -------------- | ------------ | ---------------------------------------------- |
| FORCE_NETWORK   | NA             | CacheControl | Forcibly requests to use the network.                          |
| FORCE_CACHE     | NA             | CacheControl | Forcibly requests to use a cache request.                          |
| noCache         | NA             | boolean      | Checks whether the current request header or response header contains information that cannot be cached.|
| noStore         | NA             | boolean      | Checks whether the current request header or response header contains information that cannot be stored.|
| maxAgeSeconds   | NA             | number       | Obtains the maximum cache age.                      |
| sMaxAgeSeconds  | NA             | number       | Obtains the maximum cache age.                      |
| isPrivate       | NA             | boolean      | Checks whether the request is private.                          |
| isPublic        | NA             | boolean      | Checks whether the request is public.                          |
| mustRevalidate  | NA             | boolean      | Checks whether re-verification is required.                          |
| maxStaleSeconds | NA             | number       | Obtains the maximum number of stale seconds.                            |
| minFreshSeconds | NA             | number       | Obtains the minimum number of fresh seconds.                                |
| onlyIfCached    | NA             | boolean      | Checks whether to cache only.                                |
| noTransform     | NA             | boolean      | No transformation will be performed.                                      |
| immutable       | NA             | boolean      | Obtains immutable.                                    |
| parse           | NA             | CacheControl | Creates a cache control based on the header.                   |
| toString        | NA             | string       | Obtains the string converted from the cache control.                        |
| Builder         | NA             | Builder      | Obtains the builder mode of the cache control.                 |
| noCache         | NA             | Builder      | Sets whether an HTTP client is not willing to accept a cached response.                                    |
| noStore         | NA             | Builder      | Sets whether a cache must not store any part of either the HTTP request message or any response.                                    |
| maxAge          | maxAge: number | Builder      | Sets the maximum validity period of a request or response.                    |
| maxStale        | NA             | Builder      | Sets whether an HTTP client is willing to accept a response that has exceeded its expiration time.                                    |
| onlyIfCached    | NA             | Builder      | Sets whether to cache only.                                    |
| noTransform     | NA             | Builder      | No transformation will be performed.                                  |
| immutable       | NA             | Builder      | Obtains immutable.                                |
| build           | NA             | CacheControl | Returns a cache control object when the builder mode ends.           |

### gZipUtil
| API            | Parameter                                     | Return Value    | Description              |
| ------------------ | ----------------------------------------- | ---------- | ------------------ |
| gZipString         | strvalue:string                           | Uint8Array | Encodes Uint8Array data.|
| ungZipString       | strvalue:any                              | string     | Decodes a string.        |
| gZipFile           | srcFilePath:string, targetFilePath:string | void       | Encodes a file.          |
| ungZipFile         | srcFilePath:string, targetFilePath:string | void       | Decodes a file.          |
| stringToUint8Array | str:string                                | Uint8Array | Converts a string to a Uint8Array.|

### HttpDataType
Enumerates the types of data returned.

| API      | Value  | Description            |
| ------------ | ---- | ---------------- |
| STRING       | 0    | String.    |
| OBJECT       | 1    | Object.      |
| ARRAY_BUFFER | 2    | Binary array.|

### CertificatePinnerBuilder

Describes the builder of a certificate pinner.

| API| Parameter                      | Return Value                  | Description            |
| ------ | -------------------------- | ------------------------ | ---------------- |
| add    | hostname:string,sha:string | CertificatePinnerBuilder | Adds certificate pinning parameters.|
| build  | NA                         | CertificatePinner        | Constructs a certificate pinner instance.|



## Constraints

This project has been verified in the following versions:

DevEco Studio: 4.1 Canary (4.1.3.317), OpenHarmony SDK: API 11 (4.1.0.36)

DevEco Studio: 4.1 Canary (4.1.3.319), OpenHarmony SDK: API 11 (4.1.3.1)

DevEco Studio: 4.1 Canary (4.1.3.500), OpenHarmony SDK: API 11 (4.1.5.6)

## Directory Structure

```
|---- httpclient  
|     |---- entry  # Sample code
|     |---- library  # httpclient library
			|---- builders  # Request body builder module, which is used to build different types of request bodies, such as file upload and multipart
            |---- cache  # Cached event data operation module
			|---- callback  #  Response callback module, which is used to parse and convert a result into the required type (for example, a string, JSON object, and byte string), and return the type to the caller
            |---- code # Response code module, which is the response result code returned by the server
            |---- connection # Route module, which manages multiple routes in requests
            |---- cookies  # Cookie management module, which parses the response result, caches the cookie in the response header based on the configured cache policy, obtains the cookie, and updates the cookie
            |---- core  # Core module, which parses request parameters and results from encapsulated requests, calls interceptors, retries and redirects requests upon errors, invokes DNS for resolution, and calls the @ohos.net.http module of the system to initiate requests
			|---- dispatcher # Task manager module, which is used to process synchronous and asynchronous task queues
			|---- http # Used to determine the HTTP method type
			|---- interceptor # Interceptor module, which is used to process network requests
			|---- protocols  # Protocols supported
			|---- response # Response module, which is used to receive the result returned by the server
			|---- utils # Utility class, which provides capabilities such as DNS resolution, GZIP decompression, file name verification, logging, URL domain name or IP address obtaining, and double-ended queue
            |---- HttpCall.ts # A request task, which can be a synchronous or an asynchronous request. It encapsulates request parameters, request clients, callbacks for successful and failed requests, and request cancellation flag.
            |---- HttpClient.ts # Request client, which is used to generate request tasks to initiate requests, set request parameters, process GZIP decompression, and cancel requests
            |---- Interceptor.ts # Interceptor interface
			|---- Request.ts # Request object, which is used to encapsulate request information, including the request header and request body
            |---- RequestBody.ts # Request body, which is used to encapsulate the request body information
            |---- WebSocket.ts  # WebSocket module callback interface
            |---- RealWebSocket.ts  # WebSocket module, which is used to provide WebSocket support
            |---- WebSocketListener.ts  # WebSocket status listener
            |---- Dns.ts # Used to customize a DNS
            |---- CertificatePinner.ts  # Builder of the certificate pinner
            |---- DnsSystem.ts # Default DNS
            |---- Route.ts # Route
            |---- RouteSelector.ts # Route selector
            |---- Address.ts # Request URL
            |---- authenticator  # Identity authentication module, which is used to provide identity authentication upon 401 to a network request
            |---- tls # Certificate verification module, which is used to parse and verify TLS certificates
            |---- enum  # Enums
            |---- index.ts  # External Interfaces of httpclient
|     |---- README.MD  # Readme                  
|     |---- README_zh.MD  # Readme                  
```

## How to Contribute

If you find any problem when using httpclient, submit an [issue](https://gitcode.com/openharmony-tpc/httpclient/issues) or a [PR](https://gitcode.com/openharmony-tpc/httpclient/pulls).

## License

This project is licensed under [Apache License 2.0](https://gitcode.com/openharmony-tpc/httpclient/blob/master/LICENSE).
