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
    [Route("[controller]")]
    public class WEnvironmentController : ControllerBase
    {
        private readonly AppDbContext _AppDbContext;
        public WEnvironmentController(AppDbContext appDbContext)
        {
            _AppDbContext = appDbContext;
        }

        [Route("getWEnvironments")]
        [HttpGet]
        public async Task<IActionResult> GetWorkspaces([FromQuery(Name = "fields")] string fields)
        {
            Models.User.UserDTO userFields = new Models.User.UserDTO();
            if (Request.ContentLength == 0)
            {
                return BadRequest(new ApiResponse<object>(false, "bad-request", false));
            }
            try
            {
                var options = new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true,
                    UnmappedMemberHandling = JsonUnmappedMemberHandling.Disallow,
                };

                if (Regex.IsMatch(fields.ToString(), @"<[^>]+>"))
                {
                    return BadRequest(new ApiResponse<object>(false, "bad-request", null));
                }

                //consulta
                List<WorkEnvironment> workEnvironments = await Models.WorkEnvironment.GetUserWEnvironments(fields, _AppDbContext);
                return Ok(new ApiResponse<object>(true, "success", workEnvironments));

            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponse<object>(false, "bad-request", null, ex.ToString()));
            }
        }
    }
}
