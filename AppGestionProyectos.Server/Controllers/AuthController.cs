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
        public record struct UsuarioDTO(string? mailInput, string? passInput);

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
            var response = new ApiResponse<object>(false, "", null, null);
            Models.User.UsuarioDTO userFields = new Models.User.UsuarioDTO();
            var options = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true,
                UnmappedMemberHandling = JsonUnmappedMemberHandling.Disallow
            };
            try
            {
                userFields = JsonSerializer.Deserialize<Models.User.UsuarioDTO>(fields.ToString(), options);

            }
            catch (JsonException ex)
            {
                return BadRequest(new ApiResponse<object>(false, "bad-request", false));
            }
            try
            {
                //Fields con contraseña
                if (userFields.Pass != null && userFields.Mail != null)
                {

                    PasswordService passwordService = new PasswordService();
                    string passwor = passwordService.HashPassword(userFields.Pass);

                    //CheckPass()
                    bool checkPass = await Models.User.CheckPass(userFields.Mail, userFields.Pass, _AppDbContext);
                    if (checkPass)//correcto
                    {
                        //acceso a web JWT
                        var token = GenerateTokens(userFields.Mail);
                        bool saveRt = await Models.User.SaveRefreshToken(userFields.Mail, token.RefreshToken, token.Expiration, _AppDbContext);
                        if (saveRt)
                            return Ok(new ApiResponse<object>(true, "access-granted", token));
                        else
                            return StatusCode(500, new ApiResponse<object>(false, "server-error", false));
                    }
                    else//incorrecto
                    {
                        //devolver incorrecto
                        return Unauthorized(new ApiResponse<object>(false, "wrong-password", null));
                    }
                }
                else//fields sin contraseña
                {
                    User.UsuarioDTO usuario = await Models.User.Checkmail(userFields.Mail, _AppDbContext);
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
                            for (int j = 0; j < 4; j++)
                            {
                                randmNumber += rnd.Next(10);//random integers < 10
                            }
                            bool saveVerfCodeResult = await Models.User.SaveVerificationCode(userFields.Mail, randmNumber, _AppDbContext);
                            if (saveVerfCodeResult)
                            {

                                message.Body = "<p style='color:#02ADC1;font-size:x-large;'>Para continuar introduce el siguiente codigo de confirmacion:</p> <h1>" + randmNumber + "</h1>";
                                message.IsBodyHtml = true;
                                message.Subject = "Confirmación de correo en Gestión Aplicaciones";
                                smtpClient.Send(message);
                            }
                            // mostrar input codigo
                            return Ok(new ApiResponse<object>(true, "show-codeInput", null));
                        }


                    }
                    else
                    {
                        return Unauthorized(new ApiResponse<object>(false, "wrong-email", null));
                    }

                }
            }
            catch (Exception e)
            {
                return StatusCode(500, new ApiResponse<object>(false, "server-error", e.ToString()));
            }

        }

        private TokenResponse GenerateTokens(string email)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            SecurityTokenDescriptor tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(JwtRegisteredClaimNames.Sub, email)
                }),
                Expires = DateTime.Now.AddMinutes(Convert.ToDouble(_config["Jwt:ExpireMinutes"])),
                Issuer = _config["Jwt:Issuer"],
                Audience = _config["Jwt:Audience"],
                SigningCredentials = creds
            };
            Console.WriteLine("Tiempo: " + DateTime.UtcNow.ToString());
            //DateTime.UtcNow.AddMinutes(Convert.ToDouble(_config["Jwt:ExpireMinutes"])),
            var tokenHandler = new JwtSecurityTokenHandler();
            var at = tokenHandler.CreateToken(tokenDescriptor);
            var rt = GenerateRefreshToken();
            return new TokenResponse
            {
                AccessToken = tokenHandler.WriteToken(at),
                RefreshToken = rt,
                Expiration = DateTime.Now.AddDays(30.0)
            };

        }
        private string GenerateRefreshToken()
        {
            var randomNumber = new byte[32];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(randomNumber);
                return Convert.ToBase64String(randomNumber);
            }
        }

        [HttpPost]
        [Route("Refresh")]
        public async Task<IActionResult> RefreshToken([FromBody] TokenResponse tokens)
        {
            try
            {
                if (tokens != null)
                {
                    var rt = await Models.User.CheckRefreshToken(tokens, _AppDbContext);
                    if (rt.Mail != null)//Refresh Token NO está expirado(generamos Nuevos token)
                    {
                        var token = GenerateTokens(rt.Mail);
                        bool saveRt = await Models.User.SaveRefreshToken(rt.Mail, token.RefreshToken, token.Expiration, _AppDbContext);
                        if (!saveRt)
                            return StatusCode(500, new ApiResponse<object>(false, "server-error", false));
                        return Ok(new ApiResponse<object>(true, "access-granted", token));
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
            User.UsuarioDTO userFields = new User.UsuarioDTO();
            var options = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true,
                UnmappedMemberHandling = JsonUnmappedMemberHandling.Disallow
            };
            try
            {
                userFields = JsonSerializer.Deserialize<User.UsuarioDTO>(fields.ToString(), options);

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
                        return Ok(new ApiResponse<object>(true, "access-granted", false));
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
