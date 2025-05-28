using Microsoft.EntityFrameworkCore;
using Mono.TextTemplating;
using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;

namespace AppGestionProyectos.Server.Models
{
    [PrimaryKey(nameof(User_Id), nameof(W_environment))]
    public class UserWEnvironment
    {
        [NotNull]
        public int User_Id { get; set; }
        [NotNull]
        public int W_environment {  get; set; }
        public string Rol_w_environment { get; set; }
        public string Creator_mail { get; set; }
    }
}
