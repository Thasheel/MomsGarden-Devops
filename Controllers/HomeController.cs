using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MomsGarden.Web.Controllers
{
    public class HomeController : Controller
    {
         // ✅ This handles authentication automatically
        public IActionResult Index()
        {
            if (!User.Identity.IsAuthenticated)
            {
                return RedirectToAction("Register", "Account");
            }

            return View();
        }
    }
}