using AppGestionProyectos.Server.Data;
using Microsoft.CodeAnalysis;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json.Linq;
using NuGet.Packaging.Signing;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AppGestionProyectos.Server.Models
{
    //[PrimaryKey(nameof(Id), nameof(W_Environment_id))]
    public class Project
    {
        [Key]
        public int Id { get; set; }
        public int W_Environment_id { get; set; }
        public string Public_id { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public DateTime Creation_date { get; set; }

        [Column(TypeName = "json")]
        public string? Json_data { get; set; }

        public record struct ProjectDTO(int w_environment_id, string name);
        public record struct RenameProjectDTO(string public_Id, string name);

        public static async Task<Project> CreateProject(int wEnvironment, string name, AppDbContext appDbContext)
        {
            string publicId = Guid.NewGuid().ToString();
            Console.WriteLine(publicId);
            Project project = new Project
            {
                W_Environment_id = wEnvironment,
                Name = name,
                Public_id=publicId,
                Creation_date = DateTime.Now,
                Json_data = "{}"
            };
            try
            {
                await appDbContext.Project.AddAsync(project);
                await appDbContext.SaveChangesAsync();
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
            }
            return project;
        }

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
        public static async Task<bool> SaveProjectData(string data, string public_id, AppDbContext appDbContext)
        {
            bool result = false;
            try
            {
                var project = await appDbContext.Project
                    .FirstOrDefaultAsync(project => project.Public_id == public_id);
                if (project == null)
                    return false;

                project.Json_data = data;
                return await appDbContext.SaveChangesAsync() > 0;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }

            return result;
        }

        public static async Task<object?> GetProjectData(string publicId, AppDbContext appDbContext)
        {
            var data = await appDbContext.Project
                .Where(project => project.Public_id == publicId)
                .Select(project => project.Json_data)
                .FirstOrDefaultAsync();

            return data; // Updated to return nullable object explicitly
        }

        public static async Task<bool> DeleteProject(string publicId, AppDbContext appDbContext)
        {
            //var project = await appDbContext.Project.FindAsync(publicId);
            
            var project = await appDbContext.Project
                .Where(p => p.Public_id == publicId)
                .FirstOrDefaultAsync();
            if (project == null)
                return false;
            //appDbContext.User_Project.RemoveRange(userProjects);
            appDbContext.Project.Remove(project);
            return await appDbContext.SaveChangesAsync() > 0;
        }

        public static async Task<bool> RenameProject(string publicId, string name, AppDbContext appDbContext)
        {
            try
            {
                //var project = await appDbContext.Project.FindAsync(publicId);
                var project = await appDbContext.Project
                .Where(p => p.Public_id == publicId)
                .FirstOrDefaultAsync();
                if (project == null)
                    return false;

                project.Name = name;
                return await appDbContext.SaveChangesAsync() > 0;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return false;
            }
        }
    }

}
