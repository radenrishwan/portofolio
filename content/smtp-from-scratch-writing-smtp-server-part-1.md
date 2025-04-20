---
title: SMTP From Scratch - Writing SMTP Server (Part 1)
description: "Write our own SMTP server & client without any external libraries"
pubDate: 2025-04-20T20:13:44+07:00
author: Raden Mohamad Rishwan
heroImage: "https://i.postimg.cc/1XSMTq1F/thumbnail-SMTP.png"
short: Have you ever thought about how you send and receive email?. Did you ever wonder how this works behind the scenes?. In this article, we're going to write both an SMTP server and client based on RFC5321.
tags:
    - programming
    - rust
    - backend
    - smtp
    - email
slug: smtp-from-scratch-writing-smtp-server-part-1
---
Have you ever thought about how you send and receive email?. Did you ever wonder how this works behind the scenes?. In this article, we're going to write both an `SMTP` server and client based on [RFC5321](https://datatracker.ietf.org/doc/html/rfc5321). We're not going to implement the whole `RFC`, at least we can sending and receive an email.

## What you need to know before continue

Before writing the server and client, I'm going to write the whole project using `Rust`. If you don't have any experience using `Rust`, you can still read these articles an implement it in another language. I'm going to explain step-by-step, then write the code to make sure you can implement it in another language.

## SMTP Protocol

Before writing the code, we need to know the process of sending and receiving messages. Here is an example of communication between the client and server using the `SMTP` protocol:

```
S: 220 smtp.example.com ESMTP Postfix
C: HELO relay.example.org
S: 250 Hello relay.example.org, I am glad to meet you
C: MAIL FROM:<bob@example.org>
S: 250 Ok
C: RCPT TO:<alice@example.com>
S: 250 Ok
C: RCPT TO:<theboss@example.com>
S: 250 Ok
C: DATA
S: 354 End data with <CR><LF>.<CR><LF>
C: From: "Bob Example" <bob@example.org>
C: To: "Alice Example" <alice@example.com>
C: Cc: theboss@example.com
C: Date: Tue, 15 Jan 2008 16:02:43 -0500
C: Subject: Test message
C:
C: Hello Alice.
C: This is a test message with 5 header fields and 4 lines in the message body.
C: Your friend,
C: Bob
C: .
S: 250 Ok: queued as 12345
C: QUIT
S: 221 Bye
{The server closes the connection}
```

As you can see, the protocol is really simple like the name. there some command defines a particular function on the `SMTP` session and i’m gonna explain step-by-step later.

## SMTP Command

Here is the list SMTP Command we gonna use in this articles.

| Command Name | Explanation |
| --- | --- |
| HELO/EHLO | A command that indicate the SMTP Session is start |
| MAIL | Used to initiate a mail transaction |
| RCPT | Used to identify an individual recipient of the mail data |
| DATA | Used to initiate the transfer of actual/body mail data |
| RSET | Used to indicate that current mail transaction will be aborted |
| NOOP | It similar to “ping”. it used to keep the connection alive or test if the client is still connected to server |
| QUIT | Used to close the connection |

## Start Writing the Code

First of all, we're going to create a new project using Rust. I'm going to use `tokio` to handle concurrent connections. We'll be running our SMTP Server over TCP (if you carefully read the RFC, SMTP can run on other transports, but we use TCP because the RFC recommends running over TCP). Before write the `main` function, you need a `tokio` into cargo.toml.

```toml
[package]
name = "smtp-server"
version = "0.1.0"
edition = "2021"

[dependencies]
tokio = { version = "1", features = ["full"] }
```

Next, here is our starter main function. By default, an `SMTP` server uses `PORT` 25, but because I ran it locally and didn't want it to run as root, I set the port to 2525.

