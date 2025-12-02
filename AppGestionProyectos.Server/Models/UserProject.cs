using AppGestionProyectos.Server.Data;
using Microsoft.EntityFrameworkCore;
using System;

namespace AppGestionProyectos.Server.Models
{
    [PrimaryKey(nameof(User_Id), nameof(Project_Id))]
    public class UserProject
    {
        public int User_Id { get; set; }
        public int Project_Id { get; set; }
        public string Creator_mail { get; set; }
        public record struct UserProjectDTO(int project);

        public static async Task<UserProject> CreateUserProject(int user, int project, AppDbContext appDbContext)
        {
            UserProject uProject = new UserProject
            {
                User_Id = user,
                Project_Id = project
            };
            try
            {
                await appDbContext.User_Project.AddAsync(uProject);
                await appDbContext.SaveChangesAsync();
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
            }
            return uProject;
        }
    }
}
