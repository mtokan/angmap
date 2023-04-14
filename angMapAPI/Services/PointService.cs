using angMapAPI.Models;
using Microsoft.Extensions.Options;
using MongoDB.Bson;
using MongoDB.Driver;

namespace angMapAPI.Services
{
    public class PointService
    {
        private readonly IMongoCollection<Point> _pointsColleciton;

        public PointService(IOptions<FeaturesDatabaseSettings> featuresDatabaseSettings)
        {
            var mongoClient = new MongoClient(featuresDatabaseSettings.Value.ConnectionString);
            var mongoDatabase = mongoClient.GetDatabase(featuresDatabaseSettings.Value.DatabaseName);
            _pointsColleciton = mongoDatabase.GetCollection<Point>("");
        }

        public async Task<List<Point>> GetAsync(Guid userDd) =>
            await _pointsColleciton.Find(point =>  point.UserId == userDd).ToListAsync();

        public async Task CreateAsync(Point newPoint) =>
            await _pointsColleciton.InsertOneAsync(newPoint);

        public async Task RemoveAsync(string id) =>
            await _pointsColleciton.DeleteOneAsync(point => point.Id == id);
    }
}
