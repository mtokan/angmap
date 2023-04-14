using angMapAPI.Models;
using angMapAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
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
            Guid UserId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            return await _pointService.GetAsync(UserId);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] string json)
        {
            Point point = new()
            {
                Json = json,
                UserId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier))
            };
            
            await _pointService.CreateAsync(point);

            return Ok(new {id = point.Id});
        }

        [HttpDelete]
        [Route("Delete")]
        public async Task<IActionResult> Delete([FromBody] string id)
        {
            await _pointService.RemoveAsync(id);

            return Ok();
        }
    }
}
