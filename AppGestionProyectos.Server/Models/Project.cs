using AppGestionProyectos.Server.Data;
using Microsoft.CodeAnalysis;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json.Linq;
using NuGet.Packaging.Signing;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AppGestionProyectos.Server.Models
{
    [PrimaryKey(nameof(Id), nameof(W_Environment_id))]
    public class Project
    {
        public int Id { get; set; }
        public int W_Environment_id { get; set; }
        [Required]
        public String Name { get; set; }
        [Required]
        public DateTime Creation_date { get; set; }

        [Column(TypeName = "json")]
        public string? Json_data { get; set; }

        public static async Task<List<Project>> GetWorkEnvironmentProjects(string mail, int wEnv, AppDbContext appDbContext)
        {
            List<Project> projects = new List<Project>();

            var userId = await appDbContext.User
                    .Where(u => u.Mail == mail)
                    .Select(u => u.Id)
                    .FirstOrDefaultAsync();
            projects = await appDbContext.User_Project
                .Where(up => up.User_Id == userId)
                .Join(appDbContext.Project,
                    up => up.Project_Id,
                    p => p.Id,
                    (up, p) => p).Where(p => p.W_Environment_id == wEnv)
                .ToListAsync();
            return projects;
        }
        public static async Task<bool> SaveProjectData(string data, int projectId, AppDbContext appDbContext)
        {
            bool result = false;
            try
            {
                var project = appDbContext.Project.FirstOrDefault(project => project.Id == projectId);
                //if (project == null)
                //    return false;

                project.Json_data = data;
                return await appDbContext.SaveChangesAsync() > 0;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }

            return result;
        }

        public static async Task<object?> GetProjectData(int project_id, AppDbContext appDbContext)
        {
            var data = await appDbContext.Project
                .Where(project => project.Id == project_id)
                .Select(project => project.Json_data)
                .FirstOrDefaultAsync();

            return data; // Updated to return nullable object explicitly
        }
    }

}
