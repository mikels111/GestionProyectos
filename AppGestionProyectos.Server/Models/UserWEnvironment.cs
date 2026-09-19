using AppGestionProyectos.Server.Data;
using Microsoft.EntityFrameworkCore;
using Mono.TextTemplating;
using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;

namespace AppGestionProyectos.Server.Models
{
    [PrimaryKey(nameof(User_Id), nameof(W_environment))]
    public class UserWEnvironment
    {
        [NotNull]
        public int User_Id { get; set; }
        [NotNull]
        public int W_environment { get; set; }
        public string? Rol_w_environment { get; set; }
        public string? Creator_mail { get; set; }
        private readonly AppDbContext _dbContext;

        public static async Task<UserWEnvironment> CreateUserWEnvironment(int userId, int wEnvironmentId, string rol, string? creatorMail, AppDbContext appDbContext)
        {
            UserWEnvironment userWEnvironment = new UserWEnvironment
            {
                User_Id = userId,
                W_environment = wEnvironmentId,
                Rol_w_environment = rol,
                Creator_mail = creatorMail
            };
            try
            {
                await appDbContext.User_W_Environment.AddAsync(userWEnvironment);
                await appDbContext.SaveChangesAsync();
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
            }
            return userWEnvironment;
        }
    }
}
