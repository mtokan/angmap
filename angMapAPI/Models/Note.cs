using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace angMapAPI.Models
{
    public class Note
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }
        public Guid UserId { get; set; }
        public Feature? Feature { get; set; }
    }
}
