    using Microsoft.AspNetCore.Mvc;
    using System.Text;
    using System.Text.Json;
    using System.Security.Claims;
    using Microsoft.AspNetCore.Authentication;
    using Microsoft.AspNetCore.Authentication.Cookies;

public class AccountController : Controller
{
    private readonly HttpClient _httpClient;

    public AccountController(IHttpClientFactory factory)
    {
        _httpClient = factory.CreateClient();
        _httpClient.BaseAddress = new Uri("http://localhost:5134/");
    }


    public IActionResult Register()
    {
        return View();
    }

    [HttpPost]
    public async Task<IActionResult> Register(RegisterViewModel model)
    {
        if (!ModelState.IsValid)
            return View(model);

        var apiModel = new
        {
            model.Name,
            model.Email,
            model.Password
        };

        var json = JsonSerializer.Serialize(apiModel);
        var content = new StringContent(json, Encoding.UTF8, "application/json");

        var response = await _httpClient.PostAsync("api/Auth/register", content);

        if (response.IsSuccessStatusCode)
            return RedirectToAction("Login");

        var responseContent = await response.Content.ReadAsStringAsync();

        var problemDetails = JsonSerializer.Deserialize<ValidationProblemDetails>(
            responseContent,
            new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

        if (problemDetails?.Errors != null)
        {
            foreach (var error in problemDetails.Errors)
            {
                foreach (var message in error.Value)
                {
                    ModelState.AddModelError(error.Key, message);
                }
            }
        }

        return View(model);
    }


    public IActionResult Login()
    {
        return View();
    }

    //[HttpPost]
    //public async Task<IActionResult> Login(LoginViewModel model)
    //{
    //    if (!ModelState.IsValid)
    //        return View(model);

    //    var json = JsonSerializer.Serialize(model);
    //    var content = new StringContent(json, Encoding.UTF8, "application/json");

    //    var response = await _httpClient.PostAsync("api/Auth/login", content);

    //    if (!response.IsSuccessStatusCode)
    //    {
    //        ModelState.AddModelError(string.Empty, "Invalid email or password");
    //        return View(model);
    //    }
    //    var responseContent = await response.Content.ReadAsStringAsync();

    //    var userJson = JsonSerializer.Deserialize<JsonElement>(
    //        responseContent,
    //        new JsonSerializerOptions
    //        {
    //            PropertyNameCaseInsensitive = true
    //        });

    //    string name = string.Empty;
    //    string email = string.Empty;

    //    if (userJson.TryGetProperty("name", out var nameProp))
    //        name = nameProp.GetString();

    //    if (userJson.TryGetProperty("email", out var emailProp))
    //        email = emailProp.GetString();

    //    var claims = new List<Claim>
    //    {
    //        new Claim(ClaimTypes.Name, name ?? string.Empty),
    //        new Claim(ClaimTypes.Email, email ?? string.Empty)
    //    };

    //    var claimsIdentity = new ClaimsIdentity(
    //        claims,
    //        CookieAuthenticationDefaults.AuthenticationScheme);

    //    var claimsPrincipal = new ClaimsPrincipal(claimsIdentity);

    //    await HttpContext.SignInAsync(
    //        CookieAuthenticationDefaults.AuthenticationScheme,
    //        claimsPrincipal);

    //    return RedirectToAction("Index", "Home");
    //}


    [HttpPost]
    public async Task<IActionResult> Login(LoginViewModel model)
    {
        if (!ModelState.IsValid)
            return View(model);

        var json = JsonSerializer.Serialize(model);
        var content = new StringContent(json, Encoding.UTF8, "application/json");

        var response = await _httpClient.PostAsync("api/Auth/login", content);

        if (!response.IsSuccessStatusCode)
        {
            ModelState.AddModelError(string.Empty, "Invalid email or password");
            return View(model);
        }

        var responseContent = await response.Content.ReadAsStringAsync();

        var userJson = JsonSerializer.Deserialize<JsonElement>(
            responseContent,
            new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

        string name = string.Empty;
        string email = string.Empty;
        string role = string.Empty;

        if (userJson.TryGetProperty("name", out var nameProp))
            name = nameProp.GetString();

        if (userJson.TryGetProperty("email", out var emailProp))
            email = emailProp.GetString();

        if (userJson.TryGetProperty("role", out var roleProp))
            role = roleProp.GetString();

        var claims = new List<Claim>
    {
        new Claim(ClaimTypes.Name, name ?? string.Empty),
        new Claim(ClaimTypes.Email, email ?? string.Empty),
        new Claim(ClaimTypes.Role, role ?? string.Empty)
    };

        var claimsIdentity = new ClaimsIdentity(
            claims,
            CookieAuthenticationDefaults.AuthenticationScheme);

        var claimsPrincipal = new ClaimsPrincipal(claimsIdentity);

        await HttpContext.SignInAsync(
            CookieAuthenticationDefaults.AuthenticationScheme,
            claimsPrincipal);

        // 🔥 Role-based redirect
        if (role == "Admin")
            return RedirectToAction("Dashboard", "Admin");

        return RedirectToAction("Index", "Home");
    }








    [HttpPost]
    public async Task<IActionResult> Logout()
    {
        await HttpContext.SignOutAsync(
            CookieAuthenticationDefaults.AuthenticationScheme);

        return RedirectToAction("Login", "Account");
    }
}