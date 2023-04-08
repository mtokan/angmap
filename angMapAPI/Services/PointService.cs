using angMapAPI.Models;
using Microsoft.Extensions.Options;
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

            _pointsColleciton = mongoDatabase.GetCollection<Point>(featuresDatabaseSettings.Value.PointsCollectionName);
        }

        public async Task<List<Point>> GetAsync(Guid id) =>
            await _pointsColleciton.Find(point =>  point.UserId == id).ToListAsync();

        public async Task CreateAsync(Point newPoint) =>
            await _pointsColleciton.InsertOneAsync(newPoint);

        public async Task RemoveAsync(string id) =>
            await _pointsColleciton.DeleteOneAsync(x => x.Id == id);
    }
}
