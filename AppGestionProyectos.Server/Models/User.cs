using AppGestionProyectos.Server.Data;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;

namespace AppGestionProyectos.Server.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string Mail { get; set; }
        public string Password { get; set; }
        [Required]
        public int Role { get; set; }
        public int Max_users { get; set; }

        public string Type { get; set; }
        private readonly AppDbContext _dbContext;
        public User(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }
        public User(string mail)
        {
            this.Mail = mail;
        }
        public List<User> GetAllUsers()
        {
            return _dbContext.User.
                OrderBy(b => b.Id).
                ToList();
        }

        /// <summary>
        /// Comprueba si existe el correo y la contraseña 
        /// </summary>
        /// <returns></returns>
        public IEnumerable<User> Login()
        {
            User us = new User(_dbContext);
            us.Mail = "mikelseara11@gmail.com";
            us.Password = "0221486f8ad42e30b9b773b5f02c5631ec48447edbc6f001ece857e10aa2f0c8";
            IEnumerable<User> query = from _user in _dbContext.User
                                      where _user.Mail.Equals(us.Mail)
                                      where _user.Password == us.Password
                                      select _user;

            return query;
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
        public IEnumerable<User> GoogleLogin(string email)
        {
            IEnumerable<User> query = from _user in _dbContext.User
                                      where _user.Mail == email
                                      select _user;

            return query;
        }

        /// <summary>
        /// Crea un usuario con el correo de Google
        /// </summary>
        /// <returns></returns>
        public bool CreateGoogleUser(string email)
        {
            bool result = false;
            User user = new User(_dbContext);
            user.Mail=email;
            user.Password = "asdfasdf";
            user.Role = 1;
            user.Max_users = 1;
            user.Type = "google";
            _dbContext.User.Add(user);
            _dbContext.SaveChanges();
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
