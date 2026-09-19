using AppGestionProyectos.Server.Data;
using Microsoft.CodeAnalysis;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.BlazorIdentity.Pages.Manage;
using Newtonsoft.Json.Linq;
using NuGet.Packaging.Signing;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Xml.Linq;

namespace AppGestionProyectos.Server.Models
{
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
                Public_id = publicId,
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
        public static async Task<bool> SaveProjectData(string data, string publicId, string userEmail, AppDbContext appDbContext)
        {
            bool result = false;
            try
            {
                //var userId = await appDbContext.User
                //    .Where(u => u.Mail == userEmail)
                //    .Select(u => u.Id)
                //    .FirstOrDefaultAsync();

                //// Verifica que el usuario tenga al menos una relación con el proyecto (autorización básica).
                //var verification = await appDbContext.User_Project
                //    .Where(up => up.User_Id == userId)
                //    .Join(appDbContext.Project,
                //        up => up.Project_Id,
                //        p => p.Id,
                //        (up, p) => p).Where(p => p.Public_id == publicId)
                //    .FirstOrDefaultAsync();

                //if (verification == null) return false;
                if (!await VerifyUserProject(publicId, userEmail, appDbContext)) return false;

                var project = await appDbContext.Project
                    .FirstOrDefaultAsync(project => project.Public_id == publicId);
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

        public static async Task<object?> GetProjectData(string publicId, string userEmail, AppDbContext appDbContext)
        {
            //var userId = await appDbContext.User
            //        .Where(u => u.Mail == userEmail)
            //        .Select(u => u.Id)
            //        .FirstOrDefaultAsync();

            //// Verifica que el usuario tenga al menos una relación con el proyecto (autorización básica).
            //var verification = await appDbContext.User_Project
            //    .Where(up => up.User_Id == userId)
            //    .Join(appDbContext.Project,
            //        up => up.Project_Id,
            //        p => p.Id,
            //        (up, p) => p).Where(p => p.Public_id == publicId)
            //    .FirstOrDefaultAsync();

            //if (verification == null) return null;
            if (!await VerifyUserProject(publicId, userEmail, appDbContext)) return false;

            var data = await appDbContext.Project
                .Where(project => project.Public_id == publicId)
                .Select(project => project.Json_data)
                .FirstOrDefaultAsync();

            return data; // Updated to return nullable object explicitly
        }

        public static async Task<bool> DeleteProject(string publicId, string userEmail, AppDbContext appDbContext)
        {
            //var userId = await appDbContext.User
            //    .Where(u => u.Mail == userEmail)
            //    .Select(u => u.Id)
            //    .FirstOrDefaultAsync();

            //// Verifica que el usuario tenga al menos una relación con el proyecto (autorización básica).
            //var verification = await appDbContext.User_Project
            //    .Where(up => up.User_Id == userId)
            //    .Join(appDbContext.Project,
            //        up => up.Project_Id,
            //        p => p.Id,
            //        (up, p) => p).Where(p => p.Public_id == publicId)
            //    .FirstOrDefaultAsync();

            //if (verification == null) return false;
            if (!await VerifyUserProject(publicId, userEmail, appDbContext)) return false;
            var project = await appDbContext.Project
                .Where(p => p.Public_id == publicId)
                .FirstOrDefaultAsync();
            if (project == null)
                return false;
            //appDbContext.User_Project.RemoveRange(userProjects);
            appDbContext.Project.Remove(project);
            return await appDbContext.SaveChangesAsync() > 0;
        }

        public static async Task<bool> RenameProject(string publicId, string name, string userEmail, AppDbContext appDbContext)
        {
            try
            {
                //var userId = await appDbContext.User
                //    .Where(u => u.Mail == userEmail)
                //    .Select(u => u.Id)
                //    .FirstOrDefaultAsync();

                //// Verifica que el usuario tenga al menos una relación con el proyecto (autorización básica).
                //var verification = await appDbContext.User_Project
                //    .Where(up => up.User_Id == userId)
                //    .Join(appDbContext.Project,
                //        up => up.Project_Id,
                //        p => p.Id,
                //        (up, p) => p).Where(p => p.Public_id == publicId)
                //    .FirstOrDefaultAsync();

                //if (verification == null) return false;
                if (!await VerifyUserProject(publicId, userEmail, appDbContext)) return false;

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

        public static async Task<bool> VerifyUserProject(string publicId, string userEmail, AppDbContext appDbContext)
        {
            var userId = await appDbContext.User
                    .Where(u => u.Mail == userEmail)
                    .Select(u => u.Id)
                    .FirstOrDefaultAsync();

            // Verifica que el usuario tenga al menos una relación con el proyecto (autorización básica).
            var verification = await appDbContext.User_Project
                .Where(up => up.User_Id == userId)
                .Join(appDbContext.Project,
                    up => up.Project_Id,
                    p => p.Id,
                    (up, p) => p).Where(p => p.Public_id == publicId)
                .FirstOrDefaultAsync();

            if (verification == null) return false;
            return true;
        }

    }

}
