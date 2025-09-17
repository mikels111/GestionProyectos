using AppGestionProyectos.Server.Models;
using Microsoft.AspNetCore.Mvc;
using System.Net.Mail;
using System.Net;
using System.Text.Json;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;
using Humanizer;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using AppGestionProyectos.Server.Services;
using Microsoft.IdentityModel.Tokens;
using AppGestionProyectos.Server.Data;


namespace AppGestionProyectos.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UserController : Controller
    {
        private readonly AppDbContext _AppDbContext;
        private readonly IConfiguration _config;
        static readonly HttpClient client = new HttpClient();
        static readonly string _myAud = "765808157277-f5ktben8g1a5tflgbh9f0pi2tvdv68ih.apps.googleusercontent.com";

        public UserController(AppDbContext appDbContext, IConfiguration config)
        {
            _AppDbContext = appDbContext;
            _config = config;
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

        [HttpPost]
        [Route("LoginUserGoogle")]
        public async Task<IActionResult> LoginUserGoogle([FromHeader] string token)
        {
            TokenResponse tokenResponse;
            var cookieOptions = new CookieOptions
            {
                Expires = DateTimeOffset.Now.AddDays(1),
                HttpOnly = true,
                Secure = true,     // si usas HTTPS
                SameSite = Microsoft.AspNetCore.Http.SameSiteMode.Strict,
                //SameSite = Microsoft.AspNetCore.Http.SameSiteMode.None,
                //Path = "/",
                Domain = "localhost"
            };
            // hacer la peticion http a https://oauth2.googleapis.com/tokeninfo?access_token=<token>
            //una vez validado obtener correo 
            try
            {
                var jsonResponse = "";
                GoogleTokenInfo? responseDeserialized = new GoogleTokenInfo();
                try
                {
                    HttpResponseMessage response = await client.GetAsync($"https://oauth2.googleapis.com/tokeninfo?access_token={token}");
                    jsonResponse = await response.Content.ReadAsStringAsync();
                    responseDeserialized = JsonSerializer
                    .Deserialize<GoogleTokenInfo>(jsonResponse);
                }
                catch (Exception ex)
                {
                    return StatusCode(500, new ApiResponse<object>(false, "server-error", false, ex.ToString()));
                }
                if (responseDeserialized != null)
                {
                    if (!string.IsNullOrEmpty(responseDeserialized.error) ||
                        string.IsNullOrEmpty(responseDeserialized.email_verified) ||
                        responseDeserialized.aud != _myAud)
                    {
                        return Unauthorized(new ApiResponse<object>(false, "wrong-token", null));
                    }
                    else
                    {
                        if (!string.IsNullOrEmpty(responseDeserialized.email))
                        {
                            //checkmail
                            User.UserDTO checkMail = await Models.User.Checkmail(responseDeserialized.email, _AppDbContext);
                            #region si no existe mail
                            if (string.IsNullOrEmpty(checkMail.Mail))
                            {
                                #region guardar en bd correo y contraseña
                                Models.User.UserDTO userFields = new Models.User.UserDTO
                                {
                                    Mail = responseDeserialized.email,
                                    TypeMail = ""
                                };
                                TokenResponse createUser = await Models.User.CreateUser(userFields, _AppDbContext, _config);
                                if (string.IsNullOrEmpty(createUser.AccessToken))
                                {
                                    return StatusCode(500, new ApiResponse<object>(false, "server-error", false));
                                }
                                Response.Cookies.Append("AT", createUser.AccessToken, cookieOptions);
                                Response.Cookies.Append("RT", createUser.RefreshToken, cookieOptions);
                                return Ok(new ApiResponse<object>(true, "access-granted", createUser));
                                #endregion
                            }

                            #endregion
                            #region si existe mail

                            #region es tipo mail
                            if (checkMail.TypeMail == "email")
                            {
                                #region mandar codigo por correo y guardarlo en bd. Se devuelve show-codeInput
                                // mandar codigo
                                var smtpClient = new SmtpClient("smtp-relay.brevo.com")
                                {
                                    Port = 587,
                                    Credentials = new NetworkCredential("81acc8002@smtp-brevo.com", "LUTmMXcgVzk6xZW4"),
                                    EnableSsl = true,
                                };
                                MailMessage message = new MailMessage("mikelseara11@gmail.com", checkMail.Mail);
                                string randmNumber = "";
                                Random rnd = new Random();
                                for (int j = 0; j < 5; j++)
                                {
                                    randmNumber += rnd.Next(10);//random integers < 10
                                }
                                bool saveVerfCodeResult = await Models.User.SaveVerificationCode(checkMail.Mail, randmNumber, _AppDbContext);
                                if (saveVerfCodeResult)
                                {

                                    message.Body = "<p style='font-size:x-large;'>Copy the following code to continue:</p> <h1>" + randmNumber + "</h1>";
                                    message.IsBodyHtml = true;
                                    message.Subject = "Email confirmation";
                                    smtpClient.Send(message);
                                }
                                // mostrar input codigo
                                return Ok(new ApiResponse<object>(true, "show-codeInput", null));

                                #endregion
                            }
                            #endregion
                            #region no es tipo mail
                            #region Models.User.GenerateTokens se devuelven los tokens en cookies
                            tokenResponse = await Models.User.GenerateTokens(checkMail.Mail, _AppDbContext, _config);
                            if (tokenResponse.AccessToken == null)
                            {
                                return StatusCode(500, new ApiResponse<object>(false, "server-error", false, "Error when calling the GenerateToken function"));
                            }

                            Response.Cookies.Append("AT", tokenResponse.AccessToken, cookieOptions);
                            Response.Cookies.Append("RT", tokenResponse.RefreshToken, cookieOptions);
                            return Ok(new ApiResponse<object>(true, "access-granted", tokenResponse));
                            #endregion
                            #endregion

                            #endregion

                            #region COMENTADO

                            //IEnumerable<User>? loginResult = Models.User.GoogleLogin(responseDeserialized.email, _AppDbContext);
                            //if (loginResult is null)
                            //{
                            //    return StatusCode(500);
                            //}
                            //if (!loginResult.Any())
                            //{
                            //    //registrar
                            //    //bool createResult = _user.CreateGoogleUser(responseDeserialized.email);

                            //}
                            ////Contiene
                            //else
                            //{

                            //    if (loginResult.First().Type != "google")
                            //    {
                            //        //mandar confirmación al correo, si no llega-> Unauthorized(se corta ejecucion)
                            //        var smtpClient = new SmtpClient("smtp-relay.brevo.com")
                            //        {
                            //            Port = 587,
                            //            Credentials = new NetworkCredential("81acc8002@smtp-brevo.com", "LUTmMXcgVzk6xZW4"),
                            //            EnableSsl = true,
                            //        };
                            //        MailMessage message = new MailMessage("mikelseara11@gmail.com", responseDeserialized.email);
                            //        string randmNumber = "";
                            //        Random rnd = new Random();
                            //        for (int j = 0; j < 5; j++)
                            //        {
                            //            randmNumber += rnd.Next(10);//random integers < 10
                            //        }
                            //        if (await Models.User.SaveVerificationCode(responseDeserialized.email, randmNumber, _AppDbContext))
                            //        {
                            //            message.Body = "<p>Para continuar introduce el siguiente codigo de confirmacion:</p> <h2>" + randmNumber + "</h2>";
                            //            message.IsBodyHtml = true;
                            //            message.Subject = "Confirmación de correo en Gestión Aplicaciones";
                            //            smtpClient.Send(message);
                            //        }

                            //        return RedirectPermanent("https://www.google.es/");
                            //        //Añadir columna is_verified y token. Poner is_verified en false cada vez que no sea un usuario de google y mandar token. Cuando sea el que esta en bd darle acceso. 


                            //        //añadir columna tiempo expiracion token de tipo datetime<----

                            //        //redirigir a url para que introduzca el codigo
                            //    }
                            //    else
                            //    {
                            //        // adelante con el perfil
                            //    }
                            //}
                            #endregion
                        }
                        return StatusCode(500, new ApiResponse<object>(false, "server-error", false, "the deserialized mail is null"));
                    }

                }
                return BadRequest(new ApiResponse<object>(false, "bad-request", false, "the deserialized response is null"));

            }
            catch (Exception ex)
            {
                Console.WriteLine("\nException Caught!");
                Console.WriteLine("Message :{0} ", ex.Message);
                return StatusCode(500, new ApiResponse<object>(false, "server-error", false, ex.ToString()));
            }
        }
    }
}