```rust
use std::error::Error;

use tokio::{
    io::{AsyncBufReadExt, BufReader},
    net::{TcpListener, TcpStream},
};

#[tokio::main]
async fn main() {
    let server = TcpListener::bind("127.0.0.1:2525")
        .await
        .expect("Failed to start server, maybe the port already used");

    println!("Server is running...");

    loop {
        match server.accept().await {
            Ok((stream, addr)) => {
                println!("New connection from {}", addr);

                tokio::spawn(async move {
                    if let Err(e) = handle_connection(stream).await {
                        eprintln!("Error handling connection from {}: {}", addr, e);
                    }
                });
            }
            Err(e) => {
                println!("Error accepting connection: {}", e);
            }
        }
    }
}

async fn handle_connection(stream: TcpStream) -> Result<(), Box<dyn Error>> {
    let mut reader = BufReader::new(stream);

    let mut line = String::new();

    loop {
        line.clear(); // clear the line for each iteration

        let bytes_read = reader.read_line(&mut line).await?;

        if bytes_read == 0 {
            break;
        }

        println!("Received: {}", line);
    }

    Ok(())
}

```

Now, we are going to test our server. I'm going to use `Golang` for the test because it's really simple. Here is the test code.

```go
package main

import (
	"fmt"
	"net/smtp"
)

const CRLF = "\r\n"

func main() {
	serverAddress := "localhost:2525"

	from := "sender@example.com"
	to := []string{"ujang@example.com", "agus@example.com"}
	subject := "subject gonna be here"

	body := `
	<h1>Hello World</h1>
	<p>This is a paragraph.</p>

	<p>This is another paragraph.</p>
	<p>This is the last paragraph.</p>

	<p>And this is the last paragraph.</p>
	<p>And this is the last paragraph.</p>
	`

	message := []byte(
		"From: " + from + CRLF +
			"To: " + to[0] + CRLF +
			"Subject: " + subject + CRLF + CRLF +
			body + CRLF,
	)

	// auth := smtp.PlainAuth("",
	// 	"test",
	// 	"test",
	// 	"localhost",
	// )

	err := smtp.SendMail(
		serverAddress,
		// auth,
		nil,
		from,
		to,
		message,
	)
	if err != nil {
		fmt.Println("Error sending email:", err)
		return
	}

	fmt.Println("Email sent successfully!")
}

```

### Sending the initial message

When you try to run the server and then the client, you'll see nothing on both sides because the client is waiting for the initial message but the server doesn't send anything. Now, we're going to send the greeting on our server.

Change our `handle_connection` function into like this.

```rust
async fn handle_connection(mut stream: TcpStream) -> Result<(), Box<dyn Error>> {
    let (reader, mut writer) = stream.split();

    // send the greeting message
    writer
        .write_all(reply(220, "Service ready").as_bytes())
        .await
        .unwrap();

    let mut buffer = BufReader::new(reader);
    let mut line = String::new();

    loop {
        line.clear(); // clear the line for each iteration

        let bytes_read = reader.read_line(&mut line).await?;

        if bytes_read == 0 {
            println!("Connection closed by client");
            break;
        }

        println!("Received: {}", line);
    }

    Ok(())
}

fn reply(code: i32, message: &str) -> String {
    println!("Server: {}", message);

    format!("{} {}\r\n", code, message)
}
```

we sending message “220 Service Ready” it means the server is ready to start SMTP Session. When you running both the server and the client, here is the output on the server.

```bash
[08:19:04] raden :: seior  ➜  Rust/project/smtp-server ‹master*› » cargo run
   Compiling smtp-server v0.1.0 (/Users/raden/Development/Rust/project/smtp-server)
    Finished `dev` profile [unoptimized + debuginfo] target(s) in 0.60s
     Running `target/debug/smtp-server`
Server is running...
New connection from 127.0.0.1:61876
Server: Service ready
Received: EHLO localhost
```

### Parsing the command

When you look at the client and server, you'll notice they're now stuck after sending the greeting command because the server expects the `HELO` command from the client. Now, we're going to parse the command from the client. First, let's create a struct named `Command` and the function we'll use for parsing the command.

```rust
struct Command {
    command: String,
    args: Vec<String>,
}

impl Command {
    fn parse(&mut self, line: &str) {
        let parts: Vec<&str> = line.split(" ").collect();

        // check if parts is empty
        if parts.is_empty() {
            return;
        }

        self.command = parts[0].to_uppercase();

        self.args = parts[1..].iter().map(|s| s.to_string()).collect();
    }
}
```

