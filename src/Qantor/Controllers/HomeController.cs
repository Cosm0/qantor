using Microsoft.AspNetCore.Mvc;

namespace Qantor.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
