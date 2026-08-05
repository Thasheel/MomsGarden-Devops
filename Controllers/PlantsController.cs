using Microsoft.AspNetCore.Mvc;

namespace MomsGarden.Web.Controllers
{
    public class PlantsController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
