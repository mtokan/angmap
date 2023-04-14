using System.Text.Json.Serialization;

namespace angMapAPI.Models
{
    public class CreateNoteRequest
    {
        [JsonPropertyName("geometry")]
        public Geometry? Geometry { get; set; }

        [JsonPropertyName("title")]
        public string? Title { get; set; }

        [JsonPropertyName("date")]
        public string? Date { get; set; }

        [JsonPropertyName("note")]
        public string? Note { get; set; }

    }
}
