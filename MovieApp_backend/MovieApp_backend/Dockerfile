# ----- Giai đoạn 1: Build -----
# Sử dụng image .NET SDK (ở đây ví dụ là .NET 8.0)
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy file .csproj trước và restore (để tận dụng cache của Docker)
COPY MovieApp_backend.csproj .
RUN dotnet restore "MovieApp_backend.csproj"

# Copy toàn bộ source code còn lại và build
COPY . .
RUN dotnet publish "MovieApp_backend.csproj" -c Release -o /app/publish

# ----- Giai đoạn 2: Final -----
# Sử dụng image ASP.NET Runtime (nhẹ hơn SDK rất nhiều)
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

# Copy các file đã publish từ giai đoạn 'build'
COPY --from=build /app/publish .

# Mặc định, image aspnet:8.0 chạy trên port 8080.
# Khai báo port để người dùng biết container này lắng nghe ở port nào.
ENV ASPNETCORE_URLS=http://+:80
EXPOSE 80

# Lệnh để khởi động API của bạn
ENTRYPOINT ["dotnet", "MovieApp_backend.dll"]