After that, edit our `handle_connection` function into like this.

```rust
async fn handle_connection(mut stream: TcpStream) -> Result<(), Box<dyn Error>> {
    let (reader, mut writer) = stream.split();

    // send the greeting message
    writer
        .write_all(reply(220, "Service ready").as_bytes())
        .await
        .unwrap();

    let mut buffer = BufReader::new(reader);
    let mut line = String::new();
    let mut cmd = Command::new();

    loop {
        line.clear(); // clear the line for each iteration

        let bytes_read = reader.read_line(&mut line).await?;

        if bytes_read == 0 {
            println!("Connection closed by client");
            break;
        }

        println!("Received: {}", line.trim_end());

        cmd.parse(&line);
    }

    Ok(())
}
```

Instead of using strings for the command, it's better to write an enum for handling the command. Now, we'll create enums for the `SmtpCommand` and `status codes`.

```rust
const SMTP_STATUS_READY: i32 = 220;
const SMTP_STATUS_BYE: i32 = 221;
const SMTP_STATUS_OK: i32 = 250;
const SMTP_STATUS_SEND_DATA: i32 = 354;
const SMTP_STATUS_AUTH_SUCCESS: i32 = 235;
const SMTP_STATUS_ERROR_COMMAND_UNRECOGNIZED: i32 = 500;
const SMTP_STATUS_ERROR_SYNTAX: i32 = 501;
const SMTP_STATUS_ERROR_BAD_SEQUENCE: i32 = 503;

#[derive(Debug, PartialEq, Eq)]
enum SmtpCommand {
    Helo,
    Ehlo,
    Auth,
    Mail,
    Rcpt,
    Data,
    Rset,
    Noop,
    Quit,
}

#[derive(Debug, PartialEq, Eq)]
struct ParseCommandError;

impl SmtpCommand {
    fn new() -> Option<Self> {
        None
    }
}

impl FromStr for SmtpCommand {
    type Err = ParseCommandError;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        match s.to_uppercase().as_str() {
            "HELO" => Ok(SmtpCommand::Helo),
            "EHLO" => Ok(SmtpCommand::Ehlo),
            "AUTH" => Ok(SmtpCommand::Auth),
            "MAIL" => Ok(SmtpCommand::Mail),
            "RCPT" => Ok(SmtpCommand::Rcpt),
            "DATA" => Ok(SmtpCommand::Data),
            "RSET" => Ok(SmtpCommand::Rset),
            "NOOP" => Ok(SmtpCommand::Noop),
            "QUIT" => Ok(SmtpCommand::Quit),
            _ => Err(ParseCommandError),
        }
    }
}

struct Command {
    command: Option<SmtpCommand>,
    args: Vec<String>,
}

impl Command {
    fn new() -> Self {
        Self {
            command: SmtpCommand::new(),
            args: Vec::new(),
        }
    }

    fn parse(&mut self, line: &str) {
        let trimmed_line = line.trim();
        if trimmed_line.is_empty() {
            self.command = None;
            self.args.clear();
            return;
        }

        let parts: Vec<&str> = trimmed_line.split_whitespace().collect();

        self.command = parts[0].parse().ok();
        self.args = parts[1..].iter().map(|s| s.to_string()).collect();
    }
}
```

### Handle HELO/EHLO Command

For handling the `HELO/EHLO` command, simply send the status OK and you can set any message you want.

```rust
async fn handle_connection(mut stream: TcpStream) -> Result<(), Box<dyn Error>> {
    ...

    loop {
        line.clear(); // clear the line for each iteration

        let bytes_read = buffer.read_line(&mut line).await?;

        if bytes_read == 0 {
            println!("Connection closed by client");
            break;
        }

        println!("Received: {}", line.trim_end());

        cmd.parse(&line);

        match cmd.command {
            Some(SmtpCommand::Helo) | Some(SmtpCommand::Ehlo) => {
                let response = reply(SMTP_STATUS_OK, "HELO from server");

                writer.write_all(response.as_bytes()).await?;
            }
            Some(SmtpCommand::Auth) => {}
            Some(SmtpCommand::Mail) => {}
            Some(SmtpCommand::Rcpt) => {}
            Some(SmtpCommand::Data) => {}
            Some(SmtpCommand::Rset) => {}
            Some(SmtpCommand::Noop) => {}
            Some(SmtpCommand::Quit) => {}
            None => {
                let response = reply(
                    SMTP_STATUS_ERROR_COMMAND_UNRECOGNIZED,
                    "Unrecognized command",
                );

                writer.write_all(response.as_bytes()).await?;
            }
        }
    }

    Ok(())
}
```

