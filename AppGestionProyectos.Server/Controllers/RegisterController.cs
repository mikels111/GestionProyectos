using AppGestionProyectos.Server.Services;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json.Serialization;
using System.Text.Json;
using AppGestionProyectos.Server.Data;
using AppGestionProyectos.Server.Models;
using System.Net.Mail;
using System.Net;
using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.BlazorIdentity.Pages.Manage;
using NuGet.Common;
using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Mvc.Rendering;

namespace AppGestionProyectos.Server.Controllers
{
    [ApiController]
    [Route("/api/[controller]")]
    public class RegisterController : Controller
    {

        private readonly AppDbContext _AppDbContext;
        private readonly IConfiguration _config;
        public RegisterController(AppDbContext appDbContext, IConfiguration config)
        {
            _AppDbContext = appDbContext;
            _config = config;
        }

        [HttpPost]
        [Route("CheckMail")]
        public async Task<IActionResult> CheckMail([FromBody] object? mail)
        {

            Models.User.UserDTO userFields = new Models.User.UserDTO();
            if (Request.ContentLength == 0)
            {
                return BadRequest(new ApiResponse<object>(false, "bad-request", false));
            }
            try
            {
                var options = new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true,
                    UnmappedMemberHandling = JsonUnmappedMemberHandling.Disallow,
                };
                userFields = JsonSerializer.Deserialize<Models.User.UserDTO>(mail.ToString(), options);
                if (Regex.IsMatch(mail.ToString(), @"<[^>]+>"))
                {
                    return BadRequest(new ApiResponse<object>(false, "bad-request", null));
                }

            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponse<object>(false, "bad-request", null, ex.ToString()));
            }
            try
            {
                if (!string.IsNullOrEmpty(userFields.Mail))
                {
                    #region check mail

                    string pattern = @"^[^@\s]+@[^@\s]+\.[a-zA-Z]{2,}$";
                    if (!Regex.IsMatch(userFields.Mail, pattern))
                    {
                        return BadRequest(new ApiResponse<object>(false, "bad-request", false, "the email is not valid"));
                    }
                    User.UserDTO checkmail = await Models.User.Checkmail(userFields.Mail, _AppDbContext);
                    #region mail existe
                    if (checkmail.Mail != null)
                    {
                        #region mandar codigo por correo y guardarlo en bd. Devolver OK show-code
                        try
                        {
                            var smtpClient = new SmtpClient("smtp-relay.brevo.com")
                            {
                                Port = 587,
                                Credentials = new NetworkCredential("81acc8002@smtp-brevo.com", "LUTmMXcgVzk6xZW4"),
                                EnableSsl = true,
                            };
                            MailMessage message = new MailMessage("mikelseara11@gmail.com", userFields.Mail);
                            string randmNumber = "";
                            Random rnd = new Random();
                            for (int j = 0; j < 5; j++)
                            {
                                randmNumber += rnd.Next(10);//random integers < 10
                            }
                            bool saveVerfCodeResult = await Models.User.SaveVerificationCode(userFields.Mail, randmNumber, _AppDbContext);
                            if (saveVerfCodeResult)
                            {
                                var html = await System.IO.File.ReadAllTextAsync("Templates/verification.html");
                                string body = html.Replace("{{VERIFICATION_CODE}}", randmNumber);
                                message.Body = body;
                                message.IsBodyHtml = true;
                                message.Subject = "Verification";
                                smtpClient.Send(message);
                            }
                        }
                        catch (Exception ex)
                        {
                            Console.Error.WriteLine($"Error al enviar correo: {ex.Message}");
                            Console.Error.WriteLine($"StackTrace: {ex.StackTrace}");
                        }
                        
                        // mostrar input codigo
                        return Ok(new ApiResponse<object>(true, "show-codeInput", null));
                        #endregion
                    }
                    #endregion
                    #region mail no existe
                    else
                    {
                        #region devolver OK show-pass-name
                        return Ok(new ApiResponse<object>(true, "show-pass-name", null));
                        #endregion
                    }
                    #endregion
                    #endregion
                }
                else
                {
                    return BadRequest(new ApiResponse<object>(false, "bad-request", false));
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<object>(false, "server-error", ex.ToString()));
            }

        }
        [HttpPost]
        [Route("register")]
        public async Task<IActionResult> Register([FromBody] object? fields)
        {
            Models.User.UserDTO userFields = new Models.User.UserDTO();
            if (Request.ContentLength == 0)
            {
                return BadRequest(new ApiResponse<object>(false, "bad-request", false));
            }
            try
            {
                var options = new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true,
                    UnmappedMemberHandling = JsonUnmappedMemberHandling.Disallow
                };

                if (Regex.IsMatch(fields.ToString(), @"<[^>]+>"))
                {
                    return BadRequest(new ApiResponse<object>(false, "bad-request", null));
                }
                userFields = JsonSerializer.Deserialize<Models.User.UserDTO>(fields.ToString(), options);
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponse<object>(false, "bad-request", false, ex.ToString()));
            }
            try
            {
                string passwordPattern = @"^.{8,}$";
                string emailPattern = @"^[^@\s]+@[^@\s]+\.[a-zA-Z]{2,}$";
                if (!Regex.IsMatch(userFields.Mail, emailPattern) || !Regex.IsMatch(userFields.Password, passwordPattern))
                {
                    return BadRequest(new ApiResponse<object>(false, "bad-request", false, "the email is not valid"));
                }
                if (string.IsNullOrEmpty(userFields.Mail) || string.IsNullOrEmpty(userFields.Password))
                {
                    return BadRequest(new ApiResponse<object>(false, "bad-request", false, "One or more fields could be null or empty"));

                }
                #region guardar correo y contraseña en bd
                userFields.TypeMail = "email";
                TokenResponse createUser = await Models.User.CreateUser(userFields, _AppDbContext, _config);
                if (createUser.AccessToken != null)
                {
                    #region mandar codigo por correo y guardarlo en bd. Devolver OK show-code
                    try
                    {
                        var smtpClient = new SmtpClient("smtp-relay.brevo.com")
                        {
                            Port = 587,
                            Credentials = new NetworkCredential("81acc8002@smtp-brevo.com", "LUTmMXcgVzk6xZW4"),
                            EnableSsl = true,
                        };
                        MailMessage message = new MailMessage("mikelseara11@gmail.com", userFields.Mail);
                        var html = await System.IO.File.ReadAllTextAsync("Templates/welcome.html");
                        string publicBase = _config["host:base"].ToString();
                        string confirmLink = $"{Request.Scheme}://{Request.Host}{publicBase}/api/register/verify?fields={userFields.Mail}";
                        Console.Error.WriteLine($"Error al enviar correo: {confirmLink}");
                        string body = html.Replace("{{CONFIRMATION_LINK}}", confirmLink);
                        message.Body = body;
                        message.IsBodyHtml = true;
                        message.Subject = "Welcome";
                        smtpClient.Send(message);
                    }
                    catch (Exception ex)
                    {
                        Console.Error.WriteLine($"Error al enviar correo: {ex.Message}");
                        Console.Error.WriteLine($"StackTrace: {ex.StackTrace}");
                    }


                    #region CREAR COOKIES DE TOKENS

                    var cookieOptions = new CookieOptions
                    {
                        Expires = DateTimeOffset.Now.AddDays(1),
                        HttpOnly = true,
                        Secure = true,     // si usas HTTPS
                        SameSite = Microsoft.AspNetCore.Http.SameSiteMode.Strict,
                        //SameSite = Microsoft.AspNetCore.Http.SameSiteMode.None,
                        //Path = "/",
                        Domain = _config["host:name"].ToString()
                    };
                    Response.Cookies.Append("AT", createUser.AccessToken, cookieOptions);
                    Response.Cookies.Append("RT", createUser.RefreshToken, cookieOptions);
                    #endregion
                    #endregion
                    return Ok(new ApiResponse<object>(true, "access-granted", createUser));
                }
                #endregion
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<object>(false, "server-error", ex.ToString()));
            }
            return StatusCode(500, new ApiResponse<object>(false, "server-error", "Could not register the user"));

        }

        [HttpGet("verify")]
        public async Task<IActionResult> VerifyEmail([FromQuery(Name = "fields")] string fields)
        {
            string publicBase = _config["host:base"].ToString();
            if (Request.ContentLength == 0)
            {
                return Redirect($"{publicBase}/Error");
            }
            try
            {
                string emailPattern = @"^[^@\s]+@[^@\s]+\.[a-zA-Z]{2,}$";
                if (!Regex.IsMatch(fields, emailPattern) || Regex.IsMatch(fields.ToString(), @"<[^>]+>"))
                {
                    return Redirect($"{publicBase}/Error");
                }

                bool emailVerified = await Models.User.VerifyEmail(fields, _AppDbContext);

                if (emailVerified)
                {
                    //Redirigir a login
                    //string loginUrl = $"{Request.Scheme}://{Request.Host}/register/verify?fields={userFields.Mail}";

                    //return RedirectPermanent($"{front}/login");
                    return Redirect($"{publicBase}/login");
                }

            }
            catch (Exception ex)
            {
                return Redirect($"{publicBase}/Error");
            }
            //mostrar html de verificacion incorrecta
            return Redirect($"{publicBase}/Error");
        }

    }
}
