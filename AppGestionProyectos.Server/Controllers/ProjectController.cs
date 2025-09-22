using AppGestionProyectos.Server.Data;
using AppGestionProyectos.Server.Models;
using AppGestionProyectos.Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using NuGet.Common;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Text.RegularExpressions;

namespace AppGestionProyectos.Server.Controllers
{
    [Authorize]
    [ApiController]
    [Route("/api/[controller]")]
    public class ProjectController : ControllerBase
    {
        private readonly Project _project;
        private readonly AppDbContext _AppDbContext;

        public ProjectController(Project project, AppDbContext appDbContext)
        {
            _project = project;
            _AppDbContext = appDbContext;
        }
        [Route("getProjects")]
        [HttpGet]
        public async Task<IActionResult> GetProjects([FromQuery(Name = "workspace")] int wEnv)
        {
            List<Project> projects = new List<Project>();

            //var pattern = @"<[^>]+>";

            //if ((!string.IsNullOrEmpty(fields) && Regex.IsMatch(fields, pattern)))
            //{
            //    return BadRequest(new ApiResponse<object>(false, "invalid-parameters", null));

            //}
            string? userEmail = User.Claims.FirstOrDefault(c => c.Type == "Mail")?.Value;
            //consulta
            projects = await Models.Project.GetWorkEnvironmentProjects(userEmail, wEnv, _AppDbContext);
            return Ok(new ApiResponse<object>(true, "success", projects));
        }
        [Route("saveProjectData")]
        [HttpPost]
        public async Task<IActionResult> SaveProjectData([FromBody] object fields)
        {
            try
            {

                if (Regex.IsMatch(fields.ToString(), @"<[^>]+>"))
                {
                    return BadRequest(new ApiResponse<object>(false, "bad-request", null));
                }
                var jsonFields = JsonSerializer.Serialize(fields);

                JObject jsonObj = JObject.Parse(jsonFields);
                int jsoProjectId = Int32.Parse((string)jsonObj["projectId"]);
                string jsoData = jsonObj["content"].ToString();
                bool saveResult = await Models.Project.SaveProjectData(jsoData, jsoProjectId, _AppDbContext);
                if (saveResult)
                {
                    return Ok(new ApiResponse<object>(true, "success", saveResult));
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<object>(false, "server-error", ex.ToString()));
            }
            return StatusCode(500, new ApiResponse<object>(false, "server-error", "Could not get data"));
        }
        [Route("getProjectData")]
        [HttpGet]
        public async Task<IActionResult> GetProjectData([FromQuery(Name = "fields")] int fields)
        {
            try
            {
                var result = await Models.Project.GetProjectData(fields, _AppDbContext);
                if (result != null)
                {
                    return Ok(new ApiResponse<object>(true, "success", result));
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<object>(false, "server-error", ex.ToString()));
            }
            return Ok(new ApiResponse<object>(true, "success", null));
        }
    }
}
