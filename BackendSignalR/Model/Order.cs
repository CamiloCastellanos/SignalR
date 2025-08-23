using System.Text.Json.Serialization;

namespace BackendSignalR.Model
{
    public class Order
    {
        public int Id { get; set; }
        public int TableNumber { get; set; }
        public int FoodItemId { get; set; }
        public FoodItem FoodItem { get; set; } = new FoodItem();
        public DateTimeOffset OrderDate { get; set; }
        public OrderState OrderState { get; set; }
    }

    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum OrderState
    {
        Ordered,
        Preparing,
        AwaitingDelivery,
        Completed
    }
}
