using AppGestionProyectos.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace AppGestionProyectos.Server.Data
{
    public class AppDbContext : DbContext
    {
        private readonly IConfiguration _configuration;
        //public ApplicationDbContext(IConfiguration configuration)
        //{
        //    _configuration = configuration;
        //}
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            var connectionString = _configuration.GetConnectionString("DefaultConnection");
            if (!optionsBuilder.IsConfigured && connectionString != null)
            {
                optionsBuilder.UseMySql(
                                    connectionString.ToString(),
                                    new MySqlServerVersion(new Version(8, 0, 28))
                                );
            }
        }

        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
        public DbSet<Role> Role { get; set; }
        public DbSet<User> User { get; set; }
        public DbSet<WorkEnvironment> Work_Environment { get; set; }
        public DbSet<Project> Project { get; set; }
        public DbSet<Content> Content { get; set; }
        public DbSet<UserWEnvironment> User_W_Environment { get; set; }
        public DbSet<UserProject> User_Project { get; set; }

    }
}
