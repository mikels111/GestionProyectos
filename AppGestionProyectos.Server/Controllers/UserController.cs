using AppGestionProyectos.Server.Models;
using Microsoft.AspNetCore.Mvc;
using System.Net.Mail;
using System.Net;
using System.Text.Json;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;
using Humanizer;
using Microsoft.EntityFrameworkCore.Metadata.Internal;


namespace AppGestionProyectos.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UserController : Controller
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
            //var result = new { message = "" };
            //IEnumerable<User> mailBdResult = User.CheckMail();

            ////mailBdResult que tipo
            //    //tipo email
            //        //mostrar input contraseña
            //    //tipo google
            //        // mandar codigo
            //        // mostrar input codigo

            //if (mailBdResult.Any())
            //{
            //    return Ok(mailBdResult.First());
            //}
            //else if (!mailBdResult.Any())
            //{
            //    result = new { message = "Login failed" };
            //    return Ok(result);
            //}
            return Ok();
        }

        //[HttpPost]
        //[Route("LoginUserGoogle")]
        //public async Task<IActionResult> LoginUserGoogle([FromHeader] string token)
        //{
        //    var result = new { message = "" };
        //    // hacer la peticion http a https://oauth2.googleapis.com/tokeninfo?access_token=<token>
        //    //una vez validado obtener correo 
        //    try
        //    {
        //        //https://oauth2.googleapis.com/tokeninfo?access_token=ya29.a0AeDClZC6D1oEFb_ZDPbo0yQ4tRgxuI2AaR9uLVOb8cr8m0SeR3qnquVHq2H7gV-jYXzWPOdH_KGFV7fqdFcNhL44KjtMCRCnyeIqeuqGrMYvCxVMpfaE3umGJmbOGyy6o9WHkprzFxp197ZQY9tqOliUF7RnumCVDG8aCgYKAS4SARASFQHGX2Mi4ARcuWfh1L9TOZDAqjhpZg0170

        //        string responseBody = await client
        //            .GetStringAsync($"https://oauth2.googleapis.com/tokeninfo?access_token={token}");
        //        string prueba = """
        //                                {
        //              "error": "invalid_token",
        //              "error_description": "Invalid Value"
        //            }
        //            """;

        //        GoogleTokenInfo? responseDeserialized = JsonSerializer
        //            .Deserialize<GoogleTokenInfo>(responseBody);
        //        if (responseDeserialized != null)
        //        {
        //            if (responseDeserialized.error != null ||
        //                responseDeserialized.email_verified == null ||
        //                responseDeserialized.aud != "765808157277-f5ktben8g1a5tflgbh9f0pi2tvdv68ih.apps.googleusercontent.com")
        //            {
        //                return Unauthorized();
        //            }
        //            else
        //            {
        //                if (responseDeserialized.email != null)
        //                {
        //                    IEnumerable<User>? loginResult = _user.GoogleLogin(responseDeserialized.email);
        //                    if (loginResult is null)
        //                    {
        //                        return StatusCode(500);
        //                    }
        //                    if (!loginResult.Any())
        //                    {
        //                        //registrar
        //                        bool createResult = _user.CreateGoogleUser(responseDeserialized.email);

        //                    }
        //                    //Contiene
        //                    else
        //                    {
                                
        //                        if (loginResult.First().Type != "google")
        //                        {
        //                            //mandar confirmación al correo, si no llega-> Unauthorized(se corta ejecucion)
        //                            var smtpClient = new SmtpClient("smtp-relay.brevo.com")
        //                            {
        //                                Port = 587,
        //                                Credentials = new NetworkCredential("81acc8002@smtp-brevo.com", "LUTmMXcgVzk6xZW4"),
        //                                EnableSsl = true,
        //                            };
        //                            MailMessage message = new MailMessage("mikelseara11@gmail.com", responseDeserialized.email);
        //                            string randmNumber = "";
        //                            Random rnd = new Random();
        //                            for (int j = 0; j < 4; j++)
        //                            {
        //                                randmNumber += rnd.Next(10);//random integers < 10
        //                            }
        //                            if (_user.SaveVerificationCode(responseDeserialized.email, randmNumber))
        //                            {
        //                                message.Body = "<p>Para continuar introduce el siguiente codigo de confirmacion:</p> <h2>" + randmNumber + "</h2>";
        //                                message.IsBodyHtml = true;
        //                                message.Subject = "Confirmación de correo en Gestión Aplicaciones";
        //                                smtpClient.Send(message);
        //                            }

        //                            return RedirectPermanent("https://www.google.es/");
        //                            //Añadir columna is_verified y token. Poner is_verified en false cada vez que no sea un usuario de google y mandar token. Cuando sea el que esta en bd darle acceso. 


        //                            //añadir columna tiempo expiracion token de tipo datetime<----

        //                            //redirigir a url para que introduzca el codigo
        //                        }
        //                        else
        //                        {
        //                            // adelante con el perfil
        //                        }
        //                    }
        //                }
        //            }

        //        }
        //        Console.WriteLine(responseBody);

        //    }
        //    catch (HttpRequestException e)
        //    {
        //        Console.WriteLine("\nException Caught!");
        //        Console.WriteLine("Message :{0} ", e.Message);
        //        return StatusCode(500, e.Message);
        //    }
        //    return Ok();
        //}
    }
}
