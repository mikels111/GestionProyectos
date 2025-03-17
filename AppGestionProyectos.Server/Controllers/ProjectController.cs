using AppGestionProyectos.Server.Models;
using Microsoft.AspNetCore.Mvc;

namespace AppGestionProyectos.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ProjectController : ControllerBase
    {
        private readonly Project _project;

        public ProjectController(Project project)
        {
            _project = project;
        }
        [Route("GetProject")]
        [HttpGet(Name = "GetProject")]
        public IActionResult GetProject()
        {
            return Ok();
        }
        


    }
}