After that, you can run both the server and client.

```rust
Server is running...
New connection from 127.0.0.1:63732
Server: Service ready
Received: EHLO localhost
Server: HELO from server
```

### Handle MAIL Command

Next, we'll handle the MAIL command. For the `MAIL` command, the client needs to send one argument containing the email address. Before handling the command, we need to make a `mail` struct containing the args from the client.

```rust
#[derive(Debug)]
struct Mail {
    from: String,
    to: Vec<String>,
    header: HashMap<String, String>,
    body: String,
}

impl Mail {
    fn new() -> Self {
        Self {
            from: String::new(),
            to: Vec::new(),
            header: HashMap::new(),
            body: String::new(),
        }
    }
}
```

After that, edit our `handle_connection` function.

```rust
async fn handle_connection(mut stream: TcpStream) -> Result<(), Box<dyn Error>> {
    ...

    let mut buffer = BufReader::new(reader);
    let mut line = String::new();
    let mut cmd = Command::new();
    let mut mail = Mail::new();

    loop {
	      ...

        match cmd.command {
            Some(SmtpCommand::Helo) | Some(SmtpCommand::Ehlo) => {
                ...
            }
            Some(SmtpCommand::Auth) => {}
            Some(SmtpCommand::Mail) => {
                if cmd.args.is_empty() {
                    let response = reply(
                        SMTP_STATUS_ERROR_SYNTAX,
                        "MAIL command requires an argument",
                    );
                    writer.write_all(response.as_bytes()).await?;
                } else {
                    let s = cmd.args[0].split(":").collect::<Vec<&str>>();
                    let r = s[1].replace("<", "").replace(">", "");

                    mail.from = r.replace(s[1], "");

                    let response = reply(SMTP_STATUS_OK, "OK");
                    writer.write_all(response.as_bytes()).await?;
                }
            }
            Some(SmtpCommand::Rcpt) => {}
            Some(SmtpCommand::Data) => {}
            Some(SmtpCommand::Rset) => {}
            Some(SmtpCommand::Noop) => {}
            Some(SmtpCommand::Quit) => {}
            None => {
               ...
            }
        }
    }

    Ok(())
}
```

Here is the output when you run the server and the client. You can see the `RCPT` command from the client. Next, we handle that command.

```rust
Server is running...
New connection from 127.0.0.1:63732
Server: Service ready
Received: EHLO localhost
Server: HELO from server
Received: MAIL FROM:<sender@example.com>
Server: OK
Received: RCPT TO:<ujang@example.com>
```

### Handle RCPT Command

Similar to the `MAIL` command, the client needs to send one argument containing the recipient email. The difference between the `MAIL` command and `RCPT` command is that the client can send more than 1 `RCPT` command for one `SMTP` session.

```rust
async fn handle_connection(mut stream: TcpStream) -> Result<(), Box<dyn Error>> {
    ...

    let mut buffer = BufReader::new(reader);
    let mut line = String::new();
    let mut cmd = Command::new();
    let mut mail = Mail::new();

    loop {
	      ...

        match cmd.command {
            Some(SmtpCommand::Helo) | Some(SmtpCommand::Ehlo) => {
                ...
            }
            Some(SmtpCommand::Auth) => {}
            Some(SmtpCommand::Mail) => {
                ...
            }
            Some(SmtpCommand::Rcpt) => {
                if cmd.args.is_empty() {
                    let response = reply(
                        SMTP_STATUS_ERROR_SYNTAX,
                        "RCPT command requires an argument",
                    );
                    writer.write_all(response.as_bytes()).await?;
                } else {
                    let s = cmd.args[0].split(":").collect::<Vec<&str>>();
                    let r = s[1].replace("<", "").replace(">", "");

                    mail.to.push(r.replace(s[1], ""));

                    let response = reply(SMTP_STATUS_OK, "OK");
                    writer.write_all(response.as_bytes()).await?;
                }
            }
            Some(SmtpCommand::Data) => {}
            Some(SmtpCommand::Rset) => {}
            Some(SmtpCommand::Noop) => {}
            Some(SmtpCommand::Quit) => {}
            None => {
               ...
            }
        }
    }

    Ok(())
}
```

