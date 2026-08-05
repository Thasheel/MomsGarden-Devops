using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MomsGarden.Web.Models;
using System.Net.Http.Json;

[Authorize(Roles = "Admin")]
public class AdminController : Controller
{
    private readonly HttpClient _httpClient;

    public AdminController(IHttpClientFactory factory)
    {
        _httpClient = factory.CreateClient();
        _httpClient.BaseAddress = new Uri("http://localhost:5134/api/");
    }

 
    public async Task<IActionResult> Dashboard()
    {
        var plants = await _httpClient.GetFromJsonAsync<List<Plant>>("Plants");
        return View(plants);
    }

    
    [HttpPost]
    public async Task<IActionResult> Create(Plant plant)
    {
        var response = await _httpClient.PostAsJsonAsync("Plants", plant);

        if (!response.IsSuccessStatusCode)
            return BadRequest();

        return RedirectToAction("Dashboard");
    }

   
    [HttpPost]
    public async Task<IActionResult> Edit(Plant plant)
    {
        var response = await _httpClient.PutAsJsonAsync(
            $"Plants/{plant.PlantId}", plant);

        if (!response.IsSuccessStatusCode)
            return BadRequest();

        return RedirectToAction("Dashboard");
    }

   
    [HttpPost]
    public async Task<IActionResult> Delete(int id)
    {
        var response = await _httpClient.DeleteAsync($"Plants/{id}");

        if (!response.IsSuccessStatusCode)
            return BadRequest();

        return RedirectToAction("Dashboard");
    }
}