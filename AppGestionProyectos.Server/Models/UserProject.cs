using Microsoft.EntityFrameworkCore;
using System;

namespace AppGestionProyectos.Server.Models
{
    [PrimaryKey(nameof(User_Id), nameof(Project_Id))]
    public class UserProject
    {
        public int User_Id { get; set; }
        public int Project_Id { get; set; }
        public string Creator_mail { get; set; } 
    }
}
