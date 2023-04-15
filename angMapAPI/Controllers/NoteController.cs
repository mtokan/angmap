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
    public class NoteController : ControllerBase
    {
        private readonly INoteService _noteService;
        public NoteController(INoteService noteService)
        {
            _noteService = noteService;
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateNoteRequest request)
        {
            Feature result = await _noteService.CreateNote(request, Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)));

            return Ok(result);
        }

        [HttpGet]
        public async Task<IActionResult> GetById(string id)
        {
            Note result = await _noteService.GetById(id);

            return Ok(result);
        }

        [HttpGet]
        [Route("all")]
        public async Task<IActionResult> GetAll()
        {
            List<Feature?> result = await _noteService.GetAll(Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)));

            return Ok(result);
        }

        [HttpDelete]
        public async Task<IActionResult> Delete(string id)
        {
            Note result = await _noteService.Delete(id);

            return Ok(result);
        }
    }

}