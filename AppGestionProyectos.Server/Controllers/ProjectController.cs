using AppGestionProyectos.Server.Data;
using AppGestionProyectos.Server.Models;
using AppGestionProyectos.Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using NuGet.Common;
using System.Net;
using System.Net.Mail;
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


        [HttpPost]
        public async Task<IActionResult> CreateProject([FromBody] object fields)
        {
            int environment = 0;
            Project.ProjectDTO projectFields;
            try
            {
                var options = new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true,
                    UnmappedMemberHandling = JsonUnmappedMemberHandling.Disallow
                };
                projectFields = JsonSerializer.Deserialize<Project.ProjectDTO>(fields.ToString(), options);
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponse<object>(false, "bad-request", false, ex.ToString()));
            }
            try
            {
                Project createdProject = await Models.Project.CreateProject(projectFields.w_environment_id,projectFields.name , _AppDbContext);
                if (createdProject.Id > 0)
                {
                    return Ok(new ApiResponse<object>(true, "access-granted", createdProject));
                }
                else
                {
                    return StatusCode(500, new ApiResponse<object>(false, "server-error", "Could not create the project"));
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<object>(false, "server-error", ex.ToString()));
            }

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

        [Route("deleteProject")]
        [HttpDelete]
        public async Task<IActionResult> DeleteProject([FromQuery(Name = "projectId")] int projectId)
        {
            try
            {
                bool deleted = await Models.Project.DeleteProject(projectId, _AppDbContext);
                if (deleted)
                    return Ok(new ApiResponse<object>(true, "success", deleted));
                return NotFound(new ApiResponse<object>(false, "not-found", "Project not found"));
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<object>(false, "server-error", ex.ToString()));
            }
        }
    }
}
