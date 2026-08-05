namespace MomsGarden.Web.Models
{
    public class Plant
    {
        public int PlantId { get; set; }
        public string Name { get; set; }
        public decimal Price { get; set; }
        public int Stock { get; set; }
        public string ImageUrl { get; set; }
    }
}
