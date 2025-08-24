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

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

//
// Configure our SignalR hub
app.MapHub<FoodHub>("/foodhub");
//

app.Run();
