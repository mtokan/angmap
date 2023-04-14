using angMapAPI.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace angMapAPI.Repositories
{
    public interface INoteRepository
    {
        Task CreateAsync(Note note);
        Task<Note> GetAsync(string id);
        Task<List<Feature?>> GetAll(Guid userId);
        Task<Note> Delete(string id);
    }

    public class NoteRepository : INoteRepository 
    {
        private readonly IMongoCollection<Note> _noteColleciton;
        public NoteRepository(IOptions<FeaturesDatabaseSettings> featuresDatabaseSettings)
        {
            var mongoClient = new MongoClient(featuresDatabaseSettings.Value.ConnectionString);
            var mongoDatabase = mongoClient.GetDatabase("Notes");
            _noteColleciton = mongoDatabase.GetCollection<Note>(nameof(Note).ToLowerInvariant());
        }

        public async Task<Note> GetAsync(string id) =>
            await _noteColleciton.Find(note => note.Id == id).FirstAsync();

        public async Task CreateAsync(Note note) => await _noteColleciton.InsertOneAsync(note);

        public async Task<List<Feature?>> GetAll(Guid userId)
        {
            return await _noteColleciton.Find(note => note.UserId == userId).Project(x => x.Feature).ToListAsync(); 
        }

        public async Task<Note> Delete(string id) => await _noteColleciton.FindOneAndDeleteAsync(id);
    }
}
