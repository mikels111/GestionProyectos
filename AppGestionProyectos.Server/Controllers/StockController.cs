using AppGestionProyectos.Server.Data;
using AppGestionProyectos.Server.Models;
using AppGestionProyectos.Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using System.Text.Json.Serialization;


namespace AppGestionProyectos.Server.Controllers
{
    [Authorize]
    [ApiController]
    [Route("/api/[controller]")]
    public class StockController : Controller
    {
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Product newProduct)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<object>(false, "server-error", ex.ToString()));
            }

        }
    }
}
