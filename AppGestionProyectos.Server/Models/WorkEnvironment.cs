using AppGestionProyectos.Server.Data;
using AppGestionProyectos.Server.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.BlazorIdentity.Pages.Manage;
using NuGet.Packaging.Signing;
using System.ComponentModel.DataAnnotations;

namespace AppGestionProyectos.Server.Models
{
    public class WorkEnvironment
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public DateTime Creation_date { get; set; }

        public static async Task<List<WorkEnvironment>> GetUserWEnvironments(string mail, AppDbContext appDbContext)
        {
            List<WorkEnvironment> wEnvironments = new List<WorkEnvironment>();
            try
            {
                var userId = await appDbContext.User
                    .Where(u => u.Mail == mail)
                    .Select(u => u.Id)
                    .FirstOrDefaultAsync();

                wEnvironments = await appDbContext.User_W_Environment
                    .Where(uwe => uwe.User_Id == userId)
                    .Join(appDbContext.Work_Environment,
                      uwe => uwe.W_environment,
                      w => w.Id,
                      (uwe, w) => w)
                    .ToListAsync();
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
            }
            return wEnvironments;
        }
    }
}
