using angMapAPI.Models;
using angMapAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson.IO;
using System.Security.Claims;

namespace angMapAPI.Controllers
{
    [ApiController]
    [Authorize]
    [Route("api/[controller]")]
    public class PointsController : ControllerBase
    {
        private readonly PointService _pointService;

        public PointsController(PointService pointService) => _pointService = pointService;

        [HttpGet]
        public async Task<List<Point>> GetAll()
        {

        }

        [HttpPost]
        public async Task<IActionResult> Create(string json)
        {
            Point point = new Point()
            {
                Json = json,
                UserId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier))
            };
            
            await _pointService.CreateAsync(point);

            return Ok();
        }
    }
}
