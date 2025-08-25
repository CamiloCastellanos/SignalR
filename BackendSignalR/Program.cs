using BackendSignalR.Context;
using BackendSignalR.Hubs;
using BackendSignalR.Workers;
using Microsoft.EntityFrameworkCore;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

///
builder.Services.AddDbContext<DataContext>(options => options.UseSqlite("Data Source=mydatabase.sqlite"));
// Add the seeding worker
builder.Services.AddHostedService<SeedingWorker>();
// Configure the pipeline to accept enums as strings, instead of just numbers
builder.Services.AddMvc().AddJsonOptions(x =>
{
    x.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
});
// Add SignalR
builder.Services.AddSignalR();
///

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular",
           policy => policy
               .WithOrigins("http://localhost:4200") // 👈 origen del frontend
               .AllowAnyHeader()
               .AllowAnyMethod()
               .AllowCredentials()
       );
});

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();
app.UseCors(builder =>
{
    builder
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials()
        .WithOrigins("https://localhost:7278", "https://localhost:44406");
});

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

//
// Configure our SignalR hub
app.MapHub<FoodHub>("/foodhub");
app.MapHub<ChatHub>("/hubs/chat");
//

app.Run();
