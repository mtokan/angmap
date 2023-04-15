using angMapAPI.Helpers;
using MongoDB.Bson.Serialization;
using MongoDB.Bson.Serialization.Attributes;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace angMapAPI.Models
{
    public class Feature
    {
        [JsonPropertyName("type")]
        public string Type { get; set; } = "Feature";

        [JsonPropertyName("geometry")]
        public Geometry? Geometry { get; set; }

        [JsonPropertyName("properties")]
        public Properties? Properties { get; set; }
    }

    public class Geometry
    {
        [JsonPropertyName("type")]
        public string? Type { get; set; }

        [BsonSerializer(typeof(CoordinatesSerializer))]
        [JsonPropertyName("coordinates")]
        public JsonElement? Coordinates { get; set; }
    }
    public class Properties
    {
        [JsonPropertyName("title")]
        public string? Title { get; set; }
        [JsonPropertyName("date")]
        public string? Date { get; set; }
        [JsonPropertyName("note")]
        public string? Note { get; set; }
        [JsonPropertyName("id")]
        public string? Id { get; set; }
    }
}
