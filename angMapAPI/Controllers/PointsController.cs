using angMapAPI.Models;
using angMapAPI.Services;
using Microsoft.AspNetCore.Mvc;

namespace angMapAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PointsController : ControllerBase
    {
        private readonly PointService _pointService;

        public PointsController(PointService pointService) => _pointService = pointService;

        [HttpGet]
        public async Task<List<Point>> Get() => await _pointService.GetAsync();

        [HttpPost]
        public async Task<IActionResult> Post(Point newPoint)
        {
            await _pointService.CreateAsync(newPoint);

            return CreatedAtAction(nameof(Get), new { id = newPoint.Id }, newPoint);
        }
    }
}