And here is the output.

```rust
Server is running...
New connection from 127.0.0.1:63985
Server: Service ready
Received: EHLO localhost
Server: HELO from server
Received: MAIL FROM:<sender@example.com>
Server: OK
Received: RCPT TO:<ujang@example.com>
Server: OK
Received: RCPT TO:<agus@example.com>
Server: OK
Received: DATA
```

### Handle DATA Command

Data command contains the body and header part. Let’s take a look at the example:

```
C: DATA
S: 354 End data with <CR><LF>.<CR><LF>
C: From: "Bob Example" <bob@example.org>
C: To: "Alice Example" <alice@example.com>
C: Cc: theboss@example.com
C: Date: Tue, 15 Jan 2008 16:02:43 -0500
C: Subject: Test message
C:
C: Hello Alice.
C: This is a test message with 5 header fields and 4 lines in the message body.
C: Your friend,
C: Bob
C: .
S: 250 Ok: queued as 12345
```

The client sending `DATA` command to indicate the client start sending the mail data. The server needs to reply with `354`, meaning the server is ready to receive the data. To indicate the header and body part, the client must separate the data with `CRLF`. And to indicate the end of the body, the client sends a single `.` on a line by itself.

First, we need to add a function to parsing the header and body on our `Mail` struct.

```rust
#[derive(Debug)]
struct Mail {
    from: String,
    to: Vec<String>,
    header: HashMap<String, String>,
    body: String,
}

impl Mail {
    fn new() -> Self {
        ...
    }

    fn parse_data(&mut self, data: &str) {
        self.header.clear();
        self.body.clear();

        let lines = data.lines();
        let mut processing_headers = true;

        for line in lines {
            if processing_headers {
                if line.is_empty() {
                    processing_headers = false;
                } else {
                    if let Some((key, value)) = line.split_once(':') {
                        let key = key.trim().to_string();
                        let value = value.trim().to_string();
                        self.header.insert(key, value);
                    } else {
                        println!("Warning: Skipping malformed header line: {}", line);
                    }
                }
            } else {
                self.body.push_str(line);
                self.body.push_str("\r\n");
            }
        }

        self.body = self.body.trim_end_matches("\r\n").to_string();
    }
}
```

Then edit our `handle_connection` function.

```rust
async fn handle_connection(mut stream: TcpStream) -> Result<(), Box<dyn Error>> {
    ...

    loop {
        ...

        match cmd.command {
            Some(SmtpCommand::Helo) | Some(SmtpCommand::Ehlo) => {
	            ...
            }
            Some(SmtpCommand::Auth) => {}
            Some(SmtpCommand::Mail) => {
              ...
            }
            Some(SmtpCommand::Rcpt) => {
              ...
            }
            Some(SmtpCommand::Data) => {
                let response = reply(
                    SMTP_STATUS_SEND_DATA,
                    "Start mail input; end with <CRLF>.<CRLF>",
                );

                writer.write_all(response.as_bytes()).await?;

                let mut data: String = String::new();

								// collect the data from client
                loop {
                    let mut data_line = String::new();
                    let bytes_read = buffer.read_line(&mut data_line).await?;

                    if bytes_read == 0 {
                        break;
                    }

                    if data_line == ".\r\n" {
                        break;
                    }

                    let line_to_append = if data_line.starts_with('.') {
                        &data_line[1..]
                    } else {
                        &data_line
                    };

                    data.push_str(line_to_append);
                }

                mail.parse_data(&data);

                let response = reply(SMTP_STATUS_OK, "Mail accepted");

                writer.write_all(response.as_bytes()).await?;
            }
            Some(SmtpCommand::Rset) => {}
            Some(SmtpCommand::Noop) => {}
            Some(SmtpCommand::Quit) => {}
            None => {
                let response = reply(
                    SMTP_STATUS_ERROR_COMMAND_UNRECOGNIZED,
                    "Unrecognized command",
                );

                writer.write_all(response.as_bytes()).await?;
            }
        }
    }

    Ok(())
}
```

