using AppGestionProyectos.Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.BlazorIdentity.Pages.Manage;
using System.Text.Json.Serialization;
using System.Text.Json;
using System.Text.RegularExpressions;
using NuGet.Common;
using AppGestionProyectos.Server.Data;
using AppGestionProyectos.Server.Models;
using System.Threading.Tasks;

namespace AppGestionProyectos.Server.Controllers
{
    [Authorize]
    [ApiController]
    [Route("/api/[controller]")]
    public class WEnvironmentController : ControllerBase
    {
        private readonly AppDbContext _AppDbContext;
        public WEnvironmentController(AppDbContext appDbContext)
        {
            _AppDbContext = appDbContext;
        }

        [Route("getWEnvironments")]
        [HttpGet]
        public async Task<IActionResult> GetWorkspaces()
        {
            List<WorkEnvironment> workEnvironments = new List<WorkEnvironment>();
            try
            {
                //if (!string.IsNullOrEmpty(fields) && Regex.IsMatch(fields, @"<[^>]+>"))
                //{
                //    return BadRequest(new ApiResponse<object>(false, "bad-request", null));
                //}
                Console.WriteLine(User.Identities.FirstOrDefault(claim=>claim.Name=="Mail"));
                string? userEmail = User.Claims.FirstOrDefault(c => c.Type == "Mail")?.Value;
                //consulta
                workEnvironments = await Models.WorkEnvironment.GetUserWEnvironments(userEmail, _AppDbContext);
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponse<object>(false, "bad-request", null, ex.ToString()));
            }
            return Ok(new ApiResponse<object>(true, "success", workEnvironments));
        }
    }
}
