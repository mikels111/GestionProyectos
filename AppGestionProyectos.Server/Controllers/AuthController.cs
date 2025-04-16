using AppGestionProyectos.Server.Data;
using AppGestionProyectos.Server.Models;
using Microsoft.AspNetCore.Mvc;
using System.Net.Mail;
using System.Net;
using System.Text.Json;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using AppGestionProyectos.Server.Services;
using System.Security.Cryptography;
using System.Text.Json.Serialization;
using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.BlazorIdentity.Pages.Manage;
using System;
using NuGet.Common;
using Newtonsoft.Json.Linq;


namespace AppGestionProyectos.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AuthController : Controller
    {
        private readonly AppDbContext _AppDbContext;
        private readonly IConfiguration _config;

        public AuthController(AppDbContext appDbContext, IConfiguration config)
        {
            _AppDbContext = appDbContext;
            _config = config;
        }
        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        [Route("MailAuth")]
        public async Task<IActionResult> MailAuthAsync([FromBody] object? fields)
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
                userFields = JsonSerializer.Deserialize<Models.User.UserDTO>(fields.ToString(), options);

            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponse<object>(false, "bad-request", false, ex.ToString()));
            }
            try
            {
                //Fields con contraseña
                if (!string.IsNullOrEmpty(userFields.Password) && !string.IsNullOrEmpty(userFields.Mail))
                {

                    PasswordService passwordService = new PasswordService();
                    string passwor = passwordService.HashPassword(userFields.Password);

                    //CheckPass()
                    bool checkPass = await Models.User.CheckPass(userFields.Mail, userFields.Password, _AppDbContext);
                    if (checkPass)//correcto
                    {
                        //acceso a web JWT
                        Task<TokenResponse> token = Models.User.GenerateTokens(userFields.Mail,_AppDbContext,_config);
                        if (token.Result.AccessToken == null)
                        {
                            return StatusCode(500, new ApiResponse<object>(false, "server-error", false));
                        }
                        return Ok(new ApiResponse<object>(true, "access-granted", token.Result));
                    }
                    else//incorrecto
                    {
                        //devolver incorrecto
                        return Unauthorized(new ApiResponse<object>(false, "wrong-password", null));
                    }
                }
                else//fields sin contraseña
                {
                    User.UserDTO usuario = await Models.User.Checkmail(userFields.Mail, _AppDbContext);
                    if (usuario.Mail != null)//checkMail()
                    {
                        //tipo email
                        if (usuario.TypeMail == "email")
                        {
                            //mostrar input contraseña
                            return Ok(new ApiResponse<object>(true, "show-passInput", null));
                        }
                        else//tipo google,microsoft...
                        {
                            #region mandar codigo por correo y guardarlo en bd. Devolver show-code
                            // mandar codigo
                            var smtpClient = new SmtpClient("smtp-relay.brevo.com")
                            {
                                Port = 587,
                                Credentials = new NetworkCredential("81acc8002@smtp-brevo.com", "LUTmMXcgVzk6xZW4"),
                                EnableSsl = true,
                            };
                            MailMessage message = new MailMessage("mikelseara11@gmail.com", usuario.Mail);
                            string randmNumber = "";
                            Random rnd = new Random();
                            for (int j = 0; j < 5; j++)
                            {
                                randmNumber += rnd.Next(10);//random integers < 10
                            }
                            bool saveVerfCodeResult = await Models.User.SaveVerificationCode(userFields.Mail, randmNumber, _AppDbContext);
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
                    }
                    else
                    {
                        return Unauthorized(new ApiResponse<object>(false, "wrong-email", null));
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<object>(false, "server-error", ex.ToString()));
            }

        }

        

        [HttpPost]
        [Route("Refresh")]
        public async Task<IActionResult> RefreshToken([FromBody] TokenResponse tokens)
        {
            if (Request.ContentLength == 0)
            {
                return BadRequest(new ApiResponse<object>(false, "bad-request", false));
            }
            try
            {
                if (tokens != null)
                {
                    var rt = await Models.User.CheckRefreshToken(tokens, _AppDbContext);
                    if (rt.Mail != null)//Refresh Token NO está expirado(generamos Nuevos token)
                    {
                        Task<TokenResponse> token = Models.User.GenerateTokens(rt.Mail,_AppDbContext, _config);
                        if (token.Result.AccessToken == null)
                        {
                            return StatusCode(500, new ApiResponse<object>(false, "server-error", false));
                        }
                        return Ok(new ApiResponse<object>(true, "token-refreshed", token.Result));
                    }
                    else//Refresh Token EXPIRADO
                    {
                        return Unauthorized(new ApiResponse<object>(false, "refresh-token-expired", null));
                    }
                }
                return BadRequest(new ApiResponse<object>(false, "bad-request", false));

            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                return StatusCode(500, new ApiResponse<object>(false, "server-error", false));
            }

        }
        [HttpPost]
        [Route("Verify")]
        public async Task<IActionResult> VerifyCode([FromBody] object fields)
        {
            User.UserDTO userFields = new User.UserDTO();
            var options = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true,
                UnmappedMemberHandling = JsonUnmappedMemberHandling.Disallow
            };
            try
            {
                userFields = JsonSerializer.Deserialize<User.UserDTO>(fields.ToString(), options);

            }
            catch (JsonException ex)
            {
                return BadRequest(new ApiResponse<object>(false, "bad-request", false));
            }
            try
            {
                if (userFields.Code != null && userFields.Mail != null)
                {
                    var codeCheck = await Models.User.CheckVerificationCode(userFields.Code, userFields.Mail, _AppDbContext);
                    if (codeCheck)
                    {
                        Task<TokenResponse> token = Models.User.GenerateTokens(userFields.Mail, _AppDbContext, _config);
                        if (token.Result.AccessToken == null)
                        {
                            return StatusCode(500, new ApiResponse<object>(false, "server-error", false));
                        }
                        return Ok(new ApiResponse<object>(true, "token-refreshed", token.Result));
                    }
                }
                return Unauthorized(new ApiResponse<object>(false, "wrong-verification-code", null));
            }
            catch (Exception e)
            {
                return StatusCode(500, new ApiResponse<object>(false, "server-error", e.ToString()));
            }
        }

    }
}
