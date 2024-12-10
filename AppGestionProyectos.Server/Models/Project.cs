using NuGet.Packaging.Signing;
using System.ComponentModel.DataAnnotations;

namespace AppGestionProyectos.Server.Models
{
    public class Project
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public String Name { get; set; }
        [Required]
        public DateTime Creation_date { get; set; }
        [Required]
        public int Status { get; set; }
        [Required]
        public string W_environment_id { get; set; }
    }
}
