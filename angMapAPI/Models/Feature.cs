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
        [JsonPropertyName("coordinates")]
        public List<double>? Coordinates { get; set; }
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
