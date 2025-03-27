using AppGestionProyectos.Server.Models;
using AppGestionProyectos.Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NuGet.Common;

namespace AppGestionProyectos.Server.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class ProjectController : ControllerBase
    {
        private readonly Project _project;

        public ProjectController(Project project)
        {
            _project = project;
        }
        [Route("get")]
        [HttpPost]
        public IActionResult GetProject()
        {
            return Ok(new ApiResponse<object>(true, "access-granted", null));
        }
        


    }
}
