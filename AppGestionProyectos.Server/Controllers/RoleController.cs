
using AppGestionProyectos.Server.Models;
using Microsoft.AspNetCore.Mvc;

namespace AppGestionProyectos.Server.Controllers
{
    [ApiController]
    [Route("/api/[controller]")]
    public class RoleController : ControllerBase
    {
        private readonly Role _role;
        private readonly ILogger<UserController> _logger;
        public RoleController(Role rol, ILogger<UserController> logger)
        {
            _role = rol;
            _logger = logger;
        }

        [Route("GetRoles")]
        public IActionResult GetRoles()
        {
            var roles = _role.GetAllRoles();
            return Ok(roles);
        }

        [Route("GetRoleByUser/{userId}")]
        public IActionResult GetRoleByUser(int userId)
        {
            _logger.LogDebug("User id: "+userId.ToString());
            return Ok();
        }
    }
}
