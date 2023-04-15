using MongoDB.Bson.Serialization.Serializers;
using MongoDB.Bson.Serialization;
using System.Text.Json;

namespace angMapAPI.Helpers
{
    public class CoordinatesSerializer : SerializerBase<JsonElement?>
    {
        public override JsonElement? Deserialize(BsonDeserializationContext context, BsonDeserializationArgs args)
        {
            var json = context.Reader.ReadString();
            return JsonSerializer.Deserialize<JsonElement?>(json);
        }

        public override void Serialize(BsonSerializationContext context, BsonSerializationArgs args, JsonElement? value)
        {
            var data = JsonSerializer.Serialize(value);
            context.Writer.WriteString(data);
        }
    }
}
