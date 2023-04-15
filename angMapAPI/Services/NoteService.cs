using angMapAPI.Models;
using angMapAPI.Repositories;
using MongoDB.Bson;

namespace angMapAPI.Services
{
    public interface INoteService
    {
        Task<Feature> CreateNote(CreateNoteRequest request, Guid userId);
        Task<Note> GetById(string id);
        Task<List<Feature?>> GetAll(Guid userId);
        Task<Note> Delete(string id);
    }

    public class NoteService : INoteService
    {
        private readonly INoteRepository _repository;
        public NoteService(INoteRepository repository)
        {
            _repository = repository;
        }

        public async Task<Feature> CreateNote(CreateNoteRequest request, Guid userId)
        {
            string noteId = ObjectId.GenerateNewId().ToString();

            Note note = new()
            {
                Id = noteId,
                UserId = userId,
                Feature = new()
                {
                    Geometry = request.Geometry,
                    Properties = new()
                    {
                        Title = request.Title,
                        Date = request.Date,
                        Note = request.Note,
                        Id = noteId
                    }
                }
            };

            await _repository.CreateAsync(note);

            return note.Feature;
        }

        public async Task<Note> GetById(string id)
        {
            return await _repository.GetAsync(id);
        }

        public async Task<List<Feature?>> GetAll(Guid userId)
        {
            return await _repository.GetAll(userId);
        }

        public async Task<Note> Delete(string id)
        {
            return await _repository.Delete(id);
        }
    }
}
