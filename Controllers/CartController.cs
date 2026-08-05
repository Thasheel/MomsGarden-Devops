using Microsoft.AspNetCore.Mvc;

namespace MomsGarden.Web.Controllers
{
    public class CartController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
