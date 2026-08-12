using AppGestionProyectos.Server.Data;

namespace AppGestionProyectos.Server.Models
{
    public class Product
    {
        public string Name { get; set; }
        public string Sku { get; set; }
        public int Stock { get; set; }= 0;
        public int Category { get; set; } = 0;

        //public static async Task<Product> CreateProduct(Product newProduct)
        //{
        //    string publicId = Guid.NewGuid().ToString();
        //    Console.WriteLine(publicId);
        //    Project project = new Project
        //    {
        //        W_Environment_id = wEnvironment,
        //        Name = name,
        //        Public_id = publicId,
        //        Creation_date = DateTime.Now,
        //        Json_data = "{}"
        //    };
        //    try
        //    {
        //        await appDbContext.Project.AddAsync(project);
        //        await appDbContext.SaveChangesAsync();
        //    }
        //    catch (Exception e)
        //    {
        //        Console.WriteLine(e);
        //    }
        //    return project;
        //}
    }

}
