using AppGestionProyectos.Server.Clases;
using AppGestionProyectos.Server.Models;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;


namespace AppGestionProyectos.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UserController : ControllerBase
    {
        private readonly User _user;
        private readonly ILogger<UserController> _logger;
        static readonly HttpClient client = new HttpClient();

        public UserController(User user, ILogger<UserController> logger)
        {
            _user = user;
            _logger = logger;
        }

        [HttpGet(Name = "GetUsers")]
        [Route("getusers")]
        public IActionResult GetUsers()
        {
            var user = _user.GetAllUsers();
            return Ok(user);
        }
        [HttpPost]
        [Route("LoginUser")]
        public IActionResult LoginUser(User User)
        {
            var result = new { message = "" };
            IEnumerable<User> loginResult = User.Login();
            if (loginResult.Any())
            {
                return Ok(loginResult.First());
            }
            else if (!loginResult.Any())
            {
                result = new { message = "Login failed" };
                return Ok(result);
            }
            return Ok();
        }

        [HttpPost]
        [Route("LoginUserGoogle")]
        public async Task<IActionResult> LoginUserGoogle([FromHeader] string token)
        {
            var result = new { message = "" };
            // hacer la peticion http a https://oauth2.googleapis.com/tokeninfo?access_token=<token>
            //una vez validado obtener correo 
            try
            {
                //https://oauth2.googleapis.com/tokeninfo?access_token=ya29.a0AeDClZC6D1oEFb_ZDPbo0yQ4tRgxuI2AaR9uLVOb8cr8m0SeR3qnquVHq2H7gV-jYXzWPOdH_KGFV7fqdFcNhL44KjtMCRCnyeIqeuqGrMYvCxVMpfaE3umGJmbOGyy6o9WHkprzFxp197ZQY9tqOliUF7RnumCVDG8aCgYKAS4SARASFQHGX2Mi4ARcuWfh1L9TOZDAqjhpZg0170
                
                string responseBody = await client
                    .GetStringAsync($"https://oauth2.googleapis.com/tokeninfo?access_token={token}");
                string prueba = """
                                        {
                      "error": "invalid_token",
                      "error_description": "Invalid Value"
                    }
                    """;

                GoogleTokenInfo? responseDeserialized = JsonSerializer
                    .Deserialize<GoogleTokenInfo>(responseBody);
                if (responseDeserialized != null)
                {
                    if (responseDeserialized.error != null ||
                        responseDeserialized.email_verified == null ||
                        responseDeserialized.aud != "765808157277-f5ktben8g1a5tflgbh9f0pi2tvdv68ih.apps.googleusercontent.com")
                    {
                        return Unauthorized();
                    }
                    else
                    {
                        if (responseDeserialized.email != null)
                        {
                            IEnumerable<User> loginResult = _user.GoogleLogin(responseDeserialized.email);
                            if (!loginResult.Any())
                            {
                                //registrar
                                _user.CreateGoogleUser(responseDeserialized.email);

                            }
                            //Contiene
                            else
                            {
                                //Perfil
                                if (loginResult.First().Type == "google")
                                {
                                    // adelante con el perfil
                                }
                                else
                                {
                                    //mandar confirmación al correo
                                }
                            }
                        }
                    }

                }
                Console.WriteLine(responseBody);

            }
            catch (HttpRequestException e)
            {
                Console.WriteLine("\nException Caught!");
                Console.WriteLine("Message :{0} ", e.Message);
                return StatusCode(500, e.Message);
            }
            return Ok();
        }
    }
}
