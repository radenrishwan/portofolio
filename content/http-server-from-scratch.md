---
title: HTTP Framework from scratch tanpa library
description: "Bikin HTTP Framework kaya expressjs tanap library"
pubDate: 2024-08-29T05:28:57.953Z
heroImage: "https://i.ibb.co.com/JHD4Tjn/HTTP-Version-Status-Code.png"
author: Raden Mohamad Rishwan
short: Pernah ga sih kepikiran lagi bikin web atau API. Biasanya kita langsung pake library kaya express di javascript atau golang bisa pake gin. Tapi, gimana kalau buat sendiri ?. Nah, di artikel ini saya bakalan coba sharing yang saya pelajarin beberapa minggu belakangan ini (pada saat artikel ditulis) yaitu bikin HTTP Server tanpa library apapun.
tags:
    - programming
    - golang
    - http
    - web
slug: http-framework-from-scratch
---

Pernah ga sih kepikiran lagi bikin web atau API. Biasanya kita langsung pake library kaya [express](https://expressjs.com/) di javascript atau golang bisa pake [gin](https://gin-gonic.com/). Tapi, gimana kalau buat sendiri ?. Nah, di artikel ini saya bakalan coba sharing yang saya pelajarin beberapa minggu belakangan ini (pada saat artikel ditulis) yaitu bikin HTTP Server tanpa library apapun. buat yang pengen liat hasilnya bisa mampir ke github repo saya
https://github.com/radenrishwan/hfs

# Pembuka

Sebelum bikin server, ada beberapa hal yang perlu disampaikan. Server HTTP yang bakalan dibuat berdasarkan [rfc2616](https://datatracker.ietf.org/doc/html/rfc2616) atau terbatas pada `HTTP 1.1` dan tidak akan mengimplementasi secara keseluruhan. Dan bahasa pemrograman yang akan dibuat menggunakan bahasa `Golang`. Jika tidak mengerti bahasa `Golang`, sebenarnya masih bisa diikuti menggunakan bahasa lain karena memang langkah pembuatannya sama/mirip.

# Bikin Server

Di golang sebenernya sudah ada yang standard library `net/http` yang powerfull dan lengkap. Tapi, di artikel ini saya hanya pakai `net` saja untuk membuat koneksi TCP. Silahkan buat project golang dan buat file `main.go`

```go
package main

import (
    "log"
    "net"
)

func main() {
    conn, err := net.Listen("tcp", "localhost:8080")
    if err != nil {
        log.Fatalf("Failed to connect: %v", err)
    }

    defer conn.Close()
}
```

nah, buat baca atau kirim pesan ke client bisa pakai `conn.Accept()` dan buat kirim `conn.Write()`

```go
func main() {
    ...
    for {
        conn, err := conn.Accept()
        if err != nil {
            log.Printf("Failed to accept connection: %v", err)
            continue
        }

        go handleConnection(conn)
    }
}

func handleConnection(conn net.Conn) {
    buf := make([]byte, 1024)
    for {
        n, err := conn.Read(buf)
        if err != nil {
            log.Printf("Failed to read data: %v", err)
            return
        }

        fmt.Println(string(buf[:n]))

        _, err = conn.Write([]byte("hello"))
        if err != nil {
            log.Printf("Failed to send data: %v", err)
            return
        }
    }
}
```

silahkan running kodenya lalu coba pakai `curl`

```sh
~ » curl localhost:8080 -v
* Host localhost:8080 was resolved.
* IPv6: ::1
* IPv4: 127.0.0.1
*   Trying [::1]:8080...
* connect to ::1 port 8080 from ::1 port 53823 failed: Connection refused
*   Trying 127.0.0.1:8080...
* Connected to localhost (127.0.0.1) port 8080
> GET / HTTP/1.1
> Host: localhost:8080
> User-Agent: curl/8.6.0
> Accept: */*
>
* Received HTTP/0.9 when not allowed
* Closing connection
curl: (1) Received HTTP/0.9 when not allowed
```

disini udah jalan tapi masih error karena pesan yang dikirim cuman string biasa. Tapi, kalau cek output program kita udah bisa dapet pesan yang dikirim dari client.

```sh
~ » Go/article/hfs » go run cmd/main.go
GET / HTTP/1.1
Host: localhost:8080
User-Agent: curl/8.6.0
Accept: */*

```

# Kirim response

Sekarang kita bakalan coba perbaiki response karena sebelumnya error. Coba kita sekarang curl google dan coba liat outputnya.

```sh
~ » curl -s -o /dev/null -v http://www.google.com/
* Host www.google.com:80 was resolved.
* IPv6: (none)
* IPv4: 64.233.170.103, 64.233.170.106, 64.233.170.104, 64.233.170.105, 64.233.170.147, 64.233.170.99
*   Trying 64.233.170.103:80...
* Connected to www.google.com (64.233.170.103) port 80
> GET / HTTP/1.1
> Host: www.google.com
> User-Agent: curl/8.6.0
> Accept: */*
>
< HTTP/1.1 200 OK
< Date: Mon, 26 Aug 2024 16:39:08 GMT
< Expires: -1
< Cache-Control: private, max-age=0
< Content-Type: text/html; charset=ISO-8859-1
< ...
<
{ [169 bytes data] // Body here
* Leftovers after chunking: 7 bytes
* Connection #0 to host www.google.com left intact
```

Berdasarkan output tadi, bisa diliat kalau ada beberapa bagian yang perlu dikirim ke client, seperti HTTP Version, status code, header, dan juga body. kira - kira kalau digambarkan kaya gini:

![Ilustrasi HTTP Response](https://i.ibb.co.com/JHD4Tjn/HTTP-Version-Status-Code.png)

Nah, setelah tau kita bakalan coba parsing.

```go
func main() {
    // ...
}

func handleConnection(conn net.Conn) {
    buf := make([]byte, 1024)
    for {
        // ...
        fmt.Println(string(buf[:n]))

        // _, err = conn.Write([]byte("hello"))
        writeHTTPResponse("Hello, World!", conn)
        if err != nil {
            log.Printf("Failed to send data: %v", err)
            return
        }
    }
}

func writeHTTPResponse(body string, conn net.Conn) error {
    contentLength := len(body)

    _, err := conn.Write([]byte(
        "HTTP/1.1 200 OK\r\n" +
            "Content-Length: " + fmt.Sprintf("%d", contentLength) + "\r\n" +
            "Content-Type: text/html\r\n" +
            "\r\n" +
            body,
    ))

    return err
}
```

Kalau sekarang kita coba maka hasilnya kaya gini.

```sh
~ » curl localhost:8080 -v
* Host localhost:8080 was resolved.
* IPv6: ::1
* IPv4: 127.0.0.1
*   Trying [::1]:8080...
* connect to ::1 port 8080 from ::1 port 55224 failed: Connection refused
*   Trying 127.0.0.1:8080...
* Connected to localhost (127.0.0.1) port 8080
> GET / HTTP/1.1
> Host: localhost:8080
> User-Agent: curl/8.6.0
> Accept: */*
>
< HTTP/1.1 200 OK
< Content-Length: 13
< Content-Type: text/html
<
* Connection #0 to host localhost left intact
Hello, World!%
```

atau kalau kita coba dibrowser keluar tulisan "Hello, World!". Sampai sini, sebenernya udah jadi server HTTP kita. Tapi, dari awal kita pengen bikin library kaya `express` atau `net/http`, jadi ini bukan akhir dari jalan 🤓.

# Dibikin biar kaya `net/http`

Sebelum mulai ngoding, ada hal yang perlu disampaikan. Disini kita tidak buat sama persis kaya `net/http`, tapi sebisa mungkin API nya mirip.

## Parsing Request

Sebelumnya, kita udah dapet pesan dari client. Nah, saya pengen data yang udah di dapet dijadiin struct.

```go
type Request struct {
    Context context.Context
    Method  string
    Path    string
    Version string
    Body    string
    Args    map[string]string
    Headers map[string]string
    Cookie  map[string]string
    Conn    net.Conn
}

func (r *Request) GetHeader(key string) string {
    return r.Headers[key]
}

func (r *Request) GetArgs(arg string) string {
    return r.Args[arg]
}
```

Buat parsing requestnya, disini saya buat function baru biar lebih mudah dibaca.

```go
func parseRequest(conn net.Conn) (request Request, err error) {
    buf := make([]byte, 1024)
    request.Conn = conn
    request.Context = context.Background()

    _, err = conn.Read(buf)
    if err != nil {
        return request, err
    }

    stringBuf := string(buf)

    sp := strings.Split(stringBuf, "\r\n")

    requestLine := strings.Split(sp[0], " ")
    request.Method = strings.ToUpper(requestLine[0])
    request.Version = requestLine[2]

    // TODO: Parse header here

    // TODO: Parse cookie here

    // TODO: Parse args here

    return request, nil
}
```

Ada beberapa bagian yang saya belum diimplement buat sekarang. Tapi, kita coba dulu kodenya. Silahkan ubah bagian handleConnection`main.go` kamu jadi kaya gini lalu coba lagi `curl localhost:8080 -v`.

```go
func main() {
    ...
    for {
        conn, err := conn.Accept()
        if err != nil {
            log.Printf("Failed to accept connection: %v", err)
            continue
        }

        go handleConnection(conn)
    }
}

func handleConnection(conn net.Conn) {
    for {
        req, err := parseRequest(conn)
        if err != nil {
            log.Printf("Failed to parse request: %v", err)
            return
        }

        fmt.Println(req.Method)

        writeHTTPResponse("Hello, World!", conn)
        if err != nil {
            log.Printf("Failed to send data: %v", err)
            return
        }
    }
}
```

kalau kode kamu benar, silahkan liat output di server golangnya.

```sh
~ » go run cmd/main.go
{context.Background GET  HTTP/1.1  map[] map[] map[] 0x14000054050}
```

### Headers

Sekarang kita bakalan coba parsing headersnya. kalau diliat dari output dibawah, headers itu ada nya setelah baris pertama yang artinya ada bagian setelah `CRLF` atau `\r\n` pertama.

```
GET / HTTP/1.1
Host: localhost:8080
User-Agent: curl/8.6.0
Accept: */*
```

Silahkan ubah function `parseRequest()`

```go
func parseRequest(conn net.Conn) (request Request, err error) {
    // ...

    request.Headers = make(map[string]string)
    for i := 1; i < len(sp); i++ {
        if sp[i] == "" {
            request.Body = sp[i+1]
            break
        }

        header := strings.Split(sp[i], ": ")
        request.Headers[header[0]] = header[1]
    }

    // TODO: Parse cookie here

    // TODO: Parse args here

    return request, nil
}
```

kalau kita jalanin dan juga `curl` lagi, outpunya kira - kira jadi kaya gini.

```sh
~ » go run cmd/main.go
{context.Background GET  HTTP/1.1  map[] map[Accept:*/* Host:localhost:8080 User-Agent:curl/8.6.0] map[] 0x14000054050}
```

### Arguments

Sebelum mulai parsing, arguments atau sering juga disebut query parameter itu biasanya terletak di URL setelah "?" yang setiap valuenya dipisah pake "&". Yang kalau digambarin kira - kira strukturnya kaya gini.

![URI](https://i.ibb.co.com/K6F5KK2/HTTP-Version-Status-Code-2.png)

Untuk parsingnya, kira - kira jadi kaya gini.

```go
func parseRequest(conn net.Conn) (request Request, err error) {
    // ...

    // TODO: Parse cookie here

    request.Path, request.Args = parseArgs(requestLine[1])

    return request, nil
}

func parseArgs(uri string) (string, map[string]string) {
    s := strings.Split(uri, "?")
    result := make(map[string]string)

    if len(s) == 1 {
        return s[0], result
    }

    args := strings.Split(s[1], "&")

    for _, args := range args {
        arg := strings.Split(args, "=")
        if len(arg) == 1 {
            result[arg[0]] = ""
            continue
        }

        result[arg[0]] = arg[1]
    }

    return s[0], result
}
```

Silahkan coba jalanin programmnya dan juga `curl` pake command kaya dibawah.

```sh
~ » curl "localhost:8080?name=raden&address=bogor" -v
```

Lalu coba liat output servernya.

```sh
~ » go run cmd/main.go
{context.Background GET / HTTP/1.1  map[address:bogor name:raden] map[Accept:*/* Host:localhost:8080 User-Agent:curl/8.6.0] map[] 0x140000ae048}
```

## Parsing Response

Sebelumnya, kita udah bisa kirim response ke client tapi cuman bisa ubah body nya. Disini, kita bakalan coba buat responsenya lebih dynamic yaitu bisa set headers & methodnya. Silahkan buat struct `Response` kaya gini, disini juga saya buat beberapa function bantuan biar lebih gampang.

```go
type Response struct {
    Code int
    Headers map[string]string
    Body    string
}

func NewResponse() *Response {
    return &Response{
        Code:    200,
        Headers: make(map[string]string),
    }
}

func NewTextResponse(text string) *Response {
    header := map[string]string{
        "Content-Type": "text/plain",
    }

    return &Response{
        Code:    200,
        Headers: header,
        Body:    text,
    }
}

func NewHTMLResponse(html string) *Response {
    header := map[string]string{
        "Content-Type": "text/html",
    }

    return &Response{
        Code:    200,
        Headers: header,
        Body:    html,
    }
}

func NewJSONResponse(json string) *Response {
    header := map[string]string{
        "Content-Type": "application/json",
    }

    return &Response{
        Code:    200,
        Headers: header,
        Body:    json,
    }
}

func (r *Response) AddHeader(key, value string) *Response {
    r.Headers[key] = value

    return r
}

func (r *Response) SetBody(body string) *Response {
    r.Body = body

    return r
}

func (r *Response) SetCode(code int) *Response {
    r.Code = code

    return r
}
```

Selanjutnya, kita coba ubah function `writeResponse()` yang udah ditulis sebelumnya jadi kaya gini.

```go
func writeResponse(response *Response, conn net.Conn) {
    if response == nil {
        response = NewResponse()
    }

    if response.Headers == nil {
        response.Headers = make(map[string]string)
    }

    // check if header has a content-type
    if _, ok := response.Headers["Content-Type"]; !ok {
        response.Headers["Content-Type"] = "text/plain"
    }

    // add content length to Headers
    response.Headers["Content-Length"] = strconv.Itoa(len(response.Body))

    // check if code is 0
    if response.Code == 0 {
        response.Code = 200
    }

    conn.Write([]byte(
        "HTTP/1.1 " + strconv.Itoa(response.Code) + "\r\n" +
            headerString(response.Headers) +
            "\r\n" +
            response.Body,
    ))
}

func headerString(headers map[string]string) string {
    var headerString string
    for key, value := range headers {
        headerString += key + ": " + value + "\r\n"
    }

    return headerString
}
```

jangan lupa ubah juga function `handleConnection()`.

```go
func main() {
    // ...
}

func handleConnection(conn net.Conn) {
    for {
        req, err := parseRequest(conn)
        if err != nil {
            log.Printf("Failed to parse request: %v", err)
            return
        }

        fmt.Println(req)

        writeResponse(NewTextResponse("Hello, World!").SetCode(200), conn)
    }
}
```

Kalau kamu running programnya, harusnya tidak ada bedanya. Tapi, sekarang kita bisa tambahin header atau set status codenya.

## Buat Handler

Akhirnya kita sampe di bagian yang paling seru dari artikel ini (menurut saya 😁). Kita bakalan buat handler supaya mirip kaya `net/http`. Sebelum mulai ngoding, kira - kira nanti API nya nanti kaya gini:

```go
func main() {
    server := hfs.NewServer("localhost:3000", hfs.Option{})

    server.Handle("/", func(req Request) Response {
        return NewHTMLResponse("Hello, World!")
    })

    if err := server.ListenAndServe(); err != nil {
        // Handle error here...
    }
}
```

Sebelum buat api Handlernya, kita buat dulu servernya. Silahkan buat 2 struct buat `Server` sama `Option`. Dimana `Option` ini kita bisa isi kaya max buffer buat body, timeout, middleware, dll. Cuman disini kita cuman isi ErrHandler. Mungkin nanti kita bakalan tambah (kapan - kapan).

```go
type ErrResponseHandler func(Request, error) *Response
type ResponseHandler func(Request) *Response

type Option struct {
    ErrHandler       ErrResponseHandler
}

type Server struct {
    address  string
    socket   net.Listener
    Option   Option
}
```

Sekarang kita bakalan buat beberapa function. Yang pertama yaitu `NewServer()` sama`Close` yang fungsi-nya sesuai sama namanya.

```go
func NewServer(address string, option Option) *Server {
    // check err handler in option is nil
    if option.ErrHandler == nil {
        option.ErrHandler = func(req Request, err error) *Response {
            slog.Error("Error while handling request", "ERROR", err)

            return &Response{
                Code: 500,
                Headers: map[string]string{
                    "Content-Type": "text/plain",
                },
                Body: "Internal Server Error",
            }
        }
    }

    return &Server{
        address: address,
        Option:  option,
    }
}

func (s *Server) ListenAndServe() error {
    socket, err := net.Listen("tcp", s.address)
    if err != nil {
        return NewServerError("Error while listening to address: " + err.Error())
    }

    for {
        conn, err := socket.Accept()
        if err != nil {
            request := Request{
                Conn:    conn,
                Path:    "",
                Method:  "",
                Version: "",
                Headers: make(map[string]string),
                Cookie:  make(map[string]string),
                Body:    "Server Error",
            }

            response := s.Option.ErrHandler(request, NewServerError("Error while accepting connection"))
            writeResponse(response, conn)
        }

        // TODO: add handler later
    }
}
```

Buat error-nya bisa aja pake `errors.New()`. Tapi, biar lebih enak saya buat sendiri.

```go
package hfs

import (
    "fmt"
)

type ServerError struct {
    Msg string
}

func (e *ServerError) Error() string {
    return e.Msg
}

func NewServerError(msg string) *ServerError {
    return &ServerError{Msg: msg}
}

type HandlingError struct {
    Msg string
}

func (e *HandlingError) Error() string {
    return e.Msg
}

func NewHandlingError(msg string) *HandlingError {
    return &HandlingError{Msg: msg}
}

type HttpError struct {
    Code    int
    Msg     string
    Request Request
}

func (e *HttpError) Error() string {
    return fmt.Sprintf("HTTP %d: %s -> %s %s", e.Code, e.Msg, e.Request.Path, e.Request.Method)
}

func NewHttpError(code int, msg string, request Request) *HttpError {
    return &HttpError{Code: code, Msg: msg, Request: request}
}
```

Sampai sini, kita belum bisa nerima request dari client. Sekarang, kita bakalan coba buat function buat handle request. Sekarang kita buat dulu struct `Handler`

```go
type Handler struct {
    Path       string
    Method     string
    Handler    ResponseHandler
}

// ...

// Tambahin juga handler ke struct Server
type Server struct {
    address  string
    socket   net.Listener
    Handlers []Handler // Tambahin disini...
    Option   Option
}
```

Sekarang kita buat function handlernya.

```go
func (s *Server) Handle(path string, handler ResponseHandler) error {
    // check duplicate path
    for _, h := range s.Handlers {
        if h.Path == path {
            return NewServerError("Duplicate path found")
        }
    }

    method, path := parsePath(path)

    res := Handler{
        Path:       path,
        Handler:    handler,
        Method:     method,
    }

    s.Handlers = append(s.Handlers, res)

    return nil
}

func parsePath(uri string) (method, path string) {
    s := strings.Split(uri, " ")

    if len(s) == 1 {
        path = s[0]
        return method, path
    }

    method = strings.ToUpper(s[0])
    return method, s[1]
}
```

Kalau kalian liat kode-nya, ada function `parsePath()`. Ini dipake buat parsing `METHOD` sama `PATH`\-nya. Yang nanti bentuknya kaya di package `net/http`. Kira - kira contohnya kaya gini `http.Handle("GET /", function(w ..., r ...) {})`.

Abis kita buat handlernya, sekarang kamu bisa hapus function `handleConnection()` yang sebelumnya udah ditulis dan buat function `server.handleConnection()`.

```go
func (s *Server) handleConnection(conn net.Conn) {
    defer conn.Close()

    request, err := parseRequest(conn)
    if err != nil {
        response := s.Option.ErrHandler(Request{Conn: conn}, err)
        writeResponse(response, conn)
        return
    }

    var response *Response

    // find the handler for the request
    for _, handler := range s.Handlers {
        if request.Path == handler.Path {
            // check if method is not same, if method is "", call the handler instead
            if handler.Method != request.Method && handler.Method != "" {
                response = s.Option.ErrHandler(request, NewHttpError(405, "Method not allowed", request))
                break
            }

            func() {
                defer func() {
                    rc := recover()

                    // check if error is not nil
                    if rc != nil {
                        err = rc.(error)
                    }

                }()

                response = handler.Handler(request)
            }()

            break
        }
    }

    if err != nil {
        response = s.Option.ErrHandler(request, err)
    }

    if response == nil {
        response = s.Option.ErrHandler(request, NewHttpError(404, "No handler found for the request", request))
    }

    writeResponse(response, conn)
}
```

Kita ubah juga functoin `server.ListenAndServe()` jadi kaya gini.

```go
func (s *Server) ListenAndServe() error {
    // ...

    for {
        conn, err := socket.Accept()
        if err != nil {
                // ....
            }

            // ...
        }

        if len(s.Handlers) == 0 {
            return NewServerError("No handler found for the request")
        }

        go s.handleConnection(conn)
    }
}
```

Kita ubah total function `main()` kita jadi kaya gini.

```go
func main() {
    server := NewServer(":8080", Option{})

    server.Handle("GET /", func(req Request) *Response {
        return NewHTMLResponse("Hello, World")
    })

    server.Handle("GET /json", func(req Request) *Response {
        var data = map[string]string{
            "message": "Hello, World",
            "path":    req.Path,
        }

        result, _ := json.Marshal(data)

        return NewJSONResponse(string(result))
    })

    if err := server.ListenAndServe(); err != nil {
        log.Fatal(err)
    }
}
```

Sekarang, kita jalanin programmnya abis itu kita buka browser lalu akses `localhost:8080/` sama `localhost:8080/json`. Atau bisa juga pake `CURL` kaya sebelumnya. Kalau kode kalian benar, outputnya nanti jadi kaya gini.

![https://i.ibb.co.com/gyFXb3x/51580176942446c5af495b457e26988c.png](https://i.ibb.co.com/gyFXb3x/51580176942446c5af495b457e26988c.png)
![https://i.ibb.co.com/2hNYkgm/7527be7e25f74611958810413a6e59bd.png](https://i.ibb.co.com/2hNYkgm/7527be7e25f74611958810413a6e59bd.png)

Kalau diliat udah mirip kan sama framework HTTP orang - orang ? 😎. Sebenernya kaliat udah bisa banyak ngelakuin banyak hal dari kode yang udah dibuat. Ada juga API yang dipake di contoh, kaya set `HEADER` sama ubah `ErrHandler`. Jadi silahkan coba sendiri.

Buat kode fullnya bisa cek https://github.com/radenrishwan/hfs

atau bisa juga buka gist ini https://gist.github.com/radenrishwan/c48441590205b953f41a60972cdc45cb buat kode yang udah ditullis sama penulis di artikel ini (dijadiin 1 file doang maap kalau pusing).

## Bonus

Sebenernya disini kita udah beres buat HTTP Framework. Tapi, ada beberapa yang kurang. Disini kita bakalan coba bakalan buat beberapa function yang sebenarnya lumayan sering dipake ketika buat HTTP Server.

### Serving File/Folder

Buat serving sebuah file/folder di golang, kita bisa pakai `os.ReadFile()` buat read file atau `os.ReadDir` buat read folder.

```go
func (s *Server) ServeFile(path string, filePath string) error {
    file, err := os.ReadFile(filePath)
    if err != nil {
        return NewServerError("Error while reading file: " + err.Error())
    }

    fileType := http.DetectContentType(file)

    return s.Handle(path, func(req Request) *Response {
        return &Response{
            Code: 200,
            Headers: map[string]string{
                "Content-Type": fileType,
            },
            Body: string(file),
        }
    })
}
```

Sebenernya step cukup simple. Dimana kita read file pake `file, err := os.ReadFile(filePath)`, lalu kita kirim isinya ke body. `fileType := http.DetectContentType(file)` dipake buat deteksi ekstensi dari file yang dibaca.

Buat serving folder, kita pake `os.ReadDir()` abis itu di for loop buat setiap file lalu di register handler ke server.

```go
func (s *Server) ServeDir(prefixPath string, filePath string) error {
    // check last character of the path
    if filePath[len(filePath)-1] == '/' {
        filePath = filePath[:len(filePath)-1]
    }

    if prefixPath[len(prefixPath)-1] == '/' {
        prefixPath = prefixPath[:len(prefixPath)-1]
    }

    // get all files in the directory
    files, err := os.ReadDir(filePath)
    if err != nil {
        return NewServerError("Error while reading directory: " + err.Error())
    }

    for _, file := range files {
        if file.IsDir() {
            continue
        }

        // read file
        output, err := os.ReadFile(filePath + "/" + file.Name())
        if err != nil {
            return NewServerError("Error while reading file: " + err.Error())
        }

        fileType := http.DetectContentType(output)

        err = s.Handle(prefixPath+"/"+file.Name(), func(req Request) *Response {
            return &Response{
                Code: 200,
                Headers: map[string]string{
                    "Content-Type": fileType,
                },
                Body: string(output),
            }
        })

        if err != nil {
            return err
        }
    }

    return nil
}
```

Sekarang kita coba functionnya. Kita ubah filenya jadi kaya gini.

```go
func main() {
    server := NewServer(":8080", Option{})

    // ...

    server.ServeFile("GET /file", "path/to/file")

    server.ServeDir("public/", "path/to/dir")

    if err := server.ListenAndServe(); err != nil {
        log.Fatal(err)
    }
}
```

Buat function `server.ServeDir()`, kita bisa akses pake prefix yang dikasih. contoh di kode: `http://localhost:8080/public/filename.ext`.

### Cookie

Cookie biasanya dipake buat simpan data sementara kaya Session atau Authentication key. Buat lebih lengkapnya mengenai cookie ini bisa cek website mdn https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies.

Untuk ngelakuin set cookie kita sebenarnya cuman perlu set header `Set-Cookie`. Buat lebih jelasnya bisa liat lagi website mdn https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie. Disini kita mungkin bakalan set beberapa attribute aja.

#### Set Cookie

Sekarang silahkan cek struct `Response`, kita tambahin 1 function buat set cookie.

```go
type Response struct {
    Code int
    // you need to assign a headers map if you create response from [Response],
    // please use [NewResponse] instead to avoid nil headers
    Headers map[string]string
    Body    string
}

// ...

func (r *Response) SetCookie(key, value, path string, maxAge int) {
    r.Headers["Set-Cookie"] = key + "=" + value + "; Path=" + path + "; Max-Age=" + strconv.Itoa(maxAge)
}
```

Kita ubah juga kode di `main.go`.

```go
func main() {
    server := NewServer(":8080", Option{})

    server.Handle("GET /", func(req Request) *Response {
        response := NewHTMLResponse("Hello, World")

        response.SetCookie("foo", "bar", "/", 3600)

        return response
    })

    // ...

    if err := server.ListenAndServe(); err != nil {
        log.Fatal(err)
    }
}
```

Silahkan buka browser lalu coba buka developer tools kaya gambar dibawah buat cek cookienya.

![https://i.ibb.co.com/vDnkHPG/4b659f2abec9473995f2a8bc6e8d01a3.png](https://i.ibb.co.com/vDnkHPG/4b659f2abec9473995f2a8bc6e8d01a3.png)

#### Get Cookie

Setelah tadi kita bisa set cookie, sekarang kita bakalan coba dapetin cookie yang udah di set sebelumnya. Silahkan tambah sedikit kode di function `parseRequest()`.

```go
func parseRequest(conn net.Conn) (request Request, err error) {
    // ...

    request.Path, request.Args = parseArgs(requestLine[1])

    return request, nil
}

func parseCookie(cookie string) map[string]string {
    cookieMap := make(map[string]string)
    cookies := strings.Split(cookie, "; ")

    for _, c := range cookies {
        cookie := strings.Split(c, "=")
        cookieMap[cookie[0]] = cookie[1]
    }

    return cookieMap
}
```

Kita buat handler nya buat get cookie. Lalu coba akses `/` setelah itu akses `/cookie`. Kalau berhasil bakalan keluar tulian "Cookie found: bar"

```go
func main() {
    server := NewServer(":8080", Option{})

    server.Handle("GET /", func(req Request) *Response {
        response := NewHTMLResponse("Hello, World")

        response.SetCookie("foo", "bar", "/", 3600)

        return response
    })

    server.Handle("GET /cookie", func(req Request) *Response {
        r := req.Cookie["foo"]

        if r == "" {
            return NewHTMLResponse("Cookie not found")
        }

        return NewHTMLResponse("Cookie found: " + r)
    })

    // ...

    if err := server.ListenAndServe(); err != nil {
        log.Fatal(err)
    }
}
```

### Websocket

kalau kamu cek repository yang udah saya kasih sebelumnya, ada file `websocket.go`. Nah, buat websocket nanti kita bakalan bahas di artikel lain.

&nbsp;

# References
- [https://pkg.go.dev/net/http](https://pkg.go.dev/net/http)
- [https://datatracker.ietf.org/doc/html/rfc2616](https://datatracker.ietf.org/doc/html/rfc2616m)
- [https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie)
