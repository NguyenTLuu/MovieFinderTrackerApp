using Microsoft.EntityFrameworkCore;
using MovieApp_backend.Model;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowExpo", policy =>
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod());
});
string connectionStringName;
if (builder.Environment.IsDevelopment())
{
    connectionStringName = "DBConnection";
}
else
{
    connectionStringName = "AzureDBConnection";
}

builder.Services.AddDbContext<MovieAppContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString(connectionStringName)));

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();
app.UseCors("AllowExpo");
// Configure the HTTP request pipeline.

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;

    try
    {
        var dbContext = services.GetRequiredService<MovieAppContext>();

     
        dbContext.Database.Migrate();
    }
    catch (Exception ex)
    {
        
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "Error while running migration database.");
    }
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseSwagger();
app.UseSwaggerUI();

//app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
