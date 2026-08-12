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
            //int environment = 0;
            //Console.WriteLine("new product: " + newProduct.Name + ", " + newProduct.Sku + ", " + newProduct.Stock + ", " + newProduct.Category);
            //try
            //{
            //    var options = new JsonSerializerOptions
            //    {
            //        PropertyNameCaseInsensitive = true,
            //        UnmappedMemberHandling = JsonUnmappedMemberHandling.Disallow
            //    };
            //    projectFields = JsonSerializer.Deserialize<Models.Project.ProjectDTO>(fields.ToString(), options);
            //}
            //catch (Exception ex)
            //{
            //    return BadRequest(new ApiResponse<object>(false, "bad-request", false, ex.ToString()));
            //}
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                //Product createdProduct = await Product.CreateProduct(newProduct);
                //if (createdProduct.Id > 0)
                //{
                //    return Ok(new ApiResponse<object>(true, "access-granted", createdProject));
                //}
                //else
                //{
                //    return StatusCode(500, new ApiResponse<object>(false, "server-error", "Could not create the project"));
                //}
                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<object>(false, "server-error", ex.ToString()));
            }

        }
    }
}
