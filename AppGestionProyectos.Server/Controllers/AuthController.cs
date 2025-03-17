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
            Models.User.UsuarioDTO userFields= new Models.User.UsuarioDTO();
            var options = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true,
                UnmappedMemberHandling = JsonUnmappedMemberHandling.Disallow
            };
            try
            {
                userFields = JsonSerializer.Deserialize<Models.User.UsuarioDTO>(fields.ToString(), options);

            }catch(JsonException ex)
            {
                return BadRequest(new ApiResponse<object>(false, "bad-request", false));
            }
            //Fields con contraseña
            if (userFields.PassInput != null)
            {

                PasswordService passwordService = new PasswordService();
                string passwor = passwordService.HashPassword(userFields.PassInput);

                //CheckPass()
                bool checkPass = await Models.User.CheckPass(userFields.MailInput, userFields.PassInput, _AppDbContext);
                if (checkPass)//correcto
                {
                    //acceso a web JWT
                    var token = GenerateTokens(userFields.MailInput);
                    bool saveRt = await Models.User.SaveRefreshToken(userFields.MailInput, token.RefreshToken, token.Expiration, _AppDbContext);
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
                User.UsuarioDTO usuario = await Models.User.Checkmail(userFields.MailInput, _AppDbContext);
                if (usuario.MailInput != null)//checkMail()
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
                        MailMessage message = new MailMessage("mikelseara11@gmail.com", usuario.MailInput);
                        string randmNumber = "";
                        Random rnd = new Random();
                        for (int j = 0; j < 4; j++)
                        {
                            randmNumber += rnd.Next(10);//random integers < 10
                        }
                        bool saveVerfCodeResult = await Models.User.SaveVerificationCode(userFields.MailInput, randmNumber, _AppDbContext);
                        if (saveVerfCodeResult)
                        {

                            message.Body = "<p style='color:red;font-size:x-large;'>Para continuar introduce el siguiente codigo de confirmacion:</p> <h1>" + randmNumber + "</h1>";
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
                Expiration = tokenDescriptor.Expires.Value
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
    }
}
