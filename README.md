# AngMap

A simple web application that lets you create notes via shapes, on two-level administrative map of Germany.

![image](https://user-images.githubusercontent.com/124204065/232253536-68f6c617-b589-4245-b721-243b434f3060.png)

## How to start

To create mongodb and sql images run the command below in the project folder

```console
docker compose up --detach
```

To start frontend application run below command in the angMap folder

```console
ng serve --open
```

To start .net api run below command in the angMapAPI folder

```console
dotnet run
```
***
If you get the error below

> The file is not digitally signed. You cannot run this script on the current system.

 Try the command below
 
 ```console
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```
***
