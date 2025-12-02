using AppGestionProyectos.Server.Data;
using AppGestionProyectos.Server.Models;
using AppGestionProyectos.Server.Services;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Net.Http.Headers;
using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.BlazorIdentity.Pages.Manage;
using Newtonsoft.Json.Linq;
using NuGet.Common;
using NuGet.Protocol;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Net.Mail;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Text.RegularExpressions;


namespace AppGestionProyectos.Server.Controllers
{
    [ApiController]
    [Route("/api/[controller]")]
    public class AuthController : Controller
    {
        private readonly AppDbContext _AppDbContext;
        private readonly IConfiguration _config;

        public AuthController(AppDbContext appDbContext, IConfiguration config)
        {
            _AppDbContext = appDbContext;
            _config = config;
        }
        [HttpGet]
        //[Route("")]
        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        [EnableCors("whiteListOrigins")]
        [Route("MailAuth")]
        public async Task<IActionResult> MailAuthAsync([FromBody] object? fields)
        {

            //var options = new CookieOptions
            //{
            //    Expires = DateTimeOffset.Now.AddDays(1),
            //    HttpOnly = true,
            //    Secure = true,     // si usas HTTPS
            //    SameSite = Microsoft.AspNetCore.Http.SameSiteMode.None,
            //    //SameSite = Microsoft.AspNetCore.Http.SameSiteMode.None,
            //    //Path = "/",
            //    Domain = "localhost",
            //    IsEssential = true // Asegura que la cookie se envíe incluso si no se ha iniciado sesión
            //};
            //Response.Cookies.Append("miCookie", "valor123", options);
            //return Ok();

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
                if (Regex.IsMatch(fields.ToString(), @"<[^>]+>"))
                {
                    return BadRequest(new ApiResponse<object>(false, "bad-request", null));
                }

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
                        TokenResponse token = await Models.User.GenerateTokens(userFields.Mail, _AppDbContext, _config);
                        if (string.IsNullOrEmpty(token.AccessToken))
                        {
                            return StatusCode(500, new ApiResponse<object>(false, "server-error", false));
                        }

                        //Encoding.UTF8.GetBytes(_config["host:back"])

                        var cookieOptions = new CookieOptions
                        {
                            Expires = DateTimeOffset.Now.AddDays(1),
                            HttpOnly = true,
                            Secure = true,     // si usas HTTPS
                            SameSite = Microsoft.AspNetCore.Http.SameSiteMode.Strict,
                            Domain = _config["host:name"].ToString()
                            //SameSite = Microsoft.AspNetCore.Http.SameSiteMode.None,
                            //Path = "/",
                        };
                        Response.Cookies.Append("AT", token.AccessToken, cookieOptions);
                        Response.Cookies.Append("RT", token.RefreshToken, cookieOptions);
                        //Response.Headers.AccessControlAllowOrigin = "*";
                        //return Redirect($"{_config["host:front"]}/");
                        //return Redirect("https://localhost:5173");
                        return Ok(new ApiResponse<object>(true, "access-granted", token));

                        //return StatusCode(500, new ApiResponse<object>(false, "server-error", false, "Error when calling the GenerateToken function"));

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
                            try
                            {
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
                                    var html = await System.IO.File.ReadAllTextAsync("Templates/verification.html");
                                    string body = html.Replace("{{VERIFICATION_CODE}}", randmNumber);
                                    message.Body = body;
                                    message.IsBodyHtml = true;
                                    message.Subject = "Verification";
                                    smtpClient.Send(message);
                                }
                            }
                            catch (Exception ex) {

                                Console.Error.WriteLine($"Error al enviar correo: {ex.Message}");
                                Console.Error.WriteLine($"StackTrace: {ex.StackTrace}");
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
                        Task<TokenResponse> token = Models.User.GenerateTokens(rt.Mail, _AppDbContext, _config);
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
                if (Regex.IsMatch(fields.ToString(), @"<[^>]+>"))
                {
                    return BadRequest(new ApiResponse<object>(false, "bad-request", null));
                }

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
                        TokenResponse token = await Models.User.GenerateTokens(userFields.Mail, _AppDbContext, _config);
                        if (string.IsNullOrEmpty(token.AccessToken))
                        {
                            return StatusCode(500, new ApiResponse<object>(false, "server-error", false));
                        }
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
                        Response.Cookies.Append("AT", token.AccessToken, cookieOptions);
                        Response.Cookies.Append("RT", token.RefreshToken, cookieOptions);
                        return Ok(new ApiResponse<object>(true, "token-refreshed", token));
                    }
                }
                return Unauthorized(new ApiResponse<object>(false, "wrong-verification-code", null));
            }
            catch (Exception e)
            {
                return StatusCode(500, new ApiResponse<object>(false, "server-error", e.ToString()));
            }
        }

        [Authorize]
        [HttpGet]
        [Route("Check")]
        public async Task<IActionResult> Check()
        {
            //Console.WriteLine("User is authenticated: " + User.Identity.IsAuthenticated);
            try
            {
                var claimsIdentity = new ClaimsIdentity(User.Claims, CookieAuthenticationDefaults.AuthenticationScheme);
                await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(claimsIdentity));
            }
            catch (Exception ex)
            {
                Console.WriteLine("check:" + ex);
            }

            return Ok(new ApiResponse<object>(true, "user-authenticated", null));



            //// If not authenticated, return an unauthorized response
            // return Unauthorized(new ApiResponse<object>(false, "user-not-authenticated", null));

        }

        [Authorize]
        [HttpGet]
        [Route("Logout")]
        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);


            Response.Cookies.Delete("AT", new CookieOptions
            {
                Expires = DateTimeOffset.Now.AddDays(1),
                HttpOnly = true,
                Secure = true,     // si usas HTTPS
                SameSite = Microsoft.AspNetCore.Http.SameSiteMode.Strict,
                Domain = _config["host:name"].ToString()
            });

            return Ok(new ApiResponse<object>(true, "user-authenticated", null));

            //// If not authenticated, return an unauthorized response
            // return Unauthorized(new ApiResponse<object>(false, "user-not-authenticated", null));

        }
    }
}