Now you can run both the `server` and `client`. You can verify if our data parser is correct by printing the `mail` variable.

```rust
Server is running...
New connection from 127.0.0.1:59925
Server: Service ready
Received: EHLO localhost
Server: HELO from server
Received: MAIL FROM:<sender@example.com>
Server: OK
Received: RCPT TO:<ujang@example.com>
Server: OK
Received: RCPT TO:<agus@example.com>
Server: OK
Received: DATA
Server: Start mail input; end with <CRLF>.<CRLF>
Server: Mail accepted
Received: QUIT
```

### Handle RSET, NOOP, and QUIT Command

For the `RSET`, `NOOP`, `QUIT` is similar. we just reply to the client with different message. for the `RSET` command, we need to clear the mail.

```rust
async fn handle_connection(mut stream: TcpStream) -> Result<(), Box<dyn Error>> {
    ...

    loop {
        line.clear(); // clear the line for each iteration

        // println!("Mail: {:?}", mail);

        let bytes_read = buffer.read_line(&mut line).await?;

        if bytes_read == 0 {
            println!("Connection closed by client");
            break;
        }

        println!("Received: {}", line.trim_end());

        cmd.parse(&line);

        match cmd.command {
            Some(SmtpCommand::Helo) | Some(SmtpCommand::Ehlo) => {
		          ...
            }
            Some(SmtpCommand::Auth) => {}
            Some(SmtpCommand::Mail) => {
              ...
            }
            Some(SmtpCommand::Rcpt) => {
              ...
            }
            Some(SmtpCommand::Data) => {
              ...
            }
            Some(SmtpCommand::Rset) => {
                let response = reply(SMTP_STATUS_OK, "Resseting the session state");

                writer.write_all(response.as_bytes()).await?;

                mail = Mail::new();
            }
            Some(SmtpCommand::Noop) => {
                let response = reply(SMTP_STATUS_OK, "I'm with you <3");

                writer.write_all(response.as_bytes()).await?;
            }
            Some(SmtpCommand::Quit) => {
                let response = reply(SMTP_STATUS_BYE, "Bye!");

                println!("mail: {:?}", mail);

                writer.write_all(response.as_bytes()).await?;

                break;
            }
            None => {
	            ...
            }
        }
    }

    Ok(())
}
```

Now, you can running the application.

```
Server is running...
New connection from 127.0.0.1:59925
Server: Service ready
Received: EHLO localhost
Server: HELO from server
Received: MAIL FROM:<sender@example.com>
Server: OK
Received: RCPT TO:<ujang@example.com>
Server: OK
Received: RCPT TO:<agus@example.com>
Server: OK
Received: DATA
Server: Start mail input; end with <CRLF>.<CRLF>
Server: Mail accepted
Received: QUIT
Server: Bye!
mail: Mail { from: "sender@example.com", to: ["ujang@example.com", "agus@example.com"], header: {"To": "ujang@example.com", "From": "sender@example.com", "Subject": "subject gonna be here"}, body: "\r\n\t<h1>Hello World</h1>\r\n\t<p>This is a paragraph.</p>\r\n\r\n\t<p>This is another paragraph.</p>\r\n\t<p>This is the last paragraph.</p>\r\n\r\n\t<p>And this is the last paragraph.</p>\r\n\t<p>And this is the last paragraph.</p>\r\n\t" }
```

## Conclusion

Now, we have created our `SMTP` server without any external libraries. You may have noticed that we skipped the `AUTH` command. I’m going to explain it in the next articles.

## References

[https://datatracker.ietf.org/doc/html/rfc5321](https://datatracker.ietf.org/doc/html/rfc5321)

[https://en.wikipedia.org/wiki/Simple_Mail_Transfer_Protocol](https://en.wikipedia.org/wiki/Simple_Mail_Transfer_Protocol)
