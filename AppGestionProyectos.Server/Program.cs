using AppGestionProyectos.Server.Controllers;
using AppGestionProyectos.Server.Data;
using AppGestionProyectos.Server.Models;
using AppGestionProyectos.Server.Services;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using NuGet.Protocol.Core.Types;
using System.Text;

var builder = WebApplication.CreateBuilder(args);
//Services
builder.Services.AddScoped<RoleController>();
builder.Services.AddScoped<Role>();
builder.Services.AddScoped<ProjectController>();
builder.Services.AddScoped<Project>();
builder.Services.AddScoped<User>();
builder.Services.AddScoped<UserController>();
builder.Services.AddScoped<GoogleTokenInfo>();


// Add services to the container.
var connectionString = builder.Configuration.GetConnectionString("ConnectionStrings");

var connectionStrings = builder.Configuration.GetSection("ConnectionStrings");
var mysql_connection_string = connectionStrings["DefaultConnection"];   

builder.Services.AddDbContext<AppDbContext>(options =>
{
    //options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString));
    options.UseMySql(mysql_connection_string, ServerVersion.AutoDetect(mysql_connection_string));
    
});
var WhiteListOrigins = "whiteListOrigins";
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: WhiteListOrigins,
                      policy =>
                      {
                          policy.WithOrigins("https://localhost:3000")
                          .AllowCredentials()
                          .AllowAnyHeader()
                          .AllowAnyMethod();
                      });
});

var key = Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]);

builder.Services.AddAuthentication(options =>
    {
        //options.DefaultSignInScheme = CookieAuthenticationDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    }
    ).AddCookie()
    .AddJwtBearer(options =>
    {
        options.RequireHttpsMetadata = true;
        options.SaveToken = true;
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(key)
        };

        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                if (context.Request.Cookies.ContainsKey("AT"))
                {
                    context.Token = context.Request.Cookies["AT"];
                }
                return Task.CompletedTask;
            }
        };
    });


builder.Services.AddControllersWithViews();


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
if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}
app.UseRouting();
app.UseCors(WhiteListOrigins);
app.UseAuthorization();
app.MapControllers();
app.Run();
