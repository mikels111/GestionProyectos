using AppGestionProyectos.Server.Data;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;
using System.Threading.Tasks;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.BlazorIdentity.Pages.Manage;
using System;
using AppGestionProyectos.Server.Services;

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

        public record struct UsuarioDTO(string? Mail, string? Pass, string? TypeMail, string? Code);
        public User()
        {

        }
        public User(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }
        public User(AppDbContext dbContext, string mail, string? password, int role, int? max_users, string type, bool is_verified, string? verification_code)
        {
            Mail = mail;
            Password = password;
            Role = role;
            Max_users = max_users;
            Type = type;
            Is_verified = is_verified;
            Verification_code = verification_code;
            _dbContext = dbContext;
        }
        public List<User> GetAllUsers()
        {
            return _dbContext.User.
                OrderBy(b => b.Id).
                ToList();
        }
        public static async Task<UsuarioDTO> Checkmail(string mail, AppDbContext appDbContext)
        {
            UsuarioDTO userDto = new UsuarioDTO();
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

        public static async Task<UsuarioDTO> CheckRefreshToken(TokenResponse tr, AppDbContext appDbContext)
        {
            UsuarioDTO usuarioDTO = new UsuarioDTO();
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
        public bool CreateUser()
        {
            bool result = false;
            return result;
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
        public bool CreateGoogleUser(string email)
        {
            bool result = false;
            User user = new User(_dbContext, email, null, 1, null, "google", true, null);
            _dbContext.User.Add(user);
            _dbContext.SaveChanges();
            return result;
        }
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


        /// <summary>
        /// Devuelve true si se cumplen los criterios de registro
        /// </summary>
        /// <returns>Bool</returns>
        //public bool CriterioUser()
        //{
        //    return false;
        //}

    }
}
