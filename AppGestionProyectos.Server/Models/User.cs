using AppGestionProyectos.Server.Data;
using AppGestionProyectos.Server.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.BlazorIdentity.Pages.Manage;
using System;
using System.ComponentModel.DataAnnotations;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace AppGestionProyectos.Server.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string Mail { get; set; }
        public string? Password { get; set; }
        [Required]
        public int Role { get; set; }
        public int? Max_users { get; set; }
        public string? Type { get; set; }
        public bool Is_verified { get; set; }
        public string? Verification_code { get; set; }
        public DateTime? Code_expiration { get; set; }
        public string? RefreshToken { get; set; }
        public DateTime? RefreshTokenExpiration { get; set; }
        private readonly AppDbContext _dbContext;

        public record struct UserDTO(string? Mail, string? Password, string? TypeMail, string? Code, string? name);
        public User()
        {

        }
        public User(AppDbContext dbContext, IConfiguration config)
        {
            _dbContext = dbContext;
        }
        //public User(AppDbContext dbContext, string mail, string? password, int role, int? max_users, string type, bool is_verified, string? verification_code)
        //{
        //    Mail = mail;
        //    Password = password;
        //    Role = role;
        //    Max_users = max_users;
        //    Type = type;
        //    Is_verified = is_verified;
        //    Verification_code = verification_code;
        //    _dbContext = dbContext;
        //}
        public List<User> GetAllUsers()
        {
            return _dbContext.User.
                OrderBy(b => b.Id).
                ToList();
        }
        public static async Task<UserDTO> Checkmail(string mail, AppDbContext appDbContext)
        {
            UserDTO userDto = new UserDTO();
            try
            {
                var user = await appDbContext.User
                        .Where(u => u.Mail == mail)
                        .FirstOrDefaultAsync();

                if (user != null)
                {
                    userDto.Mail = user.Mail;
                    userDto.TypeMail = user.Type;
                }

            }
            catch (Exception e)
            {
                Console.WriteLine(e);
            }
            return userDto;
        }

        public static async Task<bool> CheckPass(string mail, string pass, AppDbContext appDbContext)
        {
            bool result = false;
            try
            {
                var user = await appDbContext.User
                        .Where(u => u.Mail == mail)
                        .FirstOrDefaultAsync();
                if (user != null)
                {
                    using (PasswordService passwordService = new PasswordService())
                    {
                        result = passwordService.VerifyPassword(user.Password, pass);
                    }
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
            }
            return result;
        }

        public static async Task<bool> SaveRefreshToken(string mail, string rt, DateTime expiration, AppDbContext appDbContext)
        {
            bool result = false;
            try
            {
                var user = await appDbContext.User
                        .Where(u => u.Mail == mail)
                        .FirstOrDefaultAsync();
                if (user != null)
                {
                    user.RefreshToken = rt;
                    user.RefreshTokenExpiration = expiration;
                    result = await appDbContext.SaveChangesAsync() > 0 ? true : false;

                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
            }
            return result;
        }

        public static async Task<UserDTO> CheckRefreshToken(TokenResponse tr, AppDbContext appDbContext)
        {
            UserDTO usuarioDTO = new UserDTO();
            try
            {
                var userRT = await appDbContext.User
                        .Where(u => u.RefreshToken == tr.RefreshToken)
                        .FirstOrDefaultAsync();
                if (userRT != null && userRT.RefreshTokenExpiration > DateTime.Now)
                {
                    usuarioDTO.Mail = userRT.Mail;
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
            }
            return usuarioDTO;
        }

        public static async Task<bool> CheckVerificationCode(string code, string mail, AppDbContext appDbContext)
        {
            bool result = false;
            try
            {
                var userCode = await appDbContext.User
                        .Where(u => u.Verification_code == code && u.Mail == mail)
                        .FirstOrDefaultAsync();
                if (userCode != null && userCode.Code_expiration > DateTime.Now)
                {
                    result = true;
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
            }
            return result;
        }
        /// <summary>
        /// Crea un usuario con el correo y la contraseña proporcionados
        /// </summary>
        /// <returns></returns>
        public static async Task<TokenResponse> CreateUser(UserDTO user, AppDbContext appDbContext, IConfiguration _config)
        {
            bool result = false;
            try
            {
                #region cifrar contraseña
                PasswordService passwordService = new PasswordService();
                user.Password = passwordService.HashPassword(user.Password);
                #endregion
                User user1 = new User
                {
                    Mail = user.Mail,
                    Password = user.Password,
                    Role = 1,
                    Type = "mail"
                };
                await appDbContext.User.AddAsync(user1);
                var lines = await appDbContext.SaveChangesAsync();
                if (lines > 0)
                {
                    #region crear tokens
                    Task<TokenResponse> token = GenerateTokens(user.Mail, appDbContext, _config);
                    if (token.Result.AccessToken != null)
                    {
                        return new TokenResponse
                        {
                            AccessToken = token.Result.AccessToken,
                            RefreshToken = token.Result.RefreshToken
                        };
                    }
                    #endregion
                }
            }
            catch (Exception e)
            {
                //if(e.InnerException==exception)
                Console.WriteLine(e);
            }
            return new TokenResponse();
        }
        /// <summary>
        /// Comprueba si existe el correo proporcionado por el acceso de Google
        /// </summary>
        /// <returns></returns>
        public IEnumerable<User>? GoogleLogin(string email)
        {
            IEnumerable<User>? query = null;
            try
            {
                query = from _user in _dbContext.User
                        where _user.Mail == email
                        select _user;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
            return query;
        }

        /// <summary>
        /// Crea un usuario con el correo de Google
        /// </summary>
        /// <returns></returns>
        //public bool CreateGoogleUser(string email)
        //{
        //    bool result = false;
        //    User user = new User(_dbContext, email, null, 1, null, "google", true, null);
        //    _dbContext.User.Add(user);
        //    _dbContext.SaveChanges();
        //    return result;
        //}
        public static async Task<bool> SaveVerificationCode(string email, string code, AppDbContext appDbContext)
        {
            bool result = false;
            try
            {
                var user = appDbContext.User.FirstOrDefault(u => u.Mail == email);
                if (user == null)
                    return false;

                user.Verification_code = code;
                user.Code_expiration = DateTime.Now.AddMinutes(1);
                return await appDbContext.SaveChangesAsync() > 0;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }

            return result;
        }



        public static async Task<TokenResponse> GenerateTokens(string email, AppDbContext appDbContext, IConfiguration _config)
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
            if (string.IsNullOrEmpty(rt))
            {
                return new TokenResponse();
            }
            DateTime rtExpiration = DateTime.Now.AddDays(30.0);
            bool saveRt = await SaveRefreshToken(email, rt, rtExpiration, appDbContext);
            if (!saveRt)
                return new TokenResponse();
            return new TokenResponse
            {
                AccessToken = tokenHandler.WriteToken(at),
                RefreshToken = rt,
                Expiration = DateTime.Now.AddDays(30.0)
            };

        }
        private static string GenerateRefreshToken()
        {
            string result = "";
            try
            {
                var randomNumber = new byte[32];
                using (var rng = RandomNumberGenerator.Create())
                {
                    rng.GetBytes(randomNumber);
                    result = Convert.ToBase64String(randomNumber);
                }
                return result;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
            return result;
        }

    }
}
