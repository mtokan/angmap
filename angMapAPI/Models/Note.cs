using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;
using System.Runtime.CompilerServices;
using System.ComponentModel.DataAnnotations;

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
