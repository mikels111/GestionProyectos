using AppGestionProyectos.Server.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace AppGestionProyectos.Server.Models
{
    public class Role
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
        private readonly AppDbContext _dbContext;

        public Role(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public List<Role> GetAllRoles()
        {
            return _dbContext.Role
                .OrderBy(b => b.Id)
                .ToList();
        }

    }
}
