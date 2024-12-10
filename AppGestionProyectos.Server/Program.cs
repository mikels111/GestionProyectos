using AppGestionProyectos.Server.Data;
using Microsoft.EntityFrameworkCore;
using AppGestionProyectos.Server.Controllers;
using AppGestionProyectos.Server.Models;
using AppGestionProyectos.Server.Clases;
using NuGet.Protocol.Core.Types;

var builder = WebApplication.CreateBuilder(args);
//Services
builder.Services.AddScoped<RoleController>();
builder.Services.AddScoped<Role>();
builder.Services.AddScoped<ProjectController>();
builder.Services.AddScoped<Project>();
builder.Services.AddScoped<UserController>();
builder.Services.AddScoped<User>();
builder.Services.AddScoped<GoogleTokenInfo>();


// Add services to the container.
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<AppDbContext>(options =>
{
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString));
});
var WhiteListOrigins = "whiteListOrigins";
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: WhiteListOrigins,
                      policy =>
                      {
                          policy.WithOrigins("https://localhost:5173").AllowAnyHeader();
                      });
});


builder.Services.AddControllers();


// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
//builder.Services.AddEndpointsApiExplorer();
//builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    //app.UseSwagger();
    //app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseRouting();
app.UseCors(WhiteListOrigins);
app.UseAuthorization();

app.MapControllers();
//app.MapControllerRoute(
//    name: "default",
//    pattern: "{controller=User}");

//app.MapGet("/getusuarios", () => "hello world");

//app.MapFallbackToFile("/index.html");


app.Run();
