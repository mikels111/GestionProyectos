using AppGestionProyectos.Server.Data;

namespace AppGestionProyectos.Server.Models
{
    public class Product
    {
        public string Name { get; set; }
        public string Sku { get; set; }
        public int Stock { get; set; }= 0;
        public int Category { get; set; } = 0;

    }

}
