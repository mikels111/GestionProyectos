using NuGet.Packaging.Signing;
using System.ComponentModel.DataAnnotations;

namespace AppGestionProyectos.Server.Models
{
    public class Content
    {
        [Key]
        public int Id { get; set; }
        public int Project_id { get; set; }
        public string text { get; set; }
        [Required]
        public DateTime Creation_date { get; set; }
    }
}
